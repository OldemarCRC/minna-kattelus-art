'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import axios from '@/lib/axios';
import Link from 'next/link';
import '@/styles/OrderConfirmation.css';

export default function OrderConfirmationPage() {
  const { orderId, locale } = useParams();
  const router = useRouter();
  const t = useTranslations('orderConfirmation');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(t('errors.orderNotFound'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="loading">{t('loading')}</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="error-message">
            <h2>{t('errors.title')}</h2>
            <p>{error || t('errors.orderNotFound')}</p>
            <Link href={`/${locale}/shop`} className="btn-primary">
              {t('backToShop')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="success-icon">✓</div>
        
        <h1>{t('title')}</h1>
        <p className="confirmation-message">{t('message')}</p>

        <div className="order-details-card">
          <div className="order-header">
            <div>
              <h2>{t('orderNumber')}</h2>
              <p className="order-number">{order.orderNumber}</p>
            </div>
            <div className="order-status">
              <span className={`status-badge ${order.status}`}>
                {t(`status.${order.status}`)}
              </span>
            </div>
          </div>

          <div className="details-grid">
            {/* Customer Info */}
            <div className="detail-section">
              <h3>{t('shippingAddress')}</h3>
              <p>{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}, {order.customer.postalCode}</p>
              <p>{order.customer.country}</p>
            </div>

            {/* Contact Info */}
            <div className="detail-section">
              <h3>{t('contactInfo')}</h3>
              <p>{order.customer.email}</p>
              {order.customer.phone && <p>{order.customer.phone}</p>}
            </div>

            {/* Payment Info */}
            <div className="detail-section">
              <h3>{t('paymentMethod')}</h3>
              <p>{t(`payment.${order.paymentMethod}`)}</p>
              <p className="payment-status">
                {t(`paymentStatus.${order.paymentStatus}`)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3>{t('orderItems')}</h3>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/artworks/${item.image}`}
                      alt={item.title[locale] || item.title.en}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.title[locale] || item.title.en}</h4>
                    <p className="item-price">
                      {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>{t('subtotal')}:</span>
                <span>€{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>{t('shipping')}:</span>
                <span>€{order.shipping.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>{t('total')}:</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h3>{t('nextSteps.title')}</h3>
            <ol>
              <li>{t('nextSteps.step1')}</li>
              <li>{t('nextSteps.step2')}</li>
              <li>{t('nextSteps.step3')}</li>
            </ol>
          </div>

          {order.customerNotes && (
            <div className="customer-notes">
              <h3>{t('yourNotes')}</h3>
              <p>{order.customerNotes}</p>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button 
            onClick={() => window.print()} 
            className="btn-secondary"
          >
            {t('printOrder')}
          </button>
          <Link href={`/${locale}/shop`} className="btn-primary">
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}