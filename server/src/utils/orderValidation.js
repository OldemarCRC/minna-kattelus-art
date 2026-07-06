import Order from '../models/Order.js';

// Finds an active (non-cancelled) order that still claims the given artwork
export async function hasActiveOrderForArtwork(artworkId, excludeOrderId = null) {
  const query = {
    'items.artworkId': artworkId,
    status: { $ne: 'cancelled' }
  };

  if (excludeOrderId) {
    query._id = { $ne: excludeOrderId };
  }

  return Order.findOne(query);
}
