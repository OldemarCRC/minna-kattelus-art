import { createError } from '../utils/error.js';
import { sendContactFormEmail } from '../utils/mailer.js';
import { sanitizeInput } from '../utils/sanitizer.js';

// @desc    Send contact form message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message, phone_optional, company_name, mailing_address } = req.body;

    // HONEYPOTS: Si alguno o todos los campos "phone_optional", "company_name" o "mailing_address" están llenos = BOT
    if (phone_optional || company_name || mailing_address) {
      console.log('Bot detected! Multiple honeypots filled');
      // Responder como si todo estuviera bien para no revelar el honeypot
      return res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully.'
      });
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    console.log('Honeypot check passed - processing legitimate message');

    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      throw createError(400, 'Please provide name, email, and message');
    }
    // Validar campos requeridos
    if (!name || !email || !message) {
      throw createError(400, 'Please provide name, email, and message');
    }

    // Validar formato de email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw createError(400, 'Please provide a valid email address');
    }

    // Validar longitud del mensaje
    if (sanitizedMessage.length < 10) {
      throw createError(400, 'Message must be at least 10 characters long');
    }

    if (sanitizedMessage.length > 2000) {
      throw createError(400, 'Message must not exceed 2000 characters');
    }

    // Obtener IP del usuario (para logs de seguridad)
    const userIp = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;

    console.log(`Contact form submission from ${sanitizedName} (${sanitizedEmail}) - IP: ${userIp}`);

    // Enviar email
    await sendContactFormEmail(sanitizedName, sanitizedEmail, subject, sanitizedMessage);

    console.log(`Contact email sent successfully to ${process.env.CONTACT_EMAIL}`);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    next(error);
  }
};