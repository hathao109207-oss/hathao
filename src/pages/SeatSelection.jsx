import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { movies, showtimes } from '../data/mockData';
import { useApp } from '../context/AppContext';

const SeatSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentBooking, updateBooking, addToast } = useApp();

  const movieId = Number(searchParams.get('movieId')) || currentBooking.movieId || 1;
  const showtimeId = Number(searchParams.get('showtimeId')) || currentBooking.showtimeId || 101;

  const movie = movies.find(m => m.id === movieId) || movies[0];
  const movieShowtimes = showtimes.filter(s => s.movie_id === movie.id);
  const currentShowtime = movieShowtimes.find(s => s.id === showtimeId) || movieShowtimes[0] || showtimes[0];

  const [selectedSeats, setSelectedSeats] = useState(
    currentBooking.seats && currentBooking.seats.length > 0 ? currentBooking.seats : ['E5']
  );

  // Generate seat grid: Rows A to G, cols 1 to 10
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  // Fixed reserved seats for simulation
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
    if (['D', 'E', 'F'].includes(row)) return base + 20000; // VIP
    return base;
  };

  const toggleSeat = (code) => {
    if (reservedSeats.includes(code)) {
      addToast(`Ghế ${code} đã có người đặt, vui lòng chọn ghế khác!`, 'error');
      return;
    }
    setSelectedSeats(prev => {
      if (prev.includes(code)) {
        return prev.filter(s => s !== code);
      } else {
        if (prev.length >= 8) {
          addToast('Bạn chỉ được chọn tối đa 8 ghế trong một giao dịch.', 'info');
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
      showtimeId: currentShowtime.id,
      seats: selectedSeats
    });
    navigate('/snack');
  };

  return (
    <div className="seat-selection-page">
      {/* Breadcrumb Header */}
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Đặt Vé Xem Phim
          </p>
          <h1 className="catalog-title">CHỌN GHẾ NGỒI VIP</h1>
        </div>
      </div>

      <div className="container mt-4 mb-5">
        {/* Booking Steps Bar */}
        <div className="seat-steps mb-5">
          <div className="seat-step active">
            <div className="seat-step-icon"><i className="fas fa-th-large"></i></div>
            <div className="seat-step-text">1. Chọn ghế</div>
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
            <div className="seat-step-text">4. Thông tin vé</div>
          </div>
        </div>

        {/* Movie Info & Showtime banner */}
        <div style={{
          background: 'rgba(18, 20, 29, 0.85)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: '0 0 6px' }}>{movie.title}</h3>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              <i className="fas fa-map-marker-alt" style={{ color: '#d4af37', marginRight: '6px' }}></i>
              <strong>{currentShowtime.cinema_name}</strong> - {currentShowtime.room}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {movieShowtimes.map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => updateBooking({ showtimeId: st.id })}
                style={{
                  background: currentShowtime.id === st.id ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(212, 175, 55, 0.12)',
                  color: currentShowtime.id === st.id ? '#090a0f' : '#f3cf7a',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {st.show_time}
              </button>
            ))}
          </div>
        </div>

        <div className="row">
          {/* Cinema Screen & Seat Matrix */}
          <div className="col-lg-8 mb-4">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px 20px',
              textAlign: 'center',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              {/* Screen Bar */}
              <div style={{ margin: '0 auto 40px', maxWidth: '500px' }}>
                <div style={{
                  height: '8px',
                  background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                  borderRadius: '50%',
                  boxShadow: '0 0 25px #d4af37'
                }} />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px', letterSpacing: '4px', textTransform: 'uppercase' }}>
                  Màn Hình Chiếu (Screen)
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
                              width: type === 'couple' ? '40px' : '34px',
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
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Ghế Thường</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.6)' }} />
                  <span style={{ color: '#f3cf7a' }}>Ghế VIP</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.6)' }} />
                  <span style={{ color: '#f472b6' }}>Ghế Đôi Sweetbox</span>
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
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
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
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Suất chiếu:</span>
                <div style={{ color: '#f3cf7a', fontWeight: 700 }}>{currentShowtime.show_time} - Hôm Nay ({currentShowtime.show_date})</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Phòng chiếu &amp; Rạp:</span>
                <div style={{ color: '#fff', fontSize: '14px' }}>{currentShowtime.cinema_name} ({currentShowtime.room})</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Ghế ({selectedSeats.length}):</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {selectedSeats.length > 0 ? selectedSeats.map(s => (
                    <span key={s} style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#f3cf7a',
                      padding: '3px 10px',
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
                <span style={{ color: '#f3cf7a', fontSize: '22px', fontWeight: 900 }}>
                  {totalSeatsPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToSnack}
                className="boxed-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)',
                  color: '#090a0f',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Tiếp Tục Chọn Bắp Nước <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
