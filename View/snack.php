<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Chọn thêm</p>
          <h1>Bắp nước</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-5 mb-5">
  <form method="post" action="index.php?act=snack">
    <?= csrf_field() ?>
    <input type="hidden" name="order_id" value="<?= (int)$order_id ?>">
    <div class="snack-card p-3 p-md-4">
      <div class="snack-table-wrap">
        <table class="snack-table">
          <thead>
            <tr>
              <th style="width:60%">Combo</th>
              <th style="width:20%">Giá tiền</th>
              <th style="width:20%">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($combos as $c): ?>
            <tr>
              <td>
                <div class="snack-title"><?= htmlspecialchars($c['name']) ?></div>
                <div class="snack-desc"><?= htmlspecialchars($c['desc']) ?></div>
              </td>
              <td class="snack-price"><?= number_format($c['price']) ?>đ</td>
              <td>
                <div class="quantity-control" data-qty>
                  <button type="button" class="qty-btn" data-action="minus">−</button>
                  <input class="qty-input" type="number" min="0" name="snacks[<?= htmlspecialchars($c['id']) ?>]"
                         value="<?= (int)($selectedMap[$c['id']] ?? 0) ?>">
                  <button type="button" class="qty-btn" data-action="plus">+</button>
                </div>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-4">
        <a href="index.php?act=payment&order_id=<?= (int)$order_id ?>" class="bordered-btn">Bỏ qua</a>
        <button type="submit" class="boxed-btn">Tiếp tục thanh toán</button>
      </div>
    </div>
  </form>
</div>

<script>
  document.querySelectorAll('[data-qty]').forEach(function(ctrl){
    var input = ctrl.querySelector('input');
    ctrl.querySelectorAll('.qty-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var val = parseInt(input.value || '0', 10) || 0;
        if (btn.getAttribute('data-action') === 'minus') {
          val = Math.max(0, val - 1);
        } else {
          val = val + 1;
        }
        input.value = val;
      });
    });
  });
</script>