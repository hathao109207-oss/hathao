import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ForgotPassword = () => {
  const { addToast, usersList, updateUserPassword } = useApp();
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP, 3: đặt lại mật khẩu, 4: thành công
  const [email, setEmail] = useState('hathao@cineticket.vn');
  const [otp, setOtp] = useState('');
  const [fakeOtp] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    const found = usersList.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (!found) {
      addToast('Email chưa đăng ký, nhưng hệ thống vẫn gửi OTP demo để bạn kiểm tra thử!', 'info');
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      addToast(`Mã OTP đã được gửi đến email ${email}!`, 'success');
    }, 1000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === fakeOtp || otp === '123456') {
      setStep(3);
      addToast('Xác thực OTP thành công! Vui lòng đặt mật khẩu mới.', 'success');
    } else {
      addToast(`Mã OTP không chính xác! (Mã thử nghiệm của bạn là: ${fakeOtp})`, 'error');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      updateUserPassword(email, newPassword);
      setLoading(false);
      setStep(4);
    }, 800);
  };

  const cardStyle = {
    background: 'rgba(18, 20, 32, 0.92)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    borderRadius: '24px',
    padding: '40px 36px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
    maxWidth: '460px',
    width: '100%',
  };

  const labelStyle = { color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' };
  const stepBadge = (n, label) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step === n ? 1 : 0.4 }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: step > n ? '#10b981' : step === n ? 'linear-gradient(135deg,#f43f5e,#fb923c)' : 'rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0
      }}>
        {step > n ? <i className="fas fa-check" /> : n}
      </div>
      <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600 }}>{label}</span>
    </div>
  );

  return (
    <div className="forgot-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-key mr-2" /> Bảo Mật Tài Khoản
          </p>
          <h1 className="catalog-title">QUÊN MẬT KHẨU</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={cardStyle}>
          {/* Step Indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', gap: '8px' }}>
            {stepBadge(1, 'Nhập Email')}
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)', alignSelf: 'center' }} />
            {stepBadge(2, 'Xác thực OTP')}
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)', alignSelf: 'center' }} />
            {stepBadge(3, 'Đặt lại mật khẩu')}
          </div>

          {/* STEP 1: Enter email */}
          {step === 1 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(251,146,60,0.2))', border: '2px solid rgba(244,63,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px', color: '#f43f5e' }}>
                  <i className="fas fa-envelope" />
                </div>
                <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: '0 0 6px' }}>Quên mật khẩu?</h3>
                <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: 0 }}>
                  Nhập email đăng ký để nhận mã OTP xác thực
                </p>
              </div>
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}><i className="fas fa-envelope mr-1" /> Địa chỉ Email</label>
                  <input
                    type="email"
                    required
                    className="form-control filter-input-vip"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '13px', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? <><i className="fas fa-spinner fa-spin mr-2" />Đang gửi...</> : <><i className="fas fa-paper-plane mr-2" />Gửi Mã OTP</>}
                </button>
              </form>
              {/* Demo hint */}
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(244,63,94,0.08)', borderRadius: '10px', border: '1px dashed rgba(244,63,94,0.3)' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                  <i className="fas fa-info-circle mr-1" style={{ color: '#f43f5e' }} />
                  <strong style={{ color: '#f3cf7a' }}>Demo:</strong> Thử email <code style={{ color: '#fb7185' }}>hathao@cineticket.vn</code> hoặc <code style={{ color: '#fb7185' }}>admin@cineticket.vn</code>
                </p>
              </div>
            </>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '2px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px', color: '#818cf8' }}>
                  <i className="fas fa-shield-alt" />
                </div>
                <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: '0 0 6px' }}>Xác thực OTP</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  Mã OTP đã gửi đến <strong style={{ color: '#f3cf7a' }}>{email}</strong>
                </p>
              </div>
              {/* Demo OTP display */}
              <div style={{ padding: '14px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', border: '1px dashed rgba(99,102,241,0.4)', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px' }}>Demo - Mã OTP của bạn:</p>
                <span style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 900, color: '#818cf8', letterSpacing: '6px' }}>{fakeOtp}</span>
              </div>
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}><i className="fas fa-lock mr-1" /> Nhập mã OTP (6 chữ số)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="form-control filter-input-vip"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="_ _ _ _ _ _"
                    style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '22px', fontWeight: 800 }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', padding: '13px', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '14px' }}
                >
                  <i className="fas fa-check-circle mr-2" />Xác Nhận OTP
                </button>
              </form>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ marginTop: '12px', width: '100%', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}
              >
                <i className="fas fa-arrow-left mr-2" />Quay lại
              </button>
            </>
          )}

          {/* STEP 3: New password */}
          {step === 3 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px', color: '#10b981' }}>
                  <i className="fas fa-key" />
                </div>
                <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: '0 0 6px' }}>Đặt lại mật khẩu</h3>
                <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: 0 }}>Nhập mật khẩu mới cho tài khoản của bạn</p>
              </div>
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}><i className="fas fa-lock mr-1" /> Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="form-control filter-input-vip"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự..."
                  />
                </div>
                <div style={{ marginBottom: '22px' }}>
                  <label style={labelStyle}><i className="fas fa-lock mr-1" /> Xác nhận mật khẩu</label>
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
                  disabled={loading}
                  style={{ width: '100%', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', padding: '13px', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? <><i className="fas fa-spinner fa-spin mr-2" />Đang xử lý...</> : <><i className="fas fa-check mr-2" />Đặt Lại Mật Khẩu</>}
                </button>
              </form>
            </>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px', color: '#fff', boxShadow: '0 8px 24px rgba(16,185,129,0.4)' }}>
                <i className="fas fa-check" />
              </div>
              <h3 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Thành Công!</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
                Mật khẩu đã được đặt lại. Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
              </p>
              <Link
                to="/login"
                style={{ display: 'inline-block', background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '13px 32px', borderRadius: '50px', fontWeight: 800, textDecoration: 'none', fontSize: '14px', boxShadow: '0 8px 24px rgba(244,63,94,0.35)' }}
              >
                <i className="fas fa-sign-in-alt mr-2" />Đăng Nhập Ngay
              </Link>
            </div>
          )}

          {/* Back to login link */}
          {step < 4 && (
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: '#64748b' }}>
              Nhớ mật khẩu?{' '}
              <Link to="/login" style={{ color: '#f43f5e', fontWeight: 700, textDecoration: 'none' }}>
                Đăng nhập ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
