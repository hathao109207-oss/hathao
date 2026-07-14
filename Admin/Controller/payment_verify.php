<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/hoadon.php';
require_once __DIR__ . '/../../Model/payment.php';

$txnId = (int)($_POST['transaction_id'] ?? 0);
$orderId = (int)($_POST['order_id'] ?? 0);
$action = $_POST['verify_action'] ?? '';

$txn = PaymentManager::getTransactionById($txnId);
if (!$txn || (int)$txn['order_id'] !== $orderId) {
    $_SESSION['flash_error'] = 'Giao dịch thanh toán không hợp lệ.';
    header('Location: index.php?act=orders');
    exit;
}

$now = date('Y-m-d H:i:s');

if ($action === 'approve') {
    PaymentManager::updateTransactionStatus($txnId, 'success', $now);
    HoaDon::updateStatus($orderId, 'HOAN_THANH');

    // Send payment confirmation email to customer
    require_once __DIR__ . '/../../Controller/email.php';
    sendPaymentConfirmationEmail($orderId);

    $_SESSION['flash_success'] = 'Đã xác nhận thanh toán thành công.';
} elseif ($action === 'reject') {
    $reason = trim($_POST['reject_reason'] ?? '');
    if ($reason === '') {
        $_SESSION['flash_error'] = 'Vui lòng nhập lý do từ chối.';
        header('Location: index.php?act=order_detail&id=' . $orderId);
        exit;
    }
    PaymentManager::updateTransactionStatus($txnId, 'failed', $now, $reason);
    HoaDon::updateStatus($orderId, 'CHO_XAC_NHAN');
    $_SESSION['flash_success'] = 'Đã từ chối thanh toán.';
} else {
    $_SESSION['flash_error'] = 'Hành động không hợp lệ.';
}

header('Location: index.php?act=order_detail&id=' . $orderId);
exit;
