import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: false,  // Se genera en el controller
    unique: true
  },

  // Customer's locale at checkout time, used to send emails in their language
  locale: {
    type: String,
    enum: ['en', 'es', 'fi', 'sv', 'so'],
    default: 'en'
  },

  // Customer Info
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true }
  },

  // Order Items
  items: [{
    artworkId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Artwork',
      required: true 
    },
    title: { type: Object, required: true }, // {en, es, fi, sv, so}
    image: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true }
  }],

  // Pricing
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'EUR' },

  // Payment
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'credit_card', 'stripe'],
    default: 'bank_transfer'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refund_pending', 'refunded'],
    default: 'pending'
  },

  // Refund details, filled in once a refund is registered
  refund: {
    amount: { type: Number },
    date: { type: Date },
    method: { type: String, enum: ['bank_transfer', 'credit_card', 'stripe', 'other'] },
    reference: { type: String },
    notes: { type: String },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },

  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  // Tracking
  trackingNumber: { type: String },
  
  // Notes
  customerNotes: { type: String },
  adminNotes: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
  shippedAt: { type: Date },
  deliveredAt: { type: Date }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;