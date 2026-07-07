CREATE POLICY "enquiries customer read own"
ON public.enquiries
FOR SELECT
TO authenticated
USING (
  lower(email) = lower((SELECT email FROM public.profiles WHERE user_id = auth.uid()))
);