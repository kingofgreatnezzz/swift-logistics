'use client';

import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
  createdAt: string;
}

// Simulated database of users (in real app, this would be in a database)
export const usersDatabase = [
  {
    id: 'admin-1',
    username: 'tebia',
    email: 'tebia@gmail.com',
    password: 'Password@1', // In real app, this would be hashed
    role: 'admin' as const,
    isAuthenticated: false,
    createdAt: '2026-04-18'
  },
  {
    id: 'user-1',
    username: 'demo_user',
    email: 'user@example.com',
    password: 'Password@123',
    role: 'user' as const,
    isAuthenticated: false,
    createdAt: '2026-04-18'
  }
];

// Debug logging removed for production

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Also set a cookie for middleware
        document.cookie = `user-token=${parsedUser.id}; path=/; max-age=86400`; // 24 hours
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        document.cookie = 'user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find user in database
    const foundUser = usersDatabase.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Create user object without password
    const userData: User = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
      isAuthenticated: true,
      createdAt: foundUser.createdAt
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set cookie for server-side auth
    try {
      document.cookie = `user-token=${userData.id}; path=/; max-age=86400`;
      console.log('Cookie set:', document.cookie);
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
    
    return { success: true, user: userData };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    document.cookie = 'user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    // In a real app, this would update the database
    console.log('Updating user:', userId, updates);
    
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    // Update in simulated database
    const userIndex = usersDatabase.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      usersDatabase[userIndex] = { ...usersDatabase[userIndex], ...updates };
    }
  };

  const createUser = (userData: Omit<User, 'id' | 'isAuthenticated' | 'createdAt'> & { password: string }) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isAuthenticated: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Add to simulated database
    usersDatabase.push({
      ...newUser,
      password: userData.password
    });
    
    return newUser;
  };

  const deleteUser = (userId: string) => {
    // In a real app, this would delete from database
    console.log('Deleting user:', userId);
    
    const index = usersDatabase.findIndex(u => u.id === userId);
    if (index !== -1) {
      usersDatabase.splice(index, 1);
    }
    
    // If deleting current user, logout
    if (user && user.id === userId) {
      logout();
    }
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    login,
    logout,
    updateUser,
    createUser,
    deleteUser,
    isAdmin,
    isLoading,
    // Simple function that doesn't need memoization
    getAllUsers: () => usersDatabase.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }))
  };
}