import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Restaurant, CuisineType } from '../types';

interface RestaurantState {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  selectedCuisine: CuisineType | null;
  searchQuery: string;

  fetchRestaurants: () => Promise<void>;
  setSelectedCuisine: (cuisine: CuisineType | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredRestaurants: () => Restaurant[];
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  isLoading: false,
  error: null,
  selectedCuisine: null,
  searchQuery: '',

  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      set({ restaurants: data ?? [], isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to load restaurants',
        isLoading: false,
      });
    }
  },

  setSelectedCuisine: (cuisine) => set({ selectedCuisine: cuisine }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredRestaurants: () => {
    const { restaurants, selectedCuisine, searchQuery } = get();
    let filtered = restaurants;

    if (selectedCuisine) {
      filtered = filtered.filter((r) => r.cuisine_type === selectedCuisine);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q) ?? false) ||
          r.cuisine_type.replace(/_/g, ' ').includes(q),
      );
    }

    return filtered;
  },
}));
