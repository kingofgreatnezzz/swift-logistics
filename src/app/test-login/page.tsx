'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function TestLoginPage() {
  const { login, user, logout } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAdminLogin = async () => {
    setLoading(true);
    try {
      const loginResult = await login('tebia@gmail.com', 'Password@1');
      setResult(loginResult);
      console.log('Login Result:', loginResult);
      console.log('Current User:', user);
      console.log('LocalStorage:', localStorage.getItem('user'));
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testUserLogin = async () => {
    setLoading(true);
    try {
      const loginResult = await login('user@example.com', 'Password@123');
      setResult(loginResult);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Login Test Page</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testAdminLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
        
        <button
          onClick={testUserLogin}
          disabled={loading}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test User Login'}
        </button>

        <button
          onClick={logout}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Current User:</h2>
        <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div className="bg-gray-100 p-4 rounded mt-4">
        <h2 className="font-bold mb-2">Login Result:</h2>
        <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
      </div>

      <div className="bg-gray-100 p-4 rounded mt-4">
        <h2 className="font-bold mb-2">LocalStorage:</h2>
        <pre className="text-sm">{localStorage.getItem('user') || 'Empty'}</pre>
      </div>
    </div>
  );
}