<?php
require_once __DIR__ . '/connect.php';

class KhachHang {
    public static function findByEmail($email){
        global $conn;
        $stmt = $conn->prepare("SELECT id, name, email, phone, password_hash, role FROM users WHERE email=?");
        $stmt->bind_param("s",$email);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function find($id){
        global $conn;
        $stmt = $conn->prepare("SELECT id, name, email, phone, role, created_at FROM users WHERE id=?");
        $stmt->bind_param("i",$id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function create($name,$email,$password,$phone=null){
        global $conn;
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $role = 'user';
        $stmt = $conn->prepare("INSERT INTO users(name,email,phone,password_hash,role) VALUES (?,?,?,?,?)");
        $stmt->bind_param("sssss",$name,$email,$phone,$hash,$role);
        return $stmt->execute();
    }

    public static function updateProfile($id,$name,$phone){
        global $conn;
        $stmt = $conn->prepare("UPDATE users SET name=?, phone=? WHERE id=?");
        $stmt->bind_param("ssi",$name,$phone,$id);
        return $stmt->execute();
    }

    public static function changePassword($id,$newPassword){
        global $conn;
        $hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET password_hash=? WHERE id=?");
        $stmt->bind_param("si",$hash,$id);
        return $stmt->execute();
    }

    public static function listUsers(){
        global $conn;
        return $conn->query("SELECT id,name,email,phone,created_at FROM users WHERE role='user' ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC);
    }

    // Ensure a predefined admin account exists (used for seeded admin login without registration)
    public static function ensureAdminSeed($seed){
        global $conn;
        if (empty($seed['email']) || empty($seed['password'])) return null;
        $exist = self::findByEmail($seed['email']);
        if ($exist) return $exist;
        $hash = password_hash($seed['password'], PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users(name,email,phone,password_hash,role) VALUES (?,?,?,?, 'admin')");
        $name = $seed['name'] ?? 'Admin';
        $email = $seed['email'];
        $phone = $seed['phone'] ?? null;
        $stmt->bind_param("ssss", $name, $email, $phone, $hash);
        $stmt->execute();
        return self::findByEmail($email);
    }
}
?>
