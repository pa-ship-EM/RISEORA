import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ComplianceDisclaimer } from "@/components/ui/compliance-disclaimer";
import { CheckCircle2, TrendingUp, Shield, ArrowRight, Users, Wand2, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/professional_financial_freedom_hero_background.png";

import wizardLogo from "@assets/ChatGPT_Image_Dec_30,_2025,_03_41_14_PM_1767131297375.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Office background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-semibold mb-6 border border-secondary/20">
              <img src={wizardLogo} alt="Wizard" className="h-5 w-auto" />
              Introducing the Dispute Wizard™ (Beta)
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary leading-tight mb-6">
              Tools to Help You Prepare Your <br />
              <span className="text-secondary">Credit Report Dispute Documents.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              RiseOra uses intelligent workflows to assist you in identifying potential errors and preparing consumer dispute letters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth?tab=signup">
                <Button size="lg" className="text-lg px-8 h-14 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  Join Beta Program
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="text-lg px-8 h-14 border-primary/20 hover:bg-primary/5">
                  Early Access Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
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

      {/* CTA Section */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Ready to take control of your credit report?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start with our basic plan at just $49/mo and access guided dispute preparation tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth?tab=signup">
              <Button size="lg" className="text-lg px-10 h-14 bg-secondary hover:bg-secondary/90 text-slate-900 font-bold shadow-lg w-full sm:w-auto">
                Get Early Access <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" size="lg" className="text-lg px-10 h-14 border-primary/20 hover:bg-primary/5 w-full sm:w-auto">
                Browse Resources <BookOpen className="ml-2 h-5 w-5 text-secondary" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 max-w-xl mx-auto">
            <ComplianceDisclaimer variant="compact" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="mb-6 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
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
