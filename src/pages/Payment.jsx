import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movies, showtimes, banks } from '../data/mockData';
import { useApp } from '../context/AppContext';

const Payment = () => {
  const navigate = useNavigate();
  const { currentBooking, placeOrder, addToast } = useApp();

  const movie = movies.find(m => m.id === currentBooking.movieId) || movies[0];
  const showtime = showtimes.find(s => s.id === currentBooking.showtimeId) || showtimes[0];

  const seatPrice = movie.price || 100000;
  const seatsTotal = (currentBooking.seats?.length || 1) * seatPrice;
  const snacksTotal = (currentBooking.snacks || []).reduce((sum, s) => sum + (s.price * s.qty), 0);
  const grandTotal = seatsTotal + snacksTotal;

  const [paymentMethod, setPaymentMethod] = useState('bank_qr');
  const [selectedBank, setSelectedBank] = useState(banks[0]);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const finalTotal = Math.max(0, grandTotal - discount);
  const orderRef = `CT${Math.floor(100000 + Math.random() * 900000)}`;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (voucherCode.toUpperCase() === 'VIP25' || voucherCode.toUpperCase() === 'CINETICKET') {
      const disc = Math.round(grandTotal * 0.2);
      setDiscount(disc);
      addToast(`Áp dụng mã giảm giá thành công! Giảm ${disc.toLocaleString()} đ`, 'success');
    } else {
      addToast('Mã voucher không hợp lệ hoặc đã hết hạn!', 'error');
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const methodName = paymentMethod === 'bank_qr'
        ? `Chuyển khoản QR ${selectedBank.code}`
        : paymentMethod === 'momo'
        ? 'Ví điện tử MoMo'
        : paymentMethod === 'vnpay'
        ? 'Cổng VNPAY'
        : 'Thẻ Quốc Tế Visa/Mastercard';

      const order = placeOrder({ methodName });
      setIsProcessing(false);
      navigate(`/order-success/${order.id}`);
    }, 1200);
  };

  return (
    <div className="payment-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="far fa-credit-card mr-2"></i> Cổng Thanh Toán An Toàn
          </p>
          <h1 className="catalog-title">XÁC NHẬN &amp; THANH TOÁN</h1>
        </div>
      </div>

      <div className="container mt-4 mb-5">
        {/* Booking Steps Bar */}
        <div className="seat-steps mb-5">
          <div className="seat-step">
            <div className="seat-step-icon"><i className="fas fa-th-large"></i></div>
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
            <div className="seat-step-text">4. Thông tin vé</div>
          </div>
        </div>

        <div className="row">
          {/* Payment Method Selector */}
          <div className="col-lg-7 mb-4">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>
                Chọn Phương Thức Thanh Toán
              </h3>

              {/* Methods List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
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
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px' }}>Hỗ trợ mọi app ngân hàng (MB, VCB, Techcombank, VPBank,...)</div>
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
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px' }}>Thanh toán tức thì qua ứng dụng MoMo</div>
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
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px' }}>Thẻ ATM 40+ ngân hàng trong nước</div>
                  </div>
                </label>
              </div>

              {/* QR Code Details view if bank_qr is chosen */}
              {paymentMethod === 'bank_qr' && (
                <div style={{
                  background: 'rgba(9, 10, 15, 0.7)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Chọn Ngân Hàng:</label>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {banks.map(b => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          style={{
                            background: selectedBank.code === b.code ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(255,255,255,0.08)',
                            color: selectedBank.code === b.code ? '#090a0f' : '#fff',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {b.code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR Box Visual */}
                  <div style={{
                    display: 'inline-block',
                    background: '#fff',
                    padding: '16px',
                    borderRadius: '16px',
                    margin: '12px auto',
                    boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)'
                  }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CINETICKET_${selectedBank.code}_${finalTotal}_${orderRef}`}
                      alt="VietQR Code"
                      style={{ width: '180px', height: '180px', display: 'block' }}
                    />
                    <div style={{ color: '#090a0f', fontWeight: 800, fontSize: '13px', marginTop: '8px' }}>
                      {selectedBank.name}
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', fontSize: '14px', textAlign: 'left', background: 'rgba(18, 20, 29, 0.9)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Số tài khoản:</span>
                      <strong style={{ color: '#f3cf7a' }}>{selectedBank.account}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Chủ tài khoản:</span>
                      <strong style={{ color: '#fff' }}>{selectedBank.holder}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Nội dung chuyển khoản:</span>
                      <strong style={{ color: '#f3cf7a' }}>{orderRef}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Panel & Voucher */}
          <div className="col-lg-5">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '20px',
              padding: '26px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '14px' }}>
                Hóa Đơn Đặt Vé VIP
              </h3>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{movie.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  {showtime.cinema_name} ({showtime.room}) - {showtime.show_time}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>
                <span>Ghế: {currentBooking.seats?.join(', ')} ({currentBooking.seats?.length} vé)</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{seatsTotal.toLocaleString()} đ</span>
              </div>

              {snacksTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>
                  <span>Combo bắp nước</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{snacksTotal.toLocaleString()} đ</span>
                </div>
              )}

              {/* Voucher Form */}
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
                  <span>Giảm giá voucher:</span>
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
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i> Đang Xử Lý Giao Dịch...</span>
                ) : (
                  <span><i className="fas fa-check-circle mr-2"></i> Xác Nhận Hoàn Tất Thanh Toán</span>
                )}
              </button>

              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '14px' }}>
                <i className="fas fa-shield-alt mr-1"></i> Giao dịch bảo mật chuẩn SSL 256-bit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
