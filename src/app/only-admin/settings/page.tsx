'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, AlertTriangle, Mail, Database, Shield } from 'lucide-react';

export default function SecretSettingsPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState({
    platformName: 'SwiftLogistics',
    platformDescription: 'Premium logistics and delivery platform',
    contactEmail: 'support@swiftlogistics.com',
    contactPhone: '+1 (555) 123-4567',
    enableRealTimeTracking: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    requireEmailVerification: true,
    requireStrongPasswords: true,
    enable2FA: false,
    sessionTimeout: 24,
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    cacheEnabled: true,
    imageOptimization: true,
    cdnEnabled: false,
    enableAnalytics: true,
    enableErrorTracking: true,
    logRetentionDays: 30
  });

  // Redirect if not admin (after loading)
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, router, isLoading]);

  // Show loading screen while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-pulse">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  // After loading, check if user is admin
  if (!user || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">System Settings</h1>
                <div className="text-sm text-gray-400">Configure platform settings</div>
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
        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* General Settings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">General</h2>
                  <p className="text-gray-400 text-sm">Basic platform configuration</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Platform Name</label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Feature Settings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Features</h2>
                  <p className="text-gray-400 text-sm">Enable/disable platform features</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'enableRealTimeTracking', label: 'Real-time Tracking', desc: 'Enable live package tracking' },
                  { key: 'enableEmailNotifications', label: 'Email Notifications', desc: 'Send email updates to users' },
                  { key: 'enableSMSNotifications', label: 'SMS Notifications', desc: 'Send SMS updates (premium)' },
                  { key: 'enablePushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{feature.label}</h3>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[feature.key as keyof typeof settings] as boolean}
                        onChange={(e) => setSettings({...settings, [feature.key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Security Settings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Security</h2>
                  <p className="text-gray-400 text-sm">Configure security settings</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'requireEmailVerification', label: 'Email Verification', desc: 'Require email verification for new users' },
                  { key: 'requireStrongPasswords', label: 'Strong Passwords', desc: 'Require strong passwords (min 8 chars)' },
                  { key: 'enable2FA', label: 'Two-Factor Auth', desc: 'Enable 2FA for admin accounts' },
                ].map((security) => (
                  <div key={security.key} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{security.label}</h3>
                      <p className="text-sm text-gray-400">{security.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[security.key as keyof typeof settings] as boolean}
                        onChange={(e) => setSettings({...settings, [security.key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}

                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <h3 className="font-medium mb-2">Session Timeout</h3>
                  <p className="text-sm text-gray-400 mb-3">Auto-logout after inactivity (hours)</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="72"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-bold min-w-[3rem]">{settings.sessionTimeout}h</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-500/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-300">Danger Zone</h2>
                  <p className="text-red-400/70 text-sm">Irreversible actions</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-300">Reset Platform</h3>
                    <p className="text-sm text-red-400/70">Reset everything to factory defaults</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('WARNING: This will reset ALL settings to defaults. Are you sure?')) {
                        setSettings({
                          platformName: 'SwiftLogistics',
                          platformDescription: 'Premium logistics and delivery platform',
                          contactEmail: 'support@swiftlogistics.com',
                          contactPhone: '+1 (555) 123-4567',
                          enableRealTimeTracking: true,
                          enableEmailNotifications: true,
                          enableSMSNotifications: false,
                          enablePushNotifications: true,
                          requireEmailVerification: true,
                          requireStrongPasswords: true,
                          enable2FA: false,
                          sessionTimeout: 24,
                          primaryColor: '#3b82f6',
                          secondaryColor: '#8b5cf6',
                          accentColor: '#10b981',
                          cacheEnabled: true,
                          imageOptimization: true,
                          cdnEnabled: false,
                          enableAnalytics: true,
                          enableErrorTracking: true,
                          logRetentionDays: 30
                        });
                        alert('Platform reset to defaults');
                      }
                    }}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    Reset Platform
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-12 flex justify-end">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // In real app, save to API
              alert('Settings saved successfully!');
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition flex items-center gap-3"
          >
            <Save className="h-5 w-5" />
            Save All Settings
          </motion.button>
        </div>
      </div>
    </div>
  );
}