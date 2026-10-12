import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Account = () => {
  const { user, setUser, addToast } = useApp();
  const [username, setUsername] = useState(user?.username || 'HaThao VIP');
  const [email, setEmail] = useState(user?.email || 'hathao@example.com');
  const [phone, setPhone] = useState('0909123456');

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, username, email });
    addToast('Cập nhật thông tin tài khoản thành công!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      addToast('Vui lòng nhập đầy đủ mật khẩu!', 'error');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    addToast('Đổi mật khẩu thành công!', 'success');
  };

  return (
    <div className="account-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-user-cog mr-2"></i> Hồ Sơ Thành Viên
          </p>
          <h1 className="catalog-title">QUẢN LÝ TÀI KHOẢN VIP</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row">
          {/* Member Card */}
          <div className="col-lg-4 mb-4">
            <div style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.25), transparent 70%), rgba(18, 20, 29, 0.95)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center',
              boxShadow: '0 20px 45px rgba(0,0,0,0.7)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                color: '#090a0f',
                fontSize: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 25px rgba(212, 175, 55, 0.6)'
              }}>
                <i className="fas fa-crown"></i>
              </div>

              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 4px' }}>
                {user?.username || 'Khách Hàng'}
              </h3>
              <div style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>
                HẠNG GOLD VIP
              </div>

              <div style={{ background: 'rgba(9, 10, 15, 0.6)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Điểm thưởng tích lũy (CinePoints):</div>
                <div style={{ color: '#f3cf7a', fontSize: '24px', fontWeight: 900 }}>1,250 PTS</div>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
                Bạn đang được giảm 10% cho mọi suất chiếu và miễn phí nâng cỡ bắp nước.
              </p>
            </div>
          </div>

          {/* Account Edit Form */}
          <div className="col-lg-8">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
              marginBottom: '30px'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
                Thông Tin Cá Nhân
              </h3>

              <form onSubmit={handleUpdateProfile}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tên người dùng</label>
                    <input
                      type="text"
                      className="form-control filter-input-vip"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Email</label>
                    <input
                      type="email"
                      className="form-control filter-input-vip"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control filter-input-vip"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="boxed-btn"
                  style={{
                    background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                    color: '#090a0f',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Lưu Thay Đổi
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
                Đổi Mật Khẩu
              </h3>

              <form onSubmit={handleChangePassword}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      className="form-control filter-input-vip"
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Mật khẩu mới</label>
                    <input
                      type="password"
                      className="form-control filter-input-vip"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bordered-btn"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Cập Nhật Mật Khẩu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
