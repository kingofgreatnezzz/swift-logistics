'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MessageSquare } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Ready to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transform
            </span>{' '}
            Your Logistics?
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Get started with our premium logistics platform or explore investment opportunities
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Business Solutions */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-6 inline-flex rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                  <MessageSquare className="h-8 w-8" />
                </div>
                
                <h3 className="mb-4 text-2xl font-bold">
                  Enterprise Solutions
                </h3>
                
                <p className="mb-6 text-blue-100">
                  Custom logistics solutions for large-scale operations with dedicated support
                </p>
                
                <ul className="mb-8 space-y-3">
                  {['Custom API Integration', 'Dedicated Account Manager', '24/7 Premium Support', 'Advanced Analytics'].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition-all hover:bg-gray-100"
                >
                  Contact Sales
                  <ArrowRight className="ml-2 inline h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Small Business */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-2xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Small Business
                </h3>
                
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Affordable logistics solutions with premium features for growing businesses
                </p>
                
                <ul className="mb-8 space-y-3">
                  {['Real-time Tracking', 'Basic Analytics', 'Email Support', 'API Access'].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 inline h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Investors */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 p-8 text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-6 inline-flex rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                  <Phone className="h-8 w-8" />
                </div>
                
                <h3 className="mb-4 text-2xl font-bold">
                  Investors
                </h3>
                
                <p className="mb-6 text-gray-300">
                  Join our journey in revolutionizing global logistics with cutting-edge technology
                </p>
                
                <ul className="mb-8 space-y-3">
                  {['Series C Funding Open', 'Exclusive Investor Updates', 'Quarterly Reports', 'Direct Founder Access'].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-xl border border-white/30 bg-transparent px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
                >
                  Investor Relations
                  <ArrowRight className="ml-2 inline h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24"
        >
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 p-12 dark:from-gray-800 dark:to-gray-900">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Stay Updated
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
                Subscribe to our newsletter for logistics insights, updates, and investment opportunities
              </p>
              
              <form className="mx-auto mt-8 max-w-md">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    Subscribe
                  </motion.button>
                </div>
                
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}