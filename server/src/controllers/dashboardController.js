import Artwork from '../models/Artwork.js';
import Order from '../models/Order.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get current date info for monthly calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Artwork statistics
    const totalArtworks = await Artwork.countDocuments();
    const availableArtworks = await Artwork.countDocuments({ available: true });
    const soldArtworks = await Artwork.countDocuments({ available: false });
    const featuredArtworks = await Artwork.countDocuments({ featured: true });

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Orders this month
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Revenue calculations
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Revenue this month
    const monthlyRevenueResult = await Order.aggregate([
      { 
        $match: { 
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    // Revenue this year
    const yearlyRevenueResult = await Order.aggregate([
      { 
        $match: { 
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfYear }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const yearlyRevenue = yearlyRevenueResult[0]?.total || 0;

    // Payment status
    const pendingPayments = await Order.countDocuments({ paymentStatus: 'pending' });
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });

    // Monthly sales data for chart (last 12 months)
    const monthlyData = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format monthly data for chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthlyData.map(item => ({
      name: monthNames[item._id.month - 1],
      year: item._id.year,
      revenue: item.revenue,
      orders: item.count
    }));

    res.json({
      success: true,
      data: {
        artworks: {
          total: totalArtworks,
          available: availableArtworks,
          sold: soldArtworks,
          featured: featuredArtworks
        },
        orders: {
          total: totalOrders,
          thisMonth: ordersThisMonth,
          byStatus: {
            pending: pendingOrders,
            confirmed: confirmedOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders
          },
          byPayment: {
            pending: pendingPayments,
            paid: paidOrders
          }
        },
        revenue: {
          total: totalRevenue,
          thisMonth: monthlyRevenue,
          thisYear: yearlyRevenue,
          currency: 'EUR'
        },
        chartData
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
