-- Run this in phpMyAdmin against the `myh5_pl` database
-- if the cfg_server table is missing or has no rows.

USE `myh5_pl`;

CREATE TABLE IF NOT EXISTS `cfg_server` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `port` varchar(255) NOT NULL,
  `http_port` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `openTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int(11) NOT NULL DEFAULT '0',
  `version` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

INSERT IGNORE INTO `cfg_server` (`id`, `name`, `port`, `http_port`, `ip`, `openTime`, `status`, `version`) VALUES
  (1, 'Server 1', '8025', '8081', '127.0.0.1', '2024-01-01 00:00:00', 1, 'v1.1.9.1'),
  (2, 'Server 2', '8026', '8082', '127.0.0.1', '2024-01-01 00:00:00', 1, 'v1.1.9.1'),
  (3, 'Server 3', '8027', '8083', '127.0.0.1', '2024-01-01 00:00:00', 1, 'v1.1.9.1');
