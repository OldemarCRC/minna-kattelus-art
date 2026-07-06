import Order from '../models/Order.js';
import Artwork from '../models/Artwork.js';
import { sendOrderConfirmationEmail } from '../utils/mailer.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    console.log('📦 CREATE ORDER - Request received');

    const { customer, items, subtotal, shipping, total, paymentMethod, customerNotes } = req.body;

    // Validate required fields
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customer and items are required'
      });
    }

    console.log('✅ Validating', items.length, 'artworks...');
    // Validate items availability - CHECK ALL FIRST
    const unavailableArtworks = [];

    for (const item of items) {
      const artwork = await Artwork.findById(item.artworkId);

      if (!artwork) {
        console.log('❌ Artwork not found:', item.artworkId);
        unavailableArtworks.push({
          id: item.artworkId,
          title: item.title?.en || 'Unknown',
          reason: 'not_found'
        });
      } else if (!artwork.available) {
        console.log('❌ Artwork not available:', artwork.title.en);
        unavailableArtworks.push({
          id: artwork._id.toString(),
          title: artwork.title.en,
          reason: 'sold'
        });
      } else {
        console.log('✅ Artwork OK:', artwork.title.en);
      }
    }

    // If any artworks unavailable, return complete list
    if (unavailableArtworks.length > 0) {
      console.log('❌ Found', unavailableArtworks.length, 'unavailable artworks');
      return res.status(400).json({
        success: false,
        message: 'Some artworks are no longer available',
        unavailableArtworks
      });
    }

    console.log('✅ All artworks available');

    // Generate order number: ART-2026-0001
    const prefix = process.env.ORDER_PREFIX || 'ART';
    const year = new Date().getFullYear();

    const lastOrder = await Order.findOne({
      orderNumber: new RegExp(`^${prefix}-${year}`)
    }).sort({ orderNumber: -1 });

    const nextNum = lastOrder
      ? parseInt(lastOrder.orderNumber.split('-')[2]) + 1
      : 1;

    const orderNumber = `${prefix}-${year}-${String(nextNum).padStart(4, '0')}`;
    console.log('🔢 Generated order number:', orderNumber);

    // Create order
    // TODO: replace with real payment gateway confirmation once Stripe/Paytrail is integrated. Currently simulated since checkout has no real payment processor yet.
    const order = new Order({
      orderNumber,
      customer,
      items,
      subtotal,
      shipping: shipping || 0,
      total,
      paymentMethod: paymentMethod || 'bank_transfer',
      customerNotes,
      currency: 'EUR',
      paymentStatus: 'paid'
    });

    await order.save();
    console.log('✅ Order created:', order.orderNumber);

    // Mark artworks as unavailable
    const artworkIds = items.map(item => item.artworkId);
    const updateResult = await Artwork.updateMany(
      { _id: { $in: artworkIds } },
      { $set: { available: false } }
    );

    console.log('✅ Artworks updated:', updateResult.modifiedCount);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

    try {
      await sendOrderConfirmationEmail(order);
      console.log('✅ Confirmation email sent to:', customer.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email:', emailError.message);

    }

  } catch (error) {
    console.error('❌ CREATE ORDER ERROR:', error);
    console.error('Stack trace:', error.stack);

    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get order by ID
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('items.artworkId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Get order by order number (for public access)
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber }).populate('items.artworkId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order by number error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.artworkId');

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, adminNotes } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (adminNotes) order.adminNotes = adminNotes;

    if (status === 'shipped' && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};