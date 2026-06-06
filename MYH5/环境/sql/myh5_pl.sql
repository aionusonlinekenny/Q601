/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50553
Source Host           : :3306
Source Database       : myh5_pl

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2020-03-16 03:22:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for auto_open_setting
-- ----------------------------
DROP TABLE IF EXISTS `auto_open_setting`;
CREATE TABLE `auto_open_setting` (
  `platform` varchar(50) NOT NULL COMMENT '平台名',
  `is_auto` int(11) NOT NULL COMMENT '是否自动开服',
  `max_role_num` int(11) NOT NULL COMMENT '自动开服触发阈值',
  `open_server_num` int(11) NOT NULL DEFAULT '1' COMMENT '同时开服数',
  `delay_time` int(11) NOT NULL DEFAULT '30' COMMENT '开服时间延迟长度，秒',
  `auto_lock` int(11) NOT NULL,
  `operatorFlag` int(11) NOT NULL,
  PRIMARY KEY (`platform`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of auto_open_setting
-- ----------------------------
INSERT INTO `auto_open_setting` VALUES ('tw', '1', '1000', '1', '20', '0', '1');

-- ----------------------------
-- Table structure for cfg_pay
-- ----------------------------
DROP TABLE IF EXISTS `cfg_pay`;
CREATE TABLE `cfg_pay` (
  `id` int(11) NOT NULL,
  `money` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id` (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=FIXED;

-- ----------------------------
-- Records of cfg_pay
-- ----------------------------
INSERT INTO `cfg_pay` VALUES ('101', '10');
INSERT INTO `cfg_pay` VALUES ('102', '20');
INSERT INTO `cfg_pay` VALUES ('103', '50');
INSERT INTO `cfg_pay` VALUES ('104', '100');
INSERT INTO `cfg_pay` VALUES ('201', '30');
INSERT INTO `cfg_pay` VALUES ('202', '100');
INSERT INTO `cfg_pay` VALUES ('203', '100');
INSERT INTO `cfg_pay` VALUES ('301', '10');
INSERT INTO `cfg_pay` VALUES ('302', '20');
INSERT INTO `cfg_pay` VALUES ('303', '50');
INSERT INTO `cfg_pay` VALUES ('304', '100');
INSERT INTO `cfg_pay` VALUES ('305', '200');
INSERT INTO `cfg_pay` VALUES ('306', '500');
INSERT INTO `cfg_pay` VALUES ('307', '1000');
INSERT INTO `cfg_pay` VALUES ('308', '2000');
INSERT INTO `cfg_pay` VALUES ('309', '3000');
INSERT INTO `cfg_pay` VALUES ('310', '5000');
INSERT INTO `cfg_pay` VALUES ('401', '10');
INSERT INTO `cfg_pay` VALUES ('402', '50');
INSERT INTO `cfg_pay` VALUES ('403', '200');
INSERT INTO `cfg_pay` VALUES ('404', '500');
INSERT INTO `cfg_pay` VALUES ('321', '38');
INSERT INTO `cfg_pay` VALUES ('322', '68');
INSERT INTO `cfg_pay` VALUES ('323', '168');
INSERT INTO `cfg_pay` VALUES ('324', '368');

-- ----------------------------
-- Table structure for cfg_server
-- ----------------------------
DROP TABLE IF EXISTS `cfg_server`;
CREATE TABLE `cfg_server` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `port` varchar(255) NOT NULL,
  `http_port` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `openTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '服务器状态，0：关闭，1：开服，2：维护',
  `version` varchar(255) NOT NULL COMMENT 'cdn地址',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of cfg_server
-- ----------------------------
INSERT INTO `cfg_server` VALUES ('1', 'Www.syymw.Com', '8025', '8081', '192.168.1.111', '2020-03-15 12:00:00', '1', 'v1.1.9.1');
INSERT INTO `cfg_server` VALUES ('2', '手游源码网二区', '8026', '8082', '192.168.1.111', '2020-03-15 12:00:00', '1', 'v1.1.9.1');
INSERT INTO `cfg_server` VALUES ('3', '手游源码网三区', '8027', '8083', '192.168.1.111', '2020-03-15 12:00:00', '1', 'v1.1.9.1');

-- ----------------------------
-- Table structure for log_budan
-- ----------------------------
DROP TABLE IF EXISTS `log_budan`;
CREATE TABLE `log_budan` (
  `orderId` varchar(255) NOT NULL COMMENT '订单号',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色ID，原样返回',
  `serverId` int(255) DEFAULT NULL COMMENT 'ServerID,原样返回',
  `amount` int(11) DEFAULT NULL COMMENT '充值金额，单位：分',
  `productId` varchar(255) DEFAULT NULL COMMENT '渠道ID',
  `time` timestamp NULL DEFAULT NULL COMMENT '自定义参数，原样返回',
  PRIMARY KEY (`orderId`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_budan
-- ----------------------------

-- ----------------------------
-- Table structure for log_device
-- ----------------------------
DROP TABLE IF EXISTS `log_device`;
CREATE TABLE `log_device` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) NOT NULL,
  `os` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_device
-- ----------------------------

-- ----------------------------
-- Table structure for log_pay
-- ----------------------------
DROP TABLE IF EXISTS `log_pay`;
CREATE TABLE `log_pay` (
  `orderId` varchar(255) NOT NULL COMMENT '订单号',
  `amount` int(11) DEFAULT NULL COMMENT '充值金额，单位：分',
  `currency` varchar(255) DEFAULT NULL COMMENT '货币类型，默认RMB',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色ID，原样返回',
  `roleName` varchar(255) DEFAULT NULL COMMENT '用户ID(int)',
  `productId` varchar(255) DEFAULT NULL COMMENT '渠道ID',
  `productName` varchar(255) DEFAULT NULL COMMENT '游戏Id（相当于appId）',
  `serverId` varchar(255) DEFAULT NULL COMMENT 'ServerID,原样返回',
  `serverName` varchar(255) DEFAULT NULL COMMENT '自定义参数，原样返回',
  `orderExt` varchar(255) DEFAULT '0' COMMENT '0：未处理，1：已处理',
  `time` bigint(20) DEFAULT NULL,
  `state` int(11) DEFAULT '0',
  PRIMARY KEY (`orderId`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of log_pay
-- ----------------------------

-- ----------------------------
-- Table structure for role_data0
-- ----------------------------
DROP TABLE IF EXISTS `role_data0`;
CREATE TABLE `role_data0` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data0
-- ----------------------------

-- ----------------------------
-- Table structure for role_data1
-- ----------------------------
DROP TABLE IF EXISTS `role_data1`;
CREATE TABLE `role_data1` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data1
-- ----------------------------

-- ----------------------------
-- Table structure for role_data2
-- ----------------------------
DROP TABLE IF EXISTS `role_data2`;
CREATE TABLE `role_data2` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data2
-- ----------------------------

-- ----------------------------
-- Table structure for role_data3
-- ----------------------------
DROP TABLE IF EXISTS `role_data3`;
CREATE TABLE `role_data3` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data3
-- ----------------------------

-- ----------------------------
-- Table structure for role_data4
-- ----------------------------
DROP TABLE IF EXISTS `role_data4`;
CREATE TABLE `role_data4` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data4
-- ----------------------------

-- ----------------------------
-- Table structure for role_data5
-- ----------------------------
DROP TABLE IF EXISTS `role_data5`;
CREATE TABLE `role_data5` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data5
-- ----------------------------

-- ----------------------------
-- Table structure for role_data6
-- ----------------------------
DROP TABLE IF EXISTS `role_data6`;
CREATE TABLE `role_data6` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data6
-- ----------------------------

-- ----------------------------
-- Table structure for role_data7
-- ----------------------------
DROP TABLE IF EXISTS `role_data7`;
CREATE TABLE `role_data7` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data7
-- ----------------------------

-- ----------------------------
-- Table structure for role_data8
-- ----------------------------
DROP TABLE IF EXISTS `role_data8`;
CREATE TABLE `role_data8` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data8
-- ----------------------------

-- ----------------------------
-- Table structure for role_data9
-- ----------------------------
DROP TABLE IF EXISTS `role_data9`;
CREATE TABLE `role_data9` (
  `roleId` varchar(100) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `loginDays` int(11) NOT NULL COMMENT '已登录天数',
  `lastLoginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  PRIMARY KEY (`roleId`,`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_data9
-- ----------------------------

-- ----------------------------
-- Table structure for server_role_count
-- ----------------------------
DROP TABLE IF EXISTS `server_role_count`;
CREATE TABLE `server_role_count` (
  `sid` int(11) NOT NULL,
  `role_count` int(11) NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=FIXED;

-- ----------------------------
-- Records of server_role_count
-- ----------------------------
INSERT INTO `server_role_count` VALUES ('1', '3');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户唯一id，自增字段',
  `account` varchar(64) DEFAULT NULL COMMENT '用户帐户的字符串',
  `passwd` varchar(32) DEFAULT NULL COMMENT '玩家的密码',
  `createtime` datetime DEFAULT NULL COMMENT '帐号的创建时间',
  `updatetime` datetime DEFAULT NULL COMMENT '上次登录时间',
  `lastserver` int(10) DEFAULT NULL COMMENT '最后登录的服务器ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `ak_key_account` (`account`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=58 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='账号表';

-- ----------------------------
-- Records of user
-- ----------------------------
