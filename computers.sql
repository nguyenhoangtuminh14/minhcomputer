-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 04, 2024 at 04:28 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `computers`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'minh', 'minh@gmail.com', '$2b$10$Em4.f2VWs86JOtkr8XDgcuseo60mwGMlyQ/FSuTr40wkPvEXuV0D.', '2024-11-29 14:30:54'),
(2, 'minh', 'minh1@gmail.com', '$2b$10$7UPwyMwf4rgUnDtD2BSLHeU2e4479tYbEV/VRa1H1wvWk4.nWPzPy', '2024-11-29 15:05:29'),
(3, 'minh2', 'minh2@gmail.com', '$2b$10$erM66EMb7gweBty78jPoe.iCG2BPCFPvm.2dLkFnc3zJVzrILB1Xa', '2024-11-29 15:34:44'),
(4, 'minh', 'minh4@gmail.com', '$2b$10$mqh4lJyDCx79kqYPvRfVvebR8W8rfFIHQwKtBEfLL6sbO7IOMze9e', '2024-11-29 19:27:05'),
(5, 'Minh Nguyen', 'nguyenhoangtuminh14@gmail.com', '$2b$10$pFDLuVhCrQ2r16yTENpjouP57GF/NHctzWzFeKmf5N9n8FpzmBR/m', '2024-12-04 09:44:33'),
(6, 'minh', 'minh222@gmail.com', '$2b$10$Wc/T8DhuwOo6r9SsbdpWrec/Cvp/y67JnMVa.DTbn9Db0ucFxNHj2', '2024-12-04 11:37:40');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `contact_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `response` text,
  `responded_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`contact_id`, `user_id`, `message`, `created_at`, `response`, `responded_at`, `name`, `email`) VALUES
