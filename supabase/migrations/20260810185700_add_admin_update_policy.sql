-- Add policy to allow staff to update complaints
CREATE POLICY "Staff can update any complaint" 
ON public.complaints 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);
