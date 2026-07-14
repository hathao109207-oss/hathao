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
  <form method="post" action="index.php?act=login">
    <?= csrf_field() ?>
    <div class="form-group">
      <label>Email</label>
      <input class="form-control" id="login_email" name="email" type="email" required>
    </div>
    <div class="form-group">
      <label>Mật khẩu</label>
      <input class="form-control" id="login_password" name="password" type="password" required>
    </div>
    <div class="d-flex align-items-center">
      <button class="boxed-btn" type="submit">Đăng nhập</button>
      <a class="ml-3" href="index.php?act=registration">Đăng ký</a>
      <a class="ml-3" href="index.php?act=forgetpassword">Quên mật khẩu</a>
    </div>

    <div class="mt-4 p-3 rounded text-center" style="background: rgba(0, 0, 0, 0.03); border: 1px dashed rgba(0, 0, 0, 0.1);">
      <div style="font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px;">
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
  </form>
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