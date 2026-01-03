import { useState, useEffect } from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';


const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone_optional: '', // Additional verification
    company_name: '',   // Additional verification
    mailing_address: '' // Additional verification
  });
  const [formStartTime] = useState(Date.now());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (message.text) {
      setMessage({ type: '', text: '' });
    };
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contact.form.errors.emailInvalid');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.errors.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.form.errors.messageShort');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submission started');
    console.log('Form data:', formData);

    // VALIDAR TIEMPO MÍNIMO
    const timeSpent = (Date.now() - formStartTime) / 1000;
    if (timeSpent < 3) {
      console.log('Form submitted too fast');
      setMessage({
        type: 'error',
        text: 'Please take your time filling the form.'
      });
      return;
    }

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });


    try {
      console.log('Sending request to backend...');

      const response = await axios.post('/api/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone_optional: formData.phone_optional,
        company_name: formData.company_name,
        mailing_address: formData.mailing_address
      });

      console.log('Response status:', response.status);
      const data = response.data;
      console.log('Response data:', data);

      if (data.success) {
        console.log('Message sent successfully');
        setMessage({
          type: 'success',
          text: t('contact.form.successMessage')
        });

        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone_optional: '',
          company_name: '',
          mailing_address: ''
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || t('contact.errorMessage')
      });
    } finally {
      setIsSubmitting(false);
      console.log('Form submission finished');
    }
  };

  useEffect(() => {
    // Email ofuscado en Base64
    const encoded = 'bWlubmFrYXR0ZWx1c0BnbWFpbC5jb20='; // minnakattelus@gmail.com, cambiar cuando tengamos email del dominio
    const emailLink = document.getElementById('contact-email-link');

    if (emailLink) {
      const email = atob(encoded);
      emailLink.textContent = email;
      emailLink.href = '/contact';
    }
  }, []);

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-header">
        <div className="container">
          <h1>{t('contact.title')}</h1>
          <p className="contact-description">
            {t('contact.description')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>{t('contact.form.title')}</h2>

              {message.text && (
                <div className={`message-alert ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">
                    {t('contact.form.name')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder={t('contact.form.placeholders.name')}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    {t('contact.form.email')} <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder={t('contact.form.placeholders.email')}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="subject">{t('contact.form.subject')}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('contact.form.placeholders.subject')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    {t('contact.form.message')} <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'error' : ''}
                    rows="6"
                    placeholder={t('contact.form.placeholders.message')}
                  ></textarea>
                  {errors.message && (
                    <span className="error-message">{errors.message}</span>
                  )}
                </div>

                {/* Additional verification */}
                <input
                  type="text"
                  name="phone_optional"
                  value={formData.phone_optional}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                />

                {/* Additional verification */}
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                />

                {/* Additional verification */}
                <input
                  type="text"
                  name="mailing_address"
                  value={formData.mailing_address}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                />

                <button
                  type="submit"
                  className="btn-primary btn-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2>{t('contact.info.title')}</h2>

              <div className="contact-info-items">
                <div className="contact-info-item">
                  <div className="info-icon">✉️</div>
                  <div className="info-content">
                    <h3>{t('contact.info.email')}</h3>
                    <p>
                      <a id="contact-email-link" href="#">Loading...</a>
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">📷</div>
                  <div className="info-content">
                    <h3>{t('contact.info.instagram')}</h3>
                    <p>
                      <a href="https://instagram.com/minnak_art" target="_blank" rel="noopener noreferrer">
                        @minnak_art
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-content">
                    <h3>{t('contact.info.location')}</h3>
                    <p>{t('contact.info.locationValue')}</p>
                  </div>
                </div>
              </div>

              <div className="response-time">
                <h3>{t('contact.info.responseTime.title')}</h3>
                <p>
                  {t('contact.info.responseTime.text')}
                </p>
              </div>

              <div className="studio-visit">
                <h3>{t('contact.info.studioVisit.title')}</h3>
                <p>
                  {t('contact.info.studioVisit.text')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section contact-faq">
        <div className="container">
          <h2 className="section-title">{t('contact.faq.title')}</h2>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>{t('contact.faq.q1.question')}</h3>
              <p>
                {t('contact.faq.q1.answer')}
              </p>
            </div>

            <div className="faq-item">
              <h3>{t('contact.faq.q2.question')}</h3>
              <p>
                {t('contact.faq.q2.answer')}
              </p>
            </div>

            <div className="faq-item">
              <h3>{t('contact.faq.q3.question')}</h3>
              <p>
                {t('contact.faq.q3.answer')}
              </p>
            </div>

            <div className="faq-item">
              <h3>{t('contact.faq.q4.question')}</h3>
              <p>
                {t('contact.faq.q4.answer')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;