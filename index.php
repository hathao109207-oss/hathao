<?php
ob_start();
require_once __DIR__ . '/config.php';

$act = $_GET['act'] ?? 'home';
$isSeatAutosave = $act === 'seat'
  && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST'
  && isset($_POST['autosave']);
$isSeatShowtimeAjax = $act === 'seat'
  && isset($_GET['set_showtime'])
  && isset($_GET['ajax']);
$isPaymentAjax = $act === 'payment'
  && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST'
  && !empty($_POST['action'])
  && in_array($_POST['action'], ['search_bank', 'select_method'], true);
$isAjaxRequest = $isSeatAutosave || $isSeatShowtimeAjax || $isPaymentAjax;
$pageError = null;

if (!$isAjaxRequest) {
  header('Content-Type: text/html; charset=UTF-8');
  require_once __DIR__ . '/View/headder.php';
}

try {
  switch ($act) {
    case 'home':
      include __DIR__ . '/Controller/home.php'; break;

    case 'sanpham':
      include __DIR__ . '/Controller/sanpham.php'; break;

    case 'sanphamchitiet':
      include __DIR__ . '/Controller/sanphamchitiet.php'; break;

    case 'cart':
      include __DIR__ . '/Controller/cart.php'; break;

    case 'addcart':
      $_GET['action']='add'; include __DIR__ . '/Controller/cart_action.php'; break;

    case 'cart_update':
      $_GET['action']='update'; include __DIR__ . '/Controller/cart_action.php'; break;

    case 'cart_remove':
      $_GET['action']='remove'; include __DIR__ . '/Controller/cart_action.php'; break;

    case 'order':
      include __DIR__ . '/Controller/order.php'; break;

    case 'hoadon':
      include __DIR__ . '/Controller/hoadon.php'; break;

    case 'seat':
      include __DIR__ . '/Controller/seat.php'; break;

    case 'snack':
      include __DIR__ . '/Controller/snack.php'; break;

    case 'payment':
      include __DIR__ . '/Controller/payment.php'; break;

    case 'quickseat':
      include __DIR__ . '/Controller/quickseat.php'; break;

    case 'myorders':
      include __DIR__ . '/Controller/myorders.php'; break;

    case 'orderdetail':
      include __DIR__ . '/Controller/orderdetail.php'; break;

    case 'account':
      include __DIR__ . '/Controller/account.php'; break;

    case 'account_update':
      include __DIR__ . '/Controller/account_update.php'; break;

    case 'change_password':
      include __DIR__ . '/Controller/change_password.php'; break;

    case 'login':
      include __DIR__ . '/Controller/login.php'; break;

    case 'registration':
      include __DIR__ . '/Controller/registration.php'; break;

    case 'forgetpassword':
      include __DIR__ . '/Controller/forget.php'; break;

    case 'resetpw':
      include __DIR__ . '/View/resetpw.php'; break;

    case 'logout':
      include __DIR__ . '/Controller/logout.php'; break;

    case 'news':
      include __DIR__ . '/View/news.php'; break;

    case 'contact':
      include __DIR__ . '/View/contact.php'; break;

    default:
      include __DIR__ . '/Controller/home.php';
  }
} catch (Throwable $e) {
  error_log(sprintf('[CineTicket] %s in %s:%d', $e->getMessage(), $e->getFile(), $e->getLine()));
  $pageError = 'Không thể tải dữ liệu lúc này. Chi tiết: ' . $e->getMessage() . ' (tại ' . basename($e->getFile()) . ':' . $e->getLine() . ')';
}

if ($pageError && !$isAjaxRequest) {
  echo '<div class="container" style="padding:40px 0 10px;">';
  echo '<div class="alert alert-danger" role="alert">' . htmlspecialchars($pageError) . '</div>';
  echo '</div>';
}

if (!$isAjaxRequest) {
  require_once __DIR__ . '/View/footer.php';
}
ob_end_flush();
?>
