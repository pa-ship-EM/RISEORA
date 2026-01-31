import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ComplianceDisclaimer } from "@/components/ui/compliance-disclaimer";
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
              RiseOra provides the tools and education you need to prepare your own dispute documents.
              We empower you to challenge inaccuracies with precision using our proprietary software.
            </p>
          </div>

          {/* Important Disclosures */}
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <div className="bg-amber-50/50 rounded-2xl p-8 border border-amber-200/60 shadow-sm relative overflow-hidden text-left inline-block w-full">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="h-24 w-24 text-amber-900" />
              </div>
              <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                <Scale className="h-5 w-5" /> Important Disclosures
              </h2>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                <DisclosureItem title="Educational Purposes Only" description="All content provided is for educational and informational purposes." />
                <DisclosureItem title="No Credit Repair Service" description="RiseOra is not a credit repair organization. We do not provide credit repair services." />
                <DisclosureItem title="No Guarantees" description="We cannot guarantee any specific results or improvements to your credit score." />
                <DisclosureItem title="Self-Service Platform" description="You are responsible for all communications and documents you generate." />
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-10">
            <ComplianceDisclaimer variant="full" />
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <PricingCard
              title="DIY Scholar (Free)"
              price="$0"
              description="Free educational access to learn the fundamentals of credit disputes."
              features={[
                "RiseOra 'Credit Master' E-Book",
                "Basic Credit Building Modules",
                "Plain-Language Legal Explainers",
                "Educational Calculators",
                "Progress Tracking Profile",
                "Access to Community Forums"
              ]}
              icon={<BookOpen className="h-6 w-6 text-primary" />}
            />
            <PricingCard
              title="Self-Starter (Beta)"
              price="$49"
              description="Educational tools to manage your own credit audit and basic disputes."
              features={[
                "Everything in DIY Scholar",
                "Access to Dispute Wizard™ (Beta)",
                "Full E-Book & Guide Library",
                "3 Bureau Audit Workflows / Month",
                "Standard Template Library",
                "Email Support (48h Response)"
              ]}
              icon={<Zap className="h-6 w-6 text-primary" />}
            />
            <PricingCard
              title="Growth (Beta)"
              price="$99"
              isPopular
              description="Enhanced guided workflows with unlimited document generation."
              features={[
                "Everything in Self-Starter",
                "Full Dispute Wizard™ Workflow",
                "Advanced Credit Analysis Tools",
                "All 3 Bureaus Guided Paths",
                "Unlimited Document Generation",
                "Score Education Dashboard",
                "Priority Support (24h Response)"
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
                "Strategic Support Calls",
                "Direct Advisor Messaging"
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
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-slate-900 font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1">
          <Wand2 className="h-3 w-3" /> Most Popular
        </div>
      )}

      {discountBadge && (
        <div className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isPopular ? 'bg-primary text-white' : 'bg-secondary text-slate-900'}`}>
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
        <Button className={`w-full h-12 text-lg font-semibold ${isPopular ? 'bg-secondary hover:bg-secondary/90 text-slate-900' : 'bg-primary hover:bg-primary/90 text-white'}`}>
          Request Access (Beta)
        </Button>
      </Link>

      <div className="mt-4 flex flex-col items-center gap-1 text-[10px] text-muted-foreground opacity-80">
        <div className="flex items-center gap-1 font-medium">
          <ShieldCheck className="h-3 w-3" /> Bank-level encryption
        </div>
        <div>We never sell your data</div>
      </div>
    </div>
  );
}

function DisclosureItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-3">
      <Check className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-amber-900 text-sm">{title}</p>
        <p className="text-amber-800/80 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

