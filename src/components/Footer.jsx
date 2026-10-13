import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-inner">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="footer-brand">
                <div className="footer-logo mb-3">
                  <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <i className="fas fa-film" style={{ fontSize: '26px', color: '#f3cf7a', filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4))' }}></i>
                    <span className="site-logo-text" style={{ fontSize: '22px' }}>CINETICKET <span className="vip-tag-nav">VIP</span></span>
                  </Link>
                </div>
                <div className="footer-kicker">Hệ Thống Rạp Chiếu Phim Thế Hệ Mới</div>
                <p className="footer-summary">
                  CineTicket mang đến cho quý khách trải nghiệm điện ảnh thượng lưu với âm thanh Dolby Atmos đa chiều, màn hình 4K Laser cực đại.
                </p>
                <div className="footer-cta-group">
                  <Link to="/movies" className="footer-cta-primary">
                    <i className="fas fa-film mr-2"></i> Đặt Vé Ngay
                  </Link>
                  <Link to="/contact" className="footer-cta-secondary">
                    <i className="fas fa-headset mr-2"></i> Trợ Giúp
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
              <h4 style={{ color: '#f3cf7a', fontSize: '16px', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Khám Phá</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Trang chủ</Link></li>
                <li><Link to="/movies" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Lịch chiếu phim</Link></li>
                <li><Link to="/news" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Tin tức &amp; Sự kiện</Link></li>
                <li><Link to="/cart" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Giỏ vé</Link></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
              <h4 style={{ color: '#f3cf7a', fontSize: '16px', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Hỗ Trợ &amp; Dịch Vụ</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                <li><i className="fas fa-map-marker-alt" style={{ color: '#d4af37', width: '20px' }}></i> 12 Trịnh Đình Thảo, Tân Phú, TP.HCM</li>
                <li><i className="fas fa-phone-alt" style={{ color: '#d4af37', width: '20px' }}></i> Hotline: <a href="tel:0337191740" style={{ color: 'inherit', textDecoration: 'none' }}>0337191740 (24/7)</a></li>
                <li><i className="fas fa-envelope" style={{ color: '#d4af37', width: '20px' }}></i> <a href="mailto:hthaongn@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>hthaongn@gmail.com</a></li>
                <li><i className="fas fa-clock" style={{ color: '#d4af37', width: '20px' }}></i> Giờ mở cửa: 08:00 - 02:00 sáng</li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6">
              <h4 style={{ color: '#f3cf7a', fontSize: '16px', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Đăng Ký Bản Tin</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px' }}>Nhận ưu đãi vé 0 đồng và quà tặng độc quyền mỗi tuần.</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    background: 'rgba(18, 20, 29, 0.8)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
                <button
                  type="button"
                  style={{
                    background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                    border: 'none',
                    padding: '0 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    color: '#090a0f',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.15)', marginTop: '40px', paddingTop: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            © 2026 CineTicket Cinema. All rights reserved. Hệ Thống Rạp Chiếu Phim Thế Hệ Mới.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
