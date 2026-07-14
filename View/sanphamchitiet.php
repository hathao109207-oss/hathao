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

<style>
  .movie-detail-section {
    padding: 60px 0;
    position: relative;
    z-index: 1;
  }

  .movie-poster-wrap {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  }

  .movie-poster-wrap img {
    width: 100%;
    display: block;
    border-radius: 20px;
  }

  .movie-poster-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(255,107,53,0.9);
    color: #fff;
    border-radius: 8px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
  }

  .movie-info-wrap {
    padding: 8px 0;
  }

  .movie-genre-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,107,53,0.12);
    color: #ff6b35;
    border: 1px solid rgba(255,107,53,0.3);
    border-radius: 999px;
    padding: 4px 14px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .movie-title-detail {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(24px, 4vw, 38px);
    font-weight: 900;
    color: #fff;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .movie-price-tag {
    font-size: 32px;
    font-weight: 900;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #ff6b35, #f28123);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
  }

  .movie-price-tag small {
    font-size: 16px;
    font-weight: 400;
    color: rgba(255,255,255,0.4);
    -webkit-text-fill-color: rgba(255,255,255,0.4);
    font-family: 'Inter', sans-serif;
  }

  .movie-desc-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.35);
    margin-bottom: 12px;
  }

  .movie-description-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 20px;
    color: rgba(255,255,255,0.75);
    line-height: 1.85;
    font-size: 15px;
    margin-bottom: 28px;
  }

  .movie-qty-control {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .movie-qty-label {
    color: rgba(255,255,255,0.6);
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }

  .movie-qty-input {
    width: 90px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    color: #fff;
    text-align: center;
    font-weight: 700;
    font-size: 15px;
  }

  .movie-qty-input:focus {
    border-color: #ff6b35;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,107,53,0.2);
  }

  .btn-trailer {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: #fff;
    border-radius: 999px;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.25s ease;
    box-shadow: 0 8px 24px rgba(231,76,60,0.3);
  }

  .btn-trailer:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 36px rgba(231,76,60,0.45);
    color: #fff;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s ease;
    margin-top: 20px;
  }

  .back-link:hover {
    color: #ff6b35;
  }
</style>

<div class="movie-detail-section">
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
    <div class="row align-items-start">
      <div class="col-md-4 col-lg-4 mb-4 mb-md-0">
        <div class="movie-poster-wrap">
          <img src="<?= htmlspecialchars($posterUrl) ?>" alt="<?= htmlspecialchars($movie['title']) ?>">
          <div class="movie-poster-badge">🎬 Đang chiếu</div>
        </div>
      </div>

      <div class="col-md-8 col-lg-8">
        <div class="movie-info-wrap">
          <div class="movie-genre-badge">
            <i class="fas fa-film"></i>
            <?= htmlspecialchars($movie['genre_name'] ?? 'Phim') ?>
          </div>

          <h1 class="movie-title-detail"><?= htmlspecialchars($movie['title']) ?></h1>

          <div class="movie-price-tag">
            <?= number_format($movie['price']) ?>đ
            <small>/ vé</small>
          </div>

          <div class="movie-desc-label">Nội dung phim</div>
          <div class="movie-description-box">
            <?= nl2br(htmlspecialchars($movie['description'])) ?>
          </div>

          <form method="post" action="index.php?act=addcart">
            <?= csrf_field() ?>
            <input type="hidden" name="movie_id" value="<?= (int)$movie['id'] ?>">
            <div class="movie-qty-control">
              <span class="movie-qty-label">Số lượng vé:</span>
              <input type="number" name="qty" class="movie-qty-input" min="1" value="1">
            </div>
            <div class="d-flex flex-wrap" style="gap:12px; margin-bottom:16px;">
              <button type="submit" class="boxed-btn">
                <i class="fas fa-ticket-alt"></i> Thêm vào giỏ
              </button>
              <a href="trailer.php?id=<?= (int)$movie['id'] ?>" class="btn-trailer">
                <i class="fas fa-play-circle"></i> Xem trailer
              </a>
            </div>
          </form>

          <div class="movie-desc-label mt-4">Chọn suất chiếu & Đặt vé nhanh</div>
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
                      style="background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.06) !important;" 
                      method="post" action="index.php?act=quickseat">
                  <input type="hidden" name="showtime_id" value="<?= (int)$t['id'] ?>">
                  <div class="text-left">
                    <span class="font-weight-bold text-warning" style="font-size:15px;"><?= htmlspecialchars($labelTime) ?></span>
                    <span class="text-white-50 ml-2 small"><?= htmlspecialchars($labelDate) ?></span>
                    <?php if (!empty($t['cinema_name'])): ?>
                      <span class="d-block text-muted small mt-1">
                        <i class="fas fa-map-marker-alt mr-1"></i><?= htmlspecialchars($t['cinema_name']) ?>
                      </span>
                    <?php endif; ?>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="text-white-50 small mr-2">SL:</span>
                    <input class="form-control text-center text-white px-1" type="number" name="qty" min="1" value="1" 
                           style="width:60px; height:34px; border-radius:8px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.15);" 
                           aria-label="So ve">
                    <button class="boxed-btn btn-sm ml-2" type="submit" style="padding:6px 14px; font-size:12px; font-weight:600; min-width:80px;">
                      Đặt vé
                    </button>
                  </div>
                </form>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
          <div class="mt-3"></div>

          <a href="index.php?act=sanpham" class="back-link">
            <i class="fas fa-arrow-left"></i> Quay lại danh sách phim
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
