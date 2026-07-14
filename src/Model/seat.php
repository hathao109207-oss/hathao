<?php
require_once __DIR__ . '/connect.php';

class SeatReservation {
    public static function reservedByShowtime($showtime_id){
        global $conn;
        $stmt = $conn->prepare("SELECT seat_code, order_id FROM seat_reservations WHERE showtime_id=?");
        $stmt->bind_param("i", $showtime_id);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $map = [];
        foreach ($rows as $r){
            $map[$r['seat_code']] = (int)$r['order_id'];
        }
        return $map;
    }

    public static function byOrder($order_id){
        global $conn;
        $stmt = $conn->prepare("SELECT sr.showtime_id, st.movie_id, sr.seat_code
                                FROM seat_reservations sr
                                JOIN showtimes st ON sr.showtime_id=st.id
                                WHERE sr.order_id=?
                                ORDER BY st.movie_id, sr.seat_code");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public static function byOrderAndShowtime($order_id, $showtime_id){
        global $conn;
        $stmt = $conn->prepare("SELECT seat_code FROM seat_reservations WHERE order_id=? AND showtime_id=?");
        $stmt->bind_param("ii", $order_id, $showtime_id);
        $stmt->execute();
        return array_column($stmt->get_result()->fetch_all(MYSQLI_ASSOC), 'seat_code');
    }

    public static function countByOrders(array $order_ids){
        global $conn;
        if (empty($order_ids)) return [];
        $placeholders = implode(',', array_fill(0, count($order_ids), '?'));
        $types = str_repeat('i', count($order_ids));
        $stmt = $conn->prepare("SELECT order_id, COUNT(*) AS c FROM seat_reservations WHERE order_id IN ($placeholders) GROUP BY order_id");
        $stmt->bind_param($types, ...$order_ids);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $out = [];
        foreach ($rows as $r){
            $out[(int)$r['order_id']] = (int)$r['c'];
        }
        return $out;
    }

    public static function seatsTaken($showtime_id, array $seat_codes, $exclude_order_id=null){
        global $conn;
        $seat_codes = array_values(array_unique(array_map(function($s){ return strtoupper(trim($s)); }, $seat_codes)));
        if (empty($seat_codes)) return [];
        $placeholders = implode(',', array_fill(0, count($seat_codes), '?'));
        $types = "i" . str_repeat('s', count($seat_codes));
        $params = array_merge([(int)$showtime_id], array_values($seat_codes));
        $sql = "SELECT seat_code FROM seat_reservations WHERE showtime_id=? AND seat_code IN ($placeholders)";
        if ($exclude_order_id){
            $sql .= " AND order_id <> ?";
            $types .= "i";
            $params[] = (int)$exclude_order_id;
        }
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        return array_column($rows, 'seat_code');
    }

    public static function replaceSelection($order_id, $showtime_id, array $seat_codes){
        global $conn;
        $seat_codes = array_values(array_unique(array_map(function($s){ return strtoupper(trim($s)); }, $seat_codes)));
        $conflicts = self::seatsTaken($showtime_id, $seat_codes, $order_id);
        if ($conflicts) return $conflicts;

        $conn->begin_transaction();
        try {
            $del = $conn->prepare("DELETE FROM seat_reservations WHERE order_id=? AND showtime_id=?");
            $del->bind_param("ii", $order_id, $showtime_id);
            $del->execute();

            if (!empty($seat_codes)){
                $ins = $conn->prepare("INSERT INTO seat_reservations(order_id,showtime_id,seat_code) VALUES (?,?,?)");
                foreach ($seat_codes as $code){
                    $ins->bind_param("iis", $order_id, $showtime_id, $code);
                    $ins->execute();
                }
            }

            $conn->commit();
            return [];
        } catch (Exception $e){
            $conn->rollback();
            throw $e;
        }
    }

    public static function clearByOrderMovie($order_id, $movie_id){
        global $conn;
        $stmt = $conn->prepare("DELETE sr FROM seat_reservations sr JOIN showtimes st ON sr.showtime_id=st.id WHERE sr.order_id=? AND st.movie_id=?");
        $stmt->bind_param("ii", $order_id, $movie_id);
        return $stmt->execute();
    }
}
?>
