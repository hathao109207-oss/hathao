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

$cinemas = $conn->query("SELECT * FROM cinemas ORDER BY name")->fetch_all(MYSQLI_ASSOC);
$movieShowtimes = $conn->query("SELECT * FROM showtimes WHERE movie_id = $id ORDER BY show_date, show_time")->fetch_all(MYSQLI_ASSOC);

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

  // Sync showtimes
  $submittedIds = [];
  if (isset($_POST['showtimes']) && is_array($_POST['showtimes'])) {
      foreach ($_POST['showtimes'] as $st) {
          $stId = isset($st['id']) ? (int)$st['id'] : 0;
          $cinema_id = (int)($st['cinema_id'] ?? 1);
          $show_date = trim($st['show_date'] ?? '');
          $show_time = trim($st['show_time'] ?? '');
          
          if ($show_date !== '' && $show_time !== '') {
              if ($stId > 0) {
                  // Update existing
                  $stmtST = $conn->prepare("UPDATE showtimes SET cinema_id=?, show_date=?, show_time=? WHERE id=? AND movie_id=?");
                  $stmtST->bind_param("issii", $cinema_id, $show_date, $show_time, $stId, $id);
                  $stmtST->execute();
                  $submittedIds[] = $stId;
              } else {
                  // Insert new
                  $stmtST = $conn->prepare("INSERT INTO showtimes (movie_id, cinema_id, show_date, show_time) VALUES (?, ?, ?, ?)");
                  $stmtST->bind_param("iiss", $id, $cinema_id, $show_date, $show_time);
                  $stmtST->execute();
                  $newId = $conn->insert_id;
                  if ($newId > 0) {
                      $submittedIds[] = $newId;
                  }
              }
          }
      }
  }

  // Delete showtimes that are no longer in the submitted list
  $currentST = [];
  $stmtList = $conn->prepare("SELECT id FROM showtimes WHERE movie_id=?");
  $stmtList->bind_param("i", $id);
  $stmtList->execute();
  $resList = $stmtList->get_result()->fetch_all(MYSQLI_ASSOC);
  foreach ($resList as $r) {
      $currentST[] = (int)$r['id'];
  }

  $toDelete = array_diff($currentST, $submittedIds);
  if (!empty($toDelete)) {
      foreach ($toDelete as $delId) {
          $stmtDel = $conn->prepare("DELETE FROM showtimes WHERE id=? AND movie_id=?");
          $stmtDel->bind_param("ii", $delId, $id);
          @$stmtDel->execute();
      }
  }

  header('Location: index.php?act=movies'); exit;
}

include __DIR__ . '/../View/movie_form.php';
?>
