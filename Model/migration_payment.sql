-- Migration: Payment system upgrade for CineTicket
-- Run after starshopticket database exists

USE `starshopticket`;

-- --------------------------------------------------------
-- Table: banks
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `banks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `short_name` varchar(50) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `bin` varchar(10) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: payment_transactions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `verified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payment_transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed 20 Vietnamese banks (VietQR BIN codes)
INSERT INTO `banks` (`code`, `name`, `short_name`, `logo_url`, `bin`, `is_active`, `sort_order`) VALUES
('VCB', 'Ngân hàng TMCP Ngoại thương Việt Nam', 'Vietcombank', 'assets/img/banks/vcb.png', '970436', 1, 1),
('TCB', 'Ngân hàng TMCP Kỹ thương Việt Nam', 'Techcombank', 'assets/img/banks/tcb.png', '970407', 1, 2),
('MB', 'Ngân hàng TMCP Quân đội', 'MB Bank', 'assets/img/banks/mb.png', '970422', 1, 3),
('ACB', 'Ngân hàng TMCP Á Châu', 'ACB', 'assets/img/banks/acb.png', '970416', 1, 4),
('BIDV', 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', 'BIDV', 'assets/img/banks/bidv.png', '970418', 1, 5),
('VTB', 'Ngân hàng TMCP Công thương Việt Nam', 'Vietinbank', 'assets/img/banks/vtb.png', '970415', 1, 6),
('TPB', 'Ngân hàng TMCP Tiên Phong', 'TPBank', 'assets/img/banks/tpb.png', '970423', 1, 7),
('VPB', 'Ngân hàng TMCP Việt Nam Thịnh Vượng', 'VPBank', 'assets/img/banks/vpb.png', '970432', 1, 8),
('STB', 'Ngân hàng TMCP Sài Gòn Thương Tín', 'Sacombank', 'assets/img/banks/stb.png', '970403', 1, 9),
('HDB', 'Ngân hàng TMCP Phát triển TP.HCM', 'HDBank', 'assets/img/banks/hdb.png', '970437', 1, 10),
('OCB', 'Ngân hàng TMCP Phương Đông', 'OCB', 'assets/img/banks/ocb.png', '970448', 1, 11),
('MSB', 'Ngân hàng TMCP Hàng Hải', 'MSB', 'assets/img/banks/msb.png', '970426', 1, 12),
('SHB', 'Ngân hàng TMCP Sài Gòn - Hà Nội', 'SHB', 'assets/img/banks/shb.png', '970443', 1, 13),
('EIB', 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam', 'Eximbank', 'assets/img/banks/eib.png', '970431', 1, 14),
('NAB', 'Ngân hàng TMCP Nam Á', 'Nam A Bank', 'assets/img/banks/nab.png', '970428', 1, 15),
('BAB', 'Ngân hàng TMCP Bắc Á', 'Bac A Bank', 'assets/img/banks/bab.png', '970409', 1, 16),
('SCB', 'Ngân hàng TMCP Sài Gòn', 'SCB', 'assets/img/banks/scb.png', '970429', 1, 17),
('LPB', 'Ngân hàng TMCP Bưu điện Liên Việt', 'LienVietPostBank', 'assets/img/banks/lpb.png', '970449', 1, 18),
('VIB', 'Ngân hàng TMCP Quốc tế Việt Nam', 'VIB', 'assets/img/banks/vib.png', '970441', 1, 19),
('SEAB', 'Ngân hàng TMCP Đông Nam Á', 'SeABank', 'assets/img/banks/seab.png', '970440', 1, 20)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
