CREATE POLICY "evidence owner read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'grievance-evidence' AND (owner = auth.uid() OR public.is_staff(auth.uid())));
CREATE POLICY "evidence owner insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'grievance-evidence' AND owner = auth.uid() AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "evidence owner delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'grievance-evidence' AND owner = auth.uid());