(1, NULL, '1231231', '2024-12-02 15:26:39', NULL, NULL, 'Minh Nguyen', 'nguyenhoangtuminh14@gmail.com'),
(3, NULL, '1231233', '2024-12-02 15:34:03', NULL, NULL, 'Minh Nguyen222', 'nguyenhoangtuminh1424@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `news_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','completed','canceled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `order_date`, `status`) VALUES
(12, 6, '56150000.00', '2024-12-02 17:08:22', 'completed'),
(14, 8, '21160000.00', '2024-12-04 11:36:40', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(20, 12, 23, 4, '2790000.00'),
(21, 12, 38, 1, '44990000.00'),
(23, 14, 22, 4, '5290000.00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_count` int DEFAULT '0',
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `category_id`, `created_at`, `comment_count`, `image`) VALUES
(15, 'Laptop Asus ZenBook Flip OLED UP3404VA KN038W', '✔ Bảo hành chính hãng 24 tháng. \r\n\r\n✔ Hỗ trợ đổi mới trong 7 ngày. \r\n\r\n✔ Miễn phí giao hàng toàn quốc.', '25490000.00', 9, '2024-11-30 12:57:30', 0, 'laptop_asus_zenbook_flip_oled_up3404va_kn038w_1732971450548.webp'),
(17, 'Laptop Acer Swift X14 SFX14 72G 79UW', '✔ Bảo hành chính hãng 12 tháng. \r\n\r\n✔ Hỗ trợ đổi mới trong 7 ngày. \r\n\r\n✔ Miễn phí giao hàng toàn quốc', '52990000.00', 9, '2024-11-30 13:03:46', 0, 'laptop_acer_swift_x14_sfx14_72g_79uw_1732971826364.webp'),
(22, 'AMD Ryzen 5 7600', 'Hãng sản xuất: AMD\r\nBảo hành: 36 Tháng', '5290000.00', 2, '2024-11-30 13:09:40', 0, 'amd_ryzen_5_7600_1732972180208.webp'),
(23, 'AMD Ryzen 5 5600', 'Hãng sản xuất: AMD\r\nBảo hành: 36 Tháng', '2790000.00', 2, '2024-11-30 13:12:24', 0, 'amd_ryzen_5_5600_1732972344574.webp'),
(24, 'Bo mạch chủ GIGABYTE Z790 AORUS MASTER X DDR5', 'Hãng sản xuất: GIGABYTE\r\nBảo hành: 36 tháng', '16490000.00', 3, '2024-11-30 13:15:21', 0, 'bo_mạch_chủ_gigabyte_z790_aorus_master_x_ddr5_1732972521675.webp'),
(25, 'Bo mạch chủ GIGABYTE Z790 EAGLE AX DDR5', 'Hãng sản xuất: GIGABYTE\r\nBảo hành: 36 tháng', '5890000.00', 3, '2024-11-30 13:15:57', 0, 'bo_mạch_chủ_gigabyte_z790_eagle_ax_ddr5_1732972557633.webp'),
(26, 'Bo mạch chủ ASUS ROG Strix Z790-E GAMING WIFI II DDR5', 'Hãng sản xuất: ASUS\r\nBảo hành: 36 tháng', '13290000.00', 3, '2024-11-30 13:16:55', 0, 'bo_mạch_chủ_asus_rog_strix_z790-e_gaming_wifi_ii_ddr5_1732972615146.webp'),
(27, 'Bo mạch chủ MSI MEG Z790 ACE MAX DDR5', 'Hãng sản xuất: MSI\r\nBảo hành: 36 Tháng', '18990000.00', 3, '2024-11-30 13:17:28', 0, 'bo_mạch_chủ_msi_meg_z790_ace_max_ddr5_1732972648918.webp'),
(31, 'Nguồn máy tính Cooler Master MWE 750 - 80 Plus Bronze', 'Hãng sản xuất: Cooler Master \r\nBảo hành: 60 Tháng', '690000.00', 5, '2024-11-30 13:21:08', 0, 'nguồn_máy_tính_cooler_master_mwe_750_-_80_plus_bronze_1732972868619.webp'),
(32, 'Nguồn máy tính GIGABYTE AORUS ELITE P1000W PCIe 5.0', 'Nhà sản xuất: Gigabyte\r\nBảo hành: 36 tháng', '6490000.00', 5, '2024-11-30 13:21:44', 0, 'nguồn_máy_tính_gigabyte_aorus_elite_p1000w_pcie_5.0_1732972904350.webp'),
(33, 'Nguồn máy tính ASUS ROG Strix 1000W AURA Edition - 80 Plus Gold', 'Nhà sản xuất: Asus\r\nBảo hành: 120 tháng', '5990000.00', 5, '2024-11-30 13:23:28', 0, 'nguồn_máy_tính_asus_rog_strix_1000w_aura_edition_-_80_plus_gold_1732973008399.webp'),
(34, 'Nguồn máy tính ASUS ROG Strix 1000W AURA White Edition - 80 Plus Gold', 'Nhà sản xuất: Asus\r\nBảo hành: 120 tháng', '6990000.00', 5, '2024-11-30 13:24:06', 0, 'nguồn_máy_tính_asus_rog_strix_1000w_aura_white_edition_-_80_plus_gold_1732973046382.webp'),
(38, 'Laptop gaming Dell Alienware M15 R6 P109F001CBL', '✔ Bảo hành chính hãng 12 tháng. \r\n\r\n✔ Hỗ trợ đổi mới trong 7 ngày.\r\n\r\n✔ Windows bản quyền tích hợp. \r\n\r\n✔ Miễn phí giao hàng toàn quốc.', '44990000.00', 9, '2024-11-30 13:28:39', 0, 'laptop_gaming_dell_alienware_m15_r6_p109f001cbl_1732973319588.webp'),
(39, 'Laptop gaming MSI G15 5530 i7H161W11GR4060', '✔ Bảo hành chính hãng 12 tháng. \r\n\r\n✔ Hỗ trợ đổi mới trong 7 ngày. \r\n\r\n✔ Windows bản quyền tích hợp. \r\n\r\n✔ Miễn phí giao hàng toàn quốc.', '37990000.00', 9, '2024-11-30 13:29:24', 0, 'laptop_gaming_msi_g15_5530_i7h161w11gr4060_1732973364452.webp'),
(41, 'Corsair Dominator Titanium Black 32GB', 'Nhà sản xuất: Corsair\r\nMã sản phẩm: CMP32GX5M2B6000C30\r\nTình trạng: Mới\r\nBảo hành: 36 tháng', '5590000.00', 4, '2024-12-01 09:30:06', 0, 'corsair_dominator_titanium_black_32gb_1733045406791.webp'),
(42, 'Màn hình cong LG 27GS60QC-B UltraGear 27', 'Bạn là game thủ đích thực, luôn khao khát trải nghiệm chiến trường đỉnh cao với tốc độ và sự mượt mà tuyệt đối? Hãy để LG UltraGear 27GS60QC-B 27\" 2K 180Hz mở ra một thế giới game hoàn toàn mới, nơi bạn thống trị mọi trận đấu với tốc độ ánh sáng và sự chìm mình chưa từng có. Sản phẩm với nhiều tính năng vượt trội cùng nhiều hỗ trợ tuyệt vời cho game thủ. Cùng GEARVN tìm hiểu chi tiết sản phẩm nhé!', '5790000.00', 8, '2024-12-01 10:02:36', 0, 'màn_hình_cong_lg_27gs60qc-b_ultragear_27_1733047356286.webp'),
(43, 'Intel Core i5 14400 ', 'Hãng sản xuất: Intel\r\nBảo hành: 36 tháng', '5390000.00', 2, '2024-12-02 17:40:09', 0, 'intel_core_i5_14400__1733161209537.webp'),
(44, 'G.Skill Trident Z5 Royal RGB 64GB ', 'Thương hiệu: G.Skill\r\nChuẩn RAM: RAM DDR5\r\nBảo hành: 36 tháng\r\nMã sản phẩm: F5-6400J3239G32GX2-TR5S\r\nTình trạng: Mới\r\nMàu sắc: Silver', '7990000.00', 4, '2024-12-02 17:41:07', 0, 'g.skill_trident_z5_royal_rgb_64gb__1733161267107.webp'),
(45, 'Kingston Fury Beast RGB 16GB', 'Nhà sản xuất: Kingston\r\nMã sản phẩm: KF556C40BBAK2-16\r\nTình trạng: Mới \r\nBảo hành: 36 tháng', '2190000.00', 4, '2024-12-02 17:41:52', 0, 'kingston_fury_beast_rgb_16gb_1733161312324.webp'),
(46, 'Corsair Dominator Platinum 64GB', 'Nhà sản xuất: Corsair\r\nMã sản phẩm: CMT64GX5M2B6000C40\r\nTình trạng: Mới \r\nBảo hành: 36 tháng\r\nMàu sắc: Đen', '7590000.00', 4, '2024-12-02 17:52:55', 0, 'corsair_dominator_platinum_64gb_1733161975346.webp'),
(47, 'Asus ROG Swift PG32UCDM 32', 'Màn hình Asus ROG Swift PG32UCDM thật sự là một lựa chọn ấn tượng cho những người yêu thích trải nghiệm chơi game tốt nhất. Với độ phân giải cao 4K, tốc độ làm mới lên tới 144Hz và hỗ trợ công nghệ HDR, nó mang lại hình ảnh sống động và màu sắc rực rỡ. Đặc biệt, kích thước màn hình 32 inch cũng tạo ra không gian rộng rãi cho việc thưởng thức trò chơi. Điều này chắc chắn sẽ mang lại trải nghiệm thị giác đỉnh cao mà bạn mong muốn!', '39890000.00', 8, '2024-12-02 17:54:44', 0, 'asus_rog_swift_pg32ucdm_32_1733162084274.webp'),
(48, 'Màn hình cong GIGABYTE GS27FC 27', 'Màn hình máy tính GIGABYTE GS27FC 27\" 180Hz là một trong những dòng sản phẩm thiết bị máy tính có thiết kế thẩm mỹ cao và linh hoạt góc độ trải nghiệm, đi kèm thông số cực khủng của chiếc màn hình máy tính này hứa hẹn đem lại trải nghiệm cực kỳ ấn tượng và hút mắt với cái nhìn đầu tiên khi lựa chọn để Build PC Gaming.', '3590000.00', 8, '2024-12-02 17:56:44', 0, 'màn_hình_cong_gigabyte_gs27fc_27_1733162204399.webp'),
(49, 'Màn hình LG 32GS95UV-B 32', 'Màn hình LG 32GS95UV-B 32\" OLED 4K 240Hz Dual Mode chuyên game được trang bị những công nghệ phải nói là hàng đầu hiện nay đảm bảo sẽ mang lại cho bạn những trải nghiệm chơi game đỉnh cao. Được trang bị sẵn tấm nền OLED 32 inch, độ phân giải 4K cùng tần số quét lên đến 240Hz màn hình 32GS95UV-B đảm bảo sẽ làm hài lòng ngay cả những người cực kỳ khó tính. ', '29990000.00', 8, '2024-12-02 17:57:49', 0, 'màn_hình_lg_32gs95uv-b_32_1733162269035.webp');

-- --------------------------------------------------------

--
-- Table structure for table `product_catalog`
--

CREATE TABLE `product_catalog` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `product_count` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_catalog`
--

INSERT INTO `product_catalog` (`id`, `name`, `product_count`) VALUES
(2, 'CPU', 0),
(3, 'Mainboard', 0),
(4, 'RAM', 0),
(5, 'Nguồn', 0),
(6, 'Ổ cứng', 0),
(7, 'Gear', 0),
(8, 'Màn hình', 0),
(9, 'Laptop', 0),
(10, 'PC', 0),
(11, 'Thiết bị mạng', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `order_count` int DEFAULT '0',
  `comment_count` int DEFAULT '0',
  `contact_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `order_count`, `comment_count`, `contact_count`, `created_at`) VALUES
(6, 'min', 'nguyenhoangtuminh14@gmail.com', '$2b$10$zxa87sfsULmoNJSUP1uq8uilGtFTxjesWPWp0zXnoKGsOSfR8b0Pa', 1, 0, 0, '2024-12-02 16:01:37'),
(8, 'Minh Nguyen', 'zackshika@gmail.com', '$2b$10$C9Tw/HSaY5O5gvJIlWi8lec5SbWSYosarUiu/cwNhyhlet6sp1myu', 1, 0, 0, '2024-12-04 11:34:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_catalog`
--
ALTER TABLE `product_catalog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `contact_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `news_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `product_catalog`
--
ALTER TABLE `product_catalog`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `contact`
--
ALTER TABLE `contact`
  ADD CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `product_catalog` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
