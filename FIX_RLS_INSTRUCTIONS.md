# How to Fix Supabase RLS (Row Level Security) Error

## The Problem
When trying to add/update/delete packages, you're getting this error:
```
new row violates row-level security policy for table "packages"
```

This happens because Supabase has **Row Level Security (RLS)** enabled by default, which prevents unauthorized database operations.

## Solution

### Option 1: Run SQL Script (Recommended)
1. Go to your Supabase project: https://supabase.com/dashboard/project/fmppyrxizbbtxmhvdqeg/sql
2. Copy the entire content from `fix_rls_simple.sql`
3. Paste it into the SQL Editor
4. Click **RUN**
5. Try creating a package again in your admin panel

### Option 2: Manual Fix via Supabase Dashboard
1. Go to your Supabase project: https://supabase.com/dashboard/project/fmppyrxizbbtxmhvdqeg
2. Click on **Table Editor** in the left sidebar
3. Find the `packages` table
4. Click on the **Policies** tab
5. Click **Create a new policy**
6. Choose:
   - Policy name: `Allow all operations`
   - Operation: `ALL`
   - Expression: `true`
7. Click **Save**
8. Try creating a package again

### Option 3: Temporary Workaround (Development Only)
If you need to test immediately, the app will use mock data when Supabase fails. However, changes won't be saved to the database.

## What RLS Policies Were Created?
The script creates policies that:
- Allow INSERT (creating new packages)
- Allow SELECT (reading packages)
- Allow UPDATE (editing packages)
- Allow DELETE (removing packages)

For all users (including anonymous users with your anon key).

## Security Note
For a production app, you should create more restrictive policies that:
1. Only allow authenticated users to access the table
2. Only allow users to see/edit their own packages
3. Use proper user authentication

But for your admin panel development, the open policies are fine.

## Testing
After fixing RLS:
1. Go to `/only-admin/packages`
2. Click **Add Package**
3. Fill in the form
4. Click **Create Package**
5. It should now work without the RLS error!

## Need Help?
If you still get errors after running the SQL:
1. Check the browser console for more details
2. Make sure your `.env.local` file has the correct Supabase URL and anon key
3. Try refreshing the page after running the SQL script