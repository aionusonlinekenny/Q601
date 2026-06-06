/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50553
Source Host           : :3306
Source Database       : myh5_log

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2020-03-16 03:20:23
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for log_chapter
-- ----------------------------
DROP TABLE IF EXISTS `log_chapter`;
CREATE TABLE `log_chapter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(32) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `rolelevel` int(11) DEFAULT NULL,
  `viplevel` int(11) DEFAULT NULL,
  `totalpower` int(11) DEFAULT NULL,
  `playerpower` int(11) DEFAULT NULL,
  `pet1power` int(11) DEFAULT NULL,
  `pet2power` int(11) DEFAULT NULL,
  `pet3power` int(11) DEFAULT NULL,
  `chapterlevel` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `moshi` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=183 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_chapter
-- ----------------------------

-- ----------------------------
-- Table structure for log_chat
-- ----------------------------
DROP TABLE IF EXISTS `log_chat`;
CREATE TABLE `log_chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `sid` int(11) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `torid` varchar(64) DEFAULT NULL,
  `tologinname` varchar(64) DEFAULT NULL,
  `torolename` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_chat
-- ----------------------------

-- ----------------------------
-- Table structure for log_create_role
-- ----------------------------
DROP TABLE IF EXISTS `log_create_role`;
CREATE TABLE `log_create_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `sex` int(11) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `sid` int(11) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `qudao` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_create_role
-- ----------------------------

-- ----------------------------
-- Table structure for log_gold
-- ----------------------------
DROP TABLE IF EXISTS `log_gold`;
CREATE TABLE `log_gold` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `qudao` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_gold
-- ----------------------------

-- ----------------------------
-- Table structure for log_huanshouta
-- ----------------------------
DROP TABLE IF EXISTS `log_huanshouta`;
CREATE TABLE `log_huanshouta` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `rolelevel` int(11) DEFAULT NULL,
  `viplevel` int(11) DEFAULT NULL,
  `totalpower` int(11) DEFAULT NULL,
  `playerpower` int(11) DEFAULT NULL,
  `pet1power` int(11) DEFAULT NULL,
  `pet2power` int(11) DEFAULT NULL,
  `pet3power` int(11) DEFAULT NULL,
  `chapterlevel` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `moshi` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_huanshouta
-- ----------------------------

-- ----------------------------
-- Table structure for log_item_2019_07
-- ----------------------------
DROP TABLE IF EXISTS `log_item_2019_07`;
CREATE TABLE `log_item_2019_07` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `uid` varchar(100) NOT NULL COMMENT 'uid',
  `loginname` varchar(255) NOT NULL COMMENT '账号名',
  `rolename` varchar(50) NOT NULL COMMENT '角色名',
  `time` int(11) NOT NULL COMMENT 'time',
  `actionid` int(11) NOT NULL COMMENT '行为id',
  `client` int(11) NOT NULL COMMENT '客户端',
  `actiontype` int(11) NOT NULL COMMENT '行为类型：1.获得 2.使用',
  `itemid` int(11) NOT NULL COMMENT '道具id',
  `change` bigint(20) NOT NULL COMMENT '道具数量改变',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_item_2019_07
-- ----------------------------

-- ----------------------------
-- Table structure for log_item_2019_08
-- ----------------------------
DROP TABLE IF EXISTS `log_item_2019_08`;
CREATE TABLE `log_item_2019_08` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `uid` varchar(100) NOT NULL COMMENT 'uid',
  `loginname` varchar(255) NOT NULL COMMENT '账号名',
  `rolename` varchar(50) NOT NULL COMMENT '角色名',
  `time` int(11) NOT NULL COMMENT 'time',
  `actionid` int(11) NOT NULL COMMENT '行为id',
  `client` int(11) NOT NULL COMMENT '客户端',
  `actiontype` int(11) NOT NULL COMMENT '行为类型：1.获得 2.使用',
  `itemid` int(11) NOT NULL COMMENT '道具id',
  `change` bigint(20) NOT NULL COMMENT '道具数量改变',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_item_2019_08
-- ----------------------------

-- ----------------------------
-- Table structure for log_item_2020_03
-- ----------------------------
DROP TABLE IF EXISTS `log_item_2020_03`;
CREATE TABLE `log_item_2020_03` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `uid` varchar(100) NOT NULL COMMENT 'uid',
  `loginname` varchar(255) NOT NULL COMMENT '账号名',
  `rolename` varchar(50) NOT NULL COMMENT '角色名',
  `time` int(11) NOT NULL COMMENT 'time',
  `actionid` int(11) NOT NULL COMMENT '行为id',
  `client` int(11) NOT NULL COMMENT '客户端',
  `actiontype` int(11) NOT NULL COMMENT '行为类型：1.获得 2.使用',
  `itemid` int(11) NOT NULL COMMENT '道具id',
  `change` bigint(20) NOT NULL COMMENT '道具数量改变',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_item_2020_03
-- ----------------------------

-- ----------------------------
-- Table structure for log_login
-- ----------------------------
DROP TABLE IF EXISTS `log_login`;
CREATE TABLE `log_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `sid` int(11) DEFAULT NULL,
  `rolelevel` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `onlinetime` int(11) DEFAULT NULL,
  `qudao` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_login
-- ----------------------------

