<?php include __DIR__ . '/_header.php'; ?>

<?php if ($flashSuccess): ?>
  <div class="alert alert-success alert-dismissible fade show" role="alert">
    <?= htmlspecialchars($flashSuccess) ?>
    <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
  </div>
<?php endif; ?>
<?php if ($flashError): ?>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <?= htmlspecialchars($flashError) ?>
    <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
  </div>
<?php endif; ?>

<div class="row">
  <div class="col-lg-7">
    <div class="premium-card mb-4">
      <div class="premium-card-header">
        <h5 class="premium-card-title"><i class="fas fa-cog text-primary mr-2"></i> Cấu hình tài khoản &amp; QR</h5>
      </div>
      <div class="p-4">
        <form method="post" id="paymentSettingsForm">
          <div class="form-group">
            <label class="font-weight-bold">Ngân hàng thụ hưởng <span class="text-danger">*</span></label>
            <select name="merchant_bank_code" class="form-control" id="merchantBankCode" required>
              <?php foreach ($banks as $b): ?>
                <option value="<?= htmlspecialchars($b['code']) ?>"
                  data-bin="<?= htmlspecialchars($b['bin']) ?>"
                  <?= ($settings['merchant_bank_code'] ?? '') === $b['code'] ? 'selected' : '' ?>>
                  <?= htmlspecialchars($b['code'] . ' - ' . $b['short_name']) ?>
                </option>
              <?php endforeach; ?>
            </select>
          </div>

          <div class="form-group">
            <label class="font-weight-bold">Số tài khoản <span class="text-danger">*</span></label>
            <input type="text" name="merchant_account" id="merchantAccount" class="form-control"
                   value="<?= htmlspecialchars($settings['merchant_account'] ?? '') ?>" required
                   placeholder="VD: 19036588688016">
          </div>

          <div class="form-group">
            <label class="font-weight-bold">Tên chủ tài khoản <span class="text-danger">*</span></label>
            <input type="text" name="merchant_name" id="merchantName" class="form-control"
                   value="<?= htmlspecialchars($settings['merchant_name'] ?? '') ?>" required
                   placeholder="VD: CINETICKET VIET NAM">
          </div>

          <div class="form-row">
            <div class="form-group col-md-6">
              <label class="font-weight-bold">Mẫu QR VietQR</label>
              <select name="qr_template" id="qrTemplate" class="form-control">
                <?php
                  $templates = [
                    'compact2' => 'Compact 2 (khuyên dùng)',
                    'compact' => 'Compact',
                    'qr_only' => 'Chỉ mã QR',
                    'print' => 'In hóa đơn',
                  ];
                  foreach ($templates as $val => $label):
                ?>
                  <option value="<?= $val ?>" <?= ($settings['qr_template'] ?? '') === $val ? 'selected' : '' ?>>
                    <?= htmlspecialchars($label) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="form-group col-md-6">
              <label class="font-weight-bold">Tiền tố nội dung CK</label>
              <input type="text" name="transfer_prefix" id="transferPrefix" class="form-control"
                     value="<?= htmlspecialchars($settings['transfer_prefix'] ?? 'CINETICKET-ORDER') ?>">
            </div>
          </div>

          <div class="form-group">
            <label class="font-weight-bold d-block mb-2">Phương thức cho phép</label>
            <div class="custom-control custom-checkbox mb-2">
              <input type="checkbox" class="custom-control-input" id="enableQr" name="enable_qr" value="1"
                <?= !empty($settings['enable_qr']) ? 'checked' : '' ?>>
              <label class="custom-control-label" for="enableQr">Quét mã QR</label>
            </div>
            <div class="custom-control custom-checkbox mb-2">
              <input type="checkbox" class="custom-control-input" id="enableBank" name="enable_bank_transfer" value="1"
                <?= !empty($settings['enable_bank_transfer']) ? 'checked' : '' ?>>
              <label class="custom-control-label" for="enableBank">Chuyển khoản ngân hàng</label>
            </div>
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="enableCard" name="enable_credit_card" value="1"
                <?= !empty($settings['enable_credit_card']) ? 'checked' : '' ?>>
              <label class="custom-control-label" for="enableCard">Thẻ tín dụng / Ghi nợ</label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary px-4" style="border-radius:8px;">
            <i class="fas fa-save mr-1"></i> Lưu cấu hình
          </button>
        </form>
      </div>
    </div>
  </div>

  <div class="col-lg-5">
    <div class="premium-card">
      <div class="premium-card-header">
        <h5 class="premium-card-title"><i class="fas fa-qrcode text-primary mr-2"></i> Xem trước QR</h5>
      </div>
      <div class="p-4 text-center">
        <div class="admin-qr-preview-box">
          <img id="adminQrPreview" src="<?= htmlspecialchars($preview['qr_url']) ?>" alt="QR Preview" width="220" height="220">
        </div>
        <div class="text-left mt-4 small text-muted">
          <p class="mb-1"><strong>Ngân hàng:</strong> <span id="previewBank"><?= htmlspecialchars($preview['bank']['short_name'] ?? '') ?></span></p>
          <p class="mb-1"><strong>Số TK:</strong> <span id="previewAccount"><?= htmlspecialchars($settings['merchant_account'] ?? '') ?></span></p>
          <p class="mb-1"><strong>Chủ TK:</strong> <span id="previewName"><?= htmlspecialchars($settings['merchant_name'] ?? '') ?></span></p>
          <p class="mb-0"><strong>Nội dung mẫu:</strong> <span id="previewRef"><?= htmlspecialchars(($settings['transfer_prefix'] ?? 'CINETICKET-ORDER') . '-PREVIEW') ?></span></p>
        </div>
        <p class="text-muted small mt-3 mb-0">QR mẫu với số tiền 250.000đ — cập nhật theo thời gian thực khi sửa form.</p>
      </div>
    </div>
  </div>
</div>

<style>
  .admin-qr-preview-box {
    display: inline-block;
    padding: 16px;
    border-radius: 16px;
    background: linear-gradient(145deg, #f8fafc, #eef2f7);
    border: 2px dashed rgba(37, 99, 235, 0.25);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }
  .admin-qr-preview-box img {
    border-radius: 12px;
    background: #fff;
  }
</style>

<script>
(function () {
  function buildPreviewUrl() {
    var bank = document.getElementById('merchantBankCode');
    var bin = bank.options[bank.selectedIndex].getAttribute('data-bin') || '970407';
    var account = document.getElementById('merchantAccount').value.trim();
    var name = document.getElementById('merchantName').value.trim();
    var template = document.getElementById('qrTemplate').value;
    var prefix = document.getElementById('transferPrefix').value.trim() || 'CINETICKET-ORDER';
    var ref = prefix + '-PREVIEW';
    document.getElementById('previewBank').textContent = bank.options[bank.selectedIndex].text;
    document.getElementById('previewAccount').textContent = account;
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewRef').textContent = ref;
    if (!account || !name) return;
    var url = 'https://img.vietqr.io/image/' + bin + '-' + account + '-' + template + '.png'
      + '?amount=250000&addInfo=' + encodeURIComponent(ref) + '&accountName=' + encodeURIComponent(name);
    document.getElementById('adminQrPreview').src = url;
  }
  ['merchantBankCode','merchantAccount','merchantName','qrTemplate','transferPrefix'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', buildPreviewUrl);
    if (el) el.addEventListener('change', buildPreviewUrl);
  });
})();
</script>

<?php include __DIR__ . '/_footer.php'; ?>
