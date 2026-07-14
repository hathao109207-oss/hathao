<?php include __DIR__ . '/_header.php'; ?>

<?php
  // Parse snacks and notes
  $parsed = HoaDon::parseCustomerNote($order['customer_note'] ?? '');
  $snackItems = $parsed['snack_items'] ?? [];
  $plainNote = $parsed['plain_note'] ?? '';
  $snackTotal = (int)($parsed['snack_total'] ?? 0);
  
  $ticketTotal = 0;
  foreach ($items as $it) {
    $ticketTotal += (int)$it['line_total'];
  }
  
  $statusLabels = [
    'CHO_XAC_NHAN' => ['label' => 'Chờ xác nhận', 'class' => 'warning'],
    'DANG_XAC_NHAN_THANH_TOAN' => ['label' => 'Đang xác minh TT', 'class' => 'info'],
    'DANG_GIAO' => ['label' => 'Đang giao', 'class' => 'info'],
    'HOAN_THANH' => ['label' => 'Hoàn thành', 'class' => 'success'],
    'DA_HUY' => ['label' => 'Đã hủy', 'class' => 'danger']
  ];
  $statusInfo = $statusLabels[$order['status']] ?? ['label' => $order['status'], 'class' => 'secondary'];
?>

<div class="premium-card" style="max-width: 860px; margin: 0 auto;">
  <div class="premium-card-header no-print">
    <h5 class="premium-card-title"><i class="fas fa-file-invoice-dollar text-primary mr-2"></i> Hóa đơn thanh toán</h5>
    <div>
      <button class="btn btn-sm btn-outline-primary mr-2" onclick="window.print()" style="border-radius: 8px;">
        <i class="fas fa-print mr-1"></i> In hóa đơn
      </button>
      <a class="btn btn-sm btn-outline-secondary" href="index.php?act=orders" style="border-radius: 8px;">
        Quay lại
      </a>
    </div>
  </div>
  
  <div class="p-5" style="background-color: #fff;">
    <!-- Invoice Layout -->
    <div class="invoice-header">
      <div>
        <div class="invoice-logo"><i class="fas fa-ticket-alt"></i> CINETICKET</div>
        <p class="text-muted small mt-2">Hệ thống đặt vé xem phim trực tuyến hàng đầu</p>
      </div>
      <div class="invoice-details">
        <h4 class="mb-1">ĐƠN HÀNG #<?= $order['id'] ?></h4>
        <span class="badge-premium <?= $statusInfo['class'] ?> mb-2"><?= $statusInfo['label'] ?></span>
        <div class="text-muted small">Ngày đặt: <?= date('d/m/Y H:i', strtotime($order['created_at'])) ?></div>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="invoice-meta-grid">
      <div class="invoice-meta-col">
        <h6>Thông tin khách hàng</h6>
        <p><strong>Họ tên:</strong> <?= htmlspecialchars($order['customer_name']) ?></p>
        <p><strong>Điện thoại:</strong> <?= htmlspecialchars($order['customer_phone']) ?></p>
        <p><strong>Email:</strong> <?= htmlspecialchars($order['customer_email']) ?></p>
      </div>
      <div class="invoice-meta-col">
        <h6>Thông tin thanh toán</h6>
        <?php if (!empty($paymentTxn)): ?>
          <p><strong>Phương thức:</strong> <?= htmlspecialchars(PaymentManager::methodLabel($paymentTxn['payment_method'])) ?></p>
          <p>
            <strong>Ngân hàng:</strong>
            <?php if (!empty($paymentTxn['bank_logo'])): ?>
              <img src="../<?= htmlspecialchars($paymentTxn['bank_logo']) ?>" alt="" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;">
            <?php endif; ?>
            <?= htmlspecialchars($paymentTxn['bank_name'] ?? $paymentTxn['bank_short_name'] ?? '—') ?>
          </p>
          <?php if (!empty($paymentTxn['account_number'])): ?>
            <p><strong>Số thẻ/TK:</strong> <?= htmlspecialchars($paymentTxn['account_number']) ?></p>
          <?php endif; ?>
          <?php if (!empty($paymentTxn['account_holder'])): ?>
            <p><strong>Chủ thẻ/TK:</strong> <?= htmlspecialchars($paymentTxn['account_holder']) ?></p>
          <?php endif; ?>
          <p><strong>Mã giao dịch:</strong> <?= htmlspecialchars($paymentTxn['transaction_ref'] ?? '—') ?></p>
          <p>
            <strong>Trạng thái TT:</strong>
            <span class="badge badge-<?= PaymentManager::statusBadgeClass($paymentTxn['status']) ?>">
              <?= htmlspecialchars(PaymentManager::statusLabel($paymentTxn['status'])) ?>
            </span>
          </p>
          <?php if (!empty($paymentTxn['payment_proof'])): ?>
            <p><strong>Ảnh bill:</strong></p>
            <a href="../<?= htmlspecialchars($paymentTxn['payment_proof']) ?>" target="_blank" rel="noopener">
              <img src="../<?= htmlspecialchars($paymentTxn['payment_proof']) ?>" alt="Bill" class="payment-proof-thumb">
            </a>
          <?php endif; ?>
          <?php if (!empty($paymentTxn['reject_reason'])): ?>
            <p class="text-danger"><strong>Lý do từ chối:</strong> <?= htmlspecialchars($paymentTxn['reject_reason']) ?></p>
          <?php endif; ?>
        <?php else: ?>
          <p><strong>Phương thức:</strong> Chưa có giao dịch</p>
          <p><strong>Mã giao dịch:</strong> TXN-<?= str_pad($order['id'], 6, '0', STR_PAD_LEFT) ?></p>
        <?php endif; ?>
        <p><strong>Ghi chú đơn:</strong> <?= htmlspecialchars($plainNote ?: 'Không có ghi chú') ?></p>
      </div>
    </div>

    <!-- Tickets Table -->
    <h6 class="text-uppercase font-weight-bold mb-3" style="color: var(--text-muted); font-size: 11px; letter-spacing: 0.5px;">1. Vé xem phim</h6>
    <div class="table-responsive mb-4">
      <table class="table table-bordered table-striped" style="font-size: 13px;">
        <thead class="bg-light">
          <tr>
            <th>Phim</th>
            <th>Suất chiếu</th>
            <th>Ghế</th>
            <th class="text-right">Đơn giá</th>
            <th class="text-center">Số lượng</th>
            <th class="text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($items as $it): ?>
            <?php 
              $showtimeId = (int)($it['showtime_id'] ?? 0); 
              $seatsList = $seatsByShowtime[$showtimeId] ?? []; 
            ?>
            <tr>
              <td><strong><?= htmlspecialchars($it['title']) ?></strong></td>
              <td><?= htmlspecialchars($it['showtime_label'] ?? 'Chưa chọn suất') ?></td>
              <td>
                <?php if (empty($seatsList)): ?>
                  <span class="text-danger">Chưa chọn ghế</span>
                <?php else: ?>
                  <span class="badge badge-success" style="font-size:11px; padding: 4px 8px;"><?= implode(', ', $seatsList) ?></span>
                <?php endif; ?>
              </td>
              <td class="text-right"><?= number_format($it['price']) ?>đ</td>
              <td class="text-center"><?= (int)$it['qty'] ?></td>
              <td class="text-right"><strong><?= number_format($it['line_total']) ?>đ</strong></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <!-- Snacks Table (if exists) -->
    <h6 class="text-uppercase font-weight-bold mb-3" style="color: var(--text-muted); font-size: 11px; letter-spacing: 0.5px;">2. Dịch vụ bắp nước đi kèm</h6>
    <div class="table-responsive mb-4">
      <?php if (empty($snackItems)): ?>
        <div class="alert alert-light text-muted small" style="border: 1px dashed var(--border-color);">
          Không kèm theo dịch vụ bắp nước nào.
        </div>
      <?php else: ?>
        <table class="table table-bordered table-striped" style="font-size: 13px;">
          <thead class="bg-light">
            <tr>
              <th>Sản phẩm / Combo</th>
              <th class="text-right">Đơn giá</th>
              <th class="text-center">Số lượng</th>
              <th class="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($snackItems as $snack): ?>
              <tr>
                <td><strong><?= htmlspecialchars($snack['name'] ?? '') ?></strong></td>
                <td class="text-right"><?= number_format((int)($snack['price'] ?? 0)) ?>đ</td>
                <td class="text-center"><?= (int)($snack['qty'] ?? 0) ?></td>
                <td class="text-right"><strong><?= number_format((int)($snack['line_total'] ?? 0)) ?>đ</strong></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>

    <!-- Total Invoice Breakdown -->
    <div class="row mt-4">
      <div class="col-md-6"></div>
      <div class="col-md-6">
        <table class="table table-borderless table-sm" style="font-size: 13px; line-height: 2;">
          <tbody>
            <tr>
              <td>Tiền vé phim:</td>
              <td class="text-right"><?= number_format($ticketTotal) ?>đ</td>
            </tr>
            <tr>
              <td>Bắp nước:</td>
              <td class="text-right"><?= number_format($snackTotal) ?>đ</td>
            </tr>
            <tr class="border-top" style="font-size: 16px; font-weight: 700;">
              <td>Tổng cộng:</td>
              <td class="text-right text-primary" style="font-size: 18px;"><?= number_format((int)$order['total_amount']) ?>đ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php if (!empty($paymentTxn) && $paymentTxn['status'] === 'verifying'): ?>
