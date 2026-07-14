<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Tài khoản</p>
          <h1>Đăng ký</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-5 mb-5" style="max-width:520px;">
  <div class="premium-form-wrap">
    <div class="premium-form-title">Tạo tài khoản 🎬</div>
    <div class="premium-form-subtitle">Tham gia CineTicket để nhận ưu đãi độc quyền</div>
    <form method="post" action="index.php?act=registration">
      <?= csrf_field() ?>
      <div class="premium-form-group">
        <label for="reg_name"><i class="fas fa-user mr-1"></i> Họ tên</label>
        <input class="form-control" id="reg_name" name="name" placeholder="Nguyễn Văn A" required>
      </div>
      <div class="premium-form-group">
        <label for="reg_phone"><i class="fas fa-phone mr-1"></i> Số điện thoại</label>
        <input class="form-control" id="reg_phone" name="phone" placeholder="09xxxxxxxx">
      </div>
      <div class="premium-form-group">
        <label for="reg_email"><i class="fas fa-envelope mr-1"></i> Email</label>
        <input class="form-control" id="reg_email" name="email" type="email" placeholder="your@email.com" required>
      </div>
      <div class="premium-form-group">
        <label for="reg_password"><i class="fas fa-lock mr-1"></i> Mật khẩu</label>
        <input class="form-control" id="reg_password" name="password" type="password" placeholder="Tối thiểu 6 ký tự" minlength="6" required>
      </div>
      <div class="mt-4">
        <button class="boxed-btn w-100" type="submit">
          <i class="fas fa-user-plus"></i> Tạo tài khoản
        </button>
      </div>
      <div class="mt-3 text-center" style="font-size:14px; color:rgba(255,255,255,0.6);">
        Đã có tài khoản?
        <a class="form-link ml-1" href="index.php?act=login">Đăng nhập</a>
      </div>
    </form>
  </div>
</div>
