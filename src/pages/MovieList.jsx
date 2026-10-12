import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { movies, genres, showtimes } from '../data/mockData';
import { useApp } from '../context/AppContext';

const MovieList = () => {
  const { addToCart, updateBooking } = useApp();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (selectedGenre) {
      result = result.filter(m => m.genre_id === selectedGenre);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(m => m.title.toLowerCase().includes(q) || m.genre_name.toLowerCase().includes(q));
    }

    if (sortOption === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedGenre, searchQuery, sortOption]);

  return (
    <div className="movielist-page">
      {/* Breadcrumb Header */}
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-film mr-2"></i> Trải Nghiệm Đỉnh Cao
          </p>
          <h1 className="catalog-title">LỊCH CHIẾU PHIM VIP</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', maxWidth: '600px', margin: '10px auto 0' }}>
            Cập nhật những bộ phim chiếu rạp mới nhất với chất lượng âm thanh và hình ảnh cao cấp nhất hiện nay.
          </p>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        {/* Filter Box */}
        <div className="filter-box-glass">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-12 mb-3 mb-lg-0">
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control filter-input-vip"
                  placeholder="Tìm tên phim hoặc thể loại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '15px', color: '#f3cf7a' }}></i>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
              <select
                className="form-control filter-input-vip"
                value={selectedGenre || ''}
                onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-- Tất cả thể loại --</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-3 col-md-6">
              <select
                className="form-control filter-input-vip"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Mới cập nhật</option>
                <option value="rating">Đánh giá IMDb cao nhất</option>
                <option value="price_asc">Giá vé: Thấp đến Cao</option>
                <option value="price_desc">Giá vé: Cao đến Thấp</option>
                <option value="name">Tên phim: A - Z</option>
              </select>
            </div>
          </div>

          {/* Genre Badges quick selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}>
            <button
              type="button"
              onClick={() => setSelectedGenre(null)}
              style={{
                background: selectedGenre === null ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(212, 175, 55, 0.12)',
                color: selectedGenre === null ? '#090a0f' : '#f3cf7a',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '6px 16px',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Tất Cả
            </button>
            {genres.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGenre(g.id)}
                style={{
                  background: selectedGenre === g.id ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(212, 175, 55, 0.12)',
                  color: selectedGenre === g.id ? '#090a0f' : '#f3cf7a',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(18, 20, 29, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '20px'
          }}>
            <i className="fas fa-film" style={{ fontSize: '48px', color: 'rgba(212, 175, 55, 0.4)', marginBottom: '16px' }}></i>
            <h3 style={{ color: '#fff' }}>Không tìm thấy phim phù hợp</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Hãy thử điều chỉnh lại từ khóa tìm kiếm hoặc chọn thể loại khác.</p>
          </div>
        ) : (
          <div className="row">
            {filteredMovies.map(movie => {
              const movieShowtimes = showtimes.filter(s => s.movie_id === movie.id);
              return (
                <div key={movie.id} className="col-lg-3 col-md-6 mb-4">
                  <div className="single-product-item" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="product-image">
                      <span className="product-badge-imdb">
                        <i className="fas fa-star" style={{ color: '#f3cf7a', marginRight: '4px' }}></i> {movie.rating}
                      </span>
                      <Link to={`/movie/${movie.id}`}>
                        <img
                          src={movie.image}
                          alt={movie.title}
                          onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }}
                        />
                      </Link>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                      <h3 title={movie.title}>
                        <Link to={`/movie/${movie.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
                          {movie.title}
                        </Link>
                      </h3>

                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                        <span><i className="far fa-clock mr-1"></i> {movie.duration} phút</span> | <span>{movie.format}</span>
                      </div>

                      <p className="product-price">
                        <span>{movie.genre_name}</span>
                        <span>{movie.price.toLocaleString('vi-VN')} đ</span>
                      </p>

                      {/* Quick showtime buttons */}
                      {movieShowtimes.length > 0 && (
                        <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {movieShowtimes.slice(0, 2).map(st => (
                            <Link
                              key={st.id}
                              to={`/seat?movieId=${movie.id}&showtimeId=${st.id}`}
                              className="showtime-btn"
                              onClick={() => updateBooking({ movieId: movie.id, showtimeId: st.id })}
                              style={{ textDecoration: 'none' }}
                            >
                              <i className="far fa-clock mr-1"></i> {st.show_time}
                            </Link>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                        <Link
                          to={`/seat?movieId=${movie.id}`}
                          className="cart-btn"
                          onClick={() => updateBooking({ movieId: movie.id })}
                          style={{ flex: 1 }}
                        >
                          <i className="fas fa-ticket-alt"></i> Đặt Ghế VIP
                        </Link>
                        <button
                          type="button"
                          onClick={() => addToCart(movie, 1)}
                          className="cart-btn"
                          style={{
                            width: '42px',
                            flex: 'none',
                            background: 'rgba(212, 175, 55, 0.15)',
                            color: '#f3cf7a',
                            border: '1px solid rgba(212, 175, 55, 0.3)'
                          }}
                          title="Thêm vào giỏ vé"
                        >
                          <i className="fas fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
