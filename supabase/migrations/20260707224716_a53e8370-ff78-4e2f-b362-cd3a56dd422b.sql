
-- Add customer role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';

-- Add surname column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS surname TEXT;

-- Customer ID generator (KD-C-XXXXX)
CREATE OR REPLACE FUNCTION public.generate_customer_id()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  suffix INT;
BEGIN
  SELECT COALESCE(MAX(NULLIF(regexp_replace(replace(employee_id,'KD-C-',''), '\D', '', 'g'), '')::INT), 1000) + 1
    INTO suffix FROM public.profiles WHERE employee_id LIKE 'KD-C-%';
  RETURN 'KD-C-' || LPAD(suffix::TEXT, 5, '0');
END; $$;

-- Update handle_new_user to support customer signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  emp_id TEXT;
  acct_type TEXT;
  first_name TEXT;
  last_name TEXT;
  full_display TEXT;
BEGIN
  acct_type := COALESCE(NEW.raw_user_meta_data->>'account_type', 'staff');
  first_name := NEW.raw_user_meta_data->>'first_name';
  last_name := NEW.raw_user_meta_data->>'surname';

  IF acct_type = 'customer' THEN
    emp_id := public.generate_customer_id();
  ELSE
    emp_id := public.generate_employee_id();
  END IF;

  full_display := COALESCE(
    NULLIF(TRIM(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')), ''),
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (user_id, employee_id, email, full_name, surname, phone, must_change_password)
  VALUES (
    NEW.id,
    emp_id,
    NEW.email,
    full_display,
    last_name,
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'must_change_password')::BOOLEAN, false)
  );

  IF acct_type = 'customer' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  END IF;

  IF lower(NEW.email) = 'unity@kasidash.co.za' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END; $$;

-- Ensure trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
