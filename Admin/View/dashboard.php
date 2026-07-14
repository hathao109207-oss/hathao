<?php include __DIR__ . '/_header.php'; ?>

<!-- Stats Widgets Row -->
<div class="row g-4 mb-4">
  <div class="col-md-3">
    <div class="stat-card revenue">
      <div class="stat-info">
        <h6>Doanh thu (Thực tế)</h6>
        <div class="stat-value"><?= number_format($stats['revenue']) ?>đ</div>
      </div>
      <div class="stat-icon"><i class="fas fa-wallet"></i></div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="stat-card orders">
      <div class="stat-info">
        <h6>Tổng đơn hàng</h6>
        <div class="stat-value"><?= $stats['orders'] ?></div>
      </div>
      <div class="stat-icon"><i class="fas fa-shopping-bag"></i></div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="stat-card users">
      <div class="stat-info">
        <h6>Người dùng (User)</h6>
        <div class="stat-value"><?= $stats['users'] ?></div>
      </div>
      <div class="stat-icon"><i class="fas fa-user-friends"></i></div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="stat-card products">
      <div class="stat-info">
        <h6>Số lượng phim</h6>
        <div class="stat-value"><?= $stats['products'] ?></div>
      </div>
      <div class="stat-icon"><i class="fas fa-film"></i></div>
    </div>
  </div>
</div>

<!-- Detailed Data Row -->
<div class="row g-4">
  <div class="col-lg-6">
    <div class="premium-card">
      <div class="premium-card-header">
        <h5 class="premium-card-title"><i class="fas fa-crown text-warning mr-2"></i> Phim bán chạy nhất</h5>
      </div>
      <div class="p-0">
        <table class="premium-table">
          <thead>
            <tr>
              <th>Phim</th>
              <th class="text-right">Vé đã bán</th>
            </tr>
          </thead>
          <tbody>
            <?php if (empty($best)): ?>
              <tr>
                <td colspan="2" class="text-center text-muted">Chưa có dữ liệu bán hàng.</td>
              </tr>
            <?php else: ?>
              <?php foreach($best as $b): ?>
                <tr>
                  <td><strong><?= htmlspecialchars($b['title']) ?></strong></td>
                  <td class="text-right"><span class="badge-premium info"><?= (int)$b['sold'] ?> vé</span></td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  <div class="col-lg-6">
    <div class="premium-card">
      <div class="premium-card-header">
        <h5 class="premium-card-title"><i class="fas fa-chart-line text-primary mr-2"></i> Xu hướng doanh thu theo tháng</h5>
      </div>
      <div class="p-4" style="background-color: #fff;">
        <canvas id="revChart" style="max-height:280px;"></canvas>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  const monthly = <?= json_encode($monthly) ?>;
  const labels = monthly.map(x => x.ym);
  const data = monthly.map(x => Number(x.revenue));
  
  const ctx = document.getElementById('revChart').getContext('2d');
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, 'rgba(79, 70, 229, 0.25)');
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Doanh thu (đ)',
        data,
        borderColor: '#4f46e5',
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Inter', size: 11 } }
        }
      }
    }
  });
</script>

<?php include __DIR__ . '/_footer.php'; ?>
