import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types';

const useAuthStore = create<AuthState & {
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  
  initialize: async () => {
    try {
      set({ loading: true });
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          set({
            user: {
              id: user.id,
              email: user.email || '',
            },
            session,
          });
        }
      }
      
      // Set up the auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          const user = session.user;
          set({
            user: user ? {
              id: user.id,
              email: user.email || '',
            } : null,
            session,
          });
        } else {
          set({ user: null, session: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ error: error instanceof Error ? error.message : 'Authentication error' });
    } finally {
      set({ loading: false });
    }
  },
  
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // User data will be set by the onAuthStateChange listener
    } catch (error) {
      console.error('Sign up error:', error);
      set({ error: error instanceof Error ? error.message : 'Sign up failed' });
    } finally {
      set({ loading: false });
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // User data will be set by the onAuthStateChange listener
    } catch (error) {
      console.error('Sign in error:', error);
      set({ error: error instanceof Error ? error.message : 'Sign in failed' });
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await supabase.auth.signOut();
      // User data will be cleared by the onAuthStateChange listener
    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: error instanceof Error ? error.message : 'Sign out failed' });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;