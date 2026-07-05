-- Performance Indexes for Drapeva Ecommerce
-- Run this in your Supabase SQL Editor or migration runner

-- Enable pg_trgm extension if not already present
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Indexes on products for collection, category, price, and date filters
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Trigram gin indexes for fast case-insensitive pattern matching (search queries)
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON products USING gin (description gin_trgm_ops);

-- Indexes for Order & Variant lookups (Database tables)
CREATE INDEX IF NOT EXISTS idx_order_items_order ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS idx_order_items_variant ON "OrderItem"("variantId");
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON "ProductVariant"("productId");

-- Optimization indexes for audit logs, notifications, and user sessions
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON "Notification"("userId", "isRead");
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_active ON "UserSession"("userId", "isActive");
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON "RecentlyViewed"("userId");
