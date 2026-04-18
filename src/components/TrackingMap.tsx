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
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Simulate package movement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

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
              {isPlaying ? '850 km/h' : '0 km/h'}
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

      {/* Map Controls */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying && progress >= 100) setProgress(0);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${isPlaying ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'}`}
        >
          {isPlaying ? (
            <>
              <span className="h-2 w-2 bg-red-600 rounded-full"></span>
              Pause Tracking
            </>
          ) : (
            <>
              <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></span>
              Start Tracking
            </>
          )}
        </button>
        
        <button
          onClick={() => setProgress(0)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
        >
          Reset
        </button>
        
        <button
          onClick={() => setProgress(prev => Math.min(prev + 10, 100))}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 transition"
        >
          +10%
        </button>
        
        <button
          onClick={() => setProgress(prev => Math.max(prev - 10, 0))}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 transition"
        >
          -10%
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>
    </motion.div>
  );
}