-- MASTER SUPABASE SETUP SQL
-- Run this entire script in your Supabase SQL Editor to set up a new project
-- URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

-- ============================================
-- 1. CREATE USERS TABLE (for authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE PACKAGES TABLE
-- ============================================
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

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================
-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Packages indexes
CREATE INDEX IF NOT EXISTS idx_packages_tracking_number ON public.packages(tracking_number);
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON public.packages(created_at DESC);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. CREATE RLS POLICIES (OPEN FOR DEVELOPMENT)
-- ============================================
-- Users RLS policies
CREATE POLICY "Allow all operations for development (users)" ON public.users
  FOR ALL USING (true) WITH CHECK (true);

-- Packages RLS policies
CREATE POLICY "Allow all operations for development (packages)" ON public.packages
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 6. CREATE SAMPLE DATA
-- ============================================
-- Create sample admin user (change email as needed)
INSERT INTO public.users (email, name, role) 
VALUES ('admin@swiftlogistics.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create sample regular user
INSERT INTO public.users (email, name, role) 
VALUES ('user@example.com', 'Regular User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Create sample packages
INSERT INTO public.packages (
  tracking_number,
  sender_name,
  sender_address,
  receiver_name,
  receiver_address,
  weight_kg,
  dimensions,
  item_name,
  item_description,
  item_value,
  status,
  estimated_delivery
) VALUES
  (
    'BB-2026-123456789',
    'John Smith',
    '123 Main St, New York, NY 10001',
    'Sarah Johnson',
    '456 Oak Ave, Los Angeles, CA 90001',
    2.5,
    '30x20x15 cm',
    'Electronics',
    'Laptop and accessories',
    1200.00,
    'in_transit',
    NOW() + INTERVAL '7 days'
  ),
  (
    'BB-2026-987654321',
    'Alice Brown',
    '789 Pine Rd, Chicago, IL 60601',
    'Bob Wilson',
    '321 Maple St, Houston, TX 77001',
    5.0,
    '50x40x30 cm',
    'Documents',
    'Legal contracts and certificates',
    500.00,
    'pending',
    NOW() + INTERVAL '5 days'
  ),
  (
    'BB-2026-555555555',
    'Charlie Davis',
    '654 Elm Blvd, Miami, FL 33101',
    'Diana Miller',
    '987 Cedar Ln, Seattle, WA 98101',
    1.5,
    '25x15x10 cm',
    'Clothing',
    'Winter jackets and sweaters',
    350.00,
    'delivered',
    NOW() - INTERVAL '2 days'
  ),
  (
    'BB-2026-444444444',
    'Edward Garcia',
    '852 Birch Dr, Phoenix, AZ 85001',
    'Fiona Martinez',
    '159 Spruce Way, Denver, CO 80201',
    3.0,
    '40x30x20 cm',
    'Medical Supplies',
    'First aid kits and medications',
    800.00,
    'cancelled',
    NOW() + INTERVAL '3 days'
  );

-- ============================================
-- 7. VERIFY THE SETUP
-- ============================================
-- Check users table structure
SELECT 'Users table:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check packages table structure
SELECT 'Packages table:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'packages'
ORDER BY ordinal_position;

-- Check sample users
SELECT 'Sample users:' as section;
SELECT id, email, name, role, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- Check sample packages
SELECT 'Sample packages:' as section;
SELECT 
  tracking_number,
  sender_name,
  receiver_name,
  item_name,
  item_value,
  status,
  estimated_delivery
FROM public.packages
ORDER BY created_at DESC;

-- ============================================
-- 8. CREATE FUNCTION TO UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 9. CREATE TRIGGERS FOR AUTO-UPDATE
-- ============================================
-- For users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- For packages table
DROP TRIGGER IF EXISTS update_packages_updated_at ON public.packages;
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. CREATE FUNCTION TO GENERATE TRACKING NUMBER
-- ============================================
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  random_part TEXT;
  tracking_code TEXT;
  counter INTEGER := 0;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  LOOP
    -- Generate 9 random digits
    random_part := LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
    tracking_code := 'BB-' || year_part || '-' || random_part;
    
    -- Check if it exists
    IF NOT EXISTS (SELECT 1 FROM public.packages WHERE tracking_number = tracking_code) THEN
      RETURN tracking_code;
    END IF;
    
    counter := counter + 1;
    IF counter > 10 THEN
      -- Fallback: add timestamp to ensure uniqueness
      random_part := LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
      tracking_code := 'BB-' || year_part || '-' || random_part || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
      RETURN tracking_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. TEST THE GENERATOR FUNCTION
-- ============================================
SELECT generate_tracking_code() AS new_tracking_code;

-- ============================================
-- 12. SUMMARY
-- ============================================
SELECT '✅ SUPABASE SETUP COMPLETE!' AS message;
SELECT 
  (SELECT COUNT(*) FROM public.users) AS total_users,
  (SELECT COUNT(*) FROM public.packages) AS total_packages,
  (SELECT COUNT(DISTINCT tracking_number) FROM public.packages) AS unique_tracking_numbers,
  (SELECT SUM(item_value) FROM public.packages) AS total_declared_value;