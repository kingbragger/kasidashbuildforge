import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<null | "error" | "info">(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!staffId || !password || otp.length < 6) {
      setStatus("error");
      return;
    }
    setStatus("info");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-primary/40 bg-card p-8 shadow-2xl">
        <Link to="/" className="mb-6 block">
          <img src={kasiLogo} alt="Kasi Dash" className="mx-auto h-12 w-auto" />
        </Link>

        <div className="mx-auto w-fit rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Admin · Restricted
        </div>
        <h1 className="mt-4 text-center text-2xl font-black">Staff Login</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Authorised personnel only. All access is logged.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Staff ID</label>
            <input
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="KD 0001"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">2FA Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6 digit code"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-lg font-mono tracking-widest outline-none focus:border-primary"
              required
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-destructive">Enter your Staff ID, password, and a valid 6 digit 2FA code.</p>
          )}
          {status === "info" && (
            <p className="rounded-md border border-primary/40 bg-primary/10 p-3 text-xs text-primary">
              Admin backend is not enabled yet. Enable Lovable Cloud so staff accounts can be created and roles enforced.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Access Admin Console
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Not staff?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Customer login →
          </Link>
        </div>
      </div>
    </div>
  );
}
