'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Globe, Zap } from 'lucide-react';
import { themeConfig } from '@/lib/theme';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
      
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <Shield className="h-4 w-4" />
            Trusted by Fortune 500 companies worldwide
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            Premium{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Logistics
            </span>{' '}
            & Global Delivery
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            {themeConfig.tagline} — Secure handling, real-time tracking, and investment opportunities in the future of logistics.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/tracking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
              >
                Start Tracking
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Learn About Investing
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {[
            {
              icon: Globe,
              title: 'Global Network',
              description: '200+ countries served with local expertise',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Shield,
              title: 'Secure Handling',
              description: 'Military-grade security for valuable shipments',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: Zap,
              title: 'Real-time Updates',
              description: 'Instant tracking with AI-powered predictions',
              color: 'from-green-500 to-emerald-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10 ${feature.color}" />
              
              <div className={`relative mb-6 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-4`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
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