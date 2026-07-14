<?php require_once __DIR__ . '/../../config.php'; ?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin - CineTicket</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/all.min.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/admin-premium.css">
</head>
<body>
  <div class="admin-wrapper">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-logo">
        <img src="<?= BASE_URL ?>assets/img/logo.png" alt="CineTicket Logo">
        <span>CineTicket Admin</span>
      </div>
      <div class="sidebar-user">
        <div class="user-avatar">AD</div>
        <div class="user-info">
          <span class="user-name">Quản trị viên</span>
          <span class="user-role">Administrator</span>
        </div>
      </div>
      <nav class="sidebar-menu">
        <a class="menu-item <?= ($_GET['act']??'dashboard')==='dashboard'?'active':'' ?>" href="<?= ADMIN_URL ?>index.php?act=dashboard">
          <i class="fas fa-chart-pie"></i> <span>Dashboard</span>
        </a>
        <a class="menu-item <?= ($_GET['act']??'')==='movies'?'active':'' ?>" href="<?= ADMIN_URL ?>index.php?act=movies">
          <i class="fas fa-film"></i> <span>Sản phẩm (Phim)</span>
        </a>
        <a class="menu-item <?= ($_GET['act']??'')==='genres'?'active':'' ?>" href="<?= ADMIN_URL ?>index.php?act=genres">
          <i class="fas fa-tags"></i> <span>Loại sản phẩm</span>
        </a>
        <a class="menu-item <?= ($_GET['act']??'')==='orders'?'active':'' ?>" href="<?= ADMIN_URL ?>index.php?act=orders">
          <i class="fas fa-shopping-cart"></i> <span>Đơn hàng</span>
        </a>
        <a class="menu-item <?= ($_GET['act']??'')==='users'?'active':'' ?>" href="<?= ADMIN_URL ?>index.php?act=users">
          <i class="fas fa-users"></i> <span>Khách hàng</span>
        </a>
      </nav>
    </aside>

    <!-- Main Panel -->
    <div class="main-panel">
      <!-- Top Navbar -->
      <header class="top-navbar">
        <div class="top-nav-left">
          <h4 class="page-title">
            <?php 
              $titles = [
                'dashboard' => 'Dashboard',
                'movies' => 'Quản lý phim',
                'movie_add' => 'Thêm phim mới',
                'movie_edit' => 'Chỉnh sửa phim',
                'genres' => 'Quản lý thể loại',
                'genre_add' => 'Thêm thể loại mới',
                'genre_edit' => 'Chỉnh sửa thể loại',
                'orders' => 'Quản lý đơn hàng',
                'order_detail' => 'Chi tiết đơn hàng',
                'users' => 'Quản lý người dùng'
              ];
              echo $titles[$_GET['act'] ?? 'dashboard'] ?? 'Admin Panel';
            ?>
          </h4>
        </div>
        <div class="top-nav-right">
          <a class="btn-top btn-outline" href="<?= BASE_URL ?>index.php" target="_blank">
            <i class="fas fa-external-link-alt"></i> Xem website
          </a>
          <a class="btn-top btn-danger" href="<?= BASE_URL ?>index.php?act=logout">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </a>
        </div>
      </header>
      
      <!-- Content Area -->
      <main class="content-container">
