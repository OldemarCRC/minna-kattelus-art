import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['PAISAJES', 'ABSTRACTO', 'RETRATOS', 'NATURALEZA']
  },
  medium: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Artwork = mongoose.model('Artwork', artworkSchema);

export default Artwork;