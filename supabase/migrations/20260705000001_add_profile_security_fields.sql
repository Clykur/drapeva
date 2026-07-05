-- Migration: Add missing columns to profiles and ensure support tables exist for clean Supabase-only architecture

-- 1. Add fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthday TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS anniversary TIMESTAMPTZ;

-- 2. Ensure UserSession table exists in public schema (matching database definition)
CREATE TABLE IF NOT EXISTS "UserSession" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ensure AuditLog table exists (matching database definition)
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  time_slot TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('IN_PERSON', 'VIDEO')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
CREATE POLICY "Anyone can create appointments" ON appointments FOR INSERT WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Admins can manage appointments" ON appointments;
CREATE POLICY "Admins can manage appointments" ON appointments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. Create inventory_reservations table
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL, -- references ProductVariant
  quantity INT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_released BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create inventory_movements table
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL, -- references ProductVariant
  quantity INT NOT NULL,
  type TEXT NOT NULL, -- PURCHASE, RESERVATION, RELEASE, BULK_UPDATE, AUDIT, RESTOCK
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Add missing fields to reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_votes INT DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT FALSE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'PENDING';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_reply TEXT;

-- 9. Create review_media table
CREATE TABLE IF NOT EXISTS review_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'IMAGE' CHECK (type IN ('IMAGE', 'VIDEO')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Ensure RecentlyViewed and RecentSearch tables exist
CREATE TABLE IF NOT EXISTS "RecentlyViewed" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "productId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("userId", "productId")
);

CREATE TABLE IF NOT EXISTS "RecentSearch" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Atomic Order Placement function
CREATE OR REPLACE FUNCTION place_order_atomic(
  p_user_id UUID,
  p_items JSONB, -- Array of { variantId, quantity, price, productName, product_image, size, sku }
  p_coupon_id UUID,
  p_coupon_code TEXT,
  p_payment_method TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_name TEXT,
  p_address JSONB,
  p_subtotal DECIMAL,
  p_discount DECIMAL,
  p_shipping_cost DECIMAL,
  p_tax DECIMAL,
  p_total DECIMAL
)
RETURNS JSONB AS $$
DECLARE
  v_item RECORD;
  v_variant RECORD;
  v_stock INT;
  v_order_id UUID;
  v_admin RECORD;
  v_notif_msg TEXT;
