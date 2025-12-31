import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Wand2, Zap, Scale, BookOpen } from "lucide-react";
import { Link } from "wouter";

import wizardLogo from "@assets/ChatGPT_Image_Dec_30,_2025,_03_41_14_PM_1767131297375.png";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-semibold mb-6 border border-secondary/20">
              <img src={wizardLogo} alt="Wizard" className="h-4 w-auto" />
              Powered by RiseOra Dispute Wizard™ (Beta)
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Credit Education & Guided Workflows</h1>
            <p className="text-xl text-muted-foreground">
              RiseOra provides the tools and education you need to manage your own credit repair. 
              We empower you to challenge inaccuracies with precision using our proprietary software.
            </p>
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 inline-block text-left">
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>Legal Notice:</strong> RiseOra is a software provider. We do not submit disputes on behalf of consumers. 
                You remain in full control of all communications sent to credit bureaus.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <PricingCard 
              title="DIY Scholar (Free)"
              price="$0"
              description="Free educational access to learn the fundamentals of credit repair."
              features={[
                "RiseOra 'Credit Master' E-Book",
                "Basic Credit Building Modules",
                "Plain-Language Legal Explainers",
                "Educational Calculators",
                "Progress Tracking Profile"
              ]}
              icon={<BookOpen className="h-6 w-6 text-primary" />}
            />
            <PricingCard 
              title="Self-Starter (Beta)"
              price="$49"
              description="Educational tools to manage your own credit audit and basic disputes."
              features={[
                "Access to Dispute Wizard™ (Beta)",
                "Full E-Book & Guide Library",
                "3 Bureau Audit Workflows / Month",
                "Standard Template Library",
                "Self-Guided Support"
              ]}
              icon={<Zap className="h-6 w-6 text-primary" />}
            />
            <PricingCard 
              title="Growth (Beta)"
              price="$99"
              isPopular
              description="Enhanced guided workflows with unlimited document generation."
              features={[
                "Full Dispute Wizard™ Workflow",
                "Advanced Credit Analysis Tools",
                "All 3 Bureaus Guided Paths",
                "Unlimited Document Generation",
                "Score Education Dashboard",
                "Priority Support Access"
              ]}
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
            />
            <PricingCard 
              title="Compliance+ (Beta)"
              price="$149"
              description="Our most comprehensive educational support including Metro 2 guidance."
              features={[
                "Everything in Growth",
                "Metro 2 Compliance Education",
                "Advanced Template Library",
                "Identity Theft Educational Protocol",
                "Personal Case Advisor Guidance",
                "Strategic Support"
              ]}
              icon={<Scale className="h-6 w-6 text-primary" />}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PricingCard({ title, price, originalPrice, features, description, isPopular, icon, discountBadge }: { title: string, price: string, originalPrice?: string, features: string[], description: string, isPopular?: boolean, icon?: React.ReactNode, discountBadge?: string }) {
  return (
    <div className={`relative rounded-2xl bg-white p-8 flex flex-col ${isPopular ? 'border-2 border-secondary shadow-2xl scale-105 z-10' : 'border border-slate-200 shadow-sm'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-primary font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1">
          <Wand2 className="h-3 w-3" /> Most Popular
        </div>
      )}

      {discountBadge && (
        <div className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isPopular ? 'bg-primary text-white' : 'bg-secondary text-primary'}`}>
          {discountBadge}
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isPopular ? 'bg-secondary/20' : 'bg-slate-100'}`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-primary">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">{description}</p>
        <div className="flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-xl text-muted-foreground line-through decoration-destructive/50">{originalPrice}</span>
          )}
          <span className="text-4xl font-bold text-primary">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>

      <div className="flex-grow space-y-4 mb-8">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-secondary' : 'text-primary'}`} />
            <span className="text-slate-600 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Link href="/auth?tab=signup">
        <Button className={`w-full h-12 text-lg font-semibold ${isPopular ? 'bg-secondary hover:bg-secondary/90 text-primary' : 'bg-primary hover:bg-primary/90 text-white'}`}>
          Request Access (Beta)
        </Button>
      </Link>
    </div>
  );
}
