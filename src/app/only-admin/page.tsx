'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { BarChart3, Package, Users, Settings, Shield, Lock, UserCog, Database } from 'lucide-react';
import Link from 'next/link';

export default function SecretAdminPage() {
  const { user, isAdmin, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're done loading and user is not admin
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, router, isLoading]);

  // Show loading screen while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Loading Admin Portal...</h1>
          <p className="text-gray-400">Checking credentials</p>
        </div>
      </div>
    );
  }

  // After loading, check if user is admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">Admin credentials required</p>
          <button
            onClick={() => router.push('/signin')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const adminActions = [
    {
      title: 'User Management',
      description: 'Create, edit, and delete user accounts',
      icon: Users,
      href: '/only-admin/users',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Package Management',
      description: 'Manage all packages and shipments',
      icon: Package,
      href: '/only-admin/packages',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      href: '/only-admin/settings',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'System Analytics',
      description: 'View platform statistics and reports',
      icon: BarChart3,
      href: '/only-admin/analytics',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Database Admin',
      description: 'Direct database access and queries',
      icon: Database,
      href: '/only-admin/database',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Role Management',
      description: 'Configure user permissions and roles',
      icon: UserCog,
      href: '/only-admin/roles',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Security Settings',
      description: 'Configure security and access controls',
      icon: Shield,
      href: '/only-admin/security',
      color: 'from-yellow-500 to-amber-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Secret Header */}
      <div className="bg-black/50 border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">SECRET ADMIN</span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-mono rounded">CLASSIFIED</span>
                </div>
                <div className="text-sm text-gray-400 font-mono">Access Level: MAXIMUM</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-300">Logged in as</div>
                <div className="font-medium text-white">{user.username}</div>
                <div className="text-xs text-green-400">● Administrator</div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Secret <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Admin Portal</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This portal is accessible only to authorized administrators. All actions are logged and monitored.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-300 font-mono">Secure Connection Established</span>
          </div>
        </div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adminActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link href={action.href}>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                  <p className="text-gray-400 mb-4">{action.description}</p>
                  <div className="text-sm text-gray-500 group-hover:text-gray-400 transition">
                    Click to access →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: '2,847', change: '+12%' },
              { label: 'Active Packages', value: '1,563', change: '+8%' },
              { label: 'Admin Users', value: '3', change: '+0%' },
              { label: 'System Uptime', value: '99.97%', change: '+0.02%' },
            ].map((stat, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-xs text-green-400 mt-2">▲ {stat.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-800/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-red-500/20">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Security Protocol Active</h3>
              <p className="text-gray-300 mb-3">
                All actions in this portal are monitored and logged. Unauthorized access attempts will be reported.
              </p>
              <div className="text-sm text-gray-400">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Encrypted Connection: AES-256</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Activity Logging: Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Session Timeout: 30 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remove Investor Page Option */}
        <div className="mt-12 bg-gray-800/50 rounded-xl p-6 border border-yellow-700/30">
          <h3 className="text-xl font-bold text-white mb-4">Platform Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
              <div>
                <div className="font-medium text-white">Investor Page</div>
                <div className="text-sm text-gray-400">Public page for investor information</div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition">
                Remove Page
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
              <div>
                <div className="font-medium text-white">User Registration</div>
                <div className="text-sm text-gray-400">Allow new user signups</div>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" className="opacity-0 w-0 h-0" id="registration-toggle" defaultChecked />
                <label htmlFor="registration-toggle" className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-700 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-6 checked:bg-green-500"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}