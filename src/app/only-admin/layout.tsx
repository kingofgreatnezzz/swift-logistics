'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Home, Package, Users, Database, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/only-admin', icon: Home },
  { name: 'Packages', href: '/only-admin/packages', icon: Package },
  { name: 'Users', href: '/only-admin/users', icon: Users },
  { name: 'Database', href: '/only-admin/database', icon: Database },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is admin
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, router, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="ml-3 text-xl font-bold text-white">Admin</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.username || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/signin');
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden py-3 border-t border-gray-700">
            <div className="flex items-center justify-around">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition ${
                      isActive
                        ? 'text-blue-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}