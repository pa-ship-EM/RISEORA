import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText, AlertCircle } from "lucide-react";

export default function AffiliateDisclosure() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Affiliate Disclosure</h1>
            <p className="text-muted-foreground">FTC Compliance Statement</p>
          </div>

          <div className="space-y-8">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Important Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-lg">
                  In accordance with the Federal Trade Commission's (FTC) guidelines concerning the use of endorsements and testimonials in advertising (16 CFR Part 255), this disclosure is provided to ensure transparency about our affiliate relationships.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  About Our Affiliate Program
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  RiseOra Financial operates an affiliate program that allows individuals and businesses to earn commissions by referring new customers to our educational credit dispute document preparation platform.
                </p>

                <h4>How Our Affiliate Program Works</h4>
                <ul>
                  <li>Affiliates receive a unique referral link or code to share with their audience</li>
                  <li>When someone signs up for a paid RiseOra subscription through an affiliate link, the affiliate may earn a commission</li>
                  <li>Commission rates and structures are disclosed to affiliates in their affiliate agreement</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-secondary" />
                  Compensation Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>When you see content about RiseOra from third parties, please be aware that:</p>
                
                <ul>
                  <li><strong>Affiliate Relationships:</strong> Some individuals or websites promoting RiseOra may receive compensation for referrals. This does not increase the cost to you.</li>
                  <li><strong>Testimonials:</strong> Some testimonials on our website or partner websites may come from affiliates who have a financial interest in RiseOra's success.</li>
                  <li><strong>Reviews:</strong> Third-party reviews may be written by affiliates who will earn a commission if you purchase through their links.</li>
                </ul>

                <h4>Our Commitment</h4>
                <p>
                  Despite any affiliate relationships, we require all affiliates to provide honest, accurate information about our services. Affiliates are prohibited from:
                </p>
                <ul>
                  <li>Making false claims about credit repair outcomes</li>
                  <li>Guaranteeing specific results</li>
                  <li>Misrepresenting RiseOra as a credit repair service (we are an educational platform)</li>
                  <li>Using deceptive marketing practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  Affiliate Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>All RiseOra affiliates are contractually required to:</p>
                
                <ul>
                  <li><strong>Disclose the Relationship:</strong> Clearly disclose their affiliate relationship in any content that promotes RiseOra</li>
                  <li><strong>Be Truthful:</strong> Only make truthful statements about our services and avoid unrealistic promises</li>
                  <li><strong>Comply with Laws:</strong> Follow all applicable laws, including FTC guidelines, CROA, and state regulations</li>
                  <li><strong>Use Approved Materials:</strong> Only use marketing materials and claims that have been approved by RiseOra</li>
                  <li><strong>Avoid Prohibited Terms:</strong> Never use language that implies credit repair guarantees, legal services, or outcome promises</li>
                </ul>

                <h4>Compliance Language Requirements</h4>
                <p>Affiliates must describe RiseOra using approved language such as:</p>
                <ul>
                  <li>"Educational credit dispute document preparation platform"</li>
                  <li>"Guided self-service credit education tools"</li>
                  <li>"Consumer-directed dispute letter preparation"</li>
                </ul>
                <p>Affiliates may NOT describe RiseOra as:</p>
                <ul>
                  <li>"Credit repair service"</li>
                  <li>"Credit fix" or "credit score improvement guaranteed"</li>
                  <li>A service that "removes negative items" or "deletes collections"</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Disclosure Language for Affiliates</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We recommend affiliates use disclosure language similar to:</p>
                
                <blockquote className="bg-slate-100 p-4 rounded-lg border-l-4 border-l-secondary italic">
                  "Disclosure: This page contains affiliate links. If you sign up for RiseOra through my link, I may receive a commission at no additional cost to you. I only recommend products and services I believe can genuinely help. RiseOra is an educational platform that helps you prepare dispute documents—it is not a credit repair service and does not guarantee any specific outcomes."
                </blockquote>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reporting Violations</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  If you encounter an affiliate making misleading claims or failing to disclose their relationship with RiseOra, please report it to us immediately at <a href="mailto:compliance@riseora.org" className="text-secondary">compliance@riseora.org</a>.
                </p>
                <p>
                  We take affiliate compliance seriously and will investigate all reports. Affiliates found violating these guidelines will be removed from our program.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white">
              <CardHeader>
                <CardTitle>Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">If you have questions about our affiliate program or this disclosure, contact us:</p>
                <div className="space-y-2 text-primary-foreground/90">
                  <p><strong>Email:</strong> <a href="mailto:affiliates@riseora.org" className="text-secondary hover:underline">affiliates@riseora.org</a></p>
                  <p><strong>General Support:</strong> <a href="mailto:support@riseora.org" className="text-secondary hover:underline">support@riseora.org</a></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
