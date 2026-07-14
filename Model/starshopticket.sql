-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 03, 2026 at 04:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

DROP DATABASE IF EXISTS `starshopticket`;
CREATE DATABASE `starshopticket` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `starshopticket`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `starshopticket`
--

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon_class` varchar(80) NOT NULL DEFAULT 'fas fa-film'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`id`, `name`, `icon_class`) VALUES
(1, 'Hành động', 'fas fa-bolt'),
(2, 'Hài', 'far fa-laugh'),
(3, 'Kinh dị', 'fas fa-ghost'),
(4, 'Tình cảm', 'fas fa-heart'),
(5, 'Hoạt hình', 'fas fa-child');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `price` int(11) NOT NULL DEFAULT 75000,
  `poster` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `genre_id` int(11) DEFAULT NULL,
  `duration_min` int(11) DEFAULT 120,
  `rating` varchar(10) DEFAULT 'PG-13',
  `trailer_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `price`, `poster`, `description`, `genre_id`, `duration_min`, `rating`, `trailer_url`, `created_at`) VALUES
(1, 'John Wick 4', 90000, 'img/products/john-wick-4.jpg', 'Sát thủ truyền thuyết tái xuất, đối đầu hội đồng tối cao.', 1, 169, 'R', NULL, '2026-02-03 03:44:17'),
(2, 'Anh Trai Say Xe (2025)', 80000, 'img/products/anh-trai-say-xe-2025.jpg', 'Hài tình huống về nhóm bạn gây náo loạn bằng những pha lái xe “khó đỡ”.', 2, 110, 'PG-13', NULL, '2026-02-03 03:44:17'),
(3, 'Good Boy – Chó Cưng Đừng Sợ', 85000, 'img/products/good-boy-cho-cung-dung-so.jpg', 'Kinh dị tâm lý: chú chó cưng kéo theo chuỗi sự kiện rùng rợn.', 3, 102, 'R', NULL, '2026-02-03 03:44:17'),
(4, 'Titanic (1997)', 75000, 'img/products/titanic-1997.jpg', 'Chuyện tình kinh điển trên chuyến tàu định mệnh.', 4, 195, 'PG-13', NULL, '2026-02-03 03:44:17'),
(5, 'Elio: Cậu Bé Đến Từ Trái Đất (2025)', 90000, 'img/products/elio-2025.jpg', 'Hoạt hình: cậu bé bất ngờ trở thành “đại sứ trái đất” ngoài vũ trụ.', 5, 105, 'PG', NULL, '2026-02-03 03:44:17'),
(6, 'Avatar 2 – Dòng chảy của nước', 85000, 'img/products/avatar-2.jpg', 'Jake Sully và Neytiri bảo vệ gia đình trước hiểm họa mới.', 1, 192, 'PG-13', NULL, '2026-02-03 03:44:17'),
(7, 'Em Xinh Tinh Quái – Pretty Crazy (2025)', 78000, 'img/products/pretty-crazy-2025.jpg', 'Hài lãng mạn, cô gái cá tính khuấy đảo.', 2, 110, 'PG-13', NULL, '2026-02-03 03:44:17'),
(8, 'The Black Phone 2 – Điện Thoại Đen 2', 86000, 'img/products/black-phone-2.jpg', 'Kinh dị sinh tồn, chiếc điện thoại gọi về từ địa ngục.', 3, 105, 'R', NULL, '2026-02-03 03:44:17'),
(9, 'Người đẹp và thủy quái – The Shape of Water (2017)', 76000, 'img/products/shape-of-water-2017.jpg', 'Câu chuyện tình dị biệt giữa cô lao công và sinh vật bí ẩn.', 4, 123, 'R', NULL, '2026-02-03 03:44:17'),
(10, 'Doraemon Movie 44 (2025)', 72000, 'img/products/doraemon-44-2025.jpg', 'Nobita và Doraemon bước vào cuộc phiêu lưu điện ảnh mới.', 5, 100, 'G', NULL, '2026-02-03 03:44:17'),
(11, 'Mortal Kombat: Cuộc Chiến Sinh Tử II', 93000, 'img/products/mortal-kombat-2.jpg', 'Trận chiến sinh tử tiếp tục bùng nổ.', 1, 118, 'R', NULL, '2026-02-03 03:44:17'),
(12, 'Bố Già', 79000, 'img/products/bo-gia.jpg', 'Hài – gia đình được yêu thích.', 2, 128, 'PG-13', NULL, '2026-02-03 03:44:17'),
(13, 'Làm Giàu Với Ma 2: Cuộc Chiến Hột Xoàn', 92000, 'img/products/lam-giau-voi-ma-2.jpg', 'Phi vụ kim cương giữa người và ma.', 1, 115, 'PG-13', NULL, '2026-02-03 03:44:17'),
(14, 'Mưa Đỏ', 97000, 'img/products/mua-do.jpg', 'Hành động – chiến trường khốc liệt.', 1, 120, 'R', NULL, '2026-02-03 03:44:17'),
(15, 'Kẻ Vô Danh 2', 91000, 'img/products/ke-vo-danh-2.jpg', 'Tay đấm vô danh tái xuất, tiếp tục báo thù.', 1, 112, 'R', NULL, '2026-02-03 03:44:17'),
(16, 'The Conjuring 4 – Nghi Lễ Cuối Cùng 4', 86000, 'img/products/conjuring-4.jpg', 'Ed và Lorraine Warren đối đầu thế lực tà ác mới.', 3, 124, 'R', NULL, '2026-02-03 03:44:17'),
(17, 'The Monkey – Tiếng Vọng Kinh Hoàng', 88000, 'img/products/the-monkey.jpg', 'Rùng rợn từ con khỉ đồ chơi bị ám.', 3, 98, 'R', NULL, '2026-02-03 03:44:17'),
(18, 'M3GAN 2.0', 87000, 'img/products/m3gan-2.jpg', 'Búp bê AI quay lại với phiên bản nguy hiểm hơn.', 3, 102, 'PG-13', NULL, '2026-02-03 03:44:17'),
(19, 'Kỳ nghỉ chết cười – Blended (2014)', 77000, 'img/products/blended-2014.jpg', 'Kỳ nghỉ gượng ép hóa ra đầy tiếng cười.', 4, 117, 'PG-13', NULL, '2026-02-03 03:44:17'),
(20, 'Chạng vạng – Twilight (2008)', 76000, 'img/products/twilight-2008.jpg', 'Tình yêu người – ma cà rồng nổi tiếng.', 4, 122, 'PG-13', NULL, '2026-02-03 03:44:17'),
(21, 'Dế Mèn: Cuộc Phiêu Lưu Tới Xóm Lầy Lội (2025)', 72000, 'img/products/de-men-xom-lay-loi-2025.jpg', 'Hoạt hình phiêu lưu của chú dế.', 5, 96, 'G', NULL, '2026-02-03 03:44:17');

