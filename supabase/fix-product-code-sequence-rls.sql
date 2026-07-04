-- Run this query in your Supabase SQL Editor to resolve the RLS error for product_code_sequence

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
