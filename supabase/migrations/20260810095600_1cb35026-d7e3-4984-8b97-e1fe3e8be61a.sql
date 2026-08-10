-- ENUMS
CREATE TYPE public.app_role AS ENUM ('super_admin','verification_admin','department_admin','moderator','citizen');
CREATE TYPE public.complaint_status AS ENUM ('submitted','under_verification','verified','assigned','forwarded','action_initiated','in_progress','resolved','closed','rejected','duplicate','escalated');
CREATE TYPE public.complaint_priority AS ENUM ('low','medium','high','critical');
CREATE TYPE public.complaint_type AS ENUM ('public_service','civic_infrastructure','public_facility','safety_concern','improvement_suggestion','other');
CREATE TYPE public.feedback_outcome AS ENUM ('yes','partially','no');

-- UPDATED AT
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  mobile TEXT,
  email TEXT,
  state TEXT,
  district TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id
    AND role IN ('super_admin','verification_admin','department_admin','moderator'));
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manages roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "own profile readable" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, mobile, state, district, preferred_language)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    NEW.email,
    NEW.raw_user_meta_data->>'mobile',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'district',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language','en'))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'citizen') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CATEGORIES
CREATE TABLE public.complaint_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'circle',
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.complaint_categories TO anon, authenticated;
GRANT ALL ON public.complaint_categories TO service_role;
ALTER TABLE public.complaint_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.complaint_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "super admin manages categories" ON public.complaint_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

INSERT INTO public.complaint_categories (slug,name,icon,sort_order) VALUES
 ('roads','Roads','construction',1),
 ('streetlights','Streetlights','lightbulb',2),
 ('water','Water','droplets',3),
 ('sanitation','Sanitation','sprayCan',4),
 ('waste','Waste Management','trash2',5),
 ('transport','Public Transport','bus',6),
 ('healthcare','Healthcare','heartPulse',7),
 ('education','Education','graduationCap',8),
 ('electricity','Electricity','zap',9),
 ('environment','Environment','leaf',10),
 ('safety','Public Safety','shieldAlert',11),
 ('accessibility','Accessibility','accessibility',12),
 ('gov-services','Government Services','landmark',13),
 ('facilities','Public Facilities','building2',14),
 ('other','Other','circleEllipsis',15);

-- DEPARTMENTS
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  jurisdiction TEXT NOT NULL DEFAULT 'district',
  state TEXT,
  district TEXT,
  category_slugs TEXT[] NOT NULL DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departments TO anon, authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_departments_updated BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "departments public read" ON public.departments FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "super admin manages departments" ON public.departments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- GRIEVANCE ID SEQUENCE
CREATE SEQUENCE public.grievance_seq START 1;
CREATE OR REPLACE FUNCTION public.next_grievance_id()
RETURNS TEXT LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'SJ-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.grievance_seq')::text, 6, '0');
$$;

-- COMPLAINTS
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id TEXT NOT NULL UNIQUE DEFAULT public.next_grievance_id(),
  citizen_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  complaint_type public.complaint_type NOT NULL DEFAULT 'public_service',
  category_id UUID REFERENCES public.complaint_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  public_impact TEXT,
  suggested_improvement TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT,
  locality TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status public.complaint_status NOT NULL DEFAULT 'submitted',
  priority public.complaint_priority NOT NULL DEFAULT 'medium',
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  escalation_level INT NOT NULL DEFAULT 0,
  duplicate_of UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_complaints_citizen ON public.complaints(citizen_id);
CREATE INDEX idx_complaints_status ON public.complaints(status);
CREATE INDEX idx_complaints_state_district ON public.complaints(state, district);
CREATE INDEX idx_complaints_category ON public.complaints(category_id);
CREATE INDEX idx_complaints_created ON public.complaints(created_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_complaints_updated BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "citizen reads own complaints" ON public.complaints FOR SELECT TO authenticated USING (citizen_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "citizen creates complaints" ON public.complaints FOR INSERT TO authenticated WITH CHECK (citizen_id = auth.uid());
CREATE POLICY "staff updates complaints" ON public.complaints FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- PRIVACY-SAFE PUBLIC VIEW
CREATE VIEW public.public_complaints WITH (security_invoker = false) AS
  SELECT c.id, c.grievance_id, c.title,
    left(c.description, 400) AS summary,
    c.complaint_type, c.category_id, cat.name AS category_name, cat.slug AS category_slug,
    c.state, c.district, c.city, c.locality,
    round(c.latitude::numeric, 3)::double precision AS latitude,
    round(c.longitude::numeric, 3)::double precision AS longitude,
    c.status, c.priority, c.escalation_level, c.created_at, c.updated_at, c.resolved_at
  FROM public.complaints c
  LEFT JOIN public.complaint_categories cat ON cat.id = c.category_id
  WHERE c.status NOT IN ('rejected','duplicate');
GRANT SELECT ON public.public_complaints TO anon, authenticated;

-- STATUS HISTORY
CREATE TABLE public.complaint_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  previous_status public.complaint_status,
  new_status public.complaint_status NOT NULL,
  comment TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_status_history_complaint ON public.complaint_status_history(complaint_id, created_at);
GRANT SELECT, INSERT ON public.complaint_status_history TO authenticated;
GRANT ALL ON public.complaint_status_history TO service_role;
ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history readable by owner or staff" ON public.complaint_status_history FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.citizen_id = auth.uid()));
CREATE POLICY "history insert by staff or owner" ON public.complaint_status_history FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.citizen_id = auth.uid()));

