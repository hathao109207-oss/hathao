<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Chi tiết phim</p>
          <h1><?= htmlspecialchars($movie['title']) ?></h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="single-product mt-5 mb-5">
  <?php
    $uploadDir = __DIR__ . '/../assets/img/uploads';
    $uploadPosters = [];
    if (is_dir($uploadDir)) {
      $uploadPosters = array_merge(
        glob($uploadDir . '/*.jpg') ?: [],
        glob($uploadDir . '/*.jpeg') ?: [],
        glob($uploadDir . '/*.png') ?: [],
        glob($uploadDir . '/*.webp') ?: []
      );
    }
    $fallbackPoster = 'assets/img/logo.png';
    $posterRel = $movie['poster'] ?? '';
    $posterFile = $posterRel ? (__DIR__ . '/../assets/' . $posterRel) : '';
    $posterUrl = $posterRel ? ('assets/' . $posterRel) : $fallbackPoster;
    if (!$posterRel || !is_file($posterFile)) {
      if (!empty($uploadPosters)) {
        $idx = (int)$movie['id'] % count($uploadPosters);
        $posterUrl = 'assets/img/uploads/' . basename($uploadPosters[$idx]);
      } else {
        $posterUrl = $fallbackPoster;
      }
    }
  ?>
  <div class="container">
    <div class="row">
      <div class="col-md-5">
        <img src="<?= htmlspecialchars($posterUrl) ?>" class="img-fluid" alt="">
      </div>
      <div class="col-md-7">
        <p class="single-product-pricing"><span><?= htmlspecialchars($movie['genre_name'] ?? 'Phim') ?></span> <?= number_format($movie['price']) ?>đ / vé</p>
        <p class="movie-description"><?= nl2br(htmlspecialchars($movie['description'])) ?></p>

        <form method="post" action="index.php?act=addcart" class="mt-3">
          <?= csrf_field() ?>
          <input type="hidden" name="movie_id" value="<?= (int)$movie['id'] ?>">
          <div class="form-inline">
            <label class="mr-2">Số lượng:</label>
            <input type="number" name="qty" class="form-control mr-2" min="1" value="1" style="width:120px">
            <button type="submit" class="cart-btn"><i class="fas fa-ticket-alt"></i> Đặt vé</button>
            <a href="trailer.php?id=<?= (int)$movie['id'] ?>" class="ml-2" style="display:inline-block;padding:10px 18px;background:#e74c3c;color:#fff;border-radius:24px;font-weight:600;"><i class="fas fa-play-circle"></i> Xem trailer</a>
          </div>
        </form>

        <h4 class="mt-4">Chọn suất chiếu & Đặt vé nhanh</h4>
        <?php if (empty($showtimes)): ?>
          <p class="text-muted font-italic">Chưa có suất chiếu nào cho phim này.</p>
        <?php else: ?>
          <div class="showtime-list mt-2 d-flex flex-column align-items-stretch" style="gap: 10px;">
            <?php foreach ($showtimes as $t): ?>
              <?php
                $labelTime = date('H:i', strtotime($t['show_time']));
                $labelDate = date('d/m', strtotime($t['show_date']));
              ?>
              <form class="showtime-quick-form d-flex justify-content-between align-items-center p-3 mb-2 rounded border" 
                    style="background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.08) !important;" 
                    method="post" action="index.php?act=quickseat">
                <input type="hidden" name="showtime_id" value="<?= (int)$t['id'] ?>">
                <div class="text-left">
                  <span class="font-weight-bold text-danger" style="font-size:15px;"><?= htmlspecialchars($labelTime) ?></span>
                  <span class="text-muted ml-2 small"><?= htmlspecialchars($labelDate) ?></span>
                  <?php if (!empty($t['cinema_name'])): ?>
                    <span class="d-block text-secondary small mt-1">
                      <i class="fas fa-map-marker-alt mr-1"></i><?= htmlspecialchars($t['cinema_name']) ?>
                    </span>
                  <?php endif; ?>
                </div>
                <div class="d-flex align-items-center">
                  <span class="text-muted small mr-2">SL:</span>
                  <input class="form-control text-center px-1" type="number" name="qty" min="1" value="1" 
                         style="width:60px; height:34px; border-radius:8px; background:#fff; border:1px solid #ccc; color:#000;" 
                         aria-label="So ve">
                  <button class="cart-btn btn-sm ml-2" type="submit" style="padding:6px 14px; font-size:12px; font-weight:600; min-width:80px;">
                    Đặt vé
                  </button>
                </div>
              </form>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <p class="mt-3"><a href="index.php?act=sanpham">← Quay lại danh sách</a></p>
      </div>
    </div>
  </div>
</div>
