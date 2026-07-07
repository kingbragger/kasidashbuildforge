import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password · Kasi Dash" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase auto-processes the recovery token in the URL hash and fires PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg("");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg("Password updated. Redirecting...");
    setTimeout(() => nav({ to: "/portal" }), 1200);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <Link to="/" className="mb-6 block"><img src={kasiLogo} alt="Kasi Dash" className="mx-auto h-12 w-auto" /></Link>
        <h1 className="text-center text-2xl font-black">Set a new password</h1>
        {!ready ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Waiting for reset link verification. If nothing happens, open the link from your email again.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">New password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm new password</label>
              <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            {msg && <p className="text-sm text-green-600">{msg}</p>}
            <button disabled={loading} type="submit"
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
