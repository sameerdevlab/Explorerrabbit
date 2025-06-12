import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types';
import toast from 'react-hot-toast';

const useAuthStore = create<AuthState & {
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  
  initialize: async () => {
    try {
      set({ loading: true, error: null });
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        set({ error: sessionError.message });
        return;
      }
      
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
          },
          session,
          error: null,
        });
      } else {
        set({ user: null, session: null });
      }
      
      // Set up the auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
            },
            session,
            error: null,
            loading: false,
          });
          toast.success(`Welcome back, ${session.user.email}!`);
        } else if (event === 'SIGNED_OUT') {
          set({ 
            user: null, 
            session: null, 
            error: null,
            loading: false,
          });
          toast.success('Signed out successfully');
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
            },
            session,
            error: null,
          });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Authentication error',
        loading: false,
      });
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
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      if (data.user && !data.session) {
        // Email confirmation required
        toast.success('Account created! Please check your email to confirm your account.');
        set({ loading: false });
        return;
      }
      
      if (data.user && data.session) {
        // Auto sign-in successful
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
          },
          session: data.session,
          loading: false,
          error: null,
        });
        toast.success(`Account created successfully! Welcome, ${data.user.email}!`);
      }
      
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      set({ 
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      if (data.user && data.session) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
          },
          session: data.session,
          loading: false,
          error: null,
        });
        toast.success(`Welcome back, ${data.user.email}!`);
      }
      
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      set({ 
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      // Clear state immediately
      set({ 
        user: null, 
        session: null, 
        loading: false,
        error: null,
      });
      
      toast.success('Signed out successfully');
      
    } catch (error) {
      console.error('Sign out error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      set({ 
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
    }
  },
}));

export default useAuthStore;