// ============================================
// ENUMS
// ============================================

export type CuisineType =
  | 'west_african'
  | 'east_african'
  | 'north_african'
  | 'central_african'
  | 'southern_african'
  | 'lusophone_african'
  | 'pan_african';

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'on_the_way'
  | 'completed'
  | 'cancelled';

export type OrderType = 'delivery' | 'pickup';

export type UserRole = 'customer' | 'admin';

export type DietaryTag =
  | 'halal'
  | 'vegan'
  | 'vegetarian'
  | 'spicy'
  | 'gluten_free'
  | 'contains_nuts';

// ============================================
// DATABASE MODELS
// ============================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  preferred_language: 'pt' | 'en';
  role: UserRole;
  expo_push_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  [day: string]: { open: string; close: string } | null;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  cuisine_type: CuisineType;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  image_url: string | null;
  logo_url: string | null;
  opening_hours: OpeningHours;
  delivery_fee: number;
  minimum_order: number;
  estimated_delivery_min: number;
  estimated_delivery_max: number;
  delivery_radius_km: number;
  pickup_available: boolean;
  is_active: boolean;
  language: string;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  dietary_tags: DietaryTag[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus;
  order_type: OrderType;
  delivery_address: string | null;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  estimated_delivery_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  order_id: string | null;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

// ============================================
// COMPOSITE TYPES (with relations)
// ============================================

export interface RestaurantWithMenu extends Restaurant {
  menu_categories: (MenuCategory & {
    menu_items: MenuItem[];
  })[];
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
  restaurant?: Restaurant;
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

// ============================================
// API TYPES
// ============================================

export interface CreateOrderPayload {
  restaurant_id: string;
  items: { menu_item_id: string; quantity: number }[];
  order_type: OrderType;
  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  notes?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  order_number: string;
  client_secret: string;
}

export interface ApiError {
  error: string;
  code: string;
}
