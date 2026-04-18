'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Truck, Package, AlertCircle, MapPin } from 'lucide-react';
import { TrackingUpdate } from '@/lib/supabase';

interface TrackingHistoryProps {
  history: TrackingUpdate[];
}

export default function TrackingHistory({ history }: TrackingHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'out_for_delivery': return Truck;
      case 'in_transit': return Truck;
      case 'processing': return Package;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'out_for_delivery': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'in_transit': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'processing': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'pending': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Tracking History
        </h3>
        <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
          Add Update
        </button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-8">
          {history.map((update, index) => {
            const Icon = getStatusIcon(update.status);
            const isLast = index === history.length - 1;
            
            return (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getStatusColor(update.status)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {!isLast && (
                    <div className="absolute left-1/2 top-full h-8 w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(update.status)}`}>
                        {update.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(update.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {update.location}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300">
                      {update.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Update Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-8 rounded-xl border border-dashed border-gray-300 p-6 dark:border-gray-700"
      >
        <h4 className="mb-4 font-medium text-gray-900 dark:text-white">
          Add Manual Update
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <select className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
            
            <input
              type="text"
              placeholder="Location"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          
          <textarea
            placeholder="Update description..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          
          <div className="flex justify-end">
            <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40">
              Add Update
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}