import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { showtimes, ageRatings, cinemas } from '../data/mockData';
import { useApp } from '../context/AppContext';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateBooking, addToast, movieList, reviews, addReview, user } = useApp();

  const movie = movieList.find(m => m.id === Number(id)) || movieList[0];
  const allMovieShowtimes = showtimes.filter(s => s.movie_id === movie?.id);
  const movieReviews = reviews.filter(r => r.movie_id === movie?.id && r.approved);

  const [selectedCinema, setSelectedCinema] = useState('all');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(
    allMovieShowtimes.length > 0 ? allMovieShowtimes[0].id : null
  );

  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(9);
  const [reviewComment, setReviewComment] = useState('');

  const ageRatingObj = ageRatings.find(a => a.code === movie?.age_rating);

  const filteredShowtimes = selectedCinema === 'all'
    ? allMovieShowtimes
    : allMovieShowtimes.filter(s => s.cinema_name === selectedCinema);

  const handleBookingClick = () => {
    const chosenStId = selectedShowtimeId || (filteredShowtimes[0]?.id || 101);
    const chosenSt = showtimes.find(s => s.id === chosenStId);
    updateBooking({
      movieId: movie.id,
      showtimeId: chosenStId,
      cinemaName: chosenSt?.cinema_name
    });
    navigate(`/seat?movieId=${movie.id}&showtimeId=${chosenStId}`);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(movie.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setReviewRating(9);
  };

  if (!movie) {
    return (
      <div className="container mt-5 mb-5 text-center" style={{ minHeight: '50vh' }}>
        <h2 style={{ color: '#fff' }}>Không tìm thấy thông tin phim</h2>
        <Link to="/movies" className="boxed-btn" style={{ marginTop: '20px', display: 'inline-block' }}>Quay Lại Lịch Phim</Link>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* Breadcrumb Header with Backdrop */}
      <div className="catalog-breadcrumb" style={{
        background: `radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.25), transparent 75%), linear-gradient(rgba(9,10,15,0.88), rgba(9,10,15,0.96)), url('${movie.image}') center/cover no-repeat`,
        padding: '70px 0 50px'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span style={{ color: '#f3cf7a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px' }}>
                <Link to="/movies" style={{ color: '#f3cf7a', textDecoration: 'none' }}>Lịch Phim</Link> / Chi Tiết Phim
              </span>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '38px', fontWeight: 900, color: '#fff', marginTop: '8px' }}>
                {movie.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row">
          {/* Left Poster & Trailer Button */}
          <div className="col-lg-4 col-md-5 mb-4">
            <div style={{
              background: 'rgba(18, 20, 29, 0.88)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '16px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.7)',
              textAlign: 'center'
            }}>
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '2/3' }}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }}
                />

                {/* Trailer Play Overlay Button */}
                <button
                  type="button"
                  onClick={() => setShowTrailerModal(true)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.95)',
                    color: '#090a0f',
                    border: 'none',
                    fontSize: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)',
                    transition: 'transform 0.2s'
                  }}
                  title="Xem Trailer Ngay"
                >
                  <i className="fas fa-play" style={{ marginLeft: '4px' }}></i>
                </button>
              </div>

              <div style={{ marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={() => setShowTrailerModal(true)}
                  className="bordered-btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '13.5px'
                  }}
                >
                  <i className="fas fa-play-circle mr-2"></i> Xem Trailer Chính Thức
                </button>
              </div>
            </div>
          </div>

          {/* Right Details Info */}
          <div className="col-lg-8 col-md-7">
            <div style={{
              background: 'rgba(18, 20, 29, 0.88)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              {/* Badges bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                  color: '#090a0f',
                  fontWeight: 900,
                  fontSize: '12px',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  {movie.format || 'VIP 2D/3D'}
                </span>

                {movie.age_rating && (
                  <span style={{
                    background: ageRatingObj?.color || '#ef4444',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '6px'
                  }}>
                    {ageRatingObj?.label || movie.age_rating}
                  </span>
                )}

                <span style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#f3cf7a',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '4px 12px',
                  borderRadius: '6px'
                }}>
                  <i className="fas fa-star mr-1"></i> {movie.rating} / 10 IMDb
                </span>

                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px' }}>
                  <i className="far fa-clock mr-1"></i> {movie.duration} phút
                </span>
              </div>

              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
                {movie.title}
              </h2>

              {/* Price Banner */}
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#f3cf7a', marginBottom: '20px' }}>
                {(movie.price || 100000).toLocaleString('vi-VN')} đ <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>/ vé VIP Standard</span>
              </div>

              {/* Specification Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
                borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                paddingBottom: '20px'
              }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Thể loại:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{movie.genre_name}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Đạo diễn:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{movie.director || 'Đang cập nhật'}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Khởi chiếu:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{movie.release_date || 'Đang chiếu'}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Diễn viên:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{movie.cast || 'Đang cập nhật'}</strong>
                </div>
              </div>

              {/* Synopsis */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ color: '#f3cf7a', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
                  <i className="fas fa-align-left mr-2"></i> Nội Dung Phim
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '15px', lineHeight: '1.8' }}>
                  {movie.description}
                </p>
              </div>

              {/* Showtimes & Cinema Selection */}
              <div style={{
                marginBottom: '28px',
                background: 'rgba(9, 10, 15, 0.6)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ color: '#f3cf7a', fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                    <i className="far fa-calendar-check mr-2"></i> Chọn Rạp &amp; Suất Chiếu
                  </h4>

                  {/* Cinema filter pill */}
                  <select
                    className="form-control filter-input-vip"
                    value={selectedCinema}
                    onChange={(e) => setSelectedCinema(e.target.value)}
                    style={{ maxWidth: '240px', fontSize: '12.5px', padding: '6px 12px' }}
                  >
                    <option value="all">Tất cả cụm rạp</option>
                    {cinemas.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {filteredShowtimes.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {filteredShowtimes.map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedShowtimeId(st.id)}
                        style={{
                          background: selectedShowtimeId === st.id ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(212, 175, 55, 0.12)',
                          color: selectedShowtimeId === st.id ? '#090a0f' : '#f3cf7a',
                          border: `1px solid ${selectedShowtimeId === st.id ? '#d4af37' : 'rgba(212, 175, 55, 0.35)'}`,
                          padding: '10px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px',
                          textAlign: 'left',
                          boxShadow: selectedShowtimeId === st.id ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
                        }}
                      >
                        <div style={{ fontWeight: 800 }}>{st.show_time} ({st.show_date})</div>
                        <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>{st.cinema_name}</div>
                        <div style={{ fontSize: '10px', opacity: 0.7 }}>{st.room}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
                    Không có suất chiếu phù hợp cho cụm rạp này hôm nay.
                  </p>
                )}
              </div>

              {/* CTA Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleBookingClick}
                  className="boxed-btn"
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)',
                    color: '#090a0f',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-couch mr-2"></i> Chọn Ghế &amp; Đặt Vé Ngay
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(movie, 1)}
                  className="bordered-btn"
                  style={{
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '14px'
                  }}
                >
                  <i className="fas fa-cart-plus mr-2"></i> Thêm Vào Giỏ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews & Ratings Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div style={{
              background: 'rgba(18, 20, 32, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.5)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#f1f5f9', fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>
                <i className="fas fa-star" style={{ color: '#f43f5e', marginRight: '10px' }} />
                Đánh Giá &amp; Bình Luận Khán Giả
                <span style={{ marginLeft: '10px', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
                  ({movieReviews.length} lượt đánh giá)
                </span>
              </h3>

              {/* Review Input Box */}
              <div style={{
                background: 'rgba(244, 63, 94, 0.06)',
                border: '1px solid rgba(244, 63, 94, 0.15)',
                borderRadius: '16px',
                padding: '22px',
                marginBottom: '28px'
              }}>
                <form onSubmit={handleAddReview}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f43f5e, #fb923c)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      color: '#fff',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {user ? (user.fullname || user.username)?.[0]?.toUpperCase() : <i className="fas fa-user" style={{ fontSize: '16px' }} />}
                    </div>
                    <div>
                      <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '14px' }}>
                        {user ? (user.fullname || user.username) : 'Bạn đang bình luận với tư cách Khán giả'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setReviewRating(n)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0 2px',
                              fontSize: '18px',
                              color: n <= reviewRating ? '#f59e0b' : '#374151'
                            }}
                            title={`${n}/10 sao`}
                          >
                            <i className="fas fa-star" />
                          </button>
                        ))}
                        <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '14px', marginLeft: '6px' }}>
                          {reviewRating}/10 sao
                        </span>
                      </div>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    className="form-control filter-input-vip"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận chân thật của bạn về bộ phim, diễn xuất và hình ảnh âm thanh tại rạp..."
                    style={{ marginBottom: '12px', height: 'auto' }}
                    required
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                      <i className="fas fa-shield-alt mr-1"></i> Bình luận văn minh, tôn trọng người xem khác
                    </span>
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #f43f5e, #fb923c)',
                        color: '#fff',
                        padding: '10px 24px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13.5px'
                      }}
                    >
                      <i className="fas fa-paper-plane mr-2" /> Gửi Đánh Giá Ngay
                    </button>
                  </div>
                </form>
              </div>

              {/* Reviews List */}
              {movieReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <i className="fas fa-comment-slash" style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }} />
                  <p>Chưa có đánh giá nào cho phim này. Hãy là người đầu tiên để lại cảm nhận!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {movieReviews.map(review => (
                    <div
                      key={review.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '14px',
                        padding: '18px 20px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            color: '#fff',
                            fontWeight: 800
                          }}>
                            {review.user?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '14px' }}>
                              {review.user}
                              <span style={{ color: '#10b981', fontSize: '11px', marginLeft: '6px' }}>
                                <i className="fas fa-check-circle mr-1"></i>Đã xem tại rạp
                              </span>
                            </div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{review.created_at}</div>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(245, 158, 11, 0.12)',
                          padding: '4px 10px',
                          borderRadius: '8px'
                        }}>
                          <i className="fas fa-star" style={{ color: '#f59e0b', fontSize: '13px' }} />
                          <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '14px' }}>{review.rating}/10</span>
                        </div>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && (
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
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setShowTrailerModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              ×
            </button>
            <iframe
              src={`${movie.trailer_url}?autoplay=1`}
              title="Trailer"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
