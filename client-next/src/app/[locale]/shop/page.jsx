'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import axios from '@/lib/axios';
import ArtworkModal from '@/components/ArtworkModal';
import '@/styles/Shop.css';

export default function ShopPage() {
  const locale = useLocale();
  const t = useTranslations();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedArtwork, setSelectedArtwork] = useState(null);


  const filters = [
    { key: 'all', label: t('shop.filters.all') },
    { key: 'landscapes', label: t('shop.filters.landscapes') },
    { key: 'abstract', label: t('shop.filters.abstract') },
    { key: 'portraits', label: t('shop.filters.portraits') },
    { key: 'nature', label: t('shop.filters.nature') }
  ];


  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/artworks');
        // IGUAL que GalleryGrid
        setArtworks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError(t('shop.error'));
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [t]);

  const getFilteredArtworks = () => {
    if (!Array.isArray(artworks)) {
      return [];
    }

    let filtered = artworks.filter(artwork => artwork.available === true);


    if (activeFilter !== 'all') {
      filtered = filtered.filter(artwork => {
        const artworkCategory = artwork?.category?.[locale]?.toLowerCase() || '';
        const filterLabel = filters.find(f => f.key === activeFilter)?.label?.toLowerCase() || '';
        return artworkCategory === filterLabel;
      });
    }

    return filtered;
  };

  // Ordenar artworks
  const getSortedArtworks = () => {
    const filtered = getFilteredArtworks() || [];
    let sorted = [...filtered];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'featured':
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
      default:
        break;
    }

    return sorted;
  };

  const displayedArtworks = getSortedArtworks();

  // Handle artwork click
  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <div className="container">
            <h1>{t('shop.title')}</h1>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>{t('shop.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <div className="container">
            <h1>{t('shop.title')}</h1>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <div className="error-message">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
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
                  key={filter.key}
                  className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {filter.label}
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
            <p>
              {displayedArtworks.length === 1
                ? t('shop.resultsOne', { count: displayedArtworks.length })
                : t('shop.resultsOther', { count: displayedArtworks.length })}
            </p>
          </div>

          {/* Products Grid */}
          {displayedArtworks.length === 0 ? (
            <div className="no-results">
              <p>{t('shop.noResults')}</p>
            </div>
          ) : (
            <div className="shop-grid">
              {displayedArtworks.map((artwork) => {
                const imageUrl = artwork.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/artworks/${artwork.image}`
                  : '/placeholder.jpg';

                return (
                  <div
                    key={artwork._id}
                    className="product-card"
                    onClick={() => handleArtworkClick(artwork)}
                  >
                    <div className="product-image-container">
                      <img
                        src={imageUrl}
                        alt={artwork.title?.[locale] || artwork.title?.en}
                        className="product-image"
                      />

                      {/* Si no está disponible */}
                      {!artwork.available && (
                        <div className="sold-badge">{t('shop.badges.sold')}</div>
                      )}

                      {/* Si la obra es destacada */}
                      {artwork.featured && artwork.available && (
                        <div className="featured-badge">{t('shop.badges.featured')}</div>
                      )}

                      <div className="product-overlay">
                        <button
                          className={`btn-add-cart ${!artwork.available ? 'disabled' : ''}`}
                          disabled={!artwork.available}
                        >
                          {!artwork.available
                            ? t('shop.buttons.notAvailable')
                            : t('shop.buttons.viewDetails')}
                        </button>
                      </div>
                    </div>

                    <div className="product-info">
                      {/* Título multilingüe */}
                      <h3 className="product-title">
                        {artwork.title?.[locale] || artwork.title?.en}
                      </h3>

                      {/* Técnica multilingüe */}
                      <p className="product-details">
                        {artwork.technique?.[locale] || artwork.technique?.en}
                      </p>

                      {/* Dimensiones formateadas + Año */}
                      <p className="product-details">
                        {artwork.dimensions
                          ? `${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}`
                          : 'N/A'} · {artwork.year || 'N/A'}
                      </p>

                      {/* Precio */}
                      {artwork.price && (
                        <p className="product-price">
                          €{artwork.price.toLocaleString()}
                        </p>
                      )}

                      {/* Botón principal */}
                      <button className="btn-primary btn-full">
                        {t('shop.buttons.addToCart')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
          <p>{t('shop.cta.text')}</p>
          <button className="btn-primary">{t('shop.cta.button')}</button>
        </div>
      </section>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
