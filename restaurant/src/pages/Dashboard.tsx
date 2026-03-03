import { useEffect, useState, useCallback } from 'react';
import { Package, DollarSign, Clock, ShoppingBag } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import type { OwnerStats, Order, OrderStatus } from '../lib/types';
import { ORDER_STATUS_LABELS } from '../lib/types';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'received', label: 'Received' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'on_the_way', label: 'On the Way' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: 'preparing',
  preparing: 'ready',
  ready: 'on_the_way',
};

export function Dashboard() {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const [statsData, ordersData] = await Promise.all([
        api.get<OwnerStats>('/api/owner/stats'),
        api.get<Order[]>(`/api/owner/orders${params}`),
      ]);
      setStats(statsData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrder(orderId);
    try {
      await api.patch(`/api/owner/orders/${orderId}/status`, { status: newStatus });
      await fetchData();
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B6560] font-body">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold font-body mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<Package size={20} />}
          label="Orders Today"
          value={stats?.orders_today ?? 0}
        />
        <StatsCard
          icon={<DollarSign size={20} />}
          label="Revenue Today"
          value={`€${(stats?.revenue_today ?? 0).toFixed(2)}`}
        />
        <StatsCard
          icon={<Clock size={20} />}
          label="Pending Orders"
          value={stats?.pending_orders ?? 0}
        />
        <StatsCard
          icon={<ShoppingBag size={20} />}
          label="Total Orders"
          value={stats?.total_orders ?? 0}
        />
      </div>

      {/* Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-light">
        <div className="p-6 border-b border-border-light flex items-center justify-between">
          <h2 className="text-lg font-semibold font-body">Orders</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-[#6B6560] font-body">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Order #
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Customer
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Items
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Total
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Time
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const nextStatus = NEXT_STATUS[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border-light last:border-0 hover:bg-surface-hover transition-colors"
                    >
                      <td className="p-4 text-sm font-medium font-body">
                        {order.order_number}
                      </td>
                      <td className="p-4 text-sm font-body text-[#6B6560]">
                        <div>{order.profile?.full_name ?? 'Unknown'}</div>
                        {order.profile?.phone && (
                          <div className="text-xs text-[#9C9690]">{order.profile.phone}</div>
                        )}
                      </td>
                      <td className="p-4 text-sm font-body text-[#6B6560]">
                        {order.order_items?.length ?? 0} item(s)
                        {order.notes && (
                          <div className="text-xs text-[#9C9690] mt-0.5 italic">
                            Note: {order.notes}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-sm font-body font-medium">
                        €{Number(order.total).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-4 text-sm font-body text-[#6B6560]">
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4">
                        {nextStatus && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, nextStatus)}
                            disabled={updatingOrder === order.id}
                            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-body font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                          >
                            {updatingOrder === order.id
                              ? 'Updating...'
                              : ORDER_STATUS_LABELS[nextStatus]}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
