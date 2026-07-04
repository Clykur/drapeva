-- DRAPEVA — Clean Product Schema and Seed Migration

-- 1. Clean unused columns/tables if safe, or simply alter products table
ALTER TABLE products DROP COLUMN IF EXISTS occasion CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS weave CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS badge CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS compare_at CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS video_url CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS tags CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS details CASCADE;

-- Ensure product_code is present
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_code TEXT;

-- Add new fields if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INT NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS color TEXT;

-- Ensure product_images has sort_order
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

-- Drop old trigger/functions from branded-ids so they don't conflict
DROP TRIGGER IF EXISTS trigger_generate_product_code ON products;
DROP FUNCTION IF EXISTS generate_product_code();

-- Create a table/sequence for product sequence increment per fabric/color combo, or just a simple increment table.
CREATE TABLE IF NOT EXISTS product_code_sequence (
  fabric_code VARCHAR(10),
  color_code VARCHAR(10),
  last_value INT DEFAULT 0,
  PRIMARY KEY (fabric_code, color_code)
);

-- Function to get fabric code
CREATE OR REPLACE FUNCTION get_fabric_code(fabric_name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE
    WHEN fabric_name ILIKE '%Kanjivaram%' THEN 'KCS'
    WHEN fabric_name ILIKE '%Banarasi%' THEN 'BNS'
    WHEN fabric_name ILIKE '%Soft Silk%' THEN 'SSK'
    WHEN fabric_name ILIKE '%Bhagalpuri%' THEN 'BGS'
    WHEN fabric_name ILIKE '%Organza%' THEN 'ORG'
    WHEN fabric_name ILIKE '%Chiffon%' THEN 'CHF'
    WHEN fabric_name ILIKE '%Georgette%' THEN 'GEO'
    WHEN fabric_name ILIKE '%Khadi%' THEN 'KHC'
    WHEN fabric_name ILIKE '%Mulmul Cotton%' THEN 'MMC'
    WHEN fabric_name ILIKE '%Kota Cotton%' THEN 'KTC'
    WHEN fabric_name ILIKE '%Chikankari%' THEN 'CKK'
    WHEN fabric_name ILIKE '%Mulmul Linen%' THEN 'MML'
    WHEN fabric_name ILIKE '%Tissue%' THEN 'TIS'
    ELSE 'GEN'
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to get color code
CREATE OR REPLACE FUNCTION get_color_code(color_name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE
    WHEN color_name ILIKE '%Maroon%' THEN 'MRN'
    WHEN color_name ILIKE '%Red%' THEN 'RED'
    WHEN color_name ILIKE '%Pink%' THEN 'PNK'
    WHEN color_name ILIKE '%Purple%' THEN 'PRP'
    WHEN color_name ILIKE '%Navy%' THEN 'NVY'
    WHEN color_name ILIKE '%Sky%' THEN 'SKY'
    WHEN color_name ILIKE '%Blue%' THEN 'BLU'
    WHEN color_name ILIKE '%Emerald%' THEN 'EMG'
    WHEN color_name ILIKE '%Green%' THEN 'GRN'
    WHEN color_name ILIKE '%Mustard%' THEN 'MST'
    WHEN color_name ILIKE '%Yellow%' THEN 'YLW'
    WHEN color_name ILIKE '%Orange%' THEN 'ORG'
    WHEN color_name ILIKE '%Gold%' THEN 'GLD'
    WHEN color_name ILIKE '%Black%' THEN 'BLK'
    WHEN color_name ILIKE '%White%' THEN 'WHT'
    WHEN color_name ILIKE '%Cream%' THEN 'CRM'
    WHEN color_name ILIKE '%Beige%' THEN 'BGE'
    WHEN color_name ILIKE '%Grey%' THEN 'GRY'
    WHEN color_name ILIKE '%Brown%' THEN 'BRN'
    WHEN color_name ILIKE '%Peach%' THEN 'PCH'
    WHEN color_name ILIKE '%Lavender%' THEN 'LVD'
    ELSE 'CLR'
  END;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to automatically generate product_code
CREATE OR REPLACE FUNCTION generate_drapeva_product_code()
RETURNS TRIGGER AS $$
DECLARE
  f_code TEXT;
  c_code TEXT;
  next_val INT;
BEGIN
  IF NEW.product_code IS NULL OR NEW.product_code = '' THEN
    f_code := get_fabric_code(NEW.fabric);
    c_code := get_color_code(NEW.color);
    
    INSERT INTO product_code_sequence (fabric_code, color_code, last_value)
    VALUES (f_code, c_code, 1)
    ON CONFLICT (fabric_code, color_code)
    DO UPDATE SET last_value = product_code_sequence.last_value + 1
    RETURNING last_value INTO next_val;
    
    NEW.product_code := 'DE-' || f_code || '-' || c_code || '-' || lpad(next_val::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_generate_drapeva_product_code
BEFORE INSERT ON products
FOR EACH ROW EXECUTE FUNCTION generate_drapeva_product_code();

-- Backfill existing products
DO $$
DECLARE
  prod RECORD;
  f_code TEXT;
  c_code TEXT;
  next_val INT;
  new_code TEXT;
BEGIN
  -- Reset sequence table for fresh backfill
  TRUNCATE TABLE product_code_sequence;
  
  FOR prod IN SELECT id, fabric, color FROM products ORDER BY created_at ASC LOOP
    f_code := get_fabric_code(prod.fabric);
    c_code := get_color_code(prod.color);
    
    INSERT INTO product_code_sequence (fabric_code, color_code, last_value)
    VALUES (f_code, c_code, 1)
    ON CONFLICT (fabric_code, color_code)
    DO UPDATE SET last_value = product_code_sequence.last_value + 1
    RETURNING last_value INTO next_val;
    
    new_code := 'DE-' || f_code || '-' || c_code || '-' || lpad(next_val::text, 4, '0');
    
    UPDATE products SET product_code = new_code WHERE id = prod.id;
  END LOOP;
END;
$$;

-- Make product_code UNIQUE and NOT NULL
ALTER TABLE products ALTER COLUMN product_code SET NOT NULL;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_code_key;
ALTER TABLE products ADD CONSTRAINT products_product_code_key UNIQUE (product_code);

-- Update seed data: Categories
DELETE FROM categories;
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
  ('Kanjivaram Sarees', 'kanjivaram-sarees', 'Authentic Kanchipuram silk sarees', 1, true),
  ('Banarasi Sarees', 'banarasi-sarees', 'Handwoven Banaras silk sarees', 2, true),
  ('Khadi Cotton', 'khadi-cotton', 'Comfortable Khadi cotton sarees', 3, true),
  ('Mulmul Cotton', 'mulmul-cotton', 'Lightweight mulmul cotton sarees', 4, true),
  ('Kota Cotton', 'kota-cotton', 'Kota cotton sarees', 5, true),
  ('Chikankari Kota', 'chikankari-kota', 'Chikankari embroidered Kota sarees', 6, true),
  ('Bhagalpuri Silk', 'bhagalpuri-silk', 'Tussar and Bhagalpuri silk sarees', 7, true),
  ('Tissue Sarees', 'tissue-sarees', 'Elegant tissue sarees', 8, true),
  ('Mulmul Linen', 'mulmul-linen', 'Breathable mulmul linen sarees', 9, true),
  ('Organza Sarees', 'organza-sarees', 'Sheer organza sarees', 10, true),
  ('Chiffon Sarees', 'chiffon-sarees', 'Flowing chiffon sarees', 11, true),
  ('Soft Silk Sarees', 'soft-silk-sarees', 'Luxurious soft silk sarees', 12, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active;

-- Update seed data: Collections
DELETE FROM collections;
INSERT INTO collections (name, slug, description, tagline, is_featured, sort_order, is_active) VALUES
  ('New Arrivals', 'new-arrivals', 'Freshly curated handcrafted sarees featuring our newest designs.', 'Freshly curated designs', true, 1, true),
  ('Best Sellers', 'best-sellers', 'Our most-loved sarees chosen for their elegance and craftsmanship.', 'Most-loved sarees', true, 2, true),
  ('Festive Collection', 'festive-collection', 'Celebrate every occasion with timeless festive sarees.', 'Timeless festive wear', true, 3, true),
  ('Office Wear', 'office-wear', 'Lightweight sarees designed for everyday professional elegance.', 'Everyday professional elegance', true, 4, true),
  ('Everyday Wear', 'everyday-wear', 'Comfortable sarees crafted for effortless daily style.', 'Effortless daily style', true, 5, true),
  ('Premium Silk Collection', 'premium-silk-collection', 'Luxurious silk sarees showcasing exceptional craftsmanship.', 'Luxurious silk collection', true, 6, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, tagline = EXCLUDED.tagline, is_featured = EXCLUDED.is_featured, sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active;
