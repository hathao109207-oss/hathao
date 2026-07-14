<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/connect.php';
$id = (int)($_GET['id'] ?? 0);
$stmt = $conn->prepare("DELETE FROM movies WHERE id=?");
$stmt->bind_param("i",$id);
$stmt->execute();
header('Location: index.php?act=movies'); exit;
?>
