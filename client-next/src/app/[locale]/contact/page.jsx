'use client'

import { useTranslations } from 'next-intl';
import '@/styles/Contact.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';

export default function Contact() {

    const t = useTranslations();
    const searchParams = useSearchParams();
    const formType = searchParams.get('type'); // 'commission' o null
    const isCommission = formType === 'commission';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        // Campos adicionales para comisiones
        artworkType: '',
        dimensions: '',
        budget: '',
        // Honeypots
        phone_optional: '',
        company_name: '',
        mailing_address: ''
    });

    const [formStartTime] = useState(Date.now());
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [decodedEmail, setDecodedEmail] = useState('Loading...');


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (message.text) setMessage({ type: '', text: '' });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = t('contact.form.errors.nameRequired');
        if (!formData.email.trim()) {
            newErrors.email = t('contact.form.errors.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('contact.form.errors.emailInvalid');
        }

        // Validaciones específicas para comisiones
        if (isCommission) {
            if (!formData.artworkType.trim()) {
                newErrors.artworkType = t('contact.commission.errors.artworkTypeRequired');
            }
            if (!formData.dimensions.trim()) {
                newErrors.dimensions = t('contact.commission.errors.dimensionsRequired');
            }
        } else {
            // Validación normal de mensaje
            if (!formData.message.trim()) {
                newErrors.message = t('contact.form.errors.messageRequired');
            } else if (formData.message.trim().length < 10) {
                newErrors.message = t('contact.form.errors.messageShort');
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const timeSpent = (Date.now() - formStartTime) / 1000;
        if (timeSpent < 3) {
            setMessage({ type: 'error', text: 'Please take your time filling the form.' });
            return;
        }

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/contact', {
                ...formData,
                formType: isCommission ? 'commission' : 'general'
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: t('contact.form.successMessage') });
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    artworkType: '',
                    dimensions: '',
                    budget: '',
                    phone_optional: '',
                    company_name: '',
                    mailing_address: ''
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || t('contact.errorMessage')
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const encoded = 'bWlubmFrYXR0ZWx1c0BnbWFpbC5jb20=';
        setDecodedEmail(window.atob(encoded));
    }, []);

    useEffect(() => {
        const artworkName = searchParams.get('artwork');
        const typeParam = searchParams.get('type'); // ← Obtener type también

        if (artworkName) {
            setFormData(prev => ({
                ...prev,
                subject: `Inquiry about: ${decodeURIComponent(artworkName)}`
            }));
        } else if (typeParam === 'commission') { // ← Verificar tipo
            setFormData(prev => ({
                ...prev,
                subject: 'Commission Request'
            }));
        }
    }, [searchParams]);

    return (
        <div className="contact-page">
            <div className="contact-header">
                <div className="container">
                    <h1>
                        {isCommission ? t('contact.commission.title') : t('contact.title')}
                    </h1>
                    <p className="contact-description">
                        {isCommission ? t('contact.commission.description') : t('contact.description')}
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-form-section">
                            <h2>
                                {isCommission ? t('contact.commission.formTitle') : t('contact.form.title')}
                            </h2>

                            {message.text && (
                                <div className={`message-alert ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">{t('contact.form.name')} <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={errors.name ? 'error' : ''}
                                        placeholder={t('contact.form.placeholders.name')}
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">{t('contact.form.email')} <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? 'error' : ''}
                                        placeholder={t('contact.form.placeholders.email')}
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
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
                                        readOnly={isCommission}
                                    />
                                </div>

                                {/* Formulario Condicional */}
                                {isCommission ? (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="artworkType">
                                                {t('contact.commission.artworkType')} <span className="required">*</span>
                                            </label>
                                            <select
                                                id="artworkType"
                                                name="artworkType"
                                                value={formData.artworkType}
                                                onChange={handleChange}
                                                className={errors.artworkType ? 'error' : ''}
                                            >
                                                <option value="">{t('contact.commission.selectType')}</option>
                                                <option value="landscape">{t('gallery.filters.landscapes')}</option>
                                                <option value="abstract">{t('gallery.filters.abstract')}</option>
                                                <option value="portrait">{t('gallery.filters.portraits')}</option>
                                                <option value="nature">{t('gallery.filters.nature')}</option>
                                                <option value="other">{t('contact.commission.other')}</option>
                                            </select>
                                            {errors.artworkType && <span className="error-message">{errors.artworkType}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="dimensions">
                                                {t('contact.commission.dimensions')} <span className="required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="dimensions"
                                                name="dimensions"
                                                value={formData.dimensions}
                                                onChange={handleChange}
                                                className={errors.dimensions ? 'error' : ''}
                                                placeholder={t('contact.commission.dimensionsPlaceholder')}
                                            />
                                            {errors.dimensions && <span className="error-message">{errors.dimensions}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="budget">{t('contact.commission.budget')}</label>
                                            <input
                                                type="text"
                                                id="budget"
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                placeholder={t('contact.commission.budgetPlaceholder')}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="message">{t('contact.commission.additionalDetails')}</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="6"
                                                placeholder={t('contact.commission.detailsPlaceholder')}
                                            ></textarea>
                                        </div>
                                    </>
                                ) : (
                                    <div className="form-group">
                                        <label htmlFor="message">{t('contact.form.message')}<span className="required">*</span></label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={errors.message ? 'error' : ''}
                                            rows="6"
                                            placeholder={t('contact.form.placeholders.message')}
                                        ></textarea>
                                        {errors.message && <span className="error-message">{errors.message}</span>}
                                    </div>
                                )}

                                {/* Honeypot Fields */}
                                <input type="text" name="phone_optional" value={formData.phone_optional} onChange={handleChange} tabIndex="-1" autoComplete="off" style={{
                                    opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden'
                                }} />
                                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} tabIndex="-1" autoComplete="off" style={{
                                    opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden'
                                }} />
                                <input type="text" name="mailing_address" value={formData.mailing_address} onChange={handleChange} tabIndex="-1" autoComplete="off" style={{
                                    opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden'
                                }} />

                                <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
                                    {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                                </button>
                            </form>
                        </div>

                        <div className="contact-info-section">
                            <h2>{t('contact.info.title')}</h2>

                            <div className="contact-info-items">
                                <div className="contact-info-item">
                                    <div className="info-icon">✉️</div>
                                    <div className="info-content">
                                        <h3>{t('contact.info.email')}</h3>
                                        <p>
                                            <a href={`mailto:${decodedEmail}`} id="contact-email-link">
                                                {decodedEmail}
                                            </a>
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
                                <p>{t('contact.info.responseTime.text')}</p>
                            </div>

                            <div className="studio-visit">
                                <h3>{t('contact.info.studioVisit.title')}</h3>
                                <p>{t('contact.info.studioVisit.text')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}