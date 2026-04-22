'use client';

import { motion } from 'framer-motion';
import { Package, Mail, Phone, MapPin, MessageSquare, Share2, Code } from 'lucide-react';
import { themeConfig } from '@/lib/theme';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { name: 'Tracking', href: '/tracking' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'API', href: '/api' },
    { name: 'Mobile App', href: '/mobile' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
    { name: 'Investors', href: '/investors' },
  ],
  Resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Partners', href: '/partners' },
    { name: 'Status', href: '/status' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Compliance', href: '/compliance' },
  ],
};

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@swiftlogistics.com',
    href: 'mailto:contact@swiftlogistics.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    value: '123 Tech Street, San Francisco, CA 94107',
    href: 'https://maps.google.com',
  },
];

const socialLinks = [
  { icon: MessageSquare, href: 'https://twitter.com/swiftlogistics', label: 'Twitter' },
  { icon: Share2, href: 'https://linkedin.com/company/swiftlogistics', label: 'LinkedIn' },
  { icon: Code, href: 'https://github.com/swiftlogistics', label: 'GitHub' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Brand & Contact */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {themeConfig.brandName}
                </span>
                <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
              </div>
            </div>

            <p className="mt-6 max-w-md text-gray-600 dark:text-gray-300">
              Premium logistics and delivery solutions powered by cutting-edge technology.
              Transforming global supply chains with AI, automation, and real-time tracking.
            </p>

            <div className="mt-8 space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{info.title}</div>
                    <div className="font-medium">{info.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  aria-label={social.label}
                  className="rounded-lg bg-gray-100 p-3 text-gray-700 transition-all hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
              >
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: categoryIndex * 0.1 + linkIndex * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-300">
              © {currentYear} {themeConfig.brandName}. All rights reserved.
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Built with Next.js, Supabase, and cutting-edge technology.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Privacy Settings
            </button>
            <button className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Cookie Preferences
            </button>
            <button className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Do Not Sell My Info
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">ISO 27001</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Certified</div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">GDPR</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Compliant</div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Uptime SLA</div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">256-bit</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Encryption</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}