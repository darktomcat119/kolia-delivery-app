import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          user: profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          set({ user: null, isAuthenticated: false });
        } else if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ user: profile, isAuthenticated: true });
        }
      });
    } catch {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    await get().fetchProfile();
  },

  signUp: async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;

    await get().fetchProfile();
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  updateProfile: async (data: Partial<Profile>) => {
    const userId = get().user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (error) throw error;

    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  fetchProfile: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    set({ user: profile, isAuthenticated: true });
  },
}));
