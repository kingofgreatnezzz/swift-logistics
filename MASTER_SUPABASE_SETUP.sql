-- ============================================================
-- SwiftLogistics – Complete Supabase Schema
-- Run ONCE in your Supabase SQL Editor. Idempotent.
-- https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
-- ============================================================

-- ── 1. USERS (authentication & roles) ────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  username   TEXT UNIQUE,                   -- used for signup/login
  name       TEXT,                          -- display name
  password   TEXT,                          -- hashed password (bcrypt)
  role       TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ── 2. PACKAGES (full schema the app expects) ─────────────────

CREATE TABLE IF NOT EXISTS public.packages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number     TEXT UNIQUE NOT NULL,
  service_type        TEXT DEFAULT 'standard',    -- standard / express / international / overnight
  priority            TEXT DEFAULT 'medium',       -- low / medium / high / urgent
  weight_kg           NUMERIC(10,2) DEFAULT 1.0,
  dimensions          TEXT DEFAULT '30x20x15 cm',
  item_name           TEXT DEFAULT '',
  item_description    TEXT DEFAULT '',
  item_value          NUMERIC(10,2) DEFAULT 0,

  sender_name         TEXT NOT NULL,
  sender_address      TEXT NOT NULL,
  sender_city         TEXT DEFAULT '',
  sender_country      TEXT DEFAULT '',
  sender_email        TEXT DEFAULT '',
  sender_phone        TEXT DEFAULT '',

  receiver_name       TEXT NOT NULL,
  receiver_address    TEXT NOT NULL,
  receiver_city       TEXT DEFAULT '',
  receiver_country    TEXT DEFAULT '',
  receiver_email      TEXT DEFAULT '',
  receiver_phone      TEXT DEFAULT '',

  status              TEXT DEFAULT 'pending' CHECK (status IN (
                          'pending', 'processing', 'in_transit',
                          'out_for_delivery', 'delivered', 'delayed', 'cancelled'
                        )),
  current_location    TEXT DEFAULT '',
  estimated_delivery  TIMESTAMPTZ,
  user_id             TEXT DEFAULT 'user-1',

  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packages_tracking_number ON public.packages(tracking_number);
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON public.packages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_packages_user_id ON public.packages(user_id);

-- ── 3. TRACKING UPDATES (history timeline per package) ────────

CREATE TABLE IF NOT EXISTS public.tracking_updates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  status      TEXT DEFAULT '',
  location    TEXT DEFAULT '',
  description TEXT DEFAULT '',
  timestamp   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracking_updates_package_id ON public.tracking_updates(package_id);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_timestamp ON public.tracking_updates(timestamp DESC);

-- ── 4. ROW LEVEL SECURITY (open for development) ──────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_updates ENABLE ROW LEVEL SECURITY;

-- Drop any leftover policies then recreate cleanly
DROP POLICY IF EXISTS "Allow all operations for development (users)" ON public.users;
DROP POLICY IF EXISTS "Allow all operations (users)" ON public.users;
DROP POLICY IF EXISTS "allow_all_users" ON public.users;

DROP POLICY IF EXISTS "Allow all operations for development (packages)" ON public.packages;
DROP POLICY IF EXISTS "Allow all operations (packages)" ON public.packages;
DROP POLICY IF EXISTS "allow_all_packages" ON public.packages;

DROP POLICY IF EXISTS "allow_all_tracking" ON public.tracking_updates;

CREATE POLICY dev_all_users ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY dev_all_packages ON public.packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY dev_all_tracking ON public.tracking_updates FOR ALL USING (true) WITH CHECK (true);

-- ── 5. AUTO-UPDATE TRIGGER (sets updated_at on row change) ───

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_users_updated_at') THEN
    CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_packages_updated_at') THEN
    CREATE TRIGGER set_packages_updated_at BEFORE UPDATE ON public.packages
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ── 6. TRACKING NUMBER GENERATOR ──────────────────────────────

CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
  year_part    TEXT;
  random_part  TEXT;
  tracking_code TEXT;
  counter      INTEGER := 0;
BEGIN
  year_part := EXTRACT(YEAR FROM now())::TEXT;

  LOOP
    random_part := LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
    tracking_code := 'BB-' || year_part || '-' || random_part;

    IF NOT EXISTS (SELECT 1 FROM public.packages WHERE tracking_number = tracking_code) THEN
      RETURN tracking_code;
    END IF;

    counter := counter + 1;
    IF counter > 10 THEN
      random_part := LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
      tracking_code := 'BB-' || year_part || '-' || random_part || '-' || EXTRACT(EPOCH FROM now())::TEXT;
      RETURN tracking_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ── 7. SEED DATA (sample users + packages) ────────────────────

INSERT INTO public.users (email, username, name, password, role) VALUES
  ('tebia@gmail.com', 'tebia', 'Tebia Admin', 'Password@1', 'admin'),
  ('user@example.com', 'demo_user', 'Demo User',    'Password@123', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.packages (
  tracking_number, service_type, priority, weight_kg, dimensions,
  item_name, item_description, item_value,
  sender_name, sender_address, sender_city, sender_country, sender_email, sender_phone,
  receiver_name, receiver_address, receiver_city, receiver_country, receiver_email, receiver_phone,
  status, current_location, estimated_delivery
) VALUES
  (
    'BB-2026-157946183', 'international', 'high', 2.5, '30x20x15 cm',
    'MacBook Pro 16"', 'Apple MacBook Pro 16-inch, M3 Max, 64GB RAM, 2TB SSD', 3499.00,
    'Apple Inc.', 'One Apple Park Way', 'Cupertino', 'USA', 'support@apple.com', '+1-800-692-7753',
    'John Smith', '123 Main Street', 'London', 'UK', 'john.smith@example.com', '+44-20-7123-4567',
    'in_transit', 'London Heathrow Airport', now() + INTERVAL '5 days'
  ),
  (
    'BB-2026-157946184', 'express', 'urgent', 0.5, '25x15x10 cm',
    'Medical Supplies', 'Emergency medical equipment and supplies', 1250.00,
    'MedSupply Inc.', '456 Medical Blvd', 'Berlin', 'Germany', 'orders@medsupply.com', '+49-30-12345678',
    'City Hospital', '789 Health Street', 'Paris', 'France', 'receiving@cityhospital.fr', '+33-1-23456789',
    'out_for_delivery', 'Paris Distribution Center', now() + INTERVAL '1 day'
  ),
  (
    'BB-2026-123456789', 'standard', 'medium', 5.0, '50x40x30 cm',
    'Books', 'Collection of technical books', 350.00,
    'Alice Brown', '789 Pine Rd', 'Chicago', 'USA', 'alice@example.com', '+1-312-555-0100',
    'Bob Wilson', '321 Maple St', 'Houston', 'USA', 'bob@example.com', '+1-713-555-0100',
    'delivered', 'Houston Delivery Hub', now() - INTERVAL '2 days'
  )
ON CONFLICT (tracking_number) DO NOTHING;

-- Seed tracking history for the first package
INSERT INTO public.tracking_updates (package_id, status, location, description)
SELECT p.id, 'pending', 'New York Sorting Center', 'Package registered in the system'
FROM public.packages p WHERE p.tracking_number = 'BB-2026-157946183';

-- ═══════════════════════════════════════════════════════════════
-- DONE. Verify with:
-- SELECT 'Users' tbl, COUNT(*) FROM public.users
-- UNION ALL SELECT 'Packages', COUNT(*) FROM public.packages
-- UNION ALL SELECT 'Tracking Updates', COUNT(*) FROM public.tracking_updates;
-- ═══════════════════════════════════════════════════════════════

-- If you already had tables from an old schema, some columns may not exist.
-- Uncomment and run these ALTER statements to add any missing columns:

-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
