-- Simple fix for Supabase RLS (Row Level Security) issue
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/fmppyrxizbbtxmhvdqeg/sql

-- Option 1: Easiest - Create policies that allow all operations
-- (Use this for development/testing)

-- Enable RLS if not already enabled
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for everyone
CREATE POLICY "Allow all operations" ON public.packages
  FOR ALL USING (true);

-- If the above gives an error that policy already exists, try this instead:
-- DROP POLICY IF EXISTS "Allow all operations" ON public.packages;
-- CREATE POLICY "Allow all operations" ON public.packages
--   FOR ALL USING (true);

-- Option 2: More secure - Create specific policies
-- (Use this for production)

/*
-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Allow insert for authenticated users
CREATE POLICY "Allow insert for authenticated" ON public.packages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow select for authenticated users  
CREATE POLICY "Allow select for authenticated" ON public.packages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow update for authenticated users
CREATE POLICY "Allow update for authenticated" ON public.packages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow delete for authenticated users
CREATE POLICY "Allow delete for authenticated" ON public.packages
  FOR DELETE USING (auth.role() = 'authenticated');
*/

-- Option 3: Disable RLS entirely (NOT RECOMMENDED for production)
-- Only use this if you're having serious issues and understand the security implications
/*
ALTER TABLE public.packages DISABLE ROW LEVEL SECURITY;
*/

-- After running this script, try creating a package again in your admin panel.
-- The error should be fixed!