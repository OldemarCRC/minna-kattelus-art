import { useState } from 'react';
import './Shop.css';

const Shop = () => {
  const [activeFilter, setActiveFilter] = useState('TODAS');
  const [sortBy, setSortBy] = useState('featured');
  
  const filters = ['TODAS', 'PAISAJES', 'ABSTRACTO', 'RETRATOS', 'NATURALEZA'];
  
  const artworks = [
    {
      id: 1,
      title: 'Silencio Blanco',
      category: 'PAISAJES',
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
      category: 'ABSTRACTO',
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
      category: 'NATURALEZA',
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
      category: 'RETRATOS',
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
      category: 'PAISAJES',
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
      category: 'ABSTRACTO',
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
      category: 'PAISAJES',
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
      category: 'ABSTRACTO',
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
  let filteredArtworks = activeFilter === 'TODAS' 
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
          <h1>Tienda</h1>
          <p className="shop-description">
            Obras originales disponibles para adquisición. 
            Cada pieza es única y viene con certificado de autenticidad.
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
              <label htmlFor="sort-select">Ordenar por:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Destacadas</option>
                <option value="newest">Más recientes</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="results-count">
            <p>{filteredArtworks.length} {filteredArtworks.length === 1 ? 'obra' : 'obras'} disponibles</p>
          </div>

          {/* Products Grid */}
          <div className="shop-grid">
            {filteredArtworks.map((artwork) => (
              <div key={artwork.id} className="product-card">
                <div className="product-image-container">
                  <img src={artwork.image} alt={artwork.title} className="product-image" />
                  
                  {!artwork.available && (
                    <div className="sold-badge">VENDIDA</div>
                  )}
                  
                  {artwork.featured && artwork.available && (
                    <div className="featured-badge">DESTACADA</div>
                  )}
                  
                  <div className="product-overlay">
                    <button 
                      className={`btn-add-cart ${!artwork.available ? 'disabled' : ''}`}
                      disabled={!artwork.available}
                    >
                      {artwork.available ? 'Ver Detalles' : 'No Disponible'}
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
                      Agregar al Carrito
                    </button>
                  ) : (
                    <button className="btn-secondary btn-full" disabled>
                      No Disponible
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
              <h3>Obras Originales</h3>
              <p>Cada pieza es una obra original única, pintada a mano por Minna Kattelus.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📜</div>
              <h3>Certificado de Autenticidad</h3>
              <p>Todas las obras incluyen certificado firmado que garantiza su autenticidad.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📦</div>
              <h3>Envío Seguro</h3>
              <p>Embalaje profesional y envío asegurado a toda Europa.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">💬</div>
              <h3>Consultas Personalizadas</h3>
              <p>¿Interesado en una obra? Contáctanos para más información o visita al estudio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container cta-content">
          <h2>¿No encuentras lo que buscas?</h2>
          <p>
            Acepto encargos personalizados. Contacta conmigo para discutir 
            tu visión y crear una obra única para tu espacio.
          </p>
          <button className="btn-primary">Solicitar Encargo</button>
        </div>
      </section>
    </div>
  );
};

export default Shop;