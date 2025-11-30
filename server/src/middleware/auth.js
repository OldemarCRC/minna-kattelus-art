import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

// Verificar token JWT
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Obtener token de cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. O del header Authorization
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw createError(401, 'Not authorized. Please log in.');
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar datos del usuario a req
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(createError(401, 'Token expired. Please log in again.'));
    } else {
      next(error);
    }
  }
};

// Verificar roles específicos
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw createError(403, 'Access denied. Insufficient permissions.');
    }
    next();
  };
};