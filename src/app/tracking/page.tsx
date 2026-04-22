'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Package as PackageIcon, MapPin, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import TrackingMap from '@/components/TrackingMap';
import PackageDetails from '@/components/PackageDetails';

import { packageService } from '@/lib/supabase';
import type { Package } from '@/lib/supabase';

function TrackingContent() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [error, setError] = useState<string>('');

  // Auto-track when page loads with tracking query parameter
  useEffect(() => {
    const trackingFromUrl = searchParams.get('tracking');
    if (trackingFromUrl) {
      setTrackingNumber(trackingFromUrl);
      // Trigger tracking after a short delay to ensure state is set
      setTimeout(() => {
        handleAutoTrack(trackingFromUrl);
      }, 100);
    }
  }, [searchParams]);

  const handleAutoTrack = async (trackingNum: string) => {
    if (!trackingNum.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const foundPackage = await packageService.getPackageByTrackingNumber(trackingNum.trim());
      
      if (foundPackage) {
        setSelectedPackage(foundPackage);
      } else {
        setError('Package not found. Please check the tracking number.');
        setSelectedPackage(null);
      }
    } catch (err) {
      console.error('Error tracking package:', err);
      setError('Failed to track package. Please try again.');
      setSelectedPackage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    
    // Use the same logic as auto-track
    handleAutoTrack(trackingNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'out_for_delivery': return 'bg-blue-500';
      case 'in_transit': return 'bg-purple-500';
      case 'processing': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'out_for_delivery': return Truck;
      case 'in_transit': return Truck;
      case 'processing': return PackageIcon;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent" />
        
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Real-Time{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Package Tracking
              </span>
            </h1>
            
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Track your shipment with live updates, interactive maps, and detailed analytics
            </p>
          </motion.div>

          {/* Tracking Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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
                        <PackageIcon className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-8 max-w-2xl"
          >
            <div className="rounded-xl bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Banner - Only show when package is found */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50">
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl ${getStatusColor(selectedPackage.status)} p-3`}>
                    {(() => {
                      const Icon = getStatusIcon(selectedPackage.status);
                      return <Icon className="h-8 w-8 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedPackage.tracking_number}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedPackage.item_name || selectedPackage.sender_name ? `Package from ${selectedPackage.sender_name}` : 'Package'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center sm:text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Current Status</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {selectedPackage.status.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedPackage.current_location || 'Location not available'}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Package Progress</span>
                  <span>75% Complete</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedPackage ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-8">
              <PackageDetails package={selectedPackage} />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <TrackingMap package={selectedPackage} />
              
              {/* Delivery Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50"
              >
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                  Delivery Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      Estimated Delivery
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {new Date(selectedPackage.estimated_delivery).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(selectedPackage.estimated_delivery).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Service Type</div>
                      <div className="rounded-lg bg-blue-50 px-3 py-2 text-center font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {selectedPackage.service_type || 'Standard'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Priority</div>
                      <div className="rounded-lg bg-purple-50 px-3 py-2 text-center font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        {selectedPackage.priority || 'Medium'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Package Details</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Weight</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedPackage.weight_kg} kg
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Value</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${(selectedPackage.item_value || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Empty state when no package is selected */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="mx-auto max-w-md">
              <PackageIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Track Your Package
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Enter a tracking number above to see real-time updates, delivery status, and package details.
              </p>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                Example tracking number: BB-2026-123456789
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading tracking...</div>}>
      <TrackingContent />
    </Suspense>
  );
}