<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../../Model/loaihang.php';
require_once __DIR__ . '/../../Model/connect.php';

$genres = LoaiHang::all();
$movie = [];
$mode = 'add';

if ($_SERVER['REQUEST_METHOD']==='POST') {
  $title = trim($_POST['title'] ?? '');
  $priceInput = $_POST['price'] ?? '0';
  $price = (int)preg_replace('/[^\d]/', '', $priceInput); // strip thousand separators
  $genre_id = (int)($_POST['genre_id'] ?? 0);
  $duration_min = (int)($_POST['duration_min'] ?? 120);
  $rating = trim($_POST['rating'] ?? 'PG-13');
  $trailer_url = trim($_POST['trailer_url'] ?? '');
  $description = trim($_POST['description'] ?? '');

  $posterPath = 'img/products/product-img-1.jpg';
  if (!empty($_FILES['poster']['name'])) {
    $uploadDir = __DIR__ . '/../../assets/img/uploads/';
    if (!is_dir($uploadDir)) { mkdir($uploadDir, 0777, true); }
    $ext = strtolower(pathinfo($_FILES['poster']['name'], PATHINFO_EXTENSION));
    $fname = 'poster_' . time() . '_' . rand(100,999) . '.' . $ext;
    $dest = $uploadDir . $fname;
    if (move_uploaded_file($_FILES['poster']['tmp_name'], $dest)) {
      $posterPath = 'img/uploads/' . $fname; // front/back both prepend assets/
    }
  }

  $stmt = $conn->prepare("INSERT INTO movies(title,price,poster,description,genre_id,duration_min,rating,trailer_url) VALUES (?,?,?,?,?,?,?,?)");
  $stmt->bind_param("sississs", $title,$price,$posterPath,$description,$genre_id,$duration_min,$rating,$trailer_url);
  $stmt->execute();
  header('Location: index.php?act=movies'); exit;
}

include __DIR__ . '/../View/movie_form.php';
?>
