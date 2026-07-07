-- Revoke EXECUTE from anon and authenticated on SECURITY DEFINER functions
-- that should not be publicly callable. has_role/is_admin remain executable
-- by authenticated because RLS policies invoke them under the caller's role.

REVOKE EXECUTE ON FUNCTION public.generate_employee_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_customer_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;

-- Ensure authenticated retains EXECUTE on has_role/is_admin for RLS usage
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;