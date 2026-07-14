<?php
require_once __DIR__ . '/../Model/hanghoa.php';
$featured = HangHoa::featured(8);
include __DIR__ . '/../View/home.php';
?>
