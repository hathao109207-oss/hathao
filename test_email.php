<?php
/**
 * Test script - Kiểm tra gửi email SMTP
 * Truy cập: http://localhost/NguyenNgocHaThao_501250482/test_email.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Model/connect.php';
require_once __DIR__ . '/Model/class.smtp.php';

// Config SMTP từ config.php
$host = SMTP_HOST;
$port = SMTP_PORT;
$username = SMTP_USER;
$password = SMTP_PASS;
$from = SMTP_FROM;
$fromName = SMTP_FROM_NAME;

// Email nhận test
$toEmail = $from; // Gửi cho chính mình

echo "<h2>CineTicket - Test Email SMTP</h2>";
echo "<pre>";

// ---- Bước 1: Kiểm tra config ----
echo "=== BƯỚC 1: Kiểm tra SMTP Config ===\n";
echo "Host:     $host\n";
echo "Port:     $port\n";
echo "Username: $username\n";
echo "Password: " . str_repeat('*', strlen($password)) . "\n";
echo "From:     $from\n";
echo "To:       $toEmail\n\n";

if ($username === 'your_email@gmail.com' || $password === 'your_app_password') {
    echo "[LỖI] Bạn chưa thay SMTP credentials trong config.php!\n";
    echo "Hãy thay SMTP_USER và SMTP_PASS bằng email + App Password thực.\n";
    echo "\nCách tạo Gmail App Password:\n";
    echo "1. Bật 2FA tại https://myaccount.google.com/signinoptions/two-step-verification\n";
    echo "2. Tạo App Password tại https://myaccount.google.com/apppasswords\n";
    echo "3. Copy 16 ký tự và paste vào SMTP_PASS trong config.php\n";
    echo "</pre>";
    exit;
}

// ---- Bước 2: Test kết nối SMTP ----
echo "=== BƯỚC 2: Test kết nối SMTP ===\n";
$smtp = new SimpleSMTP();
$smtp->host = $host;
$smtp->port = (int)$port;
$smtp->username = $username;
$smtp->password = $password;
$smtp->secure = 'tls';

try {
    echo "Đang kết nối đến $host:$port ...\n";
    $smtp->connect();
    echo "[OK] Kết nối SMTP thành công!\n\n";

    // ---- Bước 3: Gửi email test ----
    echo "=== BƯỚC 3: Gửi email test ===\n";
    $subject = 'CineTicket - Test Email ' . date('d/m/Y H:i:s');
    $body = '
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;padding:20px;">
  <div style="max-width:500px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#ff6b35,#f28123);padding:20px;text-align:center;">
      <h1 style="color:#fff;margin:0;">🎬 CineTicket</h1>
      <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;">Test Email thành công!</p>
    </div>
    <div style="padding:24px;">
      <p>Xin chào,</p>
      <p>Đây là email test từ hệ thống <strong>CineTicket</strong>.</p>
      <p>Nếu bạn nhận được email này, nghĩa là cấu hình SMTP đã hoạt động đúng.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
      <p style="color:#999;font-size:12px;">Thời gian gửi: ' . date('d/m/Y H:i:s') . '</p>
    </div>
  </div>
</body>
</html>';

    echo "Đang gửi email đến: $toEmail\n";
    echo "Subject: $subject\n";

    $smtp->send($from, $toEmail, $subject, $body);
    echo "[OK] Gửi email thành công!\n\n";

    $smtp->close();
    echo "=== KẾT QUẢ: EMAIL ĐÃ GỬI THÀNH CÔNG ===\n";
    echo "Kiểm tra hộp thư đến của: $toEmail\n";

} catch (Exception $e) {
    echo "[LỖI] " . $e->getMessage() . "\n\n";
    echo "=== NGUYÊN NHÂN CÓ THỂ ===\n";
    echo "1. Sai email/password - Hãy kiểm tra lại SMTP_USER và SMTP_PASS\n";
    echo "2. App Password chưa đúng - Gmail yêu cầu App Password (16 ký tự), không phải password thường\n";
    echo "3. Chưa bật 2FA - Bật 2FA trước khi tạo App Password\n";
    echo "4. Kết nối bị chặn - Kiểm tra firewall/proxy\n\n";
    echo "Hướng dẫn tạo Gmail App Password:\n";
    echo "1. Vào https://myaccount.google.com/signinoptions/two-step-verification\n";
    echo "   → Bật xác minh 2 bước (2FA)\n";
    echo "2. Vào https://myaccount.google.com/apppasswords\n";
    echo "   → Chọn 'Mail' và 'Other (Custom name)' → nhập 'CineTicket'\n";
    echo "   → Copy 16 ký tự được cấp\n";
    echo "3. Dán 16 ký tự đó vào SMTP_PASS trong config.php\n";
}

echo "</pre>";
?>
