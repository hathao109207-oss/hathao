<style>
  .user-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  .user-stat-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
  }
  .user-stat-card .stat-icon {
    font-size: 28px;
    margin-bottom: 8px;
  }
  .user-stat-card .stat-value {
    font-size: 24px;
    font-weight: 800;
    color: #ff6b35;
    font-family: 'Poppins', sans-serif;
  }
  .user-stat-card .stat-label {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    margin-top: 4px;
  }
  .recent-orders-mini {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 28px;
  }
  .recent-orders-mini h5 {
    color: #fff;
    font-size: 16px;
    margin-bottom: 16px;
  }
  .order-mini-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .order-mini-row:last-child { border-bottom: none; }
  .order-mini-id { font-weight: 700; color: #ff6b35; }
  .order-mini-amount { font-weight: 600; color: #fff; }
  @media (max-width: 576px) {
    .user-stats-grid { grid-template-columns: 1fr; }
  }
</style>

<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Tài khoản</p>
          <h1>Xin chào, <?= htmlspecialchars($user['name'] ?? 'Bạn') ?></h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-5 mb-5" style="max-width:900px;">
  <!-- Stats Cards -->
  <div class="user-stats-grid">
    <div class="user-stat-card">
      <div class="stat-icon">🎟</div>
      <div class="stat-value"><?= $totalOrders ?></div>
      <div class="stat-label">Tổng đơn hàng</div>
    </div>
    <div class="user-stat-card">
      <div class="stat-icon">✅</div>
      <div class="stat-value"><?= $completedOrders ?></div>
      <div class="stat-label">Đơn hoàn thành</div>
    </div>
    <div class="user-stat-card">
      <div class="stat-icon">💰</div>
      <div class="stat-value"><?= number_format($totalSpent) ?>đ</div>
      <div class="stat-label">Tổng chi tiêu</div>
    </div>
  </div>

  <!-- Recent Orders -->
  <?php if (!empty($recentOrders)): ?>
  <div class="recent-orders-mini">
    <h5><i class="fas fa-history mr-2" style="color:#ff6b35;"></i>Đơn hàng gần đây</h5>
    <?php foreach ($recentOrders as $o):
      $statusMap = [
        'CHO_XAC_NHAN' => ['label' => 'Chờ xác nhận', 'color' => '#ffb300'],
        'DANG_XAC_NHAN_THANH_TOAN' => ['label' => 'Đang xác minh', 'color' => '#00b0ff'],
        'DANG_GIAO' => ['label' => 'Đang xử lý', 'color' => '#00b0ff'],
        'HOAN_THANH' => ['label' => 'Hoàn thành', 'color' => '#00c853'],
        'DA_HUY' => ['label' => 'Đã hủy', 'color' => '#ff3d71'],
      ];
      $si = $statusMap[$o['status']] ?? ['label' => $o['status'], 'color' => '#999'];
    ?>
    <div class="order-mini-row">
      <div>
        <span class="order-mini-id">#<?= $o['id'] ?></span>
        <span style="color:<?= $si['color'] ?>; font-size:12px; margin-left:8px;"><?= $si['label'] ?></span>
      </div>
      <div>
        <span class="order-mini-amount"><?= number_format((int)$o['total_amount']) ?>đ</span>
        <a href="index.php?act=orderdetail&id=<?= $o['id'] ?>" style="color:#ff6b35; margin-left:12px; font-size:13px;">
          <i class="fas fa-eye"></i>
        </a>
      </div>
    </div>
    <?php endforeach; ?>
    <?php if ($totalOrders > 5): ?>
    <div style="text-align:center; margin-top:12px;">
      <a href="index.php?act=myorders" style="color:#ff6b35; font-size:13px;">Xem tất cả đơn hàng →</a>
    </div>
    <?php endif; ?>
  </div>
  <?php endif; ?>

  <!-- Forms -->
  <div class="row">
    <div class="col-md-6 mb-4">
      <div class="premium-form-wrap" style="height:100%;">
        <div class="premium-form-title" style="font-size:20px;">✏️ Cập nhật thông tin</div>
        <div class="premium-form-subtitle">Cập nhật họ tên và số điện thoại</div>
        <form method="post" action="index.php?act=account_update">
          <?= csrf_field() ?>
          <div class="premium-form-group">
            <label><i class="fas fa-user mr-1"></i> Họ tên</label>
            <input class="form-control" name="name" value="<?= htmlspecialchars($user['name']) ?>" required>
          </div>
          <div class="premium-form-group">
            <label><i class="fas fa-envelope mr-1"></i> Email</label>
            <input class="form-control" value="<?= htmlspecialchars($user['email']) ?>" disabled style="opacity:0.5; cursor:not-allowed;">
          </div>
          <div class="premium-form-group">
            <label><i class="fas fa-phone mr-1"></i> Số điện thoại</label>
            <input class="form-control" name="phone" value="<?= htmlspecialchars($user['phone'] ?? '') ?>">
          </div>
          <button class="boxed-btn w-100 mt-2" type="submit">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
        </form>
      </div>
    </div>

    <div class="col-md-6 mb-4">
      <div class="premium-form-wrap" style="height:100%;">
        <div class="premium-form-title" style="font-size:20px;">🔐 Đổi mật khẩu</div>
        <div class="premium-form-subtitle">Đặt lại mật khẩu bảo mật</div>
        <form method="post" action="index.php?act=change_password">
          <?= csrf_field() ?>
          <div class="premium-form-group">
            <label><i class="fas fa-lock mr-1"></i> Mật khẩu hiện tại</label>
            <input class="form-control" name="old_password" type="password" placeholder="••••••••" required>
          </div>
          <div class="premium-form-group">
            <label><i class="fas fa-key mr-1"></i> Mật khẩu mới</label>
            <input class="form-control" name="new_password" type="password" placeholder="Tối thiểu 6 ký tự" minlength="6" required>
          </div>
          <div class="premium-form-group">
            <label><i class="fas fa-check-circle mr-1"></i> Nhập lại mật khẩu mới</label>
            <input class="form-control" name="confirm_password" type="password" placeholder="Nhập lại mật khẩu mới" minlength="6" required>
          </div>
          <button class="boxed-btn w-100 mt-2" type="submit">
            <i class="fas fa-shield-alt"></i> Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
