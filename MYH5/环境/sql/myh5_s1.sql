/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50553
Source Host           : :3306
Source Database       : myh5_s1

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2020-03-16 03:24:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blacklist
-- ----------------------------
DROP TABLE IF EXISTS `blacklist`;
CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerId` varchar(36) NOT NULL COMMENT '角色ID',
  `identityId` varchar(36) NOT NULL COMMENT '账号ID',
  `identityName` varchar(36) NOT NULL COMMENT '账号名',
  `name` varchar(36) NOT NULL COMMENT '角色名',
  `blockTime` date NOT NULL COMMENT '屏蔽时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of blacklist
-- ----------------------------

-- ----------------------------
-- Table structure for cfg_server
-- ----------------------------
DROP TABLE IF EXISTS `cfg_server`;
CREATE TABLE `cfg_server` (
  `id` int(11) NOT NULL,
  `openTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=FIXED;

-- ----------------------------
-- Records of cfg_server
-- ----------------------------
INSERT INTO `cfg_server` VALUES ('7', '2020-03-15 12:00:00');

-- ----------------------------
-- Table structure for game_auction
-- ----------------------------
DROP TABLE IF EXISTS `game_auction`;
CREATE TABLE `game_auction` (
  `id` varchar(36) NOT NULL COMMENT '拍卖物id',
  `playerId` varchar(36) NOT NULL COMMENT '玩家playerId',
  `price` int(11) NOT NULL COMMENT '价格',
  `startTime` bigint(64) NOT NULL COMMENT '开始时间',
  `endTime` bigint(64) NOT NULL COMMENT '结束时间',
  `item` mediumblob NOT NULL COMMENT '拍卖物',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_auction
-- ----------------------------

-- ----------------------------
-- Table structure for game_chatfriend
-- ----------------------------
DROP TABLE IF EXISTS `game_chatfriend`;
CREATE TABLE `game_chatfriend` (
  `id` varchar(36) NOT NULL COMMENT '玩家id',
  `tempFriend` mediumblob COMMENT '临时好友',
  `friend` mediumblob COMMENT '好友',
  `black` mediumblob COMMENT '黑名单',
  `enmey` mediumblob COMMENT '仇人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_chatfriend
-- ----------------------------

-- ----------------------------
-- Table structure for game_funstep
-- ----------------------------
DROP TABLE IF EXISTS `game_funstep`;
CREATE TABLE `game_funstep` (
  `playerId` varchar(36) NOT NULL COMMENT '玩家Id',
  `funstep` mediumblob COMMENT '玩家新手记录',
  PRIMARY KEY (`playerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_funstep
-- ----------------------------

-- ----------------------------
-- Table structure for game_giftcode
-- ----------------------------
DROP TABLE IF EXISTS `game_giftcode`;
CREATE TABLE `game_giftcode` (
  `name` varchar(12) NOT NULL DEFAULT '' COMMENT '角色名',
  `keyCode` varchar(12) NOT NULL DEFAULT '' COMMENT '礼包码',
  `groupId` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`name`,`keyCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_giftcode
-- ----------------------------

-- ----------------------------
-- Table structure for game_instance
-- ----------------------------
DROP TABLE IF EXISTS `game_instance`;
CREATE TABLE `game_instance` (
  `id` varchar(36) NOT NULL COMMENT '角色ID(uuid)',
  `identityId` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '账号ID',
  `refId` varchar(36) NOT NULL COMMENT '副本RefId',
  `data` blob COMMENT '玩家副本数据',
  PRIMARY KEY (`id`,`refId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of game_instance
-- ----------------------------

-- ----------------------------
-- Table structure for game_ladder
-- ----------------------------
DROP TABLE IF EXISTS `game_ladder`;
CREATE TABLE `game_ladder` (
  `id` varchar(36) NOT NULL COMMENT '天梯成员ID（UUID）',
  `memberData` mediumblob COMMENT '成员信息',
  `isDelete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_ladder
-- ----------------------------

-- ----------------------------
-- Table structure for game_minisys
-- ----------------------------
DROP TABLE IF EXISTS `game_minisys`;
CREATE TABLE `game_minisys` (
  `sysname` varchar(64) NOT NULL,
  `data` mediumblob,
  PRIMARY KEY (`sysname`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_minisys
-- ----------------------------
INSERT INTO `game_minisys` VALUES ('CopyRevel', 0x000027100000000000000000000000000100000000);
INSERT INTO `game_minisys` VALUES ('GodBoxRank', 0x000027100000000000000000000000000100000000);
INSERT INTO `game_minisys` VALUES ('HeFu_2', 0x000000020000000C00004E880000277600004EE9000161E9000075F9000027DE000028A200015FF500004E89000027DC000027DD00004E8A);
INSERT INTO `game_minisys` VALUES ('HolidayScoreRank', 0x000027100000016A884085FA00000165B4C2F40000000165C43607FF0000000000);
INSERT INTO `game_minisys` VALUES ('SceneActivity401', 0x00002710000000000000000000000000000000000000000000000000);
INSERT INTO `game_minisys` VALUES ('SecrectZhuanPan', 0x000027100000000000000000000000000100000000);
INSERT INTO `game_minisys` VALUES ('TarotRank', 0x000027100000000000000000000000000100000000);

-- ----------------------------
-- Table structure for game_oldplayer
-- ----------------------------
DROP TABLE IF EXISTS `game_oldplayer`;
CREATE TABLE `game_oldplayer` (
  `identityId` varchar(60) DEFAULT NULL COMMENT '玩家id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_oldplayer
-- ----------------------------

-- ----------------------------
-- Table structure for game_resdownload
-- ----------------------------
DROP TABLE IF EXISTS `game_resdownload`;
CREATE TABLE `game_resdownload` (
  `identityId` varchar(60) NOT NULL COMMENT '玩家identityId',
  `resDownload` mediumblob COMMENT '分包下载',
  PRIMARY KEY (`identityId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_resdownload
-- ----------------------------

-- ----------------------------
-- Table structure for game_sortboarddata
-- ----------------------------
DROP TABLE IF EXISTS `game_sortboarddata`;
CREATE TABLE `game_sortboarddata` (
  `id` int(8) NOT NULL COMMENT '排行榜ID',
  `sortboardData` mediumblob COMMENT '排行榜数据',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_sortboarddata
-- ----------------------------
INSERT INTO `game_sortboarddata` VALUES ('101', 0x000027100000006500000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030001DDE30001DDE3);
INSERT INTO `game_sortboarddata` VALUES ('102', 0x000027100000006600000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000006100000061);
INSERT INTO `game_sortboarddata` VALUES ('103', 0x000027100000006700000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('104', 0x000027100000006800000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('105', 0x000027100000006900000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000D6380000D638);
INSERT INTO `game_sortboarddata` VALUES ('106', 0x000027100000006A0000000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('107', 0x000027100000006B0000000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('108', 0x000027100000006C00000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030001DDE30001DDE3);
INSERT INTO `game_sortboarddata` VALUES ('109', 0x000027100000006D00000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('110', 0x000027100000006E00000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('111', 0x000027100000006F00000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('112', 0x000027100000007000000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('113', 0x000027100000007100000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3101', 0x0000271000000C1D0100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3102', 0x0000271000000C1E0100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3103', 0x0000271000000C1F0100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3104', 0x0000271000000C200100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3105', 0x0000271000000C210100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3106', 0x0000271000000C220100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3107', 0x0000271000000C230100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3108', 0x0000271000000C240100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3109', 0x0000271000000C250100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3110', 0x0000271000000C260100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3111', 0x0000271000000C270100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3112', 0x0000271000000C280100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3113', 0x0000271000000C290100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('3114', 0x0000271000000C2A0100000000000000000000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('4101', 0x000027100000100500000000000000000000000000000000010000003E00002711002464633533666633392D356330342D346266392D393232342D3861373161366162653736390006E5ADA4E58D95000000030000000000000000);
INSERT INTO `game_sortboarddata` VALUES ('4102', 0x00002710000010060000000000000000000000000000000000);

-- ----------------------------
-- Table structure for game_storelimit
-- ----------------------------
DROP TABLE IF EXISTS `game_storelimit`;
CREATE TABLE `game_storelimit` (
  `id` int(8) NOT NULL COMMENT 'id',
  `saveTime` mediumtext COMMENT '存储时间',
  `allLimitData` mediumblob COMMENT '全服限购',
  `personalLimitData` mediumblob COMMENT '全服限购',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_storelimit
-- ----------------------------

-- ----------------------------
-- Table structure for game_tarot
-- ----------------------------
DROP TABLE IF EXISTS `game_tarot`;
CREATE TABLE `game_tarot` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `palyerName` varchar(50) DEFAULT NULL COMMENT '玩家名称',
  `itemName` varchar(100) DEFAULT NULL COMMENT '获取物品名称',
  `gainTime` varchar(50) DEFAULT NULL COMMENT '获得物品时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_tarot
-- ----------------------------

-- ----------------------------
-- Table structure for game_union
-- ----------------------------
DROP TABLE IF EXISTS `game_union`;
CREATE TABLE `game_union` (
  `id` varchar(36) NOT NULL COMMENT '公会id',
  `unionData` mediumblob NOT NULL COMMENT '公会数据',
  `memberData` mediumblob NOT NULL COMMENT '公会成员数据',
  `applyData` mediumblob NOT NULL COMMENT '申请列表数据',
  `totemData` mediumblob COMMENT '图腾',
  `systemData` mediumblob COMMENT '公会系统动态聊天数据',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of game_union
-- ----------------------------

-- ----------------------------
-- Table structure for gmmail
-- ----------------------------
DROP TABLE IF EXISTS `gmmail`;
CREATE TABLE `gmmail` (
  `mailId` varchar(36) COLLATE utf8_bin NOT NULL DEFAULT '',
  `title` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  `content` varchar(1024) COLLATE utf8_bin DEFAULT NULL,
  `gold` int(4) DEFAULT NULL COMMENT '元宝',
  `coin` int(4) DEFAULT NULL,
  `item` varchar(1024) COLLATE utf8_bin DEFAULT NULL,
  `time` bigint(64) DEFAULT NULL,
  `minlevel` int(4) DEFAULT NULL,
  `maxlevel` int(4) DEFAULT NULL,
  `begintime` bigint(64) DEFAULT NULL,
  `endtime` bigint(64) DEFAULT NULL,
  `bindGold` int(4) DEFAULT NULL,
  PRIMARY KEY (`mailId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of gmmail
-- ----------------------------

-- ----------------------------
-- Table structure for mail
-- ----------------------------
DROP TABLE IF EXISTS `mail`;
CREATE TABLE `mail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `playerId` varchar(36) NOT NULL DEFAULT '' COMMENT '接受者id',
  `mailId` varchar(36) NOT NULL DEFAULT '',
  `Content` varchar(1024) DEFAULT NULL COMMENT '邮件内容',
  `gold` int(4) DEFAULT NULL COMMENT '元宝',
  `coin` int(4) DEFAULT NULL COMMENT '铜钱',
  `item` varchar(1024) DEFAULT NULL COMMENT '物品',
  `isRead` tinyint(1) DEFAULT NULL COMMENT '是否已读',
  `relateMailId` varchar(36) DEFAULT NULL,
  `time` bigint(64) DEFAULT NULL COMMENT '发送时间',
  `mailType` tinyint(4) DEFAULT NULL COMMENT '邮件类型',
  `bindGold` int(4) DEFAULT NULL COMMENT '绑定元宝',
  `title` varchar(32) DEFAULT NULL,
  `itemIns` mediumblob,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mail_playerID` (`playerId`) USING BTREE,
  KEY `mail_mailId` (`mailId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of mail
-- ----------------------------

-- ----------------------------
-- Table structure for monitor
-- ----------------------------
DROP TABLE IF EXISTS `monitor`;
CREATE TABLE `monitor` (
  `playerId` varchar(36) NOT NULL,
  `data` mediumblob COMMENT '玩家发送过来的消息字节流',
  PRIMARY KEY (`playerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of monitor
-- ----------------------------

-- ----------------------------
-- Table structure for no_delay_player
-- ----------------------------
DROP TABLE IF EXISTS `no_delay_player`;
CREATE TABLE `no_delay_player` (
  `id` varchar(36) NOT NULL COMMENT '角色ID(uuid)',
  `identityId` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '账号ID',
  `identityName` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '账号名',
  `name` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '昵称',
  `achievementData` mediumblob COMMENT '成就',
  `states` blob COMMENT '状态（封号，禁言）',
  `vipData` blob COMMENT 'VIP',
  `activityData` mediumblob COMMENT '活动(签到，在线计时)',
  `commonActivityData` mediumblob COMMENT '日常活动',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Records of no_delay_player
-- ----------------------------

-- ----------------------------
-- Table structure for offline_ai
-- ----------------------------
DROP TABLE IF EXISTS `offline_ai`;
CREATE TABLE `offline_ai` (
  `playerid` varchar(36) NOT NULL COMMENT '角色ID(uuid)',
  `dbData` mediumblob COMMENT '离线数据',
  PRIMARY KEY (`playerid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of offline_ai
-- ----------------------------

-- ----------------------------
-- Table structure for player
-- ----------------------------
DROP TABLE IF EXISTS `player`;
CREATE TABLE `player` (
  `id` varchar(36) NOT NULL COMMENT '角色ID(uuid)',
  `identityId` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '账号ID',
  `identityName` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '账号名称',
  `name` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '角色名称',
  `propertyData` blob NOT NULL COMMENT '角色属性',
  `itemBagData` mediumblob COMMENT '背包',
  `skillData` mediumblob COMMENT '技能',
  `dailyQuestData` mediumblob COMMENT '日常任务',
  `peerageData` mediumblob COMMENT '爵位',
  `qdCode1` int(11) NOT NULL DEFAULT '5' COMMENT '主渠道',
  `qdCode2` int(11) NOT NULL DEFAULT '5' COMMENT '副渠道',
  `birthday` bigint(64) NOT NULL DEFAULT '0',
  `lastLoginTime` bigint(64) NOT NULL DEFAULT '0',
  `lastLogoutTime` bigint(64) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL,
  `depotData` mediumblob,
  `petData` mediumblob COMMENT '宠物模块数据',
  `tarotData` mediumblob COMMENT '活动寻宝塔牌',
  `copyData` mediumblob COMMENT '副本数据',
  `fightsoulData` mediumblob COMMENT '战魂',
  `unionData` mediumblob COMMENT '帮派',
  `storeData` mediumblob COMMENT '商城',
  `mineralData` mediumblob COMMENT '矿洞',
  `shengHunData` mediumblob COMMENT '神魂',
  `godBoxData` mediumblob COMMENT '众神宝藏',
  `equipData` mediumblob,
  `handbookData` mediumblob COMMENT '图鉴',
  `lostTempleData` mediumblob COMMENT '遗迹',
  `wingData` mediumblob COMMENT '翅膀数据',
  `serverId` varchar(60) DEFAULT '0',
  `hefuData` mediumblob COMMENT '合服活动数据',
  `starEquipData` mediumblob COMMENT '星辰装备',
  `friendData` mediumblob COMMENT '好友数据',
  `version` bigint(20) NOT NULL DEFAULT '0' COMMENT '乐观锁版本号(Fix 12: 防止旧存档覆盖新存档)',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_identityId` (`identityId`) USING BTREE,
  KEY `idx_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT KEY_BLOCK_SIZE=16;

-- ----------------------------
-- Migration: Fix 12 optimistic version-lock for `player` table
-- Safe to run against an EXISTING production DB that already has a `player`
-- table without the `version` column (CREATE TABLE above only applies to a
-- fresh DB created from this dump). This ALTER is idempotent-ish: running it
-- twice will error "duplicate column", so guard it in deployment tooling or
-- check information_schema before applying if needed.
-- ----------------------------
-- ALTER TABLE `player` ADD COLUMN `version` bigint(20) NOT NULL DEFAULT '0' COMMENT '乐观锁版本号(Fix 12)';

-- ----------------------------
-- Records of player
-- ----------------------------

-- ----------------------------
-- Procedure structure for newMail
-- ----------------------------
DROP PROCEDURE IF EXISTS `newMail`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `newMail`(IN playerId VARCHAR(256),IN	mailId VARCHAR(256),IN sendername VARCHAR(64),IN title VARCHAR(32),IN Content VARCHAR(1024),IN gold INT(4),IN coin INT(4),IN item  VARCHAR(1024),IN isRead TINYINT(1),IN relateMailId INT(4),IN `TIME` BIGINT(64),IN isDelete TINYINT(1),IN isSystem TINYINT(1))
BEGIN
	INSERT INTO mail VALUES(playerId, mailId ,sendername, title  ,Content, gold ,coin, item ,isRead, relateMailId, `TIME`, isDelete, isSystem);
    END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for newNoDelayPlayer
-- ----------------------------
DROP PROCEDURE IF EXISTS `newNoDelayPlayer`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `newNoDelayPlayer`(IN id VARCHAR(36), IN identityId VARCHAR(60), IN identityName VARCHAR(60),IN `name` VARCHAR(60), IN achievementData MEDIUMBLOB, IN states BLOB, IN vipData BLOB, IN activityData MEDIUMBLOB, IN commonActivityData MEDIUMBLOB)
BEGIN
	INSERT INTO no_delay_player VALUES(id, identityId, identityName,`name`, achievementData,states,vipData, activityData, commonActivityData);
    END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for newOffline_ai
-- ----------------------------
DROP PROCEDURE IF EXISTS `newOffline_ai`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `newOffline_ai`(IN playerid VARCHAR(36), IN dbData MEDIUMBLOB)
BEGIN
	INSERT INTO offline_ai VALUES(playerid,dbData);
    END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for newPlayer
-- ----------------------------
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

-- ----------------------------
-- Procedure structure for offline_ai
-- ----------------------------
DROP PROCEDURE IF EXISTS `offline_ai`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `offline_ai`(IN playerid VARCHAR(36), IN dbData MEDIUMBLOB)
BEGIN
	UPDATE offline_ai SET dbData = dbData WHERE offline_ai.playerid = `playerid`;
    END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for showall
-- ----------------------------
DROP PROCEDURE IF EXISTS `showall`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `showall`()
BEGIN
	select * from player;
    END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for updateNoDelayPlayer
-- ----------------------------
DROP PROCEDURE IF EXISTS `updateNoDelayPlayer`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateNoDelayPlayer`(IN `id` VARCHAR(36), IN identityId VARCHAR(60), IN identityName VARCHAR(60),IN `name` VARCHAR(60),  IN achievementData MEDIUMBLOB, IN states BLOB,IN vipData BLOB,IN activityData MEDIUMBLOB, IN commonActivityData MEDIUMBLOB)
BEGIN
	DECLARE number INT DEFAULT 0;
	SELECT COUNT(*) INTO number FROM no_delay_player WHERE no_delay_player.id = `id` LIMIT 1;
	IF number = 0 THEN
		INSERT INTO no_delay_player VALUES(id,identityId,identityName,`name`, achievementData,states,vipData, activityData, commonActivityData);	
	ELSE
		UPDATE no_delay_player SET  achievementData = achievementData,states = states,vipData = vipData , activityData = activityData , commonActivityData = commonActivityData WHERE no_delay_player.id = `id`;
	END IF;
    END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for updateOffline_ai
-- ----------------------------
DROP PROCEDURE IF EXISTS `updateOffline_ai`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateOffline_ai`(IN dbData MEDIUMBLOB,IN playerid VARCHAR(36))
BEGIN
	UPDATE offline_ai SET  dbData = dbData WHERE offline_ai.playerid = playerid;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for updatePlayer
-- ----------------------------
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
