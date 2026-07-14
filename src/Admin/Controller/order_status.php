<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/hoadon.php';
$id = (int)($_POST['id'] ?? 0);
$status = $_POST['status'] ?? 'CHO_XAC_NHAN';
$allowed = ['CHO_XAC_NHAN','DANG_GIAO','HOAN_THANH','DA_HUY'];
if (!in_array($status,$allowed,true)) $status='CHO_XAC_NHAN';
HoaDon::updateStatus($id,$status);
header('Location: index.php?act=orders'); exit;
?>
