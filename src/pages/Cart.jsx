import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Cart = () => {
  const { cart, updateCartQty, removeFromCart, clearCart, updateBooking } = useApp();
  const navigate = useNavigate();

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleProceedBooking = (item) => {
    updateBooking({ movieId: item.id });
    navigate(`/seat?movieId=${item.id}`);
  };

  return (
    <div className="cart-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-shopping-cart mr-2"></i> CineTicket VIP
          </p>
          <h1 className="catalog-title">GIỎ VÉ CỦA BẠN</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        {cart.length === 0 ? (
          <div className="cart-empty-wrap" style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'rgba(18, 20, 29, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '20px'
          }}>
            <i className="fas fa-shopping-basket" style={{ fontSize: '64px', color: 'rgba(212, 175, 55, 0.3)', marginBottom: '20px', display: 'block' }}></i>
            <h3 style={{ color: '#fff', marginBottom: '12px' }}>Giỏ vé của bạn đang trống!</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Hãy khám phá lịch chiếu phim hấp dẫn và chọn bộ phim yêu thích của bạn.</p>
            <Link to="/movies" className="boxed-btn" style={{
              background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 100%)',
              color: '#090a0f',
              padding: '12px 30px',
              borderRadius: '50px',
              fontWeight: 800,
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              Xem Phim Đang Chiếu
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8 mb-4">
              <div style={{
                background: 'rgba(18, 20, 29, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                borderRadius: '20px',
                padding: '26px',
                boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', textAlign: 'left' }}>
                        <th style={{ color: '#f3cf7a', padding: '12px', fontSize: '13px', textTransform: 'uppercase' }}>Phim</th>
                        <th style={{ color: '#f3cf7a', padding: '12px', fontSize: '13px', textTransform: 'uppercase' }}>Đơn Giá</th>
                        <th style={{ color: '#f3cf7a', padding: '12px', fontSize: '13px', textTransform: 'uppercase', textAlign: 'center' }}>Số Lượng</th>
                        <th style={{ color: '#f3cf7a', padding: '12px', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Thành Tiền</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <img
                                src={item.image}
                                alt={item.title}
                                style={{ width: '56px', height: '76px', objectFit: 'cover', borderRadius: '8px' }}
                                onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }}
                              />
                              <div>
                                <strong style={{ color: '#fff', fontSize: '15px' }}>{item.title}</strong>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{item.genre_name}</div>
                                <button
                                  type="button"
                                  onClick={() => handleProceedBooking(item)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#f3cf7a',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    marginTop: '4px',
                                    textDecoration: 'underline'
                                  }}
                                >
                                  Chọn ghế cho phim này →
                                </button>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: 'rgba(255,255,255,0.85)', padding: '16px 12px', fontSize: '14px' }}>
                            {item.price.toLocaleString('vi-VN')} đ
                          </td>
                          <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(9, 10, 15, 0.8)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px' }}>
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.id, item.qty - 1)}
                                style={{ background: 'none', border: 'none', color: '#f3cf7a', padding: '4px 10px', cursor: 'pointer', fontWeight: 800 }}
                              >
                                -
                              </button>
                              <span style={{ color: '#fff', padding: '0 8px', fontWeight: 700, fontSize: '14px' }}>{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.id, item.qty + 1)}
                                style={{ background: 'none', border: 'none', color: '#f3cf7a', padding: '4px 10px', cursor: 'pointer', fontWeight: 800 }}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td style={{ color: '#f3cf7a', padding: '16px 12px', textAlign: 'right', fontWeight: 800, fontSize: '15px' }}>
                            {(item.price * item.qty).toLocaleString('vi-VN')} đ
                          </td>
                          <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                              title="Xóa khỏi giỏ"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <Link to="/movies" className="bordered-btn" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', textDecoration: 'none' }}>
                    <i className="fas fa-arrow-left mr-2"></i> Tiếp tục chọn phim
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="bordered-btn"
                    style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444' }}
                  >
                    <i className="fas fa-trash mr-1"></i> Xóa toàn bộ giỏ
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="col-lg-4">
              <div style={{
                background: 'rgba(18, 20, 29, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '20px',
                padding: '26px',
                boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
              }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '14px' }}>
                  Tổng Giỏ Vé
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '12px' }}>
                  <span>Tạm tính ({cart.reduce((s, i) => s + i.qty, 0)} vé):</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{cartTotal.toLocaleString('vi-VN')} đ</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '12px' }}>
                  <span>Thuế VAT:</span>
                  <span style={{ color: '#fff' }}>Đã bao gồm</span>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                  paddingTop: '16px',
                  marginTop: '16px',
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>Tổng tiền:</span>
                  <span style={{ color: '#f3cf7a', fontSize: '24px', fontWeight: 900 }}>
                    {cartTotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (cart.length > 0) {
                      handleProceedBooking(cart[0]);
                    }
                  }}
                  className="boxed-btn"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 100%)',
                    color: '#090a0f',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Chọn Ghế &amp; Thanh Toán <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
