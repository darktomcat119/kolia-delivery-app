import type { OpeningHours } from '../types';

const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function isRestaurantOpen(openingHours: OpeningHours): boolean {
  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const hours = openingHours[dayName];

  if (!hours) return false;

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= hours.open && currentTime <= hours.close;
}

export function getNextOpenTime(openingHours: OpeningHours): string | null {
  const now = new Date();
  const currentDayIndex = now.getDay();

  // Check today first
  const todayHours = openingHours[DAYS[currentDayIndex]];
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (todayHours && currentTime < todayHours.open) {
    return todayHours.open;
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextHours = openingHours[DAYS[nextDayIndex]];
    if (nextHours) {
      return nextHours.open;
    }
  }

  return null;
}

export function getClosingTime(openingHours: OpeningHours): string | null {
  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const hours = openingHours[dayName];
  return hours?.close ?? null;
}
