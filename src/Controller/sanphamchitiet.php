<?php
require_once __DIR__ . '/../Model/hanghoa.php';
require_once __DIR__ . '/../Model/showtime.php';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$movie = HangHoa::find($id);
if(!$movie){ echo "<h2>Không tìm thấy phim</h2>"; return; }
$showtimes = ShowTime::listByMovie($id);
include __DIR__ . '/../View/sanphamchitiet.php';
?>
