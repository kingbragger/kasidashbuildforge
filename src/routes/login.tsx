import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login · Kasi Dash" },
      { name: "description", content: "Sign in to your Kasi Dash customer, driver, or vendor account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<null | "error" | "info">(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setStatus("error");
      return;
    }
    setStatus("info");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <Link to="/" className="mb-6 block">
          <img src={kasiLogo} alt="Kasi Dash" className="mx-auto h-12 w-auto" />
        </Link>
        <h1 className="text-center text-2xl font-black">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to your customer, driver, or vendor account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium">Password</label>
              <a href="#forgot" className="text-xs text-primary hover:underline">Forgot?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              required
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-destructive">Please enter your email and password.</p>
          )}
          {status === "info" && (
            <p className="rounded-md border border-primary/40 bg-primary/10 p-3 text-xs text-primary">
              Authentication backend is not enabled yet. Enable Lovable Cloud to activate real sign in.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          New to Kasi Dash?{" "}
          <a href="/apply/vendor" className="font-semibold text-primary hover:underline">
            Enquire for a quotation
          </a>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Staff member?{" "}
          <Link to="/staff-login" className="font-semibold text-primary hover:underline">
            Staff login →
          </Link>
        </div>
      </div>
    </div>
  );
}
