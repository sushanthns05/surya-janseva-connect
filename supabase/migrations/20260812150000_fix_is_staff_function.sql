-- Fix private.is_staff to include the hardcoded admin email
CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT 
    EXISTS (
      SELECT 1 FROM auth.users WHERE id = _user_id AND email = 'sushanthns05@gmail.com'
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = _user_id
      AND role IN ('super_admin','verification_admin','department_admin','moderator')
    );
$$;
