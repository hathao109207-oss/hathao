<?php
require_once __DIR__ . '/../Model/khachhang.php';
require_once __DIR__ . '/../Model/password_reset.php';
require_once __DIR__ . '/../Model/class.phpmailer.php';

if ($_SERVER['REQUEST_METHOD']==='POST') {
  if (!csrf_verify()) {
    $_SESSION['flash_error'] = 'Phiên hết hạn. Vui lòng thử lại.';
    header('Location: index.php?act=forgetpassword'); exit;
  }

  $email = trim($_POST['email'] ?? '');
  $u = KhachHang::findByEmail($email);
  if (!$u){
    $_SESSION['flash_success'] = 'Nếu email tồn tại, hệ thống sẽ gửi link đặt lại mật khẩu.';
    header('Location: index.php?act=login'); exit;
  }

  $token = PasswordReset::createToken((int)$u['id']);
  $resetLink = (isset($_SERVER['HTTPS'])?'https':'http') . '://' . $_SERVER['HTTP_HOST'] . BASE_URL . 'index.php?act=resetpw&token=' . urlencode($token);

  $mail = new PHPMailer();
  $mail->isSMTP();
  $mail->Host = SMTP_HOST;
  $mail->Port = SMTP_PORT;
  $mail->Username = SMTP_USER;
  $mail->Password = SMTP_PASS;
  $mail->SMTPSecure = 'tls';
  $mail->From = SMTP_FROM;
  $mail->FromName = SMTP_FROM_NAME;
  $mail->addAddress($email);
  $mail->Subject = 'Đặt lại mật khẩu - CineTicket';
  $mail->Body = '<p>Bạn vừa yêu cầu đặt lại mật khẩu.</p><p>Nhấn link sau: <a href="'.$resetLink.'">'.$resetLink.'</a></p><p>Link hết hạn sau 30 phút.</p>';

  try {
    $mail->send();
    $_SESSION['flash_success'] = 'Đã gửi email đặt lại mật khẩu (SMTP). Vui lòng kiểm tra hộp thư.';
  } catch (Exception $e) {
    // Vẫn hiển thị link để tiện thử
    $_SESSION['flash_error'] = 'Không gửi được email. Link đặt lại mật khẩu: ' . $resetLink;
  }
  header('Location: index.php?act=login'); exit;
}

include __DIR__ . '/../View/forgetpassword.php';
?>
