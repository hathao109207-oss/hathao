-- Payment settings table for admin configuration
USE `starshopticket`;

CREATE TABLE IF NOT EXISTS `payment_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `merchant_account` varchar(50) NOT NULL DEFAULT '',
  `merchant_name` varchar(100) NOT NULL DEFAULT '',
  `merchant_bank_code` varchar(20) NOT NULL DEFAULT 'TCB',
  `qr_template` varchar(30) NOT NULL DEFAULT 'compact2',
  `transfer_prefix` varchar(50) NOT NULL DEFAULT 'CINETICKET-ORDER',
  `enable_qr` tinyint(1) NOT NULL DEFAULT 1,
  `enable_bank_transfer` tinyint(1) NOT NULL DEFAULT 1,
  `enable_credit_card` tinyint(1) NOT NULL DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `payment_settings`
  (`id`, `merchant_account`, `merchant_name`, `merchant_bank_code`, `qr_template`, `transfer_prefix`)
VALUES
  (1, '19036588688016', 'CINETICKET VIET NAM', 'TCB', 'compact2', 'CINETICKET-ORDER')
ON DUPLICATE KEY UPDATE `id` = `id`;
