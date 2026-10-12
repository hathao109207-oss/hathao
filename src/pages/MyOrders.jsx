import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const MyOrders = () => {
  const { orders } = useApp();

  return (
    <div className="myorders-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-ticket-alt mr-2"></i> Lịch Sử Đặt Vé
          </p>
          <h1 className="catalog-title">VÉ ĐÃ ĐẶT CỦA TÔI</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        {orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: 'rgba(18, 20, 29, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '20px'
          }}>
            <i className="fas fa-ticket-alt" style={{ fontSize: '56px', color: 'rgba(212, 175, 55, 0.3)', marginBottom: '16px' }}></i>
            <h3 style={{ color: '#fff' }}>Bạn chưa có vé xem phim nào!</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>Hãy đặt ngay vé xem phim để trải nghiệm phòng chiếu VIP 5 sao tại CineTicket.</p>
            <Link to="/movies" className="boxed-btn" style={{
              background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
              color: '#090a0f',
              padding: '12px 28px',
              borderRadius: '50px',
              fontWeight: 800,
              textDecoration: 'none'
            }}>
              Đặt Vé Ngay
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  background: 'rgba(18, 20, 29, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '20px',
                  padding: '24px 30px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                      color: '#090a0f',
                      fontWeight: 800,
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      MÃ #{order.id}
                    </span>
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '13px' }}>
                      <i className="fas fa-check-circle mr-1"></i> {order.status}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 8px' }}>
                    {order.movie_title}
                  </h3>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span><i className="fas fa-map-marker-alt" style={{ color: '#d4af37', marginRight: '4px' }}></i> {order.cinema_name} ({order.room})</span>
                    <span><i className="far fa-clock" style={{ color: '#d4af37', marginRight: '4px' }}></i> {order.show_time} ({order.show_date})</span>
                    <span><i className="fas fa-couch" style={{ color: '#d4af37', marginRight: '4px' }}></i> Ghế: <strong>{order.seats?.join(', ')}</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '4px' }}>Tổng thanh toán:</div>
                  <div style={{ color: '#f3cf7a', fontSize: '22px', fontWeight: 900, marginBottom: '12px' }}>
                    {order.total.toLocaleString('vi-VN')} đ
                  </div>
                  <Link
                    to={`/order-success/${order.id}`}
                    className="bordered-btn"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fas fa-qrcode mr-1"></i> Xem Mã QR Check-in
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
