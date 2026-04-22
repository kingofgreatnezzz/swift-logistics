-- SQL to add item_value column to your packages table
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/fmppyrxizbbtxmhvdqeg/sql

-- Option 1: Add item_value column with default value 0
ALTER TABLE public.packages 
ADD COLUMN item_value DECIMAL(10,2) DEFAULT 0;

-- Option 2: If you want it to be nullable (can be NULL)
-- ALTER TABLE public.packages 
-- ADD COLUMN item_value DECIMAL(10,2);

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'packages'
ORDER BY ordinal_position;

-- Update existing packages to have item_value = 0 (if using nullable column)
-- UPDATE public.packages SET item_value = 0 WHERE item_value IS NULL;

-- Test by inserting a sample package with item_value
INSERT INTO public.packages (
  tracking_number,
  sender_name,
  sender_address,
  receiver_name,
  receiver_address,
  weight_kg,
  dimensions,
  status,
  estimated_delivery,
  item_value
) VALUES (
  'TEST-2026-123456789',
  'Test Sender',
  '123 Test St',
  'Test Receiver',
  '456 Test Ave',
  2.5,
  '30x20x15 cm',
  'pending',
  NOW() + INTERVAL '7 days',
  99.99
);

-- Check the inserted data
SELECT tracking_number, sender_name, item_value 
FROM public.packages 
WHERE tracking_number = 'TEST-2026-123456789';

-- Delete the test data (optional)
-- DELETE FROM public.packages WHERE tracking_number = 'TEST-2026-123456789';