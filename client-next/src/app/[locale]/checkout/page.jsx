'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import '@/styles/Checkout.css';

export default function CheckoutPage() {
  const { items, total, clearCart, removeItem } = useCart();
  const t = useTranslations('checkout');
  const { locale } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    paymentMethod: 'bank_transfer',
    customerNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  // Redirect if cart is empty (but not while submitting or after order created)
  useEffect(() => {
    if (items.length === 0 && !isSubmitting && !orderCreated) {
      router.push(`/${locale}/shop`);
    }
  }, [items, locale, router, isSubmitting, orderCreated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = t('errors.nameRequired');
    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    if (!formData.country.trim()) newErrors.country = t('errors.countryRequired');
    if (!formData.city.trim()) newErrors.city = t('errors.cityRequired');
    if (!formData.address.trim()) newErrors.address = t('errors.addressRequired');
    if (!formData.postalCode.trim()) newErrors.postalCode = t('errors.postalCodeRequired');
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode
        },
        items: items.map(item => ({
          artworkId: item.id,
          title: item.title,
          image: item.image,
          price: item.price,
          currency: item.currency
        })),
        subtotal: total,
        shipping: 0,
        total: total,
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes
      };

      const response = await axios.post('/api/orders', orderData);

      if (response.data.success) {
        setOrderCreated(true); // Mark order as created BEFORE clearing cart
        clearCart();
        router.push(`/${locale}/order-confirmation/${response.data.data._id}`);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      
      // Check if specific artworks are unavailable
      if (error.response?.data?.unavailableArtworks) {
        const unavailable = error.response.data.unavailableArtworks;
        const titles = unavailable.map(a => a.title).join('\n• ');
        
        const userConfirm = confirm(
          `The following artworks are no longer available:\n\n• ${titles}\n\nWould you like to remove them from your cart and continue?`
        );
        
        if (userConfirm) {
          // Remove unavailable items from cart
          unavailable.forEach(artwork => {
            removeItem(artwork.id);
          });
          
          alert('Unavailable items have been removed. Please review your cart and try again.');
        }
      } else {
        alert(error.response?.data?.message || t('errors.orderFailed'));
      }
      
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting && !orderCreated) {
    return null; // Will redirect
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>{t('title')}</h1>

        <div className="checkout-grid">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>{t('orderSummary')}</h2>
            
            <div className="summary-items">
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-image">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/artworks/${item.image}`}
                      alt={item.title[locale] || item.title.en}
                    />
                  </div>
                  <div className="item-info">
                    <h4>{item.title[locale] || item.title.en}</h4>
                    <p className="item-technique">
                      {item.technique[locale] || item.technique.en}
                    </p>
                    <p className="item-dimensions">
                      {item.dimensions.width} × {item.dimensions.height} {item.dimensions.unit}
                    </p>
                  </div>
                  <div className="item-price">
                    {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>{t('subtotal')}:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>{t('shipping')}:</span>
                <span>{t('calculated')}</span>
              </div>
              <div className="summary-row total">
                <span>{t('total')}:</span>
                <span className="total-amount">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-form-section">
            <h2>{t('shippingInfo')}</h2>

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">{t('form.name')} *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('form.email')} *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('form.phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">{t('form.country')} *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={errors.country ? 'error' : ''}
                  />
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="city">{t('form.city')} *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">{t('form.address')} *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">{t('form.postalCode')} *</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={errors.postalCode ? 'error' : ''}
                />
                {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">{t('form.paymentMethod')}</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="bank_transfer">{t('payment.bankTransfer')}</option>
                  <option value="credit_card">{t('payment.creditCard')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="customerNotes">{t('form.notes')}</label>
                <textarea
                  id="customerNotes"
                  name="customerNotes"
                  value={formData.customerNotes}
                  onChange={handleChange}
                  rows="3"
                  placeholder={t('form.notesPlaceholder')}
                />
              </div>

              <button 
                type="submit" 
                className="btn-checkout-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('processing') : t('placeOrder')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}