import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './GalleryGrid.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = ['TEMAS', 'PAISAJES', 'ABSTRACTO', 'RETRATOS', 'NATURALEZA'];

const GalleryGrid = () => {
  const { t, i18n } = useTranslation();
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    filterArtworks();
  }, [selectedCategory, artworks]);

  const fetchArtworks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/artworks`);
      setArtworks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setLoading(false);
    }
  };

  const filterArtworks = () => {
    if (!selectedCategory) {
      setFilteredArtworks(artworks);
    } else {
      setFilteredArtworks(artworks.filter(art => art.category === selectedCategory));
    }
  };

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedArtwork(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>{t('gallery.loading')}</p>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {/* Category Filter */}
      <div className="category-filter">
        <button
          className={selectedCategory === '' ? 'active' : ''}
          onClick={() => setSelectedCategory('')}
        >
          {t('gallery.filters.all')}
        </button>
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {t(`gallery.categories.${category.toLowerCase()}`)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredArtworks.map(artwork => {
          const currentLang = i18n.language;
          return (
            <div
              key={artwork._id}
              className="gallery-item"
              onClick={() => handleArtworkClick(artwork)}
            >
              <div className="gallery-image">
                <img
                  src={`${API_URL}/uploads/artworks/${artwork.image}`}
                  alt={artwork.title[currentLang] || artwork.title.en}
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <h3>{artwork.title[currentLang] || artwork.title.en}</h3>
                  <p>{artwork.year}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArtworks.length === 0 && (
        <div className="no-artworks">
          <p>{t('gallery.noArtworks')}</p>
        </div>
      )}

      {/* Modal */}
      {selectedArtwork && (
        <div className="artwork-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>
              ✕
            </button>
            
            <div className="modal-grid">
              <div className="modal-image">
                <img
                  src={`${API_URL}/uploads/artworks/${selectedArtwork.image}`}
                  alt={selectedArtwork.title[i18n.language] || selectedArtwork.title.en}
                />
              </div>
              
              <div className="modal-info">
                <h2>{selectedArtwork.title[i18n.language] || selectedArtwork.title.en}</h2>
                <p className="artwork-year">{selectedArtwork.year}</p>
                
                <div className="artwork-details">
                  <p className="artwork-description">
                    {selectedArtwork.description[i18n.language] || selectedArtwork.description.en}
                  </p>
                  
                  <div className="detail-row">
                    <span className="detail-label">{t('gallery.technique')}:</span>
                    <span>{selectedArtwork.technique[i18n.language] || selectedArtwork.technique.en}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">{t('gallery.dimensions')}:</span>
                    <span>
                      {selectedArtwork.dimensions.width} × {selectedArtwork.dimensions.height} {selectedArtwork.dimensions.unit}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">{t('gallery.category')}:</span>
                    <span>{t(`gallery.categories.${selectedArtwork.category.toLowerCase()}`)}</span>
                  </div>
                  
                  {selectedArtwork.available && (
                    <div className="artwork-price">
                      <span className="price-label">{t('gallery.price')}:</span>
                      <span className="price-amount">
                        {selectedArtwork.currency === 'EUR' ? '€' : '$'}
                        {selectedArtwork.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {!selectedArtwork.available && (
                    <div className="sold-badge">
                      {t('gallery.sold')}
                    </div>
                  )}
                  
                  {selectedArtwork.available && (
                    <button className="contact-btn">
                      {t('gallery.inquire')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;