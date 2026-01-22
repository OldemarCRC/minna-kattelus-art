'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import '@/styles/ArtworkModal.css';

const ArtworkModal = ({ artwork, onClose }) => {
  const currentLang = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { addItem, items } = useCart();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!artwork) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: artwork._id,
      title: artwork.title,
      technique: artwork.technique,
      image: artwork.image,
      price: artwork.price,
      currency: artwork.currency,
      dimensions: artwork.dimensions
    };
    addItem(cartItem);
  };

  const handleContactForAvailability = () => {
    const artworkTitle = encodeURIComponent(artwork.title[currentLang] || artwork.title.en);
    router.push(`/${currentLang}/contact?artwork=${artworkTitle}`);
  };

  const isInCart = items.some(item => item.id === artwork._id);

  return (
    <div className="artwork-modal-overlay" onClick={handleBackdropClick}>
      <div className="artwork-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        <div className="modal-content">
          <div className="modal-image">
            <img
              src={`${API_URL}/uploads/artworks/${artwork.image}`}
              alt={artwork.title[currentLang] || artwork.title.en}
            />
            {artwork.featured && (
              <span className="badge-featured-modal">
                {t('artworkModal.featured')}
              </span>
            )}
            {!artwork.available && (
              <span className="badge-sold-modal">
                {t('artworkModal.sold')}
              </span>
            )}
          </div>

          <div className="modal-info">
            <h2>{artwork.title[currentLang] || artwork.title.en}</h2>

            <div className="modal-details">
              <p className="category">
                {artwork.category[currentLang] || artwork.category.en}
              </p>

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
                  {artwork.dimensions.width} × {artwork.dimensions.height}{' '}
                  {artwork.dimensions.unit}
                </span>
              </div>

              {artwork.available && (
                <div className="detail-row price-row">
                  <span className="label">{t('artworkModal.price')}:</span>
                  <span className="price">
                    {artwork.currency === 'EUR' ? '€' : '$'}
                    {artwork.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              {artwork.available ? (
                isInCart ? (
                  <button className="btn-in-cart" disabled>
                    {t('artworkModal.inCart')}
                  </button>
                ) : (
                  <button className="btn-add-cart" onClick={handleAddToCart}>
                    {t('artworkModal.addToCart')} -{' '}
                    {artwork.currency === 'EUR' ? '€' : '$'}
                    {artwork.price.toLocaleString()}
                  </button>
                )
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