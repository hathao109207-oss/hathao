<?php
require_once __DIR__ . '/../Model/giohang.php';
require_once __DIR__ . '/../Model/hanghoa.php';

$action = $_GET['action'] ?? '';
if ($action==='add') {
  $movie_id = (int)($_POST['movie_id'] ?? 0);
  $qty = (int)($_POST['qty'] ?? 1);
  $m = HangHoa::find($movie_id);
  if ($m) GioHang::add($movie_id, $m['title'], (int)$m['price'], $qty);
  // Sau khi thêm vé, dẫn thẳng đến bước thanh toán để tiếp tục chọn ghế
  header('Location: index.php?act=order'); exit;
}
if ($action==='update') {
  foreach (($_POST['qty'] ?? []) as $movie_id => $qty){
    GioHang::update((int)$movie_id, (int)$qty);
  }
  header('Location: index.php?act=cart'); exit;
}
if ($action==='remove') {
  $id = (int)($_GET['id'] ?? 0);
  GioHang::remove($id);
  header('Location: index.php?act=cart'); exit;
}
header('Location: index.php?act=cart'); exit;
?>
