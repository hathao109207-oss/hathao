<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Giỏ vé</p>
          <h1>Giỏ hàng</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="cart-section mt-5 mb-5">
  <div class="container">
    <?php if(empty($items)): ?>
      <p>Giỏ vé đang trống. <a href="index.php?act=sanpham">Chọn phim</a></p>
    <?php else: ?>
      <form method="post" action="index.php?act=cart_update">
        <div class="cart-table-wrap">
          <table class="cart-table">
            <thead class="cart-table-head">
              <tr class="table-head-row">
                <th class="product-remove"></th>
                <th class="product-name">Phim</th>
                <th class="product-price">Giá</th>
                <th class="product-quantity">Số lượng</th>
                <th class="product-total">Tổng</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach($items as $it): ?>
              <tr class="table-body-row">
                <td class="product-remove"><a href="index.php?act=cart_remove&id=<?= $it['movie_id'] ?>"><i class="far fa-window-close"></i></a></td>
                <td class="product-name"><?= htmlspecialchars($it['title']) ?></td>
                <td class="product-price"><?= number_format($it['price']) ?>đ</td>
                <td class="product-quantity"><input type="number" min="1" name="qty[<?= $it['movie_id'] ?>]" value="<?= $it['qty'] ?>"></td>
                <td class="product-total"><?= number_format($it['price']*$it['qty']) ?>đ</td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
        <div class="text-right mt-3">
          <button class="boxed-btn" type="submit">Cập nhật</button>
          <a class="boxed-btn" href="index.php?act=order">Thanh toán</a>
        </div>
        <h4 class="mt-3">Tổng: <?= number_format($total) ?>đ</h4>
      </form>
    <?php endif; ?>
  </div>
</div>
