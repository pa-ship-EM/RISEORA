import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function BusinessPartnerships() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary py-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge className="bg-secondary text-primary font-bold mb-6">RiseOra For Enterprise</Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Bridging the Gap Between Education & Financial Success</h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Partnering with educational institutions and employers to provide essential financial literacy and credit mastery tools to the next generation of the American workforce.
            </p>
          </div>
        </section>

        {/* Schools & Colleges */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-wider text-sm">
                  <GraduationCap className="h-5 w-5" /> Higher Education Partnerships
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Empowering Students for Life After Graduation</h2>
                <p className="text-lg text-muted-foreground">
                  Many students graduate with degree in hand but zero knowledge of how credit impacts their ability to rent an apartment, buy a car, or even secure certain jobs.
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                    <p className="text-slate-700"><strong>Curriculum Integration:</strong> We provide modular credit education units for career centers and financial aid offices.</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                    <p className="text-slate-700"><strong>Group Licensing:</strong> Bulk access for student bodies to use our Dispute Wizard™ and educational portal.</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                    <p className="text-slate-700"><strong>Workshop Series:</strong> Live virtual workshops led by RiseOra credit masters for graduating seniors.</p>
                  </li>
                </ul>
                <Button className="bg-primary text-white h-12 px-8">Inquire for Your Campus</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-50 border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-secondary text-4xl font-serif">85%</CardTitle>
                    <CardDescription>of graduates wish they had better financial education.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-primary text-white border-none shadow-lg mt-8">
                  <CardHeader>
                    <CardTitle className="text-secondary text-4xl font-serif">0</CardTitle>
                    <CardDescription className="text-white/80">Barriers to financial entry with RiseOra Scholar.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Working Class / Employers */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-wider text-sm mb-4">
                <Briefcase className="h-5 w-5" /> Workforce Development
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Financial Wellness as an Employee Benefit</h2>
              <p className="text-muted-foreground text-lg">
                Financial stress is the leading cause of productivity loss in the workplace. We partner with employers to provide RiseOra as a high-impact wellness benefit for the working class.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<ShieldCheck className="h-8 w-8" />}
                title="Employee Retention"
                description="Helping employees fix their credit leads to home ownership and stability, which in turn reduces workforce turnover."
              />
              <FeatureCard 
                icon={<Zap className="h-8 w-8" />}
                title="Reduced Stress"
                description="Our guided workflows remove the complexity and fear associated with credit challenges, allowing workers to focus on their jobs."
              />
              <FeatureCard 
                icon={<Target className="h-8 w-8" />}
                title="Career Advancement"
                description="Many high-clearance or financial roles require clean credit. We help workers qualify for their next promotion."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <Card className="bg-primary text-white p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users className="h-64 w-64" />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Ready to Partner?</h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Whether you're a university dean or a HR director, let's discuss how we can build a financially literate future together.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button className="bg-secondary text-primary font-bold h-14 px-10 text-lg">Schedule a Demo</Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-10 text-lg">Download B2B PDF</Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ children, className }: any) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs uppercase tracking-widest ${className}`}>
      {children}
    </span>
  );
}

function CheckCircle({ className }: any) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="bg-primary/5 text-primary p-4 rounded-2xl w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-serif">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}