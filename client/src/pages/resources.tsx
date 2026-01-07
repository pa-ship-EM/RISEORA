import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BookOpen, CreditCard, Home, Loader2 } from "lucide-react";
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
              icon={<CreditCard className="h-8 w-8 text-secondary" />}
              title="Secured Credit Cards"
              description="A secured credit card requires a cash deposit that serves as your credit limit. This is one of the most effective ways to build or rebuild credit because it reports to all three major bureaus with minimal risk."
              link="/resources/secured-cards"
              linkText="Top Recommendations"
            />
            <ResourceCard 
              icon={<Home className="h-8 w-8 text-secondary" />}
              title="Mortgage Readiness"
              description="Lenders look for a steady income, a low debt-to-income ratio (DTI), and a FICO score typically above 620. Preparing 6-12 months in advance by optimizing your credit profile is key to securing lower interest rates."
              link="/resources/mortgage-checklist"
              linkText="Read Checklist"
            />
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Credit Tools & Partners</h2>
              <p className="text-center text-muted-foreground mb-12">
                Explore our curated collection of credit tools, financial resources, and recommended products. Some links are affiliate links — we may earn a commission at no extra cost to you.
              </p>
              
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

function AffiliateLink({ title, description, partner, url = "#" }: { title: string, description: string, partner: string, url?: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-secondary/50 hover:bg-secondary/5 transition-all group">
      <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-primary group-hover:bg-white group-hover:shadow-sm shrink-0">
        {partner[0]}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-primary group-hover:text-secondary transition-colors">{partner}</h3>
          <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-secondary" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-1">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}
