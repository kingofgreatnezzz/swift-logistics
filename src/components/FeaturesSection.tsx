'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Globe, 
  Zap, 
  BarChart3, 
  Users, 
  TrendingUp,
  Lock,
  Cloud,
  Bell,
  FileText
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Logistics',
    description: 'End-to-end encryption and military-grade security protocols for all shipments.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Operational in 200+ countries with local partnerships and customs expertise.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Real-time AI Tracking',
    description: 'Advanced AI predicts delays and optimizes routes in real-time.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Comprehensive dashboards with predictive insights for supply chain optimization.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: '24/7 premium customer service with dedicated account managers.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: TrendingUp,
    title: 'Investment Ready',
    description: 'Transparent metrics and growth opportunities for investors.',
    gradient: 'from-teal-500 to-green-500',
  },
];

const premiumFeatures = [
  {
    icon: Lock,
    title: 'Blockchain Security',
    description: 'Immutable tracking records using distributed ledger technology.',
  },
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'Scalable AWS infrastructure ensuring 99.99% uptime.',
  },
  {
    icon: Bell,
    title: 'Proactive Alerts',
    description: 'Smart notifications for delays, weather impacts, and customs updates.',
  },
  {
    icon: FileText,
    title: 'Automated Documentation',
    description: 'AI-generated customs forms and shipping documentation.',
  },
];

export default function FeaturesSection() {
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
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300">
            <Zap className="h-4 w-4" />
            Enterprise-Grade Features
          </div>
          
          <h2 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Built for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scale & Security
            </span>
          </h2>
          
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            Our platform combines cutting-edge technology with operational excellence to deliver 
            unparalleled logistics solutions for businesses of all sizes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-5`} />
              
              <div className={`relative mb-6 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-4`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
              
              <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 p-12 text-white"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold sm:text-4xl">
              Premium Technology Stack
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              Enterprise features that set us apart from traditional logistics providers
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <feature.icon className="h-8 w-8" />
                </div>
                
                <h4 className="mb-2 text-xl font-bold">
                  {feature.title}
                </h4>
                
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}