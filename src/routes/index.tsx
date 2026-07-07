import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import barkBadge from "@/assets/bark-badge.png";
import kasiLogo from "@/assets/kasi-logo.png";
import buildforgeLogo from "@/assets/buildforge-logo.png";
import alxCert from "@/assets/alx-software-engineering-cert.png";

const PORTFOLIO_URL = "https://agent-6a4a6adbecfcb3d55e50--henryndlovuportfolio.netlify.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kasi Dash · Professional Web Development in South Africa" },
      {
        name: "description",
        content:
          "We build professional websites for every business, from e-commerce to corporate, booking systems, portfolios and custom platforms. Plans from R2,500.",
      },
      { property: "og:title", content: "Kasi Dash · Professional Web Development in South Africa" },
      {
        property: "og:description",
        content:
          "We build professional websites for every business, from e-commerce to corporate, booking systems, portfolios and custom platforms. Plans from R2,500.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const services = [
  {
    name: "Business Websites",
    tag: "Corporate & Professional",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=85",
  },
  {
    name: "E-commerce Stores",
    tag: "Sell Online",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=85",
  },
  {
    name: "Booking Platforms",
    tag: "Salons, Clinics, Tours",
    img: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=85",
  },
  {
    name: "Portfolios",
    tag: "Personal Brand",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85",
  },
  {
    name: "Restaurant Sites",
    tag: "Menus & Ordering",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=85",
  },
  {
    name: "Custom Web Apps",
    tag: "Dashboards & SaaS",
    img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=85",
  },
];

const features = [
  { title: "Certified Engineers", desc: "ALX Africa, Stanford Online, IBM and Google Cloud credentials." },
  { title: "Fast Delivery", desc: "Most sites launched within two to four weeks." },
  { title: "Mobile First", desc: "Every build is responsive, fast and search engine ready." },
  { title: "Ongoing Support", desc: "Optional care plans keep your site secure and up to date." },
];

