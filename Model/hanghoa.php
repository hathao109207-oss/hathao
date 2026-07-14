<?php
require_once __DIR__ . '/connect.php';

class HangHoa {
    private static function normalizeTitle($row){
        if (!$row || !isset($row['title'])) return $row;
        $fixes = [
            'Avatar 2 ? D?ng ch?y c?a n??c' => 'Avatar 2 - Dong chay cua nuoc',
            'Avatar 2 – Dòng chảy của nước' => 'Avatar 2 - Dong chay cua nuoc',
        ];
        if (isset($fixes[$row['title']])) {
            $row['title'] = $fixes[$row['title']];
        }
        return $row;
    }

    public static function featured($limit=8){
        global $conn;
        $limit = (int)$limit;
        $sql = "SELECT m.*, g.name AS genre_name
                FROM movies m LEFT JOIN genres g ON m.genre_id=g.id
                ORDER BY m.created_at DESC LIMIT $limit";
        $rows = $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
        return array_map([self::class, 'normalizeTitle'], $rows);
    }

    public static function paginate($genre_id, $q, $page, $perPage=12, $sort=''){
        global $conn;
        $where = [];
        $params = [];
        $types = "";
        if ($genre_id) { $where[]="m.genre_id=?"; $types.="i"; $params[]=$genre_id; }
        if ($q) { $where[]="m.title LIKE ?"; $types.="s"; $params[]="%".$q."%"; }
        $whereSql = $where ? ("WHERE ".implode(" AND ",$where)) : "";

        $countSql = "SELECT COUNT(*) AS c FROM movies m $whereSql";
        $stmt = $conn->prepare($countSql);
        if ($types) $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $total = (int)($stmt->get_result()->fetch_assoc()['c'] ?? 0);

        $rows = self::rows($genre_id, $q, $page, $perPage, $sort);
        return ['total'=>$total,'rows'=>$rows,'page'=>(int)$page,'perPage'=>(int)$perPage];
    }

    public static function rows($genre_id, $q, $page, $perPage=12, $sort=''){
        global $conn;
        $where = [];
        $params = [];
        $types = "";
        if ($genre_id) { $where[]="m.genre_id=?"; $types.="i"; $params[]=$genre_id; }
        if ($q) { $where[]="m.title LIKE ?"; $types.="s"; $params[]="%".$q."%"; }
        $whereSql = $where ? ("WHERE ".implode(" AND ",$where)) : "";

        $orderMap = [
            'newest' => 'm.created_at DESC',
            'price_asc' => 'm.price ASC',
            'price_desc' => 'm.price DESC',
            'name' => 'm.title ASC',
        ];
        $orderBy = $orderMap[$sort] ?? 'm.created_at DESC';

        $offset = max(0, ((int)$page-1) * (int)$perPage);

        $sql = "SELECT m.*, g.name AS genre_name
                FROM movies m LEFT JOIN genres g ON m.genre_id=g.id
                $whereSql
                ORDER BY $orderBy
                LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        $types2 = $types . "ii";
        $params[] = (int)$perPage;
        $params[] = (int)$offset;
        $stmt->bind_param($types2, ...$params);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        return array_map([self::class, 'normalizeTitle'], $rows);
    }

    public static function find($id){
        global $conn;
        $stmt = $conn->prepare("SELECT m.*, g.name AS genre_name
                                FROM movies m LEFT JOIN genres g ON m.genre_id=g.id
                                WHERE m.id=?");
        $stmt->bind_param("i",$id);
        $stmt->execute();
        return self::normalizeTitle($stmt->get_result()->fetch_assoc());
    }
}
?>