-- --------------------------------------------------------

--
-- --------------------------------------------------------

--
-- Table structure for table `cinemas`
--
CREATE TABLE `cinemas` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `region` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cinemas`
--
INSERT INTO `cinemas` (`id`, `name`, `region`, `address`) VALUES
(1, 'CGV HCM', 'tphcm', 'TP.HCM'),
(2, 'Galaxy Vung Tau', 'vung-tau', 'Vũng Tàu'),
(3, 'Lotte Can Tho', 'can-tho', 'Cần Thơ');

-- Table structure for table `showtimes`
--

CREATE TABLE `showtimes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `movie_id` int(11) NOT NULL,
  `show_date` date NOT NULL,
  `show_time` time NOT NULL,
  `cinema_id` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `showtimes`
--

INSERT INTO `showtimes` (`movie_id`, `show_date`, `show_time`, `cinema_id`) VALUES
(1, '2026-02-10', '09:00:00', 1),
(1, '2026-02-10', '13:30:00', 2),
(1, '2026-02-10', '18:30:00', 3),
(2, '2026-02-10', '09:00:00', 1),
(2, '2026-02-10', '13:30:00', 2),
(2, '2026-02-10', '18:30:00', 3),
(3, '2026-02-10', '09:00:00', 1),
(3, '2026-02-10', '13:30:00', 2),
(3, '2026-02-10', '18:30:00', 3),
(4, '2026-02-10', '09:00:00', 1),
(4, '2026-02-10', '13:30:00', 2),
(4, '2026-02-10', '18:30:00', 3),
(5, '2026-02-10', '09:00:00', 1),
(5, '2026-02-10', '13:30:00', 2),
(5, '2026-02-10', '18:30:00', 3),
(6, '2026-02-10', '09:00:00', 1),
(6, '2026-02-10', '13:30:00', 2),
(6, '2026-02-10', '18:30:00', 3),
(7, '2026-02-10', '09:00:00', 1),
(7, '2026-02-10', '13:30:00', 2),
(7, '2026-02-10', '18:30:00', 3),
(8, '2026-02-10', '09:00:00', 1),
(8, '2026-02-10', '13:30:00', 2),
(8, '2026-02-10', '18:30:00', 3),
(9, '2026-02-10', '09:00:00', 1),
(9, '2026-02-10', '13:30:00', 2),
(9, '2026-02-10', '18:30:00', 3),
(10, '2026-02-10', '09:00:00', 1),
(10, '2026-02-10', '13:30:00', 2),
(10, '2026-02-10', '18:30:00', 3),
(11, '2026-02-10', '09:00:00', 1),
(11, '2026-02-10', '13:30:00', 2),
(11, '2026-02-10', '18:30:00', 3),
(12, '2026-02-10', '09:00:00', 1),
(12, '2026-02-10', '13:30:00', 2),
(12, '2026-02-10', '18:30:00', 3),
(13, '2026-02-10', '09:00:00', 1),
(13, '2026-02-10', '13:30:00', 2),
(13, '2026-02-10', '18:30:00', 3),
(14, '2026-02-10', '09:00:00', 1),
(14, '2026-02-10', '13:30:00', 2),
(14, '2026-02-10', '18:30:00', 3),
(15, '2026-02-10', '09:00:00', 1),
(15, '2026-02-10', '13:30:00', 2),
(15, '2026-02-10', '18:30:00', 3),
(16, '2026-02-10', '09:00:00', 1),
(16, '2026-02-10', '13:30:00', 2),
(16, '2026-02-10', '18:30:00', 3),
(17, '2026-02-10', '09:00:00', 1),
(17, '2026-02-10', '13:30:00', 2),
(17, '2026-02-10', '18:30:00', 3),
(18, '2026-02-10', '09:00:00', 1),
(18, '2026-02-10', '13:30:00', 2),
(18, '2026-02-10', '18:30:00', 3),
(19, '2026-02-10', '09:00:00', 1),
(19, '2026-02-10', '13:30:00', 2),
(19, '2026-02-10', '18:30:00', 3),
(20, '2026-02-10', '09:00:00', 1),
(20, '2026-02-10', '13:30:00', 2),
(20, '2026-02-10', '18:30:00', 3),
(21, '2026-02-10', '09:00:00', 1),
(21, '2026-02-10', '13:30:00', 2),
(21, '2026-02-10', '18:30:00', 3)
;

