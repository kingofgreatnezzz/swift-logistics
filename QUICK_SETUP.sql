-- QUICK SUPABASE SETUP
-- Run this in your new Supabase SQL Editor

-- 1. Create packages table with all columns
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

-- 2. Enable RLS and create open policy
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.packages FOR ALL USING (true) WITH CHECK (true);

-- 3. Create indexes
CREATE INDEX idx_packages_tracking ON public.packages(tracking_number);
CREATE INDEX idx_packages_status ON public.packages(status);

-- 4. Add sample data
INSERT INTO public.packages (
  tracking_number, sender_name, sender_address, receiver_name, receiver_address,
  weight_kg, dimensions, item_name, item_description, item_value, status, estimated_delivery
) VALUES
  ('BB-2026-111111111', 'Test Sender', '123 Test St', 'Test Receiver', '456 Test Ave',
   2.5, '30x20x15 cm', 'Electronics', 'Test laptop', 1000.00, 'pending', NOW() + INTERVAL '7 days'),
  ('BB-2026-222222222', 'Another Sender', '789 Test Rd', 'Another Receiver', '321 Test Blvd',
   1.0, '20x15x10 cm', 'Documents', 'Important papers', 500.00, 'in_transit', NOW() + INTERVAL '5 days');

-- 5. Verify
SELECT '✅ Setup complete!' AS message;
SELECT COUNT(*) AS total_packages FROM public.packages;