<?php
class GioHang {
    private static $key = 'cart';

    private static function init(){
        if (!isset($_SESSION[self::$key])) $_SESSION[self::$key] = [];
    }

    public static function add($movie_id, $title, $price, $qty=1, $showtime_id=null){
        self::init();
        $movie_id = (int)$movie_id; $qty = max(1,(int)$qty);
        if (isset($_SESSION[self::$key][$movie_id])) {
            $_SESSION[self::$key][$movie_id]['qty'] += $qty;
            if ($showtime_id !== null) {
                $_SESSION[self::$key][$movie_id]['showtime_id'] = (int)$showtime_id;
            }
        } else {
            $_SESSION[self::$key][$movie_id] = [
                'movie_id'=>$movie_id,
                'title'=>$title,
                'price'=>(int)$price,
                'qty'=>$qty,
                'showtime_id'=>$showtime_id !== null ? (int)$showtime_id : null
            ];
        }
    }

    public static function update($movie_id, $qty){
        self::init();
        $movie_id=(int)$movie_id; $qty=(int)$qty;
        if (!isset($_SESSION[self::$key][$movie_id])) return;
        if ($qty<=0) unset($_SESSION[self::$key][$movie_id]);
        else $_SESSION[self::$key][$movie_id]['qty']=$qty;
    }

    public static function remove($movie_id){
        self::init();
        unset($_SESSION[self::$key][(int)$movie_id]);
    }

    public static function items(){
        self::init();
        return array_values($_SESSION[self::$key]);
    }

    public static function total(){
        $t=0;
        foreach (self::items() as $it) $t += $it['price']*$it['qty'];
        return $t;
    }

    public static function clear(){
        $_SESSION[self::$key]=[];
    }
}
?>
