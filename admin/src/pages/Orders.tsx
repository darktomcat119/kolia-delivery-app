import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Order, OrderStatus } from '../lib/types';
import { ORDER_STATUS_LABELS } from '../lib/types';
import { StatusBadge } from '../components/StatusBadge';
import { StatusDropdown } from '../components/StatusDropdown';
import { OrderDetailModal } from '../components/OrderDetailModal';

const STATUS_FILTERS: (OrderStatus | 'all')[] = [
  'all',
  'received',
  'preparing',
  'ready',
  'on_the_way',
  'completed',
  'cancelled',
];

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await api.get<Order[]>('/api/admin/orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await api.patch(`/api/admin/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B6560] font-body">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold font-body mb-6">Commandes</h1>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-[#6B6560] hover:bg-surface-hover'
            }`}
          >
            {status === 'all' ? 'Toutes' : ORDER_STATUS_LABELS[status]}
            {status !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-light">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[#6B6560] font-body">
            Aucune commande trouvée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    N° commande
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Client
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Restaurant
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Articles
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Total
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Statut
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border-light last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4 text-sm font-medium font-body">
                      {order.order_number}
                    </td>
                    <td className="p-4 text-sm font-body text-[#6B6560]">
                      {order.profile?.full_name ?? 'Inconnu'}
                    </td>
                    <td className="p-4 text-sm font-body text-[#6B6560]">
                      {order.restaurant?.name ?? 'Inconnu'}
                    </td>
                    <td className="p-4 text-sm font-body text-[#6B6560]">
                      {order.order_items?.length ?? 0} article(s)
                    </td>
                    <td className="p-4 text-sm font-body font-medium">
                      €{Number(order.total).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-sm font-body text-[#6B6560]">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <StatusDropdown
                        currentStatus={order.status}
                        onStatusChange={(status) =>
                          handleStatusChange(order.id, status)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
