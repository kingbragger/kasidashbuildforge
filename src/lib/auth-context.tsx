import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "developer" | "sales_agent" | "designer" | "qa" | "customer";

export type Profile = {
  id: string;
  user_id: string;
  employee_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  id_number: string | null;
  avatar_url: string | null;
  bio: string | null;
  must_change_password: boolean;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUserData(uid: string) {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((p as Profile) ?? null);
    setRoles(((r as Array<{ role: AppRole }>) ?? []).map((x) => x.role));
  }

  async function refresh() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    if (data.session?.user) {
      await loadUserData(data.session.user.id);
    } else {
      setProfile(null);
      setRoles([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => loadUserData(s.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
      if (event === "SIGNED_OUT") setLoading(false);
    });
    refresh();
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setRoles([]);
    setSession(null);
  }

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, profile, roles, loading, refresh, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside provider");
  return v;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrator",
  developer: "Developer",
  sales_agent: "Sales Agent",
  designer: "Designer",
  qa: "Quality Assurance",
  customer: "Customer",
};

export type { AppRole };
