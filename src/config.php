<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
// Tự động nhận diện BASE_URL phù hợp cho Laragon (Virtual Host) và PHP server
$docRoot = rtrim(str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT'] ?? ''), '/');
$dir = rtrim(str_replace('\\', '/', __DIR__), '/');

if ($docRoot !== '' && stripos($dir, $docRoot) === 0) {
    $baseUrl = substr($dir, strlen($docRoot));
} else {
    $baseUrl = '/NguyenNgocHaThao_501250482/src/';
}
$baseUrl = '/' . ltrim($baseUrl, '/');
$baseUrl = rtrim($baseUrl, '/') . '/';

define('BASE_URL', $baseUrl);
define('ADMIN_URL', BASE_URL . 'Admin/');

// Kết nối DB
define('DB_HOST','localhost');
define('DB_NAME','starshopticket');
define('DB_USER','root');
define('DB_PASS','');

session_start();
?>
