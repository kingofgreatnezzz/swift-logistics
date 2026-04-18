'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSimple } from '@/lib/auth-simple';
import { motion } from 'framer-motion';
import { Users, UserPlus, Mail, Shield, Calendar, Edit, Trash2, MoreVertical } from 'lucide-react';

export default function AdminUsers() {
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
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joinDate: '2026-04-10', packages: 12 },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'User', status: 'Active', joinDate: '2026-04-12', packages: 8 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', joinDate: '2026-04-05', packages: 3 },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'Admin', status: 'Active', joinDate: '2026-04-01', packages: 25 },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Active', joinDate: '2026-04-15', packages: 5 },
    { id: 6, name: 'Lisa Taylor', email: 'lisa@example.com', role: 'User', status: 'Active', joinDate: '2026-04-14', packages: 7 },
    { id: 7, name: 'Robert Lee', email: 'robert@example.com', role: 'User', status: 'Suspended', joinDate: '2026-04-03', packages: 0 },
    { id: 8, name: 'Maria Garcia', email: 'maria@example.com', role: 'User', status: 'Active', joinDate: '2026-04-08', packages: 15 },
  ];

  const statusColors = {
    'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Inactive': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Suspended': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const roleColors = {
    'Admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'User': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage user accounts and permissions
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
            >
              <UserPlus className="h-4 w-4" />
              Add New User
            </motion.button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              {/* User Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role as keyof typeof roleColors]}`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status as keyof typeof statusColors]}`}>
                      {user.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Packages</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.packages}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Joined</span>
                    <span className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {user.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex items-center justify-between">
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition">
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition">
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {[
            { label: 'Total Users', value: '856', icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active Users', value: '789', icon: Users, color: 'from-green-500 to-emerald-500' },
            { label: 'Admins', value: '12', icon: Shield, color: 'from-purple-500 to-pink-500' },
            { label: 'New This Month', value: '124', icon: UserPlus, color: 'from-orange-500 to-red-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Bulk Import Users', description: 'Upload CSV file', icon: Users },
              { title: 'Send Email to All', description: 'Broadcast message', icon: Mail },
              { title: 'Export User List', description: 'Download as CSV', icon: Calendar },
              { title: 'Manage Permissions', description: 'Role settings', icon: Shield },
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-left border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <action.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}