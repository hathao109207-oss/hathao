<?php
require_once __DIR__ . '/../../config.php';
if (empty($_SESSION['user']) || ($_SESSION['user']['role'] ?? '') !== 'admin') {
  header('Location: ../index.php?act=login'); exit;
}
?>
