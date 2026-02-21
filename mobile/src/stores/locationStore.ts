import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;

  setLocation: (lat: number, lng: number, address?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  address: null,
  isLoading: false,
  error: null,

  setLocation: (latitude, longitude, address) =>
    set({ latitude, longitude, address, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),
}));
