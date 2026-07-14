<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Thông tin đặt vé</p>
          <h1>Xác nhận thông tin</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="checkout-section mt-5 mb-5">
  <div class="container">
    <?php if(empty($items)): ?>
      <p>Giỏ vé trống. <a href="index.php?act=sanpham">Chọn phim</a></p>
    <?php else: ?>
      <div class="row">
        <div class="col-lg-8">
          <div class="billing-address-form">
            <form method="post" action="index.php?act=hoadon">
              <p><input name="name" type="text" placeholder="Họ tên" required></p>
              <p><input name="email" type="email" placeholder="Email" required></p>
              <p><input name="phone" type="text" placeholder="Số điện thoại" required></p>
              <p><textarea name="note" cols="30" rows="5" placeholder="Ghi chú"></textarea></p>
              <?php if(empty($_SESSION['user'])): ?>
                <p class="text-danger">Bạn cần đăng nhập trước khi đặt vé. <a href="index.php?act=login">Đăng nhập</a></p>
              <?php else: ?>
                <button class="boxed-btn" type="submit">Xác nhận đặt vé</button>
              <?php endif; ?>
            </form>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="order-details-wrap">
            <table class="order-details">
              <thead><tr><th>Vé</th><th>Tổng</th></tr></thead>
              <tbody class="order-details-body">
                <?php foreach($items as $it): ?>
                <tr><td><?= htmlspecialchars($it['title']) ?> x<?= $it['qty'] ?></td><td><?= number_format($it['price']*$it['qty'], 0, '.', '.') ?>đ</td></tr>
                <?php endforeach; ?>
              </tbody>
              <tbody class="checkout-details">
                <tr><td><b>Tổng</b></td><td><b><?= number_format($total, 0, '.', '.') ?>đ</b></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    <?php endif; ?>
  </div>
</div>
