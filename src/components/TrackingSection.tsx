'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Package, MapPin, Clock } from 'lucide-react';
import { themeConfig } from '@/lib/theme';

export default function TrackingSection() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    
    setIsLoading(true);
    
    // Navigate to tracking page with the tracking number as query parameter
    router.push(`/tracking?tracking=${encodeURIComponent(trackingNumber.trim())}`);
    
    // Note: The tracking page will handle the actual tracking logic
    // We don't need to wait here since navigation happens immediately
  };

  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Track Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shipment
            </span>
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Enter your tracking number for real-time updates on your package&apos;s journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <form onSubmit={handleTrack} className="mx-auto max-w-2xl">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl" />
              
              <div className="relative flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-2xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50 sm:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number (e.g., BB-2026-157946183)"
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      Track Package
                      <Package className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {[
            {
              icon: Package,
              title: 'Package Details',
              description: 'View item information, weight, and declared value',
              color: 'bg-blue-500',
            },
            {
              icon: MapPin,
              title: 'Live Location',
              description: 'Real-time tracking on interactive maps',
              color: 'bg-purple-500',
            },
            {
              icon: Clock,
              title: 'ETA Updates',
              description: 'AI-powered delivery time predictions',
              color: 'bg-green-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="group rounded-2xl bg-white p-8 shadow-lg shadow-gray-200/50 transition-all hover:shadow-xl hover:shadow-gray-300/50 dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-800/50"
            >
              <div className={`mb-6 inline-flex rounded-xl ${feature.color} p-4`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}