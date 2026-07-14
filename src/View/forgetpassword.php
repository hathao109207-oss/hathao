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
  <form method="post" action="index.php?act=forgetpassword">
    <?= csrf_field() ?>
    <div class="form-group">
      <label>Nhập email</label>
      <input class="form-control" name="email" type="email" required>
    </div>
    <button class="boxed-btn" type="submit">Gửi yêu cầu</button>
  </form>
  <p class="mt-3"><small>Có thể nâng cấp gửi email bằng PHPMailer theo file hướng dẫn.</small></p>
</div>