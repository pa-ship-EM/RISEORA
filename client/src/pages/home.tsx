import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Shield, ArrowRight, Users, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/professional_financial_freedom_hero_background.png";

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
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Take Control of Your Future
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary leading-tight mb-6">
              Rebuild Your Credit, <br />
              <span className="text-secondary">Reclaim Your Life.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Professional credit repair and financial empowerment services designed to help you approve for loans, lower interest rates, and build lasting wealth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth?tab=signup">
                <Button size="lg" className="text-lg px-8 h-14 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  Start Free Consultation
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="text-lg px-8 h-14 border-primary/20 hover:bg-primary/5">
                  View Our Plans
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
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Why Choose RiseOra?</h2>
            <p className="text-muted-foreground">We combine expert legal knowledge with cutting-edge technology to deliver results you can see.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-secondary" />}
              title="Secure & Compliant"
              description="Bank-level 256-bit encryption and full FCRA compliance ensuring your data is always protected."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-10 w-10 text-secondary" />}
              title="Proven Results"
              description="Our advanced dispute strategies have removed thousands of negative items for our clients."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-secondary" />}
              title="Expert Support"
              description="Dedicated case advisors available via secure messaging to guide you through every step."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <Stat number="10k+" label="Clients Served" />
            <Stat number="$2M+" label="Debt Removed" />
            <Stat number="92%" label="Success Rate" />
            <Stat number="24/7" label="Client Portal" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Ready to improve your score?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't let bad credit hold you back from the home, car, or life you deserve. Join RiseOra today.
          </p>
          <Link href="/auth?tab=signup">
            <Button size="lg" className="text-lg px-10 h-14 bg-secondary hover:bg-secondary/90 text-primary font-bold shadow-lg">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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
