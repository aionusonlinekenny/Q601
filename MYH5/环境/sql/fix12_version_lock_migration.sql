-- ============================================================================
-- Fix 12: Optimistic Version-Lock for Player Save — standalone migration
-- ============================================================================
--
-- WHAT THIS FIXES
-- A player's level rolled back (e.g. 90 -> 87) after quick reconnects, because
-- a stale, already-queued periodic save could land in the DB AFTER a newer
-- save from a fresh session, silently overwriting newer progress. This script
-- adds a `version` column to `player` plus a version check in `updatePlayer`
-- so a stale UPDATE can never overwrite a row that has already moved on.
-- Full root-cause writeup: MYH5/CLAUDE.md, "Fix 12".
--
-- WHAT THIS SCRIPT DOES (idempotent / safe to re-run)
--   1. Adds `player.version BIGINT NOT NULL DEFAULT 0` if it does not already
--      exist (checked via information_schema, so re-running this script is a
--      harmless no-op for the column).
--   2. Replaces `newPlayer` with a version that inserts `version = 0` for new
--      rows.
--   3. Replaces `updatePlayer` with a version that takes two new parameters,
--      `IN expectedVersion BIGINT` and `OUT affectedRows INT`, bumps
--      `version = version + 1` on every successful update, and only applies
--      the UPDATE `WHERE player.version = expectedVersion` — so a save built
--      against an old version number affects 0 rows instead of clobbering
--      newer data. `DROP PROCEDURE IF EXISTS` makes steps 2/3 idempotent.
--
-- NOTE ON SCHEMA COMPATIBILITY: the `player` table column set/order is
-- identical across myh5_s1/s2/s3/kuafu (verified column-by-column against
-- MYH5/环境/sql/myh5_s1.sql and MYH5/my_kuafu/setup_kuafu_db.sql — both list
-- the same 34 columns, in the same order, ending in `version`). This script
-- reuses the myh5_s1.sql `newPlayer`/`updatePlayer` bodies (named-column
-- INSERT, so it's robust to physical column order) rather than kuafu's
-- positional-INSERT style; both are functionally equivalent (kuafu's
-- `skillData`/`depotData` columns are unused/NULL in both variants), so it is
-- safe to apply this single script to all four databases.
--
-- WHICH DATABASES TO RUN THIS AGAINST
-- This ONE script must be applied, unmodified, to ALL FOUR game databases —
-- there is only one player-table schema shared by the 3 main servers plus
-- kuafu, each living in its own physical DB on the same MySQL instance
-- (see MYH5/my_s{1,2,3}/data/morningGlory_data.xml and
-- MYH5/my_kuafu/data/morningGlory_data.xml for the connection strings):
--
--   mysql -u root -p123456 myh5_s1    < fix12_version_lock_migration.sql
--   mysql -u root -p123456 myh5_s2    < fix12_version_lock_migration.sql
--   mysql -u root -p123456 myh5_s3    < fix12_version_lock_migration.sql
--   mysql -u root -p123456 myh5_kuafu < fix12_version_lock_migration.sql
--
-- CRITICAL DEPLOYMENT ORDERING — READ BEFORE RUNNING
-- This SQL and the patched server.jar (which sends 33 parameters to
-- `updatePlayer` instead of the old 31) MUST be deployed together, in the
-- SAME maintenance window, never independently:
--
--   - OLD server.jar + NEW SQL  => every player save fails immediately with
--     "Incorrect number of arguments for PROCEDURE updatePlayer; expected 33,
--     got 31" (or 31 vs 29 before this fix existed) — the JDBC CallableStatement
--     built from the old 31-`?` SQL string cannot call a 33-parameter procedure.
--   - NEW server.jar + OLD SQL  => same failure in the other direction; the new
--     33-`?` CallableStatement cannot call the old 31-parameter procedure.
--
-- Correct order:
--   1. Stop all 4 servers (s1, s2, s3, kuafu).
--   2. Back up all 4 databases.
--   3. Run this script against all 4 databases (commands above).
--   4. Copy the patched server.jar into all 4 server directories
--      (MYH5/my_s1, MYH5/my_s2, MYH5/my_s3, MYH5/my_kuafu).
--   5. Start all 4 servers.
--
-- See MYH5/CLAUDE.md, Fix 12 "Deployment Note", for the full procedure.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Step 1: add `player.version` column if it doesn't already exist.
-- ----------------------------------------------------------------------------
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'player'
    AND column_name = 'version'
);

SET @ddl = IF(
  @col_exists = 0,
  'ALTER TABLE `player` ADD COLUMN `version` bigint(20) NOT NULL DEFAULT \'0\' COMMENT \'乐观锁版本号(Fix 12: 防止旧存档覆盖新存档)\'',
  'SELECT 1'
);

PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ----------------------------------------------------------------------------
-- Step 2: replace `newPlayer` — inserts version = 0 for new rows.
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `newPlayer`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `newPlayer`(IN id VARCHAR(36), IN identityId VARCHAR(60), IN identityName VARCHAR(60), IN `name` VARCHAR(60),
IN qdCode1 INT(11),IN qdCode2 INT(11),IN birthday BIGINT,IN lastLoginTime BIGINT,IN lastLogoutTime BIGINT,IN `level` INT(11) ,IN propertyData BLOB,
IN itemBagData MEDIUMBLOB, IN dailyQuestData MEDIUMBLOB, IN peerageData MEDIUMBLOB, IN petData MEDIUMBLOB, IN tarotData MEDIUMBLOB, IN copyData MEDIUMBLOB,
IN fightsoulData MEDIUMBLOB, IN unionData MEDIUMBLOB, IN storeData MEDIUMBLOB, IN mineralData MEDIUMBLOB, IN shengHunData MEDIUMBLOB, IN godBoxData MEDIUMBLOB,
IN equipData MEDIUMBLOB, IN handbookData MEDIUMBLOB, IN lostTempleData MEDIUMBLOB, IN wingData MEDIUMBLOB, IN serverId VARCHAR(60), IN hefuData MEDIUMBLOB,
IN starEquipData MEDIUMBLOB, IN friendData MEDIUMBLOB)
BEGIN
	INSERT INTO player(id,identityId, identityName, `name`, propertyData, itemBagData, dailyQuestData, peerageData, qdCode1, qdCode2, birthday, lastLoginTime,
lastLogoutTime, `level`, petData, tarotData, copyData, fightsoulData,unionData,storeData,mineralData,shengHunData, godBoxData, equipData, handbookData,
 lostTempleData, wingData, serverId, hefuData, starEquipData, friendData, `version`) VALUES(id,identityId, identityName, `name`, propertyData, itemBagData, dailyQuestData,
 peerageData, qdCode1, qdCode2, birthday, lastLoginTime, lastLogoutTime,`level`, petData, tarotData, copyData, fightsoulData,unionData,storeData,mineralData,
shengHunData, godBoxData, equipData, handbookData, lostTempleData, wingData, serverId, hefuData, starEquipData, friendData, 0);
    END
;;
DELIMITER ;

-- ----------------------------------------------------------------------------
-- Step 3: replace `updatePlayer` — adds expectedVersion (IN) / affectedRows
-- (OUT), bumps version on every successful write, and the WHERE clause only
-- matches the row if its version still matches what the caller expected.
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `updatePlayer`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updatePlayer`(IN `id` VARCHAR(36), IN identityId VARCHAR(60), IN identityName VARCHAR(60), IN `name` VARCHAR(60),
IN qdCode1 INT(11),IN qdCode2 INT(11),IN birthday BIGINT,IN lastLoginTime BIGINT,IN lastLogoutTime BIGINT,IN `level` INT(11) , IN propertyData BLOB, IN itemBagData MEDIUMBLOB,
IN dailyQuestData MEDIUMBLOB, IN peerageData MEDIUMBLOB, IN petData MEDIUMBLOB, IN tarotData MEDIUMBLOB, IN copyData MEDIUMBLOB, IN fightsoulData MEDIUMBLOB, IN unionData MEDIUMBLOB,
IN storeData MEDIUMBLOB, IN mineralData MEDIUMBLOB, IN shengHunData MEDIUMBLOB, IN godBoxData MEDIUMBLOB, IN equipData MEDIUMBLOB, IN handbookData MEDIUMBLOB,
IN lostTempleData MEDIUMBLOB, IN wingData MEDIUMBLOB, IN serverId VARCHAR(60), IN hefuData MEDIUMBLOB, IN starEquipData MEDIUMBLOB, IN friendData MEDIUMBLOB,
IN expectedVersion BIGINT, OUT affectedRows INT)
BEGIN
	UPDATE player SET propertyData = propertyData, itemBagData = itemBagData, dailyQuestData = dailyQuestData, peerageData = peerageData, qdCode1 = qdCode1,
qdCode2 = qdCode2, birthday = birthday, lastLoginTime = lastLoginTime, lastLogoutTime = lastLogoutTime, `level`=`level`, petData = petData, tarotData = tarotData,
copyData = copyData, fightsoulData = fightsoulData,unionData = unionData,storeData = storeData, mineralData = mineralData, shengHunData = shengHunData,
godBoxData = godBoxData, equipData = equipData, handbookData = handbookData, lostTempleData = lostTempleData, wingData = wingData, serverId = serverId,
hefuData = hefuData, starEquipData = starEquipData, friendData = friendData, `version` = `version` + 1
WHERE player.id = `id` AND player.`version` = expectedVersion;
	SET affectedRows = ROW_COUNT();
    END
;;
DELIMITER ;
