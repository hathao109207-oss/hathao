<?php
require_once __DIR__ . '/connect.php';

class PaymentManager {
    private static $proofDir = 'assets/img/payment_proofs/';
    private static $settingsCache = null;

    private static function fallbackBanks() {
        return [
            ['id' => 1, 'code' => 'TCB', 'name' => 'Ngân hàng TMCP Kỹ thương Việt Nam', 'short_name' => 'Techcombank', 'logo_url' => 'assets/img/banks/tcb.png', 'bin' => '970407'],
            ['id' => 2, 'code' => 'VCB', 'name' => 'Ngân hàng TMCP Ngoại thương Việt Nam', 'short_name' => 'Vietcombank', 'logo_url' => 'assets/img/banks/vcb.png', 'bin' => '970436'],
            ['id' => 3, 'code' => 'MB', 'name' => 'Ngân hàng TMCP Quân đội', 'short_name' => 'MB Bank', 'logo_url' => 'assets/img/banks/mb.png', 'bin' => '970422'],
            ['id' => 4, 'code' => 'ACB', 'name' => 'Ngân hàng TMCP Á Châu', 'short_name' => 'ACB', 'logo_url' => 'assets/img/banks/acb.png', 'bin' => '970416'],
            ['id' => 5, 'code' => 'BIDV', 'name' => 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', 'short_name' => 'BIDV', 'logo_url' => 'assets/img/banks/bidv.png', 'bin' => '970418'],
            ['id' => 6, 'code' => 'VTB', 'name' => 'Ngân hàng TMCP Công thương Việt Nam', 'short_name' => 'Vietinbank', 'logo_url' => 'assets/img/banks/vtb.png', 'bin' => '970415'],
            ['id' => 7, 'code' => 'TPB', 'name' => 'Ngân hàng TMCP Tiên Phong', 'short_name' => 'TPBank', 'logo_url' => 'assets/img/banks/tpb.png', 'bin' => '970423'],
            ['id' => 8, 'code' => 'VPB', 'name' => 'Ngân hàng TMCP Việt Nam Thịnh Vượng', 'short_name' => 'VPBank', 'logo_url' => 'assets/img/banks/vpb.png', 'bin' => '970432'],
        ];
    }

    private static function defaultSettings() {
        return [
            'merchant_account' => defined('PAYMENT_MERCHANT_ACCOUNT') ? PAYMENT_MERCHANT_ACCOUNT : '',
            'merchant_name' => defined('PAYMENT_MERCHANT_NAME') ? PAYMENT_MERCHANT_NAME : '',
            'merchant_bank_code' => defined('PAYMENT_MERCHANT_BANK') ? PAYMENT_MERCHANT_BANK : 'TCB',
            'qr_template' => 'compact2',
            'transfer_prefix' => 'CINETICKET-ORDER',
            'enable_qr' => 1,
            'enable_bank_transfer' => 1,
            'enable_credit_card' => 1,
        ];
    }

    public static function getSettings() {
        if (self::$settingsCache !== null) {
            return self::$settingsCache;
        }
        global $conn;
        $defaults = self::defaultSettings();
        $row = null;
        if ($conn) {
            $res = @$conn->query('SELECT * FROM payment_settings WHERE id = 1 LIMIT 1');
            if ($res) {
                $row = $res->fetch_assoc();
            }
        }
        if ($row) {
            self::$settingsCache = array_merge($defaults, $row);
        } else {
            self::$settingsCache = $defaults;
        }
        return self::$settingsCache;
    }

    public static function saveSettings(array $data) {
        global $conn;
        $s = self::getSettings();
        $account = trim($data['merchant_account'] ?? $s['merchant_account']);
        $name = trim($data['merchant_name'] ?? $s['merchant_name']);
        $bankCode = strtoupper(trim($data['merchant_bank_code'] ?? $s['merchant_bank_code']));
        $template = trim($data['qr_template'] ?? $s['qr_template']);
        $prefix = trim($data['transfer_prefix'] ?? $s['transfer_prefix']);
        $enableQr = !empty($data['enable_qr']) ? 1 : 0;
        $enableBank = !empty($data['enable_bank_transfer']) ? 1 : 0;
        $enableCard = !empty($data['enable_credit_card']) ? 1 : 0;

        $allowedTemplates = ['compact', 'compact2', 'qr_only', 'print'];
        if (!in_array($template, $allowedTemplates, true)) {
            $template = 'compact2';
        }
        if ($account === '' || $name === '') {
            throw new InvalidArgumentException('Số tài khoản và tên chủ TK không được để trống.');
        }

        $stmt = $conn->prepare(
            "INSERT INTO payment_settings
             (id, merchant_account, merchant_name, merchant_bank_code, qr_template, transfer_prefix,
              enable_qr, enable_bank_transfer, enable_credit_card)
             VALUES (1,?,?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE
              merchant_account=VALUES(merchant_account),
              merchant_name=VALUES(merchant_name),
              merchant_bank_code=VALUES(merchant_bank_code),
              qr_template=VALUES(qr_template),
              transfer_prefix=VALUES(transfer_prefix),
              enable_qr=VALUES(enable_qr),
              enable_bank_transfer=VALUES(enable_bank_transfer),
              enable_credit_card=VALUES(enable_credit_card)"
        );
        $stmt->bind_param(
            'sssssiii',
            $account, $name, $bankCode, $template, $prefix, $enableQr, $enableBank, $enableCard
        );
        $ok = $stmt->execute();
        self::$settingsCache = null;
        return $ok;
    }

    public static function buildTransferRef($order_id) {
        $settings = self::getSettings();
        $prefix = trim($settings['transfer_prefix'] ?? 'CINETICKET-ORDER');
        return $prefix . '-' . (int)$order_id;
    }

    public static function buildQrUrl($bin, $account, $template, $amount, $ref, $holder) {
        $template = $template ?: 'compact2';
        $amountInt = (int)round((float)$amount);
        return sprintf(
            'https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s&accountName=%s',
            $bin,
            $account,
            $template,
            $amountInt,
            rawurlencode($ref),
            rawurlencode($holder)
        );
    }

    public static function previewQr($amount = 100000) {
        $settings = self::getSettings();
        $bank = self::getBankByCode($settings['merchant_bank_code']);
        $bin = $bank['bin'] ?? '970407';
        $ref = ($settings['transfer_prefix'] ?? 'CINETICKET-ORDER') . '-PREVIEW';
        return [
            'qr_url' => self::buildQrUrl(
                $bin,
                $settings['merchant_account'],
                $settings['qr_template'],
                $amount,
                $ref,
                $settings['merchant_name']
            ),
            'bank' => $bank,
            'settings' => $settings,
        ];
    }

    public static function getBankList($search = '', $limit = 20) {
        global $conn;
        $search = trim($search);
        $limit = max(1, (int)$limit);
        $fallback = self::fallbackBanks();

        if ($conn) {
            try {
                if ($search === '') {
                    $stmt = $conn->prepare(
                        "SELECT id, code, name, short_name, logo_url, bin
                         FROM banks WHERE is_active = 1
                         ORDER BY sort_order ASC, name ASC LIMIT ?"
                    );
                    $stmt->bind_param('i', $limit);
                } else {
                    $like = '%' . $search . '%';
                    $stmt = $conn->prepare(
                        "SELECT id, code, name, short_name, logo_url, bin
                         FROM banks
                         WHERE is_active = 1 AND (code LIKE ? OR name LIKE ? OR short_name LIKE ?)
                         ORDER BY sort_order ASC, name ASC LIMIT ?"
                    );
                    $stmt->bind_param('sssi', $like, $like, $like, $limit);
                }
                $stmt->execute();
                $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
                if (!empty($rows)) {
                    return $rows;
                }
            } catch (Throwable $e) {
                // Fall back to built-in bank list when DB is unavailable or empty.
            }
        }

        $filtered = $fallback;
        if ($search !== '') {
            $needle = mb_strtolower($search, 'UTF-8');
            $filtered = array_values(array_filter($fallback, function ($bank) use ($needle) {
                return stripos(mb_strtolower($bank['code'], 'UTF-8'), $needle) !== false
                    || stripos(mb_strtolower($bank['name'], 'UTF-8'), $needle) !== false
                    || stripos(mb_strtolower($bank['short_name'], 'UTF-8'), $needle) !== false;
            }));
        }

        return array_slice($filtered, 0, $limit);
    }

    public static function getPopularBanks($limit = 8) {
        return self::getBankList('', $limit);
    }

    public static function getBankByCode($code) {
        global $conn;
        $code = strtoupper(trim($code));
        if ($code === '') {
            return null;
        }

        if ($conn) {
            try {
                $stmt = $conn->prepare(
                    "SELECT id, code, name, short_name, logo_url, bin
                     FROM banks WHERE code = ? AND is_active = 1 LIMIT 1"
                );
                $stmt->bind_param('s', $code);
                $stmt->execute();
                $row = $stmt->get_result()->fetch_assoc();
                if ($row) {
                    return $row;
                }
            } catch (Throwable $e) {
                // Fall back to built-in bank list when DB lookup fails.
            }
        }

        foreach (self::fallbackBanks() as $bank) {
            if (($bank['code'] ?? '') === $code) {
                return $bank;
            }
        }
        return null;
    }

    public static function maskCardNumber($number) {
        $digits = preg_replace('/\D/', '', (string)$number);
        if (strlen($digits) < 4) return '****';
        return '**** **** **** ' . substr($digits, -4);
    }

    public static function generateQRData($order_id, $amount, $bank_code) {
        $settings = self::getSettings();
        $bank = self::getBankByCode($bank_code);
        if (!$bank) {
            $bank = self::getBankByCode($settings['merchant_bank_code']);
        }
        $bin = $bank['bin'] ?? '970407';
        $account = $settings['merchant_account'];
        $holder = $settings['merchant_name'];
        $ref = self::buildTransferRef($order_id);
        $amountInt = (int)round((float)$amount);
        $qrUrl = self::buildQrUrl(
            $bin,
            $account,
            $settings['qr_template'],
            $amountInt,
            $ref,
            $holder
        );
        return [
            'qr_url' => $qrUrl,
            'transfer_content' => $ref,
            'account_number' => $account,
            'account_holder' => $holder,
            'amount' => $amountInt,
            'bank' => $bank,
        ];
    }

    public static function createTransaction(array $data) {
        global $conn;
        $stmt = $conn->prepare(
            "INSERT INTO payment_transactions
             (order_id, payment_method, bank_code, bank_name, account_number, account_holder,
              amount, transaction_ref, status, payment_proof)
             VALUES (?,?,?,?,?,?,?,?,?,?)"
        );
        $orderId = (int)($data['order_id'] ?? 0);
        $method = $data['payment_method'] ?? 'qr_code';
        $bankCode = $data['bank_code'] ?? null;
        $bankName = $data['bank_name'] ?? null;
        $accountNumber = $data['account_number'] ?? null;
        $accountHolder = $data['account_holder'] ?? null;
        $amount = (float)($data['amount'] ?? 0);
        $transactionRef = $data['transaction_ref'] ?? null;
        $status = $data['status'] ?? 'verifying';
        $proof = $data['payment_proof'] ?? null;
        $stmt->bind_param(
            'isssssdsss',
            $orderId, $method, $bankCode, $bankName, $accountNumber,
            $accountHolder, $amount, $transactionRef, $status, $proof
        );
        if (!$stmt->execute()) {
            return false;
        }
        return (int)$conn->insert_id;
    }

    public static function updateTransactionStatus($id, $status, $verified_at = null, $reject_reason = null) {
        global $conn;
        if ($reject_reason !== null) {
            $stmt = $conn->prepare(
                "UPDATE payment_transactions SET status=?, verified_at=?, reject_reason=? WHERE id=?"
            );
            $stmt->bind_param('sssi', $status, $verified_at, $reject_reason, $id);
        } else {
            $stmt = $conn->prepare(
                "UPDATE payment_transactions SET status=?, verified_at=? WHERE id=?"
            );
            $stmt->bind_param('ssi', $status, $verified_at, $id);
        }
        return $stmt->execute();
    }

    public static function getTransactionByOrder($order_id) {
        global $conn;
        $order_id = (int)$order_id;
        $stmt = $conn->prepare(
            "SELECT pt.*, b.logo_url AS bank_logo, b.short_name AS bank_short_name
             FROM payment_transactions pt
             LEFT JOIN banks b ON b.code = pt.bank_code
             WHERE pt.order_id = ?
             ORDER BY pt.created_at DESC LIMIT 1"
        );
        $stmt->bind_param('i', $order_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function getTransactionById($id) {
        global $conn;
        $id = (int)$id;
        $stmt = $conn->prepare(
            "SELECT pt.*, b.logo_url AS bank_logo, b.short_name AS bank_short_name
             FROM payment_transactions pt
             LEFT JOIN banks b ON b.code = pt.bank_code
             WHERE pt.id = ? LIMIT 1"
        );
        $stmt->bind_param('i', $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function savePaymentProof($order_id, array $file) {
        if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return null;
        }
        $allowed = ['image/jpeg', 'image/png', 'image/gif'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        if (!in_array($mime, $allowed, true)) {
            throw new InvalidArgumentException('Chỉ chấp nhận file JPG, PNG hoặc GIF.');
        }
        if (($file['size'] ?? 0) > 5 * 1024 * 1024) {
            throw new InvalidArgumentException('Ảnh xác nhận tối đa 5MB.');
        }
        $ext = $mime === 'image/png' ? 'png' : ($mime === 'image/gif' ? 'gif' : 'jpg');
        $dir = dirname(__DIR__) . '/' . self::$proofDir;
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $filename = 'proof_' . (int)$order_id . '_' . time() . '.' . $ext;
        $dest = $dir . $filename;
        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            throw new RuntimeException('Không thể lưu ảnh xác nhận.');
        }
        return self::$proofDir . $filename;
    }

    public static function methodLabel($method) {
        $map = [
            'qr_code' => 'Quét mã QR',
            'bank_transfer' => 'Chuyển khoản ngân hàng',
            'credit_card' => 'Thẻ tín dụng / Ghi nợ',
        ];
        return $map[$method] ?? $method;
    }

    public static function statusLabel($status) {
        $map = [
            'pending' => 'Chờ thanh toán',
            'verifying' => 'Đang xác minh',
            'success' => 'Thành công',
            'failed' => 'Thất bại',
        ];
        return $map[$status] ?? $status;
    }

    public static function statusBadgeClass($status) {
        $map = [
            'pending' => 'warning',
            'verifying' => 'info',
            'success' => 'success',
            'failed' => 'danger',
        ];
        return $map[$status] ?? 'secondary';
    }
}
?>