const steps = [
  {
    n: "01",
    title: "Enquire",
    desc: "Tell us about your business and what you need. No obligation.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
  },
  {
    n: "02",
    title: "Quotation",
    desc: "We send a clear scope and price tailored to your project.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  },
  {
    n: "03",
    title: "Design & Build",
    desc: "We design, develop and review the site with you at every step.",
    img: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&q=80",
  },
  {
    n: "04",
    title: "Launch & Support",
    desc: "We deploy your site and support you as your business grows.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R2,500",
    priceNote: "once off",
    tagline: "A clean one-page site to get your business online.",
    features: [
      "Single page website",
      "Mobile responsive design",
      "Contact form & WhatsApp button",
      "Basic SEO setup",
      "Domain name & business email setup available at a fee",
      "Delivered in 5 to 7 days",
    ],
    cta: "Start with Starter",
  },
  {
    name: "Business",
    price: "R6,500",
    priceNote: "once off",
    tagline: "A polished multi-page site for growing businesses.",
    features: [
      "Up to 6 pages",
      "Custom design & branding",
      "Blog or news section",
      "Google Analytics & SEO",
      "Contact & booking forms",
      "1 month free support",
    ],
    cta: "Choose Business",
    featured: true,
  },
  {
    name: "E-commerce",
    price: "R12,500",
    priceNote: "from",
    tagline: "Sell products or services online with a full store.",
    features: [
      "Full product catalogue",
      "Secure card & EFT payments",
      "Order & stock management",
      "Customer accounts",
      "Shipping & delivery zones",
      "Admin dashboard",
    ],
    cta: "Launch a Store",
  },
  {
    name: "Custom",
    price: "Enquire",
    priceNote: "for pricing",
    tagline: "Bespoke web platforms, dashboards and integrations.",
    features: [
      "Discovery workshop",
      "Custom architecture",
      "Third-party integrations",
      "User roles & permissions",
      "Dedicated project manager",
      "Long-term partnership",
    ],
    cta: "Enquire for Pricing",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <img src={kasiLogo} alt="Kasi Dash" className="h-10 w-auto" />

          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <a href="#services" className="hover:text-foreground">Services</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#process" className="hover:text-foreground">Process</a>
            <a href="#credentials" className="hover:text-foreground">Credentials</a>
            <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">Portfolio</a>
          </nav>
          <HeaderAuth />
        </div>
      </header>

      <CustomerDashboard />

      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* Hexagon line pattern background */}
        <div className="pointer-events-none absolute inset-0 text-primary opacity-[0.22]" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexPattern" x="0" y="0" width="70" height="60.62" patternUnits="userSpaceOnUse">
                <path
                  d="M35 0 L70 20.2 L70 60.62 L35 80.83 L0 60.62 L0 20.2 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.6"
                />
              </pattern>
              <radialGradient id="hexFade" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <mask id="hexMask">
                <rect width="100%" height="100%" fill="url(#hexFade)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexPattern)" mask="url(#hexMask)" />
          </svg>
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Web development · South Africa
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Websites that grow <span className="text-primary">your business</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              From e-commerce to corporate sites, booking platforms and custom web apps, we design and build professional websites for every kind of business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/enquire" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
                Get a Quotation →
              </Link>
              <a href="#pricing" className="rounded-xl border border-border bg-card px-6 py-3 font-semibold hover:bg-secondary">
                See Plans
              </a>
            </div>
            <a
              href="https://www.bark.com/en/za/company/kasidash-and-buildforge-ptyltd/Qw61nL/"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block"
            >
              <img src={barkBadge} alt="Bark Professional" className="h-16 w-auto" />
            </a>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            {services.map((c, i) => (
              <div
                key={c.name}
                className="group relative overflow-hidden rounded-2xl border border-border shadow-2xl"
                style={{ transform: `translateY(${(i % 2) * 24}px)` }}
              >
                <img src={c.img} alt={c.name} className="h-48 w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-sm font-bold uppercase tracking-wide">{c.name}</div>
                  <div className="text-xs opacity-80">{c.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">What We Build</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-black md:text-5xl">Websites for every business</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            We work with startups, established brands, restaurants, salons, creatives and enterprises. If it lives on the web, we can build it.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((c) => (
              <div key={c.name} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <img src={c.img} alt={c.name} className="h-56 w-full object-cover transition group-hover:scale-105" />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Plans & Pricing</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-black md:text-5xl">Transparent pricing, tailored quotations</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Choose a plan that fits your business. Every project starts with an enquiry so we can send you a written quotation before any work begins.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col rounded-2xl border bg-card p-6 ${
                  p.featured ? "border-primary shadow-2xl ring-2 ring-primary/30" : "border-border"
                }`}
              >
                {p.featured && (
                  <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-black">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-primary">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.priceNote}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/enquire"
                  className={`mt-8 inline-block rounded-xl px-5 py-3 text-center text-sm font-semibold ${
                    p.featured
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border bg-background hover:bg-secondary"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            All prices are in South African Rand and exclude domain, hosting and third-party service fees. A detailed quotation is sent after your enquiry.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-2xl text-primary">
                ✦
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our Process</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-black md:text-5xl">Four steps from idea to launch</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">A simple, transparent process from your first enquiry to a fully live website.</p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="overflow-hidden rounded-2xl border border-border bg-card">
                <img src={s.img} alt={s.title} className="h-40 w-full object-cover" />
                <div className="p-6">
                  <div className="text-3xl font-black text-primary">{s.n}</div>
                  <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section id="credentials" className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Credentials</p>
          <h2 className="mt-2 max-w-3xl text-4xl font-black md:text-5xl">Built by certified engineers</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Our lead engineer holds an ALX Africa Software Engineering Professional Certificate and additional credentials from Stanford Online, IBM, Google Cloud and Yonsei University. Every project is delivered to professional standards.
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-2xl border-2 border-primary/40 bg-card p-4 shadow-2xl transition hover:border-primary"
            >
              <img
                src={alxCert}
                alt="ALX Africa Software Engineering Professional Certificate"
                className="w-full rounded-lg object-contain"
              />
              <div className="mt-4 flex items-center justify-between px-2 pb-2 text-sm">
                <div>
                  <div className="font-bold">Software Engineering Professional</div>
                  <div className="text-muted-foreground">ALX Africa · 2024</div>
                </div>
                <span className="text-primary group-hover:underline">See all credentials →</span>
              </div>
            </a>

            <div>
              <ul className="space-y-4 text-sm">
                {[
                  ["ALX Africa", "Software Engineering Professional Certificate"],
                  ["Stanford University Online", "Fundamentals of AI and ML in Precision Medicine"],
                  ["Stanford University Online", "Data Science in Precision Medicine and Cloud Computing"],
                  ["IBM SkillsBuild", "Web Development Fundamentals · Data Literacy"],
                  ["Yonsei University, Coursera", "IoT Wireless and Cloud Computing"],
                  ["Google Cloud, Coursera", "Google Workspace Fundamentals"],
                ].map(([issuer, title]) => (
                  <li key={title} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <span className="mt-0.5 text-primary">✓</span>
                    <div>
                      <div className="font-semibold">{title}</div>
                      <div className="text-xs text-muted-foreground">{issuer}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  View the full portfolio →
                </a>
                <Link
                  to="/enquire"
                  className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary"
                >
                  Start a project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BuildForge */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <img src={buildforgeLogo} alt="BuildForge" className="h-12 w-auto" />
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Prove your skills. Join the core team.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              BuildForge is our talent pipeline where developers, designers and marketers prove their skills through real challenges and join the team building real client projects.
            </p>
            <a
              href="https://build-forge-team.lovable.app/"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
            >
              Start Challenge
            </a>
          </div>
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=85"
            alt="BuildForge"
            className="rounded-2xl border border-border object-cover"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Ready?</p>
          <h2 className="mt-2 text-4xl font-black md:text-6xl">Let's build your website</h2>
          <p className="mt-4 text-muted-foreground">
            Send us an enquiry and we will reply with a written quotation, no obligation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/enquire" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
              Enquire Now →
            </Link>
            <a href="#pricing" className="rounded-xl border border-border bg-card px-6 py-3 font-semibold hover:bg-secondary">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background pt-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <img src={kasiLogo} alt="Kasi Dash" className="h-10 w-auto" />
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Professional web development for South African businesses.
              </p>
              <a
                href="mailto:unity@kasidash.co.za"
                className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <span>✉</span> unity@kasidash.co.za
              </a>
              <a
                href="https://www.bark.com/en/za/company/kasidash-and-buildforge-ptyltd/Qw61nL/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 block w-fit"
              >
                <img src={barkBadge} alt="Bark Professional" className="h-14 w-auto" />
              </a>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Services</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><a href="#services" className="text-muted-foreground hover:text-foreground">What We Build</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground">Plans & Pricing</a></li>
                <li><a href="#process" className="text-muted-foreground hover:text-foreground">Our Process</a></li>
                <li><Link to="/enquire" className="text-muted-foreground hover:text-foreground">Get a Quotation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Portals</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link to="/login" className="text-muted-foreground hover:text-foreground">Client Sign in</Link></li>
                <li><Link to="/staff-login" className="text-muted-foreground hover:text-foreground">Staff Login</Link></li>
                <li><Link to="/portal" className="text-muted-foreground hover:text-foreground">Team Portal</Link></li>
                <li><Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin Console</Link></li>
                <li>
                  <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                    Portfolio →
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms & Conditions</Link></li>
                <li><Link to="/popia" className="text-muted-foreground hover:text-foreground">POPIA Compliant</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-border py-6 text-sm text-muted-foreground md:flex-row">
            <div>© {new Date().getFullYear()} Kasi Dash & BuildForge (Pty) Ltd. All rights reserved.</div>
            <div>Made in South Africa.</div>
          </div>
          <div className="flex flex-col justify-center gap-2 border-t border-border py-5 text-xs text-muted-foreground md:flex-row md:gap-6">
            <span>Reg. No. 2026/362826/07</span>
            <span className="hidden md:inline">|</span>
            <span>Jurisdiction: Republic of South Africa</span>
            <span className="hidden md:inline">|</span>
            <span>Structure: Web-based Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeaderAuth() {
  const { user, profile, roles, signOut } = useAuth();
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/login" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">
          Sign in
        </Link>
        <Link to="/enquire" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Enquire
        </Link>
      </div>
    );
  }
  const isStaff = roles.some((r) => r !== "customer");
  return (
    <div className="flex items-center gap-3">
      <a href="#my-account" className="hidden text-right text-xs sm:block">
        <div className="font-semibold">{profile?.full_name || profile?.email || "Account"}</div>
        <div className="text-muted-foreground">{profile?.employee_id}</div>
      </a>
      {isStaff && (
        <Link to="/portal" className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
          Staff Portal
        </Link>
      )}
      <Link to="/enquire" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
        New enquiry
      </Link>
      <button onClick={() => signOut()} className="text-xs text-muted-foreground hover:text-foreground">
        Sign out
      </button>
    </div>
  );
}

type CustomerEnquiry = {
  id: string;
  business_name: string | null;
  project_type: string | null;
  budget_range: string | null;
  message: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
};

function CustomerDashboard() {
  const { user, profile, roles, loading } = useAuth();
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user || !profile) {
      setBusy(false);
      return;
    }
    setBusy(true);
    supabase
      .from("enquiries")
      .select("id, business_name, project_type, budget_range, message, status, assigned_to, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setEnquiries((data as CustomerEnquiry[]) ?? []);
        setBusy(false);
      });
  }, [user, profile]);

  if (loading || !user || !profile) return null;
  // Only show for customers (not staff-only accounts)
  if (roles.length > 0 && !roles.includes("customer")) return null;

  const active = enquiries.filter((e) => e.status !== "closed" && e.status !== "rejected");
  const history = enquiries;

  return (
    <section id="my-account" className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">My account</p>
            <h2 className="mt-1 text-3xl font-black">
              Welcome back, {(profile.full_name || profile.email || "").split(" ")[0]}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Customer ID: <span className="font-mono text-foreground">{profile.employee_id}</span>
            </p>
          </div>
          <Link to="/enquire" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Start a new project →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Active projects</h3>
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                {active.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Projects currently being reviewed, quoted or built for you.
            </p>
            <div className="mt-5 space-y-3">
              {busy && <div className="text-sm text-muted-foreground">Loading…</div>}
              {!busy && active.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                  No active projects yet.{" "}
                  <Link to="/enquire" className="font-semibold text-primary hover:underline">
                    Send an enquiry
                  </Link>{" "}
                  to get started.
                </div>
              )}
              {active.map((e) => (
                <EnquiryCard key={e.id} e={e} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Enquiry history</h3>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                {history.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">All enquiries you've sent us.</p>
            <div className="mt-5 space-y-3">
              {busy && <div className="text-sm text-muted-foreground">Loading…</div>}
              {!busy && history.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                  Nothing here yet.
                </div>
              )}
              {history.map((e) => (
                <EnquiryCard key={e.id} e={e} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnquiryCard({ e, compact }: { e: CustomerEnquiry; compact?: boolean }) {
  const date = new Date(e.created_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const statusColor =
    e.status === "closed" || e.status === "rejected"
      ? "bg-muted text-muted-foreground"
      : e.status === "in_progress" || e.status === "quoted"
      ? "bg-primary/15 text-primary"
      : "bg-secondary text-secondary-foreground";
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-semibold">
            {e.business_name || e.project_type || "Website project"}
          </div>
          <div className="text-xs text-muted-foreground">
            {date}
            {e.project_type ? ` · ${e.project_type}` : ""}
            {e.budget_range ? ` · ${e.budget_range}` : ""}
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColor}`}>
          {e.status.replace(/_/g, " ")}
        </span>
      </div>
      {!compact && (
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{e.message}</p>
      )}
    </div>
  );
}

