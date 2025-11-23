import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getAllUsers, deleteUser } from '../controllers/authController.js';
// TODO: Agregar middleware de autenticación para rutas protegidas
// const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', loginUser);

// Protected routes (por ahora sin middleware, agregar después)
router.post('/register', registerUser); // Requiere: protect, authorize('admin')
router.get('/users', getAllUsers);      // Requiere: protect, authorize('admin')
router.delete('/users/:id', deleteUser); // Requiere: protect, authorize('admin')

export default router;