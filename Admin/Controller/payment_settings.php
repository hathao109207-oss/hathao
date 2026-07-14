<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/payment.php';

$settings = PaymentManager::getSettings();
$banks = PaymentManager::getBankList('', 50);
$preview = PaymentManager::previewQr(250000);
$flashSuccess = $_SESSION['flash_success'] ?? null;
$flashError = $_SESSION['flash_error'] ?? null;
unset($_SESSION['flash_success'], $_SESSION['flash_error']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        PaymentManager::saveSettings($_POST);
        $_SESSION['flash_success'] = 'Đã lưu cấu hình thanh toán.';
    } catch (Throwable $e) {
        $_SESSION['flash_error'] = $e->getMessage();
    }
    header('Location: index.php?act=payment_settings');
    exit;
}

include __DIR__ . '/../View/payment_settings.php';
