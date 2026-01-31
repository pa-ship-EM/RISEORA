import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BookOpen, Home, Loader2, ShieldCheck } from "lucide-react";
import { useAffiliates } from "@/hooks/use-affiliates";

export default function Resources() {
  const { affiliates, isLoading } = useAffiliates("resources");
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Info & Resources</h1>
            <p className="text-xl text-muted-foreground">
              Free tools, guides, and recommended services to help you build credit and achieve financial freedom.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <ResourceCard
              icon={<BookOpen className="h-8 w-8 text-secondary" />}
              title="Understand Your Credit"
              description="Learn how credit scores are calculated and what factors impact your financial reputation. Source: Consumer Advice | Federal Trade Commission (.gov)"
              link="https://consumer.ftc.gov/articles/understanding-your-credit"
              linkText="View FTC Guide"
            />
            <ResourceCard
              icon={<Home className="h-8 w-8 text-secondary" />}
              title="Mortgage Readiness"
              description="Information regarding lender requirements (DTI, income, FICO 620+) and preparing for homeownership. Source: HUD.gov"
              link="https://www.hud.gov/helping-americans/buying-a-home"
              linkText="View HUD Guide"
            />
            <ResourceCard
              icon={<ShieldCheck className="h-8 w-8 text-secondary" />}
              title="Identity Theft Protocol"
              description="Step-by-step guidance on what to do if you suspect your identity has been stolen. Source: IdentityTheft.gov"
              link="https://www.identitytheft.gov/"
              linkText="Recovery Steps"
            />
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Credit Tools & Partners</h2>
              <p className="text-center text-muted-foreground mb-12">
                Explore our curated collection of credit tools, financial resources, and recommended products. Some links are affiliate links — we may earn a commission at no extra cost to you.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <AffiliateLink
                  partner="IDIQ FICO Score Monitoring"
                  description="Get your real FICO scores from all 3 bureaus with identity theft protection and credit monitoring alerts."
                  title="FICO Score Monitoring"
                  url="https://member.myscoreiq.com/get-fico-preferred.aspx?offercode=432142BC"
                  isFeatured
                />
                <AffiliateLink
                  partner="SmartCredit"
                  description="Monitor your credit with 3-bureau reports, score tracking, and identity theft protection tools."
                  title="Credit Monitoring & Reports"
                  url="https://www.smartcredit.com/join/?pid=82067&cid=RISORAQ1"
                  isFeatured
                />
              </div>

              <h3 className="text-xl font-bold text-primary mb-6 text-center">Additional Tools & Partners</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {isLoading ? (
                  <div className="col-span-2 flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : affiliates.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No affiliate resources available at this time.
                  </div>
                ) : (
                  affiliates.map((affiliate) => (
                    <AffiliateLink
                      key={affiliate.id}
                      title={affiliate.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      description={affiliate.description}
                      partner={affiliate.name}
                      url={affiliate.url}
                    />
                  ))
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 text-slate-500 text-sm italic text-center">
                <p>
                  RiseOra provides educational resources and guidance. We do not submit disputes on your behalf, nor guarantee results. Affiliate links may provide a commission at no extra cost to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ResourceCard({ icon, title, description, link, linkText }: { icon: React.ReactNode, title: string, description: string, link: string, linkText: string }) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-slate-200">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-6 text-base">{description}</CardDescription>
        <Button variant="outline" className="w-full" asChild>
          <a href={link}>{linkText}</a>
        </Button>
      </CardContent>
    </Card>
  );
}

function AffiliateLink({ title, description, partner, url = "#", isFeatured }: { title: string, description: string, partner: string, url?: string, isFeatured?: boolean }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`flex items-start gap-4 p-6 rounded-xl border transition-all group ${isFeatured ? 'border-secondary/30 bg-secondary/5 hover:bg-secondary/10 shadow-sm' : 'border-slate-100 hover:border-secondary/50 hover:bg-secondary/5'}`}>
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center font-bold text-primary shrink-0 ${isFeatured ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white group-hover:shadow-sm'}`}>
        {partner[0]}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-primary group-hover:text-secondary transition-colors">{partner}</h3>
          <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-secondary" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-1">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </a>
  );
}
