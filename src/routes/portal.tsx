import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, ROLE_LABELS, type AppRole } from "@/lib/auth-context";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Portal · Kasi Dash" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PortalPage,
});

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_by: string | null;
  created_at: string;
};

function PortalPage() {
  const { user, profile, roles, loading, refresh, signOut } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"tasks" | "profile" | "password">("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [loading, user, nav]);

  useEffect(() => {
    if (profile?.must_change_password) setTab("password");
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase.from("tasks").select("*").eq("assigned_to", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      setTasks((data as Task[]) ?? []);
    });
  }, [user]);

  if (loading || !user || !profile) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }

  const isAdmin = roles.includes("admin");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/"><img src={kasiLogo} alt="Kasi Dash" className="h-9 w-auto" /></Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin" className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                Admin Console
              </Link>
            )}
            <div className="text-right text-xs">
              <div className="font-semibold">{profile.full_name || profile.email}</div>
              <div className="text-muted-foreground">{profile.employee_id} · {roles.map((r) => ROLE_LABELS[r]).join(", ") || "No role"}</div>
            </div>
            <button onClick={() => signOut().then(() => nav({ to: "/" }))} className="text-xs text-muted-foreground hover:text-foreground">Sign out</button>
          </div>
        </div>
      </header>

      {profile.must_change_password && (
        <div className="border-b border-primary/40 bg-primary/10 px-6 py-3 text-center text-sm text-primary">
          You are using a temporary password. Please change it before continuing.
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-black">
          {roles[0] ? `${ROLE_LABELS[roles[0] as AppRole]} Portal` : "Staff Portal"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Employee ID: <span className="font-mono text-foreground">{profile.employee_id}</span></p>

        <div className="mt-8 flex gap-2 border-b border-border">
          {(["tasks","profile","password"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>
              {t === "tasks" ? "My Tasks" : t === "profile" ? "Profile" : "Password"}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "tasks" && <TasksPanel tasks={tasks} onUpdate={async () => {
            const { data } = await supabase.from("tasks").select("*").eq("assigned_to", user.id).order("created_at", { ascending: false });
            setTasks((data as Task[]) ?? []);
          }} />}
          {tab === "profile" && <ProfilePanel onSaved={refresh} />}
          {tab === "password" && <PasswordPanel onDone={refresh} />}
        </div>
      </div>
    </div>
  );
}

function TasksPanel({ tasks, onUpdate }: { tasks: Task[]; onUpdate: () => void }) {
  async function updateStatus(id: string, status: string) {
    await supabase.from("tasks").update({ status }).eq("id", id);
    onUpdate();
  }
  if (tasks.length === 0) {
    return <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">No tasks assigned yet.</div>;
  }
  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{t.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${t.priority === "high" ? "bg-destructive/20 text-destructive" : "bg-secondary text-secondary-foreground"}`}>
                  {t.priority}
                </span>
              </div>
              {t.description && <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>}
              {t.due_date && <p className="mt-2 text-xs text-muted-foreground">Due: {t.due_date}</p>}
            </div>
            <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs">
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="review">In review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfilePanel({ onSaved }: { onSaved: () => void }) {
  const { user, profile } = useAuth();
  const [full_name, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [id_number, setIdNumber] = useState(profile?.id_number || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatar_url, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [signedAvatar, setSignedAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (avatar_url) {
      supabase.storage.from("avatars").createSignedUrl(avatar_url, 3600).then(({ data }) => {
        if (data?.signedUrl) setSignedAvatar(data.signedUrl);
      });
    }
  }, [avatar_url]);

  async function uploadAvatar(file: File) {
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) return setMsg("Upload failed: " + error.message);
    setAvatarUrl(path);
    setMsg("Picture uploaded. Remember to save.");
  }

  async function save() {
    if (!user) return;
    setSaving(true); setMsg("");
    if (!id_number || id_number.length < 6) {
      setSaving(false);
      return setMsg("ID number is required to be identified in the system.");
    }
    const { error } = await supabase.from("profiles")
      .update({ full_name, phone, id_number, bio, avatar_url })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) return setMsg(error.message);
    setMsg("Profile saved.");
    onSaved();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-primary/40 bg-secondary">
          {signedAvatar ? (
            <img src={signedAvatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">?</div>
          )}
        </div>
        <label className="cursor-pointer rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          Upload picture
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
        </label>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <TF label="Full name" value={full_name} onChange={setFullName} />
        <TF label="Phone" value={phone} onChange={setPhone} />
        <TF label="ID number (required for identification)" value={id_number} onChange={setIdNumber} />
        <TF label="Employee ID" value={profile?.employee_id || ""} disabled />
      </div>
      <div className="mt-5">
        <label className="mb-1 block text-sm font-medium">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
      </div>

      {msg && <p className="mt-4 text-sm text-primary">{msg}</p>}
      <button disabled={saving} onClick={save}
        className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
        {saving ? "Saving..." : "Save profile"}
      </button>
    </div>
  );
}
function TF({ label, value, onChange, disabled }: { label: string; value: string; onChange?: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input type="text" value={value} disabled={disabled} onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-60" />
    </div>
  );
}

function PasswordPanel({ onDone }: { onDone: () => void }) {
  const { user } = useAuth();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function change() {
    setMsg("");
    if (p1.length < 12) return setMsg("Use at least 12 characters.");
    if (p1 !== p2) return setMsg("Passwords do not match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: p1 });
    if (error) { setLoading(false); return setMsg(error.message); }
    if (user) await supabase.from("profiles").update({ must_change_password: false }).eq("user_id", user.id);
    setLoading(false);
    setMsg("Password updated.");
    setP1(""); setP2("");
    onDone();
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold">Change password</h2>
      <p className="mt-1 text-sm text-muted-foreground">Minimum 12 characters. Use a mix of upper, lower, numbers, and symbols.</p>
      <div className="mt-6 space-y-4">
        <TF label="New password" value={p1} onChange={setP1} />
        <TF label="Confirm new password" value={p2} onChange={setP2} />
      </div>
      {msg && <p className="mt-3 text-sm text-primary">{msg}</p>}
      <button disabled={loading} onClick={change}
        className="mt-5 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
        {loading ? "Updating..." : "Update password"}
      </button>
    </div>
  );
}
