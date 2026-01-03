import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import {
  sendVerificationEmail,
  sendLoginNotification,
  sendFailLoginNotification,
  sendPasswordChangeNotification
} from '../utils/mailer.js';
import { validatePasswordStrength, generateStrongPassword } from '../utils/passwordValidator.js';

// Helper: Generar JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

export const registerUser = async (req, res, next) => {
  try {
    const { username, fullName, email, role, phone, createdBy } = req.body;

    // Validar campos requeridos (createdBy es opcional para primer usuario)
    if (!username || !fullName || !email || !role) {
      throw createError(400, 'Please provide all required fields');
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw createError(400,
        existingUser.email === email
          ? 'Email already registered'
          : 'Username already taken'
      );
    }

    // Generar contraseña temporal

    const tempPassword = generateStrongPassword(12);

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Generar token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Crear usuario
    const user = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
      role,
      phone: phone || '',
      createdBy: createdBy || 'system',
      verificationToken,
      isVerified: false
    });

    // URL de verificación
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Enviar email de verificación
    try {
      await sendVerificationEmail(
        fullName,
        email,
        verificationUrl,
        tempPassword,
        username
      );
      console.log(`Verification email sent to ${email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // No fallar el registro si el email falla
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Verification email sent.',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (email) {
      console.log('Bot detected in login! Honeypot filled');
      // Simular delay de login normal
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    console.log('Honeypot check passed - processing legitimate login');

    if (!username || !password) {
      throw createError(400, 'Please provide username and password');
    }

    const userIp = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;
    const loginDate = new Date().toLocaleString();


    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      const userByEmail = await User.findOne({ email: username });
      if (userByEmail) {
        try {
          await sendFailLoginNotification(
            userByEmail.email,
            userByEmail.fullName,
            username,
            loginDate,
            userIp
          );
        } catch (emailError) {
          console.error('Failed login notification error:', emailError);
        }
      }
      throw createError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      try {
        await sendFailLoginNotification(
          user.email,
          user.fullName,
          username,
          loginDate,
          userIp
        );
      } catch (emailError) {
        console.error('Failed login notification error:', emailError);
      }
      throw createError(401, 'Invalid credentials');
    }

    if (!user.isActive) {
      throw createError(403, 'Account is deactivated');
    }

    if (!user.isVerified) {
      throw createError(403, 'Please verify your email before logging in');
    }

    // Generar JWT token
    const token = generateToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      path: '/'
    };

    res.cookie('token', token, cookieOptions);
    console.log('Cookie set for user:', user.username);
    console.log('Cookie options:', cookieOptions);

    try {
      await sendLoginNotification(
        user.email,
        user.fullName,
        username,
        loginDate,
        userIp
      );
    } catch (emailError) {
      console.error('Login notification error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    next(error);
  }
};


export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Primero buscar usuario con el token
    let user = await User.findOne({ verificationToken: token });

    if (!user) {

      return res.status(200).json({
        success: true,
        message: 'This verification link has already been used or your account is already verified. You can now log in.',
        alreadyVerified: true
      });
    }

    // Verificar cuenta
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      alreadyVerified: false
    });

  } catch (error) {
    next(error);
  }
};


export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validar campos
    if (!currentPassword || !newPassword) {
      throw createError(400, 'Please provide current and new password');
    }

    // Validar longitud de nueva contraseña
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw createError(400, passwordValidation.errors.join('. '));
    }

    // Buscar usuario
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw createError(404, 'User not found');
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw createError(401, 'Current password is incorrect');
    }

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save({ validateBeforeSave: false });

    // Obtener IP real
    const userIp = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;
    const changeDate = new Date().toLocaleString();

    // Enviar notificación de cambio de contraseña
    try {
      await sendPasswordChangeNotification(
        user.email,
        user.fullName,
        user.username,
        changeDate,
        userIp
      );
    } catch (emailError) {
      console.error('Password change notification error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
};


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password -verificationToken')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw createError(404, 'User not found');
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};