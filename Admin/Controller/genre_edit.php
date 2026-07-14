<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/loaihang.php';
$mode='edit';
$id=(int)($_GET['id'] ?? 0);
$genre = LoaiHang::find($id);
if(!$genre){ header('Location: index.php?act=genres'); exit; }
if ($_SERVER['REQUEST_METHOD']==='POST'){
  $name = trim($_POST['name'] ?? '');
  $icon = trim($_POST['icon_class'] ?? 'fas fa-film');
  LoaiHang::update($id,$name,$icon);
  header('Location: index.php?act=genres'); exit;
}
include __DIR__ . '/../View/genre_form.php';
?>
