'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import '@/styles/ArtworkModal.css';

const ArtworkModal = ({ artwork, onClose }) => {
  const currentLang = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  if (!artwork) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement cart in next session
    console.log('Add to cart:', artwork._id);
    alert('Cart functionality coming soon!');
  };

  const handleContactForAvailability = () => {
    // Redirect to contact page with pre-filled data
    const artworkTitle = encodeURIComponent(artwork.title[currentLang] || artwork.title.en);
    router.push(`/${currentLang}/contact?artwork=${artworkTitle}`);
  };

  return (
    <div className="artwork-modal-overlay" onClick={handleOverlayClick}>
      <div className="artwork-modal">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-content">
          {/* Image */}
          <div className="modal-image">
            <img
              src={`${API_URL}/uploads/artworks/${artwork.image}`}
              alt={artwork.title[currentLang] || artwork.title.en}
            />
            {artwork.featured && <span className="badge-featured-modal">{t('artworkModal.featured')}</span>}
            {!artwork.available && <span className="badge-sold-modal">{t('artworkModal.sold')}</span>}
          </div>

          {/* Information */}
          <div className="modal-info">
            <h2>{artwork.title[currentLang] || artwork.title.en}</h2>

            <div className="modal-details">
              <p className="category">{artwork.category[currentLang] || artwork.category.en}</p>

              <p className="description">
                {artwork.description[currentLang] || artwork.description.en}
              </p>

              <div className="detail-row">
                <span className="label">{t('artworkModal.technique')}:</span>
                <span>{artwork.technique[currentLang] || artwork.technique.en}</span>
              </div>

              <div className="detail-row">
                <span className="label">{t('artworkModal.year')}:</span>
                <span>{artwork.year}</span>
              </div>

              <div className="detail-row">
                <span className="label">{t('artworkModal.dimensions')}:</span>
                <span>
                  {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
                </span>
              </div>

              {artwork.available && (
                <div className="detail-row price-row">
                  <span className="label">{t('artworkModal.price')}:</span>
                  <span className="price">
                    {artwork.currency === 'EUR' ? '€' : '$'}{artwork.price}
                  </span>
                </div>
              )}
            </div>

            {/* Dynamic Button */}
            <div className="modal-actions">
              {artwork.available ? (
                <button className="btn-add-cart" onClick={handleAddToCart}>
                  {t('artworkModal.addToCart')} - {artwork.currency === 'EUR' ? '€' : '$'}{artwork.price}
                </button>
              ) : (
                <button className="btn-contact" onClick={handleContactForAvailability}>
                  {t('artworkModal.contactForAvailability')}
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
