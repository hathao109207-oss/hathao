<?php
require_once __DIR__ . '/connect.php';

class PasswordReset {
    public static function createToken($user_id){
        global $conn;
        $token = bin2hex(random_bytes(16));
        $expires = (new DateTime('+30 minutes'))->format('Y-m-d H:i:s');
        $stmt = $conn->prepare("INSERT INTO password_resets(user_id, token, expires_at) VALUES (?,?,?)");
        $stmt->bind_param("iss",$user_id,$token,$expires);
        $stmt->execute();
        return $token;
    }

    public static function findValid($token){
        global $conn;
        $now = (new DateTime())->format('Y-m-d H:i:s');
        $stmt = $conn->prepare("SELECT * FROM password_resets WHERE token=? AND used=0 AND expires_at > ?");
        $stmt->bind_param("ss",$token,$now);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function markUsed($id){
        global $conn;
        $stmt = $conn->prepare("UPDATE password_resets SET used=1 WHERE id=?");
        $stmt->bind_param("i",$id);
        return $stmt->execute();
    }
}
?>
