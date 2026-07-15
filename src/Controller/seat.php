<?php
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/seat.php';
require_once __DIR__ . '/../Model/showtime.php';
require_once __DIR__ . '/../Model/connect.php';

if (empty($_SESSION['user'])) {
  $_SESSION['flash_error'] = 'Vui lòng đăng nhập trước khi chọn ghế.';
  header('Location: index.php?act=login'); exit;
}

$order_id = (int)($_GET['order_id'] ?? $_POST['order_id'] ?? 0);
$order = HoaDon::findForUser($order_id, (int)$_SESSION['user']['id']);
if (!$order) { $_SESSION['flash_error']='Không thấy đơn của bạn.'; header('Location: index.php?act=myorders'); exit; }

$rawItems = HoaDon::items($order_id);
if (empty($rawItems)) { $_SESSION['flash_error']='Đơn không có vé.'; header('Location: index.php?act=myorders'); exit; }

// Gộp các order_items cùng movie_id: cộng dồn qty & line_total
$itemByMovie = [];
foreach ($rawItems as $it) {
  $mid = (int)$it['movie_id'];
  if (!isset($itemByMovie[$mid])) {
    $itemByMovie[$mid] = $it;
  } else {
    $itemByMovie[$mid]['qty']        = (int)$itemByMovie[$mid]['qty'] + (int)$it['qty'];
    $itemByMovie[$mid]['line_total'] = (int)$itemByMovie[$mid]['line_total'] + (int)$it['line_total'];
    // Ưu tiên giữ showtime_id nếu đã được chọn
    if (empty($itemByMovie[$mid]['showtime_id']) && !empty($it['showtime_id'])) {
      $itemByMovie[$mid]['showtime_id'] = $it['showtime_id'];
    }
  }
}
$items = array_values($itemByMovie);

$movieIds = array_unique(array_map(function($it){ return (int)$it['movie_id']; }, $items));
$showtimesByMovie = ShowTime::listByMovies($movieIds);

if (isset($_GET['set_showtime']) && isset($_GET['movie_id'])) {
  $movieId = (int)$_GET['movie_id'];
  $showtimeId = (int)$_GET['set_showtime'];
  $requestContext = sprintf(
    'seat set_showtime order_id=%d movie_id=%d showtime_id=%d user_id=%d uri=%s',
    $order_id,
    $movieId,
    $showtimeId,
    (int)($_SESSION['user']['id'] ?? 0),
    $_SERVER['REQUEST_URI'] ?? ''
  );
  error_log('[seat] ' . $requestContext);

  if (empty($itemByMovie[$movieId])) {
    error_log('[seat] selected movie_id not in order: ' . $requestContext);
    if (isset($_GET['ajax'])) {
      header('Content-Type: application/json; charset=UTF-8');
      echo json_encode(['ok' => false, 'message' => 'Phim này không thuộc đơn hàng.']);
      exit;
    }
    $_SESSION['flash_error'] = 'Phim này không thuộc đơn hàng.';
    header('Location: index.php?act=seat&order_id=' . $order_id); exit;
  }

  $st = ShowTime::findByMovieId($showtimeId, $movieId);
  if (!$st) {
    error_log('[seat] invalid showtime selected: ' . $requestContext);
    if (isset($_GET['ajax'])) {
      header('Content-Type: application/json; charset=UTF-8');
      echo json_encode(['ok' => false, 'message' => 'Suất chiếu không hợp lệ.']);
      exit;
    }
    $_SESSION['flash_error'] = 'Suất chiếu không hợp lệ.';
    header('Location: index.php?act=seat&order_id=' . $order_id . '&movie_id=' . $movieId); exit;
  }

  $stmt = $conn->prepare("UPDATE order_items SET showtime_id=? WHERE order_id=? AND movie_id=?");
  $stmt->bind_param("iii", $showtimeId, $order_id, $movieId);
  $stmt->execute();
  SeatReservation::clearByOrderMovie($order_id, $movieId);

  if (isset($_GET['ajax'])) {
    header('Content-Type: application/json; charset=UTF-8');
    $reserved = SeatReservation::reservedByShowtime($showtimeId);
    $selected = SeatReservation::byOrderAndShowtime($order_id, $showtimeId);
    echo json_encode([
      'ok' => true,
      'message' => 'Đã đổi suất chiếu thành công.',
      'showtime_id' => $showtimeId,
      'reservedSeats' => $reserved,
      'selectedSeats' => $selected
    ]);
    exit;
  }

  header('Location: index.php?act=seat&order_id=' . $order_id . '&movie_id=' . $movieId); exit;
}

$itemShowtime = [];
foreach ($items as &$it){
  $movieId = (int)$it['movie_id'];
  if (empty($it['showtime_id'])) {
    $first = $showtimesByMovie[$movieId][0] ?? null;
    if ($first) {
      $it['showtime_id'] = (int)$first['id'];
      // Cập nhật tất cả order_items cùng movie_id trong đơn này
      $stmt = $conn->prepare("UPDATE order_items SET showtime_id=? WHERE order_id=? AND movie_id=?");
      $stmt->bind_param("iii", $it['showtime_id'], $order_id, $movieId);
      $stmt->execute();
    }
  }
  $itemShowtime[$movieId] = (int)($it['showtime_id'] ?? 0);
}
unset($it);

