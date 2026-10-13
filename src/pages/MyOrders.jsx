import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const MyOrders = () => {
  const { orders, addToast } = useApp();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailOrder, setEmailOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const handleOpenEmailModal = (order) => {
    setEmailOrder(order);
    setShowEmailModal(true);
  };

  const handleResendEmail = (order) => {
    addToast(`Đã gửi lại email xác nhận từ admin hthaongn@gmail.com tới ${order.customer_email || 'email của bạn'}!`, 'success');
  };

  const getTicketQrUrl = (order) => {
    if (!order) return '';
    const text = `[VÉ ĐIỆN TỬ CINETICKET VIP #${order.id}]\n` +
      `Phim: ${order.movie_title}\n` +
      `Cụm Rạp: ${order.cinema_name}\n` +
      `Phòng Chiếu: ${order.room}\n` +
      `Suất Chiếu: ${order.show_time} (${order.show_date})\n` +
      `Ghế Ngồi: ${order.seats?.join(', ') || 'N/A'}\n` +
      `Khách Hàng: ${order.customer_name || 'Khách Hàng'}\n` +
      `Trạng Thái: ${order.status || 'Đã thanh toán'}\n` +
      `Tổng Tiền: ${(order.total || 0).toLocaleString('vi-VN')} đ\n` +
      `Hotline: 0337191740 | Email Admin: hthaongn@gmail.com\n` +
      `Địa Chỉ: 12 Trịnh Đình Thảo, Tân Phú, TP.HCM`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  const statusColors = {
    'Đã thanh toán': '#10b981',
    'Chờ xác nhận': '#f59e0b',
    'Đang xử lý': '#3b82f6',
    'Đã hủy': '#ef4444',
    'Hoàn tiền': '#8b5cf6'
  };

  return (
    <div className="myorders-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-ticket-alt mr-2"></i> Lịch Sử Đặt Vé &amp; Chi Tiết Đơn Hàng
          </p>
          <h1 className="catalog-title">VÉ ĐÃ ĐẶT CỦA TÔI</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Tất Cả Đơn', count: orders.length },
            { key: 'Đã thanh toán', label: 'Đã Thanh Toán', count: orders.filter(o => o.status === 'Đã thanh toán').length },
            { key: 'Chờ xác nhận', label: 'Chờ Duyệt Thanh Toán', count: orders.filter(o => o.status === 'Chờ xác nhận').length },
            { key: 'Đã hủy', label: 'Đã Hủy', count: orders.filter(o => o.status === 'Đã hủy').length }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              style={{
                background: statusFilter === tab.key ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(18, 20, 29, 0.85)',
                color: statusFilter === tab.key ? '#090a0f' : '#cbd5e1',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '8px 18px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: 'rgba(18, 20, 29, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '20px'
          }}>
            <i className="fas fa-ticket-alt" style={{ fontSize: '56px', color: 'rgba(212, 175, 55, 0.3)', marginBottom: '16px', display: 'block' }}></i>
            <h3 style={{ color: '#fff' }}>Chưa có đơn đặt vé nào trong mục này!</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Hãy đặt ngay vé xem phim để trải nghiệm phòng chiếu VIP 5 sao tại CineTicket.
            </p>
            <Link to="/movies" className="boxed-btn" style={{
              background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
              color: '#090a0f',
              padding: '12px 28px',
              borderRadius: '50px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              Đặt Vé Phim Mới
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredOrders.map(order => (
              <div
                key={order.id}
                style={{
                  background: 'rgba(18, 20, 29, 0.92)',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
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
                    <span style={{
                      color: statusColors[order.status] || '#10b981',
                      fontWeight: 700,
                      fontSize: '13px',
                      background: (statusColors[order.status] || '#10b981') + '22',
                      padding: '2px 10px',
                      borderRadius: '6px'
                    }}>
                      ● {order.status}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                      <i className="far fa-clock mr-1"></i> {order.created_at}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 8px' }}>
                    {order.movie_title}
                  </h3>

                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span><i className="fas fa-map-marker-alt" style={{ color: '#d4af37', marginRight: '4px' }}></i> {order.cinema_name} ({order.room})</span>
                    <span><i className="far fa-calendar-alt" style={{ color: '#d4af37', marginRight: '4px' }}></i> {order.show_time} • {order.show_date}</span>
                    <span><i className="fas fa-couch" style={{ color: '#d4af37', marginRight: '4px' }}></i> Ghế: <strong>{order.seats?.join(', ')}</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '4px' }}>Tổng thanh toán:</div>
                  <div style={{ color: '#f3cf7a', fontSize: '22px', fontWeight: 900, marginBottom: '12px' }}>
                    {order.total.toLocaleString('vi-VN')} đ
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="bordered-btn"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-file-invoice mr-1"></i> Chi Tiết Đơn
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEmailModal(order)}
                      style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Xem email xác nhận thanh toán"
                    >
                      <i className="fas fa-envelope mr-1"></i> Email Xác Nhận
                    </button>

                    <Link
                      to={`/order-success/${order.id}`}
                      className="bordered-btn"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <i className="fas fa-qrcode mr-1"></i> Mã QR
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED ORDER MODAL */}
      {selectedOrder && (
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
            background: 'rgba(18, 20, 29, 0.98)',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '24px',
            maxWidth: '650px',
            width: '100%',
            padding: '30px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{
                background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                color: '#090a0f',
                fontWeight: 900,
                fontSize: '12px',
                padding: '4px 14px',
                borderRadius: '50px'
              }}>
                HÓA ĐƠN CHI TIẾT #{selectedOrder.id}
              </span>
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 900, marginTop: '12px' }}>
                {selectedOrder.movie_title}
              </h3>
              <div style={{ color: statusColors[selectedOrder.status] || '#10b981', fontWeight: 700, fontSize: '14px' }}>
                Trạng thái: {selectedOrder.status}
              </div>
            </div>

            {/* Information Grid */}
            <div style={{ background: 'rgba(9, 10, 15, 0.6)', borderRadius: '14px', padding: '18px', marginBottom: '20px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', fontSize: '13.5px' }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>Cụm Rạp:</span>
                  <strong style={{ color: '#fff' }}>{selectedOrder.cinema_name}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>Phòng Chiếu:</span>
                  <strong style={{ color: '#fff' }}>{selectedOrder.room}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>Suất Chiếu:</span>
                  <strong style={{ color: '#f3cf7a' }}>{selectedOrder.show_time} ({selectedOrder.show_date})</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>Ghế Ngồi:</span>
                  <strong style={{ color: '#f3cf7a' }}>{selectedOrder.seats?.join(', ')}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>Khách Hàng:</span>
                  <strong style={{ color: '#fff' }}>{selectedOrder.customer_name || 'Khách Hàng'}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>Email Nhận Vé:</span>
                  <strong style={{ color: '#fff' }}>{selectedOrder.customer_email || 'hathao@cineticket.vn'}</strong>
                </div>
              </div>
            </div>

            {/* Snacks Breakdown */}
            {selectedOrder.snacks && selectedOrder.snacks.length > 0 && (
              <div style={{ background: 'rgba(9, 10, 15, 0.6)', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(212, 175, 55, 0.15)' }}>
                <div style={{ color: '#f3cf7a', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>
                  <i className="fas fa-utensils mr-2"></i> Bắp Nước Kèm Theo:
                </div>
                {selectedOrder.snacks.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '13px' }}>
                    <span>{s.name} x{s.qty}</span>
                    <span>{(s.price * s.qty).toLocaleString()} đ</span>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Proof Preview if present */}
            {selectedOrder.payment_proof && (
              <div style={{ background: 'rgba(9, 10, 15, 0.6)', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(212, 175, 55, 0.15)', textAlign: 'center' }}>
                <div style={{ color: '#f3cf7a', fontWeight: 800, fontSize: '13px', marginBottom: '10px' }}>
                  <i className="fas fa-image mr-1"></i> Ảnh Chứng Minh Chuyển Khoản Đã Upload:
                </div>
                <img
                  src={selectedOrder.payment_proof}
                  alt="Proof"
                  style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                />
              </div>
            )}

            {/* Total and QR Check-in */}
            <div style={{ textAlign: 'center', borderTop: '1px dashed rgba(212, 175, 55, 0.25)', paddingTop: '20px' }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Tổng thanh toán:</div>
              <div style={{ color: '#f3cf7a', fontSize: '26px', fontWeight: 900, marginBottom: '14px' }}>
                {selectedOrder.total.toLocaleString('vi-VN')} đ
              </div>
              <div style={{ display: 'inline-block', background: '#fff', padding: '10px', borderRadius: '12px' }}>
                <img
                  src={getTicketQrUrl(selectedOrder)}
                  alt="Ticket QR"
                  style={{ width: '140px', height: '140px', display: 'block' }}
                />
              </div>
              <div style={{ color: '#f3cf7a', fontSize: '12px', fontWeight: 700, marginTop: '6px' }}>Mã QR Quét Lấy Ghế ({selectedOrder.seats?.join(', ')}) &amp; Phòng ({selectedOrder.room})</div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  handleOpenEmailModal(selectedOrder);
                }}
                style={{ background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}
              >
                <i className="fas fa-envelope mr-1"></i> Xem Email Xác Nhận
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL CONFIRMATION MODAL */}
      {showEmailModal && emailOrder && (
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
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            position: 'relative'
          }}>
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
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Xác nhận đặt vé &amp; biên lai thanh toán tự động</div>
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

            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px' }}>
              <div style={{ marginBottom: '6px' }}><strong>Từ:</strong> <span style={{ color: '#090a0f', fontWeight: 700 }}>Ban Quản Trị CineTicket &lt;hthaongn@gmail.com&gt;</span></div>
              <div style={{ marginBottom: '6px' }}><strong>Tới:</strong> {emailOrder.customer_name || 'Khách Hàng'} &lt;<span style={{ color: '#0284c7' }}>{emailOrder.customer_email || 'hthaongn@gmail.com'}</span>&gt;</div>
              <div style={{ marginBottom: '6px' }}><strong>Tiêu đề:</strong> <span style={{ color: '#0284c7', fontWeight: 800 }}>[CineTicket VIP] Xác nhận thanh toán &amp; Vé điện tử mã #{emailOrder.id}</span></div>
              <div style={{ color: '#64748b', fontSize: '12px' }}><strong>Thời gian:</strong> {emailOrder.created_at}</div>
            </div>

            <div style={{ padding: '28px 24px', fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#b45309', fontSize: '20px', fontWeight: 900, margin: '0 0 6px' }}>CINETICKET VIETNAM</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Cảm ơn quý khách đã tin tưởng dịch vụ xem phim VIP 5 sao!</p>
              </div>

              <p>Kính gửi <strong>{emailOrder.customer_name || 'Quý Khách Hàng'}</strong>,</p>
              <p>
                Giao dịch đặt vé xem phim của bạn đã được hệ thống ghi nhận thành công. Dưới đây là thông tin chi tiết vé điện tử của bạn:
              </p>

              <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '18px', margin: '18px 0', border: '1px solid #cbd5e1' }}>
                <table style={{ width: '100%', fontSize: '13.5px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Phim:</td>
                      <td style={{ padding: '8px 0', fontWeight: 800, color: '#0f172a' }}>{emailOrder.movie_title}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Cụm Rạp:</td>
                      <td style={{ padding: '8px 0', fontWeight: 700 }}>{emailOrder.cinema_name}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Phòng Chiếu:</td>
                      <td style={{ padding: '8px 0' }}>{emailOrder.room}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Suất Chiếu:</td>
                      <td style={{ padding: '8px 0', color: '#b45309', fontWeight: 800 }}>{emailOrder.show_time} ({emailOrder.show_date})</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Ghế Ngồi:</td>
                      <td style={{ padding: '8px 0', fontWeight: 800, color: '#b45309' }}>{emailOrder.seats?.join(', ')}</td>
                    </tr>
                    {emailOrder.snacks && emailOrder.snacks.length > 0 && (
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 0', color: '#64748b' }}>Bắp Nước:</td>
                        <td style={{ padding: '8px 0' }}>{emailOrder.snacks.map(s => `${s.name} x${s.qty}`).join(', ')}</td>
                      </tr>
                    )}
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Tổng Tiền:</td>
                      <td style={{ padding: '8px 0', fontWeight: 900, color: '#16a34a', fontSize: '16px' }}>{emailOrder.total.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: 'center', margin: '20px 0', background: '#f1f5f9', padding: '16px', borderRadius: '12px' }}>
                <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>
                  <i className="fas fa-qrcode mr-1"></i> MÃ QR CHECK-IN LẤY GHẾ &amp; VÀO PHÒNG CHIẾU
                </div>
                <div style={{ display: 'inline-block', padding: '10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                  <img
                    src={getTicketQrUrl(emailOrder)}
                    alt="Ticket QR"
                    style={{ width: '140px', height: '140px', display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Mã QR quét lấy ghế ({emailOrder.seats?.join(', ')}), phòng ({emailOrder.room}) &amp; suất chiếu.</div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '14px', fontSize: '12px', color: '#64748b' }}>
                <div><strong>Ban Quản Trị Hệ Thống CineTicket VIP</strong></div>
                <div>Hotline hỗ trợ: <strong style={{ color: '#0284c7' }}>0337191740</strong> • Email: <strong style={{ color: '#0284c7' }}>hthaongn@gmail.com</strong></div>
                <div>Trụ sở: <strong>12 Trịnh Đình Thảo, Tân Phú, TP.HCM</strong></div>
              </div>

              <p style={{ fontSize: '13px', color: '#64748b' }}>
                * Vui lòng có mặt tại rạp trước giờ chiếu ít nhất 15 phút để làm thủ tục nhận bắp nước và vào phòng chiếu. Chúc bạn có những phút giây xem phim tuyệt vời!
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleResendEmail(emailOrder)}
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

export default MyOrders;
