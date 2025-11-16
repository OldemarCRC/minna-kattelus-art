import { useState } from 'react';
import './Gallery.css';
import { useTranslation } from 'react-i18next';

const Gallery = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('TODAS');
  
  const filters = [t('gallery.filters.all'), t('gallery.filters.landscapes'),t('gallery.filters.abstract'),t('gallery.filters.portraits'),t('gallery.filters.nature')];
  
  const artworks = [
    {
      id: 1,
      title: 'Título de Obra 1',
      category: t('gallery.filters.landscapes'),
      medium: 'Acrílico sobre lienzo',
      size: '60x80 cm',
      year: '2024',
      image: 'https://via.placeholder.com/400x500/8B9FA8/2D4A3E?text=Paisaje+1'
    },
    {
      id: 2,
      title: 'Título de Obra 2',
      category: t('gallery.filters.abstract'),
      medium: 'Óleo sobre lienzo',
      size: '50x70 cm',
      year: '2024',
      image: 'https://via.placeholder.com/400x500/C17B6B/2D4A3E?text=Abstracto+1'
    },
    {
      id: 3,
      title: 'Título de Obra 3',
      category: t('gallery.filters.nature'),
      medium: 'Acrílico sobre lienzo',
      size: '40x60 cm',
      year: '2023',
      image: 'https://via.placeholder.com/400x500/2D4A3E/F5F3F0?text=Naturaleza+1'
    },
    {
      id: 4,
      title: 'Título de Obra 4',
      category: t('gallery.filters.landscapes'),
      medium: 'Acrílico sobre lienzo',
      size: '70x90 cm',
      year: '2023',
      image: 'https://via.placeholder.com/400x500/F5F3F0/2D4A3E?text=Paisaje+2'
    },
    {
      id: 5,
      title: 'Título de Obra 5',
      category: t('gallery.filters.portraits'),
      medium: 'Óleo sobre lienzo',
      size: '50x60 cm',
      year: '2024',
      image: 'https://via.placeholder.com/400x500/8B9FA8/F5F3F0?text=Retrato+1'
    },
    {
      id: 6,
      title: 'Título de Obra 6',
      category: t('gallery.filters.nature'),
      medium: 'Acrílico sobre lienzo',
      size: '60x80 cm',
      year: '2023',
      image: 'https://via.placeholder.com/400x500/C17B6B/F5F3F0?text=Naturaleza+2'
    }
  ];
  
  const filteredArtworks = activeFilter === t('gallery.filters.all') 
    ? artworks 
    : artworks.filter(work => work.category === activeFilter);

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="container">
          <h1>{t('gallery.title')}</h1>
          <p className="gallery-description">
            {t('gallery.description')}
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="gallery-filters">
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

          <div className="gallery-grid">
            {filteredArtworks.map((artwork) => (
              <div key={artwork.id} className="gallery-item">
                <div className="gallery-item-image">
                  <img src={artwork.image} alt={artwork.title} />
                  <div className="gallery-item-overlay">
                    <div className="gallery-item-info">
                      <h3>{artwork.title}</h3>
                      <p>{artwork.medium}</p>
                      <p>{artwork.size} · {artwork.year}</p>
                    </div>
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

export default Gallery;