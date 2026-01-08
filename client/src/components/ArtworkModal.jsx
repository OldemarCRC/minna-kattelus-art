import { useTranslation } from 'react-i18next';
import './ArtworkModal.css';

const ArtworkModal = ({ artwork, onClose }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  if (!artwork) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    // TODO: Implementar carrito en próxima sesión
    console.log('Add to cart:', artwork._id);
    alert('Cart functionality coming soon!');
  };

  const handleContactForAvailability = () => {
    // Redirigir a página de contacto con pre-llenado
    window.location.href = `/contact?artwork=${encodeURIComponent(artwork.title[currentLang] || artwork.title.en)}`;
  };

  return (
    <div className="artwork-modal-overlay" onClick={handleOverlayClick}>
      <div className="artwork-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-content">
          {/* Imagen */}
          <div className="modal-image">
            <img 
              src={`${API_URL}/uploads/artworks/${artwork.image}`} 
              alt={artwork.title[currentLang] || artwork.title.en}
            />
            {artwork.featured && <span className="badge-featured-modal">Featured</span>}
            {!artwork.available && <span className="badge-sold-modal">Sold</span>}
          </div>

          {/* Información */}
          <div className="modal-info">
            <h2>{artwork.title[currentLang] || artwork.title.en}</h2>
            
            <div className="modal-details">
              <p className="category">{artwork.category}</p>
              
              <p className="description">
                {artwork.description[currentLang] || artwork.description.en}
              </p>

              <div className="detail-row">
                <span className="label">Technique:</span>
                <span>{artwork.technique[currentLang] || artwork.technique.en}</span>
              </div>

              <div className="detail-row">
                <span className="label">Year:</span>
                <span>{artwork.year}</span>
              </div>

              <div className="detail-row">
                <span className="label">Dimensions:</span>
                <span>
                  {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
                </span>
              </div>

              {artwork.available && (
                <div className="detail-row price-row">
                  <span className="label">Price:</span>
                  <span className="price">
                    {artwork.currency === 'EUR' ? '€' : '$'}{artwork.price}
                  </span>
                </div>
              )}
            </div>

            {/* Botón dinámico */}
            <div className="modal-actions">
              {artwork.available ? (
                <button className="btn-add-cart" onClick={handleAddToCart}>
                  Add to Cart - {artwork.currency === 'EUR' ? '€' : '$'}{artwork.price}
                </button>
              ) : (
                <button className="btn-contact" onClick={handleContactForAvailability}>
                  Contact for Availability
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;