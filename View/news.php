<?php
$newsItems = [
  [
    'title' => 'Cập nhật lịch chiếu cuối tuần tháng 2',
    'date' => '10/02/2026',
    'tag' => 'Lịch chiếu',
    'excerpt' => 'Danh sách suất chiếu mới cho các phim hot, bổ sung khung giờ khuya và tăng suất cuối tuần.',
    'image' => BASE_URL . 'assets/img/products/product-img-1.jpg',
  ],
  [
    'title' => 'Ưu đãi combo bắp nước dành cho học sinh, sinh viên',
    'date' => '08/02/2026',
    'tag' => 'Khuyến mãi',
    'excerpt' => 'Giảm 15% cho combo chọn trước khi thanh toán vé, áp dụng cả đặt vé online.',
    'image' => BASE_URL . 'assets/img/products/product-img-2.jpg',
  ],
  [
    'title' => 'Phòng chiếu mới: âm thanh Dolby 7.1',
    'date' => '05/02/2026',
    'tag' => 'Rạp chiếu',
    'excerpt' => 'Trải nghiệm chất lượng âm thanh mới, ghế ngả sâu và khu vực ghế đôi.',
    'image' => BASE_URL . 'assets/img/products/product-img-3.jpg',
  ],
  [
    'title' => 'Top 5 phim đáng xem trong tháng 2',
    'date' => '02/02/2026',
    'tag' => 'Gợi ý phim',
    'excerpt' => 'Danh sách phim được đánh giá cao cùng suất chiếu đẹp cho cặp đôi và gia đình.',
    'image' => BASE_URL . 'assets/img/products/product-img-4.jpg',
  ],
  [
    'title' => 'Hướng dẫn đặt vé nhanh chỉ với 3 bước',
    'date' => '30/01/2026',
    'tag' => 'Hướng dẫn',
    'excerpt' => 'Chọn phim, chọn ghế, thêm bắp nước và thanh toán — mọi thứ gói gọn trong vài phút.',
    'image' => BASE_URL . 'assets/img/products/product-img-5.jpg',
  ],
  [
    'title' => 'Mở bán vé sớm cho suất chiếu đặc biệt',
    'date' => '27/01/2026',
    'tag' => 'Sự kiện',
    'excerpt' => 'Đặt trước vé suất công chiếu đặc biệt để giữ vị trí ghế đẹp.',
    'image' => BASE_URL . 'assets/img/products/product-img-6.jpg',
  ],
];
?>

<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Cập nhật mới nhất</p>
          <h1>Tin tức phim</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-5 mb-5">
  <div class="row">
    <?php foreach ($newsItems as $item): ?>
      <div class="col-lg-4 col-md-6 mb-4 d-flex">
        <div class="card shadow-sm border-0 w-100">
          <img class="card-img-top" src="<?= htmlspecialchars($item['image']) ?>" alt="<?= htmlspecialchars($item['title']) ?>">
          <div class="card-body">
            <div class="mb-2">
              <span class="badge badge-primary"><?= htmlspecialchars($item['tag']) ?></span>
            </div>
            <h5 class="card-title"><?= htmlspecialchars($item['title']) ?></h5>
            <p class="text-muted small mb-2">
              <i class="far fa-calendar-alt"></i> <?= htmlspecialchars($item['date']) ?>
            </p>
            <p class="card-text"><?= htmlspecialchars($item['excerpt']) ?></p>
          </div>
          <div class="card-footer border-0">
            <a class="btn btn-outline-primary btn-sm" href="#" onclick="return false;">Xem thêm</a>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
  <div class="text-center mt-3">
    <a class="boxed-btn" href="#" onclick="return false;">Xem thêm bài viết</a>
  </div>
</div>
