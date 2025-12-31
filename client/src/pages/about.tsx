import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Users, Target, GraduationCap, Scale, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-primary text-white py-24">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">About RiseOra</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-light italic">
              Your Credit Education & Guided Support Platform
            </p>
          </div>
        </div>

        {/* Section 1 - Who We Are */}
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">Who We Are</h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                RiseOra is a credit education and guided support platform. We empower consumers to understand, manage, and assert their credit rights through structured workflows, tools, and resources.
              </p>
              <div className="flex gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-200 items-start">
                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
                <p className="text-amber-900 font-medium">
                  <strong>Important:</strong> RiseOra does not submit disputes on your behalf. Clients remain in full control of sending all communications to credit bureaus.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 - Our Core Values */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <ValueCard 
              icon={<GraduationCap className="h-6 w-6 text-secondary" />}
              title="Education-First"
              text="Knowledge is power. Learn why items appear on your report and how to address them."
            />
            <ValueCard 
              icon={<Target className="h-6 w-6 text-secondary" />}
              title="Guided Support"
              text="We provide step-by-step workflows, templates, and checklists."
            />
            <ValueCard 
              icon={<Shield className="h-6 w-6 text-secondary" />}
              title="Transparency"
              text="Every feature, workflow, and subscription plan is explained upfront."
            />
            <ValueCard 
              icon={<Lock className="h-6 w-6 text-secondary" />}
              title="Security"
              text="All personal data is encrypted at rest and in transit, with bank-level 256-bit security."
            />
          </div>

          {/* Section 3 - Legal Compliance */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Legal Compliance</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <span className="bg-secondary/20 text-secondary w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                  CROA
                </h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> No upfront fees for future work.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Written agreements provided.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> 3-day cancellation notice.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <span className="bg-secondary/20 text-secondary w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  FCRA
                </h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Educate consumers on rights.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Identify inaccuracies.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Guidance without direct filing.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <span className="bg-secondary/20 text-secondary w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                  FTC & State
                </h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Factual marketing language.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> No guaranteed results.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> State-specific adherence.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 - How RiseOra Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">How RiseOra Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                "Review your credit report.",
                "Use our AI-powered Dispute Wizard™.",
                "Track your dispute timeline.",
                "Submit disputes yourself."
              ].map((step, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <div className="text-2xl font-serif font-bold text-secondary/30 mb-2">0{idx + 1}</div>
                  <p className="text-sm text-slate-700 font-medium">{step}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 mt-6 italic">Results vary. RiseOra does not guarantee outcomes.</p>
          </div>

          {/* Section 5 - Pricing Transparency */}
          <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl mb-16 shadow-xl">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center text-secondary">Pricing Transparency</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <h4 className="font-bold text-xl text-white">DIY Scholar</h4>
                <p className="text-secondary font-bold">$0/month</p>
                <p className="text-xs text-slate-400">Self-led education for those just starting their financial journey.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-xl text-white">Self-Starter</h4>
                <p className="text-secondary font-bold">$49/month</p>
                <p className="text-xs text-slate-400">Access to Dispute Wizard™, 2-bureau audit, standard templates.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-xl text-secondary">Growth Tier</h4>
                <p className="text-white font-bold">$99/month</p>
                <p className="text-xs text-slate-400">Full Dispute Wizard™ automation, all 3 bureaus, unlimited disputes.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-xl text-white">Compliance+</h4>
                <p className="text-secondary font-bold">$149/month</p>
                <p className="text-xs text-slate-400">Metro 2 compliance, cease & desist, ID theft protocol, advisor guidance.</p>
              </div>
            </div>
            <div className="mt-12 text-center text-xs text-slate-400 border-t border-slate-800 pt-8">
              Subscriptions are billed monthly. No upfront fees for future work. Cancel anytime.
            </div>
          </div>

          {/* Section 6 - Your Rights */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-10 text-center">Your Rights & Disclosures</h2>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold text-primary text-sm mb-2">Educational Use</h4>
                <p className="text-xs text-slate-500 leading-relaxed">All tools are for educational purposes only.</p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold text-primary text-sm mb-2">Your Responsibility</h4>
                <p className="text-xs text-slate-500 leading-relaxed">You submit all disputes yourself.</p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Scale className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold text-primary text-sm mb-2">No Legal Advice</h4>
                <p className="text-xs text-slate-500 leading-relaxed">We do not provide legal advice.</p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Lock className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold text-primary text-sm mb-2">Data Privacy</h4>
                <p className="text-xs text-slate-500 leading-relaxed">AES-256 encrypted. Never shared.</p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="h-7 w-7 text-secondary" />
                </div>
                <h4 className="font-semibold text-primary text-sm mb-2">3-Day Refund</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Full refund policy (CROA compliant).</p>
              </div>
            </div>
          </div>

          {/* Section 7 - Contact */}
          <div className="text-center max-w-2xl mx-auto py-12">
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">Contact & Support</h2>
            <div className="space-y-2 text-slate-600">
              <p className="font-bold text-primary">Email: support@riseora.org</p>
              <p>Phone: (828) 377-9388</p>
              <p>Address: 5820 E WT Harris Blvd, Ste 109 PMB 1100</p>
              <p>Charlotte, NC 28215 United States</p>
            </div>
            <p className="mt-8 font-medium text-primary">
              We are committed to transparency, security, and empowering our clients to take control of their credit.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex gap-4 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 mt-1 bg-secondary/10 p-3 rounded-2xl">{icon}</div>
      <div>
        <h3 className="font-bold text-primary mb-2 text-xl">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
