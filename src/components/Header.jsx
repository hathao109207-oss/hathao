import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { user, logoutUser, cart } = useApp();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser();
    setAccountMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="top-header-area" id="sticker" style={{ position: 'sticky', top: 0, zIndex: 999, backdropFilter: 'blur(20px)' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-sm-12 text-center">
            <div className="main-menu-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0' }}>
              <div className="site-logo" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                  <i className="fas fa-film" style={{ fontSize: '26px', color: '#f3cf7a', filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4))' }}></i>
                  <span className="site-logo-text">CINETICKET </span>
                </Link>
              </div>

              <nav className="main-menu" style={{ display: 'block' }}>
                <ul style={{ display: 'flex', alignItems: 'center', gap: '26px', margin: 0, padding: 0, listStyle: 'none' }}>
                  <li><NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#f3cf7a' : '#cbd5e1', fontWeight: 700 })}>Trang chủ</NavLink></li>
                  <li><NavLink to="/movies" style={({ isActive }) => ({ color: isActive ? '#f3cf7a' : '#cbd5e1', fontWeight: 700 })}>Lịch Phim</NavLink></li>
                  <li><NavLink to="/news" style={({ isActive }) => ({ color: isActive ? '#f3cf7a' : '#cbd5e1', fontWeight: 700 })}>Tin tức</NavLink></li>
                  <li><NavLink to="/contact" style={({ isActive }) => ({ color: isActive ? '#f3cf7a' : '#cbd5e1', fontWeight: 700 })}>Liên hệ</NavLink></li>
                  <li>
                    <div className="header-icons">
                      <Link className="shopping-cart" to="/cart" title="Giỏ vé của bạn" style={{ position: 'relative', fontSize: '19px', color: '#f3cf7a' }}>
                        <i className="fas fa-shopping-cart"></i>
                        {totalCartCount > 0 && (
                          <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-10px',
                            background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                            color: '#090a0f',
                            borderRadius: '50%',
                            fontSize: '11px',
                            fontWeight: 900,
                            padding: '2px 6px',
                            minWidth: '18px',
                            textAlign: 'center',
                            boxShadow: '0 2px 6px rgba(212, 175, 55, 0.4)'
                          }}>
                            {totalCartCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  </li>
                  {user ? (
                    <li className={`account-menu ${accountMenuOpen ? 'open' : ''}`} style={{ position: 'relative' }}>
                      <button
                        type="button"
                        className="account-toggle"
                        onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', fontWeight: 700 }}
                      >
                        <i className="fas fa-crown" style={{ color: user.role === 'admin' ? '#ef4444' : '#f59e0b' }}></i> {user.username}
                        {user.role === 'admin' && (
                          <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px', fontWeight: 900 }}>ADMIN</span>
                        )}
                        <i className="fas fa-chevron-down" style={{ fontSize: '11px', marginLeft: '4px' }}></i>
                      </button>
                      {accountMenuOpen && (
                        <ul className="account-dropdown" style={{ display: 'block' }}>
                          <li><Link to="/account" onClick={() => setAccountMenuOpen(false)}><i className="fas fa-user-cog" style={{ color: '#f43f5e' }}></i> Quản lý tài khoản</Link></li>
                          <li><Link to="/myorders" onClick={() => setAccountMenuOpen(false)}><i className="fas fa-ticket-alt" style={{ color: '#f43f5e' }}></i> Vé đã đặt của tôi</Link></li>
                          {user.role === 'admin' && (
                            <li><Link to="/admin" onClick={() => setAccountMenuOpen(false)} style={{ color: '#e11d48', fontWeight: 700 }}><i className="fas fa-user-shield" style={{ color: '#ef4444' }}></i> Trang Quản Trị Admin</Link></li>
                          )}
                          <li><a href="#logout" onClick={handleLogout}><i className="fas fa-sign-out-alt" style={{ color: '#64748b' }}></i> Đăng xuất</a></li>
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li>
                      <Link to="/login" className="bordered-btn" style={{ padding: '7px 20px', marginLeft: '10px', borderRadius: '50px' }}>
                        <i className="fas fa-user mr-1"></i> Đăng nhập
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
