import { createError } from '../utils/error.js';
import { sendContactFormEmail } from '../utils/mailer.js';
import { sanitizeInput } from '../utils/sanitizer.js';

// @desc    Send contact form message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      subject, 
      message, 
      formType,
      // Commission-specific fields
      artworkType,
      dimensions,
      budget,
      phone, 
      email_confirm, 
      full_name_verify 
    } = req.body;

    console.log('Contact form submission - Type:', formType || 'general');
    console.log('Subject received:', subject);

    // HONEYPOTS: Si alguno está lleno = BOT
    if (phone || email_confirm || full_name_verify) {
      console.log('🤖 Bot detected! Honeypot triggered');
      // Responder como si todo estuviera bien para no revelar el honeypot
      return res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully.'
      });
    }

    console.log('✅ Honeypot check passed - processing legitimate message');

    // Sanitizar inputs básicos
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message || '');
    const sanitizedSubject = sanitizeInput(subject || '');

    // Validar campos requeridos
    if (!sanitizedName || !sanitizedEmail) {
      throw createError(400, 'Please provide name and email');
    }

    // Para comisiones, validar campos específicos
    if (formType === 'commission') {
      if (!artworkType || !dimensions) {
        throw createError(400, 'Please provide artwork type and dimensions');
      }
    } else {
      // Para formulario normal, mensaje es requerido
      if (!sanitizedMessage || sanitizedMessage.length < 10) {
        throw createError(400, 'Message must be at least 10 characters long');
      }
    }

    // Validar formato de email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw createError(400, 'Please provide a valid email address');
    }

    // Validar longitud del mensaje si existe
    if (sanitizedMessage && sanitizedMessage.length > 2000) {
      throw createError(400, 'Message must not exceed 2000 characters');
    }

    // Obtener IP del usuario (para logs de seguridad)
    const userIp = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;

    console.log(`📧 Contact from ${sanitizedName} (${sanitizedEmail}) - IP: ${userIp}`);

    // Preparar datos según tipo de formulario
    let emailData = {
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject || 'Contact Form Submission',
      message: sanitizedMessage
    };

    // Agregar datos específicos de comisión
    if (formType === 'commission') {
      emailData = {
        ...emailData,
        formType: 'commission',
        artworkType: sanitizeInput(artworkType),
        dimensions: sanitizeInput(dimensions),
        budget: budget ? sanitizeInput(budget) : 'Not specified'
      };
    }

    // Enviar email
    await sendContactFormEmail(emailData);

    console.log(`✅ Contact email sent successfully to ${process.env.CONTACT_EMAIL}`);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    next(error);
  }
};