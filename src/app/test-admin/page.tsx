'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function TestAdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, router, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Test Admin Page</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Auth Status</h2>
        <pre className="bg-gray-900 p-4 rounded overflow-auto">
          {JSON.stringify({
            user,
            isAdmin,
            isLoading,
            localStorageUser: typeof window !== 'undefined' ? localStorage.getItem('user') : null
          }, null, 2)}
        </pre>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Test Links</h2>
        <div className="flex gap-4">
          <a href="/only-admin" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Admin Portal</a>
          <a href="/only-admin/users" className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">User Management</a>
          <a href="/only-admin/packages" className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">Package Management</a>
          <a href="/only-admin/settings" className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700">Settings</a>
        </div>
      </div>
    </div>
  );
}