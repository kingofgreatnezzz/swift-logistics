-- Fix Row Level Security (RLS) policies for packages table
-- Run this in your Supabase SQL Editor at: https://supabase.com/dashboard/project/fmppyrxizbbtxmhvdqeg/sql

-- 1. First, let's check if RLS is enabled on the packages table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'packages';

-- 2. If RLS is enabled (should be for security), we need to create policies
-- Enable RLS if not already enabled (it usually is by default)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (clean slate)
DROP POLICY IF EXISTS "Allow public insert" ON public.packages;
DROP POLICY IF EXISTS "Allow public select" ON public.packages;
DROP POLICY IF EXISTS "Allow public update" ON public.packages;
DROP POLICY IF EXISTS "Allow public delete" ON public.packages;

-- 4. Create new policies for the packages table
-- Allow anyone to insert packages (for your admin panel)
CREATE POLICY "Allow public insert" ON public.packages
  FOR INSERT WITH CHECK (true);

-- Allow anyone to select packages
CREATE POLICY "Allow public select" ON public.packages
  FOR SELECT USING (true);

-- Allow anyone to update packages
CREATE POLICY "Allow public update" ON public.packages
  FOR UPDATE USING (true);

-- Allow anyone to delete packages  
CREATE POLICY "Allow public delete" ON public.packages
  FOR DELETE USING (true);

-- 5. Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'packages'
ORDER BY policyname;

-- 6. Alternative: If you want more restrictive policies (recommended for production):
/*
-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.packages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to select their own packages
CREATE POLICY "Allow user select" ON public.packages
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own packages
CREATE POLICY "Allow user update" ON public.packages
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own packages
CREATE POLICY "Allow user delete" ON public.packages
  FOR DELETE USING (auth.uid() = user_id);
*/

-- 7. If you're still having issues, you can temporarily disable RLS (NOT recommended for production):
-- ALTER TABLE public.packages DISABLE ROW LEVEL SECURITY;