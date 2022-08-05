SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `category` (
  `user` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `list2` (
  `pid` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `remaining` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `uid` int(11) NOT NULL,
  `selfId` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `value` double NOT NULL,
  `barcode` varchar(64) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `log2` (
  `lid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `time` bigint(20) NOT NULL,
  `data` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `category`
  ADD PRIMARY KEY (`cid`),
  ADD KEY `user` (`user`);

ALTER TABLE `list2`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `uid` (`uid`);

ALTER TABLE `log2`
  ADD PRIMARY KEY (`lid`),
  ADD KEY `query-boost` (`uid`,`time`);


ALTER TABLE `category`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `list2`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `log2`
  MODIFY `lid` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
