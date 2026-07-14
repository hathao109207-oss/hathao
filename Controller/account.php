<?php
require_once __DIR__ . '/../Model/khachhang.php';
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/seat.php';

if (empty($_SESSION['user'])) {
  $_SESSION['flash_error'] = 'Vui lòng đăng nhập.';
  header('Location: index.php?act=login'); exit;
}

$user = KhachHang::find((int)$_SESSION['user']['id']);

// User stats
$myOrders = HoaDon::listByUser((int)$_SESSION['user']['id']);
$totalOrders = count($myOrders);
$completedOrders = 0;
$totalSpent = 0;
foreach ($myOrders as $o) {
  if ($o['status'] === 'HOAN_THANH') {
    $completedOrders++;
    $totalSpent += (int)$o['total_amount'];
  }
}

// Recent orders (last 5)
$recentOrders = array_slice($myOrders, 0, 5);
$orderIds = array_map('intval', array_column($recentOrders, 'id'));
$seatCounts = SeatReservation::countByOrders($orderIds);
$seatNeeds = HoaDon::seatNeedByOrders($orderIds);

include __DIR__ . '/../View/account.php';
?>
