<?php
require_once __DIR__ . '/../Model/giohang.php';
$items = GioHang::items();
$total = GioHang::total();
include __DIR__ . '/../View/cart.php';
?>
