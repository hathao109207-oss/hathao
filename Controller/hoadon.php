<?php
require_once __DIR__ . '/../Model/giohang.php';
require_once __DIR__ . '/../Model/hoadon.php';

if (empty($_SESSION['user'])) {
  $_SESSION['flash_error'] = 'Vui lòng đăng nhập trước khi đặt vé.';
  header('Location: index.php?act=login'); exit;
}

if (!csrf_verify()) {
  $_SESSION['flash_error'] = 'Phiên hết hạn. Vui lòng thử lại.';
  header('Location: index.php?act=order'); exit;
}

$items = GioHang::items();
if (!$items) { $_SESSION['flash_error']='Giỏ vé trống.'; header('Location: index.php?act=cart'); exit; }

$user = $_SESSION['user'];
$name = trim($user['name'] ?? '');
$email = trim($user['email'] ?? '');
$phone = trim($user['phone'] ?? '');
$note = trim($_POST['note'] ?? '');
if ($name===''||$email===''||$phone==='') {
  $_SESSION['flash_error']='Vui lòng nhập đầy đủ thông tin trong tài khoản trước khi đặt vé.';
  header('Location: index.php?act=account'); exit;
}

$total = GioHang::total();
$order_id = HoaDon::create((int)$_SESSION['user']['id'], ['name'=>$name,'email'=>$email,'phone'=>$phone,'note'=>$note], $items, $total);
GioHang::clear();

$_SESSION['flash_success'] = 'Đặt vé thành công! Vui lòng chọn ghế cho đơn #' . $order_id;
header('Location: index.php?act=seat&order_id=' . $order_id); exit;
?>
