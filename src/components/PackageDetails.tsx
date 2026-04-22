'use client';

import { motion } from 'framer-motion';
import { Package, User, MapPin, DollarSign, Scale, FileText } from 'lucide-react';
import { Package as PackageType } from '@/lib/supabase';

interface PackageDetailsProps {
  package: PackageType;
}

export default function PackageDetails({ package: pkg }: PackageDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Package Details
        </h3>
        <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
          Edit Details
        </button>
      </div>

      <div className="space-y-6">
        {/* Item Information */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Item Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Product details and specifications</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              <div className="text-sm text-gray-500 dark:text-gray-400">Item Name</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.item_name || 'Package'}</div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              <div className="text-sm text-gray-500 dark:text-gray-400">Description</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{pkg.item_description || 'No description'}</div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <DollarSign className="h-4 w-4" />
                Declared Value
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${(pkg.item_value || 0).toLocaleString()}
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Scale className="h-4 w-4" />
                Weight
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {pkg.weight_kg} kg
              </div>
            </div>
          </div>
        </div>

        {/* Sender Information */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Sender Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Origin details and contact</p>
            </div>
          </div>
          
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
              <div className="font-medium text-gray-900 dark:text-white">{pkg.sender_name || 'Not specified'}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
              <div className="font-medium text-gray-900 dark:text-white">{pkg.sender_address || 'Not specified'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {(pkg.sender_city || pkg.sender_country) ? `${pkg.sender_city || ''}${pkg.sender_city && pkg.sender_country ? ', ' : ''}${pkg.sender_country || ''}` : 'Not specified'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                <div className="font-medium text-gray-900 dark:text-white">{pkg.sender_email || 'Not specified'}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                <div className="font-medium text-gray-900 dark:text-white">{pkg.sender_phone || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Receiver Information */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Receiver Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Destination details and contact</p>
            </div>
          </div>
          
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
              <div className="font-medium text-gray-900 dark:text-white">{pkg.receiver_name || 'Not specified'}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
              <div className="font-medium text-gray-900 dark:text-white">{pkg.receiver_address || 'Not specified'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {(pkg.receiver_city || pkg.receiver_country) ? `${pkg.receiver_city || ''}${pkg.receiver_city && pkg.receiver_country ? ', ' : ''}${pkg.receiver_country || ''}` : 'Not specified'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                <div className="font-medium text-gray-900 dark:text-white">{pkg.receiver_email || 'Not specified'}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                <div className="font-medium text-gray-900 dark:text-white">{pkg.receiver_phone || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <button className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
            <FileText className="h-4 w-4" />
            Generate Receipt
          </button>
          
          <button className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50">
            <MapPin className="h-4 w-4" />
            Update Location
          </button>
          
          <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            Share Tracking
          </button>
        </div>
      </div>
    </motion.div>
  );
}