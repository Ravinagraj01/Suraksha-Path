import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Users, Home, FileText, Activity, ArrowRight, CheckCircle } from "lucide-react";

import api from "../services/api";
import AnimatedButton from "../components/ui/AnimatedButton";
import GlassCard from "../components/ui/GlassCard";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-hero font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent md:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-body text-blue-200 md:text-lg">{subtitle}</p>}
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bento-card group cursor-pointer"
    >
      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-h3 font-semibold text-white mb-3">{title}</h3>
      <p className="text-small text-blue-200 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatCard({ label, value, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="bento-card text-center"
    >
      <p className="text-caption text-blue-300 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-hero font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-1">
        {value}
      </p>
      <p className="text-small text-blue-200">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, name, role, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bento-card"
    >
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mr-1" />
        ))}
      </div>
      <p className="text-body text-blue-200 mb-6 italic">"{quote}"</p>
      <div>
        <p className="text-h3 font-semibold text-white">{name}</p>
        <p className="text-small text-blue-300">{role}</p>
      </div>
    </motion.div>
  );
}

export default function PremiumLandingPage() {
  const { theme } = useTheme();
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get("/news/ai-disaster-updates?limit=3").then((r) => setNews(r.data.items || [])).catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-slate-800/90 backdrop-blur border-b border-slate-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <a href="#home" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SurakshaPath
            </a>
          </div>
          
          <nav className="hidden items-center gap-8 text-small text-blue-200 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
            <Link to="/login" className="transition hover:text-white">Volunteer</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="text-small text-blue-200 transition hover:text-white">Log in</Link>
            <AnimatedButton variant="primary" size="sm">Sign up</AnimatedButton>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          id="home" 
          className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 md:grid-cols-2 md:px-8 md:pt-20"
        >
          <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}>
            <p className="text-small text-blue-300 font-medium uppercase tracking-wider">State Disaster Management Platform</p>
            <h1 className="mt-4 text-display font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent md:leading-[1.05]">
              Real-time Disaster Response and Preparedness
            </h1>
            <p className="mt-6 max-w-xl text-body text-blue-200 leading-relaxed">
              Monitor flood risk heatmaps, track shelters, trigger SOS response, and coordinate recovery analytics from one unified command interface.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <AnimatedButton variant="primary" icon={<ArrowRight size={16} />}>
                Get Started
              </AnimatedButton>
              <AnimatedButton variant="glass" icon={<Activity size={16} />}>
                View Dashboard
              </AnimatedButton>
            </div>
          </motion.div>
          
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1400&q=80"
              alt="Disaster monitoring command room"
              className="relative min-h-[360px] w-full rounded-2xl object-cover shadow-2xl border border-slate-700"
            />
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <div className="bento-grid bento-grid-4x1">
            <StatCard
              label="Live SOS Managed"
              value="12,540+"
              description="Requests tracked with district-level escalation"
              delay={0.1}
            />
            <StatCard
              label="Shelter Network"
              value="2,300+"
              description="Shelters monitored with real-time capacity"
              delay={0.2}
            />
            <StatCard
              label="Damage Reports"
              value="48K+"
              description="Field evidence submissions validated for recovery"
              delay={0.3}
            />
            <StatCard
              label="AI News Signals"
              value="24x7"
              description="Real-world disaster updates from trusted feeds"
              delay={0.4}
            />
          </div>
        </section>

        {/* Trust Badges */}
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <p className="text-center text-small text-blue-200">Trusted by emergency operation centers and district authorities</p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            {["STATE EOC", "HEALTH DEPT", "POLICE", "NGO NET", "CIVIL DEFENSE"].map((logo, index) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bento-card py-4 text-center text-small font-semibold text-blue-200"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-7xl space-y-8 px-4 pb-16 md:px-8">
          <SectionTitle 
            title="Advanced Features" 
            subtitle="Comprehensive disaster management tools for emergency response teams" 
          />
          
          <div className="bento-grid bento-grid-3x1">
            <FeatureCard
              icon={<AlertTriangle className="w-6 h-6 text-blue-400" />}
              title="Real-time SOS Alerts"
              description="Instant emergency response coordination with live tracking and priority management system"
              delay={0.1}
            />
            <FeatureCard
              icon={<Home className="w-6 h-6 text-purple-400" />}
              title="Shelter Intelligence"
              description="Monitor shelter occupancy, update capacity in real-time, and guide displaced families"
              delay={0.2}
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-green-400" />}
              title="Damage Reporting"
              description="Field evidence submissions with AI validation for comprehensive recovery analytics"
              delay={0.3}
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-orange-400" />}
              title="Volunteer Network"
              description="Connect with trained volunteers and coordinate relief efforts efficiently across districts"
              delay={0.4}
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-red-400" />}
              title="AI-Powered Analytics"
              description="Advanced predictive analytics and risk assessment powered by machine learning"
              delay={0.5}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-cyan-400" />}
              title="Multi-State Coordination"
              description="Scale from state to national level with consistent architecture and workflows"
              delay={0.6}
            />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mx-auto max-w-7xl space-y-8 px-4 pb-16 md:px-8">
          <GlassCard>
            <div className="p-6 md:p-8">
              <h3 className="text-hero font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent md:text-4xl mb-4">
                About SurakshaPath
              </h3>
              <p className="text-body text-blue-200 leading-relaxed mb-6">
                SurakshaPath is a state-to-national disaster coordination platform built for emergency operations centers, district administrators, and citizens.
                It combines live SOS handling, shelter intelligence, damage reporting, and AI-assisted situational updates in one unified workflow.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bento-card p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-small text-white font-medium">Multi-State Operations</p>
                  <p className="text-caption text-blue-200 mt-1">District-aware scaling</p>
                </div>
                <div className="bento-card p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-small text-white font-medium">Complete Workflow</p>
                  <p className="text-caption text-blue-200 mt-1">Prevention to recovery</p>
                </div>
                <div className="bento-card p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-small text-white font-medium">Smart Data Model</p>
                  <p className="text-caption text-blue-200 mt-1">UUID + geo scaling</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* AI News Section */}
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <SectionTitle title="Live AI Disaster News" subtitle="Real-world updates from free disaster intelligence feeds" />
          <div className="mt-8 bento-grid bento-grid-3x1">
            {news.map((n, index) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bento-card"
              >
                <p className="text-caption text-blue-300 font-semibold">{n.source}</p>
                <h4 className="text-h3 font-semibold text-white mt-2 mb-3">{n.title}</h4>
                <p className="text-small text-blue-200 leading-relaxed">{n.ai_summary}</p>
                {n.url && (
                  <a 
                    href={n.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="mt-4 inline-flex items-center text-small text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Read Source <ArrowRight size={14} className="ml-1" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <SectionTitle title="Testimonials" subtitle="Operational teams rely on consistent, real-time decisions" />
          <div className="mt-10 bento-grid bento-grid-3x1">
            <TestimonialCard 
              quote="The SOS feed and shelter panel reduced response coordination time significantly during peak flooding." 
              name="Anita Rao" 
              role="State EOC Lead"
              delay={0.1}
            />
            <TestimonialCard 
              quote="District teams can now prioritize vulnerable regions using unified risk and health indicators." 
              name="Rahul Verma" 
              role="District Collector Office"
              delay={0.2}
            />
            <TestimonialCard 
              quote="A single dashboard for alerts, rescue, and analytics improved cross-agency collaboration." 
              name="M. Thomas" 
              role="Relief Operations Manager"
              delay={0.3}
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 md:grid-cols-2 md:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1400&q=80"
                alt="Volunteer rescue coordination"
                className="relative h-[320px] w-full rounded-2xl object-cover border border-slate-700"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard>
              <div className="p-6 md:p-8">
                <h3 className="text-hero font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  How It Works
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-h3 font-semibold text-white mb-2">Detect Risk</p>
                      <p className="text-small text-blue-200">Flood monitoring, geofencing, and district-level warning signals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-h3 font-semibold text-white mb-2">Respond Fast</p>
                      <p className="text-small text-blue-200">Real-time SOS handling, rescue assignment, and shelter tracking</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-h3 font-semibold text-white mb-2">Recover Smarter</p>
                      <p className="text-small text-blue-200">Damage reports, displaced family workflows, and analytics insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <GlassCard>
            <div className="grid items-center gap-8 p-6 md:grid-cols-2 md:p-10">
              <div>
                <h3 className="text-hero font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Build a National-Scale Disaster Response Network
                </h3>
                <p className="text-body text-blue-200 mb-6">
                  Start with your state, scale to districts, and expand nationally with one consistent architecture.
                </p>
                <div className="flex flex-wrap gap-3">
                  <AnimatedButton variant="primary" icon={<ArrowRight size={16} />}>
                    Start Free
                  </AnimatedButton>
                  <AnimatedButton variant="glass" icon={<Users size={16} />}>
                    Join as Volunteer
                  </AnimatedButton>
                  <AnimatedButton variant="glass" icon={<Activity size={16} />}>
                    Live AI News
                  </AnimatedButton>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=1400&q=80"
                  alt="Relief camp operations"
                  className="relative h-[300px] w-full rounded-2xl object-cover border border-slate-700"
                />
              </div>
            </div>
          </GlassCard>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-700 bg-slate-800">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SurakshaPath
              </p>
            </div>
            <p className="text-small text-blue-200 mb-3">(c) 2026 SurakshaPath. All rights reserved.</p>
            <a className="inline-block text-small text-blue-400 hover:text-blue-300 transition-colors" href="mailto:controlroom@surakshapath.in">
              controlroom@surakshapath.in
            </a>
            <div className="mt-4 space-y-1 text-small text-blue-200">
              <p>State Emergency Helpline: 1070</p>
              <p>District Control Room (Demo): +91-80000-1070</p>
              <p>Response Hours: 24x7 Operations Center</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-small text-blue-200 md:grid-cols-4">
            <div className="space-y-2">
              <a href="#home" className="block hover:text-white transition-colors">Home</a>
              <a href="#features" className="block hover:text-white transition-colors">Features</a>
            </div>
            <div className="space-y-2">
              <a href="#about" className="block hover:text-white transition-colors">About</a>
              <a href="#contact" className="block hover:text-white transition-colors">Contact</a>
            </div>
            <div className="space-y-2">
              <a href="#contact" className="block hover:text-white transition-colors">Privacy</a>
              <a href="#contact" className="block hover:text-white transition-colors">Terms</a>
            </div>
            <div className="space-y-2">
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">LinkedIn</a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
