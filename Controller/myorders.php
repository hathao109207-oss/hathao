<?php
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/seat.php';
if (empty($_SESSION['user'])) { $_SESSION['flash_error']='Vui lòng đăng nhập.'; header('Location: index.php?act=login'); exit; }
$orders = HoaDon::listByUser((int)$_SESSION['user']['id']);
$orderIds = array_map('intval', array_column($orders, 'id'));
$seatCounts = SeatReservation::countByOrders($orderIds);
$seatNeeds = HoaDon::seatNeedByOrders($orderIds);
include __DIR__ . '/../View/myorders.php';
?>
