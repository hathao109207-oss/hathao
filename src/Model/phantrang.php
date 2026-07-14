<?php
class PhanTrang {
    public static function totalPages($total,$perPage){
        return (int)ceil(((int)$total)/max(1,(int)$perPage));
    }
}
?>
