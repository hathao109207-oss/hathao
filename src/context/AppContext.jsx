import React, { createContext, useContext, useState, useEffect } from 'react';
import { movies as initialMovies, showtimes, defaultUsers, genres as initialGenres, cinemas, samplePaymentProof, defaultAdminPaymentSettings } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const USERS_DATA_VERSION = 'cineticket_users_v2';

  // Users list
  const [usersList, setUsersList] = useState(() => {
    try {
      const activeUsersVersion = localStorage.getItem('cineticket_users_version');
      const saved = localStorage.getItem('cineticket_users_list');
      if (activeUsersVersion !== USERS_DATA_VERSION || !saved) {
        localStorage.setItem('cineticket_users_version', USERS_DATA_VERSION);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const merged = parsed.map(u => {
              const def = defaultUsers.find(d => String(d.id) === String(u.id) || d.username === u.username);
              if (def) {
                return { ...def, ...u, phone: u.phone || def.phone };
              }
              return u;
            });
            localStorage.setItem('cineticket_users_list', JSON.stringify(merged));
            return merged;
          } catch (e) {
            // fallback to defaultUsers
          }
        }
        localStorage.setItem('cineticket_users_list', JSON.stringify(defaultUsers));
        return defaultUsers;
      }
      return JSON.parse(saved);
    } catch (e) {
      return defaultUsers;
    }
  });

  // Quản lý phiên đăng nhập:
  // Lưu cả vào localStorage và sessionStorage để khi người dùng tắt trình duyệt / thoát ra vô lại
  // thì thông tin tài khoản và phiên đăng nhập vẫn được giữ nguyên đầy đủ.
  const [user, setUser] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('cineticket_user');
        const session = sessionStorage.getItem('cineticket_user');
        const saved = local ? JSON.parse(local) : (session ? JSON.parse(session) : null);
        return saved;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const MOVIES_DATA_VERSION = 'movies_data_price_5000_v1';

  // Movies state (supports admin add/delete/update)
  const [movieList, setMovieList] = useState(() => {
    try {
      const activeMoviesVersion = localStorage.getItem('cineticket_movies_version');
      if (activeMoviesVersion !== MOVIES_DATA_VERSION) {
        localStorage.removeItem('cineticket_movies');
        localStorage.setItem('cineticket_movies_version', MOVIES_DATA_VERSION);
        return initialMovies;
      }
      const saved = localStorage.getItem('cineticket_movies');
      return saved ? JSON.parse(saved) : initialMovies;
    } catch (e) {
      return initialMovies;
    }
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cineticket_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Active booking process (movie, showtime, seats, snacks)
  const [currentBooking, setCurrentBooking] = useState(() => {
    const saved = localStorage.getItem('cineticket_current_booking');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          seats: [] // Tắt tự động chọn sẵn ghế
        };
      } catch (e) {
        // ignore
      }
    }
    return {
      movieId: 1,
      showtimeId: 101,
      cinemaName: "CineTicket Quận 1 VIP",
      seats: [],
      snacks: []
    };
  });

  // Orders history
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cineticket_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 99120,
        movie_id: 1,
        movie_title: "Avatar 2 - Dòng Chảy Của Nước",
        movie_image: "/assets/img/products/avatar-2.jpg",
        cinema_name: "CineTicket Quận 1 VIP",
        room: "Phòng VIP 01 - Laser IMAX",
        show_date: "2026-10-13",
        show_time: "14:30",
        seats: ["D5", "D6"],
        snacks: [{ id: 1, name: "Combo Solo VIP", qty: 1, price: 85000 }],
        total: 305000,
        status: "Đã thanh toán",
        payment_method: "MB Bank VietQR",
        payment_proof: samplePaymentProof,
        customer_name: "Nguyễn Ngọc Hà Thảo",
        customer_email: "hathao@cineticket.vn",
        customer_phone: "0909123456",
        created_at: "2026-10-12 11:20:00"
      },
      {
        id: 99121,
        movie_id: 2,
        movie_title: "John Wick: Chapter 4",
        movie_image: "/assets/img/products/john-wick-4.jpg",
        cinema_name: "CineTicket Landmark 81",
        room: "Phòng VIP Gold Class",
        show_date: "2026-10-13",
        show_time: "19:15",
        seats: ["F4", "F5"],
        snacks: [{ id: 2, name: "Combo Couple Sweet", qty: 1, price: 135000 }],
        total: 345000,
        status: "Chờ xác nhận",
        payment_method: "Vietcombank QR",
        payment_proof: samplePaymentProof,
        customer_name: "Minh Khoa",
        customer_email: "khoa@cineticket.vn",
        customer_phone: "0912345678",
        created_at: "2026-10-13 08:00:00"
      }
    ];
  });

  // Reviews state
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('cineticket_reviews');
    return saved ? JSON.parse(saved) : [
      { id: 1, movie_id: 1, user: 'Nguyễn Hà Thảo', rating: 9, comment: 'Phim tuyệt vời! Hình ảnh 3D IMAX cực kỳ ấn tượng, xứng đáng xem ở rạp.', created_at: '2026-10-10 20:15', approved: true },
      { id: 2, movie_id: 1, user: 'Minh Khoa', rating: 8, comment: 'Cốt truyện hay, nhạc phim hay. Xem lần 2 vẫn thích!', created_at: '2026-10-11 18:30', approved: true },
      { id: 3, movie_id: 2, user: 'Lan Anh', rating: 10, comment: 'John Wick 4 là đỉnh của series! Cảnh hành động mãn nhãn.', created_at: '2026-10-09 22:10', approved: true },
    ];
  });

  // Genres management
  const [genreList, setGenreList] = useState(() => {
    const saved = localStorage.getItem('cineticket_genres');
    return saved ? JSON.parse(saved) : initialGenres;
  });

  // Admin Payment & QR Code Settings
  const [adminPaymentSettings, setAdminPaymentSettings] = useState(() => {
    const saved = localStorage.getItem('cineticket_admin_payment');
    return saved ? JSON.parse(saved) : defaultAdminPaymentSettings;
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('cineticket_users_list', JSON.stringify(usersList));
      if (user) {
        const fresh = usersList.find(u => (u.id && user.id && String(u.id) === String(user.id)) || u.username === user.username || u.email === user.email);
        if (fresh && (fresh.fullname !== user.fullname || fresh.username !== user.username || fresh.email !== user.email || fresh.phone !== user.phone || fresh.password !== user.password)) {
          setUser(fresh);
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [usersList]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem('cineticket_user', JSON.stringify(user));
          sessionStorage.setItem('cineticket_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('cineticket_user');
          sessionStorage.removeItem('cineticket_user');
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cineticket_movies', JSON.stringify(movieList));
  }, [movieList]);

  useEffect(() => {
    localStorage.setItem('cineticket_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cineticket_current_booking', JSON.stringify(currentBooking));
  }, [currentBooking]);

  useEffect(() => {
    localStorage.setItem('cineticket_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cineticket_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cineticket_genres', JSON.stringify(genreList));
  }, [genreList]);

  useEffect(() => {
    localStorage.setItem('cineticket_admin_payment', JSON.stringify(adminPaymentSettings));
  }, [adminPaymentSettings]);

  const addToast = (msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (movie, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === movie.id);
      if (existing) {
        return prev.map(item =>
          item.id === movie.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...movie, qty }];
    });
    addToast(`Đã thêm "${movie.title}" vào giỏ vé!`, 'success');
  };

  const updateCartQty = (movieId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(movieId);
      return;
    }
    setCart(prev => prev.map(item => item.id === movieId ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (movieId) => {
    setCart(prev => prev.filter(item => item.id !== movieId));
    addToast('Đã xóa vé khỏi giỏ hàng.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Booking step helpers
  const updateBooking = (updates) => {
    setCurrentBooking(prev => ({ ...prev, ...updates }));
  };

  const placeOrder = (paymentData) => {
    const movie = movieList.find(m => m.id === currentBooking.movieId) || movieList[0];
    const showtime = showtimes.find(s => s.id === currentBooking.showtimeId) || showtimes[0];
    
    const seatPrice = movie.price || 100000;
    const seatTotal = (currentBooking.seats.length || 1) * seatPrice;
    const snackTotal = (currentBooking.snacks || []).reduce((sum, s) => sum + (s.price * s.qty), 0);
    const subTotal = seatTotal + snackTotal;
    const discountVal = paymentData?.discount || 0;
    const finalTotal = Math.max(0, (paymentData?.finalTotal !== undefined ? paymentData.finalTotal : subTotal - discountVal));

    const newOrder = {
      id: Math.floor(10000 + Math.random() * 90000),
      movie_id: movie.id,
      movie_title: movie.title,
      movie_image: movie.image,
      cinema_name: currentBooking.cinemaName || showtime.cinema_name,
      room: showtime.room,
      show_date: showtime.show_date,
      show_time: showtime.show_time,
      seats: currentBooking.seats && currentBooking.seats.length ? currentBooking.seats : [],
      snacks: currentBooking.snacks || [],
      subtotal: subTotal,
      discount: discountVal,
      total: finalTotal,
      status: paymentData?.status || (paymentData?.payment_proof ? "Chờ xác nhận" : "Đã thanh toán"),
      payment_method: paymentData?.methodName || "Ngân hàng QR Code",
      payment_proof: paymentData?.payment_proof || null,
      customer_name: paymentData?.customer_name || user?.fullname || user?.username || "Khách Hàng VIP",
      customer_email: paymentData?.customer_email || user?.email || "khachhang@cineticket.vn",
      customer_phone: paymentData?.customer_phone || "0909123456",
      created_at: new Date().toLocaleString('vi-VN')
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    addToast('Đặt vé thành công! Mã vé VIP của bạn: #' + newOrder.id, 'success');
    return newOrder;
  };

  // Movie Management (Admin)
  const addMovie = (newMovie) => {
    const movieWithId = {
      ...newMovie,
      id: Date.now(),
      image: newMovie.image || '/assets/img/products/product-img-1.jpg',
      rating: Number(newMovie.rating) || 8.0,
      format: newMovie.format || '2D Digital'
    };
    setMovieList(prev => [movieWithId, ...prev]);
    addToast(`Đã thêm phim "${movieWithId.title}" vào rạp!`, 'success');
    return movieWithId;
  };

  const deleteMovie = (id) => {
    setMovieList(prev => prev.filter(m => m.id !== id));
    addToast('Đã xóa phim khỏi danh sách rạp.', 'info');
  };

  const updateMovie = (id, updatedFields) => {
    setMovieList(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
    addToast('Đã cập nhật thông tin phim!', 'success');
  };

  // Order Operations
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addToast(`Đã cập nhật trạng thái đơn #${orderId}: ${newStatus}!`, 'success');
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    addToast(`Đã xóa đơn hàng #${orderId}.`, 'info');
  };

  // Reviews Management
  const addReview = (movieId, rating, comment) => {
    const reviewerName = user ? (user.fullname || user.username) : 'Khán Giả Ẩn Danh';
    const newReview = {
      id: Date.now(),
      movie_id: movieId,
      user: reviewerName,
      rating: Number(rating),
      comment,
      created_at: new Date().toLocaleString('vi-VN'),
      approved: true
    };
    setReviews(prev => [newReview, ...prev]);
    addToast('Đã gửi đánh giá phim thành công!', 'success');
    return newReview;
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    addToast('Đã xóa bình luận.', 'info');
  };

  const toggleReviewApproval = (reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: !r.approved } : r));
    addToast('Đã cập nhật trạng thái hiển thị bình luận!', 'info');
  };

  // Genre Management (Admin)
  const addGenre = (name) => {
    const newGenre = { id: Date.now(), name: name.trim() };
    setGenreList(prev => [...prev, newGenre]);
    addToast(`Đã thêm thể loại "${name}"!`, 'success');
  };

  const updateGenre = (id, newName) => {
    setGenreList(prev => prev.map(g => g.id === id ? { ...g, name: newName.trim() } : g));
    addToast('Đã cập nhật tên thể loại!', 'success');
  };

  const deleteGenre = (id) => {
    setGenreList(prev => prev.filter(g => g.id !== id));
    addToast('Đã xóa thể loại.', 'info');
  };

  // User Management
  const updateUserProfile = (userId, profileData) => {
    const cleanData = {
      fullname: (profileData.fullname ?? '').trim(),
      username: (profileData.username ?? '').trim(),
      email: (profileData.email ?? '').trim(),
      phone: (profileData.phone ?? '').trim()
    };

    const updatedList = usersList.map(u => {
      const isTarget = (userId && String(u.id) === String(userId)) ||
                       (user && String(u.id) === String(user.id)) ||
                       (user && u.username?.toLowerCase() === user.username?.toLowerCase()) ||
                       (user && u.email?.toLowerCase() === user.email?.toLowerCase());
      if (isTarget) {
        return { ...u, ...cleanData };
      }
      return u;
    });

    setUsersList(updatedList);
    try {
      localStorage.setItem('cineticket_users_list', JSON.stringify(updatedList));
    } catch (e) {}

    if (user) {
      const updatedUser = { ...user, ...cleanData };
      setUser(updatedUser);
      try {
        localStorage.setItem('cineticket_user', JSON.stringify(updatedUser));
        sessionStorage.setItem('cineticket_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }
    addToast('Đã cập nhật thông tin tài khoản thành công!', 'success');
  };

  const updateUserPassword = (emailOrUsername, newPassword) => {
    const q = (emailOrUsername || '').trim().toLowerCase();
    const updatedList = usersList.map(u => {
      const isMatch = (u.email?.toLowerCase() === q || u.username?.toLowerCase() === q) ||
                      (user && String(u.id) === String(user.id));
      if (isMatch) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    setUsersList(updatedList);
    try {
      localStorage.setItem('cineticket_users_list', JSON.stringify(updatedList));
    } catch (e) {}

    if (user) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      try {
        localStorage.setItem('cineticket_user', JSON.stringify(updatedUser));
        sessionStorage.setItem('cineticket_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }
    addToast('Đặt lại mật khẩu thành công!', 'success');
    return true;
  };

  const addUser = (userData) => {
    const newUser = {
      id: Date.now(),
      username: userData.username.trim(),
      password: userData.password || '123456',
      fullname: userData.fullname || userData.username,
      email: userData.email || `${userData.username.trim()}@cineticket.vn`,
      phone: userData.phone || '',
      role: userData.role || 'member'
    };
    const updated = [...usersList, newUser];
    setUsersList(updated);
    try {
      localStorage.setItem('cineticket_users_list', JSON.stringify(updated));
    } catch (e) {}
    addToast(`Đã tạo tài khoản thành viên "${newUser.username}"!`, 'success');
    return newUser;
  };

  const deleteUser = (userId) => {
    if (user && String(user.id) === String(userId)) {
      addToast('Không thể xóa tài khoản đang đăng nhập!', 'error');
      return;
    }
    const updated = usersList.filter(u => String(u.id) !== String(userId));
    setUsersList(updated);
    try {
      localStorage.setItem('cineticket_users_list', JSON.stringify(updated));
    } catch (e) {}
    addToast('Đã xóa người dùng khỏi hệ thống.', 'info');
  };

  const updateUserRole = (userId, newRole) => {
    const updated = usersList.map(u => String(u.id) === String(userId) ? { ...u, role: newRole } : u);
    setUsersList(updated);
    try {
      localStorage.setItem('cineticket_users_list', JSON.stringify(updated));
    } catch (e) {}
    if (user && String(user.id) === String(userId)) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      try {
        localStorage.setItem('cineticket_user', JSON.stringify(updatedUser));
        sessionStorage.setItem('cineticket_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }
    addToast(`Đã thay đổi quyền thành ${newRole === 'admin' ? 'Quản Trị Viên' : 'Thành Viên'}!`, 'success');
  };

  // Admin Payment Settings
  const updateAdminPaymentSettings = (newSettings) => {
    setAdminPaymentSettings(prev => ({ ...prev, ...newSettings }));
    addToast('Đã lưu cấu hình mã QR thanh toán của Admin thành công!', 'success');
  };

  const resetAdminPaymentSettings = () => {
    setAdminPaymentSettings(defaultAdminPaymentSettings);
    addToast('Đã khôi phục cấu hình mã QR Admin về mặc định!', 'info');
  };

  // Auth operations
  const loginUser = (username, password) => {
    const q = (username || '').trim().toLowerCase();
    
    // Find matching user
    let found = usersList.find(
      u => u.username?.toLowerCase() === q || u.email?.toLowerCase() === q
    );

    // If quick login with 'hathao' but user had changed their username
    if (!found && q === 'hathao') {
      found = usersList.find(u => String(u.id) === '2' || u.role === 'member');
    }
    // If quick login with 'admin' but user had changed their username
    if (!found && (q === 'admin' || q.includes('admin'))) {
      found = usersList.find(u => String(u.id) === '1' || u.role === 'admin');
    }

    if (found) {
      if (found.password === password) {
        setUser(found);
        try {
          localStorage.setItem('cineticket_user', JSON.stringify(found));
          sessionStorage.setItem('cineticket_user', JSON.stringify(found));
        } catch (e) {}
        addToast(`Xin chào ${found.fullname || found.username} (${found.role === 'admin' ? 'Quản Trị Viên' : 'Thành Viên VIP'})!`, 'success');
        return { success: true, user: found };
      } else {
        addToast('Mật khẩu không chính xác!', 'error');
        return { success: false, error: 'Mật khẩu không đúng' };
      }
    } else {
      // Dynamic login for any user
      const isAd = q === 'admin' || q.includes('admin');
      const newUser = {
        id: Date.now(),
        username: username.trim(),
        fullname: username.trim(),
        email: `${username.trim().toLowerCase()}@cineticket.vn`,
        phone: '',
        password: password || '123456',
        role: isAd ? 'admin' : 'member'
      };
      const updatedList = [...usersList, newUser];
      setUsersList(updatedList);
      setUser(newUser);
      try {
        localStorage.setItem('cineticket_users_list', JSON.stringify(updatedList));
        localStorage.setItem('cineticket_user', JSON.stringify(newUser));
        sessionStorage.setItem('cineticket_user', JSON.stringify(newUser));
      } catch (e) {}
      addToast(`Đăng nhập thành công! Chào mừng ${newUser.username}.`, 'success');
      return { success: true, user: newUser };
    }
  };

  const registerUser = (userData) => {
    const isAd = userData.username.toLowerCase() === 'admin';
    const newUser = {
      id: Date.now(),
      username: userData.username,
      password: userData.password,
      fullname: userData.fullname || userData.username,
      email: userData.email,
      role: isAd ? 'admin' : 'member'
    };
    setUsersList(prev => [...prev, newUser]);
    setUser(newUser);
    addToast('Đăng ký tài khoản VIP thành công!', 'success');
    return newUser;
  };

  const logoutUser = () => {
    setUser(null);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('cineticket_user');
        localStorage.removeItem('cineticket_user');
      }
    } catch (e) {
      // ignore
    }
    addToast('Bạn đã đăng xuất tài khoản.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        usersList,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        updateUserPassword,
        addUser,
        deleteUser,
        updateUserRole,
        movieList,
        addMovie,
        deleteMovie,
        updateMovie,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        currentBooking,
        updateBooking,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        reviews,
        addReview,
        deleteReview,
        toggleReviewApproval,
        genreList,
        addGenre,
        updateGenre,
        deleteGenre,
        cinemas,
        toasts,
        addToast,
        removeToast,
        adminPaymentSettings,
        updateAdminPaymentSettings,
        resetAdminPaymentSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
