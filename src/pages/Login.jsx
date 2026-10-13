import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    loginUser(username.trim(), password);
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-crown mr-2"></i> Thành Viên VIP
          </p>
          <h1 className="catalog-title">ĐĂNG NHẬP TÀI KHOẢN</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '20px',
              padding: '36px 30px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span className="site-logo-text" style={{ fontSize: '24px' }}>CINETICKET <span className="vip-tag-nav">VIP</span></span>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13.5px', marginTop: '6px' }}>
                  Đăng nhập để nhận ngay các ưu đãi đặc quyền VIP
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Tên đăng nhập hoặc Email
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control filter-input-vip"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập..."
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    className="form-control filter-input-vip"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
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
                  Đăng Nhập Ngay
                </button>
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <Link to="/forgot-password" style={{ color: '#94a3b8', fontSize: '12.5px', textDecoration: 'none' }}>
                    <i className="fas fa-key mr-1" />Quên mật khẩu?
                  </Link>
                </div>
              </form>

              {/* Quick Login Presets */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed rgba(212, 175, 55, 0.25)' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block', marginBottom: '10px', textAlign: 'center' }}>
                  Tài khoản có sẵn để test:
                </span>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('admin');
                      setPassword('admin123');
                      loginUser('admin', 'admin123');
                      navigate('/admin');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.1))',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      color: '#fca5a5',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span><i className="fas fa-user-shield mr-2"></i> Đăng nhập Admin (admin / admin123)</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUsername('hathao');
                      setPassword('123456');
                      loginUser('hathao', '123456');
                      navigate('/');
                    }}
                    style={{
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#f3cf7a',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span><i className="fas fa-crown mr-2"></i> Đăng nhập Member VIP (hathao / 123456)</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: 'rgba(255,255,255,0.6)' }}>
                Chưa có tài khoản?{' '}
                <Link to="/register" style={{ color: '#f3cf7a', fontWeight: 700, textDecoration: 'none' }}>
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
