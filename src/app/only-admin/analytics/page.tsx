'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, router, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center animate-pulse">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const stats = [
    { label: 'Total Users', value: '1,247', change: '+12%', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Packages', value: '342', change: '+8%', icon: Package, color: 'from-green-500 to-emerald-500' },
    { label: 'Revenue', value: '$24,580', change: '+15%', icon: DollarSign, color: 'from-purple-500 to-pink-500' },
    { label: 'Growth Rate', value: '24%', change: '+3%', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
                <div className="text-sm text-gray-400">Platform statistics and insights</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-300">Logged in as</div>
                <div className="font-medium text-white">{user.username}</div>
                <div className="text-xs text-green-400">● Administrator</div>
              </div>
              <button
                onClick={() => router.push('/only-admin')}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                Back to Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{stat.change}</div>
                  <div className="text-xs text-green-400">vs last month</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-8 border border-amber-500/30 text-center"
        >
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-amber-300 mb-4">Analytics Coming Soon</h2>
          <p className="text-amber-200/70 mb-6">
            Comprehensive analytics dashboard with charts, graphs, and insights is under development.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/20 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-sm text-amber-300 font-mono">Feature in Development</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}