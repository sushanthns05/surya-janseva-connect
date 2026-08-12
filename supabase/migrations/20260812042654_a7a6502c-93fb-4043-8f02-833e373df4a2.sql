CREATE TABLE public.phone_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.phone_verifications TO service_role;

ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client access to phone verifications"
  ON public.phone_verifications FOR SELECT TO authenticated USING (false);

CREATE INDEX idx_phone_verifications_phone ON public.phone_verifications (phone, created_at DESC);

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_mobile text := NEW.raw_user_meta_data->>'mobile';
BEGIN
  IF v_mobile IS NOT NULL AND v_mobile <> '' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.phone_verifications pv
      WHERE pv.phone = '+91' || v_mobile
        AND pv.verified_at IS NOT NULL
        AND pv.verified_at > now() - interval '30 minutes'
    ) THEN
      RAISE EXCEPTION 'mobile_not_verified';
    END IF;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, mobile, state, district, preferred_language)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    NEW.email,
    v_mobile,
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'district',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language','en'))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'citizen') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $function$;