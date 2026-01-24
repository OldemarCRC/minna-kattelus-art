'use client';

import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/styles/Cart.css';

export default function CartPage() {
  const { items, total, removeItem, clearCart } = useCart();
  const t = useTranslations('cart');
  const { locale } = useParams();
  const router = useRouter();

  const handleCheckout = () => {
    router.push(`/${locale}/checkout`);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>{t('title')}</h1>
          <div className="empty-cart">
            <p>{t('empty')}</p>
            <button
              className="btn-continue"
              onClick={() => router.push(`/${locale}/shop`)}
            >
              {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart-header-content">
          <h1>{t('title')}</h1>
          {items.length > 0 && (
            <button className="btn-clear" onClick={clearCart}>
              {t('clearCart')}
            </button>
          )}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="empty-cart">
          <p>{t('empty')}</p>
          <button
            className="btn-continue"
            onClick={() => router.push(`/${locale}/shop`)}
          >
            {t('continueShopping')}
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/artworks/${item.image}`}
                    alt={item.title[locale] || item.title.en}
                  />
                </div>

                <div className="item-details">
                  <h3>{item.title[locale] || item.title.en}</h3>
                  <p className="item-technique">
                    {item.technique[locale] || item.technique.en}
                  </p>
                  <p className="item-dimensions">
                    {item.dimensions.width} × {item.dimensions.height} {item.dimensions.unit}
                  </p>
                </div>

                <div className="item-price">
                  <p className="price">
                    {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                  </p>
                </div>

                <button
                  className="btn-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={t('remove')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>{t('summary')}</h2>

            <div className="summary-row">
              <span>{t('items')}:</span>
              <span>{items.length}</span>
            </div>

            <div className="summary-row total">
              <span>{t('total')}:</span>
              <span className="total-amount">
                €{total.toFixed(2)}
              </span>
            </div>

            <button className="btn-primary btn-checkout" onClick={handleCheckout}>
              {t('checkout')}
            </button>

            <button
              className="btn-secondary btn-continue"
              onClick={() => router.push(`/${locale}/shop`)}
            >
              {t('continueShopping')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}