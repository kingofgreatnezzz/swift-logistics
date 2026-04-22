'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Users, 
  Database, 
  Settings, 
  Shield, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, router, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const quickStats = [
    { label: 'Total Packages', value: '1,248', icon: Package, color: 'bg-blue-500/20 text-blue-400', change: '+12%' },
    { label: 'Active Users', value: '342', icon: Users, color: 'bg-green-500/20 text-green-400', change: '+8%' },
    { label: 'Database Size', value: '2.4 GB', icon: Database, color: 'bg-purple-500/20 text-purple-400', change: '+5%' },
    { label: 'Uptime', value: '99.9%', icon: CheckCircle, color: 'bg-emerald-500/20 text-emerald-400', change: 'Stable' },
  ];

  const adminActions = [
    {
      title: 'Package Management',
      description: 'Manage shipping packages and tracking',
      icon: Package,
      href: '/only-admin/packages',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      href: '/only-admin/users',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Database',
      description: 'Monitor and manage database connections',
      icon: Database,
      href: '/only-admin/database',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Analytics',
      description: 'View platform usage statistics',
      icon: BarChart3,
      href: '#',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Security',
      description: 'Configure security settings',
      icon: Shield,
      href: '#',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      title: 'Settings',
      description: 'Platform configuration',
      icon: Settings,
      href: '#',
      color: 'from-gray-500 to-gray-700',
    },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Created new package', time: '2 minutes ago', status: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Updated user permissions', time: '15 minutes ago', status: 'success' },
    { id: 3, user: 'System', action: 'Database backup completed', time: '1 hour ago', status: 'success' },
    { id: 4, user: 'Alex Johnson', action: 'Failed login attempt', time: '2 hours ago', status: 'warning' },
    { id: 5, user: 'Robert Chen', action: 'Package delivered', time: '3 hours ago', status: 'success' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user?.username || 'Admin'}. Here's what's happening with your platform.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">{stat.change}</span>
                </div>
              </div>
              <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Admin Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Link href={action.href}>
                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 h-full">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                  <div className="text-sm text-gray-500 group-hover:text-gray-400 transition">
                    Click to access →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{activity.user}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{activity.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">System Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Web Server</p>
                    <p className="text-sm text-gray-400">Port 3000</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Database className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Database</p>
                    <p className="text-sm text-gray-400">Supabase</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Authentication</p>
                    <p className="text-sm text-gray-400">JWT Tokens</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  Secure
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Last Backup</p>
                    <p className="text-sm text-gray-400">Today, 02:00 AM</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                  Scheduled
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Uptime</p>
                  <p className="text-2xl font-bold text-white">99.9%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Response Time</p>
                  <p className="text-2xl font-bold text-white">42ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}