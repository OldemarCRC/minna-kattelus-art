import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import User from '../models/User.js';

// Verificar token JWT
export const protect = async (req, res, next) => {
  console.log('[PROTECT] Middleware iniciado');
  console.log('Cookies disponibles:', req.cookies);
  console.log('Authorization header:', req.headers.authorization);
  
  try {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token encontrado en cookie');
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token encontrado en header Authorization');
    }

    if (!token) {
      console.log('No se encontró token');
      throw createError(401, 'Not authorized. Please log in.');
    }

    console.log('Token a verificar:', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verificado correctamente');
    console.log('Usuario decodificado:', decoded.username, '| Role:', decoded.role);

    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('[PROTECT] Usuario no encontrado en BD');
      throw createError(401, 'User no longer exists');
    }

    if (user.sessionToken !== decoded.sessionToken) {
      console.log('[PROTECT] SessionToken no coincide - sesión inválida');
      throw createError(401, 'Your session has been closed because you logged in from another location');
    }

    console.log('[PROTECT] SessionToken válido');

    if (!req.path.includes('/logout')) {
      user.lastActivity = new Date();
      await user.save({ validateBeforeSave: false });
      console.log('[PROTECT] Última actividad actualizada');
    }

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      email: decoded.email
    };

    console.log('[PROTECT] Usuario autenticado:', req.user.username);
    next();
  } catch (error) {
    console.log('[PROTECT] Error:', error.message);
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
    console.log('[AUTHORIZE] Verificando roles');
    console.log('Roles permitidos:', roles);
    console.log('Role del usuario:', req.user?.role);
    
    if (!roles.includes(req.user.role)) {
      console.log('[AUTHORIZE] Acceso denegado - rol insuficiente');
      throw createError(403, 'Access denied. Insufficient permissions.');
    }
    
    console.log('[AUTHORIZE] Acceso permitido');
    next();
  };
};