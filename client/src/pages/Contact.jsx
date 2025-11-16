import { useState } from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';


const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simular envío (aquí conectarías con tu backend)
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

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
              
              {submitSuccess && (
                <div className="success-message">
                  {t('contact.form.succes')}
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
                      <a href="mailto:contact@minna-kattelus.fi">contact@minna-kattelus.fi</a>
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