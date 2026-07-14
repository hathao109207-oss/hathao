<?php
require_once __DIR__ . '/../Model/khachhang.php';

if ($_SERVER['REQUEST_METHOD']==='POST') {
  if (!csrf_verify()) {
    $_SESSION['flash_error'] = 'Phiên hết hạn. Vui lòng thử lại.';
    header('Location: index.php?act=registration'); exit;
  }

  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $password = $_POST['password'] ?? '';
  $phone = trim($_POST['phone'] ?? '');

  if ($name === '' || $email === '' || strlen($password) < 6) {
    $_SESSION['flash_error'] = 'Vui lòng nhập đủ thông tin (mật khẩu >= 6 ký tự).';
    header('Location: index.php?act=registration'); exit;
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['flash_error'] = 'Email không hợp lệ.';
    header('Location: index.php?act=registration'); exit;
  }

  if ($phone !== '' && !preg_match('/^[0-9]{10,11}$/', $phone)) {
    $_SESSION['flash_error'] = 'Số điện thoại phải có 10-11 chữ số.';
    header('Location: index.php?act=registration'); exit;
  }

  if (KhachHang::findByEmail($email)) {
    $_SESSION['flash_error'] = 'Email đã tồn tại.';
    header('Location: index.php?act=registration'); exit;
  }

  KhachHang::create($name, $email, $password, $phone);
  session_regenerate_id(true);
  $_SESSION['flash_success'] = 'Đăng ký thành công! Mời bạn đăng nhập.';
  header('Location: index.php?act=login'); exit;
}

include __DIR__ . '/../View/registration.php';
?>
