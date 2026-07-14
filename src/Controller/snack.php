<?php
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/seat.php';

if (empty($_SESSION['user'])) {
  $_SESSION['flash_error'] = 'Vui lòng đăng nhập trước khi chọn bắp nước.';
  header('Location: index.php?act=login'); exit;
}

$order_id = (int)($_GET['order_id'] ?? $_POST['order_id'] ?? 0);
$order = HoaDon::findForUser($order_id, (int)$_SESSION['user']['id']);
if (!$order) {
  $_SESSION['flash_error'] = 'Không thấy đơn của bạn.';
  header('Location: index.php?act=myorders'); exit;
}

$seatNeed = HoaDon::seatNeed($order_id);
$seatSelected = count(SeatReservation::byOrder($order_id));
if ($seatNeed > 0 && $seatSelected < $seatNeed) {
  $_SESSION['flash_error'] = 'Vui lòng chọn đủ ghế trước khi chọn bắp nước.';
  header('Location: index.php?act=seat&order_id=' . $order_id); exit;
}

$combos = [
  ['id'=>'combo_mini', 'name'=>'Combo Mini', 'desc'=>'1 bắp nhỏ + 1 nước', 'price'=>45000],
  ['id'=>'combo_vui', 'name'=>'Combo Vui Vẻ', 'desc'=>'1 bắp vừa + 2 nước', 'price'=>65000],
  ['id'=>'combo_couple', 'name'=>'Combo Couple', 'desc'=>'1 bắp lớn + 2 nước + 1 snack', 'price'=>85000],
  ['id'=>'nuoc_le', 'name'=>'Nước lẻ', 'desc'=>'1 ly nước ngọt', 'price'=>20000],
  ['id'=>'bap_le', 'name'=>'Bắp lẻ', 'desc'=>'1 phần bắp', 'price'=>30000],
];

$selected = $_SESSION['snacks'][$order_id]['items'] ?? [];
$selectedMap = [];
foreach ($selected as $it) {
  $selectedMap[$it['id']] = (int)$it['qty'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = $_POST['snacks'] ?? [];
  $picked = [];
  $total = 0;
  foreach ($combos as $c) {
    $qty = (int)($input[$c['id']] ?? 0);
    if ($qty > 0) {
      $line = $qty * (int)$c['price'];
      $picked[] = [
        'id' => $c['id'],
        'name' => $c['name'],
        'price' => (int)$c['price'],
        'qty' => $qty,
        'line_total' => $line
      ];
      $total += $line;
    }
  }
  $_SESSION['snacks'][$order_id] = [
    'items' => $picked,
    'total' => $total
  ];
  header('Location: index.php?act=payment&order_id=' . $order_id); exit;
}

include __DIR__ . '/../View/snack.php';
?>
