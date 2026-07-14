<?php
require_once __DIR__ . '/../Model/khachhang.php';

if ($_SERVER['REQUEST_METHOD']==='POST') {
  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $password = $_POST['password'] ?? '';
  $phone = trim($_POST['phone'] ?? '');
  if ($name===''||$email===''||strlen($password)<6) {
    $_SESSION['flash_error']='Vui lòng nhập đủ thông tin (mật khẩu >= 6).';
    header('Location: index.php?act=registration'); exit;
  }
  if (KhachHang::findByEmail($email)) {
    $_SESSION['flash_error']='Email đã tồn tại.';
    header('Location: index.php?act=registration'); exit;
  }
  KhachHang::create($name,$email,$password,$phone);
  $_SESSION['flash_success']='Đăng ký thành công! Mời bạn đăng nhập.';
  header('Location: index.php?act=login'); exit;
}

include __DIR__ . '/../View/registration.php';
?>
