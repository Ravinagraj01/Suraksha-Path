import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-4xl font-bold tracking-tight text-[#1F1F1F] md:text-[42px]">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-[#6B7280] md:text-lg">{subtitle}</p>}
    </div>
  );
}

function FeatureRow({ reverse = false, title, text, image }) {
  return (
    <div className="card-ui grid items-center gap-8 overflow-hidden p-6 md:grid-cols-2 md:p-10">
      <div className={reverse ? "md:order-2" : ""}>
        <img src={image} alt={title} className="h-[280px] w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.03]" />
      </div>
      <div className={reverse ? "md:order-1" : ""}>
        <h3 className="text-3xl font-bold tracking-tight text-[#1F1F1F] md:text-4xl">{title}</h3>
        <p className="mt-4 text-base leading-7 text-[#6B7280] md:text-lg">{text}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, name, role }) {
  return (
    <div className="card-ui p-6">
      <p className="text-base leading-7 text-[#6B7280]">{quote}</p>
      <p className="mt-4 text-[#3B5BDB]">★★★★★</p>
      <p className="mt-4 font-semibold text-[#1F1F1F]">{name}</p>
      <p className="text-sm text-[#6B7280]">{role}</p>
    </div>
  );
}

export default function LandingPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get("/news/ai-disaster-updates?limit=3").then((r) => setNews(r.data.items || [])).catch(() => {});
  }, []);

  return (
    <div className="bg-[#F5F5F7] text-[#1F1F1F]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#F5F5F7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="#home" className="text-xl font-semibold tracking-tight">SurakshaPath</a>
          <nav className="hidden items-center gap-8 text-sm text-[#6B7280] md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-[#1F1F1F]">
                {item.label}
              </a>
            ))}
            <Link to="/login" className="transition hover:text-[#1F1F1F]">Volunteer</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-[#6B7280] transition hover:text-[#1F1F1F]">Log in</Link>
            <Link to="/login" className="btn-primary">Sign up</Link>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 md:grid-cols-2 md:px-8 md:pt-20 fade-up">
          <div>
            <p className="text-sm text-[#6B7280]">State Disaster Management Platform</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-[#1F1F1F] md:text-[66px] md:leading-[1.05]">
              Real-time Disaster Response and Preparedness
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#6B7280] md:text-lg">
              Monitor flood risk heatmaps, track shelters, trigger SOS response, and coordinate recovery analytics from one unified command interface.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="btn-primary px-6 py-3">Get Started</Link>
              <Link to="/dashboard" className="btn-outline px-6 py-3">View Dashboard</Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1400&q=80"
            alt="Disaster monitoring command room"
            className="min-h-[360px] w-full rounded-2xl object-cover shadow-card transition duration-500 hover:scale-[1.02]"
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 fade-up-delay">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="card-ui p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Live SOS Managed</p>
              <p className="mt-2 text-3xl font-bold text-[#1F1F1F]">12,540+</p>
              <p className="mt-1 text-sm text-[#6B7280]">Requests tracked with district-level escalation.</p>
            </div>
            <div className="card-ui p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Shelter Network</p>
              <p className="mt-2 text-3xl font-bold text-[#1F1F1F]">2,300+</p>
              <p className="mt-1 text-sm text-[#6B7280]">Shelters monitored with real-time capacity updates.</p>
            </div>
            <div className="card-ui p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Damage Reports</p>
              <p className="mt-2 text-3xl font-bold text-[#1F1F1F]">48K+</p>
              <p className="mt-1 text-sm text-[#6B7280]">Field evidence submissions validated for recovery.</p>
            </div>
            <div className="card-ui p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">AI News Signals</p>
              <p className="mt-2 text-3xl font-bold text-[#1F1F1F]">24x7</p>
              <p className="mt-1 text-sm text-[#6B7280]">Real-world disaster updates from trusted free feeds.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 fade-up-delay">
          <p className="text-center text-sm text-[#6B7280]">Trusted by emergency operation centers and district authorities</p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            {["STATE EOC", "HEALTH DEPT", "POLICE", "NGO NET", "CIVIL DEFENSE"].map((logo) => (
              <div key={logo} className="rounded-xl bg-white py-4 text-center text-xs font-semibold tracking-wide text-slate-400 shadow-card">
                {logo}
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl space-y-8 px-4 pb-16 md:px-8">
          <div className="card-ui p-6 md:p-8">
            <h3 className="text-3xl font-bold tracking-tight text-[#1F1F1F] md:text-4xl">About SurakshaPath</h3>
            <p className="mt-3 max-w-4xl text-base leading-7 text-[#6B7280] md:text-lg">
              SurakshaPath is a state-to-national disaster coordination platform built for emergency operations centers, district administrators, and citizens.
              It combines live SOS handling, shelter intelligence, damage reporting, and AI-assisted situational updates in one unified workflow.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">Operational Scope: Multi-state and district-aware</div>
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">Core Modules: Prevention, Response, Recovery</div>
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">Data Model: UUID + state_id + district_id for scale</div>
            </div>
          </div>
          <FeatureRow
            title="Flood Monitoring and Risk Heatmaps"
            text="Use geofenced risk zones and AI-ready flood prediction modules to issue warnings and improve pre-disaster planning."
            image="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80"
          />
          <FeatureRow
            reverse
            title="Shelter Tracking and Capacity Control"
            text="Monitor shelter occupancy, update capacity in real-time, and guide displaced families to safe shelters quickly."
            image="https://images.unsplash.com/photo-1469571486292-b53601020848?auto=format&fit=crop&w=1400&q=80"
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <SectionTitle title="Live AI Disaster News" subtitle="Real-world updates from free disaster intelligence feeds." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {news.map((n) => (
              <div key={n.id} className="card-ui p-5">
                <p className="text-xs font-semibold text-slate-500">{n.source}</p>
                <h4 className="mt-2 text-base font-semibold text-[#1F1F1F]">{n.title}</h4>
                <p className="mt-2 text-sm text-[#6B7280]">{n.ai_summary}</p>
                {n.url && (
                  <a href={n.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-[#3B5BDB] hover:underline">
                    Read Source
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <SectionTitle title="Testimonials" subtitle="Operational teams rely on consistent, real-time decisions." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <TestimonialCard quote="The SOS feed and shelter panel reduced response coordination time significantly during peak flooding." name="Anita Rao" role="State EOC Lead" />
            <TestimonialCard quote="District teams can now prioritize vulnerable regions using unified risk and health indicators." name="Rahul Verma" role="District Collector Office" />
            <TestimonialCard quote="A single dashboard for alerts, rescue, and analytics improved cross-agency collaboration." name="M. Thomas" role="Relief Operations Manager" />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 md:grid-cols-2 md:px-8">
          <img
            src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1400&q=80"
            alt="Volunteer rescue coordination"
            className="h-[320px] w-full rounded-2xl object-cover shadow-card transition duration-500 hover:scale-[1.02]"
          />
          <div className="card-ui p-6 md:p-8">
            <h3 className="text-4xl font-bold tracking-tight text-[#1F1F1F]">How It Works</h3>
            <div className="mt-6 space-y-4 text-[#6B7280]">
              <div>
                <p className="font-semibold text-[#1F1F1F]">Step 1: Detect Risk</p>
                <p>Flood monitoring, geofencing, and district-level warning signals.</p>
              </div>
              <hr className="border-slate-200" />
              <div>
                <p className="font-semibold text-[#1F1F1F]">Step 2: Respond Fast</p>
                <p>Real-time SOS handling, rescue assignment, and shelter tracking.</p>
              </div>
              <hr className="border-slate-200" />
              <div>
                <p className="font-semibold text-[#1F1F1F]">Step 3: Recover Smarter</p>
                <p>Damage reports, displaced family workflows, and analytics insights.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <div className="card-ui grid items-center gap-8 overflow-hidden p-6 md:grid-cols-2 md:p-10">
            <div>
              <h3 className="text-4xl font-bold tracking-tight text-[#1F1F1F] md:text-[44px]">Build a National-Scale Disaster Response Network</h3>
              <p className="mt-4 text-base leading-7 text-[#6B7280] md:text-lg">
                Start with your state, scale to districts, and expand nationally with one consistent architecture.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/login" className="btn-primary px-6 py-3">Start Free</Link>
                <Link to="/login" className="btn-outline px-6 py-3">Join as Volunteer</Link>
                <Link to="/dashboard/news" className="btn-outline px-6 py-3">Live AI News</Link>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=1400&q=80"
              alt="Relief camp operations"
              className="h-[300px] w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.02]"
            />
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xl font-semibold">SurakshaPath</p>
            <p className="mt-3 text-sm text-[#6B7280]">(c) 2026 SurakshaPath. All rights reserved.</p>
            <a className="mt-3 inline-block text-sm text-[#3B5BDB] hover:underline" href="mailto:controlroom@surakshapath.in">
              controlroom@surakshapath.in
            </a>
            <div className="mt-4 space-y-1 text-sm text-[#6B7280]">
              <p>State Emergency Helpline: 1070</p>
              <p>District Control Room (Demo): +91-80000-1070</p>
              <p>Response Hours: 24x7 Operations Center</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm text-[#6B7280] md:grid-cols-4">
            <div className="space-y-2"><a href="#home">Home</a><a href="#about">About</a></div>
            <div className="space-y-2"><a href="#about">About</a><a href="#contact">Contact</a></div>
            <div className="space-y-2"><a href="#contact">Privacy</a><a href="#contact">Terms</a></div>
            <div className="space-y-2"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://x.com" target="_blank" rel="noreferrer">Twitter</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
