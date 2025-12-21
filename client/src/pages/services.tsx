import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your goals. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              title="Starter"
              price="$99"
              description="Perfect for those with minor credit issues."
              features={[
                "Basic Credit Audit",
                "2 Bureau Disputes",
                "Monthly Updates",
                "Email Support"
              ]}
            />
            <PricingCard 
              title="Professional"
              price="$149"
              isPopular
              description="Our most popular plan for comprehensive repair."
              features={[
                "Advanced Credit Audit",
                "All 3 Bureaus Disputes",
                "Unlimited Disputes",
                "Inquiry Removal",
                "24/7 Client Portal Access",
                "Priority Support"
              ]}
            />
            <PricingCard 
              title="Premier"
              price="$199"
              description="Aggressive results for complex credit profiles."
              features={[
                "Everything in Professional",
                "Cease & Desist Letters",
                "Identity Theft Protection",
                "Personal Case Advisor",
                "Legal Escalation Support",
                "Financial Planning Session"
              ]}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PricingCard({ title, price, features, description, isPopular }: { title: string, price: string, features: string[], description: string, isPopular?: boolean }) {
  return (
    <div className={`relative rounded-2xl bg-white p-8 flex flex-col ${isPopular ? 'border-2 border-secondary shadow-2xl scale-105 z-10' : 'border border-slate-200 shadow-sm'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-primary font-bold px-4 py-1 rounded-full text-sm">
          Most Popular
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-primary">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>

      <div className="flex-grow space-y-4 mb-8">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
            <span className="text-slate-600 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Link href="/auth?tab=signup">
        <Button className={`w-full h-12 text-lg font-semibold ${isPopular ? 'bg-secondary hover:bg-secondary/90 text-primary' : 'bg-primary hover:bg-primary/90 text-white'}`}>
          Get Started
        </Button>
      </Link>
    </div>
  );
}
