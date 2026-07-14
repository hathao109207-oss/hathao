<?php
require_once __DIR__ . '/../config.php';
$port = defined('DB_PORT') ? (int)DB_PORT : 3306;
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, $port);
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");
?>
