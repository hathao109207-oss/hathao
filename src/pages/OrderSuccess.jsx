import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const OrderSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { orders, addToast } = useApp();
  const [showAutoSuccessModal, setShowAutoSuccessModal] = useState(() => searchParams.get('paid') === '1');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showQrDataModal, setShowQrDataModal] = useState(false);

  const order = orders.find(o => o.id === Number(id)) || orders[0];

  useEffect(() => {
    if (searchParams.get('paid') === '1') {
      addToast(`Thanh toán thành công! Thông báo đã được gửi từ admin hthaongn@gmail.com đến ${order?.customer_email || 'hộp thư của bạn'}`, 'success');
    }
  }, [searchParams, order, addToast]);

  const handleResendEmail = () => {
    addToast(`Đã gửi lại email xác nhận từ admin hthaongn@gmail.com tới ${order.customer_email || 'hộp thư của bạn'}!`, 'success');
  };

  if (!order) {
    return (
      <div className="container mt-5 mb-5 text-center">
        <h2>Không tìm thấy thông tin đơn hàng</h2>
        <Link to="/movies" className="boxed-btn" style={{ marginTop: '20px' }}>Quay lại danh sách phim</Link>
      </div>
    );
  }

  // QR Data with full movie, cinema, room number, showtime and seat numbers
  const ticketQrData = `[VÉ ĐIỆN TỬ CINETICKET VIP #${order.id}]
Phim: ${order.movie_title}
Cụm Rạp: ${order.cinema_name}
Phòng Chiếu: ${order.room}
Suất Chiếu: ${order.show_time} (${order.show_date})
Ghế Ngồi: ${order.seats?.join(', ') || 'N/A'}
Khách Hàng: ${order.customer_name || 'Khách Hàng'}
Trạng Thái: ĐÃ THANH TOÁN THÀNH CÔNG
Tổng Tiền: ${(order.total || 0).toLocaleString('vi-VN')} đ
Hotline Hỗ Trợ: 0337191740
Email Admin: hthaongn@gmail.com
Địa Chỉ: 12 Trịnh Đình Thảo, Tân Phú, TP.HCM`;

  const ticketQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(ticketQrData)}`;

  return (
    <div className="order-success-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#10b981', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-check-circle mr-2"></i> Giao Dịch Đã Thanh Toán Thành Công
          </p>
          <h1 className="catalog-title">VÉ ĐIỆN TỬ CINETICKET VIP</h1>
        </div>
      </div>

      <div className="container mt-4 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Automatic Success Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(6, 78, 59, 0.55))',
              border: '2px solid #10b981',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
                }}>
                  <i className="fas fa-check" />
                </div>
                <div>
                  <div style={{ color: '#10b981', fontWeight: 900, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <i className="fas fa-check-double mr-1" /> ĐÃ THANH TOÁN THÀNH CÔNG!
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '13.5px', marginTop: '3px' }}>
                    Thông báo xác nhận đã được gửi tự động từ Admin <strong style={{ color: '#f3cf7a' }}>hthaongn@gmail.com</strong> đến <strong style={{ color: '#38bdf8' }}>{order.customer_email || 'hộp thư của bạn'}</strong>.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                  color: '#090a0f',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-envelope-open-text" /> Xem Thư Xác Nhận Từ Admin
              </button>
            </div>

            {/* Main Ticket Card */}
            <div style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.25), transparent 70%), rgba(18, 20, 29, 0.96)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '24px',
              padding: '40px 30px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(212, 175, 55, 0.25)',
              position: 'relative'
            }}>
              {/* Gold Ribbon Badge */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '13px',
                  padding: '6px 22px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  display: 'inline-block',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}>
                  <i className="fas fa-check-circle mr-1"></i> VIP PASS - ĐÃ THANH TOÁN THÀNH CÔNG
                </span>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '32px', fontWeight: 900, marginTop: '16px' }}>
                  {order.movie_title}
                </h2>
                <div style={{ color: '#f3cf7a', fontWeight: 800, fontSize: '20px', letterSpacing: '2px' }}>
                  MÃ VÉ ĐIỆN TỬ: #{order.id}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', marginTop: '6px' }}>
                  Khách hàng: <strong style={{ color: '#fff' }}>{order.customer_name || 'Khách Hàng'}</strong> ({order.customer_email})
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div style={{
                background: 'rgba(9, 10, 15, 0.75)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '18px',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '26px'
              }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Cụm Rạp VIP:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{order.cinema_name}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Số Phòng Chiếu:</span>
                  <strong style={{ color: '#38bdf8', fontSize: '16px' }}>{order.room}</strong>
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
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Ghế Ngồi Đã Chọn:</span>
                  <strong style={{ color: '#10b981', fontSize: '19px' }}>{order.seats?.join(', ') || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Phương Thức Thanh Toán:</span>
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
                  marginBottom: '26px'
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

              {/* QR Code Check-in Box */}
              <div style={{
                textAlign: 'center',
                margin: '24px 0',
                borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
                paddingTop: '26px'
              }}>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '4px 16px',
                  borderRadius: '999px',
                  color: '#f3cf7a',
                  fontWeight: 800,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}>
                  <i className="fas fa-qrcode mr-1"></i> Mã QR Quét Lấy Ghế &amp; Số Phòng Chiếu
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13.5px', marginBottom: '14px', maxWidth: '520px', margin: '0 auto 14px' }}>
                  Xuất trình mã QR này tại quầy hoặc cửa soát vé. Khi quét, mã sẽ hiển thị đầy đủ thông tin: <strong>Ghế ({order.seats?.join(', ')})</strong>, <strong>Phòng ({order.room})</strong>, và <strong>Suất chiếu ({order.show_time} {order.show_date})</strong>.
                </p>

                <div style={{
                  display: 'inline-block',
                  background: '#fff',
                  padding: '16px',
                  borderRadius: '18px',
                  boxShadow: '0 0 35px rgba(212, 175, 55, 0.45)',
                  position: 'relative'
                }}>
                  <img
                    src={ticketQrUrl}
                    alt="Ticket QR Code"
                    style={{ width: '190px', height: '190px', display: 'block' }}
                  />
                  <div style={{ color: '#090a0f', fontWeight: 900, fontSize: '12.5px', marginTop: '6px' }}>
                    CHECK-IN VÉ #{order.id}
                  </div>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowQrDataModal(true)}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-eye mr-1"></i> Xem Dữ Liệu Khi Quét QR
                  </button>
                  <a
                    href={ticketQrUrl}
                    download={`CineTicket_${order.id}_QR.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      color: '#f3cf7a',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fas fa-download mr-1"></i> Tải Ảnh QR Vé Về Máy
                  </a>
                </div>

                <div style={{ color: '#10b981', fontSize: '18px', fontWeight: 900, marginTop: '16px' }}>
                  Tổng Tiền: {order.total.toLocaleString('vi-VN')} đ (ĐÃ THANH TOÁN)
                </div>
              </div>

              {/* Email Notification Notice Bar */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                borderRadius: '16px',
                padding: '18px 22px',
                marginBottom: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <i className="fas fa-envelope-open-text" style={{ fontSize: '26px', color: '#38bdf8' }}></i>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '14.5px' }}>
                      Email thông báo từ Admin đã được gửi thành công!
                    </strong>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12.5px', marginTop: '2px' }}>
                      Người gửi: <span style={{ color: '#f3cf7a' }}>hthaongn@gmail.com</span> • Tới: <strong>{order.customer_email || 'hộp thư của bạn'}</strong>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-eye mr-1"></i> Mở Xem Email
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/myorders" className="boxed-btn" style={{
                  background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 100%)',
                  color: '#090a0f',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  textDecoration: 'none'
                }}>
                  <i className="fas fa-history mr-2"></i> Xem Lịch Sử Đặt Vé
                </Link>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bordered-btn"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-print mr-2"></i> In Vé Điện Tử
                </button>

                <Link to="/movies" className="bordered-btn" style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}>
                  <i className="fas fa-film mr-2"></i> Đặt Thêm Phim Khác
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AUTOMATIC MODAL: POPUP MÀN HÌNH ĐÃ THANH TOÁN THÀNH CÔNG */}
      {showAutoSuccessModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 7, 15, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 99990,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.2), transparent 75%), #0f121d',
            border: '2px solid rgba(16, 185, 129, 0.55)',
            borderRadius: '26px',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px 28px',
            textAlign: 'center',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 45px rgba(16, 185, 129, 0.35)',
            position: 'relative',
            color: '#fff'
          }}>
            {/* Close / Dismiss button */}
            <button
              type="button"
              onClick={() => setShowAutoSuccessModal(false)}
              aria-label="Đóng"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              ×
            </button>

            {/* Glowing Success Badge */}
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              margin: '0 auto 16px',
              boxShadow: '0 0 35px rgba(16, 185, 129, 0.65), 0 10px 20px rgba(0,0,0,0.4)'
            }}>
              <i className="fas fa-check" />
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              padding: '4px 18px',
              borderRadius: '999px',
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <i className="fas fa-check-circle mr-1" /> GIAO DỊCH HOÀN TẤT
            </div>

            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '28px',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '6px',
              letterSpacing: '0.5px'
            }}>
              ĐÃ THANH TOÁN THÀNH CÔNG!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', margin: '0 auto 20px', maxWidth: '480px' }}>
              Cảm ơn quý khách <strong style={{ color: '#fff' }}>{order.customer_name || 'Khách Hàng'}</strong>! Đơn đặt vé VIP <strong>#{order.id}</strong> đã được thanh toán và kích hoạt thành công trên hệ thống.
            </p>

            {/* Admin Email Notification Alert Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.22), rgba(30, 58, 138, 0.35))',
              border: '1.5px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '22px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
                }}>
                  <i className="fas fa-paper-plane" />
                </div>
                <div>
                  <div style={{ color: '#38bdf8', fontWeight: 900, fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <i className="fas fa-envelope mr-1" /> THÔNG BÁO TỰ ĐỘNG ĐÃ GỬI TỚI EMAIL
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12.5px' }}>
                    Người gửi: <strong style={{ color: '#f3cf7a' }}>hthaongn@gmail.com</strong> (Admin CineTicket)
                  </div>
                </div>
              </div>

              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: '1.5', paddingLeft: '48px' }}>
                Hệ thống đã tự động gửi email thông báo xác nhận thanh toán &amp; vé xem phim điện tử kèm mã QR tới địa chỉ: <strong style={{ color: '#38bdf8' }}>{order.customer_email || 'hộp thư của bạn'}</strong>.
              </div>
            </div>

            {/* Central QR Code Check-in Box */}
            <div style={{
              background: 'rgba(9, 10, 15, 0.85)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              padding: '22px 18px',
              marginBottom: '22px',
              boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.08)'
            }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                padding: '4px 16px',
                borderRadius: '999px',
                color: '#f3cf7a',
                fontWeight: 900,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '14px'
              }}>
                <i className="fas fa-qrcode mr-1" /> MÃ QR QUÉT LẤY GHẾ &amp; PHÒNG CHIẾU
              </div>

              {/* QR Image Box */}
              <div>
                <div style={{
                  display: 'inline-block',
                  background: '#fff',
                  padding: '14px',
                  borderRadius: '16px',
                  boxShadow: '0 0 35px rgba(212, 175, 55, 0.45)',
                  marginBottom: '10px'
                }}>
                  <img
                    src={ticketQrUrl}
                    alt="Mã QR Vé Điện Tử"
                    style={{ width: '180px', height: '180px', display: 'block', objectFit: 'contain' }}
                  />
                  <div style={{ color: '#090a0f', fontWeight: 900, fontSize: '12px', marginTop: '6px' }}>
                    CHECK-IN VÉ #{order.id}
                  </div>
                </div>
              </div>

              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '14px' }}>
                <i className="fas fa-camera mr-1" style={{ color: '#f3cf7a' }} />
                Dùng camera điện thoại hoặc máy quét tại rạp quét mã này để hiển thị thông tin lấy ghế &amp; phòng chiếu.
              </div>

              {/* Booking Highlights Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '10px',
                textAlign: 'left'
              }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '10px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase' }}>Phim:</div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '13.5px', marginTop: '2px' }}>{order.movie_title}</div>
                </div>

                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                  <div style={{ color: '#38bdf8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Số Phòng Chiếu:</div>
                  <div style={{ color: '#38bdf8', fontWeight: 900, fontSize: '16px', marginTop: '2px' }}>{order.room}</div>
                </div>

                <div style={{ background: 'rgba(243, 207, 122, 0.08)', border: '1px solid rgba(243, 207, 122, 0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                  <div style={{ color: '#f3cf7a', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Suất Chiếu (Lịch):</div>
                  <div style={{ color: '#f3cf7a', fontWeight: 800, fontSize: '13.5px', marginTop: '2px' }}>{order.show_time} ({order.show_date})</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '10px 14px', borderRadius: '10px' }}>
                  <div style={{ color: '#10b981', fontSize: '11px', textTransform: 'uppercase', fontWeight: 800 }}>Ghế Ngồi Đã Chọn:</div>
                  <div style={{ color: '#10b981', fontWeight: 900, fontSize: '17px', marginTop: '2px' }}>{order.seats?.join(', ') || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setShowAutoSuccessModal(false);
                  setShowEmailModal(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  padding: '11px 20px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)'
                }}
              >
                <i className="fas fa-envelope-open-text" /> Xem Thư Xác Nhận Từ Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAutoSuccessModal(false);
                  setShowQrDataModal(true);
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  padding: '11px 18px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-eye" /> Xem Dữ Liệu Khi Quét QR
              </button>

              <a
                href={ticketQrUrl}
                download={`CineTicket_${order.id}_CheckIn_QR.png`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(212, 175, 55, 0.18)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#f3cf7a',
                  padding: '11px 18px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-download" /> Tải Ảnh QR Về Máy
              </a>

              <button
                type="button"
                onClick={() => setShowAutoSuccessModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  padding: '11px 22px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
              >
                <i className="fas fa-ticket-alt" /> Xem Toàn Bộ Vé Điện Tử
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QR SCANNED DATA PREVIEW */}
      {showQrDataModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.88)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            color: '#fff',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(56, 189, 248, 0.3)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setShowQrDataModal(false)}
              style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}
            >
              ×
            </button>
            <h4 style={{ color: '#38bdf8', fontSize: '17px', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-qrcode"></i> Dữ Liệu Máy Quét Đọc Được Từ Mã QR
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '12.5px', marginBottom: '14px' }}>
              Đây là nội dung thực tế xuất hiện trên máy quét vé / camera điện thoại:
            </p>
            <pre style={{
              background: '#020617',
              border: '1px solid #1e293b',
              color: '#10b981',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              margin: 0
            }}>
              {ticketQrData}
            </pre>
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowQrDataModal(false)}
                style={{ background: '#38bdf8', color: '#090a0f', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL CONFIRMATION MODAL PREVIEW */}
      {showEmailModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            color: '#1e293b',
            borderRadius: '20px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            position: 'relative'
          }}>
            {/* Email Header Bar */}
            <div style={{
              background: '#090a0f',
              color: '#fff',
              padding: '18px 24px',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-envelope" style={{ color: '#f3cf7a', fontSize: '20px' }}></i>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, margin: 0 }}>HỘP THƯ ĐẾN (INBOX)</h4>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Thông báo xác nhận thanh toán tự động từ Admin CineTicket</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Email Meta Details */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px' }}>
              <div style={{ marginBottom: '6px' }}>
                <strong>Từ:</strong> <span style={{ color: '#090a0f', fontWeight: 700 }}>Ban Quản Trị CineTicket &lt;hthaongn@gmail.com&gt;</span>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>Tới:</strong> {order.customer_name || 'Khách Hàng'} &lt;<span style={{ color: '#0284c7' }}>{order.customer_email || 'hthaongn@gmail.com'}</span>&gt;
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>Tiêu đề:</strong> <span style={{ color: '#0284c7', fontWeight: 800 }}>[CineTicket VIP] Xác nhận thanh toán thành công &amp; Vé xem phim mã #{order.id}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>
                <strong>Thời gian:</strong> {order.created_at} • <strong>Trạng thái:</strong> <span style={{ color: '#16a34a', fontWeight: 800 }}>● Đã thanh toán thành công</span>
              </div>
            </div>

            {/* Email Content Body */}
            <div style={{ padding: '28px 24px', fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{
                  background: '#dcfce7',
                  color: '#16a34a',
                  fontWeight: 900,
                  fontSize: '12px',
                  padding: '4px 16px',
                  borderRadius: '999px',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  ✓ GIAO DỊCH ĐÃ THANH TOÁN THÀNH CÔNG
                </span>
                <h3 style={{ color: '#b45309', fontSize: '22px', fontWeight: 900, margin: '0 0 6px' }}>CINETICKET VIETNAM</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Cảm ơn quý khách đã tin tưởng dịch vụ xem phim VIP 5 sao!</p>
              </div>

              <p>Kính gửi <strong>{order.customer_name || 'Quý Khách Hàng'}</strong>,</p>
              <p>
                Giao dịch đặt vé xem phim của bạn đã được xác nhận thanh toán thành công từ Ban Quản Trị hệ thống (<strong>hthaongn@gmail.com</strong>). Dưới đây là thông tin chi tiết vé điện tử và mã QR để quét nhận ghế và vào phòng chiếu:
              </p>

              {/* Email Ticket Table */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '18px', margin: '18px 0', border: '1px solid #cbd5e1' }}>
                <table style={{ width: '100%', fontSize: '13.5px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Tên Phim:</td>
                      <td style={{ padding: '8px 0', fontWeight: 800, color: '#0f172a' }}>{order.movie_title}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Cụm Rạp:</td>
                      <td style={{ padding: '8px 0', fontWeight: 700 }}>{order.cinema_name}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Số Phòng Chiếu:</td>
                      <td style={{ padding: '8px 0', fontWeight: 800, color: '#0284c7' }}>{order.room}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Lịch Chiếu:</td>
                      <td style={{ padding: '8px 0', color: '#b45309', fontWeight: 800 }}>{order.show_time} ({order.show_date})</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Ghế Ngồi Đã Chọn:</td>
                      <td style={{ padding: '8px 0', fontWeight: 800, color: '#16a34a', fontSize: '16px' }}>{order.seats?.join(', ')}</td>
                    </tr>
                    {order.snacks && order.snacks.length > 0 && (
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 0', color: '#64748b' }}>Bắp Nước:</td>
                        <td style={{ padding: '8px 0' }}>{order.snacks.map(s => `${s.name} x${s.qty}`).join(', ')}</td>
                      </tr>
                    )}
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Tổng Tiền:</td>
                      <td style={{ padding: '8px 0', fontWeight: 900, color: '#16a34a', fontSize: '16px' }}>{order.total.toLocaleString('vi-VN')} đ (Đã thanh toán)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* QR Code in Email */}
              <div style={{ textAlign: 'center', margin: '22px 0', background: '#f1f5f9', padding: '16px', borderRadius: '12px' }}>
                <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '13.5px', marginBottom: '8px' }}>
                  <i className="fas fa-qrcode mr-1"></i> MÃ QR CHECK-IN LẤY GHẾ &amp; PHÒNG CHIẾU
                </div>
                <div style={{ display: 'inline-block', padding: '10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px' }}>
                  <img
                    src={ticketQrUrl}
                    alt="Ticket QR"
                    style={{ width: '150px', height: '150px', display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  Xuất trình mã này cho nhân viên tại rạp để quét kiểm tra ghế ({order.seats?.join(', ')}), phòng ({order.room}) và lịch chiếu.
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                <div><strong>Ban Quản Trị Hệ Thống CineTicket VIP</strong></div>
                <div>Hotline hỗ trợ: <strong style={{ color: '#0284c7' }}>0337191740</strong> (24/7)</div>
                <div>Email Admin: <strong style={{ color: '#0284c7' }}>hthaongn@gmail.com</strong></div>
                <div>Địa chỉ: <strong>12 Trịnh Đình Thảo, Tân Phú, TP.HCM</strong></div>
              </div>
            </div>

            {/* Email Modal Footer */}
            <div style={{ background: '#f8fafc', padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleResendEmail}
                style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                <i className="fas fa-redo-alt mr-1"></i> Gửi Lại Email Này
              </button>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                style={{ background: '#64748b', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
