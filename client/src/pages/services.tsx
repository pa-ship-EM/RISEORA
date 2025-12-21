import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Wand2, Zap, Scale } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-semibold mb-6 border border-secondary/20">
              <Wand2 className="h-4 w-4" />
              Powered by RiseOra Dispute Wizard™
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Automated Credit Repair</h1>
            <p className="text-xl text-muted-foreground">
              Leverage our proprietary Dispute Wizard™ technology to challenge negative items with precision. Choose the level of automation that fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              title="Self-Starter"
              price="$49"
              description="Access the Dispute Wizard™ to manage your own repair."
              features={[
                "Access to Dispute Wizard™",
                "Basic Credit Audit",
                "2 Bureau Disputes / Month",
                "Standard Letter Templates",
                "Email Support"
              ]}
              icon={<Zap className="h-6 w-6 text-primary" />}
            />
            <PricingCard 
              title="Growth"
              price="$99"
              isPopular
              description="Automated disputes with enhanced tracking."
              features={[
                "Full Dispute Wizard™ Automation",
                "Advanced Credit Audit",
                "All 3 Bureaus Disputes",
                "Unlimited Disputes",
                "Score Tracking Dashboard",
                "Priority Support"
              ]}
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
            />
            <PricingCard 
              title="Compliance+"
              price="$149"
              description="Legal-grade Metro 2 compliance for complex cases."
              features={[
                "Everything in Growth",
                "Metro 2 Compliance Verification",
                "Cease & Desist Letters",
                "Identity Theft Protocol",
                "Legal Escalation Support",
                "Personal Case Advisor"
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

function PricingCard({ title, price, features, description, isPopular, icon }: { title: string, price: string, features: string[], description: string, isPopular?: boolean, icon?: React.ReactNode }) {
  return (
    <div className={`relative rounded-2xl bg-white p-8 flex flex-col ${isPopular ? 'border-2 border-secondary shadow-2xl scale-105 z-10' : 'border border-slate-200 shadow-sm'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-primary font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1">
          <Wand2 className="h-3 w-3" /> Most Popular
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
        <div className="flex items-baseline gap-1">
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
          Start Dispute Wizard™
        </Button>
      </Link>
    </div>
  );
}
