import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsAndLegal() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">Legal Disclaimers & Terms of Service</h1>
            
            <div className="space-y-8 text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-primary mb-3">1. Educational Disclaimer</h2>
                <p>
                  RiseOra is an educational platform and software provider designed to assist consumers in managing their own credit repair process. 
                  We are not a law firm, and our services do not constitute legal advice. The "Dispute Wizard™" and other tools are self-help software 
                  intended to streamline the creation of dispute letters based on user inputs. Users are solely responsible for the accuracy of the 
                  information they provide and for reviewing all generated documents before submission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary mb-3">2. No Guarantee Disclaimer</h2>
                <p>
                  Credit repair results vary significantly based on each individual's unique credit history and the responsiveness of credit bureaus 
                  and creditors. RiseOra makes no guarantees, promises, or warranties regarding specific outcomes, score increases, or the deletion 
                  of any specific negative item. Past performance of other users is not indicative of future results.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary mb-3">3. Guided Support Scope</h2>
                <p>
                  Our "Personal Case Advisors" and support team provide guidance on how to use the RiseOra platform and general educational information 
                  regarding credit reporting standards. They do not provide legal representation, financial planning, or tax advice. For complex legal 
                  matters, we recommend consulting with a qualified attorney in your jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary mb-3">4. CROA Consumer Rights & 3-Day Cancellation Notice</h2>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-sm">
                  <p className="font-bold mb-2">Consumer Rights Under the Credit Repair Organizations Act (CROA):</p>
                  <p className="mb-4">
                    You have a right to dispute inaccurate information in your credit report by contacting the credit bureau directly. However, neither you nor any "credit repair" company or credit repair organization has the right to have accurate, current, and verifiable information removed from your credit report. The credit bureau must remove accurate, negative information from your report only if it is over 7 years old. Bankruptcy information can be reported for 10 years.
                  </p>
                  <p className="font-bold mb-2">Right to Cancel:</p>
                  <p>
                    You have a right to cancel your contract with any credit repair organization for any reason within 3 business days from the date you signed it. RiseOra honors this right strictly. To cancel, simply email support@riseora.org within 3 business days of your subscription start date for a full refund.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary mb-3">5. Privacy Policy & Terms of Use</h2>
                <p>
                  By using RiseOra, you agree to our full Terms of Service and Privacy Policy. We collect data solely for the purpose of providing 
                  our services and improving user experience. We use bank-level 256-bit encryption to protect your personal information. We do not 
                  sell your personal data to third parties. Your use of affiliate links on our Resources page constitutes a separate relationship 
                  between you and the third-party provider.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
