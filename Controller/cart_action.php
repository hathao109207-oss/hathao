<?php
require_once __DIR__ . '/../Model/giohang.php';
require_once __DIR__ . '/../Model/hanghoa.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !csrf_verify()) {
  $_SESSION['flash_error'] = 'Phiên hết hạn. Vui lòng thử lại.';
  header('Location: index.php?act=cart'); exit;
}

$action = $_GET['action'] ?? '';
if ($action === 'add') {
  $movie_id = (int)($_POST['movie_id'] ?? 0);
  $qty = max(1, (int)($_POST['qty'] ?? 1));
  $m = HangHoa::find($movie_id);
  if ($m) GioHang::add($movie_id, $m['title'], (int)$m['price'], $qty);
  header('Location: index.php?act=order'); exit;
}
if ($action === 'update') {
  foreach (($_POST['qty'] ?? []) as $movie_id => $qty) {
    GioHang::update((int)$movie_id, (int)$qty);
  }
  $_SESSION['flash_success'] = 'Đã cập nhật giỏ hàng.';
  header('Location: index.php?act=cart'); exit;
}
if ($action === 'remove') {
  $id = (int)($_GET['id'] ?? 0);
  GioHang::remove($id);
  $_SESSION['flash_success'] = 'Đã xóa khỏi giỏ hàng.';
  header('Location: index.php?act=cart'); exit;
}
header('Location: index.php?act=cart'); exit;
?>
