<?php
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/hanghoa.php';
require_once __DIR__ . '/../Model/showtime.php';

if (empty($_SESSION['user'])) {
  $_SESSION['flash_error'] = 'Vui long dang nhap truoc khi chon ghe.';
  header('Location: index.php?act=login'); exit;
}

$showtime_id = (int)($_GET['showtime_id'] ?? $_POST['showtime_id'] ?? 0);
$qty = max(1, (int)($_POST['qty'] ?? $_GET['qty'] ?? 1));

$showtime = ShowTime::find($showtime_id);
if (!$showtime) {
  $_SESSION['flash_error'] = 'Khong tim thay suat chieu.';
  header('Location: index.php?act=sanpham'); exit;
}

$movie = HangHoa::find((int)$showtime['movie_id']);
if (!$movie) {
  $_SESSION['flash_error'] = 'Khong tim thay phim.';
  header('Location: index.php?act=sanpham'); exit;
}

$user = $_SESSION['user'];
$name = trim($user['name'] ?? '');
$email = trim($user['email'] ?? '');
$phone = trim($user['phone'] ?? '');
if ($name === '' || $email === '' || $phone === '') {
  $_SESSION['flash_error'] = 'Vui long cap nhat ho ten, email va so dien thoai truoc khi chon ghe.';
  header('Location: index.php?act=account'); exit;
}

$items = [[
  'movie_id' => (int)$movie['id'],
  'title' => $movie['title'],
  'price' => (int)$movie['price'],
  'qty' => $qty,
  'showtime_id' => $showtime_id
]];

$note = 'Suat chieu: ' . date('d/m', strtotime($showtime['show_date'])) . ' ' . date('H:i', strtotime($showtime['show_time']));
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

$_SESSION['flash_success'] = 'Vui long chon ' . $qty . ' ghe cho suat ' . date('H:i', strtotime($showtime['show_time'])) . '.';
header('Location: index.php?act=seat&order_id=' . $order_id); exit;
?>
