'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSimple } from '@/lib/auth-simple';
import { motion } from 'framer-motion';
import { BarChart3, Package, Users, Settings, DollarSign, TrendingUp, Shield, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuthSimple();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Packages', value: '1,247', change: '+12%', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Users', value: '856', change: '+8%', icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Revenue', value: '$42,580', change: '+23%', icon: DollarSign, color: 'from-purple-500 to-pink-500' },
    { label: 'Delivery Rate', value: '98.7%', change: '+1.2%', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Created new shipment', time: '2 minutes ago', status: 'success' },
    { user: 'Sarah Smith', action: 'Updated tracking info', time: '15 minutes ago', status: 'info' },
    { user: 'Mike Johnson', action: 'Cancelled shipment', time: '1 hour ago', status: 'warning' },
    { user: 'Admin', action: 'Updated system settings', time: '2 hours ago', status: 'success' },
    { user: 'Emma Wilson', action: 'Requested refund', time: '3 hours ago', status: 'warning' },
  ];

  const quickActions = [
    { title: 'Manage Packages', icon: Package, href: '/admin/packages', color: 'bg-blue-500' },
    { title: 'User Management', icon: Users, href: '/admin/users', color: 'bg-green-500' },
    { title: 'System Settings', icon: Settings, href: '/admin/settings', color: 'bg-purple-500' },
    { title: 'Analytics', icon: BarChart3, href: '/admin/analytics', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user.username}</span>. 
            Here's what's happening with your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.a
                    key={index}
                    href={action.href}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {action.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Click to manage
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Activities
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                        {activity.status === 'success' ? <Shield className="h-5 w-5" /> :
                         activity.status === 'warning' ? <Clock className="h-5 w-5" /> :
                         <Users className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.action}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Info & System Status */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Admin Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {user.username}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {user.email}
                    </div>
                    <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                      <Shield className="h-3 w-3" />
                      Administrator
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Details
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Role</span>
                      <span className="font-medium text-gray-900 dark:text-white">Administrator</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Joined</span>
                      <span className="font-medium text-gray-900 dark:text-white">April 18, 2026</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Last Login</span>
                      <span className="font-medium text-gray-900 dark:text-white">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                System Status
              </h2>
              <div className="space-y-4">
                {[
                  { service: 'API Server', status: 'operational', uptime: '99.9%' },
                  { service: 'Database', status: 'operational', uptime: '99.8%' },
                  { service: 'Payment Gateway', status: 'operational', uptime: '99.7%' },
                  { service: 'Email Service', status: 'degraded', uptime: '95.2%' },
                  { service: 'File Storage', status: 'operational', uptime: '99.5%' },
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {service.service}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Uptime: {service.uptime}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === 'operational' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {service.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}