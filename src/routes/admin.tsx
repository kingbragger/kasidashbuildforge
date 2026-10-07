import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, ROLE_LABELS, type AppRole } from "@/lib/auth-context";
import { createTeamMember, listTeam, deleteTeamMember, updateTeamMember } from "@/lib/admin.functions";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console · Kasi Dash" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Enquiry = {
  id: string; full_name: string; email: string; phone: string | null;
  business_name: string | null; project_type: string | null; budget_range: string | null;
  message: string; status: string; created_at: string; notes: string | null;
};
type Member = {
  user_id: string; employee_id: string; full_name: string | null; email: string;
  phone: string | null; id_number: string | null; roles: string[]; must_change_password: boolean; disabled?: boolean;
};

const ADMIN_TABS = ["enquiries", "team", "tasks"] as const;
const SALES_TABS = ["enquiries"] as const;
type Tab = (typeof ADMIN_TABS)[number];

function AdminPage() {
  const { user, roles, loading, signOut } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("enquiries");
  const isAdmin = roles.includes("admin");
  const isStaff = isAdmin || roles.includes("sales_agent");
  const tabs: readonly Tab[] = isAdmin ? ADMIN_TABS : SALES_TABS;

  useEffect(() => {
    if (!loading && (!user || !isStaff)) nav({ to: "/staff-login" });
  }, [loading, user, isStaff, nav]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isStaff) return <div className="flex min-h-screen items-center justify-center text-destructive">Admins and sales only.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/"><img src={kasiLogo} alt="Kasi Dash" className="h-9 w-auto" /></Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/portal" className="text-xs text-muted-foreground hover:text-foreground">My Portal</Link>
            <button onClick={() => signOut().then(() => nav({ to: "/" }))} className="text-xs text-muted-foreground hover:text-foreground">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">{isAdmin ? "Admin Console" : "Sales Console"}</span>
        </div>
        <h1 className="mt-3 text-3xl font-black">Operations Dashboard</h1>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "enquiries" && <EnquiriesTab />}
          {tab === "team" && <TeamTab />}
          {tab === "tasks" && <TasksTab />}
        </div>
      </div>
    </div>
  );
}

