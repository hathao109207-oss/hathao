<?php
require_once __DIR__ . '/connect.php';
require_once __DIR__ . '/hoadon.php';
require_once __DIR__ . '/payment.php';
require_once __DIR__ . '/seat.php';
require_once __DIR__ . '/showtime.php';
require_once __DIR__ . '/class.phpmailer.php';

class EmailService {
    public static function sendPaymentConfirmation($order, $paymentTxn, $items, $snackItems) {
        if (empty($order['customer_email'])) {
            error_log('[EmailService] No customer_email for order #' . ($order['id'] ?? 0));
            return false;
        }

        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->Port = SMTP_PORT;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = 'tls';
        $mail->From = SMTP_FROM;
        $mail->FromName = SMTP_FROM_NAME;
        $mail->CharSet = 'UTF-8';

        $mail->addAddress($order['customer_email']);
        $mail->Subject = '🎬 Xác nhận thanh toán thành công - Đơn hàng #' . $order['id'];

        $orderId = (int)$order['id'];
        $customerName = htmlspecialchars($order['customer_name'] ?? '');
        $paymentMethod = htmlspecialchars(PaymentManager::methodLabel($paymentTxn['payment_method'] ?? ''));
        $bankName = htmlspecialchars($paymentTxn['bank_name'] ?? $paymentTxn['bank_short_name'] ?? '');
        $transactionRef = htmlspecialchars($paymentTxn['transaction_ref'] ?? '');
        $amount = number_format((int)($order['total_amount'] ?? 0));
        $verifiedAt = date('d/m/Y H:i');
        $baseUrl = defined('BASE_URL') ? BASE_URL : '/';
        $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $accessToken = HoaDon::buildOrderAccessToken($orderId, $order['customer_email'] ?? '');
        $orderUrl = $protocol . '://' . $host . $baseUrl . 'index.php?act=orderdetail&id=' . $orderId;
        if ($accessToken !== '') {
            $orderUrl .= '&access=' . urlencode($accessToken);
        }
        $homeUrl = $protocol . '://' . $host . $baseUrl;

        // Get seat info for QR
        $seatRows = SeatReservation::byOrder($orderId);
        $seatCodes = array_column($seatRows, 'seat_code');
        $seatList = !empty($seatCodes) ? implode(', ', $seatCodes) : 'Chưa chọn ghế';

        // Get showtime info
        $showtimeIds = array_unique(array_column($items, 'showtime_id'));
        $showtimeMap = ShowTime::mapByIds(array_values($showtimeIds));
        $showtimeLabel = '';
        foreach ($items as $it) {
            $st = $showtimeMap[(int)($it['showtime_id'] ?? 0)] ?? null;
            if ($st) {
                $showtimeLabel = date('d/m/Y', strtotime($st['show_time'])) . ' ' . date('H:i', strtotime($st['show_time']));
                break;
            }
        }

        // Generate QR code content
        $qrData = json_encode([
            'type' => 'CINETICKET',
            'order_id' => $orderId,
            'customer' => $order['customer_name'] ?? '',
            'seats' => $seatList,
            'showtime' => $showtimeLabel,
            'amount' => (int)($order['total_amount'] ?? 0),
            'ref' => $transactionRef,
            'ts' => time()
        ], JSON_UNESCAPED_UNICODE);

        // Use QR Server API (highly stable, reliable, and not deprecated like Google Charts)
        $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($qrData);

        $ticketRows = '';
        foreach ($items as $it) {
            $ticketRows .= '<tr>'
                . '<td style="padding:14px 16px;border-bottom:1px solid #f0f0f0;color:#1a1a2e;font-size:14px;">'
                . '<span style="font-weight:600;">' . htmlspecialchars($it['title'] ?? '') . '</span></td>'
                . '<td style="padding:14px 16px;border-bottom:1px solid #f0f0f0;color:#666;text-align:center;font-size:14px;">x' . (int)($it['qty'] ?? 0) . '</td>'
                . '<td style="padding:14px 16px;border-bottom:1px solid #f0f0f0;color:#1a1a2e;text-align:right;font-weight:700;font-size:14px;">' . number_format((int)($it['line_total'] ?? 0)) . 'đ</td>'
                . '</tr>';
        }

        $snackRows = '';
        $snackTotal = 0;
        foreach ($snackItems as $s) {
            $snackTotal += (int)($s['line_total'] ?? 0);
            $snackRows .= '<tr>'
                . '<td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#1a1a2e;font-size:14px;">'
                . htmlspecialchars($s['name'] ?? '') . ' <span style="color:#999;">× ' . (int)($s['qty'] ?? 0) . '</span></td>'
                . '<td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#1a1a2e;text-align:right;font-weight:600;font-size:14px;">' . number_format((int)($s['line_total'] ?? 0)) . 'đ</td>'
                . '</tr>';
        }

        $ticketTotal = 0;
        foreach ($items as $it) {
            $ticketTotal += (int)($it['line_total'] ?? 0);
        }
        $grandTotal = $ticketTotal + $snackTotal;

        $snackSection = '';
        if ($snackRows !== '') {
            $snackSection = ''
                . '<tr><td colspan="2" style="padding:20px 16px 12px;background:#fafafa;">'
                . '<table width="100%" cellpadding="0" cellspacing="0"><tr>'
                . '<td style="font-size:13px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.5px;">🍿 Combo bắp nước</td>'
                . '</tr></table></td></tr>'
                . '<tr><td colspan="2" style="padding:0 16px;"><table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;">'
                . '<tr style="background:#f8f9fa;"><td style="padding:10px 16px;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;">Sản phẩm</td><td style="padding:10px 16px;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;text-align:right;">Thành tiền</td></tr>'
                . $snackRows
                . '</table></td></tr>';
        }

        $mail->Body = '<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);font-family:\'Segoe UI\',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;">
<tr><td align="center">

<!-- Main Card -->
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Logo Header -->
  <tr><td style="text-align:center;padding:0 0 24px;">
    <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:16px;padding:12px 28px;backdrop-filter:blur(10px);">
      <span style="font-size:28px;">🎬</span>
      <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:1px;margin-left:8px;">CineTicket</span>
    </div>
  </td></tr>

  <!-- Success Badge -->
  <tr><td style="text-align:center;padding:0 0 20px;">
    <div style="display:inline-block;background:linear-gradient(135deg,#00b894,#00cec9);border-radius:50px;padding:10px 28px;">
      <span style="color:#fff;font-size:14px;font-weight:700;">✓ THANH TOÁN THÀNH CÔNG</span>
    </div>
  </td></tr>

  <!-- White Content Card -->
  <tr><td style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);">

