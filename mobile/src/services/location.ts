import * as Location from 'expo-location';
import { useLocationStore } from '../stores/locationStore';

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<void> {
  const store = useLocationStore.getState();
  store.setLoading(true);

  try {
    const granted = await requestLocationPermission();
    if (!granted) {
      store.setError('Location permission denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // Reverse geocode for address
    const [address] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const addressStr = address
      ? [address.street, address.city, address.region].filter(Boolean).join(', ')
      : undefined;

    store.setLocation(
      location.coords.latitude,
      location.coords.longitude,
      addressStr,
    );
  } catch (err) {
    store.setError(err instanceof Error ? err.message : 'Failed to get location');
  }
}
