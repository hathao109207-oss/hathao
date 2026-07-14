<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/loaihang.php';
$id=(int)($_GET['id'] ?? 0);
LoaiHang::delete($id);
header('Location: index.php?act=genres'); exit;
?>
