'use client';

import { motion } from 'framer-motion';
import { Package, Shield, Globe, Zap, Clock, DollarSign, Truck, Warehouse } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      icon: Package,
      title: 'Express Delivery',
      description: 'Next-day and same-day delivery options for time-sensitive shipments.',
      features: ['24/7 tracking', 'Priority handling', 'Guanteed delivery windows'],
      price: 'From $29.99',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'International Shipping',
      description: 'Seamless cross-border logistics with customs clearance included.',
      features: ['200+ countries', 'Duty calculation', 'Multi-carrier options'],
      price: 'From $49.99',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure Logistics',
      description: 'Military-grade security for high-value and sensitive shipments.',
      features: ['GPS tracking', 'Tamper-proof seals', 'Insurance included'],
      price: 'From $99.99',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Warehouse,
      title: 'Warehousing',
      description: 'Smart storage solutions with inventory management and fulfillment.',
      features: ['Climate control', 'Real-time inventory', 'Pick & pack services'],
      price: 'From $199/month',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Truck,
      title: 'Freight Services',
      description: 'Full truckload and less-than-truckload solutions for bulk shipments.',
      features: ['Palletized goods', 'Heavy equipment', 'Temperature control'],
      price: 'Custom quote',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Zap,
      title: 'AI Optimization',
      description: 'Machine learning algorithms to optimize routes and reduce costs.',
      features: ['Predictive analytics', 'Route optimization', 'Carbon footprint reduction'],
      price: 'Enterprise pricing',
      color: 'from-yellow-500 to-amber-500'
    }
  ];

  const enterpriseFeatures = [
    {
      title: 'API Integration',
      description: 'Seamlessly integrate our logistics platform with your existing systems.',
      icon: '🔌'
    },
    {
      title: 'Dedicated Support',
      description: '24/7 access to a dedicated account manager and support team.',
      icon: '👨‍💼'
    },
    {
      title: 'Custom Solutions',
      description: 'Tailored logistics solutions designed for your specific business needs.',
      icon: '⚙️'
    },
    {
      title: 'Volume Discounts',
      description: 'Competitive pricing for high-volume shippers with custom contracts.',
      icon: '💰'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Comprehensive logistics solutions designed for businesses of all sizes. 
            From local deliveries to global supply chains, we've got you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-blue-500 to-purple-500" />
              
              <div className="relative p-8">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} mb-6`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                
                {/* Title & Description */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {service.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {service.price}
                  </span>
                  <Link
                    href="/tracking"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Start Tracking
                    <Zap className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Solutions */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Enterprise <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
              Custom logistics solutions for large-scale operations and complex supply chains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
            >
              Request Enterprise Quote
              <DollarSign className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Book & Schedule',
                description: 'Create a shipment, choose your service, and schedule pickup.',
                icon: '📦'
              },
              {
                step: '2',
                title: 'Track in Real-Time',
                description: 'Monitor your shipment with live GPS tracking and updates.',
                icon: '📍'
              },
              {
                step: '3',
                title: 'Deliver & Confirm',
                description: 'Receive delivery confirmation and digital proof of delivery.',
                icon: '✅'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold mb-4">
                  {step.icon}
                </div>
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  STEP {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Logistics?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of businesses that trust SwiftLogistics for their shipping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tracking"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
            >
              Start Tracking Now
              <Package className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Contact Sales
              <Clock className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}