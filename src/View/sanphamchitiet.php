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

        <form method="post" action="index.php?act=addcart" class="mt-3">
          <?= csrf_field() ?>
          <input type="hidden" name="movie_id" value="<?= (int)$movie['id'] ?>">
          <input type="hidden" name="showtime_id" value="<?= $firstShowtimeId ?>">

          <div class="form-inline">
            <label class="mr-2">Số lượng:</label>
            <input type="number" name="qty" class="form-control mr-2" min="1" value="1" style="width:120px">
            <button type="submit" class="cart-btn"><i class="fas fa-ticket-alt"></i> Đặt vé</button>
            <a href="#" class="ml-2 btn-play-trailer" data-trailer-url="<?= htmlspecialchars($movie['trailer_url'] ?? '') ?>" style="display:inline-block;padding:10px 18px;background:#e74c3c;color:#fff;border-radius:24px;font-weight:600;"><i class="fas fa-play-circle"></i> Xem trailer</a>
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

        <p class="mt-3"><a href="index.php?act=sanpham">← Quay lại danh sách</a></p>
      </div>
    </div>
  </div>
</div>
