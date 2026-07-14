<?php
require_once __DIR__ . '/connect.php';

class LoaiHang {
    public static function all(){
        global $conn;
        return $conn->query("SELECT * FROM genres ORDER BY name")->fetch_all(MYSQLI_ASSOC);
    }

    public static function find($id){
        global $conn;
        $stmt = $conn->prepare("SELECT * FROM genres WHERE id=?");
        $stmt->bind_param("i",$id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function create($name,$icon){
        global $conn;
        $stmt = $conn->prepare("INSERT INTO genres(name,icon_class) VALUES (?,?)");
        $stmt->bind_param("ss",$name,$icon);
        return $stmt->execute();
    }

    public static function update($id,$name,$icon){
        global $conn;
        $stmt = $conn->prepare("UPDATE genres SET name=?, icon_class=? WHERE id=?");
        $stmt->bind_param("ssi",$name,$icon,$id);
        return $stmt->execute();
    }

    public static function delete($id){
        global $conn;
        $stmt = $conn->prepare("DELETE FROM genres WHERE id=?");
        $stmt->bind_param("i",$id);
        return $stmt->execute();
    }
}
?>
