import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · Kasi Dash" },
      { name: "description", content: "Sign in to your Kasi Dash account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    nav({ to: "/" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <Link to="/" className="mb-6 block"><img src={kasiLogo} alt="Kasi Dash" className="mx-auto h-12 w-auto" /></Link>
        <h1 className="text-center text-2xl font-black">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to your account</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
          </div>
          <button disabled={loading} type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          New customer?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
        </div>
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Need a quote?{" "}
          <Link to="/enquire" className="font-semibold text-primary hover:underline">Enquire for pricing</Link>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Staff member?{" "}
          <Link to="/staff-login" className="font-semibold text-primary hover:underline">Staff login →</Link>
        </div>
      </div>
    </div>
  );
}
