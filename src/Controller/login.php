<?php
require_once __DIR__ . '/../Model/khachhang.php';

if ($_SERVER['REQUEST_METHOD']==='POST') {
  $email = trim($_POST['email'] ?? '');
  $password = $_POST['password'] ?? '';

  // Auto-ensure default admin accounts exist so admin can log in without registration
  KhachHang::ensureAdminSeed([
    'name'=>'Admin',
    'email'=>'admin@cineticket.com',
    'password'=>'Admin@123',
    'phone'=>'0900000000'
  ]);

  if (!KhachHang::findByEmail('user@cineticket.com')) {
    KhachHang::create('Khách hàng Demo', 'user@cineticket.com', 'User@123', '0987654321');
  }

  $u = KhachHang::findByEmail($email);
  if ($u && password_verify($password, $u['password_hash'])) {
    unset($u['password_hash']);
    $_SESSION['user'] = $u;
    $_SESSION['flash_success'] = 'Đăng nhập thành công.';
    header('Location: index.php'); exit;
  }
  $_SESSION['flash_error'] = 'Email hoặc mật khẩu không đúng.';
  header('Location: index.php?act=login'); exit;
}

include __DIR__ . '/../View/login.php';
?>