BEGIN
  -- Loop through items to lock and verify stock
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    "variantId" UUID,
    quantity INT,
    price DECIMAL,
    "productName" TEXT,
    size TEXT
  ) LOOP
    -- Lock row for update
    SELECT "stock", "productId" INTO v_variant
    FROM "ProductVariant"
    WHERE id = v_item."variantId"
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product variant % not found', v_item."variantId";
    END IF;

    IF v_variant.stock < v_item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for % (%)', v_item."productName", v_item.size;
    END IF;

    -- Deduct stock
    UPDATE "ProductVariant"
    SET "stock" = "stock" - v_item.quantity
    WHERE id = v_item."variantId"
    RETURNING "stock" INTO v_stock;

    -- Create Inventory Movement Log
    INSERT INTO inventory_movements (variant_id, quantity, type, notes)
    VALUES (v_item."variantId", -v_item.quantity, 'PURCHASE', 'Deducted for order placement');

    -- Create low stock notification if stock <= 3
    IF v_stock <= 3 THEN
      FOR v_admin IN SELECT id FROM profiles WHERE role = 'admin' LOOP
        v_notif_msg := 'Product ' || v_item."productName" || ' (' || v_item.size || ') has only ' || v_stock || ' units left.';
        INSERT INTO notifications (user_id, type, title, message, data)
        VALUES (v_admin.id, 'system', 'Low Stock Alert', v_notif_msg, jsonb_build_object('variant_id', v_item."variantId"));
      END LOOP;
    END IF;

  END LOOP;

  -- Increment coupon usage if present
  IF p_coupon_id IS NOT NULL THEN
    UPDATE coupons
    SET usage_count = usage_count + 1
    WHERE id = p_coupon_id;
  END IF;

  -- Insert order
  INSERT INTO orders (
    user_id,
    status,
    subtotal,
    discount,
    shipping_cost,
    tax,
    total,
    coupon_id,
    coupon_code,
    shipping_address,
    customer_name,
    customer_email,
    customer_phone,
    payment_status,
    items,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    'pending',
    p_subtotal,
    p_discount,
    p_shipping_cost,
    p_tax,
    p_total,
    p_coupon_id,
    p_coupon_code,
    p_address,
    p_name,
    p_email,
    p_phone,
    'pending',
    p_items,
    NOW(),
    NOW()
  ) RETURNING id INTO v_order_id;

  -- Create initial status history
  INSERT INTO order_status_history (order_id, status, note)
  VALUES (v_order_id, 'pending', 'Order placed successfully');

  -- Clear cart
  DELETE FROM cart_items WHERE user_id = p_user_id;

  -- Return created order
  RETURN (SELECT row_to_json(o)::jsonb FROM orders o WHERE id = v_order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Reserve Inventory Atomic
CREATE OR REPLACE FUNCTION reserve_inventory_atomic(
  p_variant_id UUID,
  p_quantity INT,
  p_expires_at TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
  v_variant RECORD;
  v_prod_name TEXT;
  v_resv_id UUID;
  v_reservation JSONB;
BEGIN
  -- Lock the variant row for update
  SELECT "stock", "productId", "size" INTO v_variant
  FROM "ProductVariant"
  WHERE id = p_variant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product variant not found';
  END IF;

  SELECT name INTO v_prod_name FROM products WHERE id = v_variant."productId";

  IF v_variant.stock < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock for % (%)', v_prod_name, v_variant.size;
  END IF;

  -- Decrement stock
  UPDATE "ProductVariant"
  SET "stock" = "stock" - p_quantity
  WHERE id = p_variant_id;

  -- Create reservation
  INSERT INTO inventory_reservations (variant_id, quantity, expires_at, is_released)
  VALUES (p_variant_id, p_quantity, p_expires_at, FALSE)
  RETURNING id INTO v_resv_id;

  -- Create movement log
  INSERT INTO inventory_movements (variant_id, quantity, type, notes)
  VALUES (p_variant_id, -p_quantity, 'RESERVATION', 'Reserved for checkout. Expires at ' || p_expires_at::TEXT);

  SELECT row_to_json(r)::jsonb INTO v_reservation FROM inventory_reservations r WHERE id = v_resv_id;
  RETURN v_reservation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Release Reservation Atomic
CREATE OR REPLACE FUNCTION release_reservation_atomic(
  p_reservation_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_resv RECORD;
  v_updated JSONB;
BEGIN
  -- Lock reservation row
  SELECT * INTO v_resv
  FROM inventory_reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found';
  END IF;

  IF v_resv.is_released THEN
    RAISE EXCEPTION 'Reservation already released';
  END IF;

  -- Revert stock of variant
  UPDATE "ProductVariant"
  SET "stock" = "stock" + v_resv.quantity
  WHERE id = v_resv.variant_id;

  -- Mark released
  UPDATE inventory_reservations
  SET is_released = TRUE
  WHERE id = p_reservation_id;

  -- Create movement log
  INSERT INTO inventory_movements (variant_id, quantity, type, notes)
  VALUES (v_resv.variant_id, v_resv.quantity, 'RELEASE', 'Released reservation ' || p_reservation_id::TEXT);

  SELECT row_to_json(r)::jsonb INTO v_updated FROM inventory_reservations r WHERE id = p_reservation_id;
  RETURN v_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Release Expired Reservations Atomic
CREATE OR REPLACE FUNCTION release_expired_reservations_atomic()
RETURNS INT AS $$
DECLARE
  v_resv RECORD;
  v_released_count INT := 0;
BEGIN
  FOR v_resv IN
    SELECT * FROM inventory_reservations
    WHERE expires_at < NOW() AND is_released = FALSE
    FOR UPDATE
  LOOP
    -- Revert stock
    UPDATE "ProductVariant"
    SET "stock" = "stock" + v_resv.quantity
    WHERE id = v_resv.variant_id;

    -- Mark released
    UPDATE inventory_reservations
    SET is_released = TRUE
    WHERE id = v_resv.id;

    -- Log movement
    INSERT INTO inventory_movements (variant_id, quantity, type, notes)
    VALUES (v_resv.variant_id, v_resv.quantity, 'RELEASE', 'Auto-released expired reservation ' || v_resv.id::TEXT);

    v_released_count := v_released_count + 1;
  END LOOP;

  RETURN v_released_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
