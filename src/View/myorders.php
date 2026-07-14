<div class="container mt-5 mb-5">
  <h2>Đơn của tôi</h2>
  <?php if(empty($orders)): ?>
    <p>Bạn chưa có đơn nào.</p>
  <?php else: ?>
    <table class="table table-bordered">
      <thead><tr><th>Mã</th><th>Tổng</th><th>Trạng thái</th><th>Ghế</th><th>Ngày</th><th></th></tr></thead>
      <tbody>
      <?php foreach($orders as $o):
        $need = (int)($seatNeeds[$o['id']] ?? 0);
        $selected = (int)($seatCounts[$o['id']] ?? 0);
        $needsSeat = $need>0 && $selected < $need;
      ?>
        <tr>
          <td>#<?= $o['id'] ?></td>
          <td><?= number_format($o['total_amount']) ?>đ</td>
          <td><?php $map=['CHO_XAC_NHAN'=>'Chờ xác nhận','DANG_GIAO'=>'Đang giao','HOAN_THANH'=>'Hoàn thành','DA_HUY'=>'Đã hủy']; echo htmlspecialchars($map[$o['status']] ?? $o['status']); ?></td>
          <td><?= $need ? ($selected . '/' . $need . ' ghế') : '-' ?><?= $needsSeat ? ' <span class="text-danger">(chọn thêm)</span>' : '' ?></td>
          <td><?= htmlspecialchars($o['created_at']) ?></td>
          <td>
            <a href="index.php?act=orderdetail&id=<?= $o['id'] ?>">Chi tiết</a>
            <?php if($needsSeat): ?> | <a href="index.php?act=seat&order_id=<?= $o['id'] ?>">Chọn ghế</a><?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</div>
