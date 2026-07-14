<?php
require_once __DIR__ . '/../Model/hoadon.php';
require_once __DIR__ . '/../Model/seat.php';
require_once __DIR__ . '/../Model/showtime.php';
require_once __DIR__ . '/../Model/payment.php';
require_once __DIR__ . '/../Model/connect.php';

function paymentJsonResponse($success, $data = null, $message = '') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => (bool)$success,
        'data' => $data,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (empty($_SESSION['user'])) {
    if (!empty($_POST['action'])) {
        paymentJsonResponse(false, null, 'Vui lòng đăng nhập.');
    }
    $_SESSION['flash_error'] = 'Vui lòng đăng nhập trước khi thanh toán.';
    header('Location: index.php?act=login');
    exit;
}

$order_id = (int)($_GET['order_id'] ?? $_POST['order_id'] ?? 0);
$_SESSION['payment_order_id'] = $order_id;

$order = HoaDon::findForUser($order_id, (int)$_SESSION['user']['id']);
if (!$order) {
    if (!empty($_POST['action'])) {
        paymentJsonResponse(false, null, 'Không thấy đơn của bạn.');
    }
    $_SESSION['flash_error'] = 'Không thấy đơn của bạn.';
    header('Location: index.php?act=myorders');
    exit;
}

$action = $_POST['action'] ?? '';
$isAjaxAction = $_SERVER['REQUEST_METHOD'] === 'POST'
  && in_array($action, ['search_bank', 'select_method'], true);

$seatNeed = HoaDon::seatNeed($order_id);
$seatSelected = count(SeatReservation::byOrder($order_id));
if ($seatNeed > 0 && $seatSelected < $seatNeed) {
    if ($isAjaxAction) {
        paymentJsonResponse(false, null, 'Vui lòng chọn đủ ghế trước khi thanh toán.');
    }
    $_SESSION['flash_error'] = 'Vui lòng chọn đủ ghế trước khi thanh toán.';
    header('Location: index.php?act=seat&order_id=' . $order_id);
    exit;
}

$items = HoaDon::items($order_id);
$ticketTotal = 0;
foreach ($items as $it) {
    $ticketTotal += (int)$it['line_total'];
}

$snackData = $_SESSION['snacks'][$order_id] ?? ['items' => [], 'total' => 0];
$snackItems = $snackData['items'] ?? [];
$snackTotal = (int)($snackData['total'] ?? 0);
$grandTotal = $ticketTotal + $snackTotal;

$seatRows = SeatReservation::byOrder($order_id);
$seatsByShowtime = [];
foreach ($seatRows as $row) {
    $seatsByShowtime[(int)$row['showtime_id']][] = $row['seat_code'];
}
$showtimeIds = [];
foreach ($items as $it) {
    if (!empty($it['showtime_id'])) {
        $showtimeIds[] = (int)$it['showtime_id'];
    }
}
$showtimeMap = ShowTime::mapByIds(array_values(array_unique($showtimeIds)));
foreach ($items as &$it) {
    $st = $showtimeMap[(int)($it['showtime_id'] ?? 0)] ?? null;
    if ($st) {
        $it['showtime_label'] = date('d/m', strtotime($st['show_date'])) . ' ' . date('H:i', strtotime($st['show_time']));
    } else {
        $it['showtime_label'] = null;
    }
}
unset($it);

