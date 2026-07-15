<style>
  /* Order Detail Premium */
  .order-detail-title {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .order-detail-title span.order-id {
    background: rgba(255,107,53,0.12);
    color: #ff6b35;
    padding: 4px 14px;
    border-radius: 999px;
    font-size: 18px;
  }

  .seat-chip {
    display: inline-flex;
    align-items: center;
    background: rgba(255,107,53,0.12);
    color: #ff6b35;
    border: 1px solid rgba(255,107,53,0.3);
    border-radius: 8px;
    padding: 3px 10px;
    font-size: 13px;
    font-weight: 700;
    margin: 2px;
  }

  .seat-progress {
    background: rgba(255,255,255,0.06);
    border-radius: 999px;
    height: 8px;
    margin-bottom: 12px;
    overflow: hidden;
  }

  .seat-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ff6b35, #f28123);
    border-radius: 999px;
    transition: width 0.6s ease;
  }

  .total-highlight {
    background: rgba(255,107,53,0.08);
    border: 1px solid rgba(255,107,53,0.2);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .total-highlight .label { color: rgba(255,255,255,0.65); font-size: 14px; }
  .total-highlight .amount { font-family: 'Be Vietnam Pro',sans-serif; font-size: 22px; font-weight: 800; color: #ff6b35; }

  /* Status Timeline */
  .status-timeline {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    position: relative;
  }
  .status-timeline::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 40px;
    right: 40px;
    height: 3px;
    background: rgba(255,255,255,0.1);
    z-index: 0;
  }
  .timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    flex: 1;
  }
  .timeline-dot {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    border: 3px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
  }
  .timeline-step.active .timeline-dot {
    background: #ff6b35;
    border-color: #ff6b35;
    box-shadow: 0 0 20px rgba(255,107,53,0.4);
  }
  .timeline-step.completed .timeline-dot {
    background: #00c853;
    border-color: #00c853;
  }
  .timeline-label {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
    text-align: center;
    font-weight: 600;
  }
  .timeline-step.active .timeline-label,
  .timeline-step.completed .timeline-label {
    color: #fff;
  }
</style>

