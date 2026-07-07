import { createFileRoute } from "@tanstack/react-router";
import { LegalHeader, LegalFooter } from "./privacy";

export const Route = createFileRoute("/popia")({
  head: () => ({
    meta: [
      { title: "POPIA Compliance · Kasi Dash" },
      { name: "description", content: "Our commitment to the Protection of Personal Information Act (POPIA) of South Africa." },
    ],
  }),
  component: PopiaPage,
});

function PopiaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LegalHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          POPIA Compliant
        </span>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">POPIA Compliance Statement</h1>
        <p className="mt-4 text-muted-foreground">
          Kasi Dash and BuildForge (Pty) Ltd complies with the Protection of Personal Information Act, 4 of 2013 (POPIA) and its regulations issued by the Information Regulator of South Africa.
        </p>

        <B title="Information Officer">
          Unity Ndlovu, Information Officer. Contact: unity@kasidash.co.za.
        </B>
        <B title="The eight conditions">
          We apply all eight POPIA conditions across our operations: accountability, processing limitation, purpose specification, further processing limitation, information quality, openness, security safeguards, and data subject participation.
        </B>
        <B title="Security safeguards">
          <ul className="list-disc space-y-1 pl-6">
            <li>Role based access control on all internal portals (Admin, Developer, Sales, Designer, Quality Assurance).</li>
            <li>Unique employee ID for every internal user, tied to identity documentation.</li>
            <li>Temporary passwords that must be changed on first login.</li>
            <li>Encrypted transport (HTTPS) for all traffic.</li>
            <li>Hashed credentials, secret rotation, and audit logging on privileged actions.</li>
          </ul>
        </B>
        <B title="Cross border transfers">
          We host data on providers with data centres in supported regions and apply contractual safeguards where any operator processes personal information outside the Republic of South Africa.
        </B>
        <B title="Data subject rights">
          As a data subject you may exercise the following rights by writing to unity@kasidash.co.za:
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Request access to your personal information (PAIA request).</li>
            <li>Request correction or deletion of inaccurate or outdated information.</li>
            <li>Object to processing on legitimate grounds.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
        </B>
        <B title="Complaints">
          If you are not satisfied with how we have handled your personal information, you may lodge a complaint with the Information Regulator at inforeg@justice.gov.za.
        </B>
        <B title="Registration and Reg No">
          Registered entity: Kasi Dash and BuildForge (Pty) Ltd. Reg No. 2026/362826/07. Jurisdiction: Republic of South Africa.
        </B>
      </main>
      <LegalFooter />
    </div>
  );
}
function B({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-primary">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}
