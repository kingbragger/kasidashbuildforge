import { createFileRoute } from "@tanstack/react-router";
import { LegalHeader, LegalFooter } from "./privacy";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions · Kasi Dash" },
      { name: "description", content: "The terms governing your use of Kasi Dash websites, portals, and services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LegalHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm text-muted-foreground">Effective date: 07 July 2026</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">Terms and Conditions</h1>
        <p className="mt-4 text-muted-foreground">
          These terms govern your access to and use of the Kasi Dash and BuildForge websites, staff and partner portals, and any related services (collectively, the Services), operated by Kasi Dash and BuildForge (Pty) Ltd (Reg. 2026/362826/07).
        </p>

        <S title="1. Acceptance">By accessing the Services you agree to these terms. If you do not agree, do not use the Services.</S>
        <S title="2. Quotations and enquiries">
          All prices quoted for website and platform work are custom and based on the enquiry information you submit. A quotation is valid for 30 days and is not a binding contract until countersigned by both parties.
        </S>
        <S title="3. Accounts">
          Staff accounts are created by an authorised administrator. You are responsible for keeping your credentials confidential. Temporary passwords must be changed on first login. Unauthorised sharing of credentials is prohibited.
        </S>
        <S title="4. Acceptable use">
          You may not use the Services to break the law, infringe intellectual property, disrupt operations, run automated attacks, or upload harmful content.
        </S>
        <S title="5. Intellectual property">
          All designs, code, brand marks, and content produced by Kasi Dash remain the property of Kasi Dash until fully paid for, after which agreed deliverables transfer to the client as set out in the signed statement of work.
        </S>
        <S title="6. Payment">
          Invoiced amounts are payable within 7 days unless a different schedule is agreed in writing. Late payments may attract interest at the prescribed rate under the Prescribed Rate of Interest Act.
        </S>
        <S title="7. Warranties and disclaimers">
          The Services are provided on an as is basis. We work hard to keep them secure and available but do not warrant uninterrupted operation.
        </S>
        <S title="8. Limitation of liability">
          To the maximum extent permitted by law, Kasi Dash will not be liable for indirect or consequential losses. Our aggregate liability is limited to the fees paid by you for the specific engagement in the 12 months preceding the claim.
        </S>
        <S title="9. Termination">
          We may suspend or terminate access if you breach these terms or fail to pay for the Services. You may terminate an engagement in writing subject to any notice period in your signed statement of work.
        </S>
        <S title="10. Governing law">
          These terms are governed by the laws of the Republic of South Africa. The parties submit to the exclusive jurisdiction of the South African courts.
        </S>
        <S title="11. Contact">Legal notices should be sent to unity@kasidash.co.za.</S>
      </main>
      <LegalFooter />
    </div>
  );
}
function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{children}</p>
    </section>
  );
}
