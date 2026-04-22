'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Database, CheckCircle, XCircle, RefreshCw, Server, Shield, Activity } from 'lucide-react';

export default function DatabasePage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [tables, setTables] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [testQueryResult, setTestQueryResult] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, router, isLoading]);

  const testConnection = async () => {
    setConnectionStatus('checking');
    setError('');
    setTestQueryResult(null);
    
    try {
      console.log('Testing Supabase connection...');
      
      // Test 1: Basic connection test
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth connection error:', authError);
        throw new Error(`Auth error: ${authError.message}`);
      }
      
      console.log('Auth connection successful');
      
      // Test 2: Try to fetch tables (using information_schema)
      const { data: tablesData, error: tablesError } = await supabase
        .from('packages')
        .select('*')
        .limit(1);
      
      if (tablesError) {
        console.error('Tables query error:', tablesError);
        // Try a different approach - check if we can get schema
        const { data: schemaData, error: schemaError } = await supabase.rpc('get_schema_info');
        
        if (schemaError) {
          console.error('Schema RPC error:', schemaError);
          throw new Error(`Database error: ${tablesError.message}`);
        }
        
        console.log('Schema RPC successful');
        setConnectionStatus('connected');
        setTestQueryResult({ type: 'schema_rpc', data: schemaData });
      } else {
        console.log('Tables query successful, found packages table');
        setConnectionStatus('connected');
        setTestQueryResult({ type: 'packages_query', count: tablesData?.length || 0 });
        
        // Get table info
        const { data: packagesData } = await supabase
          .from('packages')
          .select('*')
          .limit(5);
        
        setTables(packagesData || []);
      }
      
    } catch (err: any) {
      console.error('Connection test failed:', err);
      setConnectionStatus('failed');
      setError(err.message || 'Unknown error');
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      testConnection();
    }
  }, [user, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Database Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and manage your Supabase database connection
          </p>
        </div>

        {/* Connection Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                connectionStatus === 'connected' ? 'bg-green-100 dark:bg-green-900/30' :
                connectionStatus === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                {connectionStatus === 'connected' ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : connectionStatus === 'failed' ? (
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                ) : (
                  <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Database Connection
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {connectionStatus === 'connected' ? 'Connected to Supabase' :
                   connectionStatus === 'failed' ? 'Connection failed' :
                   'Checking connection...'}
                </p>
              </div>
            </div>
            <button
              onClick={testConnection}
              disabled={connectionStatus === 'checking'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
              Test Connection
            </button>
          </div>

          {/* Connection Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint</span>
                </div>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || 'Not configured'}
                </code>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auth Status</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                  user ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {user ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Authenticated
                    </>
                  ) : (
                    'Not authenticated'
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tables</span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tables.length > 0 ? `${tables.length} rows in packages` : 'No data'}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-300">Connection Error</h3>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Test Query Result */}
            {testQueryResult && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">Test Query Result</h3>
                    <div className="mt-2">
                      <pre className="text-sm bg-black/10 dark:bg-white/5 p-3 rounded overflow-x-auto">
                        {JSON.stringify(testQueryResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sample Data Table */}
        {tables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Sample Data from Packages Table
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tracking #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tables.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {row.tracking_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {row.sender_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {row.receiver_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          row.status === 'in_transit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Showing {tables.length} sample rows from the packages table
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Database Setup Instructions
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Create Supabase Tables</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Run the SQL below in your Supabase SQL editor to create the necessary tables:
                </p>
                <pre className="mt-2 text-sm bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
{`CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  weight_kg DECIMAL(10,2) NOT NULL,
  dimensions TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                </pre>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Configure Environment Variables</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Make sure your <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">.env.local</code> file contains:
                </p>
                <pre className="mt-2 text-sm bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Test the Connection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Click the "Test Connection" button above to verify your database connection is working properly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
    </div>
  );
}