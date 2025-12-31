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

import corporateMeetingImage from "@assets/generated_images/business_meeting_in_modern_corporate_office.png";

export default function BusinessPartnerships() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary pt-32 pb-20 text-white relative overflow-hidden">
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
        <section className="py-20 bg-background/50">
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

        {/* Corporate Partnerships & Programs */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-wider text-sm mb-4">
                  <Briefcase className="h-5 w-5" /> Corporate Partnerships
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">B2B Employee Credit Education Programs</h2>
                <p className="text-muted-foreground text-lg">
                  Financial stress is the leading cause of productivity loss in the workplace. We partner with employers to provide RiseOra as a high-impact wellness benefit for the working class.
                </p>
                <div className="grid md:grid-cols-1 gap-4">
                  <FeatureCard 
                    icon={<ShieldCheck className="h-6 w-6" />}
                    title="Employee Retention"
                    description="Helping employees fix their credit leads to home ownership and stability, which in turn reduces workforce turnover."
                  />
                  <FeatureCard 
                    icon={<Zap className="h-6 w-6" />}
                    title="Reduced Stress"
                    description="Our guided workflows remove the complexity and fear associated with credit challenges, allowing workers to focus on their jobs."
                  />
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img 
                  src={corporateMeetingImage} 
                  alt="Professional Business Meeting" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 md:p-12 space-y-6">
                    <h3 className="text-2xl font-serif font-bold">Custom Enterprise Pricing</h3>
                    <p className="text-primary-foreground/80">
                      We offer scalable B2B pricing models tailored to your organization's size and specific needs.
                    </p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary" /> Per-Seat Licensing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary" /> Bulk Enrollment Discounts
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary" /> Custom White-Label Portals
                      </li>
                    </ul>
                    <Button className="bg-secondary text-primary font-bold w-full md:w-auto px-8">Contact Sales</Button>
                  </div>
                  <div className="bg-secondary/10 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-serif font-bold text-secondary mb-2">Tiered</div>
                      <div className="text-xl uppercase tracking-widest text-secondary/80 font-bold">Volume Pricing</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background/50">
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