// Rebuild itemByMovie sau khi update showtime (items đã gộp sẵn)
$itemByMovie = [];
foreach ($items as $it) {
  $itemByMovie[(int)$it['movie_id']] = $it;
}

$activeMovieId = isset($_GET['movie_id']) ? (int)$_GET['movie_id'] : (int)($_POST['movie_id'] ?? 0);
if (!$activeMovieId || empty($itemByMovie[$activeMovieId])) {
  $activeMovieId = (int)($items[0]['movie_id'] ?? 0);
}

$rows = range('A', 'H');
$cols = range(1, 10);
$reservedSeats = [];
$selectedSeats = [];
foreach ($itemByMovie as $movieId => $it){
  $showtimeId = (int)($itemShowtime[$movieId] ?? 0);
  $reservedSeats[$movieId] = $showtimeId ? SeatReservation::reservedByShowtime($showtimeId) : [];
  $selectedSeats[$movieId] = $showtimeId ? SeatReservation::byOrderAndShowtime($order_id, $showtimeId) : [];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
  $activeItem = $itemByMovie[$activeMovieId] ?? null;

  if (!$activeItem) {
    $_SESSION['flash_error'] = 'Không tìm thấy phim cần lưu ghế.';
    header('Location: index.php?act=seat&order_id=' . $order_id); exit;
  }

  $activeShowtimeId = (int)($itemShowtime[$activeMovieId] ?? 0);
  $activeExpected = (int)$activeItem['qty'];
  $activeSelected = array_map(function($s){ return strtoupper(trim($s)); }, $_POST['seats'][$activeMovieId] ?? []);
  $activeSelected = array_values(array_unique(array_filter($activeSelected)));

  if (isset($_POST['autosave'])) {
    header('Content-Type: application/json; charset=UTF-8');

    if ($activeShowtimeId === 0) {
      http_response_code(422);
      echo json_encode([
        'ok' => false,
        'message' => 'Vui lòng chọn suất chiếu trước.'
      ]);
      exit;
    }

    if (count($activeSelected) > $activeExpected) {
      http_response_code(422);
      echo json_encode([
        'ok' => false,
        'message' => 'Bạn chỉ được chọn tối đa ' . $activeExpected . ' ghế.'
      ]);
      exit;
    }

    $conflicts = SeatReservation::seatsTaken($activeShowtimeId, $activeSelected, $order_id);
    if (!empty($conflicts)) {
      http_response_code(409);
      echo json_encode([
        'ok' => false,
        'message' => 'Ghế ' . implode(', ', $conflicts) . ' đã có người đặt.',
        'conflicts' => array_values($conflicts)
      ]);
      exit;
    }

    SeatReservation::replaceSelection($order_id, $activeShowtimeId, $activeSelected);

    echo json_encode([
      'ok' => true,
      'message' => 'Đã lưu ghế tạm thời.',
      'seats' => array_values($activeSelected),
      'selected_count' => count($activeSelected),
      'expected_count' => $activeExpected
    ]);
    exit;
  }

  if ($activeShowtimeId === 0) {
    $_SESSION['flash_error'] = 'Vui lòng chọn suất chiếu cho phim ' . $activeItem['title'];
    header('Location: index.php?act=seat&order_id=' . $order_id . '&movie_id=' . $activeMovieId); exit;
  }

  if (count($activeSelected) !== $activeExpected) {
    $_SESSION['flash_error'] = 'Vui lòng chọn đủ ' . $activeExpected . ' ghế cho phim ' . $activeItem['title'];
    header('Location: index.php?act=seat&order_id=' . $order_id . '&movie_id=' . $activeMovieId); exit;
  }

  $conflicts = SeatReservation::seatsTaken($activeShowtimeId, $activeSelected, $order_id);
  if (!empty($conflicts)) {
    $_SESSION['flash_error'] = 'Ghế ' . implode(', ', $conflicts) . ' đã được đặt. Vui lòng chọn ghế khác.';
    header('Location: index.php?act=seat&order_id=' . $order_id . '&movie_id=' . $activeMovieId); exit;
  }

  SeatReservation::replaceSelection($order_id, $activeShowtimeId, $activeSelected);
  $selectedSeats[$activeMovieId] = $activeSelected;

  foreach ($items as $it) {
    $movieId = (int)$it['movie_id'];
    $expected = (int)$it['qty'];
    $showtimeId = (int)($itemShowtime[$movieId] ?? 0);

    if ($showtimeId === 0) {
      $_SESSION['flash_error'] = 'Vui lòng chọn suất chiếu cho phim ' . $it['title'];
      header('Location: index.php?act=seat&order_id=' . $order_id . '&movie_id=' . $movieId); exit;
    }

    $savedSeats = SeatReservation::byOrderAndShowtime($order_id, $showtimeId);
    if (count($savedSeats) !== $expected) {
      $_SESSION['flash_error'] = 'Vui lòng chọn đủ ' . $expected . ' ghế cho phim ' . $it['title'];
      header('Location: index.php?act=seat&order_id=' . $order_id . '&movie_id=' . $movieId); exit;
    }
  }

  $_SESSION['flash_success'] = 'Lưu ghế thành công! Hãy chọn bắp nước.';
  header('Location: index.php?act=snack&order_id=' . $order_id); exit;
}

include __DIR__ . '/../View/seat.php';
?>
