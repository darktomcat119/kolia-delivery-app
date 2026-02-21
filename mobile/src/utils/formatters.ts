export function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatDeliveryTime(min: number, max: number): string {
  return `${min}–${max}`;
}

export function formatOrderDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTimeGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'greeting.morning';
  if (hour < 18) return 'greeting.afternoon';
  return 'greeting.evening';
}
