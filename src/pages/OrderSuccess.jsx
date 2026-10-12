import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const OrderSuccess = () => {
  const { id } = useParams();
  const { orders } = useApp();

  const order = orders.find(o => o.id === Number(id)) || orders[0];

  return (
    <div className="order-success-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-check-circle mr-2"></i> Đặt Vé Thành Công
          </p>
          <h1 className="catalog-title">VÉ ĐIỆN TỬ CINETICKET VIP</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.2), transparent 70%), rgba(18, 20, 29, 0.95)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '24px',
              padding: '40px 30px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(212, 175, 55, 0.25)',
              position: 'relative'
            }}>
              {/* Gold Ribbon Badge */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 100%)',
                  color: '#090a0f',
                  fontWeight: 900,
                  fontSize: '13px',
                  padding: '6px 20px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  <i className="fas fa-crown mr-1"></i> VIP PASS - ĐÃ XÁC NHẬN
                </span>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '32px', fontWeight: 900, marginTop: '16px' }}>
                  {order.movie_title}
                </h2>
                <div style={{ color: '#f3cf7a', fontWeight: 800, fontSize: '18px', letterSpacing: '2px' }}>
                  MÃ VÉ: #{order.id}
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div style={{
                background: 'rgba(9, 10, 15, 0.7)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Cụm Rạp:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{order.cinema_name}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Phòng Chiếu:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{order.room}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Ngày Chiếu:</span>
                  <strong style={{ color: '#f3cf7a', fontSize: '15px' }}>{order.show_date}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Giờ Chiếu:</span>
                  <strong style={{ color: '#f3cf7a', fontSize: '15px' }}>{order.show_time}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Ghế Ngồi:</span>
                  <strong style={{ color: '#f3cf7a', fontSize: '18px' }}>{order.seats?.join(', ')}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Phương Thức:</span>
                  <strong style={{ color: '#fff', fontSize: '14px' }}>{order.payment_method}</strong>
                </div>
              </div>

              {/* Snacks if any */}
              {order.snacks && order.snacks.length > 0 && (
                <div style={{
                  background: 'rgba(9, 10, 15, 0.5)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  marginBottom: '30px'
                }}>
                  <div style={{ color: '#f3cf7a', fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>
                    <i className="fas fa-utensils mr-2"></i> Combo Bắp Nước Kèm Theo:
                  </div>
                  {order.snacks.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.85)', fontSize: '13.5px' }}>
                      <span>{s.name} x{s.qty}</span>
                      <span>{(s.price * s.qty).toLocaleString()} đ</span>
                    </div>
                  ))}
                </div>
              )}

              {/* QR Code Check-in */}
              <div style={{ textAlign: 'center', margin: '30px 0', borderTop: '1px dashed rgba(212, 175, 55, 0.3)', paddingTop: '30px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '14px' }}>
                  Xuất trình mã QR này tại quầy vé hoặc lối vào phòng chiếu VIP:
                </p>
                <div style={{
                  display: 'inline-block',
                  background: '#fff',
                  padding: '16px',
                  borderRadius: '16px',
                  boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)'
                }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=CINETICKET_TICKET_${order.id}`}
                    alt="Ticket QR"
                    style={{ width: '160px', height: '160px', display: 'block' }}
                  />
                </div>
                <div style={{ color: '#f3cf7a', fontSize: '14px', fontWeight: 800, marginTop: '10px' }}>
                  Tổng Tiền: {order.total.toLocaleString('vi-VN')} đ (Đã thanh toán)
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/myorders" className="boxed-btn" style={{
                  background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 100%)',
                  color: '#090a0f',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  textDecoration: 'none'
                }}>
                  <i className="fas fa-ticket-alt mr-2"></i> Xem Vé Trong Danh Sách
                </Link>
                <Link to="/" className="bordered-btn" style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  textDecoration: 'none'
                }}>
                  <i className="fas fa-home mr-2"></i> Trở Về Trang Chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
