import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { newsArticles } from '../data/mockData';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { movieList, addToCart, updateBooking } = useApp();
  const [sliderIndex, setSliderIndex] = useState(0);

  const featuredMovies = movieList.slice(0, 8);

  const sliderSlides = [
    {
      title: "Trải Nghiệm Điện Ảnh Đẳng Cấp 5 Sao",
      subtitle: "CineTicket VIP Cinema",
      bg: "/assets/img/products/avatar-2.jpg",
      badge: "Công Nghệ Laser IMAX"
    },
    {
      title: "Bắp Nước Caramel & Thức Uống VIP Premium",
      subtitle: "Combo Thượng Hạng",
      bg: "/assets/img/products/john-wick-4.jpg",
      badge: "Phục Vụ Tận Ghế"
    }
  ];

  return (
    <div className="home-wrapper">
      {/* Hero Slider */}
      <div
        className="hero-slider-section"
        style={{
          position: 'relative',
          minHeight: '520px',
          background: `radial-gradient(circle at 50% 40%, rgba(212, 175, 55, 0.22), transparent 70%), linear-gradient(rgba(9, 10, 15, 0.75), rgba(9, 10, 15, 0.95)), url('${sliderSlides[sliderIndex].bg}') center/cover no-repeat`,
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.6s ease',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="hero-text">
                <span className="subtitle" style={{
                  display: 'inline-block',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: '#f3cf7a',
                  fontWeight: 800,
                  fontSize: '13px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  padding: '6px 18px',
                  borderRadius: '999px',
                  marginBottom: '18px'
                }}>
                  <i className="fas fa-crown mr-2"></i> {sliderSlides[sliderIndex].subtitle}
                </span>

                <h1 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '48px',
                  fontWeight: 900,
                  color: '#ffffff',
                  textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                  lineHeight: 1.2,
                  marginBottom: '24px'
                }}>
                  {sliderSlides[sliderIndex].title}
                </h1>

                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 28px' }}>
                  Hòa mình vào không gian điện ảnh thượng đỉnh với công nghệ trình chiếu tương lai và dịch vụ chuẩn hoàng gia.
                </p>

                <div className="hero-btns" style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <Link to="/movies" className="boxed-btn" style={{
                    background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)',
                    color: '#090a0f',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}>
                    <i className="fas fa-ticket-alt mr-2"></i> Đặt Vé Ngay
                  </Link>

                  <Link to="/contact" className="bordered-btn" style={{
                    border: '2px solid #d4af37',
                    color: '#f3cf7a',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}>
                    <i className="fas fa-phone-alt mr-2"></i> Liên Hệ Hỗ Trợ
                  </Link>
                </div>

                {/* Slider dots */}
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {sliderSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSliderIndex(idx)}
                      style={{
                        width: idx === sliderIndex ? '28px' : '10px',
                        height: '10px',
                        borderRadius: '10px',
                        background: idx === sliderIndex ? '#d4af37' : 'rgba(255,255,255,0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Features Bar */}
      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="vip-feature-bar" style={{
          background: 'rgba(18, 20, 29, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '20px',
          padding: '28px 24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}>
          <div className="row">
            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <div className="vip-feat-item" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="vip-feat-icon" style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(170, 124, 17, 0.05))',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f3cf7a',
                  fontSize: '20px'
                }}>
                  <i className="fas fa-video"></i>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 2px' }}>Màn Hình 4K Laser</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>Độ tương phản siêu thực</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <div className="vip-feat-item" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="vip-feat-icon" style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(170, 124, 17, 0.05))',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f3cf7a',
                  fontSize: '20px'
                }}>
                  <i className="fas fa-volume-up"></i>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 2px' }}>Dolby Atmos 360°</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>Âm thanh vòm đa chiều</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="vip-feat-item" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="vip-feat-icon" style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(170, 124, 17, 0.05))',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f3cf7a',
                  fontSize: '20px'
                }}>
                  <i className="fas fa-couch"></i>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 2px' }}>Ghế Da Massage VIP</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>Ngả lưng êm ái thư giãn</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="vip-feat-item" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="vip-feat-icon" style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(170, 124, 17, 0.05))',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f3cf7a',
                  fontSize: '20px'
                }}>
                  <i className="fas fa-concierge-bell"></i>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 2px' }}>Phục Vụ Tại Chỗ</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>Thực đơn F&amp;B 5 sao</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Movies Section */}
      <section className="product-section mt-5 pt-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="section-title">
                <span style={{ color: '#f3cf7a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, fontSize: '13px' }}>Đang Chiếu Tại Rạp VIP</span>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '36px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                  Tuyển Tập <span className="gold-highlight">Bom Tấn Điện Ảnh</span>
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px' }}>
                  Thưởng thức những tác phẩm điện ảnh xuất sắc nhất được trình chiếu với công nghệ tối tân.
                </p>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            {featuredMovies.map((movie) => (
              <div key={movie.id} className="col-lg-3 col-md-6 mb-4 text-center d-flex align-items-stretch">
                <div className="single-product-item w-100">
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
                  <div className="single-product-item-body">
                    <h3>
                      <Link to={`/movie/${movie.id}`} title={movie.title}>
                        {movie.title}
                      </Link>
                    </h3>
                    <p className="product-price">
                      <span>{movie.genre_name}</span>
                      <span>{movie.price.toLocaleString('vi-VN')} đ</span>
                    </p>
                    <div className="product-btn-group">
                      <Link
                        to={`/seat?movieId=${movie.id}`}
                        className="movie-book-btn"
                        onClick={() => updateBooking({ movieId: movie.id, seats: [] })}
                      >
                        <i className="fas fa-ticket-alt"></i> Đặt Vé
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
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/movies" className="boxed-btn" style={{
              background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 50%, #aa7c11 100%)',
              color: '#090a0f',
              padding: '12px 34px',
              borderRadius: '50px',
              fontWeight: 800,
              textTransform: 'uppercase',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              Xem Toàn Bộ Lịch Chiếu <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion VIP Banner */}
      <section className="shop-banner mt-5 pt-5 pb-5" style={{
        background: 'radial-gradient(circle at 70% 50%, rgba(212, 175, 55, 0.2), transparent 70%), #0d0f17',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 text-center text-lg-left mb-4 mb-lg-0">
              <span style={{ color: '#f3cf7a', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>ƯU ĐÃI ĐỘC QUYỀN THÁNG NÀY</span>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '38px', fontWeight: 900, color: '#fff', margin: '10px 0 16px' }}>
                ĐẶT VÉ NHÓM VIP <span className="gold-highlight">GIẢM NGAY 25%</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', maxWidth: '520px' }}>
                Áp dụng cho mọi suất chiếu từ thứ Hai đến thứ Năm tại các phòng chiếu VIP IMAX Laser &amp; Gold Class. Tặng kèm bắp caramel khi thanh toán qua mã QR.
              </p>
              <Link to="/movies" className="boxed-btn" style={{
                background: 'linear-gradient(135deg, #f3cf7a 0%, #d4af37 100%)',
                color: '#090a0f',
                padding: '12px 28px',
                borderRadius: '50px',
                fontWeight: 800,
                textTransform: 'uppercase',
                display: 'inline-block',
                marginTop: '10px'
              }}>
                Nhận Khuyến Mãi Ngay
              </Link>
            </div>
            <div className="col-lg-5 text-center">
              <img
                src="/assets/img/products/product-img-2.jpg"
                alt="Combo VIP"
                style={{
                  maxWidth: '380px',
                  borderRadius: '20px',
                  border: '2px solid rgba(212, 175, 55, 0.4)',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.8)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Cinema News */}
      <section className="latest-news pt-5 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="section-title">
                <span style={{ color: '#f3cf7a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, fontSize: '13px' }}>Tin Tức &amp; Điện Ảnh</span>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '34px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                  Thông Tin <span className="gold-highlight">Cine VIP</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="row">
            {newsArticles.map((article) => (
              <div key={article.id} className="col-lg-4 col-md-6 mb-4">
                <div className="promo-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="latest-news-bg"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />
                  <div style={{ padding: '16px 6px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: '#f3cf7a', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                      <i className="far fa-calendar-alt mr-1"></i> {article.date} | <i className="fas fa-user mr-1"></i> {article.author}
                    </div>
                    <h4 style={{ margin: '0 0 10px' }}>
                      <Link to="/news">{article.title}</Link>
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13.5px', flex: 1 }}>{article.summary}</p>
                    <Link to="/news" style={{ color: '#f3cf7a', fontWeight: 700, fontSize: '13px', textDecoration: 'none', marginTop: '10px' }}>
                      Đọc tiếp <i className="fas fa-arrow-right ml-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
