import { createFileRoute, Link } from "@tanstack/react-router";
import kasiLogo from "@/assets/kasi-logo.png";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · Kasi Dash" },
      { name: "description", content: "How Kasi Dash collects, uses, and protects your personal information under POPIA." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LegalHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm text-muted-foreground">Effective date: 07 July 2026</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Kasi Dash and BuildForge (Pty) Ltd (Reg. 2026/362826/07) respects your privacy and is committed to protecting your personal information in line with the Protection of Personal Information Act, 4 of 2013 (POPIA).
        </p>

        <Section title="1. Who we are">
          Kasi Dash is the responsible party for the personal information processed through this website, our client portals, and the Kasi Dash delivery platform. You can reach our Information Officer at unity@kasidash.co.za.
        </Section>

        <Section title="2. Information we collect">
          <ul className="list-disc space-y-1 pl-6">
            <li>Identifying data you submit through enquiry forms (name, email, phone, business name).</li>
            <li>Staff and contractor data (identity number, employee ID, profile picture, contact details) for internal identification and payroll.</li>
            <li>Session and device data required to keep our platform secure.</li>
            <li>Communication history you exchange with our team.</li>
          </ul>
        </Section>

        <Section title="3. How we use your information">
          <ul className="list-disc space-y-1 pl-6">
            <li>To reply to enquiries and prepare a quotation.</li>
            <li>To deliver and support the services you have engaged us for.</li>
            <li>To manage internal team access, task assignment, and access control.</li>
            <li>To comply with legal, tax, and regulatory obligations in the Republic of South Africa.</li>
          </ul>
        </Section>

        <Section title="4. Lawful basis">
          We process personal information under one or more lawful bases in section 11 of POPIA: your consent, performance of a contract, compliance with a legal obligation, or the legitimate interests of Kasi Dash and its clients.
        </Section>

        <Section title="5. Sharing and processors">
          We only share personal information with vetted operators who help us deliver services (for example authentication, hosting, and email providers). All operators are bound by contract to protect your data.
        </Section>

        <Section title="6. Data security">
          We apply administrative, physical, and technical safeguards including role based access controls, encryption in transit, hashed credentials, secret rotation, and audit logging on our admin portals.
        </Section>

        <Section title="7. Retention">
          We retain personal information only for as long as needed to fulfil the purpose it was collected for, or as required by law. Enquiries that do not result in a contract are archived and deleted within 24 months.
        </Section>

        <Section title="8. Your rights">
          You may request access to, correction of, or deletion of your personal information, and you may withdraw consent at any time by contacting unity@kasidash.co.za. You also have the right to lodge a complaint with the Information Regulator (South Africa) at inforeg@justice.gov.za.
        </Section>

        <Section title="9. Cookies">
          We use only essential cookies required for login sessions and security. We do not sell your data to advertising networks.
        </Section>

        <Section title="10. Changes">
          We may update this Privacy Policy from time to time. Material changes will be posted on this page with a revised effective date.
        </Section>
      </main>
      <LegalFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}
export function LegalHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/"><img src={kasiLogo} alt="Kasi Dash" className="h-10 w-auto" /></Link>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/popia" className="hover:text-foreground">POPIA</Link>
        </nav>
      </div>
    </header>
  );
}
export function LegalFooter() {
  return (
    <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Kasi Dash and BuildForge (Pty) Ltd. Reg. No. 2026/362826/07. Republic of South Africa.
    </footer>
  );
}
