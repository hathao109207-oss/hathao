<?php require_once __DIR__ . '/../config.php'; ?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>CineTicket - Đặt vé xem phim online</title>
  <meta name="description" content="CineTicket - Đặt vé xem phim online nhanh chóng, chọn ghế dễ dàng, ưu đãi combo hấp dẫn.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" type="image/png" href="<?= BASE_URL ?>assets/img/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/all.min.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/owl.carousel.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/magnific-popup.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/animate.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/meanmenu.min.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/main.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/responsive.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/premium.css?v=20260622">
  <style>
    .account-menu {
      position: relative;
    }
    .account-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
    }
    .account-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      min-width: 220px;
      background: rgba(10, 25, 41, 0.97);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
      padding: 10px 0;
      margin: 0;
      list-style: none;
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-6px);
      transition: opacity 220ms cubic-bezier(0.4, 0, 0.2, 1), transform 220ms cubic-bezier(0.4, 0, 0.2, 1), visibility 220ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .account-dropdown li {
      display: block !important;
      float: none !important;
      text-align: left !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .account-dropdown::before {
      content: "";
      position: absolute;
      top: -7px;
      right: 18px;
      width: 14px;
      height: 14px;
      background: rgba(10, 25, 41, 0.97);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      transform: rotate(45deg);
    }
    .account-toggle {
      transition: color 220ms cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .main-menu ul li .account-dropdown a {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      padding: 10px 18px !important;
      color: #ffffff !important;
      font-weight: 600 !important;
      text-transform: none !important;
      white-space: nowrap !important;
      transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .main-menu ul li .account-dropdown a:hover {
      background: rgba(255, 107, 53, 0.1) !important;
      color: #f28123 !important;
    }
    .account-menu.open .account-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    /* Toast notifications */
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      padding: 14px 20px;
      border-radius: 10px;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      animation: toastIn 0.3s ease, toastOut 0.3s ease 3.7s forwards;
      max-width: 400px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .toast-success { background: linear-gradient(135deg, #00c853, #00e676); }
    .toast-error { background: linear-gradient(135deg, #ff3d71, #ff6b8a); }
    .toast-info { background: linear-gradient(135deg, #2196f3, #42a5f5); }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100px); }
    }
  </style>
</head>
<body>
<div class="toast-container" id="toastContainer"></div>
<div class="top-header-area" id="sticker">
  <div class="container">
    <div class="row">
      <div class="col-lg-12 col-sm-12 text-center">
        <div class="main-menu-wrap">
          <div class="site-logo">
            <a href="<?= BASE_URL ?>index.php"><img src="<?= BASE_URL ?>assets/img/logo.png" alt=""></a>
          </div>
          <nav class="main-menu">
            <ul>
              <li><a href="<?= BASE_URL ?>index.php">Trang chủ</a></li>
              <li><a href="<?= BASE_URL ?>index.php?act=sanpham">Phim</a></li>
              <li><a href="<?= BASE_URL ?>index.php?act=news">Tin tức</a></li>
              <li><a href="<?= BASE_URL ?>index.php?act=contact">Liên hệ</a></li>
              <li>
                <div class="header-icons">
                  <a class="shopping-cart" href="<?= BASE_URL ?>index.php?act=cart"><i class="fas fa-shopping-cart"></i></a>
                </div>
              </li>
              <?php if(!empty($_SESSION['user'])): ?>
                <li class="account-menu">
                  <a class="account-toggle" href="#" aria-haspopup="true" aria-expanded="false">
                    Tài khoản <i class="fas fa-chevron-down"></i>
                  </a>
                  <ul class="account-dropdown">
                    <li><a href="<?= BASE_URL ?>index.php?act=account"><i class="fas fa-user-cog"></i> Tài khoản</a></li>
                    <li><a href="<?= BASE_URL ?>index.php?act=myorders"><i class="fas fa-history"></i> Đơn của tôi</a></li>
                    <?php if(($_SESSION['user']['role']??'')==='admin'): ?>
                      <li><a href="<?= ADMIN_URL ?>"><i class="fas fa-user-shield"></i> Admin</a></li>
                    <?php endif; ?>
                    <li><a href="<?= BASE_URL ?>index.php?act=logout"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                  </ul>
                </li>
              <?php else: ?>
                <li><a href="<?= BASE_URL ?>index.php?act=login">Đăng nhập</a></li>
              <?php endif; ?>
            </ul>
          </nav>
          <div class="mobile-menu"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container" style="margin-top:110px;">
<?php
  $toastMessages = [];
  if (!empty($_SESSION['flash_error'])) {
    $toastMessages[] = ['type' => 'error', 'msg' => $_SESSION['flash_error']];
    unset($_SESSION['flash_error']);
  }
  if (!empty($_SESSION['flash_success'])) {
    $toastMessages[] = ['type' => 'success', 'msg' => $_SESSION['flash_success']];
    unset($_SESSION['flash_success']);
  }
  if (!empty($_SESSION['flash_info'])) {
    $toastMessages[] = ['type' => 'info', 'msg' => $_SESSION['flash_info']];
    unset($_SESSION['flash_info']);
  }
?>
<?php foreach ($toastMessages as $toast): ?>
  <div class="toast toast-<?= $toast['type'] ?>" style="margin-top:10px;">
    <i class="fas fa-<?= $toast['type'] === 'success' ? 'check-circle' : ($toast['type'] === 'error' ? 'exclamation-circle' : 'info-circle') ?>"></i>
    <?= htmlspecialchars($toast['msg']) ?>
  </div>
<?php endforeach; ?>
</div>
