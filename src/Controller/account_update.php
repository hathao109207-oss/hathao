<?php
require_once __DIR__ . '/../Model/khachhang.php';
if (empty($_SESSION['user'])) { $_SESSION['flash_error']='Vui lòng đăng nhập.'; header('Location: index.php?act=login'); exit; }
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
if ($name===''){ $_SESSION['flash_error']='Họ tên không được rỗng.'; header('Location: index.php?act=account'); exit; }
KhachHang::updateProfile((int)$_SESSION['user']['id'], $name, $phone);
$_SESSION['user']['name'] = $name; // update session
$_SESSION['user']['phone'] = $phone;
$_SESSION['flash_success']='Cập nhật thông tin thành công.';
header('Location: index.php?act=account'); exit;
?>
