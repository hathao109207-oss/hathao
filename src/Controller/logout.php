<?php
unset($_SESSION['user']);
$_SESSION['flash_success']='Đã đăng xuất.';
header('Location: index.php'); exit;
?>