-- ----------------------------
-- Table structure for log_losttemple
-- ----------------------------
DROP TABLE IF EXISTS `log_losttemple`;
CREATE TABLE `log_losttemple` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `rolelevel` int(11) DEFAULT NULL,
  `viplevel` int(11) DEFAULT NULL,
  `totalpower` int(11) DEFAULT NULL,
  `playerpower` int(11) DEFAULT NULL,
  `pet1power` int(11) DEFAULT NULL,
  `pet2power` int(11) DEFAULT NULL,
  `pet3power` int(11) DEFAULT NULL,
  `chapterlevel` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `moshi` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_losttemple
-- ----------------------------

-- ----------------------------
-- Table structure for log_max_online
-- ----------------------------
DROP TABLE IF EXISTS `log_max_online`;
CREATE TABLE `log_max_online` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` int(10) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `sid` int(11) DEFAULT NULL,
  `qudao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=2095 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_max_online
-- ----------------------------

-- ----------------------------
-- Table structure for log_money
-- ----------------------------
DROP TABLE IF EXISTS `log_money`;
CREATE TABLE `log_money` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `actiontype` int(11) DEFAULT NULL,
  `moneytype` int(11) DEFAULT NULL,
  `changemoney` int(11) DEFAULT NULL,
  `money` int(11) DEFAULT NULL,
  `qudao` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=606 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_money
-- ----------------------------

-- ----------------------------
-- Table structure for log_new_yuanbao
-- ----------------------------
DROP TABLE IF EXISTS `log_new_yuanbao`;
CREATE TABLE `log_new_yuanbao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `oldnum` int(11) DEFAULT NULL,
  `newnum` int(11) DEFAULT NULL,
  `change` int(11) DEFAULT NULL,
  `qudao` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=701 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_new_yuanbao
-- ----------------------------

-- ----------------------------
-- Table structure for log_personalcopy
-- ----------------------------
DROP TABLE IF EXISTS `log_personalcopy`;
CREATE TABLE `log_personalcopy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `rolelevel` int(11) DEFAULT NULL,
  `viplevel` int(11) DEFAULT NULL,
  `totalpower` int(11) DEFAULT NULL,
  `playerpower` int(11) DEFAULT NULL,
  `pet1power` int(11) DEFAULT NULL,
  `pet2power` int(11) DEFAULT NULL,
  `pet3power` int(11) DEFAULT NULL,
  `copyid` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `moshi` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_personalcopy
-- ----------------------------

-- ----------------------------
-- Table structure for log_recharge
-- ----------------------------
DROP TABLE IF EXISTS `log_recharge`;
CREATE TABLE `log_recharge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ordersn` varchar(64) NOT NULL DEFAULT '1',
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `sid` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `rmb` int(11) DEFAULT NULL,
  `yuanbao` int(11) DEFAULT NULL,
  `bindyuanbao` int(11) DEFAULT NULL,
  `qudao` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=319 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_recharge
-- ----------------------------

-- ----------------------------
-- Table structure for log_role_level
-- ----------------------------
DROP TABLE IF EXISTS `log_role_level`;
CREATE TABLE `log_role_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `oldlevel` int(11) DEFAULT NULL,
  `newlevel` int(11) DEFAULT NULL,
  `qudao` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=169 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_role_level
-- ----------------------------

-- ----------------------------
-- Table structure for log_role_rein
-- ----------------------------
DROP TABLE IF EXISTS `log_role_rein`;
CREATE TABLE `log_role_rein` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `oldlevel` int(11) DEFAULT NULL,
  `newlevel` int(11) DEFAULT NULL,
  `oldrein` int(11) DEFAULT NULL,
  `newrein` int(11) DEFAULT NULL,
  `oldreinexp` int(11) DEFAULT NULL,
  `newreinexp` int(11) DEFAULT NULL,
  `expchange` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_role_rein
-- ----------------------------

-- ----------------------------
-- Table structure for log_store_buy
-- ----------------------------
DROP TABLE IF EXISTS `log_store_buy`;
CREATE TABLE `log_store_buy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `buynum` int(11) DEFAULT NULL,
  `moneyid` int(11) DEFAULT NULL,
  `moneynum` int(11) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_store_buy
-- ----------------------------

-- ----------------------------
-- Table structure for log_suoyaota
-- ----------------------------
DROP TABLE IF EXISTS `log_suoyaota`;
CREATE TABLE `log_suoyaota` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `rolelevel` int(11) DEFAULT NULL,
  `viplevel` int(11) DEFAULT NULL,
  `totalpower` int(11) DEFAULT NULL,
  `playerpower` int(11) DEFAULT NULL,
  `pet1power` int(11) DEFAULT NULL,
  `pet2power` int(11) DEFAULT NULL,
  `pet3power` int(11) DEFAULT NULL,
  `chapterlevel` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `moshi` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_suoyaota
-- ----------------------------

-- ----------------------------
-- Table structure for log_user_register
-- ----------------------------
DROP TABLE IF EXISTS `log_user_register`;
CREATE TABLE `log_user_register` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `sid` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_user_register
-- ----------------------------

-- ----------------------------
-- Table structure for log_vip
-- ----------------------------
DROP TABLE IF EXISTS `log_vip`;
CREATE TABLE `log_vip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `client` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `loginname` varchar(64) DEFAULT NULL,
  `rolename` varchar(64) DEFAULT NULL,
  `actionid` int(11) DEFAULT NULL,
  `oldlevel` int(11) DEFAULT NULL,
  `newlevel` int(11) DEFAULT NULL,
  `oldexp` int(11) DEFAULT NULL,
  `newexp` int(11) DEFAULT NULL,
  `expchange` int(11) DEFAULT NULL,
  `qudao` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_vip
-- ----------------------------
