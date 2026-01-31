import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ComplianceDisclaimer } from "@/components/ui/compliance-disclaimer";
import { CheckCircle2, TrendingUp, Shield, ArrowRight, Users, Wand2, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@assets/hero.png";

import wizardLogo from "@assets/wizard.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Compliance Header Banner */}
      <div className="bg-[#FEF3C7] border-b border-[#F59E0B]/20 py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[12px] md:text-sm font-medium text-[#92400E]">
            ⚖️ <span className="font-bold">Educational Information Only:</span> RiseOra is a credit education and financial literacy platform. <span className="hidden md:inline">We do not provide credit repair services, and we do not dispute items on your behalf.</span>
          </p>
        </div>
      </div>

      {/* Hero Section - Modern UI/UX */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 z-0 gradient-mesh">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,122,127,0.2),transparent_50%)] animate-pulse-slow" />
        </div>

        {/* Floating Glassmorphic Orbs - Multiple layers for depth */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-violet-400/15 to-indigo-500/15 rounded-full blur-2xl animate-pulse-slow" />

        {/* Additional floating geometric shapes */}
        <div className="absolute top-40 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-300/10 to-purple-300/10 rounded-2xl blur-xl animate-float rotate-45" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 right-1/4 w-48 h-48 bg-gradient-to-br from-cyan-300/10 to-blue-300/10 rounded-full blur-2xl animate-float-delayed" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-violet-300/15 to-indigo-300/15 rounded-lg blur-xl animate-float" style={{ animationDelay: '0.5s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-secondary-foreground text-sm font-semibold mb-6 border border-white/30 shadow-lg animate-scale-in">
              <img src={wizardLogo} alt="Wizard" className="h-5 w-auto" />
              Introducing the Dispute Wizard™ (Beta)
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              <span className="gradient-text-vibrant">Tools to Help You Prepare Your</span>
              <br />
              <span className="text-primary">Credit Report Dispute Documents.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              RiseOra uses intelligent workflows to assist you in identifying potential errors and preparing consumer dispute letters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth?tab=signup">
                <Button size="lg" className="relative overflow-hidden text-lg px-8 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 group animate-pulse-glow">
                  <span className="relative z-10">Join Beta Program</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="text-lg px-8 h-14 glass-card border-white/30 hover:bg-white/80 hover:scale-105 transition-all duration-300 shadow-lg">
                  Early Access Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section - "The Ascent" */}
      <section className="py-24 bg-background relative overflow-hidden border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-bold tracking-widest uppercase"
            >
              The Philosophy
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary leading-tight">
              A Bridge to Your <br />
              <span className="italic text-secondary">Highest Potential.</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light italic">
              "True transformation doesn't come from working harder at the wrong things, but from becoming the person who handles the right things with ease."
            </p>
            <div className="grid md:grid-cols-2 gap-12 pt-12 text-left">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-primary">The Ascent</h3>
                <p className="text-muted-foreground leading-relaxed">
                  RiseOra represents the space between where you are and your ultimate potential. We believe that self-mastery is the ultimate form of creativity. By stripping away the clutter of old habits and mental limitations, we reveal the masterpiece that was always there.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-primary">Intentional Mastery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We apply the principles of high-end design—clarity, minimalism, and intentionality—to the human mind. Our tools empower you to rise inward and upward, stripping away noise to focus on what truly matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Why Use The Dispute Wizard™?</h2>
            <p className="text-muted-foreground">We combine industry reporting standards with automated precision to streamline document preparation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-secondary" />}
              title="Metro 2® Standards"
              description="Metro 2® is an industry reporting standard. RiseOra provides educational tools that help users understand how information is typically formatted."
            />
            <FeatureCard
              icon={<Wand2 className="h-10 w-10 text-secondary" />}
              title="Guided Dispute Drafting"
              description="Our Dispute Wizard™ helps identify potential errors and generates dispute letter drafts based on consumer reporting standards."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-secondary" />}
              title="Quality Checks"
              description="System checks for completeness and formatting consistency before document finalization."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <Stat number="10k+" label="Documents Prepared" />
            <Stat number="50k+" label="Consumer Records Reviewed" />
            <Stat number="High" label="User Completion Rate" />
            <Stat number="24/7" label="Client Portal" />
          </div>
        </div>
      </section>

      {/* Resources Teaser Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-12"
          >
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-semibold border border-secondary/20">
                <BookOpen className="h-4 w-4" />
                Free Educational Hub
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary leading-tight">
                Master Your Credit with <br />
                <span className="text-secondary">Expert Resources.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                We believe in an education-first model. Access our library of guides, tools, and regulatory information from the FTC to understand your rights and build lasting financial health.
              </p>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="p-1 rounded bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-primary/80">FTC Verified Guides</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="p-1 rounded bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-primary/80">Metro 2 Standards</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="p-1 rounded bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-primary/80">Identity Protection</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="p-1 rounded bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-primary/80">Building History</span>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/resources">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-10 h-14 text-lg shadow-xl shadow-primary/10 transition-all hover:scale-105 group">
                    Explore Learning Center <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 text-secondary">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">Understand Credit</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Official FTC guidance on your scores and rights.</p>
              </div>
              <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 sm:mt-12">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 shadow-sm flex items-center justify-center mb-6 text-secondary">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">Score Building</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Strategic methods to improve your history.</p>
              </div>
              <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 shadow-sm flex items-center justify-center mb-6 text-secondary">
                  <Shield className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">Legal Compliance</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">FCRA and Metro 2 reporting standards.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 sm:mt-12">
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 text-secondary">
                  <Users className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">Educational Resources</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Educational content developed using publicly available regulatory guidance.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Legal Compliance & Best Practices Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3">
                <div className="sticky top-24">
                  <div className="w-12 h-12 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#B45309] mb-6">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-primary mb-4">Legal Compliance & Best Practices</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    RiseOra is positioned as a credit education, financial literacy, and self-empowerment platform — NOT a credit repair agency.
                  </p>
                </div>
              </div>

              <div className="md:w-2/3 space-y-8">
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
                  <h3 className="font-bold text-lg text-primary mb-3">Safe Business Structure</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Our model is designed for the smart consumer. We focus on education and technical software to help you manage your own journey.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "We teach credit basics and technical reporting standards.",
                      "We explain FCRA + Metro 2® guidelines.",
                      "We provide software-driven self-help tools.",
                      "We provide fillable dispute letter templates.",
                      "CONSUMERS send disputes themselves—we don't act as your agent."
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-primary/80">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <h4 className="font-bold text-sm text-primary mb-2">Key Principles</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      📌 We are NOT acting on your behalf.<br />
                      📌 we are selling education + software.<br />
                      📌 CROA usually does not apply to this education-first model.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <h4 className="font-bold text-sm text-primary mb-2">Our commitment</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      "Educational information only"<br />
                      "We do not dispute on your behalf"<br />
                      "Results vary; no guarantees"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Modern */}
      <section className="relative py-24 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-cyan-50" />
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              <span className="gradient-text">Ready to take control of your credit report?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with our basic plan at just $49/mo and access guided dispute preparation tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth?tab=signup">
                <Button size="lg" className="relative overflow-hidden text-lg px-10 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/50 w-full sm:w-auto transition-all duration-300 hover:scale-105 group">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Early Access <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="lg" className="text-lg px-10 h-14 glass-card border-white/30 hover:bg-white/80 w-full sm:w-auto hover:scale-105 transition-all duration-300 shadow-lg">
                  Browse Resources <BookOpen className="ml-2 h-5 w-5 text-secondary" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 max-w-xl mx-auto">
              <ComplianceDisclaimer variant="compact" />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group relative p-8 rounded-2xl glass-card border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden">
      {/* Gradient border glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative z-10">
        <div className="mb-6 bg-gradient-to-br from-violet-100 to-cyan-100 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-primary mb-3 group-hover:gradient-text transition-all duration-300">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: string, label: string }) {
  return (
    <div className="p-4">
      <div className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-2">{number}</div>
      <div className="text-primary-foreground/70 font-medium">{label}</div>
    </div>
  );
}
