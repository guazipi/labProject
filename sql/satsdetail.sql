/*
Navicat MySQL Data Transfer

Source Server         : sss
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : labtles

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2015-12-27 18:34:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for satsdetail
-- ----------------------------
DROP TABLE IF EXISTS `satsdetail`;
CREATE TABLE `satsdetail` (
  `satNum` char(6) DEFAULT NULL,
  `satName` char(11) DEFAULT NULL,
  `country` char(11) DEFAULT NULL,
  `owner` text,
  `launchDate` char(11) DEFAULT NULL,
  `launchSite` char(10) DEFAULT NULL,
  `launchSitez` text,
  `orbitType` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of satsdetail
-- ----------------------------
INSERT INTO `satsdetail` VALUES ('39150', 'GAOFEN-1', 'PRC', '中国', '2013-04-26', 'JSC', '中国酒泉卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('40118', 'GAOFEN-2', 'PRC', '中国', '2014-08-19', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('40701', 'GAOFEN-8', 'PRC', '中国', '2015-06-26', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('37820', 'TIANGONG-1', 'PRC', '中国', '2011-09-29', 'JSC', '中国酒泉卫星发射中心', '地球低轨道（LEO）');
INSERT INTO `satsdetail` VALUES ('33320', 'HUANJING-1A', 'PRC', '中国', '2008-09-06', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('33321', 'HUANJING-1B', 'PRC', '中国', '2008-09-06', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('38997', 'HUANJING-1C', 'PRC', '中国', '2012-11-18', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('25940', 'CBERS-1-(ZY', 'CHBZ', '中国 巴西', '1999-10-14', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('28057', 'CBERS-2-(ZY', 'CHBZ', '中国 巴西', '2003-10-21', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('32062', 'CBERS-2B', 'CHBZ', '中国 巴西', '2007-09-19', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('40336', 'CBERS-4', 'CHBZ', '中国 巴西', '2014-12-07', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('26481', 'JB-3-1-(ZY-', 'PRC', '中国', '2000-09-01', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('27550', 'JB-3-2-(ZY-', 'PRC', '中国', '2002-10-27', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('28470', 'JB-3-3-(ZY-', 'PRC', '中国', '2004-11-06', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('38038', 'ZIYUAN-1-02', 'PRC', '中国', '2011-12-22', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('38046', 'ZIYUAN-3-(Z', 'PRC', '中国', '2012-01-09', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('27430', 'HAIYANG-1A', 'PRC', '中国', '2002-05-15', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('31113', 'HAIYANG-1B', 'PRC', '中国', '2007-04-11', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('37781', 'HAIYANG-2A', 'PRC', '中国', '2011-08-15', 'TAISC', '中国太原卫星发射中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('16613', 'SPOT-1', 'FR', '法国', '1986-02-22', 'FRGUI', '法属圭亚那库鲁发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('20436', 'SPOT-2', 'FR', '法国', '1990-01-22', 'FRGUI', '法属圭亚那库鲁发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('22823', 'SPOT-3', 'FR', '法国', '1993-09-26', 'FRGUI', '法属圭亚那库鲁发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('25260', 'SPOT-4', 'FR', '法国', '1998-03-24', 'FRGUI', '法属圭亚那库鲁发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('27421', 'SPOT-5', 'FR', '法国', '2002-05-04', 'FRGUI', '法属圭亚那库鲁发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('38755', 'SPOT-6', 'FR', '法国', '2012-09-09', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('40053', 'SPOT-7', 'FR', '法国', '2014-06-30', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('06126', 'LANDSAT-1-(', 'US', '美国', '1972-07-23', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('07615', 'LANDSAT-2', 'US', '美国', '1975-01-22', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('10702', 'LANDSAT-3', 'US', '美国', '1978-03-05', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('13367', 'LANDSAT-4', 'US', '美国', '1982-07-16', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('14780', 'LANDSAT-5', 'US', '美国', '1984-03-01', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('25682', 'LANDSAT-7', 'US', '美国', '1999-04-15', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('39084', 'LANDSAT-8', 'US', '美国', '2013-02-11', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('25994', 'TERRA', 'US', '美国', '1999-12-18', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('28931', 'ALOS-(DAICH', 'JPN', '日本', '2006-01-24', 'TANSC', '日本种子岛航天中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('39766', 'ALOS-2', 'JPN', '日本', '2014-05-24', 'TANSC', '日本种子岛航天中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('33396', 'THEOS', 'THAI', '泰国', '2008-10-01', 'DLS', '俄罗斯栋巴罗夫斯基发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('18960', 'IRS-1A', 'IND', '印度', '1988-03-17', 'TYMSC', '哈萨克斯坦拜科努尔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('21688', 'IRS-1B', 'IND', '印度', '1991-08-29', 'TYMSC', '哈萨克斯坦拜科努尔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('23323', 'IRS-P2', 'IND', '印度', '1994-10-15', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('23751', 'IRS-1C', 'IND', '印度', '1995-12-28', 'TYMSC', '哈萨克斯坦拜科努尔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('23827', 'IRS-P3', 'IND', '印度', '1996-03-21', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('24971', 'IRS-1D', 'IND', '印度', '1997-09-29', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('25758', 'IRS-P4-(OCE', 'IND', '印度', '1999-05-26', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('28051', 'IRS-P6-(RES', 'IND', '印度', '2003-10-17', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('28649', 'IRS-P5-(CAR', 'IND', '印度', '2005-05-05', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('29710', 'CARTOSAT-2-', 'IND', '印度', '2007-01-10', 'SRILR', '印度斯里哈里科塔发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('21574', 'ERS-1', 'ESA', '欧洲太空局', '1991-07-17', 'FRGUI', '法属圭亚那库鲁发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('23560', 'ERS-2', 'ESA', '欧洲太空局', '1995-04-21', 'FRGUI', '法属圭亚那库鲁发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('27386', 'ENVISAT', 'ESA', '欧洲太空局', '2002-03-01', 'FRGUI', '法属圭亚那库鲁发射场', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('23710', 'RADARSAT-1', 'CA', '加拿大', '1995-11-04', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
INSERT INTO `satsdetail` VALUES ('32382', 'RADARSAT-2', 'CA', '加拿大', '2007-12-14', 'AFWTR', '美国西部航天和导弹试验中心', '近极地太阳同步轨道');
