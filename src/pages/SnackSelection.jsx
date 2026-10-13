import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { snacks } from '../data/mockData';
import { useApp } from '../context/AppContext';

const SnackSelection = () => {
  const navigate = useNavigate();
  const { currentBooking, updateBooking, movieList } = useApp();

  const movie = movieList.find(m => m.id === currentBooking.movieId) || movieList[0];
  const seatPrice = movie.price || 100000;
  const seatsTotal = (currentBooking.seats?.length || 1) * seatPrice;

  const [selectedSnacks, setSelectedSnacks] = useState(() => {
    return currentBooking.snacks && currentBooking.snacks.length > 0
      ? currentBooking.snacks
      : [];
  });

  const getQty = (snackId) => {
    const item = selectedSnacks.find(s => s.id === snackId);
    return item ? item.qty : 0;
  };

  const updateQty = (snack, delta) => {
    setSelectedSnacks(prev => {
      const existing = prev.find(s => s.id === snack.id);
      const currentQty = existing ? existing.qty : 0;
      const nextQty = Math.max(0, currentQty + delta);

      if (nextQty === 0) {
        return prev.filter(s => s.id !== snack.id);
      }
      if (existing) {
        return prev.map(s => s.id === snack.id ? { ...s, qty: nextQty } : s);
      }
      return [...prev, { id: snack.id, name: snack.name, price: snack.price, qty: nextQty }];
    });
  };

  const snacksTotal = selectedSnacks.reduce((sum, s) => sum + (s.price * s.qty), 0);
  const grandTotal = seatsTotal + snacksTotal;

  const handleProceedToPayment = () => {
    updateBooking({ snacks: selectedSnacks });
    navigate('/payment');
  };

  return (
    <div className="snack-selection-page">
      <div className="snack-hero text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-glass-cheers mr-2"></i> Phục Vụ Tại Rạp VIP
          </p>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '40px', fontWeight: 900, color: '#fff' }}>
            CHỌN COMBO BẮP NƯỚC
          </h1>
        </div>
      </div>

      <div className="container mt-4 mb-5">
        {/* Booking Steps Bar */}
        <div className="seat-steps mb-5">
          <div className="seat-step">
            <div className="seat-step-icon"><i className="fas fa-th-large"></i></div>
            <div className="seat-step-text">1. Chọn ghế</div>
          </div>
          <div className="seat-step active">
            <div className="seat-step-icon"><i className="fas fa-shopping-basket"></i></div>
            <div className="seat-step-text">2. Bắp nước</div>
          </div>
          <div className="seat-step">
            <div className="seat-step-icon"><i className="far fa-credit-card"></i></div>
            <div className="seat-step-text">3. Thanh toán</div>
          </div>
          <div className="seat-step">
            <div className="seat-step-icon"><i className="fas fa-ticket-alt"></i></div>
            <div className="seat-step-text">4. Thông tin vé</div>
          </div>
        </div>

        <div className="row">
          {/* Snacks Menu */}
          <div className="col-lg-8 mb-4">
            <div className="snack-container-glass">
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
                Thực Đơn Đồ Ăn &amp; Thức Uống Thượng Hạng
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {snacks.map(snack => {
                  const qty = getQty(snack.id);
                  return (
                    <div
                      key={snack.id}
                      style={{
                        background: 'rgba(9, 10, 15, 0.6)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
                        <img
                          src={snack.image}
                          alt={snack.name}
                          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                          onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }}
                        />
                        <div>
                          <h4 className="snack-title">{snack.name}</h4>
                          <p className="snack-desc">{snack.desc}</p>
                          <div className="snack-price">{snack.price.toLocaleString('vi-VN')} đ</div>
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="quantity-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQty(snack, -1)}
                          disabled={qty === 0}
                          style={{ opacity: qty === 0 ? 0.4 : 1 }}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          readOnly
                          className="qty-input"
                          value={qty}
                        />
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQty(snack, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="col-lg-4">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '20px',
              padding: '26px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '14px' }}>
                Tổng Chi Phí Đặt Vé
              </h3>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '14px', marginBottom: '4px' }}>
                  <span>{movie.title}</span>
                  <span style={{ color: '#f3cf7a', fontWeight: 700 }}>{seatsTotal.toLocaleString()} đ</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  Ghế: {currentBooking.seats?.join(', ') || 'Chưa chọn'} ({currentBooking.seats?.length || 0} vé)
                </div>
              </div>

              {selectedSnacks.length > 0 && (
                <div style={{ borderTop: '1px dashed rgba(212, 175, 55, 0.2)', paddingTop: '12px', marginBottom: '16px' }}>
                  <div style={{ color: '#f3cf7a', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>Combo &amp; Bắp Nước:</div>
                  {selectedSnacks.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '4px' }}>
                      <span>{s.name} x{s.qty}</span>
                      <span>{(s.price * s.qty).toLocaleString()} đ</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{
                borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                paddingTop: '16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>Tổng thanh toán:</span>
                <span style={{ color: '#f3cf7a', fontSize: '24px', fontWeight: 900 }}>
                  {grandTotal.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="boxed-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)',
                  color: '#090a0f',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                Tiếp Tục Thanh Toán <i className="fas fa-arrow-right ml-2"></i>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSnacks([]);
                  updateBooking({ snacks: [] });
                  navigate('/payment');
                }}
                className="bordered-btn"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', textAlign: 'center' }}
              >
                Bỏ qua bắp nước, đi tới thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnackSelection;
