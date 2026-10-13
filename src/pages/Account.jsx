import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Account = () => {
  const { user, updateUserProfile, updateUserPassword, addToast } = useApp();

  const [fullname, setFullname] = useState(user?.fullname || user?.username || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  React.useEffect(() => {
    if (user) {
      setFullname(user.fullname || user.username || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  if (!user) {
    return (
      <div className="container mt-5 mb-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(18, 20, 32, 0.92)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '20px', padding: '40px', maxWidth: '480px' }}>
          <i className="fas fa-user-lock" style={{ fontSize: '48px', color: '#f3cf7a', marginBottom: '16px' }}></i>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800 }}>Vui Lòng Đăng Nhập</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px' }}>
            Bạn cần đăng nhập tài khoản để quản lý thông tin thành viên và đổi mật khẩu.
          </p>
          <Link to="/login" className="boxed-btn" style={{ background: 'linear-gradient(135deg, #f3cf7a, #d4af37)', color: '#090a0f', padding: '12px 30px', borderRadius: '50px', fontWeight: 800, textDecoration: 'none' }}>
            Đăng Nhập Ngay
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!fullname.trim() || !email.trim()) {
      addToast('Vui lòng điền đầy đủ họ tên và email!', 'error');
      return;
    }
    updateUserProfile(user.id, {
      fullname: fullname.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim()
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) {
      addToast('Vui lòng điền đầy đủ các trường mật khẩu!', 'error');
      return;
    }
    if (user.password && currentPw !== user.password) {
      addToast('Mật khẩu hiện tại không chính xác!', 'error');
      return;
    }
    if (newPw.length < 6) {
      addToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      addToast('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
      return;
    }

    updateUserPassword(user.email, newPw);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div className="account-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-user-cog mr-2"></i> Hồ Sơ Thành Viên
          </p>
          <h1 className="catalog-title">QUẢN LÝ TÀI KHOẢN &amp; MẬT KHẨU</h1>
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
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                color: '#090a0f',
                fontSize: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 25px rgba(212, 175, 55, 0.6)'
              }}>
                <i className="fas fa-crown"></i>
              </div>

              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 4px' }}>
                {fullname}
              </h3>
              <div style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>
                {user.role === 'admin' ? '⚡ QUẢN TRỊ VIÊN HỆ THỐNG' : '★ THÀNH VIÊN GOLD VIP'}
              </div>

              <div style={{ background: 'rgba(9, 10, 15, 0.6)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px', padding: '14px', marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Tên đăng nhập:</span>
                  <strong style={{ color: '#fff', fontSize: '13px' }}>{user.username}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>CinePoints:</span>
                  <strong style={{ color: '#f3cf7a', fontSize: '15px' }}>1,850 PTS</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Đặc quyền:</span>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '12px' }}>Giảm 10% vé + Free Bắp</span>
                </div>
              </div>

              <Link to="/myorders" className="bordered-btn" style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', display: 'block', textDecoration: 'none' }}>
                <i className="fas fa-ticket-alt mr-2"></i> Xem Vé Đã Đặt Của Tôi
              </Link>
            </div>
          </div>

          {/* Account Edit & Password Forms */}
          <div className="col-lg-8">
            {/* Form 1: Profile update */}
            <div style={{
              background: 'rgba(18, 20, 29, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
              marginBottom: '30px'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-id-card" style={{ color: '#f3cf7a' }}></i> Cập Nhật Thông Tin Cá Nhân
              </h3>

              <form onSubmit={handleUpdateProfile}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Họ và tên</label>
                    <input
                      type="text"
                      className="form-control filter-input-vip"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tên người dùng (Username)</label>
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
                    padding: '12px 28px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  <i className="fas fa-save mr-2"></i> Lưu Thay Đổi Thông Tin
                </button>
              </form>
            </div>

            {/* Form 2: Change Password */}
            <div style={{
              background: 'rgba(18, 20, 29, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-key" style={{ color: '#f3cf7a' }}></i> Đổi Mật Khẩu Đăng Nhập
              </h3>

              <form onSubmit={handleChangePassword}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      className="form-control filter-input-vip"
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="Nhập mật khẩu cũ..."
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Mật khẩu mới</label>
                    <input
                      type="password"
                      className="form-control filter-input-vip"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự..."
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label style={{ color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      className="form-control filter-input-vip"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bordered-btn"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  <i className="fas fa-shield-alt mr-2"></i> Xác Nhận Đổi Mật Khẩu
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
