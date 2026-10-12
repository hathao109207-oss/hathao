import React, { useState } from 'react';
import { newsArticles } from '../data/mockData';

const News = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="news-page">
      <div className="catalog-breadcrumb text-center">
        <div className="container">
          <p style={{ color: '#f3cf7a', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Tin Tức Điện Ảnh &amp; Sự Kiện
          </p>
          <h1 className="catalog-title">TIN TỨC CINETICKET VIP</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row">
          {newsArticles.map(article => (
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
                  <h4 style={{ margin: '0 0 10px', color: '#fff' }}>
                    {article.title}
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13.5px', flex: 1 }}>{article.summary}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f3cf7a',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      marginTop: '10px'
                    }}
                  >
                    Đọc toàn bộ bài viết <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(18, 20, 29, 0.98)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '20px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <div style={{ color: '#f3cf7a', fontSize: '12.5px', fontWeight: 700, marginBottom: '8px' }}>
              {selectedArticle.date} - {selectedArticle.author}
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", color: '#fff', fontSize: '26px', fontWeight: 800, marginBottom: '16px' }}>
              {selectedArticle.title}
            </h2>
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
            />
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.8' }}>
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
