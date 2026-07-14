<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/loaihang.php';
require_once __DIR__ . '/../../Model/connect.php';

$genres = LoaiHang::all();
$mode = 'edit';
$id = (int)($_GET['id'] ?? 0);
$stmt = $conn->prepare("SELECT * FROM movies WHERE id=?");
$stmt->bind_param("i",$id);
$stmt->execute();
$movie = $stmt->get_result()->fetch_assoc();
if (!$movie) { header('Location: index.php?act=movies'); exit; }

if ($_SERVER['REQUEST_METHOD']==='POST') {
  $title = trim($_POST['title'] ?? '');
  $priceInput = $_POST['price'] ?? '0';
  $price = (int)preg_replace('/[^\d]/', '', $priceInput); // strip thousand separators
  $genre_id = (int)($_POST['genre_id'] ?? 0);
  $duration_min = (int)($_POST['duration_min'] ?? 120);
  $rating = trim($_POST['rating'] ?? 'PG-13');
  $trailer_url = trim($_POST['trailer_url'] ?? '');
  $description = trim($_POST['description'] ?? '');

  $posterPath = $movie['poster'];
  if (!empty($_FILES['poster']['name'])) {
    $uploadDir = __DIR__ . '/../../assets/img/uploads/';
    if (!is_dir($uploadDir)) { mkdir($uploadDir, 0777, true); }
    $ext = strtolower(pathinfo($_FILES['poster']['name'], PATHINFO_EXTENSION));
    $fname = 'poster_' . time() . '_' . rand(100,999) . '.' . $ext;
    $dest = $uploadDir . $fname;
    if (move_uploaded_file($_FILES['poster']['tmp_name'], $dest)) {
      $posterPath = 'img/uploads/' . $fname;
    }
  }

  $stmt2 = $conn->prepare("UPDATE movies SET title=?,price=?,poster=?,description=?,genre_id=?,duration_min=?,rating=?,trailer_url=? WHERE id=?");
  $stmt2->bind_param("sississsi", $title,$price,$posterPath,$description,$genre_id,$duration_min,$rating,$trailer_url,$id);
  $stmt2->execute();
  header('Location: index.php?act=movies'); exit;
}

include __DIR__ . '/../View/movie_form.php';
?>
