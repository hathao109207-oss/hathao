<?php
require_once __DIR__ . '/../Model/khachhang.php';

if ($_SERVER['REQUEST_METHOD']==='POST') {
  if (!csrf_verify()) {
    $_SESSION['flash_error'] = 'Phiên hết hạn. Vui lòng thử lại.';
    header('Location: index.php?act=login'); exit;
  }

  $email = trim($_POST['email'] ?? '');
  $password = $_POST['password'] ?? '';

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
    session_regenerate_id(true);
    $_SESSION['user'] = $u;
    $_SESSION['flash_success'] = 'Đăng nhập thành công.';
    header('Location: index.php'); exit;
  }
  $_SESSION['flash_error'] = 'Email hoặc mật khẩu không đúng.';
  header('Location: index.php?act=login'); exit;
}

include __DIR__ . '/../View/login.php';
?>