    <!-- Success Animation Area -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:linear-gradient(135deg,#f8f9ff 0%,#e8f4f8 100%);padding:40px 32px;text-align:center;">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,#00b894,#00cec9);border-radius:50%;margin:0 auto 20px;line-height:80px;font-size:40px;color:#fff;">✓</div>
      <h1 style="margin:0 0 8px;color:#1a1a2e;font-size:24px;font-weight:800;">Đơn hàng đã xác nhận!</h1>
      <p style="margin:0;color:#666;font-size:15px;">Cảm ơn bạn đã sử dụng dịch vụ CineTicket</p>
    </td></tr>
    </table>

    <!-- Order Summary -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:28px 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:16px 20px;border-right:1px solid #eee;width:50%;vertical-align:top;">
            <div style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Đơn hàng</div>
            <div style="font-size:22px;font-weight:800;color:#667eea;">#' . $orderId . '</div>
          </td>
          <td style="padding:16px 20px;vertical-align:top;">
            <div style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Thời gian</div>
            <div style="font-size:14px;font-weight:600;color:#1a1a2e;">' . $verifiedAt . '</div>
          </td>
        </tr>
      </table>
    </td></tr>
    </table>

    <!-- Payment Info -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 32px;">
      <div style="font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Thông tin thanh toán</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;color:#666;font-size:14px;">Phương thức</td>
          <td style="padding:8px 0;color:#1a1a2e;font-weight:600;font-size:14px;text-align:right;">' . $paymentMethod . '</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:14px;">Ngân hàng</td>
          <td style="padding:8px 0;color:#1a1a2e;font-weight:600;font-size:14px;text-align:right;">' . $bankName . '</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:14px;">Mã giao dịch</td>
          <td style="padding:8px 0;color:#1a1a2e;font-weight:600;font-size:14px;text-align:right;font-family:monospace;background:#f0f0f0;padding:4px 10px;border-radius:6px;">' . $transactionRef . '</td>
        </tr>
      </table>
    </td></tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #f0f0f0;margin:0;"></td></tr></table>

    <!-- Tickets -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 32px 8px;">
      <div style="font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">🎟️ Vé xem phim</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;">
        <tr style="background:linear-gradient(135deg,#667eea,#764ba2);">
          <td style="padding:12px 16px;color:#fff;font-weight:700;font-size:12px;text-transform:uppercase;">Phim</td>
          <td style="padding:12px 16px;color:#fff;font-weight:700;font-size:12px;text-transform:uppercase;text-align:center;">SL</td>
          <td style="padding:12px 16px;color:#fff;font-weight:700;font-size:12px;text-transform:uppercase;text-align:right;">Thành tiền</td>
        </tr>
        ' . $ticketRows . '
      </table>
    </td></tr>
    </table>

    ' . $snackSection . '

    <!-- QR Code Section -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 32px;">
      <div style="background:linear-gradient(135deg,#f8f9ff 0%,#e8f4f8 100%);border-radius:16px;padding:24px;text-align:center;border:2px dashed #667eea;">
        <div style="font-size:12px;font-weight:700;color:#667eea;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Mã QR vé xem phim</div>
        <div style="font-size:13px;color:#666;margin-bottom:16px;">Quét mã này tại rạp để nhận vé</div>
        <div style="background:#fff;display:inline-block;padding:12px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.1);">
          <img src="' . $qrUrl . '" alt="Ticket QR Code" width="180" height="180" style="display:block;">
        </div>
        <div style="margin-top:16px;">
          <div style="font-size:14px;font-weight:700;color:#1a1a2e;margin-bottom:4px;">Đơn hàng #' . $orderId . '</div>
          <div style="font-size:13px;color:#666;">Ghế: <strong style="color:#667eea;">' . $seatList . '</strong></div>
          <div style="font-size:13px;color:#666;">Suất: <strong style="color:#1a1a2e;">' . $showtimeLabel . '</strong></div>
        </div>
      </div>
    </td></tr>
    </table>

    <!-- Total -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:20px 24px;color:rgba(255,255,255,0.8);font-size:14px;font-weight:600;">Tổng thanh toán</td>
          <td style="padding:20px 24px;color:#fff;font-size:26px;font-weight:800;text-align:right;font-family:\'Segoe UI\',sans-serif;">' . $grandTotal . 'đ</td>
        </tr>
      </table>
    </td></tr>
    </table>

    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:8px 32px 24px;text-align:center;">
      <a href="' . $orderUrl . '" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:linear-gradient(135deg,#ff6b35,#f28123);color:#fff;text-decoration:none;padding:14px 40px;border-radius:50px;font-weight:700;font-size:15px;box-shadow:0 8px 24px rgba(255,107,53,0.4);">Xem chi tiết đơn hàng →</a>
    </td></tr>
    </table>

    <!-- Instructions -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:0 32px 24px;">
      <div style="background:#f8f9fa;border-radius:12px;padding:16px 20px;">
        <div style="font-size:12px;font-weight:700;color:#667eea;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">💡 Hướng dẫn sử dụng</div>
        <div style="font-size:13px;color:#555;line-height:1.6;">
          • Mang theo mã QR này khi đến rạp<br>
          • Quét mã tại quầy hoặc máy tự động<br>
          • Xuất trình CMND/CCCD đối chiếu<br>
          • Có mặt trước suất chiếu 15 phút
        </div>
      </div>
    </td></tr>
    </table>

  </td></tr>

  <!-- Footer Links -->
  <tr><td style="padding:24px 0;text-align:center;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding:0 12px;"><a href="' . $homeUrl . '" style="color:rgba(255,255,255,0.7);font-size:13px;text-decoration:none;">Trang chủ</a></td>
      <td style="color:rgba(255,255,255,0.3);">|</td>
      <td style="padding:0 12px;"><a href="mailto:support@cineticket.com" style="color:rgba(255,255,255,0.7);font-size:13px;text-decoration:none;">Hỗ trợ</a></td>
      <td style="color:rgba(255,255,255,0.3);">|</td>
      <td style="padding:0 12px;"><a href="' . $homeUrl . 'index.php?act=myorders" style="color:rgba(255,255,255,0.7);font-size:13px;text-decoration:none;">Đơn hàng của tôi</a></td>
    </tr></table>
  </td></tr>

  <!-- Copyright -->
  <tr><td style="text-align:center;padding:0 0 20px;">
    <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;">© 2026 CineTicket — Đặt vé nhanh, xem phim hay</p>
  </td></tr>

</table>
</td></tr>
</table>

</body>
</html>';

        try {
            $mail->send();
            error_log('[EmailService] Payment confirmation sent for order #' . $orderId . ' to ' . $order['customer_email']);
            return true;
        } catch (Exception $e) {
            error_log('[EmailService] Failed to send payment confirmation for order #' . $orderId . ': ' . $e->getMessage());
            return false;
        }
    }
}
?>