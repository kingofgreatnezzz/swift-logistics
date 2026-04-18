'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Database as DatabaseIcon, Server, Terminal, Shield } from 'lucide-react';

export default function DatabaseAdminPage() {
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
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center animate-pulse">
            <DatabaseIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-400">Loading database admin...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
                <DatabaseIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Database Admin</h1>
                <div className="text-sm text-gray-400">Direct database access and queries</div>
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
        {/* Warning Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-8 border border-red-500/30 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-300">⚠️ Restricted Access</h2>
              <p className="text-red-400/70">Direct database access requires additional permissions</p>
            </div>
          </div>
          
          <div className="bg-black/50 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-5 w-5 text-green-400" />
              <h3 className="font-medium text-white">Database Connection</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-mono">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database:</span>
                <span className="text-white font-mono">swiftlogistics_prod</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tables:</span>
                <span className="text-white font-mono">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="text-white font-mono">2.4 GB</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-8 border border-orange-500/30 text-center"
        >
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
            <DatabaseIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-orange-300 mb-4">Database Admin Coming Soon</h2>
          <p className="text-orange-200/70 mb-6">
            Direct database query interface with SQL editor, table browser, and query history.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/20 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-sm text-orange-300 font-mono">Advanced Feature in Development</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}