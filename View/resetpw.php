<?php
require_once __DIR__ . '/../Model/password_reset.php';
require_once __DIR__ . '/../Model/khachhang.php';

$token = $_GET['token'] ?? '';
$reset = $token ? PasswordReset::findValid($token) : null;

if ($_SERVER['REQUEST_METHOD']==='POST') {
  $token = $_POST['token'] ?? '';
  $new = $_POST['new_password'] ?? '';
  $confirm = $_POST['confirm_password'] ?? '';
  $reset = PasswordReset::findValid($token);
  if (!$reset) { $_SESSION['flash_error']='Link không hợp lệ hoặc đã hết hạn.'; header('Location: index.php?act=forgetpassword'); exit; }
  if ($new !== $confirm) { $_SESSION['flash_error']='Mật khẩu xác nhận không khớp.'; header('Location: index.php?act=resetpw&token='.urlencode($token)); exit; }
  if (strlen($new) < 6) { $_SESSION['flash_error']='Mật khẩu tối thiểu 6 ký tự.'; header('Location: index.php?act=resetpw&token='.urlencode($token)); exit; }

  KhachHang::changePassword((int)$reset['user_id'], $new);
  PasswordReset::markUsed((int)$reset['id']);
  $_SESSION['flash_success']='Đặt lại mật khẩu thành công. Mời bạn đăng nhập.';
  header('Location: index.php?act=login'); exit;
}
?>

<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Tài khoản</p>
          <h1>Đặt lại mật khẩu</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-5 mb-5" style="max-width:520px;">
  <?php if(!$reset): ?>
    <p class="text-danger">Link không hợp lệ hoặc đã hết hạn.</p>
  <?php else: ?>
    <form method="post">
      <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">
      <div class="form-group">
        <label>Mật khẩu mới</label>
        <input class="form-control" name="new_password" type="password" minlength="6" required>
      </div>
      <div class="form-group">
        <label>Nhập lại mật khẩu mới</label>
        <input class="form-control" name="confirm_password" type="password" minlength="6" required>
      </div>
      <button class="boxed-btn" type="submit">Lưu mật khẩu</button>
    </form>
  <?php endif; ?>
</div>
