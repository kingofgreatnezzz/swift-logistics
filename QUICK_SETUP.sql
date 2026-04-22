-- QUICK SUPABASE SETUP
-- Run this in your new Supabase SQL Editor

-- 1. Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create packages table with all columns
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  sender_name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  weight_kg DECIMAL(10,2) DEFAULT 1.0,
  dimensions TEXT DEFAULT '30x20x15 cm',
  item_name TEXT DEFAULT '',
  item_description TEXT DEFAULT '',
  item_value DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT DEFAULT 'user-1'
);

-- 3. Enable RLS and create open policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations (users)" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations (packages)" ON public.packages FOR ALL USING (true) WITH CHECK (true);

-- 4. Create indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_packages_tracking ON public.packages(tracking_number);
CREATE INDEX idx_packages_status ON public.packages(status);

-- 5. Add sample data
-- Add sample admin user
INSERT INTO public.users (email, name, role) 
VALUES ('admin@swiftlogistics.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Add sample packages
INSERT INTO public.packages (
  tracking_number, sender_name, sender_address, receiver_name, receiver_address,
  weight_kg, dimensions, item_name, item_description, item_value, status, estimated_delivery
) VALUES
  ('BB-2026-111111111', 'Test Sender', '123 Test St', 'Test Receiver', '456 Test Ave',
   2.5, '30x20x15 cm', 'Electronics', 'Test laptop', 1000.00, 'pending', NOW() + INTERVAL '7 days'),
  ('BB-2026-222222222', 'Another Sender', '789 Test Rd', 'Another Receiver', '321 Test Blvd',
   1.0, '20x15x10 cm', 'Documents', 'Important papers', 500.00, 'in_transit', NOW() + INTERVAL '5 days');

-- 6. Verify
SELECT '✅ Setup complete!' AS message;
SELECT 
  (SELECT COUNT(*) FROM public.users) AS total_users,
  (SELECT COUNT(*) FROM public.packages) AS total_packages;