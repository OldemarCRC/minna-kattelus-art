import xss from 'xss';

// Configuración personalizada de XSS
const xssOptions = {
  whiteList: {}, // No permitir ningún tag HTML
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
};

// Sanitizar string individual
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return xss(input.trim(), xssOptions);
};

// Sanitizar objeto completo
export const sanitizeObject = (obj) => {
  const sanitized = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};