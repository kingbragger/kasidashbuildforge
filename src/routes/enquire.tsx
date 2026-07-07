import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/enquire")({
  head: () => ({
    meta: [
      { title: "Enquire · Kasi Dash Web Development" },
      { name: "description", content: "Tell us about your website project. We reply within one business day with a tailored quotation." },
    ],
  }),
  component: EnquirePage,
});

function EnquirePage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    business_name: "",
    project_type: "Business Website",
    budget_range: "R5 000 to R15 000",
    message: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrMsg("");
    const { error } = await supabase.from("enquiries").insert(form);
    if (error) {
      setState("error");
      setErrMsg(error.message);
      return;
    }
    setState("done");
    setForm({ full_name: "", email: "", phone: "", business_name: "", project_type: "Business Website", budget_range: "R5 000 to R15 000", message: "" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/"><img src={kasiLogo} alt="Kasi Dash" className="h-10 w-auto" /></Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          Website Enquiry
        </span>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">Get a tailored quotation</h1>
        <p className="mt-3 text-muted-foreground">
          Tell us about your project. Our sales team replies within one business day with a quotation, scope, and timeline.
        </p>

        {state === "done" ? (
          <div className="mt-10 rounded-2xl border border-primary/40 bg-primary/10 p-8">
            <h2 className="text-2xl font-bold text-primary">Enquiry received</h2>
            <p className="mt-3 text-sm text-foreground">
              Thanks. A member of our team will be in touch shortly at the email you provided.
            </p>
            <button onClick={() => setState("idle")} className="mt-6 rounded-lg border border-primary/40 px-5 py-2 text-sm font-semibold text-primary">
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name" required value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
              <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Business name" value={form.business_name} onChange={(v) => setForm({ ...form, business_name: v })} />
              <Select label="Project type" value={form.project_type} onChange={(v) => setForm({ ...form, project_type: v })}
                options={["Business Website","E commerce Store","Portfolio","Booking Platform","Web Application","Landing Page","Other"]} />
              <Select label="Budget range" value={form.budget_range} onChange={(v) => setForm({ ...form, budget_range: v })}
                options={["Under R5 000","R5 000 to R15 000","R15 000 to R40 000","R40 000 to R100 000","R100 000 plus","Not sure yet"]} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tell us about your project</label>
              <textarea required minLength={10} rows={6} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Goals, timeline, pages, features, existing brand assets..."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>

            {state === "error" && <p className="text-sm text-destructive">Something went wrong: {errMsg}</p>}

            <button disabled={state === "loading"} type="submit"
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {state === "loading" ? "Sending..." : "Submit enquiry"}
            </button>
            <p className="text-xs text-muted-foreground">
              By submitting, you agree to our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and confirm the details are accurate.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, type = "text", value, onChange }: { label: string; required?: boolean; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}{required && <span className="text-primary"> *</span>}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
