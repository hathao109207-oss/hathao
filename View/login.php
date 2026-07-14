<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Tài khoản</p>
          <h1>Đăng nhập</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-5 mb-5" style="max-width:520px;">
  <div class="premium-form-wrap">
    <div class="premium-form-title">Chào mừng trở lại 👋</div>
    <div class="premium-form-subtitle">Đăng nhập để đặt vé và theo dõi đơn hàng</div>
    <form method="post" action="index.php?act=login">
      <?= csrf_field() ?>
      <div class="premium-form-group">
        <label for="login_email"><i class="fas fa-envelope mr-1"></i> Email</label>
        <input class="form-control" id="login_email" name="email" type="email" placeholder="your@email.com" required>
      </div>
      <div class="premium-form-group">
        <label for="login_password"><i class="fas fa-lock mr-1"></i> Mật khẩu</label>
        <input class="form-control" id="login_password" name="password" type="password" placeholder="••••••••" required>
      </div>
      <div class="d-flex align-items-center justify-content-between mt-4" style="gap:12px;">
        <button class="boxed-btn" type="submit" style="flex:1;">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập
        </button>
      </div>

      <div class="mt-4 p-3 rounded text-center" style="background: rgba(255, 255, 255, 0.04); border: 1px dashed rgba(255, 255, 255, 0.1);">
        <div style="font-size: 13px; font-weight: 600; color: rgba(255, 255, 255, 0.7); margin-bottom: 8px;">
          <i class="fas fa-magic text-warning mr-1"></i> Đăng nhập nhanh để test thử:
        </div>
        <div class="d-flex justify-content-center" style="gap: 10px;">
          <button type="button" class="btn btn-sm btn-outline-info" onclick="quickFill('user@cineticket.com', 'User@123')" style="font-size: 12px; padding: 6px 12px; border-radius: 8px; font-weight: 600;">
            <i class="fas fa-user mr-1"></i> Khách hàng (User)
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="quickFill('admin@cineticket.com', 'Admin@123')" style="font-size: 12px; padding: 6px 12px; border-radius: 8px; font-weight: 600;">
            <i class="fas fa-user-shield mr-1"></i> Quản trị (Admin)
          </button>
        </div>
      </div>

      <div class="mt-3 text-center" style="font-size:14px; color:rgba(255,255,255,0.6);">
        Chưa có tài khoản?
        <a class="form-link ml-1" href="index.php?act=registration">Đăng ký ngay</a>
        &nbsp;·&nbsp;
        <a class="form-link" href="index.php?act=forgetpassword">Quên mật khẩu?</a>
      </div>
    </form>
  </div>
</div>

<script>
function quickFill(email, password) {
  var emailField = document.getElementById('login_email');
  var passField = document.getElementById('login_password');
  if (emailField && passField) {
    emailField.value = email;
    passField.value = password;
    emailField.form.submit();
  }
}
</script>