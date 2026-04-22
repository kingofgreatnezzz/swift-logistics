'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Users, UserPlus, Mail, Shield, Calendar, Edit, Trash2, Search, Filter, Lock, Unlock } from 'lucide-react';

export default function SecretUserManagement() {
  const { user, isAdmin, getAllUsers, updateUser, deleteUser, createUser, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });

  // Load users when component mounts and user is admin
  useEffect(() => {
    if (user && isAdmin && users.length === 0) {
      // Load users directly to avoid dependency loop
      const loadedUsers = getAllUsers();
      setUsers(loadedUsers);
    }
  }, [user, isAdmin, users.length]); // Removed getAllUsers from dependencies

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
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
          <p className="text-gray-400">Checking credentials</p>
        </div>
      </div>
    );
  }

  // After loading, check if user is admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
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

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert('Please fill all fields');
      return;
    }

    createUser({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role
    });

    setUsers(getAllUsers());
    setNewUser({ username: '', email: '', password: '', role: 'user' });
    setIsAddingUser(false);
  };

  const handleUpdateUser = (userId: string, updates: any) => {
    updateUser(userId, updates);
    setUsers(getAllUsers());
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      setUsers(getAllUsers());
    }
  };

  const roleColors: Record<string, string> = {
    'admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'user': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage all user accounts and permissions</p>
        </div>
      </div>

      {/* Search and Add */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setIsAddingUser(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition"
          >
            <UserPlus className="h-5 w-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'user'})}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition"
              >
                Create User
              </button>
              <button
                onClick={() => setIsAddingUser(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((userItem, index) => (
          <motion.div
            key={userItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
          >
            {/* User Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {userItem.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white">{userItem.username}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {userItem.email}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roleColors[userItem.role]}`}>
                  {userItem.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">User ID</span>
                  <span className="text-sm text-gray-300 font-mono">{userItem.id}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Created</span>
                  <span className="text-sm text-gray-300 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {userItem.createdAt}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-700 p-4 bg-gray-900/30">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setEditingUser(userItem)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-blue-400 hover:text-blue-300 transition"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                {userItem.id !== user.id && (
                  <button
                    onClick={() => handleDeleteUser(userItem.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'admin' | 'user'})}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdateUser(editingUser.id, editingUser)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'from-purple-500 to-pink-500' },
          { label: 'Active Today', value: '2,143', icon: Users, color: 'from-green-500 to-emerald-500' },
          { label: 'New This Week', value: '124', icon: UserPlus, color: 'from-orange-500 to-red-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}