<div class="premium-card mt-4 no-print" style="max-width: 860px; margin: 0 auto;">
  <div class="premium-card-header">
    <h5 class="premium-card-title"><i class="fas fa-money-check-alt text-primary mr-2"></i> Xác nhận thanh toán</h5>
  </div>
  <div class="p-4">
    <form method="post" action="index.php?act=payment_verify" class="d-inline-block mr-2">
      <input type="hidden" name="transaction_id" value="<?= (int)$paymentTxn['id'] ?>">
      <input type="hidden" name="order_id" value="<?= (int)$order['id'] ?>">
      <input type="hidden" name="verify_action" value="approve">
      <button type="submit" class="btn btn-success" onclick="return confirm('Xác nhận thanh toán này?');">
        <i class="fas fa-check mr-1"></i> Xác nhận thanh toán
      </button>
    </form>
    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#rejectPaymentModal">
      <i class="fas fa-times mr-1"></i> Từ chối
    </button>
  </div>
</div>

<div class="modal fade" id="rejectPaymentModal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <form method="post" action="index.php?act=payment_verify">
        <div class="modal-header">
          <h5 class="modal-title">Từ chối thanh toán</h5>
          <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
        </div>
        <div class="modal-body">
          <input type="hidden" name="transaction_id" value="<?= (int)$paymentTxn['id'] ?>">
          <input type="hidden" name="order_id" value="<?= (int)$order['id'] ?>">
          <input type="hidden" name="verify_action" value="reject">
          <div class="form-group">
            <label>Lý do từ chối <span class="text-danger">*</span></label>
            <textarea name="reject_reason" class="form-control" rows="3" required placeholder="Nhập lý do..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
          <button type="submit" class="btn btn-danger">Xác nhận từ chối</button>
        </div>
      </form>
    </div>
  </div>
</div>
<?php endif; ?>

<style>
  .payment-proof-thumb {
    max-width: 120px;
    max-height: 120px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    object-fit: cover;
  }
  @media print {
    .no-print, .admin-sidebar, .top-navbar, .admin-footer {
      display: none !important;
    }
    .main-panel {
      margin-left: 0 !important;
    }
    .content-container {
      padding: 0 !important;
    }
    .premium-card {
      border: none !important;
      box-shadow: none !important;
    }
  }
</style>

<?php include __DIR__ . '/_footer.php'; ?>
