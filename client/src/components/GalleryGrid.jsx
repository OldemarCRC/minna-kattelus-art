import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import ArtworkModal from './ArtworkModal';
import './GalleryGrid.css';


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
      const response = await axios.get('/api/artworks');
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
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/artworks/${artwork.image}`}
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
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default GalleryGrid;