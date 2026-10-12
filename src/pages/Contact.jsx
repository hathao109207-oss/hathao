import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { addToast } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    setName('');
    setEmail('');
    setMessage('');
    addToast('Cảm ơn bạn! Tin nhắn hỗ trợ đã được gửi tới CineTicket.', 'success');
  };

  return (
    <div className="contact-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Hỗ Trợ Khách Hàng VIP
          </p>
          <h1 className="catalog-title">LIÊN HỆ VỚI CHÚNG TÔI</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
              height: '100%'
            }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '26px', fontWeight: 800, marginBottom: '14px' }}>
                Trung Tâm CSKH CineTicket VIP
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14.5px', marginBottom: '24px' }}>
                Chúng tôi sẵn sàng giải đáp mọi thắc mắc về lịch chiếu, đặt vé đoàn, thanh toán và dịch vụ phòng VIP 24/7.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', color: 'rgba(255,255,255,0.85)', fontSize: '14.5px' }}>
                <li><i className="fas fa-phone-alt" style={{ color: '#d4af37', width: '24px' }}></i> <strong>Hotline VIP:</strong> 1900 8888</li>
                <li><i className="fas fa-envelope" style={{ color: '#d4af37', width: '24px' }}></i> <strong>Email:</strong> support@cineticket.vn</li>
                <li><i className="fas fa-map-marker-alt" style={{ color: '#d4af37', width: '24px' }}></i> <strong>Trụ sở:</strong> Tầng 5, Landmark 81, P. 22, Bình Thạnh, TP.HCM</li>
                <li><i className="fas fa-clock" style={{ color: '#d4af37', width: '24px' }}></i> <strong>Giờ mở cửa:</strong> 08:00 - 02:00 sáng hàng ngày</li>
              </ul>

              <div style={{ marginTop: '28px' }}>
                <h6 style={{ color: '#f3cf7a', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>Bản Đồ Chỉ Đường</h6>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <iframe
                    title="CineTicket Office Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.479220665372!2d106.70098137506127!3d10.774958259258225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f41000001%3A0x6b3afc5c1fa2b43b!2zMTIzIMSQxrDhu51uZyDEkcOtbiBBbmgsIFF14bqtbiAxLCBRdeG6rW4gMSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCA3MDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1737268800000"
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>
                Gửi Tin Nhắn Cho Chúng Tôi
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Họ và tên</label>
                  <input
                    type="text"
                    required
                    className="form-control filter-input-vip"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Email</label>
                  <input
                    type="email"
                    required
                    className="form-control filter-input-vip"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Nội dung hỗ trợ</label>
                  <textarea
                    rows="5"
                    required
                    className="form-control filter-input-vip"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ghi rõ nội dung bạn cần hỗ trợ..."
                    style={{ height: 'auto' }}
                  />
                </div>

                <button
                  type="submit"
                  className="boxed-btn"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 100%)',
                    color: '#090a0f',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Gửi Tin Nhắn Ngay
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
