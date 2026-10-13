import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { registerUser, addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Mật khẩu nhập lại không khớp!', 'error');
      return;
    }
    registerUser({
      username: username.trim(),
      fullname: username.trim(),
      email: email.trim(),
      password
    });
    navigate('/');
  };

  return (
    <div className="register-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-user-plus mr-2"></i> Gia Nhập Cộng Đồng
          </p>
          <h1 className="catalog-title">ĐĂNG KÝ THÀNH VIÊN VIP</h1>
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
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Họ và tên / Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control filter-input-vip"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    required
                    className="form-control filter-input-vip"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
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

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Xác nhận lại mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    className="form-control filter-input-vip"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu..."
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
                  Tạo Tài Khoản VIP
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: 'rgba(255,255,255,0.6)' }}>
                Đã có tài khoản?{' '}
                <Link to="/login" style={{ color: '#f3cf7a', fontWeight: 700, textDecoration: 'none' }}>
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
