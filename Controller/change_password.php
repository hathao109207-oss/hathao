<?php
require_once __DIR__ . '/../Model/khachhang.php';
if (empty($_SESSION['user'])) { $_SESSION['flash_error']='Vui lòng đăng nhập.'; header('Location: index.php?act=login'); exit; }

if (!csrf_verify()) {
  $_SESSION['flash_error'] = 'Phiên hết hạn. Vui lòng thử lại.';
  header('Location: index.php?act=account'); exit;
}

$old = $_POST['old_password'] ?? '';
$new = $_POST['new_password'] ?? '';
$confirm = $_POST['confirm_password'] ?? '';

if ($new !== $confirm) {
  $_SESSION['flash_error'] = 'Mật khẩu xác nhận không khớp.';
  header('Location: index.php?act=account'); exit;
}
if (strlen($new) < 6) {
  $_SESSION['flash_error'] = 'Mật khẩu mới tối thiểu 6 ký tự.';
  header('Location: index.php?act=account'); exit;
}

$u = KhachHang::findByEmail($_SESSION['user']['email']);
if (!$u || !password_verify($old, $u['password_hash'])) {
  $_SESSION['flash_error'] = 'Mật khẩu hiện tại không đúng.';
  header('Location: index.php?act=account'); exit;
}

KhachHang::changePassword((int)$_SESSION['user']['id'], $new);
session_regenerate_id(true);
$_SESSION['flash_success'] = 'Đổi mật khẩu thành công.';
header('Location: index.php?act=account'); exit;
?>
