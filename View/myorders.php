<style>
  /* My Orders Premium Styles */
  .orders-page-title {
    font-family: 'Poppins', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 28px;
    position: relative;
    padding-bottom: 12px;
  }

  .orders-page-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 48px;
    height: 3px;
    background: linear-gradient(90deg, #ff6b35, #f28123);
    border-radius: 3px;
  }

  .order-row-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .status-CHO_XAC_NHAN { background: rgba(255,179,0,0.12); color: #ffb300; border: 1px solid rgba(255,179,0,0.25); }
  .status-DANG_GIAO    { background: rgba(0,176,255,0.12); color: #00b0ff; border: 1px solid rgba(0,176,255,0.25); }
  .status-HOAN_THANH   { background: rgba(0,200,83,0.12); color: #00c853; border: 1px solid rgba(0,200,83,0.25); }
  .status-DA_HUY       { background: rgba(255,61,113,0.12); color: #ff3d71; border: 1px solid rgba(255,61,113,0.25); }

  .order-actions a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.04);
  }

  .order-actions a:hover {
    border-color: #ff6b35;
    color: #ff6b35;
    background: rgba(255,107,53,0.08);
  }

  .order-actions a.action-seat {
    border-color: rgba(255,107,53,0.4);
    color: #ff6b35;
    background: rgba(255,107,53,0.08);
  }

  .order-actions a.action-seat:hover {
    background: #ff6b35;
    color: #fff;
  }

  .seat-info-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: rgba(255,255,255,0.5);
  }

  .seat-need-badge {
    color: #ff3d71;
    font-weight: 600;
  }

  .orders-empty {
    text-align: center;
    padding: 80px 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
  }
</style>

<div class="container mt-5 mb-5">
  <div class="orders-page-title">
    <i class="fas fa-receipt mr-2" style="color:#ff6b35;"></i> Đơn của tôi
  </div>

  <?php if(empty($orders)): ?>
    <div class="orders-empty">
      <i class="fas fa-ticket-alt" style="font-size:60px; color:rgba(255,255,255,0.12); display:block; margin-bottom:20px;"></i>
      <p style="color:rgba(255,255,255,0.45); font-size:18px; margin-bottom:24px;">Bạn chưa có đơn hàng nào</p>
      <a href="index.php?act=sanpham" class="boxed-btn">
        <i class="fas fa-film"></i> Khám phá phim ngay
      </a>
    </div>
  <?php else: ?>
    <div class="orders-table-wrap">
      <div class="table-responsive">
        <table class="table table-borderless mb-0">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ghế đã chọn</th>
              <th>Ngày đặt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
          <?php foreach($orders as $o):
            $need = (int)($seatNeeds[$o['id']] ?? 0);
            $selected = (int)($seatCounts[$o['id']] ?? 0);
            $needsSeat = $need > 0 && $selected < $need;
            $statusMap = [
              'CHO_XAC_NHAN' => ['label' => 'Chờ xác nhận', 'icon' => 'fas fa-clock'],
              'DANG_GIAO'    => ['label' => 'Đang xử lý',   'icon' => 'fas fa-spinner fa-spin'],
              'HOAN_THANH'   => ['label' => 'Hoàn thành',   'icon' => 'fas fa-check-circle'],
              'DA_HUY'       => ['label' => 'Đã hủy',       'icon' => 'fas fa-times-circle'],
            ];
            $si = $statusMap[$o['status']] ?? ['label' => $o['status'], 'icon' => 'fas fa-info-circle'];
          ?>
            <tr>
              <td style="font-weight:700; color:#ff6b35; font-size:15px;">#<?= $o['id'] ?></td>
              <td style="font-weight:700; color:#fff;"><?= number_format($o['total_amount']) ?>đ</td>
              <td>
                <span class="order-row-status status-<?= htmlspecialchars($o['status']) ?>">
                  <i class="<?= $si['icon'] ?>"></i> <?= $si['label'] ?>
                </span>
              </td>
              <td>
                <?php if($need > 0): ?>
                  <span class="seat-info-badge">
                    <i class="fas fa-chair"></i>
                    <?= $selected ?>/<?= $need ?>
                    <?php if($needsSeat): ?>
                      <span class="seat-need-badge ml-1">(chọn thêm)</span>
                    <?php endif; ?>
                  </span>
                <?php else: ?>
                  <span style="color:rgba(255,255,255,0.25);">—</span>
                <?php endif; ?>
              </td>
              <td style="color:rgba(255,255,255,0.55); font-size:13px;"><?= htmlspecialchars($o['created_at']) ?></td>
              <td>
                <div class="order-actions d-flex" style="gap:6px; flex-wrap:wrap;">
                  <a href="index.php?act=orderdetail&id=<?= $o['id'] ?>">
                    <i class="fas fa-eye"></i> Chi tiết
                  </a>
                  <?php if($needsSeat): ?>
                    <a href="index.php?act=seat&order_id=<?= $o['id'] ?>" class="action-seat">
                      <i class="fas fa-chair"></i> Chọn ghế
                    </a>
                  <?php endif; ?>
                </div>
              </td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  <?php endif; ?>
</div>
