import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Users, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About RiseOra</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              We are on a mission to democratize financial freedom through education, technology, and expert advocacy.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-primary">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded by financial experts who saw the system was stacked against the average consumer, RiseOra was built to level the playing field. We believe that a credit score shouldn't be a life sentence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Using advanced algorithms and deep legal expertise in the Fair Credit Reporting Act (FCRA), we help our clients identify and remove inaccurate, unverifiable, and unfair negative items from their credit reports.
              </p>
            </div>
            <div className="grid gap-6">
              <ValueCard 
                icon={<Shield className="h-6 w-6 text-secondary" />}
                title="Integrity First"
                text="We only promise what we can deliver. Transparency is at the core of everything we do."
              />
              <ValueCard 
                icon={<Users className="h-6 w-6 text-secondary" />}
                title="Client Obsession"
                text="Your success is our success. We fight for your financial future as if it were our own."
              />
              <ValueCard 
                icon={<Target className="h-6 w-6 text-secondary" />}
                title="Results Driven"
                text="We focus on tangible improvements to your credit score and financial health."
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="font-bold text-primary mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
