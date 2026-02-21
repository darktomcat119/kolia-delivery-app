import { Platform } from 'react-native';

const LOCALHOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || `http://${LOCALHOST}:3000`,
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || `http://${LOCALHOST}:54321`,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
};
