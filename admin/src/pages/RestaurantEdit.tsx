import { useEffect, useState, useRef, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import type { Restaurant, CuisineType } from '../lib/types';
import { CUISINE_LABELS } from '../lib/types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi',
  friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche',
};
const CUISINE_OPTIONS = Object.entries(CUISINE_LABELS) as [CuisineType, string][];

const EMPTY_RESTAURANT: Partial<Restaurant> = {
  name: '',
  description: '',
  cuisine_type: 'west_african',
  address: '',
  city: '',
  country: 'FR',
  latitude: 48.8566,
  longitude: 2.3522,
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (file: File, type: 'cover' | 'logo') => {
    if (type === 'cover') setUploadingCover(true);
    else setUploadingLogo(true);
    setError('');
    try {
      const { url } = await api.uploadRestaurantImage(file, type);
      updateField(type === 'cover' ? 'image_url' : 'logo_url', url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'upload');
    } finally {
      if (type === 'cover') setUploadingCover(false);
      else setUploadingLogo(false);
    }
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
      setError(err instanceof Error ? err.message : 'Échec de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-1.5 text-sm text-[#9C9690] hover:text-[#1A1A1A] transition-colors font-body"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
          <span className="text-[#C4C0BB]">/</span>
          <h1 className="text-xl font-semibold font-body text-[#1A1A1A]">
            {isNew ? 'Nouveau restaurant' : 'Modifier le restaurant'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/restaurants')}
            className="px-5 py-2.5 rounded-2xl border border-[#E5E3E0] text-sm font-body font-medium text-[#6B6560] hover:bg-[#F5F3F0] transition-colors"
          >
            Annuler
          </button>
          <button
            form="restaurant-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-body font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-sm shadow-primary/20"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Enregistrement...' : isNew ? 'Créer' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
          <p className="text-red-700 text-sm font-body">{error}</p>
        </div>
      )}

      <form id="restaurant-form" onSubmit={handleSubmit}>
        {/* Two-column grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
          {/* Left column */}
          <div className="space-y-5">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
              <h2 className="text-base font-semibold font-body text-[#1A1A1A] mb-4">Informations générales</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Nom *</label>
                  <input
                    type="text"
                    value={form.name ?? ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    placeholder="Nom du restaurant"
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Description</label>
                  <textarea
                    value={form.description ?? ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    placeholder="Décrivez votre restaurant..."
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Type de cuisine *</label>
                    <select
                      value={form.cuisine_type ?? 'west_african'}
                      onChange={(e) => updateField('cuisine_type', e.target.value as CuisineType)}
                      className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
                    >
                      {CUISINE_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Téléphone</label>
                    <input
                      type="text"
                      value={form.phone ?? ''}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+33 1 23 45 67 89"
                      className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
              <h2 className="text-base font-semibold font-body text-[#1A1A1A] mb-4">Images</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Image de couverture</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f, 'cover');
                        e.target.value = '';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploadingCover}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary bg-primary/5 text-primary font-body text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
                    >
                      {uploadingCover ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploadingCover ? 'Upload...' : 'Téléverser une image'}
                    </button>
                    <span className="text-xs text-[#9C9690] font-body">ou collez une URL</span>
                  </div>
                  <input
                    type="url"
                    value={form.image_url ?? ''}
                    onChange={(e) => updateField('image_url', e.target.value)}
                    placeholder="https://..."
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  {form.image_url && (
                    <img src={form.image_url} alt="Aperçu couverture" className="mt-2 h-24 w-full object-cover rounded-xl border border-border-light" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Logo</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f, 'logo');
                        e.target.value = '';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary bg-primary/5 text-primary font-body text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
                    >
                      {uploadingLogo ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploadingLogo ? 'Upload...' : 'Téléverser un logo'}
                    </button>
                    <span className="text-xs text-[#9C9690] font-body">ou collez une URL</span>
                  </div>
                  <input
                    type="url"
                    value={form.logo_url ?? ''}
                    onChange={(e) => updateField('logo_url', e.target.value)}
                    placeholder="https://..."
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  {form.logo_url && (
                    <img src={form.logo_url} alt="Aperçu logo" className="mt-2 h-16 w-16 object-contain rounded-xl border border-border-light" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
              <h2 className="text-base font-semibold font-body text-[#1A1A1A] mb-4">Adresse & Localisation</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Adresse *</label>
                  <input
                    type="text"
                    value={form.address ?? ''}
                    onChange={(e) => updateField('address', e.target.value)}
                    required
                    placeholder="12 rue des Saveurs"
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Ville *</label>
                    <input
                      type="text"
                      value={form.city ?? ''}
                      onChange={(e) => updateField('city', e.target.value)}
                      required
                      placeholder="Paris"
                      className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Pays *</label>
                    <input
                      type="text"
                      value={form.country ?? ''}
                      onChange={(e) => updateField('country', e.target.value)}
                      required
                      maxLength={2}
                      placeholder="FR"
                      className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={form.latitude ?? 0}
                      onChange={(e) => updateField('latitude', Number(e.target.value))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={form.longitude ?? 0}
                      onChange={(e) => updateField('longitude', Number(e.target.value))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
              <h2 className="text-base font-semibold font-body text-[#1A1A1A] mb-4">Paramètres de livraison</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Frais de livraison (€)</label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={form.delivery_fee ?? 3.5}
                    onChange={(e) => updateField('delivery_fee', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Commande minimum (€)</label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={form.minimum_order ?? 12}
                    onChange={(e) => updateField('minimum_order', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Délai min. (min)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.estimated_delivery_min ?? 30}
                    onChange={(e) => updateField('estimated_delivery_min', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Délai max. (min)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.estimated_delivery_max ?? 45}
                    onChange={(e) => updateField('estimated_delivery_max', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B6560] font-body mb-1.5">Rayon (km)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={form.delivery_radius_km ?? 5}
                    onChange={(e) => updateField('delivery_radius_km', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="pickup"
                    checked={form.pickup_available ?? true}
                    onChange={(e) => updateField('pickup_available', e.target.checked)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <label htmlFor="pickup" className="text-sm font-body text-[#6B6560]">Retrait disponible</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours — full width */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <h2 className="text-base font-semibold font-body text-[#1A1A1A] mb-4">Horaires d'ouverture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {DAYS.map((day) => {
              const hours = form.opening_hours?.[day];
              const isClosed = !hours;
              return (
                <div key={day} className={`p-3 rounded-xl border transition-colors ${isClosed ? 'border-[#E5E3E0] bg-[#FAFAF7]' : 'border-primary/20 bg-primary/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body font-semibold text-[#1A1A1A]">{DAY_LABELS[day]}</span>
                    <button
                      type="button"
                      onClick={() => toggleDayClosed(day)}
                      className={`px-2 py-0.5 rounded-full text-xs font-body font-medium transition-colors ${
                        isClosed ? 'bg-[#FDE8E8] text-[#DC2626]' : 'bg-[#E8F9EE] text-[#16A34A]'
                      }`}
                    >
                      {isClosed ? 'Fermé' : 'Ouvert'}
                    </button>
                  </div>
                  {!isClosed && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateHours(day, 'open', e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg border border-border font-body text-xs focus:outline-none focus:border-primary bg-white"
                      />
                      <span className="text-[#9C9690] text-xs">–</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateHours(day, 'close', e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg border border-border font-body text-xs focus:outline-none focus:border-primary bg-white"
                      />
                    </div>
                  )}
                  {isClosed && (
                    <p className="text-xs text-[#C4C0BB] font-body">Fermé ce jour</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
