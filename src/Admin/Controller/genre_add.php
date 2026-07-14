<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/loaihang.php';
$mode='add';
$genre=[];
if ($_SERVER['REQUEST_METHOD']==='POST'){
  $name = trim($_POST['name'] ?? '');
  $icon = trim($_POST['icon_class'] ?? 'fas fa-film');
  LoaiHang::create($name,$icon);
  header('Location: index.php?act=genres'); exit;
}
include __DIR__ . '/../View/genre_form.php';
?>
