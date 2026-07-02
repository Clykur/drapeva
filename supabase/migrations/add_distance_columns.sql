-- ============================================================
-- DRAPEVA — Add distance tracking columns to customer_addresses
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- 1. Add distance tracking columns to customer_addresses
ALTER TABLE customer_addresses
  ADD COLUMN IF NOT EXISTS distance_km         DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS distance_calculated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS distance_status     TEXT DEFAULT 'pending'
    CHECK (distance_status IN ('pending','success','failed')),
  ADD COLUMN IF NOT EXISTS shipping_charge     DECIMAL(10,2);

-- 2. Seed store location defaults into site_settings
--    (Drapeva HQ — NPS School Road, Chikkabellandur, Karnataka)
INSERT INTO site_settings (key, value, updated_at)
VALUES
  ('store_latitude',  12.9043695, NOW()),
  ('store_longitude', 77.7157816, NOW())
ON CONFLICT (key) DO NOTHING;
