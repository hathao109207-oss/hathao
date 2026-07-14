<?php include __DIR__ . '/_header.php'; ?>

<div class="premium-card">
  <div class="premium-card-header">
    <h5 class="premium-card-title"><i class="fas fa-users text-primary mr-2"></i> Danh sách tài khoản người dùng</h5>
  </div>
  
  <div class="p-0 table-responsive">
    <table class="premium-table">
      <thead>
        <tr>
          <th style="width: 100px;">ID</th>
          <th>Họ và tên</th>
          <th>Địa chỉ Email</th>
          <th>Số điện thoại</th>
          <th>Ngày đăng ký</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($users)): ?>
          <tr>
            <td colspan="5" class="text-center text-muted">Chưa có người dùng đăng ký tài khoản.</td>
          </tr>
        <?php else: ?>
          <?php foreach($users as $u): ?>
            <tr>
              <td><span class="text-muted">#<?= $u['id'] ?></span></td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="user-avatar mr-2" style="width: 32px; height: 32px; font-size: 13px; font-weight: 600;">
                    <?= strtoupper(substr(trim($u['name']), 0, 2)) ?>
                  </div>
                  <strong><?= htmlspecialchars($u['name']) ?></strong>
                </div>
              </td>
              <td>
                <a href="mailto:<?= htmlspecialchars($u['email']) ?>"><?= htmlspecialchars($u['email']) ?></a>
              </td>
              <td>
                <?= htmlspecialchars($u['phone'] ?: 'Chưa cập nhật') ?>
              </td>
              <td>
                <span class="text-muted small"><?= date('d/m/Y H:i', strtotime($u['created_at'])) ?></span>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . '/_footer.php'; ?>
