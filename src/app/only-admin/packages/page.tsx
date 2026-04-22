'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// Frontend Package interface (camelCase)
interface FrontendPackage {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  weight: number;
  dimensions: string;
  itemName: string;
  itemDescription: string;
  itemValue: number;
  status: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
import { Package as PackageIcon, Edit, Trash2, Eye, Filter, Search, Plus, ArrowUpDown, CheckCircle, XCircle, Clock, Truck, Home, MapPin, Printer, Download } from 'lucide-react';
import { motion } from 'framer-motion';

// Tracking code generator
function generateTrackingCode(existingPackages: FrontendPackage[] = []): string {
  const prefix = 'BB';
  const year = new Date().getFullYear();

  // Generate unique tracking code
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const trackingCode = `${prefix}-${year}-${random}`;

    // Check if this tracking code already exists
    const exists = existingPackages.some(pkg => pkg.trackingNumber === trackingCode);

    if (!exists) {
      return trackingCode;
    }

    attempts++;
  }

  // If we can't find a unique code after max attempts, add timestamp
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${year}-${timestamp}`;
}

export default function SecretPackageManagement() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<FrontendPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingPackage, setEditingPackage] = useState<FrontendPackage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [receiptPackage, setReceiptPackage] = useState<FrontendPackage | null>(null);
  const [newTrackingNumber, setNewTrackingNumber] = useState(generateTrackingCode());

  // Create form state
  const [createForm, setCreateForm] = useState({
    trackingNumber: '',
    senderName: '',
    senderAddress: '',
    recipientName: '',
    recipientAddress: '',
    weight: 1.0,
    dimensions: '30x20x15 cm',
    itemName: '',
    itemDescription: '',
    itemValue: 0,
    status: 'pending',
    estimatedDelivery: new Date().toISOString().split('T')[0]
  });

  // Fetch packages from Supabase
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        console.log('Fetching packages from Supabase...');
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching packages:', error);

          // Check if it's an RLS error
          if (error.code === '42501' || error.message.includes('row-level security')) {
            console.warn('RLS error - using mock data. Please fix RLS policies.');
          }

          // Fallback to mock data if Supabase fails
          setPackages(mockPackages);
        } else {
          console.log('Packages fetched successfully:', data?.length || 0);
          // Transform Supabase data to match our Package type
          const transformedPackages = data?.map(pkg => ({
            id: pkg.id,
            trackingNumber: pkg.tracking_number,
            senderName: pkg.sender_name,
            senderAddress: pkg.sender_address,
            recipientName: pkg.receiver_name,
            recipientAddress: pkg.receiver_address,
            weight: pkg.weight_kg,
            dimensions: pkg.dimensions || 'N/A',
            status: pkg.status,
            estimatedDelivery: pkg.estimated_delivery,
            createdAt: pkg.created_at,
            updatedAt: pkg.updated_at,
            userId: pkg.user_id || 'unknown'
          })) || [];
          setPackages(transformedPackages);
        }
      } catch (error) {
        console.error('Error in fetchPackages:', error);
        setPackages(mockPackages);
      }
    };

    fetchPackages();
  }, []);

  // Mock packages data (fallback if Supabase fails)
  const mockPackages: FrontendPackage[] = [
    {
      id: 'pkg-1',
      trackingNumber: 'BB-2026-157946183',
      senderName: 'John Doe',
      senderAddress: '123 Main St, New York, NY',
      recipientName: 'Jane Smith',
      recipientAddress: '456 Oak Ave, Los Angeles, CA',
      weight: 2.5,
      dimensions: '30x20x15 cm',
      status: 'in_transit',
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
      case 'in_transit': return 'bg-blue-500/20 text-blue-300';
      case 'delivered': return 'bg-green-500/20 text-green-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <PackageIcon className="h-4 w-4" />;
    }
  };

  // Handle edit
  const handleEdit = (pkg: FrontendPackage) => {
    setEditingPackage(pkg);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      console.log('Deleting package from Supabase:', id);

      // Delete from Supabase
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting package from Supabase:', error);

        // Check if it's an RLS error
        if (error.code === '42501' || error.message.includes('row-level security')) {
          alert('Database permission error: Cannot delete package due to RLS.\n\nPlease run the SQL script in Supabase to fix permissions.');
        } else {
          alert('Failed to delete package. Please try again.');
        }
        return;
      }

      console.log('Package deleted successfully from Supabase');

      // Update local state
      setPackages(packages.filter(pkg => pkg.id !== id));
      alert('Package deleted successfully!');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      alert('Failed to delete package. Please try again.');
    }
  };

  // Handle save (update in Supabase)
  const handleSave = async (updatedPackage: FrontendPackage) => {
    try {
      console.log('Updating package in Supabase:', updatedPackage.id);

      // Update in Supabase
      const { error } = await supabase
        .from('packages')
        .update({
          tracking_number: updatedPackage.trackingNumber,
          sender_name: updatedPackage.senderName,
          sender_address: updatedPackage.senderAddress,
          receiver_name: updatedPackage.recipientName,
          receiver_address: updatedPackage.recipientAddress,
          weight_kg: updatedPackage.weight,
          dimensions: updatedPackage.dimensions,
          status: updatedPackage.status,
          estimated_delivery: updatedPackage.estimatedDelivery,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedPackage.id);

      if (error) {
        console.error('Error updating package in Supabase:', error);

        // Check if it's an RLS error
        if (error.code === '42501' || error.message.includes('row-level security')) {
          alert('Database permission error: Cannot update package due to RLS.\n\nPlease run the SQL script in Supabase to fix permissions.');
        } else {
          alert('Failed to update package. Please try again.');
        }
        return;
      }

      console.log('Package updated successfully in Supabase');

      // Update local state
      setPackages(packages.map(pkg =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg
      ));
      setEditingPackage(null);
      alert('Package updated successfully!');
    } catch (error) {
      console.error('Error in handleSave:', error);
      alert('Failed to update package. Please try again.');
    }
  };

  // Handle create (save to Supabase)
  const handleCreate = async (newPackage: FrontendPackage) => {
    try {
      console.log('Creating package in Supabase:', newPackage.trackingNumber);

      // Insert into Supabase - including item_name, item_description, and item_value
      const { data, error } = await supabase
        .from('packages')
        .insert([{
          tracking_number: newPackage.trackingNumber,
          sender_name: newPackage.senderName,
          sender_address: newPackage.senderAddress,
          receiver_name: newPackage.recipientName,
          receiver_address: newPackage.recipientAddress,
          weight_kg: newPackage.weight,
          dimensions: newPackage.dimensions,
          item_name: newPackage.itemName || '',
          item_description: newPackage.itemDescription || '',
          item_value: newPackage.itemValue || 0,
          status: newPackage.status,
          estimated_delivery: newPackage.estimatedDelivery,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error creating package in Supabase:', error);

        // Check if it's an RLS error
        if (error.code === '42501' || error.message.includes('row-level security')) {
          alert('Database permission error: Row Level Security (RLS) is blocking this operation.\n\nPlease run the SQL script in Supabase SQL Editor to fix permissions:\n1. Go to https://supabase.com/dashboard/project/fmppyrxizbbtxmhvdqeg/sql\n2. Run the fix_rls_policy.sql script from your project folder');
        } else {
          alert(`Failed to create package: ${error.message}`);
        }
        return;
      }

      console.log('Package created successfully in Supabase:', data);

      // Update local state with the new package from Supabase
      if (data && data.length > 0) {
        const supabasePackage = data[0];
        const transformedPackage: FrontendPackage = {
          id: supabasePackage.id,
          trackingNumber: supabasePackage.tracking_number,
          senderName: supabasePackage.sender_name,
          senderAddress: supabasePackage.sender_address,
          recipientName: supabasePackage.receiver_name,
          recipientAddress: supabasePackage.receiver_address,
          weight: supabasePackage.weight_kg,
          dimensions: supabasePackage.dimensions || 'N/A',
          status: supabasePackage.status,
          estimatedDelivery: supabasePackage.estimated_delivery,
          createdAt: supabasePackage.created_at,
          updatedAt: supabasePackage.updated_at,
          userId: supabasePackage.user_id || 'unknown'
        };
        setPackages([...packages, transformedPackage]);
      } else {
        // Fallback to the mock package if Supabase doesn't return data
        setPackages([...packages, newPackage]);
      }

      setIsCreating(false);
      alert('Package created successfully!');
    } catch (error) {
      console.error('Error in handleCreate:', error);
      alert('Failed to create package. Please try again.');
    }
  };

  // Generate receipt
  const generateReceipt = (pkg: FrontendPackage) => {
    setReceiptPackage(pkg);
  };

  // Open create modal with new tracking number
  const openCreateModal = () => {
    const newTracking = generateTrackingCode(packages);
    setNewTrackingNumber(newTracking);

    // Initialize form with default values
    setCreateForm({
      trackingNumber: newTracking,
      senderName: '',
      senderAddress: '',
      recipientName: '',
      recipientAddress: '',
      weight: 1.0,
      dimensions: '30x20x15 cm',
      itemName: '',
      itemDescription: '',
      itemValue: 0,
      status: 'pending',
      estimatedDelivery: new Date().toISOString().split('T')[0]
    });

    setIsCreating(true);
  };

  // Print receipt
  const printReceipt = () => {
    if (!receiptPackage) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Shipping Receipt - ${receiptPackage.trackingNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #000; padding: 30px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
            .company-tagline { font-size: 14px; color: #666; margin-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .label { font-weight: bold; }
            .value { text-align: right; }
            .tracking-number { font-size: 20px; font-weight: bold; text-align: center; background: #f0f0f0; padding: 10px; margin: 20px 0; }
            .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .pending { background: #fff3cd; color: #856404; }
            .in_transit { background: #cce5ff; color: #004085; }
            .delivered { background: #d4edda; color: #155724; }
            .cancelled { background: #f8d7da; color: #721c24; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
            .barcode { text-align: center; margin: 20px 0; font-family: monospace; letter-spacing: 3px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="company-name">swiftlogistics</div>
              <div class="company-tagline">Fast & Reliable Worldwide Delivery</div>
              <div>123 Logistics Ave, Swift City, SC 10001</div>
              <div>Phone: (555) 987-6543 | Email: info@swiftlogistics.com</div>
            </div>

            <div class="tracking-number">TRACKING #: ${receiptPackage.trackingNumber}</div>

            <div class="section">
              <div class="section-title">SHIPMENT DETAILS</div>
              <div class="row">
                <div class="label">Package ID:</div>
                <div class="value">${receiptPackage.id}</div>
              </div>
              <div class="row">
                <div class="label">Status:</div>
                <div class="value">
                  <span class="status-badge ${receiptPackage.status}">
                    ${receiptPackage.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="label">Created Date:</div>
                <div class="value">${receiptPackage.createdAt}</div>
              </div>
              <div class="row">
                <div class="label">Estimated Delivery:</div>
                <div class="value">${receiptPackage.estimatedDelivery}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">SENDER INFORMATION</div>
              <div class="row">
                <div class="label">Name:</div>
                <div class="value">${receiptPackage.senderName}</div>
              </div>
              <div class="row">
                <div class="label">Address:</div>
                <div class="value">${receiptPackage.senderAddress}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">RECIPIENT INFORMATION</div>
              <div class="row">
                <div class="label">Name:</div>
                <div class="value">${receiptPackage.recipientName}</div>
              </div>
              <div class="row">
                <div class="label">Address:</div>
                <div class="value">${receiptPackage.recipientAddress}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">PACKAGE SPECIFICATIONS</div>
              <div class="row">
                <div class="label">Weight:</div>
                <div class="value">${receiptPackage.weight} kg</div>
              </div>
              <div class="row">
                <div class="label">Dimensions:</div>
                <div class="value">${receiptPackage.dimensions}</div>
              </div>
              ${receiptPackage.itemName ? `<div class="row">
                <div class="label">Item Name:</div>
                <div class="value">${receiptPackage.itemName}</div>
              </div>` : ''}
              ${receiptPackage.itemDescription ? `<div class="row">
                <div class="label">Item Description:</div>
                <div class="value">${receiptPackage.itemDescription}</div>
              </div>` : ''}
              <div class="row">
                <div class="label">Declared Value:</div>
                <div class="value">$${(receiptPackage.itemValue || 0).toLocaleString()}</div>
              </div>
            </div>

            <div class="barcode">
              BARCODE: ${receiptPackage.trackingNumber}
            </div>

            <div class="footer">
              Receipt generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Download receipt as PDF
  const downloadReceipt = () => {
    if (!receiptPackage) return;

    // Create a printable HTML content
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Receipt - ${receiptPackage.trackingNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #000; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
          .company-tagline { font-size: 14px; color: #666; margin-bottom: 20px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .label { font-weight: bold; }
          .value { text-align: right; }
          .barcode { text-align: center; font-family: monospace; background: #f0f0f0; padding: 10px; margin: 20px 0; }
          .status-badge { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold; 
          }
          .status-badge.pending { background: #fef3c7; color: #92400e; }
          .status-badge.in_transit { background: #dbeafe; color: #1e40af; }
          .status-badge.delivered { background: #d1fae5; color: #065f46; }
          .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
          @media print {
            body { margin: 0; }
            .receipt { border: none; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="company-name">swiftlogistics</div>
            <div class="company-tagline">Fast & Reliable Worldwide Delivery</div>
            <div>123 Logistics Ave, Swift City, SC 10001</div>
            <div>Phone: (555) 987-6543 | Email: info@swiftlogistics.com</div>
          </div>

          <div class="barcode">
            TRACKING #: ${receiptPackage.trackingNumber}
          </div>

          <div class="section">
            <div class="section-title">SHIPMENT DETAILS</div>
            <div class="row">
              <div class="label">Tracking Number:</div>
              <div class="value">${receiptPackage.trackingNumber}</div>
            </div>
            <div class="row">
              <div class="label">Package ID:</div>
              <div class="value">${receiptPackage.id}</div>
            </div>
            <div class="row">
              <div class="label">Status:</div>
              <div class="value">
                <span class="status-badge ${receiptPackage.status}">
                  ${receiptPackage.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="label">Created Date:</div>
              <div class="value">${receiptPackage.createdAt}</div>
            </div>
            <div class="row">
              <div class="label">Estimated Delivery:</div>
              <div class="value">${receiptPackage.estimatedDelivery}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">PACKAGE SPECIFICATIONS</div>
            <div class="row">
              <div class="label">Weight:</div>
              <div class="value">${receiptPackage.weight} kg</div>
            </div>
            <div class="row">
              <div class="label">Dimensions:</div>
              <div class="value">${receiptPackage.dimensions}</div>
            </div>
            ${receiptPackage.itemName ? `<div class="row">
              <div class="label">Item Name:</div>
              <div class="value">${receiptPackage.itemName}</div>
            </div>` : ''}
            ${receiptPackage.itemDescription ? `<div class="row">
              <div class="label">Item Description:</div>
              <div class="value">${receiptPackage.itemDescription}</div>
            </div>` : ''}
            <div class="row">
              <div class="label">Declared Value:</div>
              <div class="value">$${(receiptPackage.itemValue || 0).toLocaleString()}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">SENDER INFORMATION</div>
            <div class="row">
              <div class="label">Name:</div>
              <div class="value">${receiptPackage.senderName}</div>
            </div>
            <div class="row">
              <div class="label">Address:</div>
              <div class="value">${receiptPackage.senderAddress}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">RECIPIENT INFORMATION</div>
            <div class="row">
              <div class="label">Name:</div>
              <div class="value">${receiptPackage.recipientName}</div>
            </div>
            <div class="row">
              <div class="label">Address:</div>
              <div class="value">${receiptPackage.recipientAddress}</div>
            </div>
          </div>

          <div class="barcode">
            BARCODE: ${receiptPackage.trackingNumber}
          </div>

          <div class="footer">
            Receipt generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
            swiftlogistics - Fast & Reliable Worldwide Delivery
          </div>
        </div>
      </body>
      </html>
    `;

