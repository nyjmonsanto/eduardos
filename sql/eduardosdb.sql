-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2021 at 05:10 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eduardosdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `employeetable`
--

CREATE TABLE `employeetable` (
  `employeeid` int(11) NOT NULL,
  `employeefirstname` varchar(250) NOT NULL,
  `employeemiddlename` varchar(250) NOT NULL,
  `employeelastname` varchar(250) NOT NULL,
  `employeecontact` varchar(11) NOT NULL,
  `employeeemail` varchar(250) NOT NULL,
  `employeerole` varchar(250) NOT NULL,
  `employeesalary` decimal(11,2) NOT NULL,
  `employeeavailability` varchar(250) NOT NULL DEFAULT 'Active',
  `employeedateactive` timestamp NOT NULL DEFAULT current_timestamp(),
  `employeedateinactive` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `has_account` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employeetable`
--

INSERT INTO `employeetable` (`employeeid`, `employeefirstname`, `employeemiddlename`, `employeelastname`, `employeecontact`, `employeeemail`, `employeerole`, `employeesalary`, `employeeavailability`, `employeedateactive`, `employeedateinactive`, `has_account`) VALUES
(1, '', '', '', '', '', 'Owner', '0.00', 'Active', '2021-07-04 10:35:46', '2021-07-04 10:35:46', 1),
(2, 'Nigel', 'Lisondra', 'Monsanto', '+6343130209', 'email@email.com', 'General Manager', '15000.00', 'Active', '2021-07-17 00:27:50', '2021-07-17 00:28:51', 1),
(3, 'Amiel', 'Joseph', 'Lozada', '+6312345678', 'email@email.com', 'Line Cook', '10000.00', 'Active', '2021-07-17 01:09:55', '2021-07-17 01:11:16', 1);

-- --------------------------------------------------------

--
-- Table structure for table `inventorytable`
--

CREATE TABLE `inventorytable` (
  `itemid` int(11) NOT NULL,
  `itemname` varchar(250) NOT NULL,
  `itemstock` int(11) NOT NULL,
  `itemunit` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inventorytable`
--

INSERT INTO `inventorytable` (`itemid`, `itemname`, `itemstock`, `itemunit`) VALUES
(1, 'Chicken Leg', 50, 'kg'),
(2, 'Chicken Breast', 50, 'kg');

-- --------------------------------------------------------

--
-- Table structure for table `itemlogtable`
--

CREATE TABLE `itemlogtable` (
  `itemlogid` int(11) NOT NULL,
  `employeeid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `pulledstock` int(11) NOT NULL,
  `logdate` timestamp NOT NULL DEFAULT current_timestamp(),
  `void` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `itemlogtable`
--

INSERT INTO `itemlogtable` (`itemlogid`, `employeeid`, `itemid`, `pulledstock`, `logdate`, `void`) VALUES
(1, 1, 1, 50, '2021-07-17 00:38:15', 1),
(2, 1, 1, 50, '2021-07-17 00:38:59', 1),
(3, 1, 1, 100, '2021-07-17 00:43:34', 1),
(4, 1, 1, 100, '2021-07-17 00:44:03', 0),
(5, 1, 2, 5, '2021-07-17 01:16:03', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `detailid` int(11) NOT NULL,
  `orderid` int(11) NOT NULL,
  `productid` int(11) NOT NULL,
  `orderquantity` int(11) NOT NULL,
  `ordertotalprice` decimal(11,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`detailid`, `orderid`, `productid`, `orderquantity`, `ordertotalprice`) VALUES
(1, 1, 1, 1, '30.00'),
(2, 2, 2, 1, '30.00'),
(3, 2, 5, 1, '10.00');

-- --------------------------------------------------------

--
-- Table structure for table `ordertable`
--

CREATE TABLE `ordertable` (
  `orderid` int(11) NOT NULL,
  `current_date_order_id` int(11) NOT NULL,
  `totalquantity` int(11) NOT NULL,
  `totalrevenue` decimal(11,2) NOT NULL,
  `logdate` timestamp NOT NULL DEFAULT current_timestamp(),
  `employeeid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ordertable`
--

INSERT INTO `ordertable` (`orderid`, `current_date_order_id`, `totalquantity`, `totalrevenue`, `logdate`, `employeeid`) VALUES
(1, 1, 1, '30.00', '2021-07-17 10:59:31', 1),
(2, 2, 2, '40.00', '2021-07-17 10:59:52', 1);

-- --------------------------------------------------------

--
-- Table structure for table `producttable`
--

CREATE TABLE `producttable` (
  `productid` int(11) NOT NULL,
  `employeeid` int(11) NOT NULL,
  `productname` varchar(250) NOT NULL,
  `productprice` decimal(11,2) NOT NULL,
  `productavailability` varchar(250) NOT NULL DEFAULT 'Available',
  `productdateactive` timestamp NOT NULL DEFAULT current_timestamp(),
  `productdateinactive` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `producttable`
--

INSERT INTO `producttable` (`productid`, `employeeid`, `productname`, `productprice`, `productavailability`, `productdateactive`, `productdateinactive`) VALUES
(1, 1, 'Grilled Chicken Breast', '30.00', 'Available', '2021-06-26 06:51:26', '2021-07-17 01:17:23'),
(2, 1, 'Fried Pork', '30.00', 'Unavailable', '2021-06-26 06:51:39', '2021-07-17 01:19:09'),
(3, 1, 'Sinigang Baboy', '35.00', 'Available', '2021-06-27 03:02:04', '2021-06-27 03:02:04'),
(4, 1, 'Tinolang Manok', '30.00', 'Available', '2021-06-27 03:02:14', '2021-06-27 03:02:14'),
(5, 1, 'Rice', '10.00', 'Available', '2021-06-27 03:02:20', '2021-06-27 03:02:20'),
(6, 1, 'Garlic Rice', '15.00', 'Available', '2021-07-17 01:18:07', '2021-07-17 01:18:34');

-- --------------------------------------------------------

--
-- Table structure for table `suppliertable`
--

CREATE TABLE `suppliertable` (
  `supplierid` int(11) NOT NULL,
  `employeeid` int(11) NOT NULL,
  `suppliername` varchar(250) NOT NULL,
  `suppliercity` varchar(250) NOT NULL,
  `supplierstreet` varchar(250) NOT NULL,
  `supplierprovince` varchar(250) NOT NULL,
  `supplierzipcode` int(11) NOT NULL,
  `suppliercontact` varchar(250) NOT NULL,
  `supplieremail` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `suppliertable`
--

INSERT INTO `suppliertable` (`supplierid`, `employeeid`, `suppliername`, `suppliercity`, `supplierstreet`, `supplierprovince`, `supplierzipcode`, `suppliercontact`, `supplieremail`) VALUES
(1, 1, 'Chicken Supply', 'Cebu City', 'Street', 'Cebu', 6000, '09123456789', 'email@email.com');

-- --------------------------------------------------------

--
-- Table structure for table `supplylogtable`
--

CREATE TABLE `supplylogtable` (
  `supplylogid` int(11) NOT NULL,
  `employeeid` int(11) NOT NULL,
  `supplierid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `itemname` varchar(250) NOT NULL,
  `stockadded` int(11) NOT NULL,
  `itemunit` varchar(250) NOT NULL,
  `logdate` timestamp NOT NULL DEFAULT current_timestamp(),
  `void` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supplylogtable`
--

INSERT INTO `supplylogtable` (`supplylogid`, `employeeid`, `supplierid`, `itemid`, `itemname`, `stockadded`, `itemunit`, `logdate`, `void`) VALUES
(1, 1, 1, 1, 'Chicken Leg', 20, 'kg', '2021-07-17 00:37:28', 1),
(2, 1, 1, 1, 'Chicken Leg', 30, 'kg', '2021-07-17 00:37:41', 1),
(3, 1, 1, 1, 'Chicken Leg', 25, 'kg', '2021-07-17 00:38:05', 1),
(4, 1, 1, 1, 'Chicken Leg', 25, 'kg', '2021-07-17 00:45:04', 1),
(5, 1, 1, 2, 'Chicken Breast', 50, 'kg', '2021-07-17 01:15:04', 0),
(6, 1, 1, 2, 'Chicken Breast', 5, 'kg', '2021-07-17 01:15:35', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usertable`
--

CREATE TABLE `usertable` (
  `userid` int(11) NOT NULL,
  `employeeid` int(11) NOT NULL,
  `userpassword` varchar(250) NOT NULL,
  `usertype` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usertable`
--

INSERT INTO `usertable` (`userid`, `employeeid`, `userpassword`, `usertype`) VALUES
(1, 1, '$2a$10$1LBJYzJ4fdD7ACQCv8r.A.4yoPzo2t/LpjknoCGaTfhNAl8qsXjpa', 'Admin'),
(2, 2, '$2a$10$tXrHYku.SghNE2FV.uETbe.1NlYoTYeK.7icoKVzhfW0cPKczHJMK', 'Admin'),
(4, 3, '$2a$10$kJFLcKEhk5Lp9NBYDUfhTOLLJeihphOD6P9/rTglpUp.zkjWt1VrO', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employeetable`
--
ALTER TABLE `employeetable`
  ADD PRIMARY KEY (`employeeid`);

--
-- Indexes for table `inventorytable`
--
ALTER TABLE `inventorytable`
  ADD PRIMARY KEY (`itemid`);

--
-- Indexes for table `itemlogtable`
--
ALTER TABLE `itemlogtable`
  ADD PRIMARY KEY (`itemlogid`),
  ADD KEY `itemlog_fk1` (`employeeid`),
  ADD KEY `itemlog_fk2` (`itemid`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`detailid`),
  ADD KEY `details_fk1` (`orderid`),
  ADD KEY `details_fk2` (`productid`) USING BTREE;

--
-- Indexes for table `ordertable`
--
ALTER TABLE `ordertable`
  ADD PRIMARY KEY (`orderid`),
  ADD KEY `order_fk1` (`employeeid`);

--
-- Indexes for table `producttable`
--
ALTER TABLE `producttable`
  ADD PRIMARY KEY (`productid`),
  ADD KEY `product_fk1` (`employeeid`);

--
-- Indexes for table `suppliertable`
--
ALTER TABLE `suppliertable`
  ADD PRIMARY KEY (`supplierid`),
  ADD KEY `supplier_fk1` (`employeeid`);

--
-- Indexes for table `supplylogtable`
--
ALTER TABLE `supplylogtable`
  ADD PRIMARY KEY (`supplylogid`),
  ADD KEY `supplylog_fk1` (`employeeid`),
  ADD KEY `supplylog_fk2` (`supplierid`),
  ADD KEY `supplylog_fk3` (`itemid`);

--
-- Indexes for table `usertable`
--
ALTER TABLE `usertable`
  ADD PRIMARY KEY (`userid`),
  ADD KEY `user_fk1` (`employeeid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employeetable`
--
ALTER TABLE `employeetable`
  MODIFY `employeeid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `inventorytable`
--
ALTER TABLE `inventorytable`
  MODIFY `itemid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `itemlogtable`
--
ALTER TABLE `itemlogtable`
  MODIFY `itemlogid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `detailid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ordertable`
--
ALTER TABLE `ordertable`
  MODIFY `orderid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `producttable`
--
ALTER TABLE `producttable`
  MODIFY `productid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `suppliertable`
--
ALTER TABLE `suppliertable`
  MODIFY `supplierid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `supplylogtable`
--
ALTER TABLE `supplylogtable`
  MODIFY `supplylogid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `usertable`
--
ALTER TABLE `usertable`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `itemlogtable`
--
ALTER TABLE `itemlogtable`
  ADD CONSTRAINT `itemlog_fk1` FOREIGN KEY (`employeeid`) REFERENCES `employeetable` (`employeeid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `itemlog_fk2` FOREIGN KEY (`itemid`) REFERENCES `inventorytable` (`itemid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `details_fk1` FOREIGN KEY (`orderid`) REFERENCES `ordertable` (`orderid`),
  ADD CONSTRAINT `details_fk2` FOREIGN KEY (`productid`) REFERENCES `producttable` (`productid`);

--
-- Constraints for table `ordertable`
--
ALTER TABLE `ordertable`
  ADD CONSTRAINT `order_fk1` FOREIGN KEY (`employeeid`) REFERENCES `employeetable` (`employeeid`);

--
-- Constraints for table `producttable`
--
ALTER TABLE `producttable`
  ADD CONSTRAINT `product_fk1` FOREIGN KEY (`employeeid`) REFERENCES `employeetable` (`employeeid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `suppliertable`
--
ALTER TABLE `suppliertable`
  ADD CONSTRAINT `supplier_fk1` FOREIGN KEY (`employeeid`) REFERENCES `employeetable` (`employeeid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `supplylogtable`
--
ALTER TABLE `supplylogtable`
  ADD CONSTRAINT `supplylog_fk1` FOREIGN KEY (`employeeid`) REFERENCES `employeetable` (`employeeid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `supplylog_fk2` FOREIGN KEY (`supplierid`) REFERENCES `suppliertable` (`supplierid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `supplylog_fk3` FOREIGN KEY (`itemid`) REFERENCES `inventorytable` (`itemid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usertable`
--
ALTER TABLE `usertable`
  ADD CONSTRAINT `user_fk1` FOREIGN KEY (`employeeid`) REFERENCES `employeetable` (`employeeid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
