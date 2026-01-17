'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import axios from '@/lib/axios';
import ArtworkModal from '@/components/ArtworkModal';
import '@/styles/GalleryGrid.css';

const CATEGORIES = ['landscapes', 'abstract', 'portraits', 'nature'];

const GalleryGrid = () => {
  const locale = useLocale();
  const t = useTranslations();

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
  }, [selectedCategory, artworks, locale]);

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
      setFilteredArtworks(artworks.filter(art => {
        const artworkCategory = (art.category[locale] || art.category.en).toLowerCase();
        return artworkCategory === selectedCategory.toLowerCase();
      }));
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
      <div className="gallery-header">
        <h1>{t('gallery.title')}</h1>
        <p className="gallery-description">{t('gallery.description')}</p>
      </div>
      {/* Category Filter */}
      <div className="category-filter">
        <button
          className={selectedCategory === '' ? 'active' : ''}
          onClick={() => setSelectedCategory('')}
        >
          {t('gallery.filters.all')}
        </button>
        {CATEGORIES.map(category => {
          const translatedCategory = t(`gallery.filters.${category}`);
          return (
            <button
              key={category}
              className={selectedCategory === translatedCategory ? 'active' : ''}
              onClick={() => setSelectedCategory(translatedCategory)}
            >
              {translatedCategory}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredArtworks.map(artwork => {
          return (
            <div
              key={artwork._id}
              className="gallery-item"
              onClick={() => handleArtworkClick(artwork)}
            >
              <div className="gallery-image">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/artworks/${artwork.image}`}
                  alt={artwork.title[locale] || artwork.title.en}
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <h3>{artwork.title[locale] || artwork.title.en}</h3>
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