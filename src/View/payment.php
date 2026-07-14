<link rel="stylesheet" href="<?= BASE_URL ?>assets/css/payment.css?v=<?= time() ?>">
<div class="breadcrumb-section breadcrumb-bg payment-hero">
  <div class="container">
    <div class="row">
      <div class="col-lg-10 offset-lg-1 text-center">
        <div class="breadcrumb-text">
          <p><i class="fas fa-shield-alt"></i> Thanh toán bảo mật SSL</p>
          <h1>Hoàn tất đặt vé</h1>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-4 mb-5 payment-page" id="paymentApp"
     data-order-id="<?= (int)$order_id ?>"
     data-amount="<?= (int)$grandTotal ?>"
     data-base-url="<?= BASE_URL ?>">

  <!-- Progress stepper -->
  <div class="payment-stepper">
    <div class="ps-item active" data-step="1">
      <div class="ps-dot">1</div>
      <span>Phương thức</span>
    </div>
    <div class="ps-line"></div>
    <div class="ps-item" data-step="2">
      <div class="ps-dot">2</div>
      <span>Ngân hàng</span>
    </div>
    <div class="ps-line"></div>
    <div class="ps-item" data-step="3">
      <div class="ps-dot">3</div>
      <span>Thanh toán</span>
    </div>
    <div class="ps-line"></div>
    <div class="ps-item" data-step="4">
      <div class="ps-dot">4</div>
      <span>Xác nhận</span>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-8 mb-4">
      <div class="payment-card payment-glass">
        <div class="payment-card-head">
          <h5 class="payment-step-title"><span>1</span> Chọn phương thức thanh toán</h5>
          <span class="payment-secure-badge"><i class="fas fa-lock"></i> Mã hóa 256-bit</span>
        </div>
        <div class="payment-method-grid">
          <?php if (!empty($paySettings['enable_qr'])): ?>
          <button type="button" class="payment-method-card" data-method="qr_code">
            <div class="pm-glow"></div>
            <div class="pm-icon-wrap"><i class="fas fa-qrcode"></i></div>
            <div class="pm-title">QR Code</div>
            <div class="pm-desc">Quét mã bằng app ngân hàng — nhanh &amp; tiện</div>
            <div class="pm-check"><i class="fas fa-check"></i></div>
          </button>
          <?php endif; ?>
          <?php if (!empty($paySettings['enable_bank_transfer'])): ?>
          <button type="button" class="payment-method-card" data-method="bank_transfer">
            <div class="pm-glow"></div>
            <div class="pm-icon-wrap"><i class="fas fa-university"></i></div>
            <div class="pm-title">Chuyển khoản</div>
            <div class="pm-desc">Internet banking hoặc chuyển khoản thủ công</div>
            <div class="pm-check"><i class="fas fa-check"></i></div>
          </button>
          <?php endif; ?>
          <?php if (!empty($paySettings['enable_credit_card'])): ?>
          <button type="button" class="payment-method-card" data-method="credit_card">
            <div class="pm-glow"></div>
            <div class="pm-icon-wrap"><i class="fas fa-credit-card"></i></div>
            <div class="pm-title">Thẻ tín dụng</div>
            <div class="pm-desc">Visa, Mastercard, JCB, thẻ nội địa</div>
            <div class="pm-check"><i class="fas fa-check"></i></div>
          </button>
          <?php endif; ?>
        </div>
      </div>

      <div class="payment-card payment-glass payment-step-bank d-none">
        <h5 class="payment-step-title"><span>2</span> Tìm kiếm &amp; chọn ngân hàng</h5>
        <div class="bank-search-wrap">
          <i class="fas fa-search"></i>
          <input type="text" id="bankSearchInput" class="form-control payment-input" placeholder="Tìm ngân hàng theo tên hoặc mã..." autocomplete="off">
        </div>
        <p class="bank-hint"><i class="fas fa-star"></i> Ngân hàng phổ biến</p>
        <div id="bankGrid" class="bank-grid">
          <?php foreach ($popularBanks as $bank): ?>
            <button type="button" class="bank-item"
                    data-code="<?= htmlspecialchars($bank['code']) ?>"
                    title="<?= htmlspecialchars($bank['name']) ?>">
              <div class="bank-logo">
                <?php if (!empty($bank['logo_url'])): ?>
                  <img src="<?= BASE_URL . htmlspecialchars($bank['logo_url']) ?>" alt="<?= htmlspecialchars($bank['short_name']) ?>"
                       onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                  <span class="bank-logo-fallback" style="display:none;"><?= htmlspecialchars($bank['code']) ?></span>
                <?php else: ?>
                  <span class="bank-logo-fallback"><?= htmlspecialchars($bank['code']) ?></span>
                <?php endif; ?>
              </div>
              <div class="bank-short"><?= htmlspecialchars($bank['code']) ?></div>
              <div class="bank-full"><?= htmlspecialchars($bank['short_name']) ?></div>
            </button>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="payment-card payment-glass payment-step-details d-none">
        <h5 class="payment-step-title"><span>3</span> Thông tin thanh toán</h5>

        <div id="panelQr" class="payment-detail-panel d-none">
          <div class="qr-payment-box">
            <div class="qr-image-wrap">
              <div class="qr-frame">
                <img id="qrImage" src="" alt="VietQR" width="200" height="200">
              </div>
              <p class="qr-scan-hint">Quét bằng app ngân hàng</p>
            </div>
            <div class="qr-info">
              <div class="qr-bank-row">
                <img id="qrBankLogo" src="" alt="" class="qr-bank-logo d-none">
                <strong id="qrBankName">—</strong>
              </div>
              <div class="qr-info-row">
                <span class="qr-label">Số tài khoản</span>
                <span class="qr-value">
                  <strong id="qrAccountNumber">—</strong>
                  <button type="button" class="btn-copy" data-copy-target="qrAccountNumber" title="Sao chép"><i class="far fa-copy"></i></button>
                </span>
              </div>
              <div class="qr-info-row">
                <span class="qr-label">Chủ tài khoản</span>
                <strong id="qrAccountHolder" class="qr-value">—</strong>
              </div>
              <div class="qr-info-row amount-row">
                <span class="qr-label">Số tiền</span>
                <strong id="qrAmount" class="qr-value text-amount">—</strong>
              </div>
              <div class="qr-info-row">
                <span class="qr-label">Nội dung CK</span>
                <span class="qr-value">
                  <strong id="qrTransferContent">—</strong>
                  <button type="button" class="btn-copy" data-copy-target="qrTransferContent" title="Sao chép"><i class="far fa-copy"></i></button>
                </span>
              </div>
              <div class="payment-countdown">
                <i class="far fa-clock"></i> Hết hạn sau: <span id="paymentCountdown">15:00</span>
              </div>
              <ol class="qr-steps">
                <li>Mở ứng dụng ngân hàng</li>
                <li>Chọn quét QR hoặc chuyển khoản</li>
                <li>Xác nhận số tiền và nội dung</li>
              </ol>
            </div>
          </div>
        </div>

        <div id="panelBank" class="payment-detail-panel d-none">
          <div class="transfer-info-box">
            <div class="qr-info-row"><span class="qr-label">Ngân hàng</span><strong id="bankTransferName" class="qr-value">—</strong></div>
            <div class="qr-info-row">
              <span class="qr-label">Số tài khoản</span>
              <span class="qr-value">
                <strong id="bankAccountNumber">—</strong>
                <button type="button" class="btn-copy" data-copy-target="bankAccountNumber"><i class="far fa-copy"></i></button>
              </span>
            </div>
            <div class="qr-info-row"><span class="qr-label">Chủ tài khoản</span><strong id="bankAccountHolder" class="qr-value">—</strong></div>
            <div class="qr-info-row amount-row"><span class="qr-label">Số tiền</span><strong id="bankAmount" class="qr-value text-amount">—</strong></div>
            <div class="qr-info-row">
              <span class="qr-label">Nội dung CK</span>
              <span class="qr-value">
                <strong id="bankTransferContent">—</strong>
                <button type="button" class="btn-copy" data-copy-target="bankTransferContent"><i class="far fa-copy"></i></button>
              </span>
            </div>
          </div>
          <div class="form-group mt-4">
            <label class="payment-label">Mã giao dịch <span class="text-danger">*</span></label>
            <input type="text" name="transaction_ref" id="transactionRef" class="form-control payment-input" placeholder="Nhập mã giao dịch từ ngân hàng">
          </div>
          <div class="form-group">
            <label class="payment-label">Ảnh bill chuyển khoản</label>
            <div class="file-upload-zone" id="proofDropZone">
              <input type="file" name="payment_proof" id="paymentProof" accept="image/jpeg,image/png,image/gif">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Kéo thả hoặc bấm để chọn ảnh (JPG/PNG, tối đa 5MB)</span>
            </div>
            <div id="proofPreview" class="proof-preview d-none"><img src="" alt="Preview"></div>
          </div>
        </div>

        <div id="panelCard" class="payment-detail-panel d-none">
          <div class="credit-card-visual">
            <div class="cc-chip"></div>
            <div class="cc-number" id="ccVisualNumber">•••• •••• •••• ••••</div>
            <div class="cc-bottom">
              <span id="ccVisualName">TÊN CHỦ THẺ</span>
              <span id="ccVisualExpiry">MM/YY</span>
            </div>
          </div>
          <div class="credit-card-note mb-3">
            <i class="fas fa-lock"></i> Thông tin thẻ được mã hóa SSL — chỉ lưu 4 số cuối.
          </div>
          <div class="form-group">
            <label class="payment-label">Ngân hàng phát hành</label>
            <input type="text" id="cardBankName" class="form-control payment-input" readonly>
          </div>
          <div class="form-group">
            <label class="payment-label">Số thẻ <span class="text-danger">*</span></label>
            <input type="text" id="cardNumber" class="form-control payment-input" placeholder="1234 5678 9012 3456" maxlength="19" inputmode="numeric">
          </div>
          <div class="form-group">
            <label class="payment-label">Tên chủ thẻ <span class="text-danger">*</span></label>
            <input type="text" id="cardName" class="form-control payment-input" placeholder="NGUYEN VAN A">
          </div>
          <div class="form-row">
            <div class="col-md-6 form-group">
              <label class="payment-label">Hết hạn <span class="text-danger">*</span></label>
              <input type="text" id="cardExpiry" class="form-control payment-input" placeholder="MM/YY" maxlength="5">
            </div>
            <div class="col-md-6 form-group">
              <label class="payment-label">CVV <span class="text-danger">*</span></label>
              <input type="password" id="cardCvv" class="form-control payment-input" placeholder="•••" maxlength="4">
            </div>
          </div>
        </div>
      </div>

      <div class="payment-card payment-glass payment-step-confirm d-none">
        <h5 class="payment-step-title"><span>4</span> Xác nhận &amp; hoàn tất</h5>
        <form id="paymentConfirmForm" method="post" enctype="multipart/form-data" action="index.php?act=payment&order_id=<?= (int)$order_id ?>">
          <input type="hidden" name="action" value="confirm_payment">
          <input type="hidden" name="order_id" value="<?= (int)$order_id ?>">
          <input type="hidden" name="payment_method" id="formPaymentMethod" value="">
          <input type="hidden" name="bank_code" id="formBankCode" value="">
          <input type="hidden" name="transaction_ref" id="formTransactionRef" value="">
          <input type="hidden" name="account_holder" id="formAccountHolder" value="">
          <input type="hidden" name="card_number" id="formCardNumber" value="">
          <input type="hidden" name="card_name" id="formCardName" value="">
          <input type="hidden" name="card_expiry" id="formCardExpiry" value="">
          <input type="hidden" name="card_cvv" id="formCardCvv" value="">
          <div class="confirm-box">
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="confirmCheck" name="confirm_check" value="1">
              <label class="custom-control-label" for="confirmCheck">Tôi xác nhận đã thanh toán thành công</label>
            </div>
          </div>
          <button type="submit" id="btnSubmitPayment" class="payment-submit-btn" disabled>
            <span class="btn-text"><i class="fas fa-check-circle"></i> Hoàn tất thanh toán</span>
            <span class="btn-loading d-none"><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
          </button>
        </form>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="payment-summary-sticky">
        <div class="order-details-wrap payment-summary-card">
          <div class="summary-header">
            <div class="payment-summary-label">Tóm tắt đơn hàng</div>
            <span class="summary-order-id">#<?= (int)$order_id ?></span>
          </div>
          <span class="badge badge-payment-pending">Chờ thanh toán</span>

          <?php foreach ($items as $it): ?>
            <?php
              $showtimeId = (int)($it['showtime_id'] ?? 0);
              $seatsList = $seatsByShowtime[$showtimeId] ?? [];
            ?>
            <div class="summary-movie-item">
              <div class="sm-title"><?= htmlspecialchars($it['title']) ?></div>
              <div class="sm-meta">
                <?php if (!empty($it['showtime_label'])): ?>
                  <span><i class="far fa-clock"></i> <?= htmlspecialchars($it['showtime_label']) ?></span>
                <?php endif; ?>
                <?php if (!empty($seatsList)): ?>
                  <span><i class="fas fa-chair"></i> <?= htmlspecialchars(implode(', ', $seatsList)) ?></span>
                <?php endif; ?>
              </div>
              <div class="sm-price"><?= number_format((int)$it['line_total']) ?>đ</div>
            </div>
          <?php endforeach; ?>

          <?php if (!empty($snackItems)): ?>
            <div class="summary-snacks mt-3">
              <div class="payment-summary-label sm-sub">Combo bắp nước</div>
              <?php foreach ($snackItems as $s): ?>
                <div class="summary-snack-row">
                  <span><?= htmlspecialchars($s['name']) ?> × <?= (int)$s['qty'] ?></span>
                  <span><?= number_format((int)$s['line_total']) ?>đ</span>
                </div>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>

          <div class="payment-total-row mt-3">
            <span class="pl">Tiền vé</span>
            <span class="pv"><?= number_format($ticketTotal) ?>đ</span>
          </div>
          <div class="payment-total-row">
            <span class="pl">Combo</span>
            <span class="pv"><?= number_format($snackTotal) ?>đ</span>
          </div>
          <div class="payment-total-row">
            <span class="pl">Phí dịch vụ</span>
            <span class="pv">0đ</span>
          </div>
          <div class="payment-grand-row">
            <span class="pl">Tổng cộng</span>
            <span class="pv"><?= number_format($grandTotal) ?>đ</span>
          </div>

          <a class="payment-back-link" href="index.php?act=snack&order_id=<?= (int)$order_id ?>">
            <i class="fas fa-arrow-left"></i> Quay lại bắp nước
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
