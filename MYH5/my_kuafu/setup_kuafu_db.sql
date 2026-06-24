-- Setup script for myh5_kuafu database
-- Run this once: mysql -u root -p123456 < setup_kuafu_db.sql

CREATE DATABASE IF NOT EXISTS `myh5_kuafu` DEFAULT CHARACTER SET utf8;
USE `myh5_kuafu`;

-- Clone the full schema from myh5_s1
-- Player table
CREATE TABLE IF NOT EXISTS `player` (
  `id` varchar(36) NOT NULL,
  `identityId` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `identityName` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `propertyData` blob NOT NULL,
  `itemBagData` mediumblob,
  `skillData` mediumblob,
  `dailyQuestData` mediumblob,
  `peerageData` mediumblob,
  `qdCode1` int(11) NOT NULL DEFAULT '5',
  `qdCode2` int(11) NOT NULL DEFAULT '5',
  `birthday` bigint(64) NOT NULL DEFAULT '0',
  `lastLoginTime` bigint(64) NOT NULL DEFAULT '0',
  `lastLogoutTime` bigint(64) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL,
  `depotData` mediumblob,
  `petData` mediumblob,
  `tarotData` mediumblob,
  `copyData` mediumblob,
  `fightsoulData` mediumblob,
  `unionData` mediumblob,
  `storeData` mediumblob,
  `mineralData` mediumblob,
  `shengHunData` mediumblob,
  `godBoxData` mediumblob,
  `equipData` mediumblob,
  `handbookData` mediumblob,
  `lostTempleData` mediumblob,
  `wingData` mediumblob,
  `serverId` varchar(60) DEFAULT '0',
  `hefuData` mediumblob,
  `starEquipData` mediumblob,
  `friendData` mediumblob,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_identityId` (`identityId`) USING BTREE,
  KEY `idx_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- No-delay player table (for achievements, states, vip, activity)
CREATE TABLE IF NOT EXISTS `no_delay_player` (
  `id` varchar(36) NOT NULL,
  `identityId` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `identityName` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `achievementData` mediumblob,
  `states` blob,
  `vipData` blob,
  `activityData` mediumblob,
  `commonActivityData` mediumblob,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- Mail table
CREATE TABLE IF NOT EXISTS `mail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerId` varchar(256) NOT NULL,
  `mailId` varchar(256) NOT NULL,
  `senderName` varchar(64) DEFAULT NULL,
  `title` varchar(32) DEFAULT NULL,
  `Content` varchar(1024) DEFAULT NULL,
  `gold` int(4) DEFAULT '0',
  `coin` int(4) DEFAULT '0',
  `bindGold` int(4) DEFAULT '0',
  `item` varchar(1024) DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `relateMailId` int(4) DEFAULT '0',
  `time` bigint(64) DEFAULT NULL,
  `isDelete` tinyint(1) DEFAULT '0',
  `isSystem` tinyint(1) DEFAULT '0',
  `mailType` int(4) DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- Config server table
CREATE TABLE IF NOT EXISTS `cfg_server` (
  `id` int(11) NOT NULL,
  `openTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=FIXED;
INSERT IGNORE INTO `cfg_server` VALUES ('99', '2020-03-15 12:00:00');

-- Other required tables (empty)
CREATE TABLE IF NOT EXISTS `blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerId` varchar(36) NOT NULL,
  `identityId` varchar(36) NOT NULL,
  `identityName` varchar(36) NOT NULL,
  `name` varchar(36) NOT NULL,
  `blockTime` date NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_auction` (
  `id` varchar(36) NOT NULL,
  `playerId` varchar(36) NOT NULL,
  `price` int(11) NOT NULL,
  `startTime` bigint(64) NOT NULL,
  `endTime` bigint(64) NOT NULL,
  `item` mediumblob NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_chatfriend` (
  `id` varchar(36) NOT NULL,
  `tempFriend` mediumblob,
  `friend` mediumblob,
  `black` mediumblob,
  `enmey` mediumblob,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_funstep` (
  `playerId` varchar(36) NOT NULL,
  `funstep` mediumblob,
  PRIMARY KEY (`playerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_giftcode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) DEFAULT NULL,
  `itemId` varchar(64) DEFAULT NULL,
  `itemCount` int(11) DEFAULT NULL,
  `playerId` varchar(36) DEFAULT NULL,
  `useTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_instance` (
  `id` varchar(36) NOT NULL,
  `data` mediumblob,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_ladder` (
  `playerId` varchar(36) NOT NULL,
  `ladderData` mediumblob,
  PRIMARY KEY (`playerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_minisys` (
  `id` int(11) NOT NULL,
  `data` mediumblob,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_sortboarddata` (
  `id` int(11) NOT NULL,
  `sortData` mediumblob,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_storelimit` (
  `id` int(11) NOT NULL,
  `data` mediumblob,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_tarot` (
  `id` int(11) NOT NULL,
  `poolData` mediumblob,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_union` (
  `unionId` varchar(36) NOT NULL,
  `unionData` mediumblob,
  PRIMARY KEY (`unionId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `gmmail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) DEFAULT NULL,
  `content` varchar(256) DEFAULT NULL,
  `gold` int(4) DEFAULT '0',
  `coin` int(4) DEFAULT '0',
  `item` varchar(256) DEFAULT NULL,
  `time` bigint(64) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `monitor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` mediumblob,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `offline_ai` (
  `playerid` varchar(36) NOT NULL,
  `dbData` mediumblob,
  PRIMARY KEY (`playerid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_oldplayer` (
  `identityId` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

CREATE TABLE IF NOT EXISTS `game_resdownload` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerId` varchar(36) DEFAULT NULL,
  `resVersion` varchar(32) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- Stored procedures

DELIMITER ;;

DROP PROCEDURE IF EXISTS `newPlayer`;;
CREATE PROCEDURE `newPlayer`(IN id VARCHAR(36), IN identityId VARCHAR(60), IN identityName VARCHAR(60), IN `name` VARCHAR(60),
IN qdCode1 INT(11),IN qdCode2 INT(11),IN birthday BIGINT,IN lastLoginTime BIGINT,IN lastLogoutTime BIGINT,IN `level` INT(11) ,IN propertyData BLOB,
IN itemBagData MEDIUMBLOB, IN dailyQuestData MEDIUMBLOB, IN peerageData MEDIUMBLOB, IN petData MEDIUMBLOB, IN tarotData MEDIUMBLOB, IN copyData MEDIUMBLOB,
IN fightsoulData MEDIUMBLOB, IN unionData MEDIUMBLOB, IN storeData MEDIUMBLOB, IN mineralData MEDIUMBLOB, IN shengHunData MEDIUMBLOB, IN godBoxData MEDIUMBLOB,
IN equipData MEDIUMBLOB, IN handbookData MEDIUMBLOB, IN lostTempleData MEDIUMBLOB, IN wingData MEDIUMBLOB, IN serverId VARCHAR(60), IN hefuData MEDIUMBLOB,
IN starEquipData MEDIUMBLOB, IN friendData MEDIUMBLOB)
BEGIN
    INSERT INTO player VALUES(id, identityId, identityName, `name`, propertyData, itemBagData, NULL, dailyQuestData, peerageData, qdCode1, qdCode2,
    birthday, lastLoginTime, lastLogoutTime, `level`, NULL, petData, tarotData, copyData, fightsoulData, unionData, storeData, mineralData, shengHunData,
    godBoxData, equipData, handbookData, lostTempleData, wingData, serverId, hefuData, starEquipData, friendData);
END;;

DROP PROCEDURE IF EXISTS `updatePlayer`;;
CREATE PROCEDURE `updatePlayer`(IN `id` VARCHAR(36), IN identityId VARCHAR(60), IN identityName VARCHAR(60), IN `name` VARCHAR(60),
IN qdCode1 INT(11),IN qdCode2 INT(11),IN birthday BIGINT,IN lastLoginTime BIGINT,IN lastLogoutTime BIGINT,IN `level` INT(11) , IN propertyData BLOB, IN itemBagData MEDIUMBLOB,
IN dailyQuestData MEDIUMBLOB, IN peerageData MEDIUMBLOB, IN petData MEDIUMBLOB, IN tarotData MEDIUMBLOB, IN copyData MEDIUMBLOB, IN fightsoulData MEDIUMBLOB, IN unionData MEDIUMBLOB,
IN storeData MEDIUMBLOB, IN mineralData MEDIUMBLOB, IN shengHunData MEDIUMBLOB, IN godBoxData MEDIUMBLOB, IN equipData MEDIUMBLOB, IN handbookData MEDIUMBLOB,
IN lostTempleData MEDIUMBLOB, IN wingData MEDIUMBLOB, IN serverId VARCHAR(60), IN hefuData MEDIUMBLOB, IN starEquipData MEDIUMBLOB, IN friendData MEDIUMBLOB)
BEGIN
    UPDATE player SET propertyData = propertyData, itemBagData = itemBagData, dailyQuestData = dailyQuestData, peerageData = peerageData, qdCode1 = qdCode1,
    qdCode2 = qdCode2, birthday = birthday, lastLoginTime = lastLoginTime, lastLogoutTime = lastLogoutTime, `level`=`level`, petData = petData, tarotData = tarotData,
    copyData = copyData, fightsoulData = fightsoulData,unionData = unionData,storeData = storeData, mineralData = mineralData, shengHunData = shengHunData,
    godBoxData = godBoxData, equipData = equipData, handbookData = handbookData, lostTempleData = lostTempleData, wingData = wingData, serverId = serverId,
    hefuData = hefuData, starEquipData = starEquipData, friendData = friendData WHERE player.id = `id`;
END;;

DROP PROCEDURE IF EXISTS `newNoDelayPlayer`;;
CREATE PROCEDURE `newNoDelayPlayer`(IN id VARCHAR(36), IN identityId VARCHAR(60), IN identityName VARCHAR(60),IN `name` VARCHAR(60), IN achievementData MEDIUMBLOB, IN states BLOB, IN vipData BLOB, IN activityData MEDIUMBLOB, IN commonActivityData MEDIUMBLOB)
BEGIN
    INSERT INTO no_delay_player VALUES(id, identityId, identityName, `name`, achievementData, states, vipData, activityData, commonActivityData);
END;;

DROP PROCEDURE IF EXISTS `updateNoDelayPlayer`;;
CREATE PROCEDURE `updateNoDelayPlayer`(IN `id` VARCHAR(36), IN identityId VARCHAR(60), IN identityName VARCHAR(60),IN `name` VARCHAR(60), IN achievementData MEDIUMBLOB, IN states BLOB,IN vipData BLOB,IN activityData MEDIUMBLOB, IN commonActivityData MEDIUMBLOB)
BEGIN
    UPDATE no_delay_player SET achievementData = achievementData, states = states, vipData = vipData, activityData = activityData, commonActivityData = commonActivityData WHERE no_delay_player.id = `id`;
END;;

DROP PROCEDURE IF EXISTS `newMail`;;
CREATE PROCEDURE `newMail`(IN playerId VARCHAR(256),IN mailId VARCHAR(256),IN sendername VARCHAR(64),IN title VARCHAR(32),IN Content VARCHAR(1024),IN gold INT(4),IN coin INT(4),IN item VARCHAR(1024),IN isRead TINYINT(1),IN relateMailId INT(4),IN `TIME` BIGINT(64),IN isDelete TINYINT(1),IN isSystem TINYINT(1))
BEGIN
    INSERT INTO mail (playerId,mailId,senderName,title,Content,gold,coin,item,isRead,relateMailId,`time`,isDelete,isSystem) VALUES(playerId,mailId,sendername,title,Content,gold,coin,item,isRead,relateMailId,`TIME`,isDelete,isSystem);
END;;

DROP PROCEDURE IF EXISTS `newOffline_ai`;;
CREATE PROCEDURE `newOffline_ai`(IN playerid VARCHAR(36), IN dbData MEDIUMBLOB)
BEGIN
    INSERT INTO offline_ai VALUES(playerid, dbData);
END;;

DROP PROCEDURE IF EXISTS `offline_ai`;;
CREATE PROCEDURE `offline_ai`(IN playerid VARCHAR(36), IN dbData MEDIUMBLOB)
BEGIN
    UPDATE offline_ai SET offline_ai.dbData = dbData WHERE offline_ai.playerid = playerid;
END;;

DROP PROCEDURE IF EXISTS `updateOffline_ai`;;
CREATE PROCEDURE `updateOffline_ai`(IN dbData MEDIUMBLOB,IN playerid VARCHAR(36))
BEGIN
    UPDATE offline_ai SET offline_ai.dbData = dbData WHERE offline_ai.playerid = playerid;
END;;

DROP PROCEDURE IF EXISTS `showall`;;
CREATE PROCEDURE `showall`()
BEGIN
    select id, name from player;
END;;

DELIMITER ;

-- Sync procedure: copy player data from source server DB to kuafu DB
-- Called by the game server's KuaFuComponent before redirecting the player
DELIMITER ;;

DROP PROCEDURE IF EXISTS `syncPlayerFromServer`;;
CREATE PROCEDURE `syncPlayerFromServer`(IN p_playerId VARCHAR(36), IN p_sourceDb VARCHAR(60))
BEGIN
    SET @sql_text = CONCAT(
        'REPLACE INTO myh5_kuafu.player SELECT * FROM ', p_sourceDb, '.player WHERE id = ''', p_playerId, ''''
    );
    PREPARE stmt FROM @sql_text;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SET @sql_text2 = CONCAT(
        'REPLACE INTO myh5_kuafu.no_delay_player SELECT * FROM ', p_sourceDb, '.no_delay_player WHERE id = ''', p_playerId, ''''
    );
    PREPARE stmt2 FROM @sql_text2;
    EXECUTE stmt2;
    DEALLOCATE PREPARE stmt2;
END;;

DELIMITER ;
