/**
 * Address search via OpenStreetMap Nominatim (no API key).
 * Usage policy: https://operations.osmfoundation.org/policies/nominatim/
 * - 1 request per second, send User-Agent identifying the app.
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'KoliaDelivery/1.0 (food delivery app)';

export interface AddressSuggestion {
  displayName: string;
  latitude: number;
  longitude: number;
}

let lastRequestTime = 0;
const MIN_INTERVAL_MS = 1100;

function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL_MS) {
    return new Promise((resolve) =>
      setTimeout(resolve, MIN_INTERVAL_MS - elapsed)
    );
  }
  return Promise.resolve();
}

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  await waitForRateLimit();
  lastRequestTime = Date.now();

  const params = new URLSearchParams({
    q,
    format: 'json',
    addressdetails: '1',
    limit: '6',
  });

  const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    method: 'GET',
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as Array<{
    display_name?: string;
    lat?: string;
    lon?: string;
  }>;

  return (data || [])
    .filter((item) => item.display_name && item.lat && item.lon)
    .map((item) => ({
      displayName: item.display_name!,
      latitude: parseFloat(item.lat!),
      longitude: parseFloat(item.lon!),
    }));
}
