-- Simple SQL to add item_value column to packages table
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/fmppyrxizbbtxmhvdqeg/sql

-- Add the item_value column
ALTER TABLE public.packages 
ADD COLUMN item_value DECIMAL(10,2) DEFAULT 0;

-- Check that it was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'packages' 
ORDER BY ordinal_position;