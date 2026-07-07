import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password · Kasi Dash" },
      { name: "description", content: "Reset your Kasi Dash account password." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg("If an account exists for that email, a reset link has been sent.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <Link to="/" className="mb-6 block"><img src={kasiLogo} alt="Kasi Dash" className="mx-auto h-12 w-auto" /></Link>
        <h1 className="text-center text-2xl font-black">Forgot password</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          {msg && <p className="text-sm text-green-600">{msg}</p>}
          <button disabled={loading} type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
