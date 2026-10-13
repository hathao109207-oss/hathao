import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ageRatings, supportedBanks, defaultAdminPaymentSettings } from '../data/mockData';

const AdminDashboard = () => {
  const {
    user, movieList, addMovie, deleteMovie, updateMovie,
    orders, updateOrderStatus, deleteOrder,
    usersList, addUser, deleteUser, updateUserRole,
    reviews, deleteReview, toggleReviewApproval,
    genreList, addGenre, updateGenre, deleteGenre,
    adminPaymentSettings, updateAdminPaymentSettings, resetAdminPaymentSettings,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [activeProofImage, setActiveProofImage] = useState(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditGenreModal, setShowEditGenreModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);

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

  // User form
  const [newUserName, setNewUserName] = useState('');
  const [newUserFullname, setNewUserFullname] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('123456');
  const [newUserRole, setNewUserRole] = useState('member');

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');

  // Admin Payment QR Settings form state
  const [qrForm, setQrForm] = useState(adminPaymentSettings || defaultAdminPaymentSettings);

  useEffect(() => {
    if (adminPaymentSettings) {
      setQrForm(adminPaymentSettings);
    }
  }, [adminPaymentSettings]);

  const handleQrFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Vui lòng chọn file hình ảnh (PNG, JPG, JPEG, SVG, WEBP)!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setQrForm(prev => ({
          ...prev,
          qrType: 'upload',
          qrImageUrl: ev.target.result
        }));
        addToast('Đã tải lên ảnh mã QR mới! Nhấn "Lưu Cài Đặt" để áp dụng cho khách hàng.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMomoQrFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Vui lòng chọn file hình ảnh!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setQrForm(prev => ({
          ...prev,
          momoQrImageUrl: ev.target.result
        }));
        addToast('Đã tải lên ảnh mã QR MoMo mới!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePaymentSettings = (e) => {
    e.preventDefault();
    updateAdminPaymentSettings(qrForm);
  };

  const handleResetPaymentSettings = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục mã QR và thông tin tài khoản về mặc định?')) {
      resetAdminPaymentSettings();
      setQrForm(defaultAdminPaymentSettings);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mt-5 mb-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'rgba(18, 20, 32, 0.95)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '20px', padding: '40px 30px', maxWidth: '540px' }}>
          <i className="fas fa-user-shield" style={{ fontSize: '56px', color: '#ef4444', marginBottom: '16px' }} />
          <h2 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 800 }}>Yêu Cầu Quyền Quản Trị Viên</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14.5px', marginBottom: '24px' }}>
            Bạn cần đăng nhập bằng tài khoản <strong>Admin</strong> để truy cập bảng điều khiển quản trị này.
          </p>
          <div style={{ background: 'rgba(9, 10, 15, 0.6)', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'left', fontSize: '13px', color: '#f3cf7a' }}>
            <div><strong>Tài khoản Quản Trị:</strong> <code>admin</code></div>
            <div><strong>Mật khẩu:</strong> <code>admin123</code></div>
          </div>
          <Link to="/login" className="boxed-btn" style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)', color: '#fff', padding: '12px 30px', borderRadius: '50px', fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Đến Trang Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalTickets = orders.reduce((sum, o) => sum + (o.seats?.length || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Chờ xác nhận' || o.status === 'Đang xử lý').length;
  const pendingReviews = reviews.filter(r => !r.approved).length;

  // Poster Image Upload Handler (Add)
  const handlePosterFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImage(ev.target.result);
        addToast('Đã upload ảnh poster thành công!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Poster Image Upload Handler (Edit)
  const handleEditPosterFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditingMovie(prev => ({ ...prev, image: ev.target.result }));
        addToast('Đã cập nhật ảnh poster mới!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      addToast('Vui lòng nhập tên đăng nhập!', 'error');
      return;
    }
    addUser({
      username: newUserName.trim(),
      fullname: newUserFullname.trim() || newUserName.trim(),
      email: newUserEmail.trim() || `${newUserName.trim()}@cineticket.vn`,
      password: newUserPassword,
      role: newUserRole
    });
    setShowAddUserModal(false);
    setNewUserName(''); setNewUserFullname(''); setNewUserEmail(''); setNewUserPassword('123456');
  };

  const handleSaveGenreEdit = (e) => {
    e.preventDefault();
    if (editingGenre && editingGenre.name.trim()) {
      updateGenre(editingGenre.id, editingGenre.name.trim());
      setShowEditGenreModal(false);
      setEditingGenre(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = orderSearch === '' ||
      o.movie_title?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      String(o.id).includes(orderSearch);

    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredReviews = reviews.filter(r => {
    if (reviewFilter === 'approved') return r.approved;
    if (reviewFilter === 'pending') return !r.approved;
    return true;
  });

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

  const cardBg = { background: 'rgba(18, 20, 32, 0.94)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '26px', boxShadow: '0 15px 45px rgba(0,0,0,0.5)' };
  const thStyle = { color: '#fb7185', padding: '12px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800 };
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
            <i className="fas fa-user-shield mr-2" /> Bảng Điều Khiển Hệ Thống Toàn Diện
          </p>
          <h1 className="catalog-title">TRANG QUẢN TRỊ CINETICKET VIP</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        {/* Metric Overview Cards */}
        <div className="row mb-4">
          {[
            { icon: 'fa-coins', label: 'Tổng Doanh Thu', value: totalRevenue.toLocaleString('vi-VN') + ' đ', color: '#f3cf7a', bg: 'rgba(243,207,122,0.12)' },
            { icon: 'fa-ticket-alt', label: 'Vé Đã Bán', value: totalTickets + ' Vé', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
            { icon: 'fa-film', label: 'Số Phim', value: movieList.length + ' Phim', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
            { icon: 'fa-users', label: 'Thành Viên', value: usersList.length + ' Người', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
            { icon: 'fa-receipt', label: 'Đơn Chờ Duyệt', value: pendingOrders + ' Đơn', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
            { icon: 'fa-comments', label: 'Bình Luận', value: reviews.length + ' Lượt', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
          ].map((m, i) => (
            <div key={i} className="col-lg-2 col-md-4 col-6 mb-3">
              <div style={{ background: 'rgba(18,20,32,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: m.bg, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 10px' }}>
                  <i className={`fas ${m.icon}`} />
                </div>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: '15px', fontWeight: 900, marginTop: '4px' }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setActiveTab('dashboard')} style={tabStyle('dashboard')}><i className="fas fa-chart-line" /> Dashboard Doanh Thu</button>
          <button type="button" onClick={() => setActiveTab('movies')} style={tabStyle('movies')}><i className="fas fa-film" /> Quản Lý Phim ({movieList.length})</button>
          <button type="button" onClick={() => setActiveTab('genres')} style={tabStyle('genres')}><i className="fas fa-tags" /> Thể Loại Phim ({genreList.length})</button>
          <button type="button" onClick={() => setActiveTab('orders')} style={tabStyle('orders')}><i className="fas fa-receipt" /> Đơn Hàng ({orders.length})</button>
          <button type="button" onClick={() => setActiveTab('transactions')} style={tabStyle('transactions')}><i className="fas fa-exchange-alt" /> Kiểm Tra Giao Dịch</button>
          <button type="button" onClick={() => setActiveTab('payment_qr')} style={tabStyle('payment_qr')}><i className="fas fa-qrcode" /> Cài Đặt Mã QR Admin</button>
          <button type="button" onClick={() => setActiveTab('users')} style={tabStyle('users')}><i className="fas fa-users" /> Quản Lý Người Dùng ({usersList.length})</button>
          <button type="button" onClick={() => setActiveTab('reviews')} style={tabStyle('reviews')}><i className="fas fa-comments" /> Quản Lý Bình Luận ({reviews.length})</button>
        </div>

        {/* ========== TAB 1: DASHBOARD THỐNG KÊ DOANH THU ========== */}
        {activeTab === 'dashboard' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0, fontSize: '20px' }}>
                📊 Phân Tích Doanh Thu Chi Tiết Theo Phim
              </h3>
              <div style={{ color: '#10b981', fontWeight: 800, fontSize: '16px' }}>
                Tổng Thu: {totalRevenue.toLocaleString('vi-VN')} đ
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(244,63,94,0.3)' }}>
                    <th style={thStyle}>Tên Phim</th>
                    <th style={thStyle}>Thể Loại</th>
                    <th style={thStyle}>Số Đơn</th>
                    <th style={thStyle}>Vé Bán</th>
                    <th style={thStyle}>Doanh Thu</th>
                    <th style={thStyle}>Tỉ Trọng</th>
                  </tr>
                </thead>
                <tbody>
                  {movieList.map(movie => {
                    const mOrders = orders.filter(o => o.movie_title === movie.title || o.movie_id === movie.id);
                    const mTickets = mOrders.reduce((s, o) => s + (o.seats?.length || 0), 0);
                    const mRevenue = mOrders.reduce((s, o) => s + (o.total || 0), 0);
                    const pct = totalRevenue > 0 ? Math.round((mRevenue / totalRevenue) * 100) : 0;
                    return (
                      <tr key={movie.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={tdStyle({ color: '#f1f5f9', fontWeight: 700 })}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={movie.image} alt={movie.title} style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }} />
                            <span>{movie.title}</span>
                          </div>
                        </td>
                        <td style={tdStyle({ color: '#cbd5e1', fontSize: '13px' })}>{movie.genre_name}</td>
                        <td style={tdStyle({ color: '#cbd5e1' })}>{mOrders.length} đơn</td>
                        <td style={tdStyle({ color: '#10b981', fontWeight: 800 })}>{mTickets} vé</td>
                        <td style={tdStyle({ color: '#f3cf7a', fontWeight: 800 })}>{mRevenue.toLocaleString('vi-VN')} đ</td>
                        <td style={tdStyle()}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '4px', height: '8px', width: '100px' }}>
                              <div style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', borderRadius: '4px', height: '100%', width: `${pct}%` }} />
                            </div>
                            <span style={{ color: '#64748b', fontSize: '12px' }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== TAB 2: QUẢN LÝ PHIM (CRUD + UPLOAD POSTER) ========== */}
        {activeTab === 'movies' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: 0 }}>
                🎬 Danh Sách Phim Chiếu Rạp
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', border: 'none', cursor: 'pointer' }}
              >
                <i className="fas fa-plus mr-1" /> Thêm Phim Mới &amp; Upload Poster
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(244,63,94,0.3)' }}>
                    {['Poster', 'Tên Phim', 'Thể Loại', 'Thời Lượng', 'Giá Vé', 'Định Dạng', 'Độ Tuổi', 'Trạng Thái', 'Thao Tác'].map(h => (
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
                      <td style={tdStyle({ color: '#94a3b8', fontSize: '13px' })}>{movie.duration} phút</td>
                      <td style={tdStyle({ color: '#f3cf7a', fontWeight: 800 })}>{(movie.price || 0).toLocaleString('vi-VN')} đ</td>
                      <td style={tdStyle()}>
                        <span style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                          {movie.format || '2D'}
                        </span>
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
                        <button
                          type="button"
                          onClick={() => openEditModal(movie)}
                          style={{ background: 'none', border: 'none', color: '#f3cf7a', cursor: 'pointer', marginRight: '12px', fontSize: '16px' }}
                          title="Sửa thông tin phim"
                        >
                          <i className="fas fa-edit" />
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (window.confirm(`Xác nhận xóa phim "${movie.title}"?`)) deleteMovie(movie.id); }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                          title="Xóa phim khỏi rạp"
                        >
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

        {/* ========== TAB 3: QUẢN LÝ THỂ LOẠI PHIM ========== */}
        {activeTab === 'genres' && (
          <div style={cardBg}>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              <i className="fas fa-tags mr-2" style={{ color: '#f43f5e' }} /> Quản Lý Thể Loại Phim
            </h3>

            {/* Add genre form */}
            <form onSubmit={(e) => { e.preventDefault(); if (!newGenreName.trim()) return; addGenre(newGenreName); setNewGenreName(''); }}
              style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-control filter-input-vip"
                placeholder="Nhập tên thể loại mới (Ví dụ: Tâm Lý Tội Phạm)..."
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                style={{ flex: 1, minWidth: '220px' }}
              />
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '10px 22px', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <i className="fas fa-plus mr-1" /> Thêm Thể Loại
              </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {genreList.map(g => (
                <div key={g.id} style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '14.5px' }}>{g.name}</span>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                      {movieList.filter(m => m.genre_id === g.id).length} bộ phim
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => { setEditingGenre({ ...g }); setShowEditGenreModal(true); }}
                      style={{ background: 'none', border: 'none', color: '#f3cf7a', cursor: 'pointer', fontSize: '14px' }}
                      title="Sửa tên thể loại"
                    >
                      <i className="fas fa-edit" />
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (window.confirm(`Xác nhận xóa thể loại "${g.name}"?`)) deleteGenre(g.id); }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
                      title="Xóa thể loại"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== TAB 4: QUẢN LÝ ĐƠN HÀNG ========== */}
        {activeTab === 'orders' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: 0 }}>
                🧾 Danh Sách Đơn Đặt Vé &amp; Cập Nhật Trạng Thái
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-control filter-input-vip"
                  placeholder="Tìm theo phim, khách hàng hoặc mã đơn..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ maxWidth: '240px' }}
                />
                <select
                  className="form-control filter-input-vip"
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  style={{ maxWidth: '160px' }}
                >
                  <option value="all">Tất cả trạng thái</option>
                  {['Đã thanh toán', 'Chờ xác nhận', 'Đang xử lý', 'Đã hủy', 'Hoàn tiền'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(244,63,94,0.3)' }}>
                    {['Mã Đơn', 'Khách Hàng', 'Phim', 'Rạp & Suất', 'Ghế', 'Tổng Tiền', 'Phương Thức', 'Trạng Thái', 'Cập Nhật Trạng Thái', 'Thao Tác'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={tdStyle({ color: '#f3cf7a', fontWeight: 800 })}>#{order.id}</td>
                      <td style={tdStyle({ color: '#f1f5f9', fontSize: '13px' })}>
                        <strong>{order.customer_name || 'Khách Hàng'}</strong>
                        <div style={{ color: '#64748b', fontSize: '11.5px' }}>{order.customer_email}</div>
                      </td>
                      <td style={tdStyle({ color: '#f1f5f9', fontWeight: 700, maxWidth: '140px', fontSize: '13px' })}>{order.movie_title}</td>
                      <td style={tdStyle({ color: '#94a3b8', fontSize: '12.5px' })}>
                        {order.cinema_name}<br />
                        <span style={{ color: '#f3cf7a' }}>{order.show_time} ({order.show_date})</span>
                      </td>
                      <td style={tdStyle({ color: '#cbd5e1', fontSize: '13px' })}>{order.seats?.join(', ')}</td>
                      <td style={tdStyle({ color: '#10b981', fontWeight: 800 })}>{(order.total || 0).toLocaleString('vi-VN')} đ</td>
                      <td style={tdStyle({ color: '#94a3b8', fontSize: '12px' })}>{order.payment_method}</td>
                      <td style={tdStyle()}>
                        <span style={{ color: statusColors[order.status] || '#94a3b8', fontWeight: 800, fontSize: '12.5px', background: (statusColors[order.status] || '#94a3b8') + '22', padding: '3px 8px', borderRadius: '6px' }}>
                          ● {order.status}
                        </span>
                      </td>
                      <td style={tdStyle()}>
                        <select
                          className="form-control filter-input-vip"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{ fontSize: '12px', padding: '4px 8px', minWidth: '130px' }}
                        >
                          {['Đã thanh toán', 'Chờ xác nhận', 'Đang xử lý', 'Đã hủy', 'Hoàn tiền'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={tdStyle({ whiteSpace: 'nowrap' })}>
                        <button
                          type="button"
                          onClick={() => { setViewingOrder(order); setShowOrderDetailModal(true); }}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', marginRight: '8px' }}
                          title="Xem chi tiết đơn"
                        >
                          <i className="fas fa-eye" />
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (window.confirm(`Xác nhận xóa đơn #${order.id}?`)) deleteOrder(order.id); }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          title="Xóa đơn"
                        >
                          <i className="fas fa-trash-alt" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>Không tìm thấy đơn hàng nào phù hợp.</p>
              )}
            </div>
          </div>
        )}

        {/* ========== TAB 5: KIỂM TRA GIAO DỊCH (TRANSACTIONS) ========== */}
        {activeTab === 'transactions' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: 0 }}>
                <i className="fas fa-search-dollar mr-2" style={{ color: '#f43f5e' }} />
                Kiểm Tra &amp; Đối Soát Giao Dịch Chuyển Khoản / QR Code
              </h3>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                Tổng số giao dịch: <strong>{orders.length}</strong>
              </div>
            </div>

            {/* Quick Banner: Current Admin QR Info */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(18, 20, 32, 0.95))',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}>
                  <img
                    src={adminPaymentSettings?.qrImageUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CINETICKET_ADMIN'}
                    alt="Mã QR Admin"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                    onError={(e) => { e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CINETICKET_ADMIN'; }}
                  />
                </div>
                <div>
                  <div style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    <i className="fas fa-qrcode mr-1"></i> Mã QR Nhận Tiền Hiện Tại Của Admin
                  </div>
                  <div style={{ color: '#fff', fontSize: '14.5px', fontWeight: 700, marginTop: '2px' }}>
                    {adminPaymentSettings?.bankName || 'MB Bank'} • STK: <span style={{ color: '#38bdf8' }}>{adminPaymentSettings?.accountNumber}</span> • Chủ TK: {adminPaymentSettings?.accountHolder}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                    Mã QR này đang được hiển thị trực tiếp cho người dùng quét khi thanh toán vé.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('payment_qr')}
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #fb923c)',
                  color: '#fff',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fas fa-cog"></i> Cài Đặt Mã QR Admin
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map(order => (
                <div key={order.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${order.status === 'Chờ xác nhận' ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#f3cf7a', fontWeight: 800, fontSize: '16px' }}>Mã Đơn #{order.id}</span>
                        <span style={{
                          color: statusColors[order.status] || '#10b981',
                          background: (statusColors[order.status] || '#10b981') + '22',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 800
                        }}>
                          ● {order.status}
                        </span>
                      </div>
                      <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '15px', marginTop: '4px' }}>
                        {order.movie_title}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '2px' }}>
                        Khách: <strong>{order.customer_name || 'Khách Hàng'}</strong> ({order.customer_email || 'Chưa cung cấp'}) • SĐT: {order.customer_phone || '0909123456'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontWeight: 900, fontSize: '20px' }}>
                        {(order.total || 0).toLocaleString('vi-VN')} đ
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '12.5px' }}>{order.payment_method}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{order.created_at}</div>
                    </div>
                  </div>

                  {/* Payment proof image and Action buttons */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    background: 'rgba(9, 10, 15, 0.5)',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ position: 'relative' }}>
                        {order.payment_proof ? (
                          <img
                            src={order.payment_proof}
                            alt="Bill"
                            onClick={() => { setActiveProofImage(order.payment_proof); setShowProofModal(true); }}
                            style={{ width: '90px', height: '65px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #10b981', cursor: 'zoom-in' }}
                            title="Bấm để xem phóng to biên lai"
                          />
                        ) : (
                          <div style={{ width: '90px', height: '65px', background: 'rgba(244,63,94,0.08)', border: '1px dashed rgba(244,63,94,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '20px' }}>
                            <i className="fas fa-file-invoice" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '13.5px' }}>
                          {order.payment_proof ? '✓ Đã có ảnh biên lai chuyển khoản' : '◌ Chưa đính kèm ảnh biên lai'}
                        </div>
                        {order.payment_proof && (
                          <button
                            type="button"
                            onClick={() => { setActiveProofImage(order.payment_proof); setShowProofModal(true); }}
                            style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                          >
                            <i className="fas fa-search-plus mr-1"></i> Xem phóng to biên lai giao dịch
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Transaction Approval Buttons */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'Đã thanh toán')}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-check-circle mr-1"></i> Phê Duyệt Thanh Toán
                      </button>

                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'Đã hủy')}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#ef4444',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-times mr-1"></i> Từ Chối Giao Dịch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== TAB 6: QUẢN LÝ NGƯỜI DÙNG ========== */}
        {activeTab === 'users' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: 0 }}>
                👥 Quản Lý Người Dùng &amp; Phân Quyền
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13.5px' }}
              >
                <i className="fas fa-user-plus mr-1" /> Thêm Thành Viên Mới
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(244,63,94,0.3)' }}>
                    {['#', 'Họ Tên', 'Tên Đăng Nhập', 'Email', 'Vai Trò', 'Đơn Hàng', 'Thao Tác'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u, i) => {
                    const userOrders = orders.filter(o => o.user_id === u.id || o.username === u.username || o.customer_email === u.email);
                    return (
                      <tr key={u.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={tdStyle({ color: '#64748b' })}>{i + 1}</td>
                        <td style={tdStyle({ color: '#f1f5f9', fontWeight: 700 })}>{u.fullname || u.username}</td>
                        <td style={tdStyle({ color: '#f3cf7a', fontWeight: 700 })}>{u.username}</td>
                        <td style={tdStyle({ color: '#94a3b8' })}>{u.email}</td>
                        <td style={tdStyle()}>
                          <span style={{
                            background: u.role === 'admin' ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : 'rgba(99,102,241,0.2)',
                            color: u.role === 'admin' ? '#fff' : '#818cf8',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                          }}>
                            {u.role === 'admin' ? '⚡ ADMIN' : '★ MEMBER'}
                          </span>
                        </td>
                        <td style={tdStyle({ color: '#10b981', fontWeight: 700 })}>{userOrders.length} đơn</td>
                        <td style={tdStyle({ whiteSpace: 'nowrap' })}>
                          <button
                            type="button"
                            onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'member' : 'admin')}
                            style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#f3cf7a', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', marginRight: '8px' }}
                            title="Thay đổi quyền"
                          >
                            Đổi Quyền
                          </button>
                          {u.username !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => { if (window.confirm(`Xóa tài khoản "${u.username}"?`)) deleteUser(u.id); }}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '15px' }}
                              title="Xóa người dùng"
                            >
                              <i className="fas fa-trash-alt" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== TAB 7: QUẢN LÝ BÌNH LUẬN & ĐÁNH GIÁ ========== */}
        {activeTab === 'reviews' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: 0 }}>
                <i className="fas fa-comments mr-2" style={{ color: '#f43f5e' }} />
                Quản Lý Đánh Giá &amp; Bình Luận Phim
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  style={{ background: reviewFilter === 'all' ? 'linear-gradient(135deg,#f43f5e,#fb923c)' : 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Tất cả ({reviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('approved')}
                  style={{ background: reviewFilter === 'approved' ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Đang hiển thị
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('pending')}
                  style={{ background: reviewFilter === 'pending' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Chờ duyệt
                </button>
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>Không có bình luận nào trong danh mục này.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredReviews.map(review => {
                  const movie = movieList.find(m => m.id === review.movie_id);
                  return (
                    <div key={review.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${review.approved ? 'rgba(255,255,255,0.07)' : 'rgba(245,158,11,0.3)'}`,
                      borderRadius: '14px',
                      padding: '16px 20px'
                    }}>
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
                          <button
                            type="button"
                            onClick={() => toggleReviewApproval(review.id)}
                            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                          >
                            {review.approved ? 'Ẩn' : 'Duyệt'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { if (window.confirm('Xóa bình luận này?')) deleteReview(review.id); }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                            title="Xóa bình luận"
                          >
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

        {/* ========== TAB 8: CÀI ĐẶT MÃ QR THANH TOÁN ADMIN ========== */}
        {activeTab === 'payment_qr' && (
          <div style={cardBg}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-qrcode" style={{ color: '#f3cf7a' }} />
                  Cài Đặt &amp; Quản Lý Mã QR Thanh Toán Admin
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: '4px 0 0 0' }}>
                  Cấu hình ảnh mã QR (Momo / VietQR / App Ngân Hàng) và thông tin tài khoản nhận tiền. Thông tin này sẽ hiển thị trực tiếp cho khách hàng khi thanh toán vé.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to="/payment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bordered-btn"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fas fa-external-link-alt" /> Xem Trang Thanh Toán
                </Link>
                <button
                  type="button"
                  onClick={handleResetPaymentSettings}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#ef4444',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fas fa-undo" /> Khôi Phục Mặc Định
                </button>
              </div>
            </div>

            <div className="row">
              {/* Form Settings Column */}
              <div className="col-lg-7 mb-4">
                <form onSubmit={handleSavePaymentSettings}>
                  {/* Mode Selector */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                    <label style={{ ...labelStyle, fontSize: '14px', marginBottom: '12px' }}>
                      <i className="fas fa-sliders-h mr-1" style={{ color: '#f3cf7a' }} /> Chế Độ Mã QR Hiển Thị:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: qrForm.qrType === 'upload' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${qrForm.qrType === 'upload' ? '#f3cf7a' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer'
                      }}>
                        <input
                          type="radio"
                          name="qrType"
                          value="upload"
                          checked={qrForm.qrType === 'upload'}
                          onChange={() => setQrForm(prev => ({ ...prev, qrType: 'upload' }))}
                        />
                        <div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>Dùng Ảnh Mã QR Tải Lên / URL</div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11.5px' }}>Khuyên dùng: Mã QR app ngân hàng/MoMo cá nhân</div>
                        </div>
                      </label>

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: qrForm.qrType === 'vietqr' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${qrForm.qrType === 'vietqr' ? '#f3cf7a' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer'
                      }}>
                        <input
                          type="radio"
                          name="qrType"
                          value="vietqr"
                          checked={qrForm.qrType === 'vietqr'}
                          onChange={() => setQrForm(prev => ({ ...prev, qrType: 'vietqr' }))}
                        />
                        <div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>Tự Động Sinh Mã VietQR</div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11.5px' }}>Tạo mã VietQR động NAPAS theo Số Tài Khoản</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* QR Image Upload Box */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                    <label style={{ ...labelStyle, fontSize: '14px', marginBottom: '6px' }}>
                      <i className="fas fa-image mr-1" style={{ color: '#f3cf7a' }} /> Ảnh Mã QR Của Admin (Tải Lên Hoặc Nhập Link)
                    </label>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '14px' }}>
                      Bạn có thể chụp ảnh mã QR nhận tiền từ App Ngân Hàng hoặc MoMo và tải lên tại đây.
                    </p>

                    {/* File Upload Area */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed rgba(212, 175, 55, 0.4)',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        background: 'rgba(212, 175, 55, 0.05)',
                        transition: 'all 0.2s'
                      }}>
                        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '28px', color: '#f3cf7a', marginBottom: '8px' }}></i>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '13.5px' }}>Nhấn để chọn ảnh mã QR từ máy tính / điện thoại</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11.5px', marginTop: '3px' }}>Hỗ trợ PNG, JPG, JPEG, WEBP, SVG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrFileUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {/* Or Direct Image URL input */}
                    <div className="mb-2">
                      <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                        Hoặc dán trực tiếp đường dẫn ảnh QR (URL):
                      </label>
                      <input
                        type="text"
                        className="form-control filter-input-vip"
                        placeholder="https://example.com/qr-code.png"
                        value={qrForm.qrImageUrl || ''}
                        onChange={(e) => setQrForm(prev => ({ ...prev, qrImageUrl: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Bank & Account Info Box */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                    <label style={{ ...labelStyle, fontSize: '14px', marginBottom: '14px' }}>
                      <i className="fas fa-university mr-1" style={{ color: '#f3cf7a' }} /> Thông Tin Tài Khoản Nhận Tiền
                    </label>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label style={labelStyle}>Chọn Nhanh Ngân Hàng</label>
                        <select
                          className="form-control filter-input-vip"
                          value={qrForm.bankCode || 'MB'}
                          onChange={(e) => {
                            const b = supportedBanks.find(x => x.code === e.target.value);
                            setQrForm(prev => ({
                              ...prev,
                              bankCode: e.target.value,
                              bankName: b ? b.name : prev.bankName
                            }));
                          }}
                        >
                          {supportedBanks.map(b => (
                            <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label style={labelStyle}>Tên Ngân Hàng / Ví Thụ Hưởng <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          type="text"
                          required
                          className="form-control filter-input-vip"
                          value={qrForm.bankName || ''}
                          onChange={(e) => setQrForm(prev => ({ ...prev, bankName: e.target.value }))}
                          placeholder="Ví dụ: MB Bank (Ngân hàng Quân Đội)"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label style={labelStyle}>Số Tài Khoản / Số Ví <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          type="text"
                          required
                          className="form-control filter-input-vip"
                          value={qrForm.accountNumber || ''}
                          onChange={(e) => setQrForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                          placeholder="Ví dụ: 098765432199"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label style={labelStyle}>Tên Chủ Tài Khoản (Người Thụ Hưởng) <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          type="text"
                          required
                          className="form-control filter-input-vip"
                          value={qrForm.accountHolder || ''}
                          onChange={(e) => setQrForm(prev => ({ ...prev, accountHolder: e.target.value.toUpperCase() }))}
                          placeholder="Ví dụ: NGUYỄN NGỌC HÀ THẢO"
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label style={labelStyle}>Chi Nhánh Ngân Hàng (Tùy chọn)</label>
                        <input
                          type="text"
                          className="form-control filter-input-vip"
                          value={qrForm.branch || ''}
                          onChange={(e) => setQrForm(prev => ({ ...prev, branch: e.target.value }))}
                          placeholder="Ví dụ: Hội sở chính TP. Hồ Chí Minh"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label style={labelStyle}>Cú Pháp Nội Dung Chuyển Khoản</label>
                        <input
                          type="text"
                          className="form-control filter-input-vip"
                          value={qrForm.transferSyntax || 'CT{orderRef}'}
                          onChange={(e) => setQrForm(prev => ({ ...prev, transferSyntax: e.target.value }))}
                          placeholder="CT{orderRef}"
                        />
                      </div>

                      <div className="col-12 mb-2">
                        <label style={labelStyle}>Ghi Chú Hướng Dẫn Cho Khách Hàng</label>
                        <textarea
                          rows={2}
                          className="form-control filter-input-vip"
                          value={qrForm.instructionNote || ''}
                          onChange={(e) => setQrForm(prev => ({ ...prev, instructionNote: e.target.value }))}
                          placeholder="Lời nhắc hướng dẫn khách thanh toán..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* MoMo Settings Box */}
                  <div style={{ background: 'rgba(216, 45, 139, 0.06)', border: '1px solid rgba(216, 45, 139, 0.25)', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
                    <label style={{ ...labelStyle, color: '#f472b6', fontSize: '14px', marginBottom: '14px' }}>
                      <i className="fas fa-wallet mr-1" /> Cài Đặt Riêng Cho Ví Điện Tử MoMo (Tùy chọn)
                    </label>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label style={{ color: '#f472b6', fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Số Điện Thoại MoMo</label>
                        <input
                          type="text"
                          className="form-control filter-input-vip"
                          value={qrForm.momoPhone || ''}
                          onChange={(e) => setQrForm(prev => ({ ...prev, momoPhone: e.target.value }))}
                          placeholder="0909123456"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label style={{ color: '#f472b6', fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tên Chủ Ví MoMo</label>
                        <input
                          type="text"
                          className="form-control filter-input-vip"
                          value={qrForm.momoHolder || ''}
                          onChange={(e) => setQrForm(prev => ({ ...prev, momoHolder: e.target.value.toUpperCase() }))}
                          placeholder="NGUYỄN NGỌC HÀ THẢO"
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>

                      <div className="col-12">
                        <label style={{ color: '#f472b6', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                          Ảnh Mã QR MoMo Riêng (Hoặc để trống sẽ dùng ảnh QR chính):
                        </label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input
                            type="file"
                            accept="image/*"
                            id="momoQrFileInput"
                            onChange={handleMomoQrFileUpload}
                            style={{ display: 'none' }}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById('momoQrFileInput')?.click()}
                            style={{ background: 'rgba(216, 45, 139, 0.2)', border: '1px solid rgba(216, 45, 139, 0.4)', color: '#f472b6', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <i className="fas fa-upload mr-1" /> Tải Lên Mã QR MoMo
                          </button>
                          {qrForm.momoQrImageUrl && (
                            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700 }}>
                              <i className="fas fa-check-circle mr-1" /> Đã có ảnh QR MoMo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                      type="submit"
                      className="boxed-btn"
                      style={{
                        background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)',
                        color: '#090a0f',
                        padding: '14px 32px',
                        borderRadius: '12px',
                        fontWeight: 900,
                        fontSize: '15px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="fas fa-save" /> Lưu Cài Đặt Mã QR
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12.5px' }}>
                      Cài đặt sẽ có hiệu lực ngay lập tức trên trang thanh toán.
                    </span>
                  </div>
                </form>
              </div>

              {/* Live Preview Column */}
              <div className="col-lg-5">
                <div style={{
                  position: 'sticky',
                  top: '90px',
                  background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.2), transparent 70%), rgba(14, 16, 25, 0.96)',
                  border: '2px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 25px rgba(212, 175, 55, 0.2)'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                      color: '#090a0f',
                      padding: '4px 14px',
                      borderRadius: '999px',
                      fontWeight: 900,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <i className="fas fa-crown" /> Xem Trước Mã QR Khách Hàng Sẽ Thấy
                    </span>
                    <h4 style={{ color: '#fff', fontSize: '17px', fontWeight: 800, marginTop: '10px', marginBottom: '2px' }}>
                      Cổng Thanh Toán Trực Tuyến
                    </h4>
                    <div style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 700 }}>
                      Mã QR Chính Thức Của Quản Trị Viên
                    </div>
                  </div>

                  {/* QR Box Visual Mockup */}
                  <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    margin: '0 auto 18px',
                    maxWidth: '260px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      color: '#090a0f',
                      fontWeight: 900,
                      fontSize: '12.5px',
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}>
                      <i className="fas fa-qrcode" style={{ color: '#d4af37' }} />
                      {qrForm.bankName || 'Ngân Hàng Thụ Hưởng'}
                    </div>

                    <img
                      src={
                        qrForm.qrType === 'vietqr'
                          ? `https://img.vietqr.io/image/${qrForm.bankCode || 'MB'}-${qrForm.accountNumber || '098765432199'}-compact2.png?amount=195000&addInfo=CT88729&accountName=${encodeURIComponent(qrForm.accountHolder || '')}`
                          : (qrForm.qrImageUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=CINETICKET_ADMIN')
                      }
                      alt="Xem trước QR"
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=CINETICKET_${qrForm.bankCode}_${qrForm.accountNumber}`;
                      }}
                    />

                    <div style={{ color: '#090a0f', fontWeight: 800, fontSize: '12px', marginTop: '8px' }}>
                      {qrForm.accountHolder || 'CHỦ TÀI KHOẢN'}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>
                      STK: {qrForm.accountNumber || 'Chưa thiết lập'}
                    </div>
                  </div>

                  {/* Account Information Mockup */}
                  <div style={{ background: 'rgba(9, 10, 15, 0.75)', borderRadius: '12px', padding: '14px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Ngân hàng:</span>
                      <strong style={{ color: '#fff' }}>{qrForm.bankName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Số tài khoản:</span>
                      <strong style={{ color: '#38bdf8' }}>{qrForm.accountNumber}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Chủ tài khoản:</span>
                      <strong style={{ color: '#f3cf7a' }}>{qrForm.accountHolder}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Số tiền mẫu:</span>
                      <strong style={{ color: '#10b981' }}>195.000 đ</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Nội dung mẫu:</span>
                      <strong style={{ color: '#f3cf7a' }}>CT88729</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '14px', color: '#10b981', fontSize: '11.5px', fontWeight: 700 }}>
                    <i className="fas fa-check-double mr-1" /> Mã QR đã sẵn sàng phục vụ khách thanh toán
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========== MODAL: ADD MOVIE ========== */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'rgba(14,15,22,0.98)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '24px', maxWidth: '750px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button type="button" onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%' }}>
              ×
            </button>
            <h3 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>
              <i className="fas fa-film mr-2" style={{ color: '#f43f5e' }} />Thêm Phim Mới &amp; Upload Poster
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
                  <input type="text" className="form-control filter-input-vip" value={newFormat} onChange={(e) => setNewFormat(e.target.value)} placeholder="2D, 3D IMAX, Atmos..." />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Đạo Diễn</label>
                  <input type="text" className="form-control filter-input-vip" value={newDirector} onChange={(e) => setNewDirector(e.target.value)} placeholder="Tên đạo diễn..." />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Diễn Viên</label>
                  <input type="text" className="form-control filter-input-vip" value={newCast} onChange={(e) => setNewCast(e.target.value)} placeholder="Tên các diễn viên..." />
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Trailer URL (YouTube Embed Link)</label>
                <input type="url" className="form-control filter-input-vip" value={newTrailerUrl} onChange={(e) => setNewTrailerUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
              </div>

              {/* Poster Upload Field */}
              <div className="mb-3" style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px', border: '1px dashed rgba(244,63,94,0.3)' }}>
                <label style={labelStyle}>
                  <i className="fas fa-image mr-1"></i> Upload Ảnh Poster Phim Hoặc Nhập URL
                </label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {newImage && (
                    <img src={newImage} alt="Preview" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f43f5e' }} onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterFileUpload}
                      className="form-control filter-input-vip"
                      style={{ marginBottom: '8px' }}
                    />
                    <input
                      type="text"
                      className="form-control filter-input-vip"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Hoặc dán URL ảnh poster..."
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Mô Tả Nội Dung Phim</label>
                <textarea rows="3" className="form-control filter-input-vip" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Tóm tắt cốt truyện phim..." style={{ height: 'auto' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
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

      {/* ========== MODAL: EDIT MOVIE ========== */}
      {showEditModal && editingMovie && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'rgba(14,15,22,0.98)', border: '1px solid rgba(243,207,122,0.3)', borderRadius: '24px', maxWidth: '750px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button type="button" onClick={() => setShowEditModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%' }}>
              ×
            </button>
            <h3 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>
              <i className="fas fa-edit mr-2" style={{ color: '#f3cf7a' }} />Chỉnh Sửa Thông Tin Phim
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
                <input type="text" className="form-control filter-input-vip" value={editingMovie.trailer_url || ''} onChange={(e) => setEditingMovie({ ...editingMovie, trailer_url: e.target.value })} />
              </div>

              {/* Poster Upload in Edit */}
              <div className="mb-3" style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px', border: '1px dashed rgba(243,207,122,0.3)' }}>
                <label style={labelStyle}><i className="fas fa-image mr-1"></i> Thay Đổi Ảnh Poster Phim</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {editingMovie.image && (
                    <img src={editingMovie.image} alt="Preview" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f3cf7a' }} onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditPosterFileUpload}
                      className="form-control filter-input-vip"
                      style={{ marginBottom: '8px' }}
                    />
                    <input
                      type="text"
                      className="form-control filter-input-vip"
                      value={editingMovie.image || ''}
                      onChange={(e) => setEditingMovie({ ...editingMovie, image: e.target.value })}
                      placeholder="Hoặc dán URL ảnh poster mới..."
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Đạo Diễn</label>
                  <input type="text" className="form-control filter-input-vip" value={editingMovie.director || ''} onChange={(e) => setEditingMovie({ ...editingMovie, director: e.target.value })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Diễn Viên</label>
                  <input type="text" className="form-control filter-input-vip" value={editingMovie.cast || ''} onChange={(e) => setEditingMovie({ ...editingMovie, cast: e.target.value })} />
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Mô Tả Phim</label>
                <textarea rows="3" className="form-control filter-input-vip" value={editingMovie.description || ''} onChange={(e) => setEditingMovie({ ...editingMovie, description: e.target.value })} style={{ height: 'auto' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#f3cf7a,#d4af37)', color: '#090a0f', padding: '13px', borderRadius: '12px', fontWeight: 900, textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
                  <i className="fas fa-save mr-2" />Lưu Thay Đổi Phim
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

      {/* ========== MODAL: ADD USER ========== */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'rgba(14,15,22,0.98)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '30px', position: 'relative' }}>
            <button type="button" onClick={() => setShowAddUserModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%' }}>
              ×
            </button>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              <i className="fas fa-user-plus mr-2" style={{ color: '#f43f5e' }} />Thêm Thành Viên Mới
            </h3>
            <form onSubmit={handleCreateUser}>
              <div className="mb-3">
                <label style={labelStyle}>Tên Đăng Nhập (Username) <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" required className="form-control filter-input-vip" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="username..." />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Họ và Tên</label>
                <input type="text" className="form-control filter-input-vip" value={newUserFullname} onChange={(e) => setNewUserFullname(e.target.value)} placeholder="Họ và tên..." />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Email</label>
                <input type="email" className="form-control filter-input-vip" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Mật Khẩu</label>
                <input type="password" className="form-control filter-input-vip" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Phân Quyền</label>
                <select className="form-control filter-input-vip" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                  <option value="member">Thành Viên (Member)</option>
                  <option value="admin">Quản Trị Viên (Admin)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '12px', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                  Xác Nhận Tạo
                </button>
                <button type="button" onClick={() => setShowAddUserModal(false)}
                  style={{ padding: '12px 20px', borderRadius: '10px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', cursor: 'pointer' }}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL: EDIT GENRE ========== */}
      {showEditGenreModal && editingGenre && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'rgba(14,15,22,0.98)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '28px', position: 'relative' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 800, marginBottom: '18px' }}>
              <i className="fas fa-edit mr-2" style={{ color: '#f43f5e' }} />Chỉnh Sửa Thể Loại
            </h3>
            <form onSubmit={handleSaveGenreEdit}>
              <div className="mb-3">
                <label style={labelStyle}>Tên Thể Loại</label>
                <input
                  type="text"
                  required
                  className="form-control filter-input-vip"
                  value={editingGenre.name}
                  onChange={(e) => setEditingGenre({ ...editingGenre, name: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '10px', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                  Lưu
                </button>
                <button type="button" onClick={() => setShowEditGenreModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', cursor: 'pointer' }}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL: ENLARGE PAYMENT PROOF BILL ========== */}
      {showProofModal && activeProofImage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', maxWidth: '550px', width: '100%', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setShowProofModal(false)}
              style={{ position: 'absolute', top: '-45px', right: '0', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '38px', height: '38px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}
            >
              ×
            </button>
            <h4 style={{ color: '#f3cf7a', marginBottom: '12px', fontWeight: 800 }}>
              <i className="fas fa-search-plus mr-1"></i> Ảnh Chứng Minh Chuyển Khoản Khách Hàng Upload
            </h4>
            <div style={{ background: '#000', padding: '10px', borderRadius: '16px', border: '2px solid rgba(212, 175, 55, 0.4)' }}>
              <img
                src={activeProofImage}
                alt="Proof Full"
                style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '10px', display: 'block' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowProofModal(false)}
              style={{ marginTop: '16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
            >
              Đóng Xem Ảnh
            </button>
          </div>
        </div>
      )}

      {/* ========== MODAL: VIEW ORDER DETAIL ========== */}
      {showOrderDetailModal && viewingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'rgba(14,15,22,0.98)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '24px', maxWidth: '600px', width: '100%', padding: '28px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button type="button" onClick={() => setShowOrderDetailModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%' }}>
              ×
            </button>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              Chi Tiết Đơn Đặt Vé #{viewingOrder.id}
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '16px', fontSize: '13.5px' }}>
              <div style={{ marginBottom: '8px' }}><strong>Phim:</strong> <span style={{ color: '#f3cf7a' }}>{viewingOrder.movie_title}</span></div>
              <div style={{ marginBottom: '8px' }}><strong>Rạp:</strong> {viewingOrder.cinema_name} ({viewingOrder.room})</div>
              <div style={{ marginBottom: '8px' }}><strong>Suất chiếu:</strong> {viewingOrder.show_time} ({viewingOrder.show_date})</div>
              <div style={{ marginBottom: '8px' }}><strong>Ghế:</strong> <span style={{ color: '#f3cf7a', fontWeight: 800 }}>{viewingOrder.seats?.join(', ')}</span></div>
              <div style={{ marginBottom: '8px' }}><strong>Khách hàng:</strong> {viewingOrder.customer_name} ({viewingOrder.customer_email})</div>
              <div style={{ marginBottom: '8px' }}><strong>Số điện thoại:</strong> {viewingOrder.customer_phone || '0909123456'}</div>
              <div style={{ marginBottom: '8px' }}><strong>Tổng tiền:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{(viewingOrder.total || 0).toLocaleString('vi-VN')} đ</span></div>
              <div><strong>Trạng thái:</strong> <span style={{ color: statusColors[viewingOrder.status] || '#10b981', fontWeight: 800 }}>{viewingOrder.status}</span></div>
            </div>

            {viewingOrder.payment_proof && (
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <img src={viewingOrder.payment_proof} alt="proof" style={{ maxHeight: '160px', borderRadius: '8px', border: '1px solid #10b981' }} />
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowOrderDetailModal(false)}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
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

export default AdminDashboard;
