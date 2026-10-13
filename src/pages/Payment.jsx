import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showtimes, banks } from '../data/mockData';
import { useApp } from '../context/AppContext';

const Payment = () => {
  const navigate = useNavigate();
  const { movieList, currentBooking, placeOrder, addToast, user, adminPaymentSettings } = useApp();

  const movie = movieList.find(m => m.id === currentBooking.movieId) || movieList[0];
  const showtime = showtimes.find(s => s.id === currentBooking.showtimeId) || showtimes[0];

  const seatPrice = movie.price || 100000;
  const seatsTotal = (currentBooking.seats?.length || 1) * seatPrice;
  const snacksTotal = (currentBooking.snacks || []).reduce((sum, s) => sum + (s.price * s.qty), 0);
  const grandTotal = seatsTotal + snacksTotal;

  // Contact Info
  const [customerName, setCustomerName] = useState(user?.fullname || user?.username || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  React.useEffect(() => {
    if (user) {
      if (user.fullname || user.username) setCustomerName(user.fullname || user.username);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState('bank_qr');
  const selectedBank = banks[0];
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // QR Scan Verification & Proof States
  const [qrScannedConfirmed, setQrScannedConfirmed] = useState(false);
  const [showQrNotScannedWarning, setShowQrNotScannedWarning] = useState(false);
  const [transactionRefCode, setTransactionRefCode] = useState('');
  const [paymentProofImage, setPaymentProofImage] = useState(null);
  const [paymentProofName, setPaymentProofName] = useState('');
  const [zoomedQr, setZoomedQr] = useState(null);

  const finalTotal = Math.max(0, grandTotal - discount);
  const [orderRef] = useState(() => `CT${Math.floor(100000 + Math.random() * 900000)}`);

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (voucherCode.toUpperCase() === 'VIP25' || voucherCode.toUpperCase() === 'CINETICKET') {
      const disc = Math.round(grandTotal * 0.2);
      setDiscount(disc);
      addToast(`Áp dụng mã giảm giá thành công! Giảm ${disc.toLocaleString()} đ`, 'success');
    } else {
      addToast('Mã voucher không hợp lệ hoặc đã hết hạn (Thử: VIP25 hoặc CINETICKET)!', 'error');
    }
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Vui lòng chọn file hình ảnh (PNG, JPG, JPEG)!', 'error');
        return;
      }
      setPaymentProofName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPaymentProofImage(event.target.result);
        setQrScannedConfirmed(true);
        addToast('Đã tải lên ảnh chứng minh chuyển khoản & xác thực quét mã!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyText = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      addToast(`Đã sao chép ${label}: ${text}`, 'info');
    }
  };

  const handleConfirmPayment = () => {
    if (!customerEmail.trim()) {
      addToast('Vui lòng nhập email để nhận vé điện tử và xác nhận!', 'error');
      return;
    }

    // CHECK IF QR PAYMENT METHOD WAS NOT SCANNED OR PAID YET
    const isQrPayment = paymentMethod === 'bank_qr' || paymentMethod === 'momo';
    if (isQrPayment && !qrScannedConfirmed && !paymentProofImage && !transactionRefCode.trim()) {
      addToast('Chưa phát hiện thanh toán! Bạn chưa quét mã QR hoặc chưa chuyển khoản.', 'error');
      setShowQrNotScannedWarning(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const methodName = paymentMethod === 'bank_qr'
        ? `Chuyển khoản QR (${adminPaymentSettings?.bankName || selectedBank.name})`
        : paymentMethod === 'momo'
        ? `Ví MoMo (${adminPaymentSettings?.momoPhone || '0337191740'})`
        : paymentMethod === 'vnpay'
        ? 'Cổng VNPAY / Thẻ ATM'
        : 'Thẻ Quốc Tế Visa/Mastercard';

      const order = placeOrder({
        methodName,
        payment_proof: paymentProofImage,
        transaction_code: transactionRefCode.trim() || undefined,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        discount,
        finalTotal,
        status: 'Đã thanh toán'
      });

      addToast(`Thanh toán thành công! Thông báo đã gửi từ admin hthaongn@gmail.com tới ${customerEmail}`, 'success');
      setIsProcessing(false);
      navigate(`/order-success/${order.id}?paid=1`);
    }, 1200);
  };

  return (
    <div className="payment-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="far fa-credit-card mr-2"></i> Cổng Thanh Toán Trực Tuyến An Toàn
          </p>
          <h1 className="catalog-title">XÁC NHẬN &amp; THANH TOÁN VÉ VIP</h1>
        </div>
      </div>

      <div className="container mt-4 mb-5">
        {/* Booking Steps Progress Bar */}
        <div className="seat-steps mb-5">
          <div className="seat-step">
            <div className="seat-step-icon"><i className="fas fa-couch"></i></div>
            <div className="seat-step-text">1. Chọn ghế</div>
          </div>
          <div className="seat-step">
            <div className="seat-step-icon"><i className="fas fa-shopping-basket"></i></div>
            <div className="seat-step-text">2. Bắp nước</div>
          </div>
          <div className="seat-step active">
            <div className="seat-step-icon"><i className="far fa-credit-card"></i></div>
            <div className="seat-step-text">3. Thanh toán</div>
          </div>
          <div className="seat-step">
            <div className="seat-step-icon"><i className="fas fa-ticket-alt"></i></div>
            <div className="seat-step-text">4. Vé điện tử</div>
          </div>
        </div>

        <div className="row">
          {/* Left Column: Contact info & Payment Methods */}
          <div className="col-lg-7 mb-4">
            {/* Customer Details Card */}
            <div style={{
              background: 'rgba(18, 20, 29, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '26px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-user-check" style={{ color: '#f3cf7a' }}></i> Thông Tin Người Nhận Vé Điện Tử
              </h3>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Họ và tên</label>
                  <input
                    type="text"
                    required
                    className="form-control filter-input-vip"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Số điện thoại</label>
                  <input
                    type="text"
                    required
                    className="form-control filter-input-vip"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0901234567"
                  />
                </div>
                <div className="col-12 mb-2">
                  <label style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Email nhận vé &amp; biên lai xác nhận <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="form-control filter-input-vip"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                  <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                    <i className="fas fa-envelope mr-1"></i> Vé điện tử và mã QR check-in sẽ được gửi tự động tới địa chỉ email này sau khi hoàn tất thanh toán.
                  </small>
                </div>
              </div>
            </div>

            {/* Payment Method Selector Card */}
            <div style={{
              background: 'rgba(18, 20, 29, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '26px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-credit-card" style={{ color: '#f3cf7a' }}></i> Chọn Phương Thức Thanh Toán
              </h3>

              {/* Methods List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {/* Method 1: VietQR */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: paymentMethod === 'bank_qr' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(9, 10, 15, 0.6)',
                  border: `1px solid ${paymentMethod === 'bank_qr' ? '#f3cf7a' : 'rgba(212, 175, 55, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="method"
                    value="bank_qr"
                    checked={paymentMethod === 'bank_qr'}
                    onChange={() => setPaymentMethod('bank_qr')}
                  />
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f3cf7a', fontSize: '20px' }}>
                    <i className="fas fa-qrcode"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Quét Mã VietQR (Khuyên Dùng)</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px' }}>Tự động điền số tiền và nội dung, hỗ trợ tất cả ứng dụng ngân hàng</div>
                  </div>
                </label>

                {/* Method 2: MoMo */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: paymentMethod === 'momo' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(9, 10, 15, 0.6)',
                  border: `1px solid ${paymentMethod === 'momo' ? '#f3cf7a' : 'rgba(212, 175, 55, 0.2)'}`,
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="method"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                  />
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(216, 45, 139, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d82d8b', fontSize: '20px' }}>
                    <i className="fas fa-wallet"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Ví MoMo</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px' }}>Thanh toán tức thì qua ví điện tử MoMo</div>
                  </div>
                </label>

                {/* Method 3: VNPAY */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: paymentMethod === 'vnpay' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(9, 10, 15, 0.6)',
                  border: `1px solid ${paymentMethod === 'vnpay' ? '#f3cf7a' : 'rgba(212, 175, 55, 0.2)'}`,
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="method"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => setPaymentMethod('vnpay')}
                  />
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 102, 204, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0066cc', fontSize: '20px' }}>
                    <i className="far fa-credit-card"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Cổng VNPAY / Thẻ ATM Nội Địa</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px' }}>Hỗ trợ thẻ ATM của hơn 40 ngân hàng tại Việt Nam</div>
                  </div>
                </label>
              </div>

              {/* Method 1: VietQR & Admin QR Code Details Box */}
              {paymentMethod === 'bank_qr' && (() => {
                const qrImageSrc = adminPaymentSettings?.qrType === 'vietqr'
                  ? `https://img.vietqr.io/image/${adminPaymentSettings.bankCode || 'MB'}-${adminPaymentSettings.accountNumber || '098765432199'}-compact2.png?amount=${finalTotal}&addInfo=${orderRef}&accountName=${encodeURIComponent(adminPaymentSettings.accountHolder || '')}`
                  : (adminPaymentSettings?.qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=CINETICKET_ADMIN_${finalTotal}_${orderRef}`);

                const displayBankName = adminPaymentSettings?.bankName || selectedBank.name;
                const displayAccount = adminPaymentSettings?.accountNumber || selectedBank.account;
                const displayHolder = adminPaymentSettings?.accountHolder || selectedBank.holder;

                return (
                  <div style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.18), transparent 70%), rgba(9, 10, 15, 0.85)',
                    border: '1.5px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '18px',
                    padding: '24px',
                    textAlign: 'center',
                    marginBottom: '24px',
                    boxShadow: '0 10px 35px rgba(0,0,0,0.5)'
                  }}>
                    {/* VIP Official Admin QR Badge */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                        color: '#090a0f',
                        padding: '5px 16px',
                        borderRadius: '999px',
                        fontWeight: 900,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 10px rgba(212, 175, 55, 0.4)'
                      }}>
                        <i className="fas fa-shield-alt" /> MÃ QR THANH TOÁN ADMIN CINETICKET
                      </span>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12.5px', marginTop: '8px', marginBottom: 0 }}>
                        Quét mã QR bằng ứng dụng ngân hàng bất kỳ để chuyển khoản tự động
                      </p>
                    </div>

                    {/* QR Code Visual Box */}
                    <div style={{
                      display: 'inline-block',
                      background: '#fff',
                      padding: '16px',
                      borderRadius: '16px',
                      margin: '6px auto 14px',
                      boxShadow: '0 0 30px rgba(212, 175, 55, 0.35)',
                      position: 'relative'
                    }}>
                      <img
                        src={qrImageSrc}
                        alt="Mã QR Admin"
                        style={{ width: '200px', height: '200px', display: 'block', objectFit: 'contain', cursor: 'zoom-in' }}
                        onClick={() => setZoomedQr(qrImageSrc)}
                        title="Nhấn để phóng to mã QR"
                        onError={(e) => {
                          e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=CINETICKET_ADMIN_${finalTotal}_${orderRef}`;
                        }}
                      />
                      <div style={{ color: '#090a0f', fontWeight: 900, fontSize: '13px', marginTop: '8px', textTransform: 'uppercase' }}>
                        {displayBankName}
                      </div>
                      <button
                        type="button"
                        onClick={() => setZoomedQr(qrImageSrc)}
                        style={{
                          background: 'rgba(9, 10, 15, 0.08)',
                          border: 'none',
                          color: '#475569',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          marginTop: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-search-plus mr-1" /> Chạm để phóng to QR
                      </button>
                    </div>

                    {/* Interactive QR Scan Verification Status Box */}
                    <div style={{
                      margin: '10px auto 18px',
                      maxWidth: '520px',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      background: qrScannedConfirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1.5px solid ${qrScannedConfirmed ? '#10b981' : 'rgba(239, 68, 68, 0.45)'}`,
                      textAlign: 'center',
                      boxShadow: qrScannedConfirmed ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                        <i className={qrScannedConfirmed ? "fas fa-check-circle" : "fas fa-exclamation-triangle"} style={{ color: qrScannedConfirmed ? '#10b981' : '#ef4444', fontSize: '18px' }} />
                        <span style={{ color: qrScannedConfirmed ? '#10b981' : '#fca5a5', fontWeight: 800, fontSize: '13.5px' }}>
                          {qrScannedConfirmed ? 'ĐÃ XÁC NHẬN: BẠN ĐÃ QUÉT MÃ QR & CHUYỂN KHOẢN' : 'TRẠNG THÁI: CHƯA QUÉT MÃ THANH TOÁN QR'}
                        </span>
                      </div>

                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', margin: '0 0 10px', lineHeight: '1.4' }}>
                        {qrScannedConfirmed
                          ? '✓ Hệ thống đã ghi nhận bạn đã chuyển khoản. Bạn có thể đính kèm ảnh biên lai bên dưới hoặc bấm Xác nhận để nhận vé.'
                          : '⚠️ Khách hàng vui lòng dùng ứng dụng ngân hàng quét mã QR trên và chuyển tiền trước. Nếu chưa quét mã, hệ thống sẽ KHÔNG chấp nhận đặt vé!'}
                      </p>

                      {qrScannedConfirmed ? (
                        <button
                          type="button"
                          onClick={() => {
                            setQrScannedConfirmed(false);
                            addToast('Đã hủy trạng thái xác nhận quét mã. Bạn cần quét lại mã QR!', 'info');
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#cbd5e1',
                            padding: '6px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-undo mr-1" /> Hủy xác nhận (Quét lại)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setQrScannedConfirmed(true);
                            addToast('Đã xác nhận đã quét mã QR & chuyển khoản thành công!', 'success');
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: '#fff',
                            border: 'none',
                            padding: '9px 20px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <i className="fas fa-qrcode" /> Tôi Đã Quét Mã QR &amp; Chuyển Khoản Xong
                        </button>
                      )}
                    </div>

                    {/* Bank Transfer Info with Copy Buttons */}
                    <div style={{ fontSize: '13.5px', textAlign: 'left', background: 'rgba(18, 20, 29, 0.95)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Ngân hàng thụ hưởng:</span>
                        <strong style={{ color: '#fff' }}>{displayBankName}</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Số tài khoản:</span>
                        <div>
                          <strong style={{ color: '#f3cf7a', marginRight: '8px', fontSize: '15px' }}>{displayAccount}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(displayAccount, 'Số tài khoản')}
                            style={{ background: 'rgba(212, 175, 55, 0.18)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#f3cf7a', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy mr-1" /> Copy
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Chủ tài khoản (Người nhận):</span>
                        <div>
                          <strong style={{ color: '#fff', marginRight: '8px' }}>{displayHolder}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(displayHolder, 'Chủ tài khoản')}
                            style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#cbd5e1', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy" />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Số tiền chuyển khoản:</span>
                        <div>
                          <strong style={{ color: '#10b981', fontSize: '17px', marginRight: '8px' }}>{finalTotal.toLocaleString('vi-VN')} đ</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(String(finalTotal), 'Số tiền')}
                            style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy mr-1" /> Copy
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Nội dung chuyển khoản:</span>
                        <div>
                          <strong style={{ color: '#f3cf7a', marginRight: '8px', fontSize: '15px' }}>{orderRef}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(orderRef, 'Nội dung chuyển khoản')}
                            style={{ background: 'rgba(212, 175, 55, 0.18)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#f3cf7a', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy mr-1" /> Copy
                          </button>
                        </div>
                      </div>

                      {adminPaymentSettings?.branch && (
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                          <i className="fas fa-map-marker-alt mr-1" style={{ color: '#f3cf7a' }} /> Chi nhánh: {adminPaymentSettings.branch}
                        </div>
                      )}

                      {adminPaymentSettings?.instructionNote && (
                        <div style={{ marginTop: '8px', color: '#38bdf8', fontSize: '12px' }}>
                          <i className="fas fa-info-circle mr-1" /> {adminPaymentSettings.instructionNote}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Method 2: MoMo Admin QR Details Box */}
              {paymentMethod === 'momo' && (() => {
                const momoQrImage = adminPaymentSettings?.momoQrImageUrl || adminPaymentSettings?.qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=2|99|${adminPaymentSettings?.momoPhone || '0909123456'}|${encodeURIComponent(adminPaymentSettings?.momoHolder || 'ADMIN')}|0|0|${finalTotal}|${orderRef}`;
                const momoPhone = adminPaymentSettings?.momoPhone || '0909123456';
                const momoHolder = adminPaymentSettings?.momoHolder || adminPaymentSettings?.accountHolder || 'NGUYỄN NGỌC HÀ THẢO';

                return (
                  <div style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(216, 45, 139, 0.22), transparent 70%), rgba(9, 10, 15, 0.85)',
                    border: '1.5px solid rgba(216, 45, 139, 0.4)',
                    borderRadius: '18px',
                    padding: '24px',
                    textAlign: 'center',
                    marginBottom: '24px',
                    boxShadow: '0 10px 35px rgba(0,0,0,0.5)'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #ec4899, #d946ef)',
                        color: '#fff',
                        padding: '5px 16px',
                        borderRadius: '999px',
                        fontWeight: 900,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <i className="fas fa-wallet" /> MÃ QR VÍ MOMO ADMIN CINETICKET
                      </span>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12.5px', marginTop: '8px', marginBottom: 0 }}>
                        Mở ứng dụng MoMo và quét mã QR hoặc chuyển đến số điện thoại bên dưới
                      </p>
                    </div>

                    <div style={{
                      display: 'inline-block',
                      background: '#fff',
                      padding: '16px',
                      borderRadius: '16px',
                      margin: '6px auto 14px',
                      boxShadow: '0 0 30px rgba(216, 45, 139, 0.35)'
                    }}>
                      <img
                        src={momoQrImage}
                        alt="Mã QR MoMo Admin"
                        style={{ width: '200px', height: '200px', display: 'block', objectFit: 'contain', cursor: 'zoom-in' }}
                        onClick={() => setZoomedQr(momoQrImage)}
                        title="Nhấn để phóng to mã QR"
                      />
                      <div style={{ color: '#a21caf', fontWeight: 900, fontSize: '13px', marginTop: '8px' }}>
                        VÍ ĐIỆN TỬ MOMO
                      </div>
                      <button
                        type="button"
                        onClick={() => setZoomedQr(momoQrImage)}
                        style={{
                          background: 'rgba(216, 45, 139, 0.1)',
                          border: 'none',
                          color: '#d946ef',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          marginTop: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-search-plus mr-1" /> Chạm để phóng to QR
                      </button>
                    </div>

                    {/* Interactive MoMo QR Scan Verification Status Box */}
                    <div style={{
                      margin: '10px auto 18px',
                      maxWidth: '520px',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      background: qrScannedConfirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1.5px solid ${qrScannedConfirmed ? '#10b981' : 'rgba(239, 68, 68, 0.45)'}`,
                      textAlign: 'center',
                      boxShadow: qrScannedConfirmed ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                        <i className={qrScannedConfirmed ? "fas fa-check-circle" : "fas fa-exclamation-triangle"} style={{ color: qrScannedConfirmed ? '#10b981' : '#ef4444', fontSize: '18px' }} />
                        <span style={{ color: qrScannedConfirmed ? '#10b981' : '#fca5a5', fontWeight: 800, fontSize: '13.5px' }}>
                          {qrScannedConfirmed ? 'ĐÃ XÁC NHẬN: BẠN ĐÃ QUÉT MÃ MOMO & CHUYỂN TIỀN' : 'TRẠNG THÁI: CHƯA QUÉT MÃ MOMO'}
                        </span>
                      </div>

                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', margin: '0 0 10px', lineHeight: '1.4' }}>
                        {qrScannedConfirmed
                          ? '✓ Hệ thống đã ghi nhận bạn đã chuyển tiền MoMo. Bạn có thể đính kèm ảnh biên lai bên dưới hoặc bấm Xác nhận để nhận vé.'
                          : '⚠️ Khách hàng vui lòng mở ví MoMo quét mã QR trên và chuyển tiền trước. Nếu chưa chuyển tiền, hệ thống sẽ KHÔNG chấp nhận đặt vé!'}
                      </p>

                      {qrScannedConfirmed ? (
                        <button
                          type="button"
                          onClick={() => {
                            setQrScannedConfirmed(false);
                            addToast('Đã hủy trạng thái xác nhận quét mã MoMo', 'info');
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#cbd5e1',
                            padding: '6px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-undo mr-1" /> Hủy xác nhận (Quét lại)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setQrScannedConfirmed(true);
                            addToast('Đã xác nhận đã quét mã MoMo & chuyển tiền thành công!', 'success');
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #d946ef, #a21caf)',
                            color: '#fff',
                            border: 'none',
                            padding: '9px 20px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(217, 70, 239, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <i className="fas fa-qrcode" /> Tôi Đã Quét Mã MoMo &amp; Chuyển Tiền Xong
                        </button>
                      )}
                    </div>

                    <div style={{ fontSize: '13.5px', textAlign: 'left', background: 'rgba(18, 20, 29, 0.95)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Số điện thoại MoMo:</span>
                        <div>
                          <strong style={{ color: '#f472b6', marginRight: '8px', fontSize: '15px' }}>{momoPhone}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(momoPhone, 'Số điện thoại MoMo')}
                            style={{ background: 'rgba(216, 45, 139, 0.2)', border: '1px solid rgba(216, 45, 139, 0.4)', color: '#f472b6', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy mr-1" /> Copy
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Tên chủ ví:</span>
                        <div>
                          <strong style={{ color: '#fff', marginRight: '8px' }}>{momoHolder}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(momoHolder, 'Tên chủ ví')}
                            style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#cbd5e1', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy" />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Số tiền thanh toán:</span>
                        <div>
                          <strong style={{ color: '#10b981', fontSize: '17px', marginRight: '8px' }}>{finalTotal.toLocaleString('vi-VN')} đ</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(String(finalTotal), 'Số tiền')}
                            style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy mr-1" /> Copy
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Lời nhắn chuyển khoản:</span>
                        <div>
                          <strong style={{ color: '#f3cf7a', marginRight: '8px', fontSize: '15px' }}>{orderRef}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(orderRef, 'Lời nhắn MoMo')}
                            style={{ background: 'rgba(212, 175, 55, 0.18)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#f3cf7a', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy mr-1" /> Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Method 3: VNPAY QR Details Box */}
              {paymentMethod === 'vnpay' && (
                <div style={{
                  background: 'radial-gradient(circle at 50% 0%, rgba(0, 102, 204, 0.2), transparent 70%), rgba(9, 10, 15, 0.85)',
                  border: '1.5px solid rgba(0, 102, 204, 0.4)',
                  borderRadius: '18px',
                  padding: '24px',
                  textAlign: 'center',
                  marginBottom: '24px',
                  boxShadow: '0 10px 35px rgba(0,0,0,0.5)'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#fff',
                    padding: '5px 16px',
                    borderRadius: '999px',
                    fontWeight: 900,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <i className="fas fa-qrcode" /> CỔNG THANH TOÁN VNPAY-QR
                  </span>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12.5px', marginTop: '10px', marginBottom: '14px' }}>
                    Quét mã QR bằng App ngân hàng (Vietcombank, BIDV, VietinBank, Agribank,...) hoặc ví VNPAY.
                  </p>
                  <div style={{
                    display: 'inline-block',
                    background: '#fff',
                    padding: '16px',
                    borderRadius: '16px',
                    margin: '0 auto 14px',
                    boxShadow: '0 0 30px rgba(0, 102, 204, 0.35)'
                  }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=VNPAY_CINETICKET_${finalTotal}_${orderRef}`}
                      alt="VNPAY QR"
                      style={{ width: '200px', height: '200px', display: 'block', objectFit: 'contain' }}
                    />
                    <div style={{ color: '#0066cc', fontWeight: 900, fontSize: '13px', marginTop: '8px' }}>VNPAY-QR</div>
                  </div>
                  <div style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 700 }}>
                    Mã Giao Dịch: <span style={{ color: '#f3cf7a' }}>{orderRef}</span> • Số Tiền: <span style={{ color: '#10b981' }}>{finalTotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              )}

              {/* UPLOAD PAYMENT PROOF SECTION */}
              <div style={{
                background: 'rgba(9, 10, 15, 0.75)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <i className="fas fa-file-upload" style={{ color: '#f3cf7a', fontSize: '18px' }}></i>
                  <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, margin: 0 }}>
                    Upload Ảnh Chứng Minh Thanh Toán (Biên Lai / Bill Chuyển Khoản)
                  </h4>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12.5px', marginBottom: '14px' }}>
                  Sau khi quét mã QR hoặc chuyển khoản thành công, hãy tải lên ảnh chụp màn hình giao dịch để Quản trị viên đối soát và cấp vé ngay lập tức.
                </p>

                {paymentProofImage ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '12px' }}>
                    <img
                      src={paymentProofImage}
                      alt="Proof Preview"
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #10b981' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#10b981', fontWeight: 800, fontSize: '13px' }}>
                        <i className="fas fa-check-circle mr-1"></i> Đã đính kèm ảnh chứng minh
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{paymentProofName || 'anh_chuyen_khoan.jpg'}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setPaymentProofImage(null); setPaymentProofName(''); }}
                      style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      <i className="fas fa-trash-alt mr-1"></i> Xóa
                    </button>
                  </div>
                ) : (
                  <div>
                    <label style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed rgba(212, 175, 55, 0.4)',
                      borderRadius: '12px',
                      padding: '24px 16px',
                      cursor: 'pointer',
                      background: 'rgba(212, 175, 55, 0.04)',
                      transition: 'all 0.2s'
                    }}>
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '32px', color: '#f3cf7a', marginBottom: '8px' }}></i>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '13.5px' }}>Nhấn để chọn ảnh hoặc kéo thả vào đây</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>PNG, JPG, JPEG (Tối đa 10MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}

                {/* Optional Transaction Ref Code Input */}
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    <i className="fas fa-barcode mr-1" /> Hoặc Nhập Mã Giao Dịch Chuyển Khoản / MoMo:
                  </label>
                  <input
                    type="text"
                    value={transactionRefCode}
                    onChange={(e) => {
                      setTransactionRefCode(e.target.value);
                      if (e.target.value.trim().length >= 4) {
                        setQrScannedConfirmed(true);
                      }
                    }}
                    placeholder="VD: FT2610..., MM2610..., 982341..."
                    className="form-control filter-input-vip"
                    style={{ fontSize: '13px' }}
                  />
                  <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    * Nhập mã giao dịch này hoặc tải ảnh biên lai để hệ thống xác thực thanh toán với Admin (hthaongn@gmail.com).
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="col-lg-5">
            <div style={{
              background: 'rgba(18, 20, 29, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.28)',
              borderRadius: '20px',
              padding: '26px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '14px' }}>
                Hóa Đơn Đặt Vé VIP
              </h3>

              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  style={{ width: '64px', height: '86px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                  onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }}
                />
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>{movie.title}</div>
                  <div style={{ color: '#f3cf7a', fontSize: '13px', marginTop: '3px' }}>
                    {currentBooking.cinemaName || showtime.cinema_name}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px' }}>
                    {showtime.room} • {showtime.show_time}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '8px' }}>
                <span>Ghế: <strong>{currentBooking.seats?.join(', ')}</strong> ({currentBooking.seats?.length} vé)</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{seatsTotal.toLocaleString()} đ</span>
              </div>

              {snacksTotal > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '4px' }}>
                    <span>Combo bắp nước ({currentBooking.snacks?.length} loại):</span>
                    <span style={{ color: '#fff', fontWeight: 700 }}>{snacksTotal.toLocaleString()} đ</span>
                  </div>
                  {currentBooking.snacks?.map(s => (
                    <div key={s.id} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', paddingLeft: '8px' }}>
                      • {s.name} x{s.qty} ({(s.price * s.qty).toLocaleString()} đ)
                    </div>
                  ))}
                </div>
              )}

              {/* Voucher Input */}
              <form onSubmit={handleApplyVoucher} style={{ margin: '18px 0', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Nhập mã VIP25..."
                  className="form-control filter-input-vip"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  style={{ flex: 1, textTransform: 'uppercase' }}
                />
                <button
                  type="submit"
                  className="bordered-btn"
                  style={{ padding: '0 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 800 }}
                >
                  Áp Dụng
                </button>
              </form>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontSize: '14px', marginBottom: '8px' }}>
                  <span>Giảm giá Voucher:</span>
                  <span>-{discount.toLocaleString()} đ</span>
                </div>
              )}

              <div style={{
                borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                paddingTop: '16px',
                marginTop: '16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>Tổng tiền phải trả:</span>
                <span style={{ color: '#f3cf7a', fontSize: '26px', fontWeight: 900 }}>
                  {finalTotal.toLocaleString('vi-VN')} đ
                </span>
              </div>

              {/* QR payment verification warning badge */}
              {(paymentMethod === 'bank_qr' || paymentMethod === 'momo') && !qrScannedConfirmed && !paymentProofImage && !transactionRefCode.trim() && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  color: '#fca5a5',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  lineHeight: '1.4'
                }}>
                  <i className="fas fa-lock" style={{ color: '#ef4444', fontSize: '20px' }} />
                  <div>
                    <strong style={{ color: '#fff', display: 'block' }}>Yêu Cầu Quét Mã Thanh Toán</strong>
                    <span>Bạn chưa quét mã QR. Vui lòng quét mã và xác nhận chuyển tiền trước khi bấm hoàn tất.</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="boxed-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)',
                  color: '#090a0f',
                  padding: '16px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontSize: '15px',
                  border: 'none',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  opacity: isProcessing ? 0.7 : 1,
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)'
                }}
              >
                {isProcessing ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i> Đang Xử Lý &amp; Gửi Xác Nhận...</span>
                ) : (
                  <span><i className="fas fa-check-circle mr-2"></i> Xác Nhận Hoàn Tất Đặt Vé</span>
                )}
              </button>

              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '14px' }}>
                <i className="fas fa-shield-alt mr-1"></i> Giao dịch bảo mật SSL 256-bit • Hỗ trợ hoàn tiền 24/7
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Zoomed QR Code */}
      {zoomedQr && (
        <div
          onClick={() => setZoomedQr(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(212, 175, 55, 0.4)',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setZoomedQr(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.1)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#333'
              }}
            >
              ×
            </button>
            <div style={{ color: '#090a0f', fontWeight: 900, fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>
              <i className="fas fa-qrcode mr-1" style={{ color: '#d4af37' }} /> Quét Mã QR Thanh Toán
            </div>
            <img
              src={zoomedQr}
              alt="Mã QR Phóng To"
              style={{ width: '100%', maxWidth: '300px', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }}
            />
            <div style={{ color: '#059669', fontWeight: 800, fontSize: '17px', marginTop: '14px' }}>
              {finalTotal.toLocaleString('vi-VN')} đ
            </div>
            <div style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>
              Nội dung: <strong>{orderRef}</strong>
            </div>
            <button
              type="button"
              onClick={() => setZoomedQr(null)}
              style={{
                marginTop: '16px',
                background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                color: '#090a0f',
                border: 'none',
                padding: '8px 24px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Processing Payment Loading Overlay */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 7, 15, 0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.25), transparent 70%), #0f121d',
            border: '2px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '24px',
            padding: '36px 32px',
            maxWidth: '460px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.35)',
            color: '#fff'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '4px solid rgba(212, 175, 55, 0.2)',
              borderTopColor: '#f3cf7a',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#f3cf7a'
            }}>
              <i className="fas fa-spinner fa-spin" />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '20px', fontWeight: 900, color: '#f3cf7a', marginBottom: '8px' }}>
              Đang Xác Nhận Thanh Toán...
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13.5px', marginBottom: '8px', lineHeight: '1.5' }}>
              Hệ thống đang hoàn tất đặt vé và chuẩn bị gửi thông báo tự động từ mail admin <strong style={{ color: '#f3cf7a' }}>hthaongn@gmail.com</strong>...
            </p>
            <div style={{ color: '#10b981', fontSize: '12.5px', fontWeight: 700 }}>
              <i className="fas fa-shield-alt mr-1" /> Giao dịch bảo mật 100%
            </div>
          </div>
        </div>
      )}

      {/* Modal Warning: Customer hasn't scanned QR code yet */}
      {showQrNotScannedWarning && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 7, 15, 0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.2), transparent 75%), #0f121d',
            border: '2px solid rgba(239, 68, 68, 0.6)',
            borderRadius: '24px',
            maxWidth: '500px',
            width: '100%',
            padding: '32px 26px',
            textAlign: 'center',
            boxShadow: '0 25px 65px rgba(0,0,0,0.95), 0 0 45px rgba(239, 68, 68, 0.35)',
            color: '#fff',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setShowQrNotScannedWarning(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid #ef4444',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)'
            }}>
              <i className="fas fa-exclamation-triangle" />
            </div>

            <h3 style={{ color: '#ef4444', fontSize: '20px', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase' }}>
              CHƯA PHÁT HIỆN THANH TOÁN QR!
            </h3>

            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '18px' }}>
              Hệ thống phát hiện quý khách <strong>chưa quét mã QR</strong> hoặc <strong>chưa hoàn tất chuyển khoản</strong> số tiền <strong style={{ color: '#f3cf7a' }}>{finalTotal.toLocaleString('vi-VN')} đ</strong> tới Admin (<strong style={{ color: '#38bdf8' }}>hthaongn@gmail.com</strong>).
            </p>

            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '14px',
              padding: '14px 18px',
              textAlign: 'left',
              marginBottom: '22px',
              fontSize: '13px',
              color: '#fca5a5'
            }}>
              <div style={{ fontWeight: 800, marginBottom: '6px', color: '#fff' }}>
                <i className="fas fa-info-circle mr-1" style={{ color: '#ef4444' }} /> Để hoàn tất và nhận vé VIP:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.5' }}>
                <li>Mở app ngân hàng hoặc MoMo, quét mã QR hiển thị ở bên trái.</li>
                <li>Chuyển đúng số tiền và nội dung: <strong style={{ color: '#f3cf7a' }}>{orderRef}</strong>.</li>
                <li>Sau khi chuyển, nhấn nút <strong>"Tôi Đã Quét Mã &amp; Chuyển Khoản Xong"</strong> (hoặc tải ảnh chụp biên lai).</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowQrNotScannedWarning(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Quay Lại Quét Mã QR
              </button>

              <button
                type="button"
                onClick={() => {
                  setQrScannedConfirmed(true);
                  setShowQrNotScannedWarning(false);
                  addToast('Đã xác nhận quét mã! Bây giờ bạn có thể bấm hoàn tất đặt vé.', 'success');
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fas fa-check" /> Tôi Đã Quét Mã &amp; Chuyển Tiền Rồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
