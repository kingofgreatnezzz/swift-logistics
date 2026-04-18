'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Package, TrackingUpdate } from '@/lib/supabase';
import { Package as PackageIcon, Edit, Trash2, Eye, Filter, Search, Plus, ArrowUpDown, CheckCircle, XCircle, Clock, Truck, Home, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecretPackageManagement() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Mock packages data (in real app, fetch from API)
  const mockPackages: Package[] = [
    {
      id: 'pkg-1',
      trackingNumber: 'BB-2026-157946183',
      senderName: 'John Doe',
      senderAddress: '123 Main St, New York, NY',
      recipientName: 'Jane Smith',
      recipientAddress: '456 Oak Ave, Los Angeles, CA',
      weight: 2.5,
      dimensions: '30x20x15 cm',
      status: 'in-transit',
      estimatedDelivery: '2026-04-20',
      createdAt: '2026-04-15',
      updatedAt: '2026-04-18',
      userId: 'user-1'
    },
    {
      id: 'pkg-2',
      trackingNumber: 'BB-2026-284739201',
      senderName: 'Tech Corp Inc',
      senderAddress: '789 Tech Blvd, San Francisco, CA',
      recipientName: 'Alex Johnson',
      recipientAddress: '321 Pine St, Chicago, IL',
      weight: 5.0,
      dimensions: '40x30x25 cm',
      status: 'delivered',
      estimatedDelivery: '2026-04-18',
      createdAt: '2026-04-10',
      updatedAt: '2026-04-18',
      userId: 'user-2'
    },
    {
      id: 'pkg-3',
      trackingNumber: 'BB-2026-394857162',
      senderName: 'Global Imports',
      senderAddress: '555 Export Ave, Miami, FL',
      recipientName: 'Robert Chen',
      recipientAddress: '888 Import St, Seattle, WA',
      weight: 10.5,
      dimensions: '50x40x30 cm',
      status: 'pending',
      estimatedDelivery: '2026-04-22',
      createdAt: '2026-04-17',
      updatedAt: '2026-04-17',
      userId: 'user-3'
    },
    {
      id: 'pkg-4',
      trackingNumber: 'BB-2026-485736291',
      senderName: 'Sarah Williams',
      senderAddress: '222 River Rd, Austin, TX',
      recipientName: 'Michael Brown',
      recipientAddress: '333 Lake Dr, Denver, CO',
      weight: 1.2,
      dimensions: '25x15x10 cm',
      status: 'in-transit',
      estimatedDelivery: '2026-04-19',
      createdAt: '2026-04-16',
      updatedAt: '2026-04-18',
      userId: 'user-4'
    },
    {
      id: 'pkg-5',
      trackingNumber: 'BB-2026-574839201',
      senderName: 'Bookstore LLC',
      senderAddress: '444 Book St, Portland, OR',
      recipientName: 'Emily Davis',
      recipientAddress: '777 Read Ave, Boston, MA',
      weight: 3.8,
      dimensions: '35x25x20 cm',
      status: 'delivered',
      estimatedDelivery: '2026-04-17',
      createdAt: '2026-04-12',
      updatedAt: '2026-04-17',
      userId: 'user-5'
    }
  ];

  // Redirect if not admin (after loading)
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, router, isLoading]);

  // Load packages
  useEffect(() => {
    if (user && isAdmin && packages.length === 0) {
      setPackages(mockPackages);
    }
  }, [user, isAdmin, packages.length]);

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.senderAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.recipientAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      case 'in-transit': return 'bg-blue-500/20 text-blue-300';
      case 'delivered': return 'bg-green-500/20 text-green-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <PackageIcon className="h-4 w-4" />;
    }
  };

  // Handle edit
  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };

  // Handle save (mock)
  const handleSave = (updatedPackage: Package) => {
    setPackages(packages.map(pkg => 
      pkg.id === updatedPackage.id ? updatedPackage : pkg
    ));
    setEditingPackage(null);
  };

  // Handle create (mock)
  const handleCreate = (newPackage: Package) => {
    setPackages([...packages, newPackage]);
    setIsCreating(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-pulse">
            <PackageIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Loading Packages...</h1>
          <p className="text-gray-400">Please wait while we load package data</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center">
            <PackageIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">Admin credentials required</p>
          <button
            onClick={() => router.push('/signin')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Package Management
            </h1>
            <p className="text-gray-400 mt-2">Manage all packages in the system</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/only-admin')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              Back to Admin
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Package
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Packages</p>
                <p className="text-3xl font-bold mt-2">{packages.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <PackageIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Transit</p>
                <p className="text-3xl font-bold mt-2">{packages.filter(p => p.status === 'in-transit').length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Delivered</p>
                <p className="text-3xl font-bold mt-2">{packages.filter(p => p.status === 'delivered').length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold mt-2">{packages.filter(p => p.status === 'pending').length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by tracking number, sender, recipient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition flex items-center gap-2">
                <Filter className="h-5 w-5" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Packages Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="py-4 px-6 text-left">
                    <button className="flex items-center gap-2 hover:text-gray-300 transition">
                      Tracking Number
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="py-4 px-6 text-left">Sender</th>
                  <th className="py-4 px-6 text-left">Recipient</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Estimated Delivery</th>
                  <th className="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg, index) => (
                  <motion.tr 
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-gray-700 hover:bg-gray-800/30 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold">{pkg.trackingNumber}</div>
                      <div className="text-sm text-gray-400">ID: {pkg.id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{pkg.senderName}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">{pkg.senderAddress}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{pkg.recipientName}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">{pkg.recipientAddress}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)} flex items-center gap-1`}>
                          {getStatusIcon(pkg.status)}
                          {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{pkg.estimatedDelivery}</div>
                      <div className="text-sm text-gray-400">
                        {pkg.weight} kg • {pkg.dimensions}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/tracking?tracking=${pkg.trackingNumber}`)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition text-blue-300"
                          title="View Tracking"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition text-yellow-300"
                          title="Edit Package"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition text-red-300"
                          title="Delete Package"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-16">
            <PackageIcon className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No packages found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {editingPackage && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Edit Package</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tracking Number</label>
                    <input
                      type="text"
                      value={editingPackage.trackingNumber}
                      onChange={(e) => setEditingPackage({...editingPackage, trackingNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={editingPackage.status}
                      onChange={(e) => setEditingPackage({...editingPackage, status: e.target.value as any})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sender Name</label>
                  <input
                    type="text"
                    value={editingPackage.senderName}
                    onChange={(e) => setEditingPackage({...editingPackage, senderName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sender Address</label>
                  <textarea
                    value={editingPackage.senderAddress}
                    onChange={(e) => setEditingPackage({...editingPackage, senderAddress: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    value={editingPackage.recipientName}
                    onChange={(e) => setEditingPackage({...editingPackage, recipientName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Address</label>
                  <textarea
                    value={editingPackage.recipientAddress}
                    onChange={(e) => setEditingPackage({...editingPackage, recipientAddress: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingPackage.weight}
                      onChange={(e) => setEditingPackage({...editingPackage, weight: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Dimensions</label>
                    <input
                      type="text"
                      value={editingPackage.dimensions}
                      onChange={(e) => setEditingPackage({...editingPackage, dimensions: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Delivery</label>
                    <input
                      type="date"
                      value={editingPackage.estimatedDelivery}
                      onChange={(e) => setEditingPackage({...editingPackage, estimatedDelivery: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setEditingPackage(null)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(editingPackage)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Create New Package</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tracking Number</label>
                    <input
                      type="text"
                      placeholder="BB-YYYY-XXXXXXXX"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sender Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sender Address</label>
                  <textarea
                    placeholder="123 Main St, City, State, ZIP"
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Address</label>
                  <textarea
                    placeholder="456 Oak Ave, City, State, ZIP"
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Dimensions</label>
                    <input
                      type="text"
                      placeholder="30x20x15 cm"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Delivery</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Create mock package
                    const newPackage: Package = {
                      id: `pkg-${Date.now()}`,
                      trackingNumber: `BB-2026-${Math.floor(Math.random() * 1000000000)}`,
                      senderName: 'New Sender',
                      senderAddress: 'New Address',
                      recipientName: 'New Recipient',
                      recipientAddress: 'New Recipient Address',
                      weight: 1.0,
                      dimensions: '20x15x10 cm',
                      status: 'pending',
                      estimatedDelivery: '2026-04-25',
                      createdAt: new Date().toISOString().split('T')[0],
                      updatedAt: new Date().toISOString().split('T')[0],
                      userId: 'user-1'
                    };
                    handleCreate(newPackage);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Create Package
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}