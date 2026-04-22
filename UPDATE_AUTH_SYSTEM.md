# How to Update Auth System to Use Supabase

## Step 1: Run the SQL
Run `ADD_USERS_TABLE.sql` in your Supabase SQL Editor to create the users table.

## Step 2: Update `src/lib/auth.ts`

Replace the current `useAuth` hook with this Supabase version:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user data from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          setUser(userData);
        }
      }
      setIsLoading(false);
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData) {
            setUser(userData);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Get user data from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userData) {
          setUser(userData);
          return { success: true, user: userData };
        }
      }

      return { success: false, error: 'User not found in database' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Create user in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              name,
              role: 'user' // Default role
            }
          ])
          .select()
          .single();

        if (userError) {
          return { success: false, error: userError.message };
        }

        if (userData) {
          setUser(userData);
          return { success: true, user: userData };
        }
      }

      return { success: false, error: 'Failed to create user' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      if (data && user?.id === userId) {
        setUser(data);
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // If deleting current user, logout
      if (user?.id === userId) {
        logout();
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    login,
    signup,
    logout,
    updateUser,
    deleteUser,
    getAllUsers,
    isAdmin,
    isLoading,
  };
}
```

## Step 3: Update Signup Page

Update `src/app/signup/page.tsx` to use the new `signup` method instead of `createUser`.

## Step 4: Update Signin Page

The signin page already uses `login`, so it should work with the new system.

## Step 5: Enable Email Auth in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Configure email templates if needed

## Step 6: Test

1. Run the SQL to create users table
2. Update the auth.ts file
3. Test signup with a new user
4. Test login with existing users
5. Check that admin button only shows for admin users

## Step 7: Create Admin User

To make an existing user an admin:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'tebia@gmail.com';
```

Or sign up a new admin:
```sql
INSERT INTO public.users (email, name, role) 
VALUES ('admin@yourdomain.com', 'Admin Name', 'admin');
```

## Benefits:
- **Real database storage** - Users saved in Supabase
- **Secure authentication** - Uses Supabase Auth
- **Role-based access** - Admin/user roles in database
- **Scalable** - Ready for production use