<?php
require_once __DIR__ . '/connect.php';

class Cinema {
    public static function regions(): array {
        global $conn;
        $res = $conn->query("SELECT DISTINCT region FROM cinemas ORDER BY region");
        if (!$res) return [];
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        if (!is_array($rows)) return [];

        $regions = [];
        foreach ($rows as $r) {
            if (!empty($r['region'])) $regions[] = (string)$r['region'];
        }
        return $regions;
    }
}
?>
