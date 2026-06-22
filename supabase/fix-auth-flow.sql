-- ============================================================
-- MAAYA COUTURE — SUPABASE AUTH & PROFILES REPAIR MIGRATION
-- Run this script in the Supabase SQL Editor
-- ============================================================

-- 1. Ensure foreign key constraint exists and is correct
ALTER TABLE IF EXISTS public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Ensure Row Level Security is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Setup RLS policies for profiles table
-- Policy for SELECT (View own profile)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy for UPDATE (Modify own profile)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policy for INSERT (Create own profile from client side)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Helper function to check if user is admin (if not already defined)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles 
  FOR SELECT 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles 
  FOR UPDATE 
  USING (public.is_admin());

-- 4. Re-create trigger function to automatically create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_phone TEXT;
  user_role TEXT;
BEGIN
  -- Extract name from user metadata, fallback to email local part or phone
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1),
    NEW.phone,
    'User'
  );

  -- Extract phone
  user_phone := COALESCE(
    NEW.phone,
    NEW.raw_user_meta_data->>'phone'
  );

  -- Extract role, fallback to 'customer'
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    'customer'
  );

  -- Insert profile, ignore duplicate errors
  INSERT INTO public.profiles (id, email, name, phone, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_phone,
    user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
