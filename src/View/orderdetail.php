<div class="container mt-5 mb-5">
  <h2>Chi ti&#7871;t &#273;&#417;n #<?= (int)$order_id ?></h2>

  <div class="card mb-4">
    <div class="card-header">V&eacute; phim</div>
    <div class="card-body p-0">
      <table class="table table-bordered mb-0">
        <thead>
          <tr>
            <th>Phim</th>
            <th>Su&#7845;t chi&#7871;u</th>
            <th>Gi&aacute;</th>
            <th>SL</th>
            <th>Th&agrave;nh ti&#7873;n</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($items as $it): ?>
            <tr>
              <td><?= htmlspecialchars($it['title']) ?></td>
              <td><?= htmlspecialchars($it['showtime_label'] ?? 'Ch&#432;a ch&#7885;n') ?></td>
              <td><?= number_format($it['price']) ?>&#273;</td>
              <td><?= (int)$it['qty'] ?></td>
              <td><?= number_format($it['line_total']) ?>&#273;</td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <?php
    $selectedCount = 0;
    foreach ($seatsByShowtime as $arr) { $selectedCount += count($arr); }
    $need = (int)$seatNeed;
    $needsSeat = $need > 0 && $selectedCount < $need;
  ?>
  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between">
      <span>Gh&#7871; &#273;&atilde; ch&#7885;n</span>
      <span class="text-muted small"><?= $selectedCount ?> / <?= $need ?> gh&#7871;</span>
    </div>
    <div class="card-body">
      <?php if ($need === 0): ?>
        <p class="mb-0">&#272;&#417;n kh&ocirc;ng c&oacute; v&eacute;.</p>
      <?php elseif ($needsSeat): ?>
        <p class="text-danger mb-2">B&#7841;n ch&#432;a ch&#7885;n &#273;&#7911; gh&#7871;.</p>
      <?php endif; ?>

      <?php foreach ($items as $it): ?>
        <?php $showtimeId = (int)($it['showtime_id'] ?? 0); $list = $seatsByShowtime[$showtimeId] ?? []; ?>
        <div class="mb-3">
          <strong><?= htmlspecialchars($it['title']) ?></strong>
          <?php if (!empty($it['showtime_label'])): ?>
            <span class="text-muted">(<?= htmlspecialchars($it['showtime_label']) ?>)</span>
          <?php endif; ?>:
          <?php if (empty($list)): ?>
            <span class="text-muted">Ch&#7885;n <?= (int)$it['qty'] ?> gh&#7871;</span>
          <?php else: ?>
            <span><?= htmlspecialchars(implode(', ', $list)) ?></span>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>

      <?php if ($needsSeat): ?>
        <a class="btn btn-primary" href="index.php?act=seat&order_id=<?= (int)$order_id ?>">Ch&#7885;n gh&#7871;</a>
      <?php endif; ?>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">B&#7855;p n&#432;&#7899;c &#273;&atilde; thanh to&aacute;n</div>
    <div class="card-body">
      <?php if (empty($snackItems)): ?>
        <p class="mb-0 text-muted">&#272;&#417;n n&agrave;y kh&ocirc;ng c&oacute; b&#7855;p n&#432;&#7899;c.</p>
      <?php else: ?>
        <table class="table table-bordered mb-3">
          <thead>
            <tr>
              <th>S&#7843;n ph&#7849;m</th>
              <th>SL</th>
              <th>Gi&aacute;</th>
              <th>Th&agrave;nh ti&#7873;n</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($snackItems as $snack): ?>
              <tr>
                <td><?= htmlspecialchars($snack['name'] ?? '') ?></td>
                <td><?= (int)($snack['qty'] ?? 0) ?></td>
                <td><?= number_format((int)($snack['price'] ?? 0)) ?>&#273;</td>
                <td><?= number_format((int)($snack['line_total'] ?? 0)) ?>&#273;</td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>

      <?php if ($plainNote !== ''): ?>
        <p class="mb-0"><strong>Ghi ch&uacute;:</strong> <?= nl2br(htmlspecialchars($plainNote)) ?></p>
      <?php endif; ?>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">T&#7893;ng thanh to&aacute;n</div>
    <div class="card-body">
      <p class="mb-2">Ti&#7873;n v&eacute;: <strong><?= number_format($ticketTotal) ?>&#273;</strong></p>
      <p class="mb-2">B&#7855;p n&#432;&#7899;c: <strong><?= number_format($snackTotal) ?>&#273;</strong></p>
      <p class="mb-0">T&#7893;ng &#273;&#417;n: <strong><?= number_format((int)$order['total_amount']) ?>&#273;</strong></p>
    </div>
  </div>

  <p><a href="index.php?act=myorders">&larr; Quay l&#7841;i</a></p>
</div>
