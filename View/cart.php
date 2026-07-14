<style>
  /* Cart Page Premium Styles */
  .cart-section { position: relative; z-index: 1; }

  .cart-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .cart-empty-wrap {
    text-align: center;
    padding: 80px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
  }

  .cart-empty-wrap i {
    font-size: 64px;
    color: rgba(255,255,255,0.15);
    margin-bottom: 20px;
    display: block;
  }

  .cart-empty-wrap p {
    font-size: 18px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 24px;
  }

  .cart-table {
    width: 100%;
    border-collapse: collapse;
  }

  .cart-table thead th {
    background: rgba(255,107,53,0.1);
    color: #ff6b35;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 14px 18px;
    border-bottom: 2px solid rgba(255,107,53,0.2);
  }

  .cart-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: background 0.2s ease;
  }

  .cart-table tbody tr:hover {
    background: rgba(255,255,255,0.03);
  }

  .cart-table tbody td {
    padding: 16px 18px;
    color: rgba(255,255,255,0.8);
    vertical-align: middle;
  }

  .cart-table .product-name {
    font-weight: 600;
    color: #fff;
  }

  .cart-table .product-price,
  .cart-table .product-total {
    color: #ff6b35;
    font-weight: 700;
  }

  .cart-qty-input {
    width: 72px;
    text-align: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    color: #fff;
    padding: 6px 10px;
    font-weight: 600;
    font-size: 14px;
  }

  .cart-qty-input:focus {
    border-color: #ff6b35;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,107,53,0.2);
  }

  .cart-summary-box {
    background: rgba(10,25,41,0.85);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(16px);
  }

  .cart-total-label {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    font-weight: 500;
    margin-bottom: 4px;
  }

  .cart-total-amount {
    font-size: 32px;
    font-weight: 900;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #ff6b35, #f28123);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 24px;
  }
</style>

<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Giỏ vé</p>
          <h1>Giỏ hàng của bạn</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="cart-section mt-5 mb-5">
  <div class="container">
    <?php if(empty($items)): ?>
      <div class="cart-empty-wrap">
        <i class="fas fa-ticket-alt"></i>
        <p>Giỏ vé đang trống, hãy chọn phim yêu thích!</p>
        <a href="index.php?act=sanpham" class="boxed-btn">
          <i class="fas fa-film"></i> Xem danh sách phim
        </a>
      </div>
    <?php else: ?>
      <form method="post" action="index.php?act=cart_update">
        <?= csrf_field() ?>
        <div class="row">
          <div class="col-lg-8 mb-4">
            <div class="cart-table-wrap">
              <table class="cart-table">
                <thead class="cart-table-head">
                  <tr class="table-head-row">
                    <th class="product-remove" style="width:50px;"></th>
                    <th class="product-name">Phim</th>
                    <th class="product-price">Giá / vé</th>
                    <th class="product-quantity">Số lượng</th>
                    <th class="product-total">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach($items as $it): ?>
                  <tr class="table-body-row">
                    <td class="product-remove text-center">
                      <a href="index.php?act=cart_remove&id=<?= $it['movie_id'] ?>" title="Xóa">
                        <i class="far fa-times-circle"></i>
                      </a>
                    </td>
                    <td class="product-name"><?= htmlspecialchars($it['title']) ?></td>
                    <td class="product-price"><?= number_format($it['price']) ?>đ</td>
                    <td class="product-quantity">
                      <input type="number" min="1" class="cart-qty-input" name="qty[<?= $it['movie_id'] ?>]" value="<?= $it['qty'] ?>">
                    </td>
                    <td class="product-total"><?= number_format($it['price']*$it['qty']) ?>đ</td>
                  </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            </div>

            <div class="mt-3 d-flex" style="gap:12px;">
              <button class="bordered-btn" type="submit">
                <i class="fas fa-sync-alt"></i> Cập nhật giỏ hàng
              </button>
              <a class="bordered-btn" href="index.php?act=sanpham">
                <i class="fas fa-arrow-left"></i> Tiếp tục chọn phim
              </a>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="cart-summary-box">
              <div class="cart-total-label">Tổng giá trị đơn hàng</div>
              <div class="cart-total-amount"><?= number_format($total) ?>đ</div>
              <a class="boxed-btn w-100" href="index.php?act=order">
                <i class="fas fa-credit-card"></i> Tiến hành đặt vé
              </a>
            </div>
          </div>
        </div>
      </form>
    <?php endif; ?>
  </div>
</div>
