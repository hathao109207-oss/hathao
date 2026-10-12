import React, { createContext, useContext, useState, useEffect } from 'react';
import { movies as initialMovies, showtimes, snacks, defaultUsers, genres as initialGenres } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Users list
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('cineticket_users_list');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cineticket_user');
    return saved ? JSON.parse(saved) : null;
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
    return saved ? JSON.parse(saved) : {
      movieId: 1,
      showtimeId: 101,
      seats: ['D5', 'D6'],
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
        cinema_name: "CineTicket Quận 1 VIP",
        room: "Phòng VIP 01 - Laser IMAX",
        show_date: "2026-10-12",
        show_time: "14:30",
        seats: ["D5", "D6"],
        snacks: [{ id: 1, name: "Combo Solo VIP", qty: 1, price: 85000 }],
        total: 305000,
        status: "Đã thanh toán",
        payment_method: "MB Bank QR Code",
        created_at: "2026-10-12 11:20:00"
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

  // Toasts
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('cineticket_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cineticket_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cineticket_user');
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
    const snackTotal = currentBooking.snacks.reduce((sum, s) => sum + (s.price * s.qty), 0);
    const finalTotal = seatTotal + snackTotal;

    const newOrder = {
      id: Math.floor(10000 + Math.random() * 90000),
      movie_id: movie.id,
      movie_title: movie.title,
      cinema_name: showtime.cinema_name,
      room: showtime.room,
      show_date: showtime.show_date,
      show_time: showtime.show_time,
      seats: currentBooking.seats.length ? currentBooking.seats : ['E5'],
      snacks: currentBooking.snacks || [],
      total: finalTotal,
      status: "Đã thanh toán",
      payment_method: paymentData?.methodName || "Ngân hàng QR Code",
      created_at: new Date().toLocaleString('vi-VN')
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    addToast('Thanh toán thành công! Vé VIP của bạn đã được khởi tạo.', 'success');
    return newOrder;
  };

  // Movie Management (Admin)
  const addMovie = (newMovie) => {
    const movieWithId = {
      ...newMovie,
      id: Date.now(),
      image: newMovie.image || '/assets/img/products/product-img-1.jpg',
      rating: newMovie.rating || 8.0,
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

  // Update Order Status (Admin)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addToast(`Đã cập nhật trạng thái đơn #${orderId}!`, 'success');
  };

  // Reviews Management
  const addReview = (movieId, rating, comment) => {
    if (!user) {
      addToast('Vui lòng đăng nhập để bình luận!', 'error');
      return;
    }
    const newReview = {
      id: Date.now(),
      movie_id: movieId,
      user: user.fullname || user.username,
      rating,
      comment,
      created_at: new Date().toLocaleString('vi-VN'),
      approved: true
    };
    setReviews(prev => [newReview, ...prev]);
    addToast('Đã gửi đánh giá phim thành công!', 'success');
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    addToast('Đã xóa bình luận.', 'info');
  };

  const toggleReviewApproval = (reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: !r.approved } : r));
  };

  // Genre Management (Admin)
  const addGenre = (name) => {
    const newGenre = { id: Date.now(), name: name.trim() };
    setGenreList(prev => [...prev, newGenre]);
    addToast(`Đã thêm thể loại "${name}"!`, 'success');
  };

  const deleteGenre = (id) => {
    setGenreList(prev => prev.filter(g => g.id !== id));
    addToast('Đã xóa thể loại.', 'info');
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
        reviews,
        addReview,
        deleteReview,
        toggleReviewApproval,
        genreList,
        addGenre,
        deleteGenre,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
