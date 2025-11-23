import mongoose from 'mongoose';

// 1. CORRECCIÓN: Definimos el esquema con un nombre descriptivo (userSchema)
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    // Es buena práctica no incluir 'required' en el password si usas select: false
    // pero lo mantenemos si el password se genera al crear el usuario.
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Asegura que no se envíe en consultas find() por defecto
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'viewer'],
        default: 'viewer'
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpire: {
        type: Date,
        default: null
    },
    createdBy: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// 2. CORRECCIÓN: Referenciamos el esquema correctamente para definir los índices
// Index para búsquedas rápidas
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Creamos el Modelo y lo exportamos por defecto para ser compatible con ESM
const User = mongoose.model('User', userSchema);
export default User;