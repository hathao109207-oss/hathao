<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Tài khoản</p>
          <h1>Thông tin cá nhân</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-5 mb-5" style="max-width:720px;">
  <div class="row">
    <div class="col-md-6">
      <h4>Cập nhật thông tin</h4>
      <form method="post" action="index.php?act=account_update">
        <?= csrf_field() ?>
        <div class="form-group">
          <label>Họ tên</label>
          <input class="form-control" name="name" value="<?= htmlspecialchars($user['name']) ?>" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input class="form-control" value="<?= htmlspecialchars($user['email']) ?>" disabled>
        </div>
        <div class="form-group">
          <label>Số điện thoại</label>
          <input class="form-control" name="phone" value="<?= htmlspecialchars($user['phone'] ?? '') ?>">
        </div>
        <button class="boxed-btn" type="submit">Lưu</button>
      </form>
    </div>

    <div class="col-md-6">
      <h4>Đổi mật khẩu</h4>
      <form method="post" action="index.php?act=change_password">
        <?= csrf_field() ?>
        <div class="form-group">
          <label>Mật khẩu hiện tại</label>
          <input class="form-control" name="old_password" type="password" required>
        </div>
        <div class="form-group">
          <label>Mật khẩu mới</label>
          <input class="form-control" name="new_password" type="password" minlength="6" required>
        </div>
        <div class="form-group">
          <label>Nhập lại mật khẩu mới</label>
        
          <input class="form-control" name="confirm_password" type="password" minlength="6" required>
        </div>
        <button class="boxed-btn" type="submit">Đổi mật khẩu</button>
      </form>
    </div>
  </div>
</div>
