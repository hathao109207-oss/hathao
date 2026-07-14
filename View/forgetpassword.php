<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Tài khoản</p>
          <h1>Quên mật khẩu</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-5 mb-5" style="max-width:520px;">
  <div class="premium-form-wrap">
    <div class="premium-form-title" style="font-size:22px;">🔑 Đặt lại mật khẩu</div>
    <div class="premium-form-subtitle">Nhập email để nhận liên kết đặt lại mật khẩu</div>
    <form method="post" action="index.php?act=forgetpassword">
      <?= csrf_field() ?>
      <div class="premium-form-group">
        <label><i class="fas fa-envelope mr-1"></i> Địa chỉ Email</label>
        <input class="form-control" name="email" type="email" placeholder="your@email.com" required>
      </div>
      <button class="boxed-btn w-100 mt-2" type="submit">
        <i class="fas fa-paper-plane"></i> Gửi yêu cầu
      </button>
    </form>
    <div class="mt-3 text-center" style="font-size:13px; color:rgba(255,255,255,0.4);">
      <i class="fas fa-info-circle mr-1"></i>
      Hệ thống sẽ gửi link đặt lại qua email hoặc hiển thị link demo.
    </div>
    <div class="mt-3 text-center">
      <a href="index.php?act=login" class="form-link" style="font-size:14px;">
        <i class="fas fa-arrow-left mr-1"></i> Quay lại đăng nhập
      </a>
    </div>
  </div>
</div>