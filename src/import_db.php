<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/Model/connect.php';

echo "<h2>CineTicket - Auto Database Importer</h2>";
echo "<pre>";

$files = [
    __DIR__ . '/Model/starshopticket.sql',
    __DIR__ . '/Model/migration_payment.sql',
    __DIR__ . '/Model/migration_payment_settings.sql'
];

foreach ($files as $file) {
    if (!is_file($file)) {
        echo "[Bỏ qua] Không tìm thấy file: " . basename($file) . "\n";
        continue;
    }
    
    echo "Đang xử lý file: " . basename($file) . "...\n";
    $sql = file_get_contents($file);
    
    // Split SQL queries by semicolon followed by a newline
    $queries = preg_split("/;[ \t]*\r?\n/", $sql);
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($queries as $query) {
        $query = trim($query);
        if ($query === '') continue;
        
        if ($conn->query($query)) {
            $successCount++;
        } else {
            $err = $conn->error;
            echo "  [Chi tiết lỗi] $err\n";
            $errorCount++;
        }
    }
    
    echo "Hoàn thành " . basename($file) . ": Thành công $successCount, Thất bại $errorCount\n\n";
}

echo "=== ĐÃ HOÀN THÀNH NHẬP DATABASE DỰ PHÒNG ===\n";
echo "Vui lòng xóa file này khỏi server sau khi hoàn tất để bảo mật.\n";
echo "</pre>";
?>
