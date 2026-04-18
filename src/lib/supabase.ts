import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type PackageStatus = 'pending' | 'processing' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed';
export type ServiceType = 'standard' | 'express' | 'international' | 'overnight';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface Package {
  id: string;
  tracking_number: string;
  service_type: ServiceType;
  priority: PriorityLevel;
  weight_kg: number;
  item_name: string;
  item_description: string;
  item_value: number;
  sender_name: string;
  sender_address: string;
  sender_city: string;
  sender_country: string;
  sender_email: string;
  sender_phone: string;
  receiver_name: string;
  receiver_address: string;
  receiver_city: string;
  receiver_country: string;
  receiver_email: string;
  receiver_phone: string;
  status: PackageStatus;
  current_location: string;
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingUpdate {
  id: string;
  package_id: string;
  status: PackageStatus;
  location: string;
  description: string;
  timestamp: string;
}

// Package operations
export const packageService = {
  // Get package by tracking number
  async getPackageByTrackingNumber(trackingNumber: string): Promise<Package | null> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .single();

    if (error) {
      console.error('Error fetching package:', error);
      return null;
    }

    return data;
  },

  // Get tracking history for a package
  async getTrackingHistory(packageId: string): Promise<TrackingUpdate[]> {
    const { data, error } = await supabase
      .from('tracking_updates')
      .select('*')
      .eq('package_id', packageId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching tracking history:', error);
      return [];
    }

    return data;
  },

  // Create a new package
  async createPackage(packageData: Omit<Package, 'id' | 'created_at' | 'updated_at'>): Promise<Package | null> {
    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single();

    if (error) {
      console.error('Error creating package:', error);
      return null;
    }

    return data;
  },

  // Update package status
  async updatePackageStatus(
    packageId: string,
    status: PackageStatus,
    location: string,
    description?: string
  ): Promise<boolean> {
    // Update package
    const { error: packageError } = await supabase
      .from('packages')
      .update({
        status,
        current_location: location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', packageId);

    if (packageError) {
      console.error('Error updating package:', packageError);
      return false;
    }

    // Create tracking update
    const { error: trackingError } = await supabase
      .from('tracking_updates')
      .insert([{
        package_id: packageId,
        status,
        location,
        description: description || `Package status updated to ${status}`,
        timestamp: new Date().toISOString(),
      }]);

    if (trackingError) {
      console.error('Error creating tracking update:', trackingError);
      return false;
    }

    return true;
  },

  // Get all packages (for admin)
  async getAllPackages(): Promise<Package[]> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching packages:', error);
      return [];
    }

    return data;
  },

  // Subscribe to package updates
  subscribeToPackageUpdates(packageId: string, callback: (update: any) => void) {
    return supabase
      .channel(`package:${packageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packages',
          filter: `id=eq.${packageId}`,
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  },

  // Subscribe to tracking updates
  subscribeToTrackingUpdates(packageId: string, callback: (update: TrackingUpdate) => void) {
    return supabase
      .channel(`tracking:${packageId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tracking_updates',
          filter: `package_id=eq.${packageId}`,
        },
        (payload) => callback(payload.new as TrackingUpdate)
      )
      .subscribe();
  },
};

// Mock data for development
export const mockPackages: Package[] = [
  {
    id: '1',
    tracking_number: 'BB-2026-157946183',
    service_type: 'international',
    priority: 'high',
    weight_kg: 2.5,
    item_name: 'MacBook Pro 16"',
    item_description: 'Apple MacBook Pro 16-inch, M3 Max, 64GB RAM, 2TB SSD',
    item_value: 3499,
    sender_name: 'Apple Inc.',
    sender_address: 'One Apple Park Way',
    sender_city: 'Cupertino',
    sender_country: 'USA',
    sender_email: 'support@apple.com',
    sender_phone: '+1-800-692-7753',
    receiver_name: 'John Smith',
    receiver_address: '123 Main Street',
    receiver_city: 'London',
    receiver_country: 'UK',
    receiver_email: 'john.smith@example.com',
    receiver_phone: '+44-20-7123-4567',
    status: 'in_transit',
    current_location: 'London Heathrow Airport',
    estimated_delivery: '2024-04-20T14:00:00Z',
    created_at: '2024-04-15T09:30:00Z',
    updated_at: '2024-04-18T08:45:00Z',
  },
  {
    id: '2',
    tracking_number: 'BB-2026-157946184',
    service_type: 'express',
    priority: 'urgent',
    weight_kg: 0.5,
    item_name: 'Medical Supplies',
    item_description: 'Emergency medical equipment and supplies',
    item_value: 1250,
    sender_name: 'MedSupply Inc.',
    sender_address: '456 Medical Blvd',
    sender_city: 'Berlin',
    sender_country: 'Germany',
    sender_email: 'orders@medsupply.com',
    sender_phone: '+49-30-12345678',
    receiver_name: 'City Hospital',
    receiver_address: '789 Health Street',
    receiver_city: 'Paris',
    receiver_country: 'France',
    receiver_email: 'receiving@cityhospital.fr',
    receiver_phone: '+33-1-23456789',
    status: 'out_for_delivery',
    current_location: 'Paris Distribution Center',
    estimated_delivery: '2024-04-18T11:30:00Z',
    created_at: '2024-04-17T14:20:00Z',
    updated_at: '2024-04-18T09:15:00Z',
  },
];

export const mockTrackingUpdates: Record<string, TrackingUpdate[]> = {
  '1': [
    {
      id: '1',
      package_id: '1',
      status: 'pending',
      location: 'Cupertino, USA',
      description: 'Package received at origin facility',
      timestamp: '2024-04-15T09:30:00Z',
    },
    {
      id: '2',
      package_id: '1',
      status: 'processing',
      location: 'San Francisco Airport',
      description: 'Package processed for international shipping',
      timestamp: '2024-04-16T14:20:00Z',
    },
    {
      id: '3',
      package_id: '1',
      status: 'in_transit',
      location: 'London Heathrow Airport',
      description: 'Package arrived at destination country',
      timestamp: '2024-04-18T08:45:00Z',
    },
  ],
  '2': [
    {
      id: '4',
      package_id: '2',
      status: 'pending',
      location: 'Berlin, Germany',
      description: 'Express package received',
      timestamp: '2024-04-17T14:20:00Z',
    },
    {
      id: '5',
      package_id: '2',
      status: 'in_transit',
      location: 'Frankfurt Airport',
      description: 'Package departed for destination',
      timestamp: '2024-04-17T18:30:00Z',
    },
    {
      id: '6',
      package_id: '2',
      status: 'out_for_delivery',
      location: 'Paris Distribution Center',
      description: 'Package out for delivery',
      timestamp: '2024-04-18T09:15:00Z',
    },
  ],
};