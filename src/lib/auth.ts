'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
  createdAt: string;
}

/** Hash a password using the Web Crypto API (SHA-256). Not bcrypt-level secure,
 *  but acceptable for local dev. For production, use server-side bcrypt. */
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on mount ──────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        document.cookie = `user-token=${parsed.id}; path=/; max-age=86400`;
      } catch {
        localStorage.removeItem('user');
        document.cookie = 'user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    setIsLoading(false);
  }, []);

  // ── Login ─────────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const hashed = await hashPassword(password);

      const { data, error } = await supabase
        .from('users')
        .select('id, email, username, role, created_at')
        .eq('email', email)
        .eq('password', hashed)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid email or password' };
      }

      const userData: User = {
        id: data.id,
        username: data.username || '',
        email: data.email,
        role: data.role as 'admin' | 'user',
        isAuthenticated: true,
        createdAt: data.created_at,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      document.cookie = `user-token=${userData.id}; path=/; max-age=86400`;

      return { success: true, user: userData };
    } catch (err: any) {
      console.error('[login]', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  // ── Logout ────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    document.cookie = 'user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  // ── Register ──────────────────────────────────────────────────
  const createUser = async (
    input: { username: string; email: string; password: string; role: 'admin' | 'user' },
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const hashed = await hashPassword(input.password);

      const { data, error } = await supabase
        .from('users')
        .insert({
          email: input.email,
          username: input.username,
          name: input.username,
          password: hashed,
          role: input.role,
        })
        .select('id, email, username, role, created_at')
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'Email already registered' };
        }
        return { success: false, error: error.message };
      }

      const newUser: User = {
        id: data.id,
        username: data.username || '',
        email: data.email,
        role: data.role as 'admin' | 'user',
        isAuthenticated: false,
        createdAt: data.created_at,
      };

      return { success: true, user: newUser };
    } catch (err: any) {
      console.error('[createUser]', err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  // ── Update user ───────────────────────────────────────────────
  const updateUser = async (
    userId: string,
    updates: Partial<{ username: string; email: string; role: 'admin' | 'user' }>,
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('users').update(updates).eq('id', userId);
      if (error) return false;

      // Update local state if it's the current user
      if (user && user.id === userId) {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
      return true;
    } catch {
      return false;
    }
  };

  // ── Delete user ───────────────────────────────────────────────
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) return false;

      if (user && user.id === userId) logout();
      return true;
    } catch {
      return false;
    }
  };

  // ── Fetch all users (admin) ───────────────────────────────────
  const getAllUsers = async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, username, role, created_at')
        .order('created_at', { ascending: false });

      if (error) return [];

      return (data || []).map((u: any) => ({
        id: u.id,
        username: u.username || '',
        email: u.email,
        role: u.role as 'admin' | 'user',
        isAuthenticated: false,
        createdAt: u.created_at,
      }));
    } catch {
      return [];
    }
  };

  return {
    user,
    login,
    logout,
    updateUser,
    createUser,
    deleteUser,
    isAdmin: user?.role === 'admin',
    isLoading,
    getAllUsers,
  };
}
