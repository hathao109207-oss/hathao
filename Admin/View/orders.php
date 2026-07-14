<?php include __DIR__ . '/_header.php'; ?>

<div class="premium-card">
  <div class="premium-card-header">
    <h5 class="premium-card-title"><i class="fas fa-receipt text-primary mr-2"></i> Danh sách đơn hàng đặt vé</h5>
  </div>
  
  <div class="p-0 table-responsive">
    <table class="premium-table">
      <thead>
        <tr>
          <th style="width: 100px;">Đơn hàng</th>
          <th>Khách hàng</th>
          <th>Liên hệ</th>
          <th>Tổng tiền</th>
          <th style="width: 280px;">Trạng thái đơn hàng</th>
          <th>Thời gian đặt</th>
          <th class="text-right" style="width: 100px;">Xem chi tiết</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($orders)): ?>
          <tr>
            <td colspan="7" class="text-center text-muted">Chưa có đơn hàng nào được đặt.</td>
          </tr>
        <?php else: ?>
          <?php foreach($orders as $o): ?>
            <tr>
              <td><strong>#<?= $o['id'] ?></strong></td>
              <td>
                <div><strong><?= htmlspecialchars($o['customer_name']) ?></strong></div>
                <div class="text-muted small mt-1"><i class="far fa-user mr-1"></i> Tài khoản: <?= htmlspecialchars($o['user_email'] ?? '') ?></div>
              </td>
              <td>
                <div><?= htmlspecialchars($o['customer_email']) ?></div>
                <div class="text-muted small mt-1"><i class="fas fa-phone-alt mr-1"></i> <?= htmlspecialchars($o['customer_phone'] ?? '') ?></div>
              </td>
              <td>
                <strong class="text-primary"><?= number_format($o['total_amount']) ?>đ</strong>
              </td>
              <td>
                <form method="post" action="index.php?act=order_status" class="d-flex align-items-center" style="gap:6px">
                  <input type="hidden" name="id" value="<?= $o['id'] ?>">
                  <select name="status" class="status-select <?= $o['status'] ?> form-control-sm" onchange="this.className='status-select ' + this.value;">
                    <?php
                      $opts = ['CHO_XAC_NHAN'=>'Chờ xác nhận','DANG_XAC_NHAN_THANH_TOAN'=>'Đang xác minh TT','DANG_GIAO'=>'Đang giao','HOAN_THANH'=>'Hoàn thành','DA_HUY'=>'Đã hủy'];
                      foreach($opts as $k=>$label){
                        $sel = ($o['status']===$k)?'selected':'';
                        echo "<option value='$k' $sel>$label</option>";
                      }
                    ?>
                  </select>
                  <button class="btn btn-sm btn-outline-primary" type="submit" style="font-size:11px; padding: 4px 8px; border-radius: 6px;">Cập nhật</button>
                </form>
              </td>
              <td>
                <span class="text-muted small"><?= date('d/m/Y H:i', strtotime($o['created_at'])) ?></span>
              </td>
              <td class="text-right">
                <a class="btn-action view" href="index.php?act=order_detail&id=<?= $o['id'] ?>" title="Xem hóa đơn chi tiết">
                  <i class="fas fa-eye"></i>
                </a>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . '/_footer.php'; ?>
