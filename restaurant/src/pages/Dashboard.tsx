import { useEffect, useState, useCallback, useRef } from 'react';
import { Package, DollarSign, Clock, ShoppingBag, Bell } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import type { OwnerStats, Order, OrderStatus } from '../lib/types';
import { ORDER_STATUS_LABELS } from '../lib/types';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'Toutes les commandes' },
  { value: 'received', label: 'Reçues' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'ready', label: 'Prêtes' },
  { value: 'on_the_way', label: 'En livraison' },
  { value: 'completed', label: 'Terminées' },
  { value: 'cancelled', label: 'Annulées' },
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
  const [notification, setNotification] = useState<string | null>(null);
  const notifTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restaurantIdsRef = useRef<string[]>([]);

  const showNotification = (message: string) => {
    setNotification(message);
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => setNotification(null), 5000);
  };

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

  // Fetch restaurant IDs for realtime filter
  useEffect(() => {
    const fetchRestaurantIds = async () => {
      try {
        const restaurants = await api.get<{ id: string }[]>('/api/owner/restaurant');
        restaurantIdsRef.current = restaurants.map((r) => r.id);
      } catch {
        // Will fall back to polling only
      }
    };
    fetchRestaurantIds();
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);

    // Realtime subscription for new/updated orders
    const channel = supabase
      .channel('owner-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const record = (payload.new as Record<string, unknown>) ?? {};
          const restaurantId = record.restaurant_id as string | undefined;

          // Only react to orders for our restaurant(s)
          if (restaurantId && restaurantIdsRef.current.length > 0 &&
              !restaurantIdsRef.current.includes(restaurantId)) {
            return;
          }

          if (payload.eventType === 'INSERT') {
            showNotification('Nouvelle commande reçue !');
          } else if (payload.eventType === 'UPDATE') {
            const status = record.status as string | undefined;
            if (status === 'cancelled') {
              showNotification('Une commande a été annulée');
            }
          }

          // Refresh data on any order change
          fetchData();
        },
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
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
        <div className="text-[#6B6560] font-body">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Realtime notification toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-primary text-white shadow-lg animate-[slideIn_0.3s_ease-out] font-body text-sm">
          <Bell size={16} />
          {notification}
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-white/70 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      <h1 className="text-2xl font-semibold font-body mb-8">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<Package size={20} />}
          label="Commandes aujourd'hui"
          value={stats?.orders_today ?? 0}
        />
        <StatsCard
          icon={<DollarSign size={20} />}
          label="Revenu aujourd'hui"
          value={`€${(stats?.revenue_today ?? 0).toFixed(2)}`}
        />
        <StatsCard
          icon={<Clock size={20} />}
          label="Commandes en attente"
          value={stats?.pending_orders ?? 0}
        />
        <StatsCard
          icon={<ShoppingBag size={20} />}
          label="Total commandes"
          value={stats?.total_orders ?? 0}
        />
      </div>

      {/* Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-light">
        <div className="p-6 border-b border-border-light flex items-center justify-between">
          <h2 className="text-lg font-semibold font-body">Commandes</h2>
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
                    Articles
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Total
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Statut
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#6B6560] font-body">
                    Heure
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
                        <div>{order.profile?.full_name ?? 'Inconnu'}</div>
                        {order.profile?.phone && (
                          <div className="text-xs text-[#9C9690]">{order.profile.phone}</div>
                        )}
                      </td>
                      <td className="p-4 text-sm font-body text-[#6B6560]">
                        {order.order_items?.length ?? 0} article(s)
                        {order.notes && (
                          <div className="text-xs text-[#9C9690] mt-0.5 italic">
                            Note : {order.notes}
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
                        {new Date(order.created_at).toLocaleTimeString('fr-FR', {
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
                              ? 'Mise à jour...'
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
