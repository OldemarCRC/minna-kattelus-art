import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Private (admin only)
export const registerUser = async (req, res) => { // CAMBIO: Usamos 'export const'
    try {
        const { username, fullName, email, role, phone, createdBy } = req.body;

        // Validar campos requeridos
        if (!username || !fullName || !email || !role || !createdBy) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            });
        }

        // Generar contraseña temporal
        const tempPassword = crypto.randomBytes(8).toString('hex');

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
            createdBy,
            verificationToken,
            isVerified: false
        });

        // TODO: Enviar email con contraseña temporal y link de verificación
        console.log('Temporary password for', email, ':', tempPassword);
        console.log('Verification token:', verificationToken);

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
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => { // CAMBIO: Usamos 'export const'
    try {
        const { username, password } = req.body;

        // Validar campos
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        // Buscar usuario
        // NOTA: Asumiendo que 'User' tiene un método estático o de instancia para 'select'
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verificar si está activo
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // TODO: Generar JWT token
        // Por ahora, devolver datos del usuario
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
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (admin only)
export const getAllUsers = async (req, res) => { // CAMBIO: Usamos 'export const'
    try {
        const users = await User.find()
            .select('-password -verificationToken -resetPasswordToken')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving users',
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (admin only)
export const deleteUser = async (req, res) => { // CAMBIO: Usamos 'export const'
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting user',
            error: error.message
        });
    }
};