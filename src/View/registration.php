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
  <form method="post" action="index.php?act=registration">
    <?= csrf_field() ?>
    <div class="form-group">
      <label>Họ tên</label>
      <input class="form-control" name="name" required>
    </div>
    <div class="form-group">
      <label>Số điện thoại</label>
      <input class="form-control" name="phone" placeholder="VD: 09xxxxxxx">
    </div>
    <div class="form-group">
      <label>Email</label>
      <input class="form-control" name="email" type="email" required>
    </div>
    <div class="form-group">
      <label>Mật khẩu</label>
      <input class="form-control" name="password" type="password" minlength="6" required>
    </div>
    <button class="boxed-btn" type="submit">Tạo tài khoản</button>
  </form>
</div>
