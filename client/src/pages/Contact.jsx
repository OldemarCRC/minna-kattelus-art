import { useState } from 'react';
import './Contact.css';

const Contact = () => {
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
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
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
      console.log('Formulario enviado:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Ocultar mensaje de éxito después de 5 segundos
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
          <h1>Contacto</h1>
          <p className="contact-description">
            ¿Interesado en una obra o tienes alguna consulta? Me encantaría saber de ti.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Envía un Mensaje</h2>
              
              {submitSuccess && (
                <div className="success-message">
                  ✓ ¡Mensaje enviado con éxito! Te responderé pronto.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">
                    Nombre <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Tu nombre"
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Asunto</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Asunto del mensaje"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Mensaje <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'error' : ''}
                    rows="6"
                    placeholder="Escribe tu mensaje aquí..."
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
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2>Información de Contacto</h2>
              
              <div className="contact-info-items">
                <div className="contact-info-item">
                  <div className="info-icon">✉️</div>
                  <div className="info-content">
                    <h3>Email</h3>
                    <p>
                      <a href="mailto:contact@minna-kattelus.fi">contact@minna-kattelus.fi</a>
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">📷</div>
                  <div className="info-content">
                    <h3>Instagram</h3>
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
                    <h3>Ubicación</h3>
                    <p>Helsinki, Finlandia</p>
                  </div>
                </div>
              </div>

              <div className="response-time">
                <h3>Horario de Respuesta</h3>
                <p>
                  Normalmente respondo en 24-48 horas. Si tu consulta es urgente, 
                  por favor indícalo en el asunto del mensaje.
                </p>
              </div>

              <div className="studio-visit">
                <h3>Visitas al Estudio</h3>
                <p>
                  Si estás en Helsinki y te gustaría visitar mi estudio para ver 
                  las obras en persona, contáctame para coordinar una cita. 
                  Las visitas son con cita previa únicamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section contact-faq">
        <div className="container">
          <h2 className="section-title">Preguntas Frecuentes</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>¿Realizas encargos personalizados?</h3>
              <p>
                Sí, acepto encargos personalizados. Contáctame con tus ideas y 
                te proporcionaré un presupuesto y tiempo estimado.
              </p>
            </div>

            <div className="faq-item">
              <h3>¿Envías internacionalmente?</h3>
              <p>
                Actualmente envío a toda Europa. Para envíos fuera de Europa, 
                contáctame para discutir opciones y costos.
              </p>
            </div>

            <div className="faq-item">
              <h3>¿Las obras incluyen certificado?</h3>
              <p>
                Todas mis obras originales incluyen certificado de autenticidad 
                firmado y numerado.
              </p>
            </div>

            <div className="faq-item">
              <h3>¿Ofreces impresiones?</h3>
              <p>
                Actualmente solo vendo obras originales. Si estás interesado en 
                impresiones de edición limitada, contáctame para más información.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;