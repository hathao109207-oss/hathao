import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { showtimes, cinemas } from '../data/mockData';
import { useApp } from '../context/AppContext';

const SeatSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { movieList, currentBooking, updateBooking, addToast } = useApp();

  const movieId = Number(searchParams.get('movieId')) || currentBooking.movieId || 1;
  const initialShowtimeId = Number(searchParams.get('showtimeId')) || currentBooking.showtimeId || 101;

  const movie = movieList.find(m => m.id === movieId) || movieList[0];
  const allMovieShowtimes = showtimes.filter(s => s.movie_id === movie.id);
  const currentSt = allMovieShowtimes.find(s => s.id === initialShowtimeId) || allMovieShowtimes[0] || showtimes[0];

  const [selectedCinemaName, setSelectedCinemaName] = useState(
    currentBooking.cinemaName || currentSt?.cinema_name || cinemas[0].name
  );
  const [selectedDate, setSelectedDate] = useState(currentSt?.show_date || '2026-10-13');
  const [activeShowtimeId, setActiveShowtimeId] = useState(currentSt?.id || 101);

  // Available showtimes matching chosen cinema
  const availableShowtimes = useMemo(() => {
    const list = allMovieShowtimes.filter(s => s.cinema_name === selectedCinemaName);
    return list.length > 0 ? list : allMovieShowtimes;
  }, [allMovieShowtimes, selectedCinemaName]);

  const activeShowtime = useMemo(() => {
    return availableShowtimes.find(s => s.id === activeShowtimeId) || availableShowtimes[0] || currentSt;
  }, [availableShowtimes, activeShowtimeId, currentSt]);

  const [selectedSeats, setSelectedSeats] = useState([]);

  // Seat grid structure: Rows A to G, cols 1 to 10
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  // Simulated reserved seats
  const reservedSeats = useMemo(() => ['A3', 'A4', 'B5', 'B6', 'C7', 'D2', 'F4', 'F5', 'G7'], []);

  const getSeatType = (row) => {
    if (row === 'G') return 'couple';
    if (['D', 'E', 'F'].includes(row)) return 'vip';
    return 'standard';
  };

  const getSeatPrice = (code) => {
    const row = code.charAt(0);
    const base = movie.price || 100000;
    if (row === 'G') return base + 50000; // Couple seat
    if (['D', 'E', 'F'].includes(row)) return base + 20000; // VIP seat
    return base;
  };

  const toggleSeat = (code) => {
    if (reservedSeats.includes(code)) {
      addToast(`Ghế ${code} đã có khán giả đặt, vui lòng chọn ghế khác!`, 'error');
      return;
    }
    setSelectedSeats(prev => {
      if (prev.includes(code)) {
        return prev.filter(s => s !== code);
      } else {
        if (prev.length >= 8) {
          addToast('Bạn chỉ được chọn tối đa 8 ghế trong một lần đặt vé!', 'info');
          return prev;
        }
        return [...prev, code];
      }
    });
  };

  const totalSeatsPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
  }, [selectedSeats, movie]);

  const handleProceedToSnack = () => {
    if (selectedSeats.length === 0) {
      addToast('Vui lòng chọn ít nhất 1 ghế để tiếp tục!', 'error');
      return;
    }
    updateBooking({
      movieId: movie.id,
      showtimeId: activeShowtime.id,
      cinemaName: selectedCinemaName,
      seats: selectedSeats
    });
    navigate('/snack');
  };

  return (
    <div className="seat-selection-page">
      {/* Header Breadcrumb */}
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Bước 1: Chọn Rạp, Suất Chiếu &amp; Ghế Ngồi
          </p>
          <h1 className="catalog-title">CHỌN SUẤT CHIẾU &amp; GHẾ VIP</h1>
        </div>
      </div>

      <div className="container mt-4 mb-5">
        {/* Booking Steps Progress Bar */}
        <div className="seat-steps mb-5">
          <div className="seat-step active">
            <div className="seat-step-icon"><i className="fas fa-couch"></i></div>
            <div className="seat-step-text">1. Chọn rạp &amp; ghế</div>
          </div>
          <div className="seat-step">
            <div className="seat-step-icon"><i className="fas fa-shopping-basket"></i></div>
            <div className="seat-step-text">2. Bắp nước</div>
          </div>
          <div className="seat-step">
            <div className="seat-step-icon"><i className="far fa-credit-card"></i></div>
            <div className="seat-step-text">3. Thanh toán</div>
          </div>
          <div className="seat-step">
            <div className="seat-step-icon"><i className="fas fa-ticket-alt"></i></div>
            <div className="seat-step-text">4. Vé điện tử</div>
          </div>
        </div>

        {/* 1. Cinema, Date & Showtime Selector Panel */}
        <div style={{
          background: 'rgba(18, 20, 29, 0.92)',
          border: '1px solid rgba(212, 175, 55, 0.28)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
        }}>
          <div className="row align-items-center">
            {/* Movie Info */}
            <div className="col-lg-4 col-md-12 mb-3 mb-lg-0">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                  onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }}
                />
                <div>
                  <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>{movie.title}</h3>
                  <div style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 700 }}>
                    {movie.genre_name} • {movie.format || '2D Digital'} • {movie.duration} phút
                  </div>
                </div>
              </div>
            </div>

            {/* Cinema Selection */}
            <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
              <label style={{ color: '#f3cf7a', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                <i className="fas fa-map-marker-alt mr-1"></i> Chọn Cụm Rạp VIP
              </label>
              <select
                className="form-control filter-input-vip"
                value={selectedCinemaName}
                onChange={(e) => {
                  setSelectedCinemaName(e.target.value);
                  const firstSt = allMovieShowtimes.find(s => s.cinema_name === e.target.value);
                  if (firstSt) setActiveShowtimeId(firstSt.id);
                  setSelectedSeats([]);
                }}
              >
                {cinemas.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="col-lg-4 col-md-6">
              <label style={{ color: '#f3cf7a', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                <i className="far fa-calendar-alt mr-1"></i> Ngày Chiếu
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { date: '2026-10-13', label: 'Hôm Nay (13/10)' },
                  { date: '2026-10-14', label: 'Ngày Mai (14/10)' },
                  { date: '2026-10-15', label: 'Ngày Kia (15/10)' }
                ].map(d => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d.date);
                      setSelectedSeats([]);
                    }}
                    style={{
                      flex: 1,
                      background: selectedDate === d.date ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(255,255,255,0.06)',
                      color: selectedDate === d.date ? '#090a0f' : '#cbd5e1',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Showtimes Pills */}
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 700 }}>
                <i className="far fa-clock mr-1"></i> Suất Chiếu Khả Dụng:
              </span>
              {availableShowtimes.map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setActiveShowtimeId(st.id);
                    setSelectedSeats([]);
                  }}
                  style={{
                    background: activeShowtime.id === st.id ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(212, 175, 55, 0.1)',
                    color: activeShowtime.id === st.id ? '#090a0f' : '#f3cf7a',
                    border: `1px solid ${activeShowtime.id === st.id ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'}`,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    boxShadow: activeShowtime.id === st.id ? '0 0 12px rgba(212, 175, 55, 0.4)' : 'none'
                  }}
                >
                  {st.show_time}
                  <span style={{ fontSize: '11px', opacity: 0.8, marginLeft: '6px' }}>({st.room.split('-')[0].trim()})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Seat Matrix and Booking Summary Sidebar */}
        <div className="row">
          {/* Cinema Screen & Seat Grid */}
          <div className="col-lg-8 mb-4">
            <div style={{
              background: 'rgba(18, 20, 29, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px 20px',
              textAlign: 'center',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              {/* Screen Bar */}
              <div style={{ margin: '0 auto 40px', maxWidth: '520px' }}>
                <div style={{
                  height: '8px',
                  background: 'linear-gradient(90deg, transparent, #d4af37, #f3cf7a, #d4af37, transparent)',
                  borderRadius: '50%',
                  boxShadow: '0 0 30px #d4af37'
                }} />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '10px', letterSpacing: '4px', textTransform: 'uppercase' }}>
                  <i className="fas fa-tv mr-2"></i> Màn Hình Chiếu IMAX (Screen)
                </p>
              </div>

              {/* Seat Matrix Grid */}
              <div style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '10px',
                overflowX: 'auto',
                maxWidth: '100%'
              }}>
                {rows.map(row => {
                  const type = getSeatType(row);
                  return (
                    <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <span style={{ width: '24px', color: '#f3cf7a', fontWeight: 800, fontSize: '13px' }}>{row}</span>
                      {cols.map(col => {
                        const code = `${row}${col}`;
                        const isReserved = reservedSeats.includes(code);
                        const isSelected = selectedSeats.includes(code);

                        let bgColor = 'rgba(255, 255, 255, 0.08)';
                        let borderColor = 'rgba(255, 255, 255, 0.2)';
                        let textColor = '#fff';

                        if (type === 'vip') {
                          borderColor = 'rgba(212, 175, 55, 0.6)';
                          bgColor = 'rgba(212, 175, 55, 0.12)';
                        } else if (type === 'couple') {
                          borderColor = 'rgba(236, 72, 153, 0.6)';
                          bgColor = 'rgba(236, 72, 153, 0.15)';
                        }

                        if (isReserved) {
                          bgColor = 'rgba(255, 255, 255, 0.15)';
                          borderColor = 'transparent';
                          textColor = 'rgba(255, 255, 255, 0.25)';
                        } else if (isSelected) {
                          bgColor = 'linear-gradient(135deg, #f3cf7a, #d4af37)';
                          borderColor = '#d4af37';
                          textColor = '#090a0f';
                        }

                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => toggleSeat(code)}
                            disabled={isReserved}
                            title={`${code} (${type.toUpperCase()}) - ${getSeatPrice(code).toLocaleString()} đ`}
                            style={{
                              width: type === 'couple' ? '42px' : '34px',
                              height: '34px',
                              borderRadius: '8px',
                              background: bgColor,
                              border: `1px solid ${borderColor}`,
                              color: textColor,
                              fontWeight: 800,
                              fontSize: '11px',
                              cursor: isReserved ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              boxShadow: isSelected ? '0 0 12px rgba(212, 175, 55, 0.7)' : 'none'
                            }}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Seat Legend */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(212, 175, 55, 0.15)',
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Ghế Thường (Hàng A-C)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.6)' }} />
                  <span style={{ color: '#f3cf7a' }}>Ghế VIP (+20k)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.6)' }} />
                  <span style={{ color: '#f472b6' }}>Ghế Đôi Sweetbox (+50k)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'linear-gradient(135deg, #f3cf7a, #d4af37)' }} />
                  <span style={{ color: '#fff', fontWeight: 700 }}>Đang Chọn</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Đã Đặt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Panel */}
          <div className="col-lg-4">
            <div style={{
              background: 'rgba(18, 20, 29, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.28)',
              borderRadius: '20px',
              padding: '26px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '14px' }}>
                Thông Tin Vé Đang Chọn
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Phim:</span>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{movie.title}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Cụm rạp &amp; Phòng chiếu:</span>
                <div style={{ color: '#f3cf7a', fontWeight: 700, fontSize: '14px' }}>{selectedCinemaName}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{activeShowtime.room}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Suất chiếu:</span>
                <div style={{ color: '#fff', fontWeight: 700 }}>
                  <i className="far fa-clock mr-1" style={{ color: '#d4af37' }}></i>
                  {activeShowtime.show_time} • Ngày {selectedDate}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Ghế ({selectedSeats.length}):</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {selectedSeats.length > 0 ? selectedSeats.map(s => (
                    <span key={s} style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#f3cf7a',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '13px'
                    }}>
                      {s}
                    </span>
                  )) : (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Chưa chọn ghế nào</span>
                  )}
                </div>
              </div>

              <div style={{
                borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
                paddingTop: '16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>Tạm tính vé:</span>
                <span style={{ color: '#f3cf7a', fontSize: '24px', fontWeight: 900 }}>
                  {totalSeatsPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToSnack}
                className="boxed-btn"
                style={{
                  width: '100%',
                  background: selectedSeats.length > 0
                    ? 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)'
                    : 'rgba(255, 255, 255, 0.08)',
                  color: selectedSeats.length > 0 ? '#090a0f' : 'rgba(255, 255, 255, 0.5)',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontSize: '14px',
                  border: selectedSeats.length > 0 ? 'none' : '1px dashed rgba(212, 175, 55, 0.3)',
                  cursor: selectedSeats.length > 0 ? 'pointer' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {selectedSeats.length > 0 ? (
                  <>Tiếp Tục Chọn Bắp Nước ({selectedSeats.length} ghế) <i className="fas fa-arrow-right ml-2"></i></>
                ) : (
                  <>Vui Lòng Chọn Ghế Trên Sơ Đồ <i className="fas fa-hand-pointer ml-2"></i></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
