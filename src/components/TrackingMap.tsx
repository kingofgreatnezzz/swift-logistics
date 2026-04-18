'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ZoomIn, ZoomOut, Package as PackageIcon } from 'lucide-react';
import type { Package } from '@/lib/supabase';

interface TrackingMapProps {
  package: Package;
}

export default function TrackingMap({ package: pkg }: TrackingMapProps) {
  const [progress, setProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);

  // Simulate package movement
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const getCurrentLocation = () => {
    if (progress < 33) return 'Origin';
    if (progress < 66) return 'Midpoint';
    return 'Destination';
  };

  const getCoordinates = () => {
    // Mock coordinates for simulation
    if (progress < 33) {
      return { lat: 37.7749, lng: -122.4194 }; // San Francisco
    } else if (progress < 66) {
      return { lat: 40.7128, lng: -74.0060 }; // New York
    } else {
      return { lat: 51.5074, lng: -0.1278 }; // London
    }
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
          Live Tracking Map
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isSimulating
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {isSimulating ? 'Pause' : 'Resume'} Simulation
          </button>
          
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button className="rounded-md p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600">
              <ZoomOut className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600">
              <Navigation className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {/* Mock Map Visualization */}
        <div className="aspect-[16/9] relative">
          {/* Route Line */}
          <div className="absolute left-1/2 top-1/2 h-1 w-3/4 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30" />
          </div>
          
          {/* Origin */}
          <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full bg-blue-600 p-3 shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Origin</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">San Francisco</div>
            </div>
          </div>
          
          {/* Destination */}
          <div className="absolute right-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full bg-green-600 p-3 shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Destination</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">London</div>
            </div>
          </div>
          
          {/* Moving Package */}
          <motion.div
            animate={{
              left: `${progress}%`,
            }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <div className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-2xl">
                <PackageIcon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs text-white">
                {getCurrentLocation()}
              </div>
            </div>
          </motion.div>
          
          {/* Grid Lines */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-px bg-gray-400"
                style={{ left: `${(i + 1) * 10}%` }}
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-gray-400"
                style={{ top: `${(i + 1) * 20}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Info */}
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Route Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Distance</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(8700 * (progress / 100))} km
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Speed</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {isSimulating ? '850 km/h' : '0 km/h'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">ETA</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round((100 - progress) / 10)}h
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-blue-900 dark:text-blue-300">
                Current Location: {getCurrentLocation()}
              </div>
              <div className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                Coordinates: {getCoordinates().lat.toFixed(4)}, {getCoordinates().lng.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}