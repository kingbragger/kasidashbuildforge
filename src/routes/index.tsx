import { createFileRoute } from "@tanstack/react-router";
import barkBadge from "@/assets/bark-badge.png";
import kasiLogo from "@/assets/kasi-logo.png";
import buildforgeLogo from "@/assets/buildforge-logo.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kasi Dash · Fast Township Delivery in South Africa" },
      {
        name: "description",
        content:
          "Food, clothing, groceries, gadgets and more. From your township's best vendors, straight to your door.",
      },
      { property: "og:title", content: "Kasi Dash · Fast Township Delivery" },
      {
        property: "og:description",
        content: "Everything Kasi needs, delivered. Fast, trusted, affordable.",
      },
    ],
  }),
  component: Index,
});

const categories = [
  { name: "Restaurant", tag: "Hot & Fresh", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=85" },
  { name: "Clothing", tag: "Street Style", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=85" },
  { name: "Groceries", tag: "Daily Essentials", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=85" },
  { name: "Gadgets", tag: "Tech & More", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=85" },
  { name: "Perfumes", tag: "Smell Amazing", img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=85" },
  { name: "Pharmacy", tag: "Health & Care", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=85" },
];

const features = [
  { title: "Fast Delivery", desc: "No more waiting. We move at kasi speed." },
  { title: "Trusted Drivers", desc: "Local drivers who know every street." },
  { title: "Affordable Prices", desc: "Premium service that doesn't break the bank." },
  { title: "Live GPS Tracking", desc: "Watch your order arrive on the map in real time." },
];

const steps = [
  { n: "01", title: "Browse & Order", desc: "Shop vendor catalogues or place a custom delivery request.", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80" },
  { n: "02", title: "Driver Assigned", desc: "A vetted local driver picks up your order immediately.", img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&q=80" },
  { n: "03", title: "Live Tracking", desc: "Watch your delivery arrive live on the map until it's in your hands.", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <img src={kasiLogo} alt="Kasi Dash" className="h-10 w-auto" />

          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <a href="#categories" className="hover:text-foreground">Categories</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#vendors" className="hover:text-foreground">Vendors</a>
            <a href="#join" className="hover:text-foreground">Join</a>
          </nav>
          <a href="#shop" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Open App
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Live in selected townships
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Everything <span className="text-primary">Kasi</span> Needs,
              <br /> Delivered.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Food, clothing, groceries, gadgets and more. From your township's best vendors, straight to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#shop" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
                Shop Now →
              </a>
              <a href="#order" className="rounded-xl border border-border bg-card px-6 py-3 font-semibold hover:bg-secondary">
                Place a Delivery
              </a>
            </div>
            <form className="mt-6 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Get early access, enter your email"
                className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <button type="button" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Join
              </button>
            </form>
            <a
              href="https://www.bark.com/en/za/company/kasidash-and-buildforge-ptyltd/Qw61nL/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block"
            >
              <img src={barkBadge} alt="Bark Professional" className="h-16 w-auto" />
            </a>

          </div>

          {/* Floating category cards */}
          <div className="relative grid grid-cols-2 gap-4">
            {categories.map((c, i) => (
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

      {/* Categories */}
      <section id="categories" className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">What We Deliver</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-black md:text-5xl">From kasi to your door</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Six categories. One app. Everything your township needs, delivered fast.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div key={c.name} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <img src={c.img} alt={c.name} className="h-56 w-full object-cover transition group-hover:scale-105" />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.tag}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <a href="#shop" className="inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
              Browse All Categories
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
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

      {/* How it works */}
      <section id="how" className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Simple Process</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-black md:text-5xl">Three steps, door delivered</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">Getting what you need has never been this easy.</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="overflow-hidden rounded-2xl border border-border bg-card">
                <img src={s.img} alt={s.title} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <div className="text-4xl font-black text-primary">{s.n}</div>
                  <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor plan */}
      <section id="vendors" className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <img
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=85"
            alt="Vendor"
            className="rounded-2xl border border-border object-cover"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Vendor Plan</p>
            <div className="mt-2 text-5xl font-black">R250<span className="text-lg font-normal text-muted-foreground">/month</span></div>
            <p className="mt-4 max-w-md text-muted-foreground">
              Per active catalogue. Get your products in front of township customers with full delivery infrastructure included.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Unlimited products","Live on Kasi Dash Shop","Delivery included","Real time notifications","Cancel anytime"].map((x) => (
                <li key={x} className="flex items-center gap-2"><span className="text-primary">✓</span>{x}</li>
              ))}
            </ul>
            <a href="#apply" className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
              Apply to List Your Store
            </a>
          </div>
        </div>
      </section>

      {/* Join ecosystem */}
      <section id="join" className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Opportunities</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-black md:text-5xl">Join the Kasi Dash Ecosystem</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Whether you want to deliver, partner, or build a career, there is a place for you.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { title: "Become a Driver", desc: "Earn on your own schedule. Join our growing fleet of trusted local drivers.", cta: "Apply Now", img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&q=80" },
              { title: "Partner With Us", desc: "Got a business? Use Kasi Dash delivery infrastructure to grow your reach.", cta: "Partner Up", img: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=700&q=80" },
              { title: "Work With Us", desc: "We are building something big. Find open roles and be part of the journey.", cta: "View Careers", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80" },
            ].map((c) => (
              <div key={c.title} className="overflow-hidden rounded-2xl border border-border bg-card">
                <img src={c.img} alt={c.title} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                  <a href="#" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">{c.cta} →</a>
                </div>
              </div>
            ))}
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
              BuildForge is a system where developers, designers, and marketers prove their skills through real challenges and get selected into a core team to work on real projects.
            </p>
            <div className="mt-8 space-y-4">
              {[
                ["Skill based selection", "No interviews. Your work speaks for you."],
                ["Real world challenges", "Tackle actual problems, not contrived tests."],
                ["Core team opportunity", "Top performers join the team and build together."],
              ].map(([t, d]) => (
                <div key={t}>
                  <div className="font-bold">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>
            <a href="https://build-forge-team.lovable.app/" target="_blank" rel="noreferrer" className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
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
          <h2 className="mt-2 text-4xl font-black md:text-6xl">Start ordering smarter today</h2>
          <p className="mt-4 text-muted-foreground">
            Join the people relying on Kasi Dash for fast, reliable local deliveries every day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#shop" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">Shop Now →</a>
            <a href="#order" className="rounded-xl border border-border bg-card px-6 py-3 font-semibold hover:bg-secondary">Place a Delivery</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Kasi Dash. All rights reserved.</div>
          <a
            href="https://www.bark.com/en/za/company/kasidash-and-buildforge-ptyltd/Qw61nL/"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-white px-3 py-2 text-xs font-bold text-slate-900"
          >
            ★ bark PROFESSIONAL ★
          </a>
        </div>
      </footer>
    </div>
  );
}
