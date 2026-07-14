<?php
require_once __DIR__ . '/../Model/khachhang.php';
if (empty($_SESSION['user'])) { $_SESSION['flash_error']='Vui lòng đăng nhập.'; header('Location: index.php?act=login'); exit; }
$user = KhachHang::find((int)$_SESSION['user']['id']);
include __DIR__ . '/../View/account.php';
?>
