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
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: clamp(24px, 4vw, 38px);
    font-weight: 900;
    color: #fff;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .movie-price-tag {
    font-size: 32px;
    font-weight: 900;
    font-family: 'Be Vietnam Pro', sans-serif;
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
    font-family: 'Be Vietnam Pro', sans-serif;
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

          <?php
            // Group showtimes by cinema
            $cinemaGroup = [];
            $firstShowtimeId = 0;
            if (!empty($showtimes) && is_array($showtimes)) {
                $firstShowtimeId = (int)$showtimes[0]['id'];
                foreach ($showtimes as $st) {
                    $cName = !empty($st['cinema_name']) ? $st['cinema_name'] : 'Rạp hệ thống';
                    $label = date('H:i ', strtotime($st['show_time'])) . date('d/m', strtotime($st['show_date']));
                    $cinemaGroup[$cName][] = [
                        'id' => (int)$st['id'],
                        'label' => $label
                    ];
                }
            }
          ?>

          <form method="post" action="index.php?act=addcart">
            <?= csrf_field() ?>
            <input type="hidden" name="movie_id" value="<?= (int)$movie['id'] ?>">
            <input type="hidden" name="showtime_id" value="<?= $firstShowtimeId ?>">

            <div class="movie-qty-control mb-3">
              <span class="movie-qty-label">Số lượng vé:</span>
              <input type="number" name="qty" class="movie-qty-input" min="1" value="1">
            </div>
            <div class="d-flex flex-wrap" style="gap:12px; margin-bottom:16px;">
              <button type="submit" class="boxed-btn">
                <i class="fas fa-ticket-alt"></i> Thêm vào giỏ
              </button>
              <a href="#" class="btn-trailer btn-play-trailer" data-trailer-url="<?= htmlspecialchars($movie['trailer_url'] ?? '') ?>">
                <i class="fas fa-play-circle"></i> Xem trailer
              </a>
            </div>
          </form>

          <!-- Trailer Modal -->
          <div id="trailerModal" class="trailer-modal d-none">
            <div class="trailer-modal-overlay"></div>
            <div class="trailer-modal-content">
              <button type="button" class="trailer-modal-close">&times;</button>
              <div class="trailer-video-responsive">
                <iframe id="trailerIframe" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>

          <style>
          .trailer-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .trailer-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
          }
          .trailer-modal-content {
            position: relative;
            width: 90%;
            max-width: 800px;
            background: #000;
            border-radius: 4px;
            overflow: visible;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
            border: 4px solid #b39454;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            z-index: 10000;
          }
          .trailer-modal:not(.d-none) .trailer-modal-content {
            transform: scale(1);
          }
          .trailer-modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: #fff;
            font-size: 36px;
            line-height: 1;
            cursor: pointer;
            opacity: 0.8;
            transition: all 0.2s ease;
            z-index: 10001;
            padding: 0;
          }
          .trailer-modal-close:hover {
            opacity: 1;
            color: #b39454;
            transform: scale(1.1);
          }
          .trailer-video-responsive {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 ratio */
            height: 0;
            overflow: hidden;
            border-radius: 2px;
          }
          .trailer-video-responsive iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          </style>

          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const modal = document.getElementById('trailerModal');
              const iframe = document.getElementById('trailerIframe');
              
              function getYouTubeId(url) {
                if (!url) return null;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                return (match && match[2].length === 11) ? match[2] : null;
              }

              const playBtns = document.querySelectorAll('.btn-play-trailer');
              playBtns.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                  e.preventDefault();
                  const url = btn.getAttribute('data-trailer-url');
                  const ytId = getYouTubeId(url);
                  if (ytId) {
                    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + ytId + '?autoplay=1');
                    modal.classList.remove('d-none');
                  } else {
                    alert('Không tìm thấy đường dẫn video trailer hợp lệ!');
                  }
                });
              });

              const closeElements = document.querySelectorAll('.trailer-modal-close, .trailer-modal-overlay');
              closeElements.forEach(function(el) {
                el.addEventListener('click', function() {
                  modal.classList.add('d-none');
                  iframe.setAttribute('src', '');
                });
              });
            });
          </script>

          <a href="index.php?act=sanpham" class="back-link">
            <i class="fas fa-arrow-left"></i> Quay lại danh sách phim
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
