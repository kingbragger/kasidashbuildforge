-- 1) Restrict avatars bucket reads to the file owner (folder = auth.uid()) or admins
DROP POLICY IF EXISTS "avatars authed read" ON storage.objects;

CREATE POLICY "avatars owner or admin read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin(auth.uid())
  )
);

-- 2) Explicit admin-only manage policies for user_roles (no self-service role grants)
DROP POLICY IF EXISTS "user_roles admin insert" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin update" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin delete" ON public.user_roles;

CREATE POLICY "user_roles admin insert"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "user_roles admin update"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "user_roles admin delete"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
