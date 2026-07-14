<?php
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/seat.php';
require_once __DIR__ . '/../Model/showtime.php';

if (empty($_SESSION['user'])) {
  $_SESSION['flash_error'] = 'Vui long dang nhap.';
  header('Location: index.php?act=login'); exit;
}

$order_id = (int)($_GET['id'] ?? 0);
$order = HoaDon::findForUser($order_id, (int)$_SESSION['user']['id']);
if (!$order) {
  $_SESSION['flash_error'] = 'Khong thay don.';
  header('Location: index.php?act=myorders'); exit;
}

$items = HoaDon::items($order_id);

$seatRows = SeatReservation::byOrder($order_id);
$seatsByShowtime = [];
foreach ($seatRows as $row) {
  $seatsByShowtime[(int)$row['showtime_id']][] = $row['seat_code'];
}

$showtimeIds = [];
foreach ($items as $it) {
  if (!empty($it['showtime_id'])) {
    $showtimeIds[] = (int)$it['showtime_id'];
  }
}

$showtimeMap = ShowTime::mapByIds(array_values(array_unique($showtimeIds)));
foreach ($items as &$it) {
  $st = $showtimeMap[(int)($it['showtime_id'] ?? 0)] ?? null;
  $it['showtime_label'] = $st
    ? date('d/m', strtotime($st['show_date'])) . ' ' . date('H:i', strtotime($st['show_time']))
    : null;
}
unset($it);

$seatNeed = HoaDon::seatNeed($order_id);
$ticketTotal = 0;
foreach ($items as $it) {
  $ticketTotal += (int)$it['line_total'];
}

$parsedNote = HoaDon::parseCustomerNote($order['customer_note'] ?? '');
$snackItems = $parsedNote['snack_items'] ?? [];
$plainNote = $parsedNote['plain_note'] ?? '';

if (empty($snackItems) && !empty($_SESSION['snacks'][$order_id]['items'])) {
  $snackItems = $_SESSION['snacks'][$order_id]['items'];
}

$snackTotal = 0;
foreach ($snackItems as $item) {
  $snackTotal += (int)($item['line_total'] ?? 0);
}

include __DIR__ . '/../View/orderdetail.php';
?>
