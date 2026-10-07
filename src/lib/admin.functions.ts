import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const CreateInput = z.object({
  email: z.string().email(),
  full_name: z.string().min(1).max(120),
  role: z.enum(["admin", "developer", "sales_agent", "designer", "qa"]),
  phone: z.string().max(30).optional(),
});

function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const specials = "!@#$%&*";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  out += specials[Math.floor(Math.random() * specials.length)];
  out += Math.floor(Math.random() * 90 + 10).toString();
  return out;
}

export const createTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => CreateInput.parse(data))
  .handler(async ({ data, context }) => {
    // Verify caller is admin
    const { data: adminCheck } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminCheck) throw new Error("Forbidden: admin only");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const tempPassword = generateTempPassword();
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name,
        must_change_password: true,
      },
    });
    if (error || !created.user) throw new Error(error?.message || "Failed to create user");

    const userId = created.user.id;
    // Trigger created profile with must_change_password from metadata; also assign role.
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: data.role });
    if (roleErr) throw new Error(roleErr.message);

    if (data.phone) {
      await supabaseAdmin.from("profiles").update({ phone: data.phone }).eq("user_id", userId);
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("employee_id, email, full_name")
      .eq("user_id", userId)
      .maybeSingle();

    return {
      success: true,
      employee_id: profile?.employee_id,
      email: data.email,
      temp_password: tempPassword,
      role: data.role,
    };
  });

const DeleteInput = z.object({ user_id: z.string().uuid() });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => DeleteInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: adminCheck } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminCheck) throw new Error("Forbidden: admin only");
    if (data.user_id === context.userId) throw new Error("Cannot delete yourself");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: adminCheck } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminCheck) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles } = await supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const bannedUntil = new Map((authUsers?.users ?? []).map((u) => [u.id, (u as { banned_until?: string }).banned_until]));
    return {
      members: (profiles ?? []).map((p) => {
        const until = bannedUntil.get(p.user_id);
        return {
          ...p,
          roles: (roles ?? []).filter((r) => r.user_id === p.user_id).map((r) => r.role),
          disabled: !!until && new Date(until) > new Date(),
        };
      }),
    };
  });

const UpdateInput = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().min(1).max(120),
  phone: z.string().max(30).nullable().optional(),
  roles: z.array(z.enum(["admin", "developer", "sales_agent", "designer", "qa"])).min(1),
  disabled: z.boolean(),
});

export const updateTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpdateInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: adminCheck } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminCheck) throw new Error("Forbidden: admin only");
    if (data.user_id === context.userId && (data.disabled || !data.roles.includes("admin"))) {
      throw new Error("You cannot disable yourself or remove your own admin role");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: pErr } = await supabaseAdmin
      .from("profiles")
      .update({ full_name: data.full_name, phone: data.phone || null })
      .eq("user_id", data.user_id);
    if (pErr) throw new Error(pErr.message);

    const { error: dErr } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    if (dErr) throw new Error(dErr.message);
    const { error: rErr } = await supabaseAdmin
      .from("user_roles")
      .insert(data.roles.map((role) => ({ user_id: data.user_id, role })));
    if (rErr) throw new Error(rErr.message);

    // Disabling bans sign-in (and token refresh) without deleting the account.
    const { error: bErr } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      ban_duration: data.disabled ? "876000h" : "none",
    });
    if (bErr) throw new Error(bErr.message);
    return { success: true };
  });
