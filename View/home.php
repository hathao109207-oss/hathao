<div class="homepage-slider hero-bg owl-carousel" style="margin-top:-110px;">
  <div class="single-homepage-slider homepage-bg-1">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 offset-lg-2 text-center">
          <div class="hero-text">
            <div class="hero-text-tablecell">
              <p class="subtitle">Đặt vé online</p>
              <h1>Chọn phim yêu thích &amp; giữ chỗ trong 1 phút</h1>
              <div class="hero-btns">
                <a href="<?= BASE_URL ?>index.php?act=sanpham" class="boxed-btn">Xem phim</a>
                <a href="<?= BASE_URL ?>index.php?act=contact" class="bordered-btn">Liên hệ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="single-homepage-slider homepage-bg-2">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 offset-lg-2 text-center">
          <div class="hero-text">
            <div class="hero-text-tablecell">
              <p class="subtitle">Ưu đãi combo</p>
              <h1>Giá tốt cho thành viên &amp; đặt sớm</h1>
              <div class="hero-btns">
                <a href="<?= BASE_URL ?>index.php?act=account" class="boxed-btn">Tài khoản</a>
                <a href="<?= BASE_URL ?>index.php?act=sanpham" class="bordered-btn">Chọn suất</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="single-homepage-slider homepage-bg-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 offset-lg-2 text-center">
          <div class="hero-text">
            <div class="hero-text-tablecell">
              <p class="subtitle">Phim mới mỗi tuần</p>
              <h1>Khám phá trailer &amp; suất chiếu hot</h1>
              <div class="hero-btns">
                <a href="<?= BASE_URL ?>index.php?act=sanpham" class="boxed-btn">Đặt vé ngay</a>
                <a href="<?= BASE_URL ?>index.php?act=news" class="bordered-btn">Tin tức</a>
              </div>
            </div>
          </div>
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
      $fallbackPoster = BASE_URL . 'assets/img/logo.png';
    ?>
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="section-title">
          <h3><span class="orange-text">Phim</span> nổi bật</h3>
          <p>Danh sách phim mới cập nhật.</p>
        </div>
      </div>
    </div>

    <div class="row">
      <?php foreach($featured as $m): ?>
      <?php
        $posterRel = $m['poster'] ?? '';
        $posterFile = $posterRel ? (__DIR__ . '/../assets/' . $posterRel) : '';
        $posterUrl = $posterRel ? (BASE_URL . 'assets/' . $posterRel) : $fallbackPoster;
        if (!$posterRel || !is_file($posterFile)) {
          if (!empty($uploadPosters)) {
            $idx = (int)$m['id'] % count($uploadPosters);
            $posterUrl = BASE_URL . 'assets/img/uploads/' . basename($uploadPosters[$idx]);
          } else {
            $posterUrl = $fallbackPoster;
          }
        }
      ?>
      <div class="col-lg-3 col-md-6 text-center">
        <div class="single-product-item">
          <div class="product-image">
            <a href="<?= BASE_URL ?>index.php?act=sanphamchitiet&id=<?= $m['id'] ?>"><img src="<?= htmlspecialchars($posterUrl) ?>" alt=""></a>
          </div>
          <h3><?= htmlspecialchars($m['title']) ?></h3>
          <p class="product-price"><span><?= htmlspecialchars($m['genre_name'] ?? 'Phim') ?></span> <?= number_format($m['price']) ?>đ</p>
          <a href="<?= BASE_URL ?>index.php?act=sanphamchitiet&id=<?= $m['id'] ?>" class="cart-btn"><i class="fas fa-ticket-alt"></i> Đặt vé</a>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</div>

<div class="blog-section mt-4 mb-5">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="section-title">
          <h3><span class="orange-text">Tin</span> khuyến mại</h3>
          <p>Ưu đãi mới nhất từ Star Cinema.</p>
        </div>
      </div>
    </div>
    <div class="promo-carousel owl-carousel" style="display:block;">
      <?php
      $promos = [
        ['img'=>'assets/img/products/product-img-1.jpg','title'=>'Happy Day - Vé chỉ từ 45K'],
        ['img'=>'assets/img/products/product-img-2.jpg','title'=>'Ưu đãi thành viên Star Cinema 2025'],
        ['img'=>'assets/img/products/product-img-3.jpg','title'=>'Combo bắp nước U22 vui vẻ'],
        ['img'=>'assets/img/products/product-img-4.jpg','title'=>'Ngày tri ân Star Cinema'],
        ['img'=>'assets/img/products/product-img-5.jpg','title'=>'Star Cinema Rewards - Tích điểm đổi quà'],
        ['img'=>'assets/img/products/product-img-6.jpg','title'=>'Flash Sale cuối tuần - Vé chỉ từ 49K'],
      ];
      foreach ($promos as $p):
      ?>
      <div class="single-latest-news text-center">
        <div class="promo-card">
          <a class="latest-news-bg" href="<?= BASE_URL ?>index.php?act=news" style="background-image:url('<?= BASE_URL . $p['img'] ?>');"></a>
          <h4 class="mt-3 mb-0"><a href="<?= BASE_URL ?>index.php?act=news"><?= htmlspecialchars($p['title']) ?></a></h4>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</div>
