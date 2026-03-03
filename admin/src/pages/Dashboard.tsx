import { useEffect, useState } from 'react';
import { Package, DollarSign, Store, Clock } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import type { DashboardStats, Order } from '../lib/types';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        api.get<DashboardStats>('/api/admin/stats'),
        api.get<Order[]>('/api/admin/orders'),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 10));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

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
          icon={<Store size={20} />}
          label="Active Restaurants"
          value={stats?.active_restaurants ?? 0}
        />
        <StatsCard
          icon={<Clock size={20} />}
          label="Pending Orders"
          value={stats?.pending_orders ?? 0}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-light">
        <div className="p-6 border-b border-border-light">
          <h2 className="text-lg font-semibold font-body">Recent Orders</h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-[#6B6560] font-body">
            No orders yet
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
                    Restaurant
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Total
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border-light last:border-0 hover:bg-surface-hover transition-colors"
                  >
                    <td className="p-4 text-sm font-medium font-body">
                      {order.order_number}
                    </td>
                    <td className="p-4 text-sm font-body text-[#6B6560]">
                      {order.profile?.full_name ?? 'Unknown'}
                    </td>
                    <td className="p-4 text-sm font-body text-[#6B6560]">
                      {order.restaurant?.name ?? 'Unknown'}
                    </td>
                    <td className="p-4 text-sm font-body">
                      €{Number(order.total).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-sm font-body text-[#6B6560]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
