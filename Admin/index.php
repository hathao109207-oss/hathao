<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../Model/connect.php';
require_once __DIR__ . '/../Model/loaihang.php';
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/seat.php';
require_once __DIR__ . '/../Model/payment.php';

if (empty($_SESSION['user']) || ($_SESSION['user']['role'] ?? '') !== 'admin') {
  header('Location: ../index.php?act=login'); exit;
}

$act = $_GET['act'] ?? 'dashboard';

switch ($act) {
  case 'dashboard':
    $stats = HoaDon::stats();
    $best = HoaDon::bestSellers(5);
    $monthly = HoaDon::revenueByMonth(12);
    include __DIR__ . '/View/dashboard.php';
    break;

  case 'movies':
    $movies = $conn->query("SELECT m.*, g.name AS genre_name FROM movies m LEFT JOIN genres g ON m.genre_id=g.id ORDER BY m.created_at DESC")->fetch_all(MYSQLI_ASSOC);
    $genres = LoaiHang::all();
    include __DIR__ . '/View/movies.php';
    break;

  case 'movie_add':
    include __DIR__ . '/Controller/movie_add.php';
    break;

  case 'movie_edit':
    include __DIR__ . '/Controller/movie_edit.php';
    break;

  case 'movie_delete':
    include __DIR__ . '/Controller/movie_delete.php';
    break;

  case 'genres':
    $genres = LoaiHang::all();
    include __DIR__ . '/View/genres.php';
    break;

  case 'genre_add':
    include __DIR__ . '/Controller/genre_add.php';
    break;

  case 'genre_edit':
    include __DIR__ . '/Controller/genre_edit.php';
    break;

  case 'genre_delete':
    include __DIR__ . '/Controller/genre_delete.php';
    break;

  case 'orders':
    $orders = HoaDon::listAll();
    include __DIR__ . '/View/orders.php';
    break;

  case 'order_detail':
    $order_id = (int)($_GET['id'] ?? 0);
    $order = HoaDon::find($order_id);
    if (!$order) { header('Location: index.php?act=orders'); exit; }
    $items = HoaDon::items($order_id);
    $seatRows = SeatReservation::byOrder($order_id);
    $seatsByShowtime = [];
    foreach ($seatRows as $row){
      $seatsByShowtime[(int)$row['showtime_id']][] = $row['seat_code'];
    }
    $showtimeIds = [];
    foreach ($items as $it){
      if (!empty($it['showtime_id'])) $showtimeIds[] = (int)$it['showtime_id'];
    }
    $showtimeMap = ShowTime::mapByIds(array_values(array_unique($showtimeIds)));
    foreach ($items as &$it){
      $st = $showtimeMap[(int)($it['showtime_id'] ?? 0)] ?? null;
      if ($st){
        $it['showtime_label'] = date('d/m', strtotime($st['show_date'])) . ' ' . date('H:i', strtotime($st['show_time']));
      } else {
        $it['showtime_label'] = null;
      }
    }
    unset($it);
    $paymentTxn = PaymentManager::getTransactionByOrder($order_id);
    include __DIR__ . '/View/order_detail.php';
    break;

  case 'payment_verify':
    include __DIR__ . '/Controller/payment_verify.php';
    break;

  case 'order_status':
    include __DIR__ . '/Controller/order_status.php';
    break;

  case 'payment_settings':
    include __DIR__ . '/Controller/payment_settings.php';
    break;

  case 'users':
    require_once __DIR__ . '/../Model/khachhang.php';
    $users = KhachHang::listUsers();
    include __DIR__ . '/View/users.php';
    break;

  default:
    header('Location: index.php?act=dashboard'); exit;
}
?>
