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

<style>
  .billing-address-form input,
  .billing-address-form textarea {
    display: block;
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    padding: 12px 16px;
    transition: all 0.25s ease;
    margin-bottom: 16px;
  }

  .billing-address-form input:focus,
  .billing-address-form textarea:focus {
    background: rgba(255,255,255,0.1);
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255,107,53,0.2);
    outline: none;
  }

  .billing-address-form input::placeholder,
  .billing-address-form textarea::placeholder {
    color: rgba(255,255,255,0.35);
  }

  .billing-address-form label {
    display: block;
    color: rgba(255,255,255,0.7);
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 6px;
    letter-spacing: 0.3px;
  }
</style>

<div class="checkout-section mt-5 mb-5">
  <div class="container">
    <?php if(empty($items)): ?>
      <div class="text-center py-5">
        <i class="fas fa-shopping-cart" style="font-size:56px; color:rgba(255,255,255,0.15); display:block; margin-bottom:20px;"></i>
        <p style="color:rgba(255,255,255,0.5); font-size:18px;">Giỏ vé trống.</p>
        <a href="index.php?act=sanpham" class="boxed-btn mt-3">
          <i class="fas fa-film"></i> Chọn phim
        </a>
      </div>
    <?php else: ?>
      <div class="row">
        <div class="col-lg-8 mb-4">
          <div class="premium-form-wrap">
            <div class="premium-form-title" style="font-size:20px;">📋 Thông tin người đặt</div>
            <div class="premium-form-subtitle">Điền đầy đủ để hoàn tất đặt vé</div>
            <div class="billing-address-form">
              <form method="post" action="index.php?act=hoadon">
                <?= csrf_field() ?>
                <div class="form-group">
                  <label><i class="fas fa-user mr-1"></i> Họ tên</label>
                  <input name="name" type="text" placeholder="Nguyễn Văn A" required>
                </div>
                <div class="form-group">
                  <label><i class="fas fa-envelope mr-1"></i> Email</label>
                  <input name="email" type="email" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                  <label><i class="fas fa-phone mr-1"></i> Số điện thoại</label>
                  <input name="phone" type="text" placeholder="09xxxxxxxx" required>
                </div>
                <div class="form-group">
                  <label><i class="fas fa-sticky-note mr-1"></i> Ghi chú (tùy chọn)</label>
                  <textarea name="note" rows="4" placeholder="Yêu cầu đặc biệt hoặc ghi chú..."></textarea>
                </div>
                <?php if(empty($_SESSION['user'])): ?>
                  <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    Bạn cần <a href="index.php?act=login" style="color:#ffb300; font-weight:700;">đăng nhập</a> trước khi đặt vé.
                  </div>
                <?php else: ?>
                  <button class="boxed-btn w-100" type="submit">
                    <i class="fas fa-check-circle"></i> Xác nhận đặt vé
                  </button>
                <?php endif; ?>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="order-details-wrap">
            <h5 style="color:#fff; font-family:'Poppins',sans-serif; font-weight:700; margin-bottom:20px; font-size:16px; text-transform:uppercase; letter-spacing:1px;">
              🎟 Tóm tắt đơn hàng
            </h5>
            <table class="order-details" style="width:100%;">
              <thead>
                <tr>
                  <th>Phim</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody class="order-details-body">
                <?php foreach($items as $it): ?>
                <tr>
                  <td><?= htmlspecialchars($it['title']) ?> x<?= $it['qty'] ?></td>
                  <td style="white-space:nowrap; font-weight:700; color:#ff6b35;"><?= number_format($it['price']*$it['qty'], 0, '.', '.') ?>đ</td>
                </tr>
                <?php endforeach; ?>
              </tbody>
              <tbody class="checkout-details">
                <tr>
                  <td><b>Tổng cộng</b></td>
                  <td style="white-space:nowrap;"><b><?= number_format($total, 0, '.', '.') ?>đ</b></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    <?php endif; ?>
  </div>
</div>
