import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type UserRole = 'driver' | 'passenger' | null;

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpWithPhone: (phone: string, name: string, role: UserRole) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check auth state on app launch
  useEffect(() => {
    bootstrapAsync();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        if (session?.user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              phone: profile.phone,
              role: profile.role,
              name: profile.name,
              avatar: profile.avatar,
              createdAt: profile.created_at,
            });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Restore token from storage
      const session = await supabase.auth.getSession();
      if (session?.data?.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.data.session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.data.session.user.id,
            email: session.data.session.user.email || '',
            phone: profile.phone,
            role: profile.role,
            name: profile.name,
            avatar: profile.avatar,
            createdAt: profile.created_at,
          });
        }
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authUser) throw new Error('Sign up failed');

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authUser.id,
        email,
        name,
        role,
        created_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      setUser({
        id: authUser.id,
        email,
        role,
        name,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!authUser) throw new Error('Sign in failed');

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          phone: profile.phone,
          role: profile.role,
          name: profile.name,
          avatar: profile.avatar,
          createdAt: profile.created_at,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithPhone = async (phone: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Store phone and name temporarily for OTP verification
      await AsyncStorage.setItem('tempPhone', phone);
      await AsyncStorage.setItem('tempName', name);
      await AsyncStorage.setItem('tempRole', role || 'passenger');

      // Request OTP (this would be handled by your backend)
      // For now, we'll just store the phone for verification
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const name = await AsyncStorage.getItem('tempName');
      const role = (await AsyncStorage.getItem('tempRole')) as UserRole;

      // Verify OTP with backend (implement based on your backend setup)
      // This is a placeholder - implement actual OTP verification

      // Clear temporary data
      await AsyncStorage.removeItem('tempPhone');
      await AsyncStorage.removeItem('tempName');
      await AsyncStorage.removeItem('tempRole');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    signUp,
    signIn,
    signOut,
    signUpWithPhone,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
