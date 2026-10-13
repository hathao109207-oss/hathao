import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { showtimes, ageRatings } from '../data/mockData';
import { useApp } from '../context/AppContext';

const MovieList = () => {
  const { movieList, genreList, addToCart, updateBooking } = useApp();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedAgeRating, setSelectedAgeRating] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const filteredMovies = useMemo(() => {
    let result = [...movieList];

    // Status filter
    if (selectedStatus === 'now_showing') {
      result = result.filter(m => m.status === 'now_showing');
    } else if (selectedStatus === 'coming_soon') {
      result = result.filter(m => m.status === 'coming_soon');
    }

    // Genre filter
    if (selectedGenre) {
      result = result.filter(m => m.genre_id === selectedGenre);
    }

    // Age Rating filter
    if (selectedAgeRating) {
      result = result.filter(m => m.age_rating === selectedAgeRating);
    }

    // Format filter
    if (selectedFormat) {
      result = result.filter(m => m.format?.toLowerCase().includes(selectedFormat.toLowerCase()));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genre_name?.toLowerCase().includes(q) ||
        m.director?.toLowerCase().includes(q) ||
        m.cast?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortOption === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'duration') {
      result.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    } else if (sortOption === 'newest') {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [movieList, selectedStatus, selectedGenre, selectedAgeRating, selectedFormat, searchQuery, sortOption]);

  const handleResetFilters = () => {
    setSelectedGenre(null);
    setSelectedAgeRating('');
    setSelectedStatus('all');
    setSelectedFormat('');
    setSearchQuery('');
    setSortOption('newest');
  };

  const hasActiveFilters = selectedGenre !== null || selectedAgeRating || selectedStatus !== 'all' || selectedFormat || searchQuery;

  return (
    <div className="movielist-page">
      {/* Breadcrumb Header */}
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <i className="fas fa-film mr-2"></i> Trải Nghiệm Điện Ảnh Đỉnh Cao
          </p>
          <h1 className="catalog-title">DANH SÁCH &amp; LỊCH CHIẾU PHIM VIP</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', maxWidth: '650px', margin: '10px auto 0' }}>
            Khám phá danh sách phim chiếu rạp mới nhất tại CineTicket VIP với hệ thống phòng chiếu Laser IMAX và âm thanh Dolby Atmos đẳng cấp thế giới.
          </p>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        {/* Status Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Tất Cả Phim', icon: 'fa-layer-group', count: movieList.length },
            { key: 'now_showing', label: 'Phim Đang Chiếu', icon: 'fa-play-circle', count: movieList.filter(m => m.status === 'now_showing').length },
            { key: 'coming_soon', label: 'Phim Sắp Chiếu', icon: 'fa-calendar-alt', count: movieList.filter(m => m.status === 'coming_soon').length }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStatus(tab.key)}
              style={{
                background: selectedStatus === tab.key ? 'linear-gradient(135deg, #f43f5e, #fb923c)' : 'rgba(18, 20, 32, 0.85)',
                color: selectedStatus === tab.key ? '#fff' : '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 22px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: selectedStatus === tab.key ? '0 4px 15px rgba(244, 63, 94, 0.4)' : 'none'
              }}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
              <span style={{
                background: selectedStatus === tab.key ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px',
                marginLeft: '4px'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Box Glass */}
        <div className="filter-box-glass">
          <div className="row align-items-center">
            {/* Search Input */}
            <div className="col-lg-4 col-md-6 mb-3">
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control filter-input-vip"
                  placeholder="Tìm tên phim, diễn viên, đạo diễn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '15px', color: '#f3cf7a' }}></i>
              </div>
            </div>

            {/* Genre Filter */}
            <div className="col-lg-3 col-md-6 mb-3">
              <select
                className="form-control filter-input-vip"
                value={selectedGenre || ''}
                onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-- Tất cả thể loại --</option>
                {genreList.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Age Rating Filter */}
            <div className="col-lg-2 col-md-6 mb-3">
              <select
                className="form-control filter-input-vip"
                value={selectedAgeRating}
                onChange={(e) => setSelectedAgeRating(e.target.value)}
              >
                <option value="">-- Độ tuổi --</option>
                {ageRatings.map(a => (
                  <option key={a.code} value={a.code}>{a.code} ({a.label.split('-')[0].trim()})</option>
                ))}
              </select>
            </div>

            {/* Sort Option */}
            <div className="col-lg-3 col-md-6 mb-3">
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
                <option value="duration">Thời lượng dài nhất</option>
              </select>
            </div>
          </div>

          {/* Quick Genre Badges and Reset */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginTop: '10px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(212, 175, 55, 0.15)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px', marginRight: '4px' }}>
                <i className="fas fa-tags mr-1"></i> Thể loại:
              </span>
              <button
                type="button"
                onClick={() => setSelectedGenre(null)}
                style={{
                  background: selectedGenre === null ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(212, 175, 55, 0.12)',
                  color: selectedGenre === null ? '#090a0f' : '#f3cf7a',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '5px 14px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tất Cả
              </button>
              {genreList.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGenre(g.id)}
                  style={{
                    background: selectedGenre === g.id ? 'linear-gradient(135deg, #f3cf7a, #d4af37)' : 'rgba(212, 175, 55, 0.12)',
                    color: selectedGenre === g.id ? '#090a0f' : '#f3cf7a',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    padding: '5px 14px',
                    borderRadius: '50px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  padding: '5px 14px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fas fa-times-circle"></i> Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Result Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '13.5px' }}>
          <div>
            Tìm thấy <strong style={{ color: '#f3cf7a' }}>{filteredMovies.length}</strong> bộ phim phù hợp
          </div>
          {sortOption && (
            <div>
              Sắp xếp theo: <span style={{ color: '#fff', fontWeight: 600 }}>{
                sortOption === 'newest' ? 'Mới nhất' :
                sortOption === 'rating' ? 'Điểm IMDb' :
                sortOption === 'price_asc' ? 'Giá tăng dần' :
                sortOption === 'price_desc' ? 'Giá giảm dần' :
                sortOption === 'duration' ? 'Thời lượng' : 'Tên A-Z'
              }</span>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: 'rgba(18, 20, 29, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '20px'
          }}>
            <i className="fas fa-film" style={{ fontSize: '56px', color: 'rgba(212, 175, 55, 0.3)', marginBottom: '16px', display: 'block' }}></i>
            <h3 style={{ color: '#fff', marginBottom: '8px' }}>Không tìm thấy phim phù hợp</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '450px', margin: '0 auto 20px' }}>
              Hãy thử điều chỉnh lại từ khóa tìm kiếm, thể loại hoặc phân loại độ tuổi để xem thêm các tác phẩm khác.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="boxed-btn"
              style={{
                background: 'linear-gradient(135deg, #f3cf7a, #d4af37)',
                color: '#090a0f',
                padding: '10px 24px',
                borderRadius: '50px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-redo-alt mr-2"></i> Đặt Lại Bộ Lọc
            </button>
          </div>
        ) : (
          <div className="row">
            {filteredMovies.map(movie => {
              const movieShowtimes = showtimes.filter(s => s.movie_id === movie.id);
              const ageRatingObj = ageRatings.find(a => a.code === movie.age_rating);

              return (
                <div key={movie.id} className="col-lg-3 col-md-6 mb-4 d-flex align-items-stretch">
                  <div className="single-product-item w-100">
                    <div className="product-image">
                      {/* Rating Badge */}
                      <span className="product-badge-imdb">
                        <i className="fas fa-star" style={{ color: '#f3cf7a', marginRight: '4px' }}></i> {movie.rating}
                      </span>

                      {/* Age Rating Badge */}
                      {movie.age_rating && (
                        <span style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: ageRatingObj?.color || '#ef4444',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 900,
                          letterSpacing: '0.5px',
                          zIndex: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                        }} title={ageRatingObj?.label || movie.age_rating}>
                          {movie.age_rating}
                        </span>
                      )}

                      <Link to={`/movie/${movie.id}`}>
                        <img
                          src={movie.image}
                          alt={movie.title}
                          onError={(e) => { e.target.src = '/assets/img/products/product-img-1.jpg'; }}
                        />
                      </Link>
                    </div>

                    <div className="single-product-item-body">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          background: 'rgba(212, 175, 55, 0.15)',
                          color: '#f3cf7a',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 800
                        }}>
                          {movie.format || '2D Digital'}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11.5px' }}>
                          <i className="far fa-clock mr-1"></i> {movie.duration} phút
                        </span>
                      </div>

                      <h3>
                        <Link to={`/movie/${movie.id}`} title={movie.title}>
                          {movie.title}
                        </Link>
                      </h3>

                      <p className="product-price">
                        <span>{movie.genre_name}</span>
                        <span>{(movie.price || 100000).toLocaleString('vi-VN')} đ</span>
                      </p>

                      {/* Quick showtime buttons */}
                      {movieShowtimes.length > 0 && (
                        <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                          {movieShowtimes.slice(0, 2).map(st => (
                            <Link
                              key={st.id}
                              to={`/seat?movieId=${movie.id}&showtimeId=${st.id}`}
                              className="showtime-btn"
                              onClick={() => updateBooking({ movieId: movie.id, showtimeId: st.id, seats: [] })}
                              style={{ textDecoration: 'none' }}
                              title={`${st.cinema_name} - ${st.room}`}
                            >
                              <i className="far fa-clock mr-1"></i> {st.show_time}
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="product-btn-group">
                        <Link
                          to={`/seat?movieId=${movie.id}`}
                          className="movie-book-btn"
                          onClick={() => updateBooking({ movieId: movie.id, seats: [] })}
                        >
                          <i className="fas fa-ticket-alt"></i> Đặt Ghế VIP
                        </Link>
                        <button
                          type="button"
                          onClick={() => addToCart(movie, 1)}
                          className="movie-cart-btn"
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