-- Phân bổ rạp cho các suất chiếu (demo): chia đều vào 3 khu vực
UPDATE `showtimes`
SET `cinema_id` = (MOD(`id` - 1, 3) + 1);

-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` int(11) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'CHO_XAC_NHAN',
  `customer_name` varchar(120) NOT NULL,
  `customer_phone` varchar(30) NOT NULL,
  `customer_email` varchar(120) NOT NULL,
  `customer_note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `showtime_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `line_total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banks`
--

CREATE TABLE `banks` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `short_name` varchar(50) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `bin` varchar(10) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `banks` (`id`, `code`, `name`, `short_name`, `logo_url`, `bin`, `is_active`, `sort_order`) VALUES
(1, 'VCB', 'Ngân hàng TMCP Ngoại thương Việt Nam', 'Vietcombank', 'assets/img/banks/vcb.png', '970436', 1, 1),
(2, 'TCB', 'Ngân hàng TMCP Kỹ thương Việt Nam', 'Techcombank', 'assets/img/banks/tcb.png', '970407', 1, 2),
(3, 'MB', 'Ngân hàng TMCP Quân đội', 'MB Bank', 'assets/img/banks/mb.png', '970422', 1, 3),
(4, 'ACB', 'Ngân hàng TMCP Á Châu', 'ACB', 'assets/img/banks/acb.png', '970416', 1, 4),
(5, 'BIDV', 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', 'BIDV', 'assets/img/banks/bidv.png', '970418', 1, 5),
(6, 'VTB', 'Ngân hàng TMCP Công thương Việt Nam', 'Vietinbank', 'assets/img/banks/vtb.png', '970415', 1, 6),
(7, 'TPB', 'Ngân hàng TMCP Tiên Phong', 'TPBank', 'assets/img/banks/tpb.png', '970423', 1, 7),
(8, 'VPB', 'Ngân hàng TMCP Việt Nam Thịnh Vượng', 'VPBank', 'assets/img/banks/vpb.png', '970432', 1, 8),
(9, 'STB', 'Ngân hàng TMCP Sài Gòn Thương Tín', 'Sacombank', 'assets/img/banks/stb.png', '970403', 1, 9),
(10, 'HDB', 'Ngân hàng TMCP Phát triển TP.HCM', 'HDBank', 'assets/img/banks/hdb.png', '970437', 1, 10),
(11, 'OCB', 'Ngân hàng TMCP Phương Đông', 'OCB', 'assets/img/banks/ocb.png', '970448', 1, 11),
(12, 'MSB', 'Ngân hàng TMCP Hàng Hải', 'MSB', 'assets/img/banks/msb.png', '970426', 1, 12),
(13, 'SHB', 'Ngân hàng TMCP Sài Gòn - Hà Nội', 'SHB', 'assets/img/banks/shb.png', '970443', 1, 13),
(14, 'EIB', 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam', 'Eximbank', 'assets/img/banks/eib.png', '970431', 1, 14),
(15, 'NAB', 'Ngân hàng TMCP Nam Á', 'Nam A Bank', 'assets/img/banks/nab.png', '970428', 1, 15),
(16, 'BAB', 'Ngân hàng TMCP Bắc Á', 'Bac A Bank', 'assets/img/banks/bab.png', '970409', 1, 16),
(17, 'SCB', 'Ngân hàng TMCP Sài Gòn', 'SCB', 'assets/img/banks/scb.png', '970429', 1, 17),
(18, 'LPB', 'Ngân hàng TMCP Bưu điện Liên Việt', 'LienVietPostBank', 'assets/img/banks/lpb.png', '970449', 1, 18),
(19, 'VIB', 'Ngân hàng TMCP Quốc tế Việt Nam', 'VIB', 'assets/img/banks/vib.png', '970441', 1, 19),
(20, 'SEAB', 'Ngân hàng TMCP Đông Nam Á', 'SeABank', 'assets/img/banks/seab.png', '970440', 1, 20);

-- --------------------------------------------------------

--
-- Table structure for table `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` enum('qr_code','bank_transfer','credit_card') NOT NULL,
  `bank_code` varchar(20) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `account_holder` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_ref` varchar(100) DEFAULT NULL,
  `status` enum('pending','verifying','success','failed') NOT NULL DEFAULT 'pending',
  `payment_proof` varchar(255) DEFAULT NULL,
  `reject_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(100) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seat_reservations`
--

CREATE TABLE `seat_reservations` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `showtime_id` int(11) NOT NULL,
  `seat_code` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indexes for table `showtimes`
--
ALTER TABLE `showtimes`
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `cinema_id` (`cinema_id`);

--
-- Indexes for table `cinemas`
--
ALTER TABLE `cinemas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banks`
--
ALTER TABLE `banks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `showtime_id` (`showtime_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `seat_reservations`
--
ALTER TABLE `seat_reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `showtime_id` (`showtime_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `cinemas`
--
ALTER TABLE `cinemas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `showtimes`
--
-- ALTER TABLE `showtimes`
--   MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banks`
--
ALTER TABLE `banks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seat_reservations`
--
ALTER TABLE `seat_reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `movies`
--
ALTER TABLE `movies`
  ADD CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `showtimes`
--
ALTER TABLE `showtimes`
  ADD CONSTRAINT `showtimes_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `showtimes_ibfk_2` FOREIGN KEY (`cinema_id`) REFERENCES `cinemas` (`id`);

--
-- Constraints for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `payment_transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`id`);

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `seat_reservations`
--
ALTER TABLE `seat_reservations`
  ADD CONSTRAINT `seat_reservations_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `seat_reservations_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

