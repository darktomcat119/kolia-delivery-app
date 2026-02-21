import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import type { Restaurant, CuisineType } from '../lib/types';
import { CUISINE_LABELS } from '../lib/types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const CUISINE_OPTIONS = Object.entries(CUISINE_LABELS) as [CuisineType, string][];

const EMPTY_RESTAURANT: Partial<Restaurant> = {
  name: '',
  description: '',
  cuisine_type: 'west_african',
  address: '',
  city: '',
  country: 'PT',
  latitude: 38.7223,
  longitude: -9.1393,
  phone: '',
  image_url: '',
  logo_url: '',
  delivery_fee: 3.5,
  minimum_order: 12,
  estimated_delivery_min: 30,
  estimated_delivery_max: 45,
  delivery_radius_km: 5,
  pickup_available: true,
  is_active: true,
  opening_hours: Object.fromEntries(
    DAYS.map((d) => [d, { open: '11:00', close: '22:00' }]),
  ),
};

export function RestaurantEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState<Partial<Restaurant>>(EMPTY_RESTAURANT);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setForm(data as Restaurant);
          }
          setLoading(false);
        });
    }
  }, [id, isNew]);

  const updateField = <K extends keyof Restaurant>(
    key: K,
    value: Restaurant[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateHours = (day: string, field: 'open' | 'close', value: string) => {
    setForm((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...(prev.opening_hours?.[day] ?? { open: '11:00', close: '22:00' }),
          [field]: value,
        },
      },
    }));
  };

  const toggleDayClosed = (day: string) => {
    setForm((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: prev.opening_hours?.[day] ? null : { open: '11:00', close: '22:00' },
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isNew) {
        await api.post('/api/admin/restaurants', form);
      } else {
        await api.patch(`/api/admin/restaurants/${id}`, form);
      }
      navigate('/restaurants');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B6560] font-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/restaurants')}
          className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold font-body">
          {isNew ? 'New Restaurant' : 'Edit Restaurant'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[#FDE8E8] text-[#DC2626] text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Name *
              </label>
              <input
                type="text"
                value={form.name ?? ''}
                onChange={(e) => updateField('name', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Description
              </label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Cuisine Type *
              </label>
              <select
                value={form.cuisine_type ?? 'west_african'}
                onChange={(e) =>
                  updateField('cuisine_type', e.target.value as CuisineType)
                }
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              >
                {CUISINE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Phone
              </label>
              <input
                type="text"
                value={form.phone ?? ''}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Address *
              </label>
              <input
                type="text"
                value={form.address ?? ''}
                onChange={(e) => updateField('address', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                City *
              </label>
              <input
                type="text"
                value={form.city ?? ''}
                onChange={(e) => updateField('city', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Country (2-letter code) *
              </label>
              <input
                type="text"
                value={form.country ?? ''}
                onChange={(e) => updateField('country', e.target.value)}
                required
                maxLength={2}
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={form.latitude ?? 0}
                onChange={(e) => updateField('latitude', Number(e.target.value))}
                required
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={form.longitude ?? 0}
                onChange={(e) => updateField('longitude', Number(e.target.value))}
                required
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">
            Delivery Settings
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Delivery Fee (€)
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                value={form.delivery_fee ?? 3.5}
                onChange={(e) =>
                  updateField('delivery_fee', Number(e.target.value))
                }
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Minimum Order (€)
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                value={form.minimum_order ?? 12}
                onChange={(e) =>
                  updateField('minimum_order', Number(e.target.value))
                }
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Est. Min (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={form.estimated_delivery_min ?? 30}
                onChange={(e) =>
                  updateField('estimated_delivery_min', Number(e.target.value))
                }
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Est. Max (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={form.estimated_delivery_max ?? 45}
                onChange={(e) =>
                  updateField('estimated_delivery_max', Number(e.target.value))
                }
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Delivery Radius (km)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={form.delivery_radius_km ?? 5}
                onChange={(e) =>
                  updateField('delivery_radius_km', Number(e.target.value))
                }
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="pickup"
                checked={form.pickup_available ?? true}
                onChange={(e) =>
                  updateField('pickup_available', e.target.checked)
                }
                className="w-4 h-4 rounded accent-primary"
              />
              <label htmlFor="pickup" className="text-sm font-body">
                Pickup Available
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">Images</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Cover Image URL
              </label>
              <input
                type="url"
                value={form.image_url ?? ''}
                onChange={(e) => updateField('image_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Logo URL
              </label>
              <input
                type="url"
                value={form.logo_url ?? ''}
                onChange={(e) => updateField('logo_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">
            Opening Hours
          </h2>
          <div className="space-y-3">
            {DAYS.map((day) => {
              const hours = form.opening_hours?.[day];
              const isClosed = !hours;

              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-body capitalize font-medium">
                    {day}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleDayClosed(day)}
                    className={`px-3 py-1 rounded-full text-xs font-body ${
                      isClosed
                        ? 'bg-[#FDE8E8] text-[#DC2626]'
                        : 'bg-[#E8F9EE] text-[#16A34A]'
                    }`}
                  >
                    {isClosed ? 'Closed' : 'Open'}
                  </button>
                  {!isClosed && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          updateHours(day, 'open', e.target.value)
                        }
                        className="px-3 py-1.5 rounded-lg border border-border font-body text-sm"
                      />
                      <span className="text-sm text-[#6B6560]">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          updateHours(day, 'close', e.target.value)
                        }
                        className="px-3 py-1.5 rounded-lg border border-border font-body text-sm"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-primary text-white font-body font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isNew ? 'Create Restaurant' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/restaurants')}
            className="px-8 py-3 rounded-xl border border-border text-sm font-body font-medium hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
