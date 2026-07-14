<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin - Thống kê</title>
  <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
</head>
<body class="p-4">
  <h2>Admin - Thống kê</h2>
  <p><a href="../index.php">Về trang chủ</a></p>
  <div class="row">
    <div class="col-md-6"><div class="card p-3"><h5>Doanh thu</h5><div><?= number_format($rev) ?>đ</div></div></div>
    <div class="col-md-6"><div class="card p-3"><h5>Số đơn</h5><div><?= (int)$cnt ?></div></div></div>
  </div>
</body>
</html>
