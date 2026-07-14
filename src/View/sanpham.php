<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row mb-4">
      <div class="col">
        <h5>Danh mục</h5>
        <div class="d-flex flex-wrap">
          <a class="<?= empty($genre_id) ? 'boxed-btn' : 'bordered-btn' ?> mr-2 mb-2" href="index.php?act=sanpham">Tất cả</a>
          <?php foreach($genres as $g): ?>
            <a class="<?= ((int)$genre_id === (int)$g['id']) ? 'boxed-btn' : 'bordered-btn' ?> mr-2 mb-2" href="index.php?act=sanpham&genre_id=<?= $g['id'] ?>">
              <i class="<?= htmlspecialchars($g['icon_class']) ?>"></i> <?= htmlspecialchars($g['name']) ?>
            </a>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Danh sách phim</p>
          <h1>Phim đang chiếu</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="product-section mt-5 mb-5">
  <div class="container">
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
    ?>

    <?php
      // Mã khu vực lưu trong DB (và trên URL). Hiển thị có thể có dấu.
      $regionLabels = [
        'tphcm' => 'TP.HCM',
        'vung-tau' => 'Vũng Tàu',
        'can-tho' => 'Cần Thơ',
      ];
    ?>

    <form class="row mb-4" method="get" action="index.php">
      <input type="hidden" name="act" value="sanpham">
      <div class="col-md-5">
        <input class="form-control" name="q" placeholder="Tìm kiếm phim..." value="<?= htmlspecialchars($q ?? '') ?>">
      </div>
      <div class="col-md-3">
        <select class="form-control" name="genre_id">
          <option value="">-- Thể loại --</option>
          <?php foreach($genres as $g): ?>
            <option value="<?= $g['id'] ?>" <?= ($genre_id==$g['id'])?'selected':'' ?>><?= htmlspecialchars($g['name']) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-2">
        <select class="form-control" name="region">
          <option value="">-- Khu vực --</option>
          <?php foreach(($regions ?? []) as $r): ?>
            <option value="<?= htmlspecialchars($r) ?>" <?= (isset($region) && $region===$r)?'selected':'' ?>>
              <?= htmlspecialchars($regionLabels[$r] ?? $r) ?>
            </option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-2">
        <button class="boxed-btn" type="submit">Lọc</button>
      </div>
    </form>

    <div class="row">
      <?php foreach($pager['rows'] as $m): ?>
      <?php
        $posterRel = $m['poster'] ?? '';
        $posterFile = $posterRel ? (__DIR__ . '/../assets/' . $posterRel) : '';
        $posterUrl = $posterRel ? ('assets/' . $posterRel) : $fallbackPoster;
        if (!$posterRel || !is_file($posterFile)) {
          if (!empty($uploadPosters)) {
            $idx = (int)$m['id'] % count($uploadPosters);
            $posterUrl = 'assets/img/uploads/' . basename($uploadPosters[$idx]);
          } else {
            $posterUrl = $fallbackPoster;
          }
        }
      ?>
      <div class="col-lg-4 col-md-6 text-center">
        <div class="single-product-item">
          <div class="product-image">
            <a href="index.php?act=sanphamchitiet&id=<?= $m['id'] ?>"><img src="<?= htmlspecialchars($posterUrl) ?>" alt=""></a>
          </div>
          <h3><?= htmlspecialchars($m['title']) ?></h3>
          <p class="product-price"><span><?= htmlspecialchars($m['genre_name'] ?? 'Phim') ?></span> <?= number_format($m['price']) ?>đ</p>
          <a href="#showtimes-<?= $m['id'] ?>" class="cart-btn" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="showtimes-<?= $m['id'] ?>">
            <i class="fas fa-ticket-alt"></i> Đặt vé
          </a>
          <?php $times = $showtimesByMovie[$m['id']] ?? []; ?>
          <?php if (!empty($times)): ?>
          <div id="showtimes-<?= $m['id'] ?>" class="collapse showtime-list">
            <?php foreach($times as $t): ?>
              <?php
                $labelTime = date('H:i', strtotime($t['show_time']));
                $labelDate = date('d/m', strtotime($t['show_date']));
              ?>
              <form class="showtime-quick-form" method="post" action="index.php?act=quickseat">
                <input type="hidden" name="showtime_id" value="<?= (int)$t['id'] ?>">
                <input class="showtime-qty" type="number" name="qty" min="1" value="1" aria-label="So ve">
                <button class="showtime-btn" type="submit">
                  <?= htmlspecialchars($labelTime) ?>
                  <span class="text-muted">
                    <?= htmlspecialchars($labelDate) ?>
                    <?php if (!empty($t['cinema_name'])): ?>
                      - <?= htmlspecialchars($t['cinema_name']) ?>
                    <?php endif; ?>
                  </span>
                </button>
              </form>
            <?php endforeach; ?>
          </div>
          <?php endif; ?>
        </div>
      </div>
      <?php endforeach; ?>
    </div>

    <?php
      $totalPages = PhanTrang::totalPages($pager['total'], $pager['perPage']);
      if ($totalPages > 1):
    ?>
      <div class="row mt-4">
        <div class="col text-center">
          <?php for($p=1;$p<=$totalPages;$p++): ?>
            <a class="<?= ($p==$pager['page']) ? 'boxed-btn' : 'bordered-btn' ?>" style="margin:2px; min-width:40px; text-align:center;"
               href="index.php?act=sanpham&page=<?= $p ?>&genre_id=<?= urlencode((string)$genre_id) ?>&q=<?= urlencode((string)$q) ?>&region=<?= urlencode((string)($region ?? '')) ?>">
               <?= $p ?>
            </a>
          <?php endfor; ?>
        </div>
      </div>
    <?php endif; ?>
  </div>
</div>

<style>
/* Maintain flex alignment for showtimes list when expanded by Bootstrap Collapse */
.showtime-list.show {
  display: flex !important;
}
</style>