<div class="container mt-5 mb-5">
  <div class="order-detail-title">
    <i class="fas fa-receipt" style="color:#ff6b35;"></i>
    Chi tiết đơn <span class="order-id">#<?= (int)$order_id ?></span>
  </div>

  <!-- Status Timeline -->
  <?php
    $statusFlow = [
      'CHO_XAC_NHAN' => 0,
      'DANG_XAC_NHAN_THANH_TOAN' => 1,
      'DANG_GIAO' => 2,
      'HOAN_THANH' => 3,
      'DA_HUY' => -1,
    ];
    $currentStep = $statusFlow[$order['status']] ?? 0;
    $isCancelled = $order['status'] === 'DA_HUY';
  ?>
  <?php if (!$isCancelled): ?>
  <div class="status-timeline">
    <div class="timeline-step <?= $currentStep >= 0 ? ($currentStep > 0 ? 'completed' : 'active') : '' ?>">
      <div class="timeline-dot"><i class="fas fa-shopping-cart"></i></div>
      <div class="timeline-label">Đặt vé</div>
    </div>
    <div class="timeline-step <?= $currentStep >= 1 ? ($currentStep > 1 ? 'completed' : 'active') : '' ?>">
      <div class="timeline-dot"><i class="fas fa-credit-card"></i></div>
      <div class="timeline-label">Thanh toán</div>
    </div>
    <div class="timeline-step <?= $currentStep >= 2 ? ($currentStep > 2 ? 'completed' : 'active') : '' ?>">
      <div class="timeline-dot"><i class="fas fa-check-circle"></i></div>
      <div class="timeline-label">Xác nhận</div>
    </div>
    <div class="timeline-step <?= $currentStep >= 3 ? 'completed' : '' ?>">
      <div class="timeline-dot"><i class="fas fa-ticket-alt"></i></div>
      <div class="timeline-label">Hoàn thành</div>
    </div>
  </div>
  <?php else: ?>
  <div style="background:rgba(255,61,113,0.1); border:1px solid rgba(255,61,113,0.3); border-radius:12px; padding:16px; text-align:center; margin-bottom:24px;">
    <i class="fas fa-times-circle" style="color:#ff3d71; font-size:24px;"></i>
    <div style="color:#ff3d71; font-weight:700; margin-top:8px;">Đơn hàng đã bị hủy</div>
  </div>
  <?php endif; ?>

  <!-- Ticket Items -->
  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-ticket-alt mr-2" style="color:#ff6b35;"></i> Vé phim đã đặt
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-borderless mb-0">
          <thead>
            <tr>
              <th>Phim</th>
              <th>Suất chiếu</th>
              <th>Giá</th>
              <th>SL</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($items as $it): ?>
              <tr>
                <td style="font-weight:600; color:#fff;"><?= htmlspecialchars($it['title']) ?></td>
                <td style="color:rgba(255,255,255,0.55); font-size:13px;"><?= htmlspecialchars($it['showtime_label'] ?? 'Chưa chọn') ?></td>
                <td><?= number_format($it['price']) ?>đ</td>
                <td style="font-weight:700;"><?= (int)$it['qty'] ?></td>
                <td style="font-weight:700; color:#ff6b35;"><?= number_format($it['line_total']) ?>đ</td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Seat Selection -->
  <?php
    $selectedCount = 0;
    foreach ($seatsByShowtime as $arr) { $selectedCount += count($arr); }
    $need = (int)$seatNeed;
    $needsSeat = $need > 0 && $selectedCount < $need;
    $pct = $need > 0 ? min(100, round($selectedCount/$need*100)) : 0;
  ?>
  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span><i class="fas fa-chair mr-2" style="color:#ff6b35;"></i>Ghế đã chọn</span>
      <span class="order-row-status <?= $needsSeat ? 'status-CHO_XAC_NHAN' : 'status-HOAN_THANH' ?>" style="
        display: inline-flex; align-items: center; gap:4px;
        padding: 3px 12px; border-radius: 999px;
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        background: <?= $needsSeat ? 'rgba(255,179,0,0.12)' : 'rgba(0,200,83,0.12)' ?>;
        color: <?= $needsSeat ? '#ffb300' : '#00c853' ?>;
        border: 1px solid <?= $needsSeat ? 'rgba(255,179,0,0.25)' : 'rgba(0,200,83,0.25)' ?>;
      ">
        <?= $selectedCount ?>/<?= $need ?> ghế
      </span>
    </div>
    <div class="card-body">
      <?php if($need > 0): ?>
        <div class="seat-progress mb-3">
          <div class="seat-progress-bar" style="width:<?= $pct ?>%;"></div>
        </div>
      <?php endif; ?>

      <?php if ($need === 0): ?>
        <p class="mb-0" style="color:rgba(255,255,255,0.5);">Đơn không có vé.</p>
      <?php elseif ($needsSeat): ?>
        <p style="color:#ff3d71;" class="mb-3">
          <i class="fas fa-exclamation-triangle mr-1"></i> Bạn chưa chọn đủ ghế.
        </p>
      <?php endif; ?>

      <?php foreach ($items as $it): ?>
        <?php $showtimeId = (int)($it['showtime_id'] ?? 0); $list = $seatsByShowtime[$showtimeId] ?? []; ?>
        <div class="mb-3">
          <div style="font-weight:700; color:#fff; margin-bottom:8px;">
            <?= htmlspecialchars($it['title']) ?>
            <?php if (!empty($it['showtime_label'])): ?>
              <span style="font-size:12px; color:rgba(255,255,255,0.45); font-weight:400; margin-left:6px;">
                <?= htmlspecialchars($it['showtime_label']) ?>
              </span>
            <?php endif; ?>
          </div>
          <?php if (empty($list)): ?>
            <span style="color:rgba(255,255,255,0.3); font-size:13px;">
              <i class="fas fa-info-circle mr-1"></i> Chọn <?= (int)$it['qty'] ?> ghế
            </span>
          <?php else: ?>
            <div>
              <?php foreach($list as $sc): ?>
                <span class="seat-chip"><i class="fas fa-chair mr-1"></i><?= htmlspecialchars($sc) ?></span>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>

      <?php if ($needsSeat): ?>
        <div class="mt-3">
          <a class="boxed-btn" href="index.php?act=seat&order_id=<?= (int)$order_id ?>">
            <i class="fas fa-chair"></i> Chọn ghế ngay
          </a>
        </div>
      <?php endif; ?>
    </div>
  </div>

  <!-- Snack Items -->
  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-popcorn mr-2" style="color:#ff6b35;"></i> Bắp nước đã thanh toán
    </div>
    <div class="card-body">
      <?php if (empty($snackItems)): ?>
        <p class="mb-0" style="color:rgba(255,255,255,0.35);">Đơn này không có bắp nước.</p>
      <?php else: ?>
        <div class="table-responsive">
          <table class="table table-borderless mb-3">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>SL</th>
                <th>Giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($snackItems as $snack): ?>
                <tr>
                  <td style="font-weight:600; color:#fff;"><?= htmlspecialchars($snack['name'] ?? '') ?></td>
                  <td><?= (int)($snack['qty'] ?? 0) ?></td>
                  <td><?= number_format((int)($snack['price'] ?? 0)) ?>đ</td>
                  <td style="font-weight:700; color:#ff6b35;"><?= number_format((int)($snack['line_total'] ?? 0)) ?>đ</td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>

      <?php if ($plainNote !== ''): ?>
        <div style="background:rgba(255,255,255,0.04); border-radius:10px; padding:12px 16px; margin-top:8px; color:rgba(255,255,255,0.6); font-size:14px;">
          <strong style="color:rgba(255,255,255,0.8);">Ghi chú:</strong> <?= nl2br(htmlspecialchars($plainNote)) ?>
        </div>
      <?php endif; ?>
    </div>
  </div>

  <!-- Total Summary -->
  <div class="card mb-4">
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <div style="color:rgba(255,255,255,0.5); font-size:13px; margin-bottom:4px;">Tiền vé</div>
          <div style="font-weight:700; font-size:18px; color:#fff; margin-bottom:12px;"><?= number_format($ticketTotal) ?>đ</div>
          <div style="color:rgba(255,255,255,0.5); font-size:13px; margin-bottom:4px;">Bắp nước</div>
          <div style="font-weight:700; font-size:18px; color:#fff;"><?= number_format($snackTotal) ?>đ</div>
        </div>
        <div class="col-md-6 d-flex align-items-center">
          <div class="total-highlight w-100">
            <div class="label">Tổng thanh toán</div>
            <div class="amount"><?= number_format((int)$order['total_amount']) ?>đ</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4">
    <a href="index.php?act=myorders" class="bordered-btn">
      <i class="fas fa-arrow-left"></i> Quay lại đơn hàng
    </a>
  </div>
</div>
