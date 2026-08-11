
-- 1. Move SECURITY DEFINER role helpers out of the API-exposed schema
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id
    AND role IN ('super_admin','verification_admin','department_admin','moderator'));
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_staff(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated, service_role;

-- Recreate all policies that referenced the public helpers
DROP POLICY IF EXISTS "own roles readable" ON public.user_roles;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "super admin manages roles" ON public.user_roles;
CREATE POLICY "super admin manages roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (private.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "own profile readable" ON public.profiles;
CREATE POLICY "own profile readable" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "super admin manages categories" ON public.complaint_categories;
CREATE POLICY "super admin manages categories" ON public.complaint_categories FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (private.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "super admin manages departments" ON public.departments;
CREATE POLICY "super admin manages departments" ON public.departments FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (private.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "citizen reads own complaints" ON public.complaints;
CREATE POLICY "citizen reads own complaints" ON public.complaints FOR SELECT TO authenticated
  USING (citizen_id = auth.uid() OR private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "staff updates complaints" ON public.complaints;
CREATE POLICY "staff updates complaints" ON public.complaints FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "history readable by owner or staff" ON public.complaint_status_history;
CREATE POLICY "history readable by owner or staff" ON public.complaint_status_history FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.complaints c WHERE c.id = complaint_status_history.complaint_id AND c.citizen_id = auth.uid()));

DROP POLICY IF EXISTS "history insert by staff or owner" ON public.complaint_status_history;
CREATE POLICY "history insert by staff or owner" ON public.complaint_status_history FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.complaints c WHERE c.id = complaint_status_history.complaint_id AND c.citizen_id = auth.uid()));

DROP POLICY IF EXISTS "attachments readable by owner or staff" ON public.complaint_attachments;
CREATE POLICY "attachments readable by owner or staff" ON public.complaint_attachments FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.complaints c WHERE c.id = complaint_attachments.complaint_id AND c.citizen_id = auth.uid()));

DROP POLICY IF EXISTS "attachments insert by owner or staff" ON public.complaint_attachments;
CREATE POLICY "attachments insert by owner or staff" ON public.complaint_attachments FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid() AND (private.is_staff(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.complaints c WHERE c.id = complaint_attachments.complaint_id AND c.citizen_id = auth.uid())));

DROP POLICY IF EXISTS "comments readable" ON public.complaint_comments;
CREATE POLICY "comments readable" ON public.complaint_comments FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()) OR (is_internal = false AND EXISTS (
    SELECT 1 FROM public.complaints c WHERE c.id = complaint_comments.complaint_id AND c.citizen_id = auth.uid())));

DROP POLICY IF EXISTS "comments insert" ON public.complaint_comments;
CREATE POLICY "comments insert" ON public.complaint_comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND (private.is_staff(auth.uid()) OR (is_internal = false AND EXISTS (
    SELECT 1 FROM public.complaints c WHERE c.id = complaint_comments.complaint_id AND c.citizen_id = auth.uid()))));

DROP POLICY IF EXISTS "feedback readable" ON public.feedback;
CREATE POLICY "feedback readable" ON public.feedback FOR SELECT TO authenticated
  USING (citizen_id = auth.uid() OR private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "escalations readable" ON public.escalations;
CREATE POLICY "escalations readable" ON public.escalations FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.complaints c WHERE c.id = escalations.complaint_id AND c.citizen_id = auth.uid()));

DROP POLICY IF EXISTS "escalations insert staff" ON public.escalations;
CREATE POLICY "escalations insert staff" ON public.escalations FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "suggestions owner read" ON public.suggestions;
CREATE POLICY "suggestions owner read" ON public.suggestions FOR SELECT TO authenticated
  USING (citizen_id = auth.uid() OR private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "suggestions update owner or staff" ON public.suggestions;
CREATE POLICY "suggestions update owner or staff" ON public.suggestions FOR UPDATE TO authenticated
  USING (citizen_id = auth.uid() OR private.is_staff(auth.uid()))
  WITH CHECK (citizen_id = auth.uid() OR private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "audit readable by super admin" ON public.audit_logs;
CREATE POLICY "audit readable by super admin" ON public.audit_logs FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "audit insert by staff" ON public.audit_logs;
CREATE POLICY "audit insert by staff" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()) AND actor_id = auth.uid());

DROP POLICY IF EXISTS "moderation readable by staff" ON public.moderation_actions;
CREATE POLICY "moderation readable by staff" ON public.moderation_actions FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "moderation insert by staff" ON public.moderation_actions;
CREATE POLICY "moderation insert by staff" ON public.moderation_actions FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()) AND moderator_id = auth.uid());

-- Storage policies
DROP POLICY IF EXISTS "evidence owner read" ON storage.objects;
CREATE POLICY "evidence owner read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'grievance-evidence' AND (owner = auth.uid() OR private.is_staff(auth.uid())));

-- 2. Storage: add missing UPDATE policy (owner only)
DROP POLICY IF EXISTS "evidence owner update" ON storage.objects;
CREATE POLICY "evidence owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'grievance-evidence' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'grievance-evidence' AND owner = auth.uid()
    AND (storage.foldername(name))[1] = (auth.uid())::text);

-- 3. Notifications: only staff may create notifications
DROP POLICY IF EXISTS "staff creates notifications" ON public.notifications;
CREATE POLICY "staff creates notifications" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()));

-- Drop the API-exposed SECURITY DEFINER helpers
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_staff(uuid);

-- 4. Suggestion votes: users can only read their own votes
DROP POLICY IF EXISTS "votes public read" ON public.suggestion_votes;
REVOKE ALL ON public.suggestion_votes FROM anon;
CREATE POLICY "votes own read" ON public.suggestion_votes FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 5. public_complaints view: enforce the querying user's permissions
ALTER VIEW public.public_complaints SET (security_invoker = true);

DROP POLICY IF EXISTS "public complaints readable" ON public.complaints;
CREATE POLICY "public complaints readable" ON public.complaints FOR SELECT TO anon
  USING (status <> ALL (ARRAY['rejected'::public.complaint_status, 'duplicate'::public.complaint_status]));

REVOKE ALL ON public.complaints FROM anon;
GRANT SELECT (id, grievance_id, title, description, complaint_type, category_id, state, district,
  city, locality, latitude, longitude, status, priority, escalation_level,
  created_at, updated_at, resolved_at) ON public.complaints TO anon;
GRANT SELECT (id, name, slug) ON public.complaint_categories TO anon;
GRANT SELECT ON public.public_complaints TO anon, authenticated;
