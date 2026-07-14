<?php
require_once __DIR__ . '/../Model/khachhang.php';
if (empty($_SESSION['user'])) { $_SESSION['flash_error']='Vui lòng đăng nhập.'; header('Location: index.php?act=login'); exit; }

if (!csrf_verify()) {
  $_SESSION['flash_error'] = 'Phiên hết hạn. Vui lòng thử lại.';
  header('Location: index.php?act=account'); exit;
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');

if ($name === '') {
  $_SESSION['flash_error'] = 'Họ tên không được rỗng.';
  header('Location: index.php?act=account'); exit;
}

if ($phone !== '' && !preg_match('/^[0-9]{10,11}$/', $phone)) {
  $_SESSION['flash_error'] = 'Số điện thoại phải có 10-11 chữ số.';
  header('Location: index.php?act=account'); exit;
}

KhachHang::updateProfile((int)$_SESSION['user']['id'], $name, $phone);
$_SESSION['user']['name'] = $name;
$_SESSION['user']['phone'] = $phone;
$_SESSION['flash_success'] = 'Cập nhật thông tin thành công.';
header('Location: index.php?act=account'); exit;
?>