-- ATTACHMENTS
CREATE TABLE public.complaint_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  is_resolution_evidence BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attachments_complaint ON public.complaint_attachments(complaint_id);
GRANT SELECT, INSERT, DELETE ON public.complaint_attachments TO authenticated;
GRANT ALL ON public.complaint_attachments TO service_role;
ALTER TABLE public.complaint_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attachments readable by owner or staff" ON public.complaint_attachments FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.citizen_id = auth.uid()));
CREATE POLICY "attachments insert by owner or staff" ON public.complaint_attachments FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid() AND (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.citizen_id = auth.uid())));
CREATE POLICY "attachments delete by owner" ON public.complaint_attachments FOR DELETE TO authenticated USING (uploaded_by = auth.uid());

-- COMMENTS
CREATE TABLE public.complaint_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_comments_complaint ON public.complaint_comments(complaint_id, created_at);
GRANT SELECT, INSERT ON public.complaint_comments TO authenticated;
GRANT ALL ON public.complaint_comments TO service_role;
ALTER TABLE public.complaint_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments readable" ON public.complaint_comments FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR (is_internal = false AND EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.citizen_id = auth.uid())));
CREATE POLICY "comments insert" ON public.complaint_comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND (public.is_staff(auth.uid()) OR (is_internal = false AND EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.citizen_id = auth.uid()))));

-- FEEDBACK
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL UNIQUE REFERENCES public.complaints(id) ON DELETE CASCADE,
  citizen_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outcome public.feedback_outcome NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback readable" ON public.feedback FOR SELECT TO authenticated USING (citizen_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "feedback insert own" ON public.feedback FOR INSERT TO authenticated
  WITH CHECK (citizen_id = auth.uid() AND EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.citizen_id = auth.uid()));

-- ESCALATIONS
CREATE TABLE public.escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  level INT NOT NULL DEFAULT 1,
  reason TEXT,
  escalated_to UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_escalations_complaint ON public.escalations(complaint_id);
GRANT SELECT, INSERT ON public.escalations TO authenticated;
GRANT ALL ON public.escalations TO service_role;
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "escalations readable" ON public.escalations FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.citizen_id = auth.uid()));
CREATE POLICY "escalations insert staff" ON public.escalations FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

-- SUGGESTIONS
CREATE TABLE public.suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.complaint_categories(id) ON DELETE SET NULL,
  state TEXT,
  district TEXT,
  locality TEXT,
  expected_benefit TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  vote_count INT NOT NULL DEFAULT 0,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_suggestions_citizen ON public.suggestions(citizen_id);
GRANT SELECT, INSERT, UPDATE ON public.suggestions TO authenticated;
GRANT SELECT ON public.suggestions TO anon;
GRANT ALL ON public.suggestions TO service_role;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_suggestions_updated BEFORE UPDATE ON public.suggestions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "suggestions public read" ON public.suggestions FOR SELECT TO anon, authenticated USING (is_hidden = false);
CREATE POLICY "suggestions owner read" ON public.suggestions FOR SELECT TO authenticated USING (citizen_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "suggestions insert own" ON public.suggestions FOR INSERT TO authenticated WITH CHECK (citizen_id = auth.uid());
CREATE POLICY "suggestions update owner or staff" ON public.suggestions FOR UPDATE TO authenticated USING (citizen_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (citizen_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE TABLE public.suggestion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id UUID NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (suggestion_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.suggestion_votes TO authenticated;
GRANT SELECT ON public.suggestion_votes TO anon;
GRANT ALL ON public.suggestion_votes TO service_role;
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "votes public read" ON public.suggestion_votes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "votes insert own" ON public.suggestion_votes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "votes delete own" ON public.suggestion_votes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.sync_vote_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.suggestions s SET vote_count = (SELECT count(*) FROM public.suggestion_votes v WHERE v.suggestion_id = s.id)
  WHERE s.id = COALESCE(NEW.suggestion_id, OLD.suggestion_id);
  RETURN NULL;
END; $$;
CREATE TRIGGER trg_vote_count AFTER INSERT OR DELETE ON public.suggestion_votes FOR EACH ROW EXECUTE FUNCTION public.sync_vote_count();

CREATE TABLE public.suggestion_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id UUID NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sugg_comments ON public.suggestion_comments(suggestion_id, created_at);
GRANT SELECT, INSERT ON public.suggestion_comments TO authenticated;
GRANT SELECT ON public.suggestion_comments TO anon;
GRANT ALL ON public.suggestion_comments TO service_role;
ALTER TABLE public.suggestion_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sugg comments read" ON public.suggestion_comments FOR SELECT TO anon, authenticated USING (is_hidden = false);
CREATE POLICY "sugg comments insert" ON public.suggestion_comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications read" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own notifications update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "staff creates notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));

-- AUDIT LOGS
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit readable by super admin" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "audit insert by staff" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND actor_id = auth.uid());

-- MODERATION
CREATE TABLE public.moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.moderation_actions TO authenticated;
GRANT ALL ON public.moderation_actions TO service_role;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "moderation readable by staff" ON public.moderation_actions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "moderation insert by staff" ON public.moderation_actions FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND moderator_id = auth.uid());