<?php
require_once __DIR__ . '/connect.php';

class ShowTime {
    public static function find($id){
        global $conn;
        $stmt = $conn->prepare("
            SELECT
              st.*,
              c.id AS cinema_id,
              c.name AS cinema_name,
              c.region AS cinema_region
            FROM showtimes st
            LEFT JOIN cinemas c ON st.cinema_id=c.id
            WHERE st.id=?
        ");
        // Fallback for older DB schemas (chưa có bảng `cinemas`/cột `cinema_id`).
        if (!$stmt) {
            $stmt = $conn->prepare("SELECT * FROM showtimes WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            return $stmt->get_result()->fetch_assoc();
        }
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function firstByMovie($movie_id){
        global $conn;
        $stmt = $conn->prepare("
            SELECT
              st.*,
              c.id AS cinema_id,
              c.name AS cinema_name,
              c.region AS cinema_region
            FROM showtimes st
            LEFT JOIN cinemas c ON st.cinema_id=c.id
            WHERE st.movie_id=?
            ORDER BY st.show_date, st.show_time
            LIMIT 1
        ");
        if (!$stmt) {
            $stmt = $conn->prepare("SELECT * FROM showtimes WHERE movie_id=? ORDER BY show_date, show_time LIMIT 1");
            $stmt->bind_param("i", $movie_id);
            $stmt->execute();
            return $stmt->get_result()->fetch_assoc();
        }
        $stmt->bind_param("i", $movie_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function listByMovie($movie_id, $region=null){
        global $conn;
        $sql = "
            SELECT
              st.*,
              c.id AS cinema_id,
              c.name AS cinema_name,
              c.region AS cinema_region
            FROM showtimes st
            LEFT JOIN cinemas c ON st.cinema_id=c.id
            WHERE st.movie_id=?
        ";
        $types = "i";
        $params = [$movie_id];
        if (!empty($region)) {
            $sql .= " AND c.region=?";
            $types .= "s";
            $params[] = $region;
        }
        $sql .= " ORDER BY st.show_date, st.show_time";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            // Lùi về schema cũ: chỉ lấy theo movie_id.
            $stmt = $conn->prepare("SELECT * FROM showtimes WHERE movie_id=? ORDER BY show_date, show_time");
            $stmt->bind_param("i", $movie_id);
            $stmt->execute();
            return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        }
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public static function listByMovies(array $movie_ids, $region=null){
        global $conn;
        if (empty($movie_ids)) return [];

        $placeholders = implode(',', array_fill(0, count($movie_ids), '?'));
        $types = str_repeat('i', count($movie_ids));

        $sql = "
            SELECT
              st.*,
              c.id AS cinema_id,
              c.name AS cinema_name,
              c.region AS cinema_region
            FROM showtimes st
            LEFT JOIN cinemas c ON st.cinema_id=c.id
            WHERE st.movie_id IN ($placeholders)
        ";
        $params = $movie_ids;
        if (!empty($region)) {
            $sql .= " AND c.region=?";
            $types .= "s";
            $params[] = (string)$region;
        }

        $sql .= " ORDER BY st.movie_id, st.show_date, st.show_time";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            // Lùi về schema cũ: không join `cinemas`, không lọc theo region.
            $stmt = $conn->prepare("SELECT * FROM showtimes WHERE movie_id IN ($placeholders) ORDER BY movie_id, show_date, show_time");
            $stmt->bind_param(str_repeat('i', count($movie_ids)), ...$movie_ids);
            $stmt->execute();
            $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $map = [];
            foreach ($rows as $r){
                $map[(int)$r['movie_id']][] = $r;
            }
            return $map;
        }
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $map = [];
        foreach ($rows as $r){
            $map[(int)$r['movie_id']][] = $r;
        }
        return $map;
    }

    public static function mapByIds(array $ids){
        global $conn;
        if (empty($ids)) return [];
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $types = str_repeat('i', count($ids));

        $stmt = $conn->prepare("
            SELECT
              st.*,
              c.id AS cinema_id,
              c.name AS cinema_name,
              c.region AS cinema_region
            FROM showtimes st
            LEFT JOIN cinemas c ON st.cinema_id=c.id
            WHERE st.id IN ($placeholders)
        ");
        if (!$stmt) {
            $stmt = $conn->prepare("SELECT * FROM showtimes WHERE id IN ($placeholders)");
            $stmt->bind_param($types, ...$ids);
            $stmt->execute();
            $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $map = [];
            foreach ($rows as $r){
                $map[(int)$r['id']] = $r;
            }
            return $map;
        }
        $stmt->bind_param($types, ...$ids);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $map = [];
        foreach ($rows as $r){
            $map[(int)$r['id']] = $r;
        }
        return $map;
    }

    public static function findByMovieId($id, $movie_id){
        global $conn;
        $stmt = $conn->prepare("
            SELECT
              st.*,
              c.id AS cinema_id,
              c.name AS cinema_name,
              c.region AS cinema_region
            FROM showtimes st
            LEFT JOIN cinemas c ON st.cinema_id=c.id
            WHERE st.id=? AND st.movie_id=?
        ");
        if (!$stmt) {
            $stmt = $conn->prepare("SELECT * FROM showtimes WHERE id=? AND movie_id=?");
            if (!$stmt) return null;
            $stmt->bind_param("ii", $id, $movie_id);
            $stmt->execute();
            return $stmt->get_result()->fetch_assoc();
        }
        $stmt->bind_param("ii", $id, $movie_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
?>
