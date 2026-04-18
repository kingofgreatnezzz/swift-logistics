'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Ready');

  const simulateAdminLogin = () => {
    setStatus('Logging in...');
    
    // Simulate admin login
    const adminUser = {
      id: 'admin-1',
      username: 'tebia',
      email: 'tebia@gmail.com',
      role: 'admin',
      isAuthenticated: true,
      createdAt: '2026-04-18'
    };
    
    localStorage.setItem('user', JSON.stringify(adminUser));
    setStatus('Logged in as admin. Redirecting...');
    
    setTimeout(() => {
      router.push('/only-admin/packages');
    }, 1000);
  };

  const checkLocalStorage = () => {
    const user = localStorage.getItem('user');
    setStatus(`LocalStorage user: ${user ? JSON.parse(user).email : 'None'}`);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('user');
    setStatus('LocalStorage cleared');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Login</h1>
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Status: {status}</h2>
        <div className="flex gap-4">
          <button
            onClick={simulateAdminLogin}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Simulate Admin Login
          </button>
          <button
            onClick={checkLocalStorage}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Check LocalStorage
          </button>
          <button
            onClick={clearLocalStorage}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Clear LocalStorage
          </button>
          <button
            onClick={() => router.push('/only-admin/packages')}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Go to Packages Page
          </button>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Test Links</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/only-admin" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Admin Portal</a>
          <a href="/only-admin/users" className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">User Management</a>
          <a href="/only-admin/packages" className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">Package Management</a>
          <a href="/only-admin/settings" className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700">Settings</a>
          <a href="/signin" className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">Sign In Page</a>
        </div>
      </div>
    </div>
  );
}