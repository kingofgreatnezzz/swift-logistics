'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Package, User, Settings, BarChart3, LogOut, LogIn, UserPlus, Shield } from 'lucide-react';
import { themeConfig } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Tracking', href: '/tracking' },
  { name: 'Services', href: '/services' },
  { name: 'Investors', href: '/investors' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Packages', href: '/admin/packages', icon: Package },
  { name: 'Users', href: '/admin/users', icon: User },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Navigation() {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {themeConfig.brandName}
              </span>
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Access Button - Only show on non-admin pages */}
            {isAdmin && !currentPath.startsWith('/only-admin') && (
              <Link href="/only-admin">
                <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600/10 to-pink-600/10 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:from-red-600/20 hover:to-pink-600/20 dark:text-red-300">
                  <Shield className="h-4 w-4" />
                  Admin Portal
                </button>
              </Link>
            )}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role === 'admin' ? 'Administrator' : 'User'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signin">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-gray-200 dark:border-gray-800 lg:hidden"
            >
              <div className="space-y-1 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Admin Section - Only for admin users */}
                {isAdmin && (
                  <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                    <div className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Admin
                    </div>
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-base text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Auth Section */}
                <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                  {user ? (
                    <div className="space-y-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.role === 'admin' ? 'Administrator' : 'User'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 px-4">
                      <Link href="/signin" onClick={() => setIsOpen(false)}>
                        <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                          <LogIn className="h-5 w-5" />
                          Sign In
                        </button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25"
                        >
                          <UserPlus className="h-5 w-5 mr-2 inline" />
                          Sign Up
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}