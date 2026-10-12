import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ageRatings } from '../data/mockData';

const AdminDashboard = () => {
  const {
    user, movieList, addMovie, deleteMovie, updateMovie,
    orders, updateOrderStatus,
    usersList,
    reviews, deleteReview, toggleReviewApproval,
    genreList, addGenre, deleteGenre,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // New movie form state
  const [newTitle, setNewTitle] = useState('');
  const [newGenreId, setNewGenreId] = useState(genreList[0]?.id || 1);
  const [newPrice, setNewPrice] = useState(105000);
  const [newDuration, setNewDuration] = useState(120);
  const [newRating, setNewRating] = useState(8.5);
  const [newFormat, setNewFormat] = useState('2D Phụ đề');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('/assets/img/products/product-img-1.jpg');
  const [newAgeRating, setNewAgeRating] = useState('T13');
  const [newTrailerUrl, setNewTrailerUrl] = useState('');
  const [newDirector, setNewDirector] = useState('');
  const [newCast, setNewCast] = useState('');
  const [newStatus, setNewStatus] = useState('now_showing');

  // Genre form
  const [newGenreName, setNewGenreName] = useState('');

  // Orders filter
  const [orderSearch, setOrderSearch] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mt-5 mb-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'rgba(18, 20, 32, 0.9)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '20px', padding: '40px 30px', maxWidth: '540px' }}>
          <i className="fas fa-user-shield" style={{ fontSize: '56px', color: '#ef4444', marginBottom: '16px' }} />
          <h2 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 800 }}>Yêu Cầu Quyền Quản Trị Viên</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14.5px', marginBottom: '24px' }}>
            Bạn cần đăng nhập bằng tài khoản <strong>Admin</strong> để truy cập trang quản trị này.
          </p>
          <div style={{ background: 'rgba(9, 10, 15, 0.6)', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'left', fontSize: '13px', color: '#f3cf7a' }}>
            <div><strong>Tài khoản Admin:</strong> <code>admin</code></div>
            <div><strong>Mật khẩu:</strong> <code>admin123</code></div>
          </div>
          <Link to="/login" className="boxed-btn" style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)', color: '#fff', padding: '12px 30px', borderRadius: '50px', fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Đến Trang Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalTickets = orders.reduce((sum, o) => sum + (o.seats?.length || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Chờ xác nhận' || o.status === 'Đang xử lý').length;
  const pendingReviews = reviews.filter(r => !r.approved).length;

  const handleCreateMovie = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) { addToast('Vui lòng nhập tên phim!', 'error'); return; }
    const genreObj = genreList.find(g => g.id === Number(newGenreId)) || genreList[0];
    addMovie({
      title: newTitle.trim(),
      genre_id: Number(newGenreId),
      genre_name: genreObj?.name || 'Khác',
      price: Number(newPrice),
      duration: Number(newDuration),
      rating: Number(newRating),
      format: newFormat,
      description: newDesc,
      image: newImage,
      director: newDirector || 'Đang cập nhật',
      cast: newCast || 'Đang cập nhật',
      trailer_url: newTrailerUrl,
      age_rating: newAgeRating,
      status: newStatus,
      release_date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    setNewTitle(''); setNewDesc(''); setNewDirector(''); setNewCast(''); setNewTrailerUrl('');
  };

  const openEditModal = (movie) => {
    setEditingMovie({ ...movie });
    setShowEditModal(true);
  };

  const handleUpdateMovie = (e) => {
    e.preventDefault();
    updateMovie(editingMovie.id, editingMovie);
    setShowEditModal(false);
    setEditingMovie(null);
  };

  const filteredOrders = orders.filter(o =>
    orderSearch === '' ||
    o.movie_title?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    String(o.id).includes(orderSearch)
  );

  const tabStyle = (tab) => ({
    background: activeTab === tab ? 'linear-gradient(135deg, #f43f5e, #fb923c)' : 'rgba(18, 20, 32, 0.85)',
    color: activeTab === tab ? '#fff' : '#cbd5e1',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '10px 18px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', gap: '7px'
  });

  const cardBg = { background: 'rgba(18, 20, 32, 0.92)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '26px', boxShadow: '0 15px 45px rgba(0,0,0,0.5)' };
  const thStyle = { color: '#fb7185', padding: '12px', fontSize: '12.5px', textTransform: 'uppercase', fontWeight: 800 };
  const tdStyle = (extra = {}) => ({ padding: '12px', ...extra });
  const labelStyle = { color: '#f3cf7a', fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' };

  const statusColors = {
    'Đã thanh toán': '#10b981',
    'Chờ xác nhận': '#f59e0b',
    'Đang xử lý': '#3b82f6',
    'Đã hủy': '#ef4444',
    'Hoàn tiền': '#8b5cf6'
  };

  return (
    <div className="admin-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-user-shield mr-2" /> Bảng Điều Khiển Hệ Thống
          </p>
          <h1 className="catalog-title">TRANG QUẢN TRỊ CINETICKET VIP</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        {/* Metric Cards */}
        <div className="row mb-4">
          {[
            { icon: 'fa-coins', label: 'Tổng Doanh Thu', value: totalRevenue.toLocaleString('vi-VN') + ' đ', color: '#f3cf7a', bg: 'rgba(243,207,122,0.12)' },
            { icon: 'fa-ticket-alt', label: 'Vé Đã Bán', value: totalTickets + ' Vé', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
            { icon: 'fa-film', label: 'Số Phim', value: movieList.length + ' Phim', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
            { icon: 'fa-users', label: 'Thành Viên', value: usersList.length + ' Người', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
            { icon: 'fa-receipt', label: 'Đơn Chờ XN', value: pendingOrders + ' Đơn', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
            { icon: 'fa-comments', label: 'Bình Luận Chờ', value: pendingReviews + ' Bình luận', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
          ].map((m, i) => (
            <div key={i} className="col-lg-2 col-md-4 col-6 mb-3">
              <div style={{ background: 'rgba(18,20,32,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: m.bg, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 10px' }}>
                  <i className={`fas ${m.icon}`} />
                </div>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: '16px', fontWeight: 900, marginTop: '4px' }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setActiveTab('dashboard')} style={tabStyle('dashboard')}><i className="fas fa-chart-bar" /> Dashboard</button>
          <button type="button" onClick={() => setActiveTab('movies')} style={tabStyle('movies')}><i className="fas fa-film" /> Phim ({movieList.length})</button>
          <button type="button" onClick={() => setActiveTab('orders')} style={tabStyle('orders')}><i className="fas fa-receipt" /> Đơn Hàng ({orders.length})</button>
          <button type="button" onClick={() => setActiveTab('transactions')} style={tabStyle('transactions')}><i className="fas fa-exchange-alt" /> Giao Dịch</button>
          <button type="button" onClick={() => setActiveTab('reviews')} style={tabStyle('reviews')}><i className="fas fa-comments" /> Bình Luận ({reviews.length})</button>
          <button type="button" onClick={() => setActiveTab('genres')} style={tabStyle('genres')}><i className="fas fa-tags" /> Thể Loại ({genreList.length})</button>
          <button type="button" onClick={() => setActiveTab('users')} style={tabStyle('users')}><i className="fas fa-users" /> Người Dùng ({usersList.length})</button>
        </div>

        {/* ========== TAB: DASHBOARD ========== */}
        {activeTab === 'dashboard' && (
          <div style={cardBg}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 800, marginBottom: '20px', fontSize: '20px' }}>📊 Thống Kê Doanh Thu Theo Phim</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(244,63,94,0.3)' }}>
                    <th style={thStyle}>Phim</th>
                    <th style={thStyle}>Số Đơn</th>
                    <th style={thStyle}>Vé Bán</th>
                    <th style={thStyle}>Doanh Thu</th>
                    <th style={thStyle}>Tỉ Lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {movieList.map(movie => {
                    const mOrders = orders.filter(o => o.movie_title === movie.title);
                    const mTickets = mOrders.reduce((s, o) => s + (o.seats?.length || 0), 0);
                    const mRevenue = mOrders.reduce((s, o) => s + (o.total || 0), 0);
                    const pct = totalRevenue > 0 ? Math.round((mRevenue / totalRevenue) * 100) : 0;
                    return (
                      <tr key={movie.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={tdStyle({ color: '#f1f5f9', fontWeight: 700 })}>{movie.title}</td>
                        <td style={tdStyle({ color: '#cbd5e1' })}>{mOrders.length}</td>
                        <td style={tdStyle({ color: '#10b981', fontWeight: 700 })}>{mTickets}</td>
                        <td style={tdStyle({ color: '#f3cf7a', fontWeight: 800 })}>{mRevenue.toLocaleString('vi-VN')} đ</td>
                        <td style={tdStyle()}>
                          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '4px', height: '8px', width: '100px' }}>
                            <div style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', borderRadius: '4px', height: '100%', width: `${pct}%` }} />
                          </div>
                          <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '6px' }}>{pct}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== TAB: MOVIES ========== */}
        {activeTab === 'movies' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: 0 }}>Quản Lý Danh Sách Phim</h3>
              <button type="button" onClick={() => setShowAddModal(true)}
                style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', border: 'none', cursor: 'pointer' }}>
                <i className="fas fa-plus mr-1" /> Thêm Phim Mới
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(244,63,94,0.3)' }}>
                    {['Ảnh', 'Tên Phim', 'Thể Loại', 'Thời Lượng', 'Giá', 'Định Dạng', 'Tuổi', 'Trạng Thái', 'Thao Tác'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {movieList.map(movie => (
                    <tr key={movie.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={tdStyle()}>
                        <img src={movie.image} alt={movie.title} style={{ width: '44px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                          onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }} />
                      </td>
                      <td style={tdStyle({ color: '#f1f5f9', fontWeight: 700, maxWidth: '180px' })}>{movie.title}</td>
                      <td style={tdStyle({ color: '#cbd5e1', fontSize: '13px' })}>{movie.genre_name}</td>
                      <td style={tdStyle({ color: '#94a3b8', fontSize: '13px' })}>{movie.duration}p</td>
                      <td style={tdStyle({ color: '#f3cf7a', fontWeight: 800 })}>{(movie.price || 0).toLocaleString('vi-VN')}đ</td>
                      <td style={tdStyle()}>
                        <span style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>{movie.format || '2D'}</span>
                      </td>
                      <td style={tdStyle()}>
                        {movie.age_rating && (
                          <span style={{ background: ageRatings.find(a => a.code === movie.age_rating)?.color + '22' || '#37415155', color: ageRatings.find(a => a.code === movie.age_rating)?.color || '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 800 }}>
                            {movie.age_rating}
                          </span>
                        )}
                      </td>
                      <td style={tdStyle()}>
                        <span style={{ background: movie.status === 'now_showing' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: movie.status === 'now_showing' ? '#10b981' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                          {movie.status === 'now_showing' ? '● Đang Chiếu' : '◌ Sắp Chiếu'}
                        </span>
                      </td>
                      <td style={tdStyle({ textAlign: 'center', whiteSpace: 'nowrap' })}>
                        <button type="button" onClick={() => openEditModal(movie)}
                          style={{ background: 'none', border: 'none', color: '#f3cf7a', cursor: 'pointer', marginRight: '10px', fontSize: '16px' }} title="Sửa phim">
                          <i className="fas fa-edit" />
                        </button>
                        <button type="button" onClick={() => { if (window.confirm(`Xóa phim "${movie.title}"?`)) deleteMovie(movie.id); }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }} title="Xóa phim">
                          <i className="fas fa-trash-alt" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== TAB: ORDERS ========== */}
        {activeTab === 'orders' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: 0 }}>Quản Lý Đơn Đặt Vé</h3>
              <input
                type="text"
                className="form-control filter-input-vip"
                placeholder="Tìm theo phim hoặc mã đơn..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{ maxWidth: '260px' }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(244,63,94,0.3)' }}>
                    {['Mã', 'Phim', 'Rạp & Phòng', 'Ghế', 'Tổng', 'Phương Thức', 'Trạng Thái', 'Cập Nhật'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={tdStyle({ color: '#f3cf7a', fontWeight: 800 })}>#{order.id}</td>
                      <td style={tdStyle({ color: '#f1f5f9', fontWeight: 700, maxWidth: '150px', fontSize: '13.5px' })}>{order.movie_title}</td>
                      <td style={tdStyle({ color: '#94a3b8', fontSize: '12.5px' })}>{order.cinema_name}<br /><span style={{ color: '#64748b' }}>{order.room}</span></td>
                      <td style={tdStyle({ color: '#cbd5e1', fontSize: '13px' })}>{order.seats?.join(', ')}</td>
                      <td style={tdStyle({ color: '#f1f5f9', fontWeight: 800 })}>{(order.total || 0).toLocaleString('vi-VN')}đ</td>
                      <td style={tdStyle({ color: '#94a3b8', fontSize: '12.5px' })}>{order.payment_method}</td>
                      <td style={tdStyle()}>
                        <span style={{ color: statusColors[order.status] || '#94a3b8', fontWeight: 700, fontSize: '13px' }}>
                          ● {order.status}
                        </span>
                      </td>
                      <td style={tdStyle()}>
                        <select
                          className="form-control filter-input-vip"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{ fontSize: '12px', padding: '4px 8px', minWidth: '140px' }}
                        >
                          {['Đã thanh toán', 'Chờ xác nhận', 'Đang xử lý', 'Đã hủy', 'Hoàn tiền'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <p style={{ textAlign: 'center', color: '#475569', padding: '30px' }}>Không tìm thấy đơn hàng nào.</p>
              )}
            </div>
          </div>
        )}

        {/* ========== TAB: TRANSACTIONS ========== */}
        {activeTab === 'transactions' && (
          <div style={cardBg}>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              <i className="fas fa-exchange-alt mr-2" style={{ color: '#f43f5e' }} />Kiểm Tra Giao Dịch Thanh Toán
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map(order => (
                <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ color: '#f3cf7a', fontWeight: 800, fontSize: '15px' }}>Đơn #{order.id}</span>
                      <span style={{ color: '#64748b', fontSize: '12.5px', marginLeft: '10px' }}>{order.created_at}</span>
                      <div style={{ color: '#f1f5f9', fontWeight: 700, marginTop: '4px' }}>{order.movie_title}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#f1f5f9', fontWeight: 900, fontSize: '18px' }}>{(order.total || 0).toLocaleString('vi-VN')}đ</div>
                      <div style={{ color: '#94a3b8', fontSize: '12.5px' }}>{order.payment_method}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Payment proof placeholder */}
                    <div style={{ width: '80px', height: '60px', background: 'rgba(244,63,94,0.08)', border: '1px dashed rgba(244,63,94,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', fontSize: '24px' }}>
                      {order.payment_proof ? <img src={order.payment_proof} alt="proof" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <i className="fas fa-image" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#64748b', fontSize: '12.5px', marginBottom: '6px' }}>Ảnh xác nhận thanh toán</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ color: statusColors[order.status] || '#94a3b8', background: (statusColors[order.status] || '#94a3b8') + '22', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                          {order.status}
                        </span>
                        <select
                          className="form-control filter-input-vip"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{ fontSize: '12px', padding: '4px 8px', maxWidth: '160px' }}
                        >
                          {['Đã thanh toán', 'Chờ xác nhận', 'Đang xử lý', 'Đã hủy', 'Hoàn tiền'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== TAB: REVIEWS ========== */}
        {activeTab === 'reviews' && (
          <div style={cardBg}>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              <i className="fas fa-comments mr-2" style={{ color: '#f43f5e' }} />Quản Lý Bình Luận & Đánh Giá
            </h3>
            {reviews.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#475569', padding: '30px' }}>Chưa có bình luận nào.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviews.map(review => {
                  const movie = movieList.find(m => m.id === review.movie_id);
                  return (
                    <div key={review.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${review.approved ? 'rgba(255,255,255,0.07)' : 'rgba(245,158,11,0.3)'}`, borderRadius: '14px', padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '14px' }}>{review.user}</span>
                          <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '8px' }}>{review.created_at}</span>
                          <div style={{ color: '#94a3b8', fontSize: '12.5px', marginTop: '2px' }}>
                            <i className="fas fa-film mr-1" style={{ color: '#f43f5e' }} />{movie?.title || `Phim #${review.movie_id}`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '3px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '13px' }}>
                            <i className="fas fa-star mr-1" />{review.rating}/10
                          </span>
                          <span style={{ background: review.approved ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: review.approved ? '#10b981' : '#f59e0b', padding: '3px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px' }}>
                            {review.approved ? '✓ Hiển thị' : '⏳ Chờ duyệt'}
                          </span>
                          <button type="button" onClick={() => toggleReviewApproval(review.id)}
                            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                            {review.approved ? 'Ẩn' : 'Duyệt'}
                          </button>
                          <button type="button" onClick={() => { if (window.confirm('Xóa bình luận này?')) deleteReview(review.id); }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }} title="Xóa">
                            <i className="fas fa-trash-alt" />
                          </button>
                        </div>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: 1.6, margin: 0 }}>{review.comment}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========== TAB: GENRES ========== */}
        {activeTab === 'genres' && (
          <div style={cardBg}>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              <i className="fas fa-tags mr-2" style={{ color: '#f43f5e' }} />Quản Lý Thể Loại Phim
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); if (!newGenreName.trim()) return; addGenre(newGenreName); setNewGenreName(''); }}
              style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-control filter-input-vip"
                placeholder="Tên thể loại mới..."
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                style={{ flex: 1, minWidth: '200px' }}
              />
              <button type="submit"
                style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <i className="fas fa-plus mr-1" /> Thêm Thể Loại
              </button>
            </form>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {genreList.map(g => (
                <div key={g.id} style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{g.name}</span>
                  <span style={{ color: '#475569', fontSize: '12px' }}>({movieList.filter(m => m.genre_id === g.id).length} phim)</span>
                  <button type="button" onClick={() => { if (window.confirm(`Xóa thể loại "${g.name}"?`)) deleteGenre(g.id); }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0', fontSize: '14px' }}>
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== TAB: USERS ========== */}
        {activeTab === 'users' && (
          <div style={cardBg}>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Quản Lý Người Dùng</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(244,63,94,0.3)' }}>
                    {['#', 'Họ Tên', 'Tên Đăng Nhập', 'Email', 'Vai Trò', 'Đơn Hàng'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u, i) => {
                    const userOrders = orders.filter(o => o.user_id === u.id || o.username === u.username);
                    return (
                      <tr key={u.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={tdStyle({ color: '#475569' })}>{i + 1}</td>
                        <td style={tdStyle({ color: '#f1f5f9', fontWeight: 700 })}>{u.fullname || u.username}</td>
                        <td style={tdStyle({ color: '#f3cf7a' })}>{u.username}</td>
                        <td style={tdStyle({ color: '#94a3b8' })}>{u.email}</td>
                        <td style={tdStyle()}>
                          <span style={{ background: u.role === 'admin' ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : 'rgba(99,102,241,0.2)', color: u.role === 'admin' ? '#fff' : '#818cf8', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                            {u.role === 'admin' ? '⚡ ADMIN' : '★ MEMBER'}
                          </span>
                        </td>
                        <td style={tdStyle({ color: '#10b981', fontWeight: 700 })}>{userOrders.length} đơn</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========== ADD MOVIE MODAL ========== */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'rgba(14,15,22,0.98)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '24px', maxWidth: '720px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button type="button" onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%' }}>
              ×
            </button>
            <h3 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>
              <i className="fas fa-film mr-2" style={{ color: '#f43f5e' }} />Thêm Phim Mới Vào Rạp
            </h3>
            <form onSubmit={handleCreateMovie}>
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label style={labelStyle}>Tên Phim <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" required className="form-control filter-input-vip" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ví dụ: Chiến Binh Báo Đen 3" />
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Trạng Thái</label>
                  <select className="form-control filter-input-vip" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="now_showing">Đang Chiếu</option>
                    <option value="coming_soon">Sắp Chiếu</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Thể Loại</label>
                  <select className="form-control filter-input-vip" value={newGenreId} onChange={(e) => setNewGenreId(e.target.value)}>
                    {genreList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Phân Loại Tuổi</label>
                  <select className="form-control filter-input-vip" value={newAgeRating} onChange={(e) => setNewAgeRating(e.target.value)}>
                    {ageRatings.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Giá Vé (VND) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="number" required className="form-control filter-input-vip" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Thời Lượng (phút)</label>
                  <input type="number" className="form-control filter-input-vip" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Điểm IMDb</label>
                  <input type="number" step="0.1" min="0" max="10" className="form-control filter-input-vip" value={newRating} onChange={(e) => setNewRating(e.target.value)} />
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Định Dạng</label>
                  <input type="text" className="form-control filter-input-vip" value={newFormat} onChange={(e) => setNewFormat(e.target.value)} placeholder="2D, 3D IMAX..." />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Đạo Diễn</label>
                  <input type="text" className="form-control filter-input-vip" value={newDirector} onChange={(e) => setNewDirector(e.target.value)} placeholder="Tên đạo diễn..." />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Diễn Viên</label>
                  <input type="text" className="form-control filter-input-vip" value={newCast} onChange={(e) => setNewCast(e.target.value)} placeholder="Ngăn cách bằng dấu phẩy..." />
                </div>
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Trailer URL (YouTube Embed)</label>
                <input type="url" className="form-control filter-input-vip" value={newTrailerUrl} onChange={(e) => setNewTrailerUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>URL Poster / Ảnh Phim</label>
                <input type="text" className="form-control filter-input-vip" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="/assets/img/products/..." />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Mô Tả Phim</label>
                <textarea rows="3" className="form-control filter-input-vip" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Tóm tắt cốt truyện phim..." style={{ height: 'auto' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '13px', borderRadius: '12px', fontWeight: 900, textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
                  <i className="fas fa-plus mr-2" />Xác Nhận Thêm Phim
                </button>
                <button type="button" onClick={() => setShowAddModal(false)}
                  style={{ padding: '13px 24px', borderRadius: '12px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', cursor: 'pointer' }}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== EDIT MOVIE MODAL ========== */}
      {showEditModal && editingMovie && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'rgba(14,15,22,0.98)', border: '1px solid rgba(243,207,122,0.3)', borderRadius: '24px', maxWidth: '720px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button type="button" onClick={() => setShowEditModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%' }}>
              ×
            </button>
            <h3 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>
              <i className="fas fa-edit mr-2" style={{ color: '#f3cf7a' }} />Chỉnh Sửa Phim
            </h3>
            <form onSubmit={handleUpdateMovie}>
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label style={labelStyle}>Tên Phim</label>
                  <input type="text" required className="form-control filter-input-vip" value={editingMovie.title} onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Trạng Thái</label>
                  <select className="form-control filter-input-vip" value={editingMovie.status} onChange={(e) => setEditingMovie({ ...editingMovie, status: e.target.value })}>
                    <option value="now_showing">Đang Chiếu</option>
                    <option value="coming_soon">Sắp Chiếu</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Phân Loại Tuổi</label>
                  <select className="form-control filter-input-vip" value={editingMovie.age_rating || 'T13'} onChange={(e) => setEditingMovie({ ...editingMovie, age_rating: e.target.value })}>
                    {ageRatings.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Giá Vé (VND)</label>
                  <input type="number" className="form-control filter-input-vip" value={editingMovie.price} onChange={(e) => setEditingMovie({ ...editingMovie, price: Number(e.target.value) })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>Thời Lượng (phút)</label>
                  <input type="number" className="form-control filter-input-vip" value={editingMovie.duration} onChange={(e) => setEditingMovie({ ...editingMovie, duration: Number(e.target.value) })} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Định Dạng</label>
                  <input type="text" className="form-control filter-input-vip" value={editingMovie.format || ''} onChange={(e) => setEditingMovie({ ...editingMovie, format: e.target.value })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Điểm IMDb</label>
                  <input type="number" step="0.1" className="form-control filter-input-vip" value={editingMovie.rating || 8} onChange={(e) => setEditingMovie({ ...editingMovie, rating: Number(e.target.value) })} />
                </div>
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Trailer URL</label>
                <input type="text" className="form-control filter-input-vip" value={editingMovie.trailer_url || ''} onChange={(e) => setEditingMovie({ ...editingMovie, trailer_url: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Đạo Diễn</label>
                <input type="text" className="form-control filter-input-vip" value={editingMovie.director || ''} onChange={(e) => setEditingMovie({ ...editingMovie, director: e.target.value })} />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Diễn Viên</label>
                <input type="text" className="form-control filter-input-vip" value={editingMovie.cast || ''} onChange={(e) => setEditingMovie({ ...editingMovie, cast: e.target.value })} />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Mô Tả Phim</label>
                <textarea rows="3" className="form-control filter-input-vip" value={editingMovie.description || ''} onChange={(e) => setEditingMovie({ ...editingMovie, description: e.target.value })} style={{ height: 'auto' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#f3cf7a,#d4af37)', color: '#090a0f', padding: '13px', borderRadius: '12px', fontWeight: 900, textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
                  <i className="fas fa-save mr-2" />Lưu Thay Đổi
                </button>
                <button type="button" onClick={() => setShowEditModal(false)}
                  style={{ padding: '13px 24px', borderRadius: '12px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', cursor: 'pointer' }}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
