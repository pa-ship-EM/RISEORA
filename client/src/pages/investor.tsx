import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShieldCheck, GraduationCap } from "lucide-react";
import { Link } from "wouter";

export default function InvestorOverview() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">RiseOra Investor Overview</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 leading-relaxed">
              Disrupting the $4B Credit Repair Industry with an <br/>
              <span className="text-secondary font-bold">Advisor-Guided, Education-First Model.</span>
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">The Problem</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-4">
                  Traditional credit repair is broken. Consumers pay high monthly fees for "done-for-you" services that lack transparency, offer no guarantee, and leave them uneducated about how to maintain their results.
                </p>
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive-foreground">
                  <p className="font-semibold">Current Industry churn is &gt;40% due to lack of trust.</p>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">The RiseOra Solution</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-4">
                  We empower consumers with <strong>software + guidance</strong>. Instead of hiding the process, we provide the "Dispute Wizard™" for automation and pair it with "Personal Case Advisors" for strategy.
                </p>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
                  <p className="font-semibold">Result: Higher LTV, lower churn, and real financial literacy.</p>
                </div>
              </div>
            </div>

            {/* Core Pillars */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-t-secondary shadow-sm">
                <CardHeader>
                  <GraduationCap className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Education First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    We don't just fix credit; we build credit intelligence. Our integrated education modules ensure clients understand the 'why' behind the 'what', leading to sustainable financial health.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-primary shadow-sm">
                <CardHeader>
                  <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Compliance & Trust</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Built on strict Metro 2 compliance standards and fully transparent CROA adherence. We operate with legal precision, distinguishing us from "fly-by-night" repair shops.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-secondary shadow-sm">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Scalable Tech</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Our Dispute Wizard™ AI automates 90% of the manual work, allowing our advisors to focus on high-value strategy rather than data entry.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-primary/10 mb-12">
              <h2 className="text-3xl font-serif font-bold text-primary mb-6 text-center">VC-Style Summary</h2>
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p className="font-medium text-slate-900">
                  RiseOra captures the demand for credit improvement while structurally avoiding the regulatory, operational, and scaling constraints that limit traditional credit repair companies.
                </p>
                <p>
                  By combining education, guided workflows, and consumer-executed action, RiseOra delivers real value with lower legal risk and SaaS-level scalability.
                </p>
                <div className="pt-4 border-t border-slate-100 italic text-primary font-serif text-xl text-center">
                  "This is not credit repair — it’s compliant financial infrastructure."
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-primary mb-8">Why Now?</h2>
              <p className="text-lg text-slate-600 mb-8">
                Household debt is at an all-time high. Interest rates are rising. The demand for legitimate, effective credit optimization has never been greater. RiseOra is positioned to capture the "conscious consumer" segment of this market.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/auth?tab=signup">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90">Join the Revolution</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">Meet the Team</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