$existingTxn = PaymentManager::getTransactionByOrder($order_id);
if ($existingTxn && in_array($existingTxn['status'], ['verifying', 'success'], true)) {
    if ($isAjaxAction) {
        paymentJsonResponse(false, null, $existingTxn['status'] === 'success'
            ? 'Đơn hàng đã được thanh toán.'
            : 'Thanh toán đang được xác minh.');
    }
    $_SESSION['flash_success'] = $existingTxn['status'] === 'success'
        ? 'Đơn hàng đã được thanh toán.'
        : 'Thanh toán đang được xác minh. Vui lòng chờ admin xác nhận.';
    header('Location: index.php?act=orderdetail&id=' . $order_id);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'search_bank') {
    $keyword = trim($_POST['keyword'] ?? '');
    $banks = PaymentManager::getBankList($keyword, 20);
    paymentJsonResponse(true, ['banks' => $banks]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'select_method') {
    $method = $_POST['payment_method'] ?? '';
    $bankCode = strtoupper(trim($_POST['bank_code'] ?? ''));
    $allowedMethods = ['qr_code', 'bank_transfer', 'credit_card'];
    if (!in_array($method, $allowedMethods, true)) {
        paymentJsonResponse(false, null, 'Phương thức thanh toán không hợp lệ.');
    }
    if (in_array($method, ['qr_code', 'bank_transfer', 'credit_card'], true) && $bankCode === '') {
        paymentJsonResponse(false, null, 'Vui lòng chọn ngân hàng.');
    }
    $bank = PaymentManager::getBankByCode($bankCode);
    if (!$bank) {
        paymentJsonResponse(false, null, 'Ngân hàng không tồn tại.');
    }
    $_SESSION['payment_method'] = $method;
    $_SESSION['selected_bank'] = $bank;
    $response = [
        'method' => $method,
        'bank' => $bank,
    ];
    if ($method === 'qr_code') {
        $response['qr'] = PaymentManager::generateQRData($order_id, $grandTotal, $bankCode);
    } else {
        $response['transfer'] = PaymentManager::generateQRData($order_id, $grandTotal, $bankCode);
        unset($response['transfer']['qr_url']);
    }
    paymentJsonResponse(true, $response);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'confirm_payment') {
    try {
        $method = $_POST['payment_method'] ?? ($_SESSION['payment_method'] ?? '');
        $bank = $_SESSION['selected_bank'] ?? null;
        $bankCode = strtoupper(trim($_POST['bank_code'] ?? ($bank['code'] ?? '')));
        if (!$bank && $bankCode) {
            $bank = PaymentManager::getBankByCode($bankCode);
        }
        $allowedMethods = ['qr_code', 'bank_transfer', 'credit_card'];
        if (!in_array($method, $allowedMethods, true)) {
            throw new InvalidArgumentException('Phương thức thanh toán không hợp lệ.');
        }
        if (empty($_POST['confirm_check'])) {
            throw new InvalidArgumentException('Vui lòng xác nhận đã thanh toán.');
        }

        $transactionRef = trim($_POST['transaction_ref'] ?? '');
        $accountHolder = trim($_POST['account_holder'] ?? '');
        $accountNumber = null;

        if ($method === 'bank_transfer' && $transactionRef === '') {
            throw new InvalidArgumentException('Vui lòng nhập mã giao dịch.');
        }
        if ($method === 'credit_card') {
            $cardNumber = preg_replace('/\D/', '', $_POST['card_number'] ?? '');
            $cardName = trim($_POST['card_name'] ?? '');
            $cardExpiry = trim($_POST['card_expiry'] ?? '');
            $cardCvv = trim($_POST['card_cvv'] ?? '');
            if (strlen($cardNumber) < 13 || $cardName === '' || $cardExpiry === '' || $cardCvv === '') {
                throw new InvalidArgumentException('Vui lòng nhập đầy đủ thông tin thẻ.');
            }
            $accountNumber = PaymentManager::maskCardNumber($cardNumber);
            $accountHolder = $cardName;
            $transactionRef = $transactionRef ?: ('CARD-' . strtoupper(substr(md5($cardNumber . $order_id), 0, 10)));
        }
        if ($method === 'qr_code') {
            $transactionRef = $transactionRef ?: ('QR-' . $order_id . '-' . time());
            $accountHolder = $accountHolder ?: ($order['customer_name'] ?? '');
        }
        if ($method === 'bank_transfer') {
            $accountHolder = $accountHolder ?: ($order['customer_name'] ?? '');
        }

        $proofPath = null;
        if (!empty($_FILES['payment_proof']['tmp_name'])) {
            $proofPath = PaymentManager::savePaymentProof($order_id, $_FILES['payment_proof']);
        }

        $parsedNote = HoaDon::parseCustomerNote($order['customer_note'] ?? '');
        $newNote = HoaDon::buildCustomerNote($parsedNote['plain_note'] ?? '', $snackItems);
        $stmt = $conn->prepare('UPDATE orders SET total_amount=?, customer_note=?, status=? WHERE id=?');
        $status = 'DANG_XAC_NHAN_THANH_TOAN';
        $stmt->bind_param('issi', $grandTotal, $newNote, $status, $order_id);
        $stmt->execute();

        PaymentManager::createTransaction([
            'order_id' => $order_id,
            'payment_method' => $method,
            'bank_code' => $bank['code'] ?? $bankCode,
            'bank_name' => $bank['name'] ?? null,
            'account_number' => $accountNumber,
            'account_holder' => $accountHolder,
            'amount' => $grandTotal,
            'transaction_ref' => $transactionRef,
            'status' => 'verifying',
            'payment_proof' => $proofPath,
        ]);

        unset($_SESSION['payment_method'], $_SESSION['selected_bank'], $_SESSION['payment_order_id']);
        $_SESSION['flash_success'] = 'Đã gửi xác nhận thanh toán. Admin sẽ kiểm tra trong thời gian sớm nhất.';
        header('Location: index.php?act=orderdetail&id=' . $order_id);
        exit;
    } catch (Throwable $e) {
        $_SESSION['flash_error'] = $e->getMessage();
        header('Location: index.php?act=payment&order_id=' . $order_id);
        exit;
    }
}

$popularBanks = PaymentManager::getPopularBanks(8);
$paySettings = PaymentManager::getSettings();
include __DIR__ . '/../View/payment.php';
?>