function EnquiriesTab() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  async function load() {
    const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    setItems((data as Enquiry[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("enquiries").update({ status }).eq("id", id);
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  }
  async function saveNotes(id: string, notes: string) {
    await supabase.from("enquiries").update({ notes }).eq("id", id);
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">{items.length} enquiries total</p>
        {items.length === 0 && <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No enquiries yet.</div>}
        {items.map((e) => (
          <button key={e.id} onClick={() => setSelected(e)}
            className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === e.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"}`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{e.full_name}</span>
              <StatusBadge status={e.status} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{e.email} · {new Date(e.created_at).toLocaleDateString()}</div>
            <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.message}</div>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{selected.full_name}</h2>
              <p className="text-sm text-muted-foreground">{selected.email} {selected.phone && `· ${selected.phone}`}</p>
              {selected.business_name && <p className="text-sm text-muted-foreground">{selected.business_name}</p>}
            </div>
            <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="quoted">Quoted</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Info label="Project" value={selected.project_type} />
            <Info label="Budget" value={selected.budget_range} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Message</p>
            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-background p-4 text-sm">{selected.message}</p>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Internal notes</p>
            <textarea defaultValue={selected.notes || ""} onBlur={(e) => saveNotes(selected.id, e.target.value)}
              rows={4} placeholder="Add follow up notes..."
              className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary" />
          </div>
          <div className="mt-4 flex gap-2">
            <a href={`mailto:${selected.email}?subject=Kasi Dash · Your website enquiry`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Reply by email</a>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-10 text-sm text-muted-foreground">
          Select an enquiry to view details.
        </div>
      )}
    </div>
  );
}
function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-primary/20 text-primary",
    contacted: "bg-blue-500/20 text-blue-400",
    quoted: "bg-yellow-500/20 text-yellow-400",
    won: "bg-green-500/20 text-green-400",
    lost: "bg-destructive/20 text-destructive",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] || "bg-secondary"}`}>{status}</span>;
}

function TeamTab() {
  const list = useServerFn(listTeam);
  const create = useServerFn(createTeamMember);
  const remove = useServerFn(deleteTeamMember);
  const update = useServerFn(updateTeamMember);
  const [editing, setEditing] = useState<{ user_id: string; full_name: string; phone: string; roles: string[]; disabled: boolean } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", full_name: "", role: "developer" as AppRole, phone: "" });
  const [result, setResult] = useState<{ email: string; employee_id?: string; temp_password: string; role: string } | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try { const r = await list(); setMembers(r.members as Member[]); } catch (e) { setErr((e as Error).message); }
  }
  useEffect(() => { refresh(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(""); setResult(null);
    try {
      const r = await create({ data: form });
      setResult(r);
      setForm({ email: "", full_name: "", role: "developer", phone: "" });
      setShowForm(false);
      refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  async function del(uid: string) {
    if (!confirm("Delete this account? This cannot be undone.")) return;
    try { await remove({ data: { user_id: uid } }); refresh(); } catch (e) { setErr((e as Error).message); }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setErr("");
    try { await update({ data: editing as never }); setEditing(null); refresh(); } catch (e) { setErr((e as Error).message); }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{members.length} team members</p>
        <button onClick={() => { setShowForm(!showForm); setResult(null); }} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {showForm ? "Cancel" : "+ Create Account"}
        </button>
      </div>

      {result && (
        <div className="mt-5 rounded-2xl border border-primary bg-primary/10 p-5">
          <h3 className="font-bold text-primary">Account created</h3>
          <p className="mt-2 text-sm">Share these credentials securely with the team member. They must change the password on first login.</p>
          <div className="mt-4 grid gap-2 text-sm">
            <div><span className="text-muted-foreground">Email:</span> <span className="font-mono">{result.email}</span></div>
            <div><span className="text-muted-foreground">Employee ID:</span> <span className="font-mono">{result.employee_id}</span></div>
            <div><span className="text-muted-foreground">Role:</span> <span className="font-mono">{ROLE_LABELS[result.role as AppRole]}</span></div>
            <div className="rounded-lg border border-primary/40 bg-background p-3">
              <span className="text-muted-foreground">Temporary password:</span>
              <div className="mt-1 select-all break-all font-mono text-primary">{result.temp_password}</div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-5 grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
          <TF label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
          <TF label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <TF label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AppRole })}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm">
              {(Object.entries(ROLE_LABELS) as [AppRole, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          {err && <p className="md:col-span-2 text-sm text-destructive">{err}</p>}
          <button disabled={busy} type="submit" className="md:col-span-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? "Creating..." : "Create account with temporary password"}
          </button>
        </form>
      )}

      {editing && (
        <form onSubmit={saveEdit} className="mt-5 grid gap-4 rounded-2xl border border-primary/40 bg-card p-6 md:grid-cols-2">
          <h3 className="md:col-span-2 font-bold">Edit team member</h3>
          <TF label="Full name" value={editing.full_name} onChange={(v) => setEditing({ ...editing, full_name: v })} required />
          <TF label="Phone" value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v })} />
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Roles & access</label>
            <div className="flex flex-wrap gap-4 text-sm">
              {(Object.entries(ROLE_LABELS) as [AppRole, string][]).filter(([k]) => k !== "customer").map(([k, v]) => (
                <label key={k} className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.roles.includes(k)}
                    onChange={(e) => setEditing({ ...editing, roles: e.target.checked ? [...editing.roles, k] : editing.roles.filter((r) => r !== k) })} />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <label className="md:col-span-2 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.disabled} onChange={(e) => setEditing({ ...editing, disabled: e.target.checked })} />
            Account disabled (cannot sign in)
          </label>
          {err && <p className="md:col-span-2 text-sm text-destructive">{err}</p>}
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Save changes</button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-border px-4 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      )}
      {err && !showForm && !editing && <p className="mt-4 text-sm text-destructive">{err}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Employee ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">ID Verified</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.user_id} className="border-b border-border/50">
                <td className="px-4 py-3 font-mono text-xs">{m.employee_id}</td>
                <td className="px-4 py-3">{m.full_name || "—"}</td>
                <td className="px-4 py-3">{m.email}</td>
                <td className="px-4 py-3">{m.roles.map((r) => ROLE_LABELS[r as AppRole] || r).join(", ") || "—"}</td>
                <td className="px-4 py-3">{m.id_number ? <span className="text-primary">Yes</span> : <span className="text-muted-foreground">Pending</span>}</td>
                <td className="px-4 py-3">{m.disabled ? <span className="text-destructive">Disabled</span> : <span className="text-primary">Active</span>}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button onClick={() => { setErr(""); setEditing({ user_id: m.user_id, full_name: m.full_name || "", phone: m.phone || "", roles: m.roles, disabled: !!m.disabled }); }}
                    className="mr-3 text-xs text-primary hover:underline">Edit</button>
                  <button onClick={() => del(m.user_id)} className="text-xs text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TasksTab() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", assigned_to: "", priority: "normal", due_date: "" });
  const list = useServerFn(listTeam);

  async function load() {
    const [{ data: t }, m] = await Promise.all([
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      list(),
    ]);
    setTasks(t ?? []);
    setMembers(m.members as Member[]);
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    await supabase.from("tasks").insert({
      title: form.title, description: form.description,
      assigned_to: form.assigned_to || null, priority: form.priority,
      due_date: form.due_date || null, assigned_by: u.user?.id,
    });
    setForm({ title: "", description: "", assigned_to: "", priority: "normal", due_date: "" });
    setShowForm(false);
    load();
  }

  const nameById = new Map(members.map((m) => [m.user_id, `${m.full_name || m.email} (${m.employee_id})`]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{tasks.length} tasks</p>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {showForm ? "Cancel" : "+ Assign Task"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="mt-5 grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
          <TF label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
          <div>
            <label className="mb-1 block text-sm font-medium">Assign to</label>
            <select required value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm">
              <option value="">Select team member</option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>{m.full_name || m.email} · {m.employee_id} · {m.roles.join(",")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm">
              <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option>
            </select>
          </div>
          <TF label="Due date" type="date" value={form.due_date} onChange={(v) => setForm({ ...form, due_date: v })} />
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <button type="submit" className="md:col-span-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Create task</button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {tasks.length === 0 && <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No tasks yet.</div>}
        {tasks.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-xs text-muted-foreground">To: {nameById.get(t.assigned_to) || "Unassigned"} · Status: {t.status} · Priority: {t.priority}</p>
                {t.description && <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>}
              </div>
              {t.due_date && <span className="text-xs text-muted-foreground">Due {t.due_date}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TF({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}{required && <span className="text-primary"> *</span>}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
    </div>
  );
}
