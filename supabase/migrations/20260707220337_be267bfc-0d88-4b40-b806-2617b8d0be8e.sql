
DROP POLICY IF EXISTS "enquiries public insert" ON public.enquiries;
CREATE POLICY "enquiries public insert" ON public.enquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) BETWEEN 1 AND 120
    AND length(trim(email)) BETWEEN 3 AND 200
    AND length(trim(message)) BETWEEN 1 AND 4000
  );
