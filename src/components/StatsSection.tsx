'use client';

import { motion } from 'framer-motion';
import { Globe, Package, Users, TrendingUp, Shield, Clock } from 'lucide-react';

const stats = [
  {
    icon: Globe,
    value: '200+',
    label: 'Countries Served',
    change: '+12%',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Package,
    value: '2.5M',
    label: 'Packages Delivered',
    change: '+28%',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    value: '50K+',
    label: 'Enterprise Clients',
    change: '+15%',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    value: '99.8%',
    label: 'On-Time Delivery',
    change: '+0.2%',
    color: 'from-orange-500 to-red-500',
  },
];

const milestones = [
  {
    year: '2024',
    title: 'Series C Funding',
    description: 'Raised $150M for global expansion',
    icon: TrendingUp,
  },
  {
    year: '2023',
    title: 'AI Integration',
    description: 'Implemented predictive logistics AI',
    icon: Shield,
  },
  {
    year: '2022',
    title: 'Global Launch',
    description: 'Expanded to 50 new countries',
    icon: Globe,
  },
  {
    year: '2021',
    title: 'Platform Launch',
    description: 'Launched premium logistics platform',
    icon: Clock,
  },
];

export default function StatsSection() {
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
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Our numbers speak for themselves — delivering excellence at scale with cutting-edge technology
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity group-hover:opacity-5`} />
              
              <div className={`relative mb-6 inline-flex rounded-xl bg-gradient-to-br ${stat.color} p-4`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  {stat.change}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Milestones Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Our Journey
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              From startup to global logistics leader — our milestones tell the story
            </p>
          </div>
          
          <div className="relative mt-12">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                        <milestone.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
                      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-gray-900/50">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {milestone.year}
                        </div>
                        
                        <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                          {milestone.title}
                        </h4>
                        
                        <p className="text-gray-600 dark:text-gray-300">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Investment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 p-12 text-white"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold sm:text-4xl">
              Invest in the Future of Logistics
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              Join our journey as we revolutionize global supply chains with AI and automation
            </p>
            
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-white px-8 py-4 font-semibold text-gray-900 shadow-lg transition-all hover:shadow-xl"
              >
                View Investor Deck
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border border-white/30 bg-transparent px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
              >
                Schedule Meeting
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}