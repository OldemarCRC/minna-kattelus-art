import { useState } from 'react';
import './Shop.css';
import { useTranslation } from 'react-i18next';

const Shop = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('TODAS');
  const [sortBy, setSortBy] = useState('featured');
  
  const filters = [t('gallery.filters.all'), t('gallery.filters.landscapes'),t('gallery.filters.abstract'),t('gallery.filters.portraits'),t('gallery.filters.nature')];
  
  const artworks = [
    {
      id: 1,
      title: 'Silencio Blanco',
      category: t('gallery.filters.landscapes'),
      medium: 'Acrílico sobre lienzo',
      size: '80 x 60 cm',
      year: '2024',
      price: 1200,
      available: true,
      featured: true,
      image: 'https://via.placeholder.com/400x500/8B9FA8/2D4A3E?text=Silencio+Blanco'
    },
    {
      id: 2,
      title: 'Luces del Norte',
      category: t('gallery.filters.abstract'),
      medium: 'Óleo sobre lienzo',
      size: '100 x 100 cm',
      year: '2023',
      price: 1800,
      available: true,
      featured: true,
      image: 'https://via.placeholder.com/400x500/C17B6B/2D4A3E?text=Luces+del+Norte'
    },
    {
      id: 3,
      title: 'Bosque de Bruma',
      category: t('gallery.filters.nature'),
      medium: 'Acrílico sobre lienzo',
      size: '70 x 90 cm',
      year: '2024',
      price: 1500,
      available: true,
      featured: true,
      image: 'https://via.placeholder.com/400x500/2D4A3E/F5F3F0?text=Bosque+Bruma'
    },
    {
      id: 4,
      title: 'Contemplación',
      category: t('gallery.filters.portraits'),
      medium: 'Óleo sobre lienzo',
      size: '50 x 70 cm',
      year: '2023',
      price: 1100,
      available: false,
      featured: false,
      image: 'https://via.placeholder.com/400x500/8B9FA8/F5F3F0?text=Contemplacion'
    },
    {
      id: 5,
      title: 'Horizonte Infinito',
      category: t('gallery.filters.landscapes'),
      medium: 'Acrílico sobre lienzo',
      size: '120 x 60 cm',
      year: '2024',
      price: 2000,
      available: true,
      featured: true,
      image: 'https://via.placeholder.com/400x500/F5F3F0/2D4A3E?text=Horizonte+Infinito'
    },
    {
      id: 6,
      title: 'Geometría Orgánica',
      category: t('gallery.filters.abstract'),
      medium: 'Acrílico sobre lienzo',
      size: '80 x 80 cm',
      year: '2023',
      price: 1300,
      available: true,
      featured: false,
      image: 'https://via.placeholder.com/400x500/C17B6B/F5F3F0?text=Geometria+Organica'
    },
    {
      id: 7,
      title: 'Reflejo Invernal',
      category: t('gallery.filters.landscapes'),
      medium: 'Óleo sobre lienzo',
      size: '90 x 70 cm',
      year: '2024',
      price: 1600,
      available: true,
      featured: false,
      image: 'https://via.placeholder.com/400x500/8B9FA8/2D4A3E?text=Reflejo+Invernal'
    },
    {
      id: 8,
      title: 'Forma y Color',
      category: t('gallery.filters.abstract'),
      medium: 'Acrílico sobre lienzo',
      size: '60 x 80 cm',
      year: '2023',
      price: 1250,
      available: true,
      featured: false,
      image: 'https://via.placeholder.com/400x500/2D4A3E/C17B6B?text=Forma+Color'
    }
  ];
  
  // Filtrar por categoría
  let filteredArtworks = activeFilter === t('gallery.filters.all') 
    ? artworks 
    : artworks.filter(work => work.category === activeFilter);
  
  // Ordenar
  if (sortBy === 'price-low') {
    filteredArtworks = [...filteredArtworks].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredArtworks = [...filteredArtworks].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filteredArtworks = [...filteredArtworks].sort((a, b) => b.year - a.year);
  } else if (sortBy === 'featured') {
    filteredArtworks = [...filteredArtworks].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-header">
        <div className="container">
          <h1>{t('shop.title')}</h1>
          <p className="shop-description">
            {t('shop.description')}
          </p>
        </div>
      </div>

      {/* Filters and Sort */}
      <section className="section">
        <div className="container">
          <div className="shop-controls">
            <div className="shop-filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="shop-sort">
              <label htmlFor="sort-select">{t('shop.sort.label')}</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">{t('shop.sort.featured')}</option>
                <option value="newest">{t('shop.sort.newest')}</option>
                <option value="price-low">{t('shop.sort.priceLow')}</option>
                <option value="price-high">{t('shop.sort.priceHigh')}</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="results-count">
            <p>{filteredArtworks.length} {filteredArtworks.length === 1 ? t('shop.results') : t('shop.results_plural')}</p>
          </div>

          {/* Products Grid */}
          <div className="shop-grid">
            {filteredArtworks.map((artwork) => (
              <div key={artwork.id} className="product-card">
                <div className="product-image-container">
                  <img src={artwork.image} alt={artwork.title} className="product-image" />
                  
                  {!artwork.available && (
                    <div className="sold-badge">{t('shop.badges.sold')}</div>
                  )}
                  
                  {artwork.featured && artwork.available && (
                    <div className="featured-badge">{t('shop.badges.featured')}</div>
                  )}
                  
                  <div className="product-overlay">
                    <button 
                      className={`btn-add-cart ${!artwork.available ? 'disabled' : ''}`}
                      disabled={!artwork.available}
                    >
                      {artwork.available ? t('shop.buttons.viewDetails') : t('shop.buttons.notAvailable')}
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3 className="product-title">{artwork.title}</h3>
                  <p className="product-details">{artwork.medium}</p>
                  <p className="product-details">{artwork.size} · {artwork.year}</p>
                  <p className="product-price">€{artwork.price.toLocaleString()}</p>
                  
                  {artwork.available ? (
                    <button className="btn-primary btn-full">
                      {t('shop.buttons.addToCart')}
                    </button>
                  ) : (
                    <button className="btn-secondary btn-full" disabled>
                      {t('shop.buttons.notAvailable')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section shop-info-section">
        <div className="container">
          <div className="shop-info-grid">
            <div className="info-card">
              <div className="info-icon">🎨</div>
              <h3>{t('shop.info.original.title')}</h3>
              <p>{t('shop.info.original.text')}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📜</div>
              <h3>{t('shop.info.certificate.title')}</h3>
              <p>{t('shop.info.certificate.text')}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📦</div>
              <h3>{t('shop.info.shipping.title')}</h3>
              <p>{t('shop.info.shipping.text')}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">💬</div>
              <h3>{t('shop.info.consultation.title')}</h3>
              <p>{t('shop.info.consultation.text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container cta-content">
          <h2>{t('shop.cta.title')}</h2>
          <p>
            {t('shop.cta.text')}
          </p>
          <button className="btn-primary">{t('shop.cta.button')}</button>
        </div>
      </section>
    </div>
  );
};

export default Shop;