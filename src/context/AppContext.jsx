import React, { createContext, useContext, useState, useEffect } from 'react';
import { movies as initialMovies, showtimes, defaultUsers, genres as initialGenres, cinemas, samplePaymentProof, defaultAdminPaymentSettings } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Users list
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('cineticket_users_list');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  // Quản lý phiên đăng nhập:
  // Mặc định luôn là null (khách vãng lai, chưa đăng nhập bất kỳ tài khoản nào).
  // Sử dụng sessionStorage để duy trì phiên làm việc trong tab hiện tại khi người dùng chủ động đăng nhập.
  // Đồng thời dọn dẹp 'cineticket_user' trong localStorage cũ nếu còn sót lại từ các lần test trước.
  const [user, setUser] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('cineticket_user');
      }
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const saved = sessionStorage.getItem('cineticket_user');
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Movies state (supports admin add/delete/update)
  const [movieList, setMovieList] = useState(() => {
    const saved = localStorage.getItem('cineticket_movies');
    return saved ? JSON.parse(saved) : initialMovies;
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
    localStorage.setItem('cineticket_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('cineticket_user');
      }
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (user) {
          sessionStorage.setItem('cineticket_user', JSON.stringify(user));
        } else {
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
    setUsersList(prev => prev.map(u => (u.id === userId || u.username === profileData.username) ? { ...u, ...profileData } : u));
    if (user && (user.id === userId || user.username === profileData.username)) {
      setUser(prev => ({ ...prev, ...profileData }));
    }
    addToast('Đã cập nhật thông tin tài khoản thành công!', 'success');
  };

  const updateUserPassword = (emailOrUsername, newPassword) => {
    const q = emailOrUsername.trim().toLowerCase();
    setUsersList(prev => prev.map(u => {
      if (u.email?.toLowerCase() === q || u.username?.toLowerCase() === q) {
        return { ...u, password: newPassword };
      }
      return u;
    }));
    if (user && (user.email?.toLowerCase() === q || user.username?.toLowerCase() === q)) {
      setUser(prev => ({ ...prev, password: newPassword }));
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
      role: userData.role || 'member'
    };
    setUsersList(prev => [...prev, newUser]);
    addToast(`Đã tạo tài khoản thành viên "${newUser.username}"!`, 'success');
    return newUser;
  };

  const deleteUser = (userId) => {
    if (user && user.id === userId) {
      addToast('Không thể xóa tài khoản đang đăng nhập!', 'error');
      return;
    }
    setUsersList(prev => prev.filter(u => u.id !== userId));
    addToast('Đã xóa người dùng khỏi hệ thống.', 'info');
  };

  const updateUserRole = (userId, newRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, role: newRole }));
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
    const q = username.trim().toLowerCase();
    const found = usersList.find(
      u => u.username.toLowerCase() === q || u.email.toLowerCase() === q
    );

    if (found) {
      if (found.password === password) {
        setUser(found);
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
        password: password || '123456',
        role: isAd ? 'admin' : 'member'
      };
      setUsersList(prev => [...prev, newUser]);
      setUser(newUser);
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
