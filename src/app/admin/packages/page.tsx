'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSimple } from '@/lib/auth-simple';
import { motion } from 'framer-motion';
import { Package, Search, Filter, Edit, Trash2, Eye, Download, Plus } from 'lucide-react';

export default function AdminPackages() {
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

  const packages = [
    { id: 'BB-2026-157946183', customer: 'John Doe', status: 'In Transit', destination: 'New York, USA', weight: '2.5kg', value: '$250', date: '2026-04-18' },
    { id: 'BB-2026-157946184', customer: 'Sarah Smith', status: 'Delivered', destination: 'London, UK', weight: '5.0kg', value: '$450', date: '2026-04-17' },
    { id: 'BB-2026-157946185', customer: 'Mike Johnson', status: 'Pending', destination: 'Tokyo, Japan', weight: '1.2kg', value: '$120', date: '2026-04-18' },
    { id: 'BB-2026-157946186', customer: 'Emma Wilson', status: 'In Transit', destination: 'Sydney, Australia', weight: '3.8kg', value: '$380', date: '2026-04-16' },
    { id: 'BB-2026-157946187', customer: 'David Brown', status: 'Delivered', destination: 'Berlin, Germany', weight: '4.2kg', value: '$520', date: '2026-04-15' },
    { id: 'BB-2026-157946188', customer: 'Lisa Taylor', status: 'Pending', destination: 'Paris, France', weight: '0.8kg', value: '$85', date: '2026-04-18' },
    { id: 'BB-2026-157946189', customer: 'Robert Lee', status: 'In Transit', destination: 'Toronto, Canada', weight: '6.5kg', value: '$650', date: '2026-04-17' },
    { id: 'BB-2026-157946190', customer: 'Maria Garcia', status: 'Delivered', destination: 'Madrid, Spain', weight: '2.1kg', value: '$210', date: '2026-04-14' },
  ];

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Package Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage all shipments and track their status
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Plus className="h-4 w-4" />
              Add New Package
            </motion.button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search packages..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
            
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Packages Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {packages.map((pkg, index) => (
                  <motion.tr
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-3">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {pkg.id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Click to track
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {pkg.customer}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[pkg.status as keyof typeof statusColors]}`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {pkg.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {pkg.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {pkg.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {pkg.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 transition">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                <span className="font-medium">1247</span> packages
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  Previous
                </button>
                <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  1
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  2
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  3
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {[
            { label: 'Total Packages', value: '1,247', color: 'from-blue-500 to-cyan-500' },
            { label: 'In Transit', value: '342', color: 'from-purple-500 to-pink-500' },
            { label: 'Delivered Today', value: '89', color: 'from-green-500 to-emerald-500' },
            { label: 'Pending', value: '56', color: 'from-orange-500 to-red-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${stat.color} mb-4`} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}