    // Open in new window and trigger print (user can save as PDF)
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Package Management
          </h1>
          <p className="text-gray-400 mt-2">Manage all packages in the system</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openCreateModal}
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
              <p className="text-3xl font-bold mt-2 text-white">{packages.length}</p>
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
              <p className="text-gray-400 text-sm text-white">In Transit</p>
              <p className="text-3xl font-bold mt-2 text-white">{packages.filter(p => p.status === 'in_transit').length}</p>
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
              <p className="text-gray-400 text-sm text-white">Delivered</p>
              <p className="text-3xl font-bold mt-2 text-white">{packages.filter(p => p.status === 'delivered').length}</p>
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
              <p className="text-gray-400 text-sm text-white">Pending</p>
              <p className="text-3xl font-bold mt-2 text-white">{packages.filter(p => p.status === 'pending').length}</p>
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
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            >
              <option value="all" className="text-white">All Status</option>
              <option value="pending" className="text-white">Pending</option>
              <option value="in_transit" className="text-white">In Transit</option>
              <option value="delivered" className="text-white">Delivered</option>
              <option value="cancelled" className="text-white">Cancelled</option>
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
                  <button className="flex items-center gap-2 text-white hover:text-gray-300 transition">
                    Tracking Number
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="py-4 px-6 text-left text-white">Sender</th>
                <th className="py-4 px-6 text-left text-white">Recipient</th>
                <th className="py-4 px-6 text-left text-white">Status</th>
                <th className="py-4 px-6 text-left text-white">Estimated Delivery</th>
                <th className="py-4 px-6 text-left text-white">Actions</th>
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
                    <div className="font-mono font-bold text-white">{pkg.trackingNumber}</div>
                    <div className="text-sm text-gray-600">ID: {pkg.id}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{pkg.senderName}</div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">{pkg.senderAddress}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{pkg.recipientName}</div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">{pkg.recipientAddress}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)} flex items-center gap-1`}>
                        {getStatusIcon(pkg.status)}
                        {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{pkg.estimatedDelivery}</div>
                    <div className="text-sm text-gray-600">
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
                        onClick={() => generateReceipt(pkg)}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition text-green-300"
                        title="Generate Receipt"
                      >
                        <Printer className="h-4 w-4" />
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
                    onChange={(e) => setEditingPackage({ ...editingPackage, trackingNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={editingPackage.status}
                    onChange={(e) => setEditingPackage({ ...editingPackage, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="pending" className="text-gray-900">Pending</option>
                    <option value="in_transit" className="text-gray-900">In Transit</option>
                    <option value="delivered" className="text-gray-900">Delivered</option>
                    <option value="cancelled" className="text-gray-900">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sender Name</label>
                <input
                  type="text"
                  value={editingPackage.senderName}
                  onChange={(e) => setEditingPackage({ ...editingPackage, senderName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sender Address</label>
                <textarea
                  value={editingPackage.senderAddress}
                  onChange={(e) => setEditingPackage({ ...editingPackage, senderAddress: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Name</label>
                <input
                  type="text"
                  value={editingPackage.recipientName}
                  onChange={(e) => setEditingPackage({ ...editingPackage, recipientName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Address</label>
                <textarea
                  value={editingPackage.recipientAddress}
                  onChange={(e) => setEditingPackage({ ...editingPackage, recipientAddress: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPackage.weight}
                    onChange={(e) => setEditingPackage({ ...editingPackage, weight: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Dimensions</label>
                  <input
                    type="text"
                    value={editingPackage.dimensions}
                    onChange={(e) => setEditingPackage({ ...editingPackage, dimensions: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Delivery</label>
                  <input
                    type="date"
                    value={editingPackage.estimatedDelivery}
                    onChange={(e) => setEditingPackage({ ...editingPackage, estimatedDelivery: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
            <h2 className="text-2xl font-bold text-white mb-6">Create New Package</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-400">Tracking Number</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newTracking = generateTrackingCode(packages);
                        setNewTrackingNumber(newTracking);
                        setCreateForm({ ...createForm, trackingNumber: newTracking });
                      }}
                      className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      Generate New
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="BB-YYYY-XXXXXXXX"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    value={createForm.trackingNumber}
                    onChange={(e) => setCreateForm({ ...createForm, trackingNumber: e.target.value })}
                  />
                  <div className="text-xs text-gray-500 mt-1">Format: BB-YYYY-XXXXXXXX (9 digits)</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="pending" className="text-gray-900">Pending</option>
                    <option value="in_transit" className="text-gray-900">In Transit</option>
                    <option value="delivered" className="text-gray-900">Delivered</option>
                    <option value="cancelled" className="text-gray-900">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sender Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={createForm.senderName}
                  onChange={(e) => setCreateForm({ ...createForm, senderName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sender Address</label>
                <textarea
                  placeholder="123 Main St, City, State, ZIP"
                  rows={2}
                  value={createForm.senderAddress}
                  onChange={(e) => setCreateForm({ ...createForm, senderAddress: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Name</label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={createForm.recipientName}
                  onChange={(e) => setCreateForm({ ...createForm, recipientName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Address</label>
                <textarea
                  placeholder="456 Oak Ave, City, State, ZIP"
                  rows={2}
                  value={createForm.recipientAddress}
                  onChange={(e) => setCreateForm({ ...createForm, recipientAddress: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                />
              </div>

              {/* Package Details - Vertical Stack */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={createForm.weight}
                    onChange={(e) => setCreateForm({ ...createForm, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Dimensions</label>
                  <input
                    type="text"
                    placeholder="30x20x15 cm"
                    value={createForm.dimensions}
                    onChange={(e) => setCreateForm({ ...createForm, dimensions: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Electronics, Documents, Clothing"
                    value={createForm.itemName}
                    onChange={(e) => setCreateForm({ ...createForm, itemName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Item Description</label>
                  <textarea
                    placeholder="Describe the item contents"
                    value={createForm.itemDescription}
                    onChange={(e) => setCreateForm({ ...createForm, itemDescription: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Declared Value ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={createForm.itemValue}
                    onChange={(e) => setCreateForm({ ...createForm, itemValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Delivery</label>
                  <input
                    type="date"
                    value={createForm.estimatedDelivery}
                    onChange={(e) => setCreateForm({ ...createForm, estimatedDelivery: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setIsCreating(false);
                  // Reset form when canceling
                  const newTracking = generateTrackingCode(packages);
                  setNewTrackingNumber(newTracking);
                  setCreateForm({
                    trackingNumber: newTracking,
                    senderName: '',
                    senderAddress: '',
                    recipientName: '',
                    recipientAddress: '',
                    weight: 1.0,
                    dimensions: '30x20x15 cm',
                    itemName: '',
                    itemDescription: '',
                    itemValue: 0,
                    status: 'pending',
                    estimatedDelivery: new Date().toISOString().split('T')[0]
                  });
                }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Validate required fields
                  if (!createForm.trackingNumber.trim()) {
                    alert('Please enter a tracking number');
                    return;
                  }

                  if (!createForm.senderName.trim()) {
                    alert('Please enter sender name');
                    return;
                  }

                  if (!createForm.recipientName.trim()) {
                    alert('Please enter recipient name');
                    return;
                  }

                  // Create new package with form values
                  const newPackage: FrontendPackage = {
                    id: `pkg-${Date.now()}`,
                    trackingNumber: createForm.trackingNumber,
                    senderName: createForm.senderName,
                    senderAddress: createForm.senderAddress,
                    recipientName: createForm.recipientName,
                    recipientAddress: createForm.recipientAddress,
                    weight: createForm.weight,
                    dimensions: createForm.dimensions,
                    itemName: createForm.itemName,
                    itemDescription: createForm.itemDescription,
                    itemValue: createForm.itemValue,
                    status: createForm.status,
                    estimatedDelivery: createForm.estimatedDelivery,
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                    userId: 'user-1'
                  };

                  handleCreate(newPackage);

                  // Generate new tracking number for next package
                  const newTracking = generateTrackingCode([...packages, newPackage]);
                  setNewTrackingNumber(newTracking);

                  // Reset form for next entry
                  setCreateForm({
                    trackingNumber: newTracking,
                    senderName: '',
                    senderAddress: '',
                    recipientName: '',
                    recipientAddress: '',
                    weight: 1.0,
                    dimensions: '30x20x15 cm',
                    itemName: '',
                    itemDescription: '',
                    itemValue: 0,
                    status: 'pending',
                    estimatedDelivery: new Date().toISOString().split('T')[0]
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                Create Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptPackage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">swiftlogistics</h2>
              <p className="text-gray-300 text-sm mt-1">Fast & Reliable Worldwide Delivery</p>
              <p className="text-gray-400 text-xs mt-2">123 Logistics Ave, Swift City, SC 10001</p>
              <p className="text-gray-400 text-xs">Phone: (555) 987-6543 | Email: info@swiftlogistics.com</p>
            </div>

            <div className="text-center bg-gray-700 py-3 mb-6 rounded-lg">
              <div className="text-lg font-bold text-white">TRACKING #: {receiptPackage.trackingNumber}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-white border-b border-gray-600 pb-2 mb-3">SHIPMENT DETAILS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Package ID:</span>
                    <span className="font-medium text-white">{receiptPackage.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${receiptPackage.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        receiptPackage.status === 'in_transit' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          receiptPackage.status === 'delivered' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                      {receiptPackage.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Created Date:</span>
                    <span className="font-medium text-white">{receiptPackage.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Estimated Delivery:</span>
                    <span className="font-medium text-white">{receiptPackage.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white border-b border-gray-600 pb-2 mb-3">PACKAGE SPECIFICATIONS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Weight:</span>
                    <span className="font-medium text-white">{receiptPackage.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dimensions:</span>
                    <span className="font-medium text-white">{receiptPackage.dimensions}</span>
                  </div>
                  {receiptPackage.itemName && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Item Name:</span>
                      <span className="font-medium text-white">{receiptPackage.itemName}</span>
                    </div>
                  )}
                  {receiptPackage.itemDescription && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Item Description:</span>
                      <span className="font-medium text-white">{receiptPackage.itemDescription}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-300">Declared Value:</span>
                    <span className="font-medium text-white">${(receiptPackage.itemValue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-white border-b border-gray-600 pb-2 mb-3">SENDER INFORMATION</h3>
                <div className="space-y-2">
                  <div className="font-medium text-white">{receiptPackage.senderName}</div>
                  <div className="text-gray-300 text-sm">{receiptPackage.senderAddress}</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white border-b border-gray-600 pb-2 mb-3">RECIPIENT INFORMATION</h3>
                <div className="space-y-2">
                  <div className="font-medium text-white">{receiptPackage.recipientName}</div>
                  <div className="text-gray-300 text-sm">{receiptPackage.recipientAddress}</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 mb-4">
              <div className="font-mono text-sm tracking-widest bg-gray-700 p-3 inline-block rounded-lg text-white">
                BARCODE: {receiptPackage.trackingNumber}
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 mt-8 mb-4">
              Receipt generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setReceiptPackage(null)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
              <button
                onClick={downloadReceipt}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Receipt
              </button>
              <button
                onClick={printReceipt}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
