-- ============================================================================
-- Trade / Marketplace Feature — standalone migration
-- ============================================================================
--
-- WHAT THIS DOES
-- Adds the schema needed for the new player-to-player item marketplace
-- ("Trade" panel): a player's own active listings, the full server market
-- listing, and a per-player sell-record/history.
--
-- This script is idempotent / safe to re-run against an already-migrated
-- database, and safe to run against either:
--   (a) a fresh DB created from MYH5/环境/sql/myh5_s1.sql (which already has
--       the final `game_auction` shape and the `game_trade_record` table —
--       in that case every step below is a harmless no-op), or
--   (b) an EXISTING production `game_auction` table using the OLD shape
--       (id, playerId, price, startTime, endTime, item) — in that case this
--       script ALTERs it in place, adding the new columns and indexes
--       without dropping any existing rows.
--
-- WHAT CHANGES
--   1. `game_auction`: adds `sellerName` (varchar64), `itemId` (varchar64),
--      `count` (int, default 1), `status` (tinyint, default 0 = active;
--      1 = sold, 2 = cancelled, 3 = expired) if not already present, and
--      relaxes `item` to be nullable (existing complex-item listings keep
--      using the blob; new simple-stack listings only need itemId/count).
--      Adds indexes `idx_auction_playerId` and `idx_auction_status_endTime`
--      if missing.
--   2. `game_trade_record`: created if missing — one row per completed
--      trade, used to answer "my sell record" queries.
--
-- WHICH DATABASES TO RUN THIS AGAINST
-- Apply this ONE script, unmodified, to ALL FOUR game databases:
--
--   mysql -u root -p123456 myh5_s1    < trade_migration.sql
--   mysql -u root -p123456 myh5_s2    < trade_migration.sql
--   mysql -u root -p123456 myh5_s3    < trade_migration.sql
--   mysql -u root -p123456 myh5_kuafu < trade_migration.sql
--
-- DEFAULTS CHOSEN (no separate config exists for these — documented here)
--   - Listing duration: 7 days from `startTime` (enforced server-side in
--     TradeMgr when creating a listing; `endTime` is just a timestamp, not
--     a DB-level constraint).
--   - No tax/fee on sale — the full `price` is credited to the seller.
--   - Market listing query caps results at 50 rows per request
--     (server-side LIMIT, see TradeDao.getMarketList()).
--
-- DEPLOYMENT ORDERING
-- This SQL and the patched server.jar (which adds the new C2G_Trade_*/
-- G2C_Trade_* message handlers backed by this schema) should be deployed
-- together in the same maintenance window:
--   1. Stop the affected server(s).
--   2. Back up the database.
--   3. Run this script.
--   4. Deploy the patched server.jar.
--   5. Start the server(s).
-- Running this script alone (without the new server.jar) is harmless — it
-- only adds columns/tables that old code does not reference. Running the
-- new server.jar WITHOUT this script first will make any Trade feature
-- request fail (missing columns), but does not affect any other feature.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Step 1: game_auction — add new columns if missing.
-- ----------------------------------------------------------------------------
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'game_auction' AND column_name = 'sellerName'
);
SET @ddl = IF(@col_exists = 0,
  'ALTER TABLE `game_auction` ADD COLUMN `sellerName` varchar(64) NOT NULL DEFAULT \'\' AFTER `playerId`',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'game_auction' AND column_name = 'itemId'
);
SET @ddl = IF(@col_exists = 0,
  'ALTER TABLE `game_auction` ADD COLUMN `itemId` varchar(64) NOT NULL DEFAULT \'\' AFTER `sellerName`',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'game_auction' AND column_name = 'count'
);
SET @ddl = IF(@col_exists = 0,
  'ALTER TABLE `game_auction` ADD COLUMN `count` int(11) NOT NULL DEFAULT \'1\' AFTER `itemId`',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'game_auction' AND column_name = 'status'
);
SET @ddl = IF(@col_exists = 0,
  'ALTER TABLE `game_auction` ADD COLUMN `status` tinyint(4) NOT NULL DEFAULT \'0\' AFTER `price`',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- relax `item` to nullable (new simple-stack listings may not populate it)
SET @col_notnull = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'game_auction' AND column_name = 'item' AND is_nullable = 'NO'
);
SET @ddl = IF(@col_notnull > 0,
  'ALTER TABLE `game_auction` MODIFY COLUMN `item` mediumblob NULL',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- indexes
SET @idx_exists = (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'game_auction' AND index_name = 'idx_auction_playerId'
);
SET @ddl = IF(@idx_exists = 0,
  'ALTER TABLE `game_auction` ADD INDEX `idx_auction_playerId` (`playerId`)',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'game_auction' AND index_name = 'idx_auction_status_endTime'
);
SET @ddl = IF(@idx_exists = 0,
  'ALTER TABLE `game_auction` ADD INDEX `idx_auction_status_endTime` (`status`,`endTime`)',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ----------------------------------------------------------------------------
-- Step 2: game_trade_record — create if missing.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `game_trade_record` (
  `id` varchar(36) NOT NULL,
  `orderId` varchar(36) NOT NULL,
  `buyPlayerId` varchar(36) NOT NULL,
  `buyPlayerName` varchar(64) NOT NULL DEFAULT '',
  `sellPlayerId` varchar(36) NOT NULL,
  `sellPlayerName` varchar(64) NOT NULL DEFAULT '',
  `itemId` varchar(64) NOT NULL DEFAULT '',
  `count` int(11) NOT NULL DEFAULT '1',
  `price` int(11) NOT NULL,
  `buyTime` bigint(64) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_traderecord_sellPlayerId` (`sellPlayerId`),
  KEY `idx_traderecord_buyPlayerId` (`buyPlayerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;
