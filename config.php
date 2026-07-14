<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
// ============================================================
// CineTicket Configuration
// ============================================================
define('APP_NAME', 'CineTicket');
define('APP_VERSION', '2.0');

// ============================================================
// Tự động nhận diện BASE_URL
// Hỗ trợ: Laragon, ngrok, reverse proxy
// ============================================================

// Cho phép ngrok / reverse-proxy forward headers
if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
    $_SERVER['HTTPS'] = ($_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ? 'on' : 'off';
}
if (!empty($_SERVER['HTTP_X_FORWARDED_HOST'])) {
    $_SERVER['HTTP_HOST'] = $_SERVER['HTTP_X_FORWARDED_HOST'];
}

$docRoot = rtrim(str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT'] ?? ''), '/');
$dir = rtrim(str_replace('\\', '/', __DIR__), '/');

if ($docRoot !== '' && stripos($dir, $docRoot) === 0) {
    $baseUrl = substr($dir, strlen($docRoot));
} else {
    $baseUrl = '/NguyenNgocHaThao_501250482/';
}
$baseUrl = '/' . ltrim($baseUrl, '/');
$baseUrl = rtrim($baseUrl, '/') . '/';

define('BASE_URL', $baseUrl);
define('ADMIN_URL', BASE_URL . 'Admin/');

// Kết nối DB
define('DB_HOST', getenv('MYSQLHOST') ?: getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('MYSQLPORT') ?: getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('MYSQLDATABASE') ?: getenv('DB_NAME') ?: 'starshopticket');
define('DB_USER', getenv('MYSQLUSER') ?: getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('MYSQLPASSWORD') ?: getenv('DB_PASS') ?: '');

// Tài khoản thụ hưởng thanh toán (VietQR / chuyển khoản)
define('PAYMENT_MERCHANT_ACCOUNT', '19036588688016');
define('PAYMENT_MERCHANT_NAME', 'CINETICKET VIET NAM');
define('PAYMENT_MERCHANT_BANK', 'TCB');

// SMTP Email Configuration (thay email/app password thực để gửi mail)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'autotikok@gmail.com');       // TODO: thay email thực
define('SMTP_PASS', 'ulpd jolm hrru xihs');           // TODO: thay app password thực
define('SMTP_FROM', 'lhh200x@gmail.com');        // TODO: thay email gửi
define('SMTP_FROM_NAME', 'CineTicket');

session_start();

// ============================================================
// CSRF Protection
// ============================================================
function csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field() {
    return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
}

function csrf_verify() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return true;
    $token = $_POST['csrf_token'] ?? $_HEADER['X-CSRF-Token'] ?? '';
    return hash_equals(csrf_token(), $token);
}
?>
