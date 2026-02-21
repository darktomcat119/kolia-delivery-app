import { create } from 'zustand';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  notes: string;

  addItem: (item: CartItem, restaurantId: string, restaurantName: string) => boolean;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,
  notes: '',

  addItem: (item: CartItem, restaurantId: string, restaurantName: string) => {
    const state = get();

    // Check if items are from a different restaurant
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      return false; // Caller should show confirmation dialog
    }

    const existingIndex = state.items.findIndex(
      (i) => i.menu_item_id === item.menu_item_id,
    );

    if (existingIndex >= 0) {
      const newItems = [...state.items];
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + item.quantity,
      };
      set({ items: newItems, restaurantId, restaurantName });
    } else {
      set({
        items: [...state.items, item],
        restaurantId,
        restaurantName,
      });
    }

    return true;
  },

  removeItem: (menuItemId: string) => {
    const newItems = get().items.filter((i) => i.menu_item_id !== menuItemId);
    if (newItems.length === 0) {
      set({ items: [], restaurantId: null, restaurantName: null, notes: '' });
    } else {
      set({ items: newItems });
    }
  },

  updateQuantity: (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }

    const newItems = get().items.map((item) =>
      item.menu_item_id === menuItemId ? { ...item, quantity } : item,
    );
    set({ items: newItems });
  },

  setNotes: (notes: string) => set({ notes }),

  clearCart: () =>
    set({ items: [], restaurantId: null, restaurantName: null, notes: '' }),

  getSubtotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  getItemCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
