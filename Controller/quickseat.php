<?php
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/hanghoa.php';
require_once __DIR__ . '/../Model/showtime.php';
require_once __DIR__ . '/../Model/seat.php';

if (empty($_SESSION['user'])) {
  $_SESSION['flash_error'] = 'Vui lòng đăng nhập trước khi chọn ghế.';
  header('Location: index.php?act=login'); exit;
}

$showtime_id = (int)($_GET['showtime_id'] ?? $_POST['showtime_id'] ?? 0);
$qty = max(1, (int)($_POST['qty'] ?? $_GET['qty'] ?? 1));

$showtime = ShowTime::find($showtime_id);
if (!$showtime) {
  $_SESSION['flash_error'] = 'Không tìm thấy suất chiếu.';
  header('Location: index.php?act=sanpham'); exit;
}

$movie = HangHoa::find((int)$showtime['movie_id']);
if (!$movie) {
  $_SESSION['flash_error'] = 'Không tìm thấy phim.';
  header('Location: index.php?act=sanpham'); exit;
}

// Check available seats
$reserved = SeatReservation::reservedByShowtime($showtime_id);
$totalSeats = 80; // Default cinema capacity
$available = $totalSeats - count($reserved);
if ($qty > $available) {
  $_SESSION['flash_error'] = 'Chỉ còn ' . $available . ' ghế trống cho suất này.';
  header('Location: index.php?act=sanpham'); exit;
}

$user = $_SESSION['user'];
$name = trim($user['name'] ?? '');
$email = trim($user['email'] ?? '');
$phone = trim($user['phone'] ?? '');
if ($name === '' || $email === '' || $phone === '') {
  $_SESSION['flash_error'] = 'Vui lòng cập nhật họ tên, email và số điện thoại trước khi đặt vé.';
  header('Location: index.php?act=account'); exit;
}

$items = [[
  'movie_id' => (int)$movie['id'],
  'title' => $movie['title'],
  'price' => (int)$movie['price'],
  'qty' => $qty,
  'showtime_id' => $showtime_id
]];

$note = 'Suất chiếu: ' . date('d/m', strtotime($showtime['show_date'])) . ' ' . date('H:i', strtotime($showtime['show_time']));
if (!empty($showtime['cinema_name'])) {
  $note .= ' - ' . $showtime['cinema_name'];
}
$total = (int)$movie['price'] * $qty;

$order_id = HoaDon::create((int)$user['id'], [
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'note' => $note
], $items, $total);

$_SESSION['flash_success'] = 'Vui lòng chọn ' . $qty . ' ghế cho suất ' . date('H:i', strtotime($showtime['show_time'])) . '.';
header('Location: index.php?act=seat&order_id=' . $order_id); exit;
?>
