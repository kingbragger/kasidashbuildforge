import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account · Kasi Dash" },
      { name: "description", content: "Register a Kasi Dash customer account to manage your website project." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg("");

    if (!firstName.trim() || !surname.trim()) return setErr("Please enter your name and surname.");
    if (!/^[0-9+\s()-]{7,20}$/.test(phone.trim())) return setErr("Please enter a valid phone number.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          account_type: "customer",
          first_name: firstName.trim(),
          surname: surname.trim(),
          phone: phone.trim(),
          full_name: `${firstName.trim()} ${surname.trim()}`,
        },
      },
    });
    setLoading(false);

    if (error) return setErr(error.message);
    if (data.session) {
      nav({ to: "/" });
    } else {
      setMsg("Account created. Please check your email to confirm your address, then sign in.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <Link to="/" className="mb-6 block"><img src={kasiLogo} alt="Kasi Dash" className="mx-auto h-12 w-auto" /></Link>
        <h1 className="text-center text-2xl font-black">Create your account</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Register as a Kasi Dash customer</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={50}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Surname</label>
              <input required value={surname} onChange={(e) => setSurname(e.target.value)} maxLength={50}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone number</label>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20}
              placeholder="e.g. 0712345678"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Confirm password</label>
            <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>

          {err && <p className="text-sm text-destructive">{err}</p>}
          {msg && <p className="text-sm text-green-600">{msg}</p>}

          <button disabled={loading} type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
