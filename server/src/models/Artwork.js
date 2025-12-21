import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      es: { type: String, required: true },
      fi: { type: String, required: true },
      sv: { type: String, required: true }
    },
    description: {
      en: { type: String, required: true },
      es: { type: String, required: true },
      fi: { type: String, required: true },
      sv: { type: String, required: true }
    },
    category: {
      type: String,
      enum: ['TEMAS', 'PAISAJES', 'ABSTRACTO', 'RETRATOS', 'NATURALEZA'],
      required: true
    },
    image: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    technique: {
      en: { type: String, required: true },
      es: { type: String, required: true },
      fi: { type: String, required: true },
      sv: { type: String, required: true }
    },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      unit: { type: String, enum: ['cm', 'in'], default: 'cm' }
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['EUR', 'USD'],
      default: 'EUR'
    },
    available: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Índices para mejorar rendimiento
artworkSchema.index({ category: 1 });
artworkSchema.index({ featured: 1 });
artworkSchema.index({ available: 1 });
artworkSchema.index({ displayOrder: 1 });

const Artwork = mongoose.model('Artwork', artworkSchema);

export default Artwork;