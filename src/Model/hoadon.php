<?php
require_once __DIR__ . '/connect.php';

class HoaDon {
    private static $snackMarker = '[[SNACKS_JSON]]';

    private static function normalizeOrderItem($row){
        if (!$row) return $row;
        $titleMap = [
            'Avatar 2 ? D?ng ch?y c?a n??c' => 'Avatar 2 - Dong chay cua nuoc',
        ];
        if (isset($row['title']) && isset($titleMap[$row['title']])) {
            $row['title'] = $titleMap[$row['title']];
        }
        return $row;
    }

    public static function buildCustomerNote($plainNote, array $snackItems){
        $plainNote = trim((string)$plainNote);
        if (empty($snackItems)) {
            return $plainNote;
        }

        $payload = [];
        foreach ($snackItems as $item) {
            $payload[] = [
                'id' => (string)($item['id'] ?? ''),
                'name' => (string)($item['name'] ?? ''),
                'price' => (int)($item['price'] ?? 0),
                'qty' => (int)($item['qty'] ?? 0),
                'line_total' => (int)($item['line_total'] ?? 0),
            ];
        }

        $prefix = $plainNote === '' ? '' : ($plainNote . "\n");
        return $prefix . self::$snackMarker . json_encode($payload, JSON_UNESCAPED_UNICODE);
    }

    public static function parseCustomerNote($rawNote){
        $rawNote = (string)$rawNote;
        $plainNote = trim($rawNote);
        $snackItems = [];

        $pos = strpos($rawNote, self::$snackMarker);
        if ($pos !== false) {
            $plainNote = trim(substr($rawNote, 0, $pos));
            $json = trim(substr($rawNote, $pos + strlen(self::$snackMarker)));
            $decoded = json_decode($json, true);
            if (is_array($decoded)) {
                foreach ($decoded as $item) {
                    if (!is_array($item)) continue;
                    $snackItems[] = [
                        'id' => (string)($item['id'] ?? ''),
                        'name' => (string)($item['name'] ?? ''),
                        'price' => (int)($item['price'] ?? 0),
                        'qty' => (int)($item['qty'] ?? 0),
                        'line_total' => (int)($item['line_total'] ?? 0),
                    ];
                }
            }
        }

        $snackTotal = 0;
        foreach ($snackItems as $item) {
            $snackTotal += (int)($item['line_total'] ?? 0);
        }

        return [
            'plain_note' => $plainNote,
            'snack_items' => $snackItems,
            'snack_total' => $snackTotal,
        ];
    }

    public static function find($order_id){
        global $conn;
        $stmt = $conn->prepare("SELECT * FROM orders WHERE id=?");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function findForUser($order_id, $user_id){
        global $conn;
        $stmt = $conn->prepare("SELECT * FROM orders WHERE id=? AND user_id=?");
        $stmt->bind_param("ii", $order_id, $user_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function create($user_id, $customer, $items, $total){
        global $conn;
        $status = 'CHO_XAC_NHAN';
        $stmt = $conn->prepare("INSERT INTO orders(user_id,total_amount,status,customer_name,customer_phone,customer_email,customer_note)
                                VALUES (?,?,?,?,?,?,?)");
        $stmt->bind_param(
            "iisssss",
            $user_id, $total, $status,
            $customer['name'], $customer['phone'], $customer['email'], $customer['note']
        );
        $stmt->execute();
        $order_id = $conn->insert_id;

        $stmt2 = $conn->prepare("INSERT INTO order_items(order_id,movie_id,title,price,qty,line_total,showtime_id) VALUES (?,?,?,?,?,?,?)");
        foreach ($items as $it){
            $line = $it['price']*$it['qty'];
            $showtime_id = isset($it['showtime_id']) && $it['showtime_id'] > 0 ? (int)$it['showtime_id'] : null;
            $stmt2->bind_param("iisiiii", $order_id, $it['movie_id'], $it['title'], $it['price'], $it['qty'], $line, $showtime_id);
            $stmt2->execute();
        }
        return $order_id;
    }

    public static function seatNeed($order_id){
        global $conn;
        $stmt = $conn->prepare("SELECT SUM(qty) AS needed FROM order_items WHERE order_id=?");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        return (int)($stmt->get_result()->fetch_assoc()['needed'] ?? 0);
    }

    public static function seatNeedByOrders(array $order_ids){
        global $conn;
        if (empty($order_ids)) return [];
        $placeholders = implode(',', array_fill(0, count($order_ids), '?'));
        $types = str_repeat('i', count($order_ids));
        $stmt = $conn->prepare("SELECT order_id, SUM(qty) AS needed FROM order_items WHERE order_id IN ($placeholders) GROUP BY order_id");
        $stmt->bind_param($types, ...$order_ids);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $map = [];
        foreach ($rows as $r){
            $map[(int)$r['order_id']] = (int)$r['needed'];
        }
        return $map;
    }

    public static function listByUser($user_id){
        global $conn;
        $stmt = $conn->prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC");
        $stmt->bind_param("i",$user_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public static function items($order_id){
        global $conn;
        $stmt = $conn->prepare("SELECT * FROM order_items WHERE order_id=?");
        $stmt->bind_param("i",$order_id);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        return array_map([self::class, 'normalizeOrderItem'], $rows);
    }

    public static function listAll(){
        global $conn;
        $sql = "SELECT o.*, u.email AS user_email FROM orders o JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC";
        return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
    }

    public static function updateStatus($order_id,$status){
        global $conn;
        $stmt = $conn->prepare("UPDATE orders SET status=? WHERE id=?");
        $stmt->bind_param("si",$status,$order_id);
        return $stmt->execute();
    }

    public static function stats(){
        global $conn;
        $rev = (int)($conn->query("SELECT COALESCE(SUM(total_amount),0) AS r FROM orders WHERE status='HOAN_THANH'")->fetch_assoc()['r'] ?? 0);
        $orders = (int)($conn->query("SELECT COUNT(*) AS c FROM orders")->fetch_assoc()['c'] ?? 0);
        $users = (int)($conn->query("SELECT COUNT(*) AS c FROM users WHERE role='user'")->fetch_assoc()['c'] ?? 0);
        $products = (int)($conn->query("SELECT COUNT(*) AS c FROM movies")->fetch_assoc()['c'] ?? 0);
        return ['revenue'=>$rev,'orders'=>$orders,'users'=>$users,'products'=>$products];
    }

    public static function bestSellers($limit=5){
        global $conn;
        $limit = (int)$limit;
        $sql = "SELECT oi.movie_id, oi.title, SUM(oi.qty) AS sold
                FROM order_items oi
                JOIN orders o ON o.id=oi.order_id
                WHERE o.status IN ('CHO_XAC_NHAN','DANG_GIAO','HOAN_THANH')
                GROUP BY oi.movie_id, oi.title
                ORDER BY sold DESC
                LIMIT $limit";
        return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
    }

    public static function revenueByMonth($months=12){
        global $conn;
        $months = (int)$months;
        $sql = "SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym, SUM(total_amount) AS revenue
                FROM orders
                WHERE status IN ('CHO_XAC_NHAN','DANG_GIAO','HOAN_THANH')
                GROUP BY ym
                ORDER BY ym DESC
                LIMIT $months";
        $rows = $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
        return array_reverse($rows);
    }
}
?>
