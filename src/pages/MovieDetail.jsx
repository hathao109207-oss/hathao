import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movies, showtimes } from '../data/mockData';
import { useApp } from '../context/AppContext';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateBooking, addToast, movieList, reviews, addReview, user } = useApp();

  const movie = movieList.find(m => m.id === Number(id)) || movieList[0];
  const movieShowtimes = showtimes.filter(s => s.movie_id === movie?.id);
  const movieReviews = reviews.filter(r => r.movie_id === movie?.id && r.approved);

  const [selectedShowtimeId, setSelectedShowtimeId] = useState(
    movieShowtimes.length > 0 ? movieShowtimes[0].id : null
  );

  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const handleBookingClick = () => {
    updateBooking({
      movieId: movie.id,
      showtimeId: selectedShowtimeId || (movieShowtimes[0]?.id || 101)
    });
    navigate(`/seat?movieId=${movie.id}&showtimeId=${selectedShowtimeId || (movieShowtimes[0]?.id || 101)}`);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(movie.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="movie-detail-page">
      {/* Breadcrumb Header */}
      <div className="catalog-breadcrumb" style={{
        background: `radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.25), transparent 75%), linear-gradient(rgba(9,10,15,0.85), rgba(9,10,15,0.95)), url('${movie.image}') center/cover no-repeat`,
        padding: '70px 0 50px'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span style={{ color: '#f3cf7a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px' }}>
                <Link to="/movies" style={{ color: '#f3cf7a', textDecoration: 'none' }}>Lịch Phim</Link> / Chi Tiết Phim
              </span>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '42px', fontWeight: 900, color: '#fff', marginTop: '8px' }}>
                {movie.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row">
          {/* Poster & Trailer button */}
          <div className="col-lg-4 col-md-5 mb-4">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
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
                    background: 'rgba(212, 175, 55, 0.9)',
                    color: '#090a0f',
                    border: 'none',
                    fontSize: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)'
                  }}
                  title="Xem Trailer"
                >
                  <i className="fas fa-play" style={{ marginLeft: '4px' }}></i>
                </button>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowTrailerModal(true)}
                  className="bordered-btn"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 800, textTransform: 'uppercase' }}
                >
                  <i className="fas fa-play-circle mr-2"></i> Xem Trailer Phim
                </button>
              </div>
            </div>
          </div>

          {/* Movie Details info */}
          <div className="col-lg-8 col-md-7">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
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
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  <i className="far fa-clock mr-1"></i> {movie.duration} phút
                </span>
              </div>

              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
                {movie.title}
              </h2>

              <div style={{ fontSize: '26px', fontWeight: 900, color: '#f3cf7a', marginBottom: '20px' }}>
                {movie.price.toLocaleString('vi-VN')} đ / vé VIP
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', paddingBottom: '20px' }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Thể loại:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{movie.genre_name}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Đạo diễn:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{movie.director}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Khởi chiếu:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{movie.release_date}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'block' }}>Diễn viên:</span>
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{movie.cast}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ color: '#f3cf7a', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>Nội Dung Phim</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: '1.8' }}>
                  {movie.description}
                </p>
              </div>

              {/* Showtimes Selection */}
              <div style={{ marginBottom: '28px', background: 'rgba(9, 10, 15, 0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <h4 style={{ color: '#f3cf7a', fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '14px' }}>
                  <i className="far fa-calendar-check mr-2"></i> Chọn Suất Chiếu Hôm Nay
                </h4>
                {movieShowtimes.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {movieShowtimes.map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedShowtimeId(st.id)}
                        style={{
                          background: selectedShowtimeId === st.id ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(212, 175, 55, 0.12)',
                          color: selectedShowtimeId === st.id ? '#090a0f' : '#f3cf7a',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px',
                          textAlign: 'left'
                        }}
                      >
                        <div>{st.show_time}</div>
                        <div style={{ fontSize: '11px', opacity: 0.85 }}>{st.cinema_name}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>Đang cập nhật lịch chiếu cho ngày hôm nay.</p>
                )}
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleBookingClick}
                  className="boxed-btn"
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)',
                    color: '#090a0f',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-couch mr-2"></i> Chọn Ghế Ngay
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

        {/* Reviews Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div style={{
              background: 'rgba(18, 20, 29, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>
                Đánh Giá &amp; Bình Luận Khán Giả
              </h3>

              <form onSubmit={handleAddComment} style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    className="form-control filter-input-vip"
                    placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="boxed-btn"
                    style={{
                      background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                      color: '#090a0f',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0 24px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Gửi Đánh Giá
                  </button>
                </div>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {comments.map(c => (
                  <div key={c.id} style={{
                    background: 'rgba(9, 10, 15, 0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    borderRadius: '14px',
                    padding: '16px 20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: '#f3cf7a', fontSize: '15px' }}>
                        <i className="fas fa-user-circle mr-2"></i> {c.user}
                      </strong>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{c.date}</span>
                    </div>
                    <div style={{ color: '#ffb703', fontSize: '12px', marginBottom: '6px' }}>
                      {[...Array(c.rating)].map((_, i) => <i key={i} className="fas fa-star mr-1"></i>)}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '14px' }}>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Comments Section */}
      <div className="container mb-5">
        <div style={{ background: 'rgba(18,20,32,0.92)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", color: '#f1f5f9', fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>
            <i className="fas fa-star" style={{ color: '#f43f5e', marginRight: '10px' }} />
            Bình Luận & Đánh Giá
            <span style={{ marginLeft: '10px', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>({movieReviews.length} đánh giá)</span>
          </h3>

          {/* Write review form */}
          <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '16px', padding: '22px', marginBottom: '28px' }}>
            {user ? (
              <form onSubmit={handleAddReview}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#f43f5e,#fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#fff', fontWeight: 800, flexShrink: 0 }}>
                    {(user.fullname || user.username)?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '14px' }}>{user.fullname || user.username}</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <button key={n} type="button" onClick={() => setReviewRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', fontSize: '18px', color: n <= reviewRating ? '#f59e0b' : '#374151' }}>
                          <i className="fas fa-star" />
                        </button>
                      ))}
                      <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '14px', marginLeft: '6px' }}>{reviewRating}/10</span>
                    </div>
                  </div>
                </div>
                <textarea
                  rows={3}
                  className="form-control filter-input-vip"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                  style={{ marginBottom: '12px', height: 'auto' }}
                  required
                />
                <button type="submit" style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '10px 24px', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13.5px' }}>
                  <i className="fas fa-paper-plane mr-2" />Gửi Đánh Giá
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <i className="fas fa-user-circle" style={{ fontSize: '36px', color: '#374151', marginBottom: '10px' }} />
                <p style={{ color: '#64748b', marginBottom: '14px' }}>Đăng nhập để bình luận và đánh giá phim</p>
                <a href="/login" style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', color: '#fff', padding: '10px 24px', borderRadius: '10px', fontWeight: 800, textDecoration: 'none', fontSize: '13.5px' }}>
                  <i className="fas fa-sign-in-alt mr-2" />Đăng Nhập Ngay
                </a>
              </div>
            )}
          </div>

          {/* Reviews list */}
          {movieReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
              <i className="fas fa-comment-slash" style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }} />
              <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {movieReviews.map(review => (
                <div key={review.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#fff', fontWeight: 800 }}>
                        {review.user?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '14px' }}>{review.user}</div>
                        <div style={{ color: '#475569', fontSize: '12px' }}>{review.created_at}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.12)', padding: '4px 10px', borderRadius: '8px' }}>
                      <i className="fas fa-star" style={{ color: '#f59e0b', fontSize: '13px' }} />
                      <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '14px' }}>{review.rating}/10</span>
                    </div>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
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
