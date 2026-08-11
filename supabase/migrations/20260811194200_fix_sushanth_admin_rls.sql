-- Add sushanthns05@gmail.com to user_roles as super_admin to fix RLS update issues
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID for the admin email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'sushanthns05@gmail.com' LIMIT 1;
  
  -- If the user exists, ensure they have the super_admin role
  IF v_user_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'super_admin') THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'super_admin');
    END IF;
  END IF;
END $$;
