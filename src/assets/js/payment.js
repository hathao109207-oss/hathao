(function ($) {
  'use strict';

  var app = $('#paymentApp');
  if (!app.length) return;

  var orderId = app.data('order-id');
  var amount = parseInt(app.data('amount'), 10) || 0;
  var baseUrl = app.data('base-url') || '/';

  var state = {
    method: 'qr_code',
    bankCode: null,
    bank: null,
    qr: null,
    transfer: null,
    countdownEnd: null,
    countdownTimer: null
  };

  var $stepBank = $('.payment-step-bank');
  var $stepDetails = $('.payment-step-details');
  var $stepConfirm = $('.payment-step-confirm');

  function formatMoney(n) {
    return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  }

  function showToast(msg) {
    var $t = $('<div class="copy-toast">' + msg + '</div>').appendTo('body');
    setTimeout(function () { $t.fadeOut(200, function () { $t.remove(); }); }, 1800);
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  function paymentApiUrl() {
    var base = String(baseUrl || '/');
    if (base.indexOf('http') === 0) {
      return base.replace(/\/?$/, '/') + 'index.php?act=payment&order_id=' + orderId;
    }
    var origin = window.location.origin || '';
    if (base.charAt(0) !== '/') base = '/' + base;
    return origin + base.replace(/\/?$/, '/') + 'index.php?act=payment&order_id=' + orderId;
  }

  function postAction(action, data, cb) {
    data = data || {};
    data.action = action;
    data.order_id = orderId;
    $.ajax({
      url: paymentApiUrl(),
      method: 'POST',
      data: data,
      dataType: 'json'
    })
      .done(function (res) {
        if (typeof res === 'string') {
          try { res = JSON.parse(res); } catch (e) { res = { success: false, message: 'Phản hồi không hợp lệ.' }; }
        }
        cb(res);
      })
      .fail(function (xhr) {
        var msg = 'Không thể kết nối máy chủ.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          msg = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          try {
            var parsed = JSON.parse(xhr.responseText);
            if (parsed.message) msg = parsed.message;
          } catch (e) {
            if (xhr.status === 404) msg = 'Không tìm thấy API thanh toán (404).';
            else if (xhr.status) msg = 'Lỗi máy chủ (HTTP ' + xhr.status + ').';
          }
        }
        cb({ success: false, message: msg });
      });
  }

  function setStepper(step) {
    $('.payment-stepper .ps-item').each(function () {
      var s = parseInt($(this).data('step'), 10);
      $(this).toggleClass('active', s === step);
      $(this).toggleClass('done', s < step);
    });
  }

  function selectMethodCard($card) {
    $('.payment-method-card').removeClass('selected');
    $card.addClass('selected');
    state.method = $card.data('method');
    setStepper(2);
    $stepBank.removeClass('d-none');
    $stepDetails.addClass('d-none');
    $stepConfirm.addClass('d-none');
    $('.bank-item').removeClass('selected');
    state.bankCode = null;
    state.bank = null;
    $('#formPaymentMethod').val(state.method);

    setTimeout(function () {
      var el = $stepBank[0];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }

  function renderBanks(banks) {
    var html = '';
    banks.forEach(function (b) {
      var logo = b.logo_url ? (baseUrl + b.logo_url) : '';
      html += '<button type="button" class="bank-item" data-code="' + b.code + '" title="' + b.name + '">' +
        '<div class="bank-logo">' +
        (logo ? '<img src="' + logo + '" alt="' + b.short_name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><span class="bank-logo-fallback" style="display:none;">' + b.code + '</span>'
          : '<span class="bank-logo-fallback">' + b.code + '</span>') +
        '</div><div class="bank-short">' + b.code + '</div><div class="bank-full">' + b.short_name + '</div></button>';
    });
    $('#bankGrid').html(html || '<p class="text-muted p-3">Không tìm thấy ngân hàng.</p>');
  }

  function showPaymentDetails(data) {
    setStepper(3);
    $stepDetails.removeClass('d-none');
    $stepConfirm.removeClass('d-none');

    setTimeout(function () {
      var el = $stepDetails[0];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
    $('#panelQr, #panelBank, #panelCard').addClass('d-none');

    if (state.method === 'qr_code' && data.qr) {
      $('#panelQr').removeClass('d-none');
      $('#qrImage').attr('src', data.qr.qr_url);
      $('#qrBankName').text(data.bank.short_name + ' - ' + data.bank.name);
      if (data.bank.logo_url) {
        $('#qrBankLogo').attr('src', baseUrl + data.bank.logo_url).removeClass('d-none');
      }
      $('#qrAccountNumber').text(data.qr.account_number);
      $('#qrAccountHolder').text(data.qr.account_holder);
      $('#qrAmount').text(formatMoney(data.qr.amount));
      $('#qrTransferContent').text(data.qr.transfer_content);
      startCountdown(15 * 60);
    }

    $('#formBankCode').val(state.bankCode);
    syncConfirmForm();
  }

  function startCountdown(seconds) {
    if (state.countdownTimer) clearInterval(state.countdownTimer);
    state.countdownEnd = Date.now() + seconds * 1000;
    var $el = $('#paymentCountdown');
    state.countdownTimer = setInterval(function () {
      var left = Math.max(0, Math.floor((state.countdownEnd - Date.now()) / 1000));
      var m = String(Math.floor(left / 60)).padStart(2, '0');
      var s = String(left % 60).padStart(2, '0');
      $el.text(m + ':' + s);
      $el.toggleClass('countdown-danger', left < 120);
      if (left <= 0) clearInterval(state.countdownTimer);
    }, 1000);
  }

  function syncConfirmForm() {
    // Hidden fields sync if any
  }

  function checkConfirmFormState() {
    var hasFile = $('#paymentProof')[0] && $('#paymentProof')[0].files && $('#paymentProof')[0].files.length > 0;
    var isChecked = $('#confirmCheck').is(':checked');
    $('#btnSubmitPayment').prop('disabled', !(isChecked && hasFile));
  }

  function validateBeforeSubmit() {
    if (!state.method || !state.bankCode) {
      showToast('Vui lòng chọn phương thức và ngân hàng.');
      return false;
    }
    var proofInput = $('#paymentProof')[0];
    if (!proofInput || !proofInput.files || !proofInput.files.length) {
      showToast('Vui lòng tải lên ảnh chụp màn hình thanh toán.');
      return false;
    }
    if (!$('#confirmCheck').is(':checked')) {
      showToast('Vui lòng xác nhận đã thanh toán.');
      return false;
    }
    return true;
  }

  $('.payment-method-card').on('click', function () {
    selectMethodCard($(this));
  });

  $(document).on('click', '.bank-item', function () {
    var code = $(this).data('code');
    $('.bank-item').removeClass('selected');
    $(this).addClass('selected');
    state.bankCode = code;
    postAction('select_method', { payment_method: state.method, bank_code: code }, function (res) {
      if (!res.success) {
        showToast(res.message || 'Lỗi chọn ngân hàng.');
        return;
      }
      state.bank = res.data.bank;
      showPaymentDetails(res.data);
    });
  });

  $('#bankSearchInput').on('input', debounce(function () {
    var kw = $(this).val().trim();
    postAction('search_bank', { keyword: kw }, function (res) {
      if (res.success && res.data && res.data.banks) {
        renderBanks(res.data.banks);
      }
    });
  }, 300));

  $(document).on('click', '.btn-copy', function () {
    var id = $(this).data('copy-target');
    var text = $('#' + id).text().trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { showToast('Đã sao chép!'); });
    } else {
      var $tmp = $('<textarea>').val(text).appendTo('body').select();
      document.execCommand('copy');
      $tmp.remove();
      showToast('Đã sao chép!');
    }
  });

  $('#paymentProof').on('change', function () {
    var file = this.files[0];
    if (!file) {
      $('#proofPreview').addClass('d-none').find('img').attr('src', '');
      checkConfirmFormState();
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ảnh tối đa 5MB.');
      this.value = '';
      $('#proofPreview').addClass('d-none').find('img').attr('src', '');
      checkConfirmFormState();
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#proofPreview').removeClass('d-none').find('img').attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
    checkConfirmFormState();
  });

  $('#confirmCheck').on('change', function () {
    checkConfirmFormState();
    if (this.checked) setStepper(4);
  });

  $('#paymentConfirmForm').on('submit', function (e) {
    if (!validateBeforeSubmit()) {
      e.preventDefault();
      return;
    }
    $('#btnSubmitPayment').prop('disabled', true);
    $('#btnSubmitPayment .btn-text').addClass('d-none');
    $('#btnSubmitPayment .btn-loading').removeClass('d-none');
  });

  setStepper(2);

})(jQuery);
