<?php
require_once __DIR__ . '/../Model/phantrang.php';
require_once __DIR__ . '/../Model/hanghoa.php';
require_once __DIR__ . '/../Model/showtime.php';
require_once __DIR__ . '/../Model/cinema.php';
require_once __DIR__ . '/../Model/connect.php';

$genre_id = isset($_GET['genre_id']) && $_GET['genre_id']!=='' ? (int)$_GET['genre_id'] : null;
$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$region = isset($_GET['region']) ? trim((string)$_GET['region']) : '';
$page = isset($_GET['page']) ? max(1,(int)$_GET['page']) : 1;

$genres = $conn->query("SELECT * FROM genres ORDER BY name")->fetch_all(MYSQLI_ASSOC);
$regions = Cinema::regions();
$pager = HangHoa::paginate($genre_id, $q, $page, 6);
$movieIds = array_map(function($m){ return (int)$m['id']; }, $pager['rows']);
$showtimesByMovie = ShowTime::listByMovies($movieIds, $region !== '' ? $region : null);

include __DIR__ . '/../View/sanpham.php';
?>
