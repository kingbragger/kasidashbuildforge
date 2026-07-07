import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/staff-login")({
  head: () => ({
    meta: [
      { title: "Staff Login · Kasi Dash Admin" },
      { name: "description", content: "Secure staff and admin access to the Kasi Dash operations dashboard." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setInfo(""); setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setErr(error.message);
      nav({ to: "/portal" });
    } else {
      // Signup only allowed for the founder email (self bootstrap of admin)
      if (email.toLowerCase() !== "unity@kasidash.co.za") {
        setLoading(false);
        return setErr("Staff accounts can only be created by an administrator from the Admin Console. Contact unity@kasidash.co.za.");
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/portal`,
          data: { full_name: name },
        },
      });
      setLoading(false);
      if (error) return setErr(error.message);
      setInfo("Admin account created. If email confirmation is required, check your inbox. You can now sign in.");
      setMode("signin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-primary/40 bg-card p-8 shadow-2xl">
        <Link to="/" className="mb-6 block"><img src={kasiLogo} alt="Kasi Dash" className="mx-auto h-12 w-auto" /></Link>

        <div className="mx-auto w-fit rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          {mode === "signin" ? "Admin · Restricted" : "Bootstrap Admin"}
        </div>
        <h1 className="mt-4 text-center text-2xl font-black">{mode === "signin" ? "Staff Login" : "Create Admin Account"}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "signin"
            ? "Authorised personnel only. All access is logged."
            : "One time setup for the founder account only."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Full name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="unity@kasidash.co.za"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" required minLength={12} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            {mode === "signup" && <p className="mt-1 text-xs text-muted-foreground">Minimum 12 characters. Use upper, lower, number, symbol.</p>}
          </div>

          {err && <p className="text-sm text-destructive">{err}</p>}
          {info && <p className="rounded-md border border-primary/40 bg-primary/10 p-3 text-xs text-primary">{info}</p>}

          <button disabled={loading} type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Please wait..." : mode === "signin" ? "Access Portal" : "Create Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? (
            <button type="button" onClick={() => { setMode("signup"); setErr(""); setInfo(""); }} className="text-primary hover:underline">
              First time? Create the admin account
            </button>
          ) : (
            <button type="button" onClick={() => { setMode("signin"); setErr(""); setInfo(""); }} className="text-primary hover:underline">
              Back to sign in
            </button>
          )}
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Not staff?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">Customer login →</Link>
        </div>
      </div>
    </div>
  );
}
