import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import type { Restaurant } from '../lib/types';
import { CUISINE_LABELS } from '../lib/types';

export function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name');

    if (!error && data) {
      setRestaurants(data as Restaurant[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await api.patch(`/api/admin/restaurants/${id}`, {
        is_active: !currentActive,
      });
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, is_active: !currentActive } : r,
        ),
      );
    } catch (err) {
      console.error('Failed to toggle restaurant:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/api/admin/restaurants/${id}`);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete restaurant:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B6560] font-body">Loading restaurants...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold font-body">Restaurants</h1>
        <button
          onClick={() => navigate('/restaurants/new')}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-body font-medium text-sm hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} className="inline -mt-0.5" /> Add Restaurant
        </button>
      </div>

      {restaurants.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border-light">
          <p className="text-[#6B6560] font-body mb-4">No restaurants yet</p>
          <button
            onClick={() => navigate('/restaurants/new')}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-body font-medium text-sm hover:bg-primary-dark transition-colors"
          >
            Add Your First Restaurant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden"
            >
              {/* Image */}
              <div className="h-40 bg-gradient-to-br from-primary to-accent relative">
                {restaurant.image_url && (
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Active toggle */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() =>
                      handleToggleActive(restaurant.id, restaurant.is_active)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium font-body ${
                      restaurant.is_active
                        ? 'bg-[#E8F9EE] text-[#16A34A]'
                        : 'bg-[#FDE8E8] text-[#DC2626]'
                    }`}
                  >
                    {restaurant.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold font-body text-lg mb-1">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-[#6B6560] font-body mb-2">
                  {CUISINE_LABELS[restaurant.cuisine_type]} · {restaurant.city}
                </p>
                <div className="text-xs text-[#A39E98] font-body mb-4">
                  Min. €{Number(restaurant.minimum_order).toFixed(2)} · Fee €
                  {Number(restaurant.delivery_fee).toFixed(2)} ·{' '}
                  {restaurant.estimated_delivery_min}–
                  {restaurant.estimated_delivery_max} min
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    className="flex-1 py-2 rounded-xl border border-border text-sm font-body font-medium hover:bg-surface-hover transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/restaurants/${restaurant.id}/menu`)
                    }
                    className="flex-1 py-2 rounded-xl bg-primary/10 text-primary text-sm font-body font-medium hover:bg-primary/20 transition-colors"
                  >
                    Menu
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(restaurant.id, restaurant.name)
                    }
                    className="py-2 px-3 rounded-xl border border-[#FDE8E8] text-[#DC2626] text-sm hover:bg-[#FDE8E8] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
