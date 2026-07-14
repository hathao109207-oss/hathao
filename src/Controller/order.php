<?php
require_once __DIR__ . '/../Model/giohang.php';
require_once __DIR__ . '/../Model/hoadon.php';

if (empty($_SESSION['user'])) {
  $_SESSION['flash_error'] = 'Vui lòng đăng nhập trước khi đặt vé.';
  header('Location: index.php?act=login'); exit;
}

$user = $_SESSION['user'];
$name = trim($user['name'] ?? '');
$email = trim($user['email'] ?? '');
$phone = trim($user['phone'] ?? '');

if ($name === '' || $email === '' || $phone === '') {
  $_SESSION['flash_error'] = 'Vui lòng cập nhật đầy đủ họ tên và số điện thoại trong tài khoản trước khi đặt vé.';
  header('Location: index.php?act=account'); exit;
}

$items = GioHang::items();
if (!$items) {
  $_SESSION['flash_error'] = 'Giỏ vé của bạn đang trống.';
  header('Location: index.php?act=cart'); exit;
}

$total = GioHang::total();
$customer = [
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'note' => ''
];

$order_id = HoaDon::create((int)$user['id'], $customer, $items, $total);
GioHang::clear();

$_SESSION['flash_success'] = 'Đặt vé thành công! Vui lòng chọn ghế cho đơn #' . $order_id;
header('Location: index.php?act=seat&order_id=' . $order_id); exit;
?>
