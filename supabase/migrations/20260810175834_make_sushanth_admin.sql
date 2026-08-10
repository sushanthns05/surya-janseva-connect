CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = NEW.user_id AND email = 'sushanthns05@gmail.com') THEN
    NEW.role := 'super_admin';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_assign_admin_role ON public.user_roles;

CREATE TRIGGER trigger_auto_assign_admin_role
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_admin_role();

-- Also apply it immediately for the existing user just in case
UPDATE public.user_roles
SET role = 'super_admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'sushanthns05@gmail.com' LIMIT 1
);
