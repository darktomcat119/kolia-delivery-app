import { useEffect, useState, type FormEvent } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import type { Restaurant, CuisineType } from '../lib/types';
import { CUISINE_LABELS } from '../lib/types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function RestaurantSettings() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState<CuisineType>('west_african');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [minimumOrder, setMinimumOrder] = useState('');
  const [deliveryMin, setDeliveryMin] = useState('');
  const [deliveryMax, setDeliveryMax] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [pickupAvailable, setPickupAvailable] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [openingHours, setOpeningHours] = useState<
    Record<string, { open: string; close: string } | null>
  >({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await api.get<Restaurant[]>('/api/owner/restaurant');
        if (data.length > 0) {
          const r = data[0];
          setRestaurant(r);
          setName(r.name);
          setDescription(r.description ?? '');
          setCuisineType(r.cuisine_type);
          setAddress(r.address);
          setCity(r.city);
          setPhone(r.phone ?? '');
          setDeliveryFee(String(r.delivery_fee));
          setMinimumOrder(String(r.minimum_order));
          setDeliveryMin(String(r.estimated_delivery_min));
          setDeliveryMax(String(r.estimated_delivery_max));
          setDeliveryRadius(String(r.delivery_radius_km));
          setPickupAvailable(r.pickup_available);
          setIsActive(r.is_active);
          setOpeningHours(r.opening_hours ?? {});
        }
      } catch (err) {
        console.error('Failed to fetch restaurant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updated = await api.patch<Restaurant>(`/api/owner/restaurant/${restaurant.id}`, {
        name,
        description: description || null,
        cuisine_type: cuisineType,
        address,
        city,
        phone: phone || null,
        delivery_fee: parseFloat(deliveryFee),
        minimum_order: parseFloat(minimumOrder),
        estimated_delivery_min: parseInt(deliveryMin),
        estimated_delivery_max: parseInt(deliveryMax),
        delivery_radius_km: parseFloat(deliveryRadius),
        pickup_available: pickupAvailable,
        is_active: isActive,
        opening_hours: openingHours,
      });
      setRestaurant(updated);
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateHours = (day: string, field: 'open' | 'close', value: string) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        open: prev[day]?.open ?? '09:00',
        close: prev[day]?.close ?? '22:00',
        [field]: value,
      },
    }));
  };

  const toggleDay = (day: string) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: prev[day] ? null : { open: '09:00', close: '22:00' },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B6560] font-body">Loading settings...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-[#6B6560] font-body mb-2">No restaurant found</p>
          <p className="text-sm text-[#9C9690] font-body">
            Contact the admin to assign a restaurant to your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold font-body">Restaurant Settings</h1>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium font-body ${
              isActive ? 'bg-[#E8F9EE] text-[#16A34A]' : 'bg-[#FDE8E8] text-[#DC2626]'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-3 rounded-xl bg-[#E8F9EE] text-[#16A34A] text-sm font-body">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-[#FDE8E8] text-[#DC2626] text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Restaurant Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Cuisine Type
              </label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value as CuisineType)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary"
              >
                {Object.entries(CUISINE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">Location & Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">Delivery Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Delivery Fee (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Minimum Order (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Delivery Radius (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={deliveryRadius}
                onChange={(e) => setDeliveryRadius(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Est. Delivery Min (min)
              </label>
              <input
                type="number"
                value={deliveryMin}
                onChange={(e) => setDeliveryMin(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">
                Est. Delivery Max (min)
              </label>
              <input
                type="number"
                value={deliveryMax}
                onChange={(e) => setDeliveryMax(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pickupAvailable}
                  onChange={(e) => setPickupAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                <span className="ms-2 text-sm font-body text-[#6B6560]">Pickup Available</span>
              </label>
            </div>
          </div>
        </div>

        {/* Active toggle */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold font-body">Restaurant Status</h2>
              <p className="text-sm text-[#6B6560] font-body mt-1">
                When inactive, your restaurant won't appear in the app.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-lg font-semibold font-body mb-4">Opening Hours</h2>
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={openingHours[day] !== null && openingHours[day] !== undefined}
                    onChange={() => toggleDay(day)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="w-24 text-sm font-body capitalize">{day}</span>
                {openingHours[day] ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={openingHours[day]?.open ?? '09:00'}
                      onChange={(e) => updateHours(day, 'open', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:border-primary"
                    />
                    <span className="text-[#6B6560] text-sm">to</span>
                    <input
                      type="time"
                      value={openingHours[day]?.close ?? '22:00'}
                      onChange={(e) => updateHours(day, 'close', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-[#9C9690] font-body">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-body font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
