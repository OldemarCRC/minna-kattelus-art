'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import '@/styles/Dashboard.css';
import ArtworkManager from '@/components/ArtworkManager';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { getErrorMessage } from '@/lib/apiErrors';
import RefundDialog from '@/components/ui/RefundDialog';

// --- ICONS ---
const Icons = {
  artwork: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  check: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  sold: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  orders: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  pending: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  shipped: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  revenue: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
};

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon, color, onClick }) => (
  <div
    className={`stat-card ${color}${onClick ? ' clickable' : ''}`}
    onClick={onClick}
  >
    <div>
      <p className="card-title">{title}</p>
      <p className="card-value">{typeof value === 'number' ? value.toLocaleString('fi-FI') : value}</p>
    </div>
    <div className="card-icon-wrapper">
      {icon}
    </div>
  </div>
);

// --- REVENUE CHART COMPONENT (Improved) ---

const RevenueChart = ({ data, title }) => {
  const t = useTranslations();
  
  // If no data at all
  if (!data || data.length === 0) {
    return (
      <div className="chart-wrapper">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-empty">
          <p>{t('dashboard.noData')}</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const hasRevenue = data.some(d => d.revenue > 0);

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">{title}</h3>
      {!hasRevenue ? (
        <div className="chart-empty">
          <p>{t('dashboard.noRevenueYet')}</p>
        </div>
      ) : (
        <>
          <div className="chart-bars-container">
            {data.map((item, index) => {
              const heightPercent = (item.revenue / maxRevenue) * 100;
              // Minimum height of 4% if there's any revenue, so it's visible
              const displayHeight = item.revenue > 0 ? Math.max(heightPercent, 4) : 0;
              
              return (
                <div key={index} className="chart-bar-item">
                  {item.revenue > 0 && (
                    <span className="chart-bar-value">
                      €{item.revenue.toLocaleString('fi-FI')}
                    </span>
                  )}
                  <div
                    className="chart-bar"
                    style={{ height: `${displayHeight}%` }}
                    title={`${item.name} ${item.year}: €${item.revenue.toLocaleString('fi-FI')} (${item.orders} ${item.orders === 1 ? 'order' : 'orders'})`}
                  ></div>
                  <span className="chart-bar-label">{item.name}</span>
                </div>
              );
            })}
          </div>
          <p className="chart-summary">
            {t('dashboard.chartPeriod')}: {data.length} {data.length === 1 ? t('dashboard.month') : t('dashboard.months')}
          </p>
        </>
      )}
    </div>
  );
};


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// --- ORDERS TABLE COMPONENT ---
const OrdersTable = ({ orders, locale, onStatusChange, ordersFilter, onRegisterRefund }) => {
  const t = useTranslations();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpanded = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const statusColors = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    processing: 'status-processing',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled'
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>{t(ordersFilter === 'refund_pending' ? 'dashboard.noRefundsPending' : 'dashboard.noOrders')}</p>
      </div>
    );
  }

  return (
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th>{t('dashboard.orderNumber')}</th>
            <th>{t('dashboard.customer')}</th>
            <th>{t('dashboard.items')}</th>
            <th>{t('dashboard.total')}</th>
            <th>{t('dashboard.date')}</th>
            <th>{t('dashboard.status')}</th>
            <th>{t('dashboard.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const firstImage = order.items[0]?.image;
            const thumbnailSrc = firstImage
              ? `${API_URL}/uploads/artworks/${firstImage}`
              : '/placeholder.jpg';
            const extraItems = order.items.length - 1;
            const isExpanded = expandedOrderId === order._id;

            return (
            <React.Fragment key={order._id}>
            <tr
              className="order-row"
              onClick={() => toggleExpanded(order._id)}
              aria-expanded={isExpanded}
            >
              <td className="order-number">
                <div className="order-number-cell">
                  <ChevronDown
                    size={16}
                    className={`order-expand-chevron ${isExpanded ? 'expanded' : ''}`}
                  />
                  <div className="order-thumbnail-wrapper">
                    <Image
                      src={thumbnailSrc}
                      alt={order.orderNumber}
                      width={44}
                      height={44}
                      className="order-thumbnail"
                    />
                    {extraItems > 0 && (
                      <span className="order-thumbnail-badge">+{extraItems}</span>
                    )}
                  </div>
                  <span>{order.orderNumber}</span>
                </div>
              </td>
              <td>
                <div className="customer-info">
                  <span className="customer-name">{order.customer.name}</span>
                  <span className="customer-email">{order.customer.email}</span>
                </div>
              </td>
              <td>{order.items.length}</td>
              <td className="order-total">€{order.total.toLocaleString('fi-FI')}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>
                <span className={`status-badge ${statusColors[order.status]}`}>
                  {t(`dashboard.statuses.${order.status}`)}
                </span>
              </td>
              <td>
                {ordersFilter === 'refund_pending' ? (
                  <button
                    type="button"
                    className="btn-refund"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegisterRefund(order);
                    }}
                  >
                    {t('dashboard.registerRefund')}
                  </button>
                ) : (
                  <select
                    className="status-select"
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {t(`dashboard.statuses.${status}`)}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
            {isExpanded && (
              <tr className="order-details-row">
                <td colSpan={7}>
                  <div className="order-details-panel">
                    {order.items.map((item, index) => {
                      const itemThumbnailSrc = item.image
                        ? `${API_URL}/uploads/artworks/${item.image}`
                        : '/placeholder.jpg';
                      const itemTitle = item.title?.[locale] || item.title?.en || '—';

                      return (
                        <div key={`${order._id}-item-${index}`} className="order-detail-item">
                          <Image
                            src={itemThumbnailSrc}
                            alt={itemTitle}
                            width={48}
                            height={48}
                            className="order-detail-thumbnail"
                          />
                          <div className="order-detail-item-info">
                            <span className="order-detail-item-title">{itemTitle}</span>
                            <span className="order-detail-item-price">
                              {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            )}
            </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShow404, setShouldShow404] = useState(false);
  
  // Dashboard data
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersFilter, setOrdersFilter] = useState('all');
  const [refundOrder, setRefundOrder] = useState(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [artworkFilter, setArtworkFilter] = useState('all');
  const artworkSectionRef = useRef(null);
  const ordersSectionRef = useRef(null);

  // Auth check
  useEffect(() => {
    const userStr = sessionStorage.getItem('user');

    if (!userStr) {
      setShouldShow404(true);
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(userStr);

    if (user.role !== 'admin' && user.role !== 'editor') {
      setShouldShow404(true);
      setIsLoading(false);
      return;
    }

    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error(t('dashboard.errorLoadingStats'));
      } finally {
        setStatsLoading(false);
      }
    };

    if (currentUser) {
      fetchStats();
    }
  }, [currentUser, t]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        let query = '/api/orders?limit=10';
        if (ordersFilter === 'refund_pending') {
          query += '&paymentStatus=refund_pending';
        } else if (ordersFilter !== 'all') {
          query += `&status=${ordersFilter}`;
        }
        const response = await axios.get(query);
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error(t('dashboard.errorLoadingOrders'));
      } finally {
        setOrdersLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, ordersFilter, t]);

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    const confirmed = await confirm({
      title: t('dashboard.confirmStatusChange'),
      description: t('dashboard.confirmStatusChangeDesc', { status: t(`dashboard.statuses.${newStatus}`) }),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      variant: 'default',
    });

    if (!confirmed) return;

    try {
      const response = await axios.patch(`/api/orders/${orderId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success(t('dashboard.statusUpdated'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMsg = getErrorMessage(t, error, { locale, fallback: t('dashboard.errorUpdatingStatus') });
      toast.error(errorMsg);
    }
  };

  // Open the refund registration dialog for an order
  const handleOpenRefundDialog = (order) => {
    setRefundOrder(order);
    setRefundDialogOpen(true);
  };

  // Refund registered - the order is no longer refund_pending, drop it from this list
  const handleRefundSuccess = (updatedOrder) => {
    setOrders(orders.filter((order) => order._id !== updatedOrder._id));
  };

  // Artwork stat card clicked - apply the matching filter and scroll to Artwork Management
  const handleArtworkStatClick = (filter) => {
    setArtworkFilter(filter);
    artworkSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Order stat card clicked - apply the matching filter and scroll to Recent Orders
  const handleOrderStatClick = (filter) => {
    setOrdersFilter(filter);
    ordersSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Show 404 if not authorized
  if (shouldShow404) {
    notFound();
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{t('admin.dashboardTitle')}</h1>
        </header>

        {/* Artwork Statistics */}
        <section className="dashboard-section">
          <h2 className="section-title">{t('dashboard.artworkStats')}</h2>
          <div className="stats-grid-4">
            <StatCard
              title={t('dashboard.totalArtworks')}
              value={statsLoading ? '...' : stats?.artworks?.total || 0}
              icon={Icons.artwork}
              color="blue"
              onClick={() => handleArtworkStatClick('all')}
            />
            <StatCard
              title={t('dashboard.availableArtworks')}
              value={statsLoading ? '...' : stats?.artworks?.available || 0}
              icon={Icons.check}
              color="green"
              onClick={() => handleArtworkStatClick('available')}
            />
            <StatCard
              title={t('dashboard.soldArtworks')}
              value={statsLoading ? '...' : stats?.artworks?.sold || 0}
              icon={Icons.sold}
              color="purple"
              onClick={() => handleArtworkStatClick('sold')}
            />
            <StatCard
              title={t('dashboard.featuredArtworks')}
              value={statsLoading ? '...' : stats?.artworks?.featured || 0}
              icon={Icons.artwork}
              color="amber"
              onClick={() => handleArtworkStatClick('featured')}
            />
          </div>
        </section>

        {/* Order Statistics */}
        <section className="dashboard-section">
          <h2 className="section-title">{t('dashboard.orderStats')}</h2>
          <div className="stats-grid-4">
            <StatCard
              title={t('dashboard.totalOrders')}
              value={statsLoading ? '...' : stats?.orders?.total || 0}
              icon={Icons.orders}
              color="blue"
              onClick={() => handleOrderStatClick('all')}
            />
            <StatCard
              title={t('dashboard.pendingOrders')}
              value={statsLoading ? '...' : stats?.orders?.byStatus?.pending || 0}
              icon={Icons.pending}
              color="amber"
              onClick={() => handleOrderStatClick('pending')}
            />
            <StatCard
              title={t('dashboard.shippedOrders')}
              value={statsLoading ? '...' : stats?.orders?.byStatus?.shipped || 0}
              icon={Icons.shipped}
              color="indigo"
              onClick={() => handleOrderStatClick('shipped')}
            />
            <StatCard
              title={t('dashboard.deliveredOrders')}
              value={statsLoading ? '...' : stats?.orders?.byStatus?.delivered || 0}
              icon={Icons.check}
              color="green"
              onClick={() => handleOrderStatClick('delivered')}
            />
          </div>
        </section>

        {/* Revenue Statistics */}
        <section className="dashboard-section">
          <h2 className="section-title">{t('dashboard.revenueStats')}</h2>
          <div className="stats-grid-3">
            <StatCard 
              title={t('dashboard.totalRevenue')} 
              value={statsLoading ? '...' : `€${(stats?.revenue?.total || 0).toLocaleString('fi-FI')}`} 
              icon={Icons.revenue}
              color="green" 
            />
            <StatCard 
              title={t('dashboard.monthlyRevenue')} 
              value={statsLoading ? '...' : `€${(stats?.revenue?.thisMonth || 0).toLocaleString('fi-FI')}`} 
              icon={Icons.revenue}
              color="blue" 
            />
            <StatCard 
              title={t('dashboard.yearlyRevenue')} 
              value={statsLoading ? '...' : `€${(stats?.revenue?.thisYear || 0).toLocaleString('fi-FI')}`} 
              icon={Icons.revenue}
              color="purple" 
            />
          </div>
        </section>

        {/* Revenue Chart */}
        <section className="dashboard-section">
          <RevenueChart 
            data={stats?.chartData || []} 
            title={t('dashboard.revenueChart')} 
          />
        </section>

        {/* Recent Orders */}
        <section className="dashboard-section" ref={ordersSectionRef}>
          <h2 className="section-title">{t('dashboard.recentOrders')}</h2>
          <div className="orders-filter-tabs">
            <button
              type="button"
              className={`filter-tab ${ordersFilter === 'all' ? 'active' : ''}`}
              onClick={() => setOrdersFilter('all')}
            >
              {t('dashboard.filterAll')}
            </button>
            <button
              type="button"
              className={`filter-tab ${ordersFilter === 'refund_pending' ? 'active' : ''}`}
              onClick={() => setOrdersFilter('refund_pending')}
            >
              {t('dashboard.filterPendingRefunds')}
            </button>
          </div>
          {ordersLoading ? (
            <div className="loading-placeholder">{t('common.loading')}</div>
          ) : (
            <OrdersTable
              orders={orders}
              locale={locale}
              onStatusChange={handleStatusChange}
              ordersFilter={ordersFilter}
              onRegisterRefund={handleOpenRefundDialog}
            />
          )}
        </section>

        {/* Artwork Manager */}
        <section className="dashboard-section" ref={artworkSectionRef}>
          <ArtworkManager artworkFilter={artworkFilter} onArtworkFilterChange={setArtworkFilter} />
        </section>

      </div>

      {ConfirmDialog}
      <RefundDialog
        order={refundOrder}
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        onSuccess={handleRefundSuccess}
      />
    </div>
  );
}
