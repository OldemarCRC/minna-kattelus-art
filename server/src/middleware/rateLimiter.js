import rateLimit from 'express-rate-limit';

// Rate limiter para login - Más estricto
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login por IP
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Contar todos los intentos
  skipFailedRequests: false,
});

// Rate limiter para formulario de contacto - Moderado
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // Máximo 3 mensajes por IP cada 15 min
  message: {
    success: false,
    message: 'Too many messages sent. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // LOG CUANDO SE BLOQUEA
    console.log('Rate limit exceeded for contact form');
    console.log('   IP:', req.ip);
    console.log('   Time:', new Date().toLocaleString());
    
    res.status(429).json({
      success: false,
      message: 'Too many messages sent. Please try again in 15 minutes.'
    });
  }
});

// Rate limiter para registro de usuarios - Muy estricto
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 registros por IP cada hora
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para verificación de email - Moderado
export const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos de verificación
  message: {
    success: false,
    message: 'Too many verification attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para cambio de contraseña - Estricto
export const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Máximo 5 cambios de contraseña por hora
  message: {
    success: false,
    message: 'Too many password change attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter general para API - Flexible
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadArtworkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Máximo 10 uploads por hora
  message: {
    success: false,
    message: 'Too many upload attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para consultas públicas de artworks
export const publicArtworkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});