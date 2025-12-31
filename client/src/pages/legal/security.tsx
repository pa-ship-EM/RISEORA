import React from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Shield, Lock, CreditCard, Server, FileKey, CheckCircle, FileText, Bot, Eye, Scale, HeartHandshake } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full mb-6">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Security & Trust at Riseora
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your personal information is sensitive. We treat it that way. Riseora is built with bank-level security standards to protect your data, your documents, and your privacy—at every step.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          
          <div className="grid gap-8">
            {/* 1. Data Protection */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-2xl font-bold text-primary">Bank-Level Data Protection</h2>
                  <p className="text-muted-foreground">
                    We use the same security practices trusted by banks and financial institutions:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span><strong>AES-256 encryption</strong> for data stored in our systems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span><strong>TLS 1.3 encryption</strong> for all data sent between your device and our servers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Secure, encrypted storage for documents and PDFs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Enforced HTTPS and modern security headers</span>
                    </li>
                  </ul>
                  <p className="text-sm font-medium text-primary/80 pt-2 border-t border-border/50 mt-4">
                    Your information is protected at rest and in transit.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Secure Accounts */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <FileKey className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-2xl font-bold text-primary">Secure Accounts & Access</h2>
                  <p className="text-muted-foreground">
                    Your Riseora account is protected with multiple layers of defense:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Secure password hashing (industry-standard encryption)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Automatic session protection and token rotation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Optional Two-Factor Authentication (2FA) for Premium and Elite members</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Strict access controls — you can only see your own data</span>
                    </li>
                  </ul>
                  <p className="text-sm font-medium text-primary/80 pt-2 border-t border-border/50 mt-4">
                    No one else can access your disputes, documents, or personal details.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Payment Security */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-2xl font-bold text-primary">Payment Security (Stripe)</h2>
                  <p className="text-muted-foreground">
                    Riseora never stores your card information. All payments are handled by Stripe, a global payment processor trusted by millions of businesses.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>PCI-DSS compliant</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Encrypted transactions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Card data never touches our servers</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t flex items-center gap-4 opacity-70">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                    <span className="text-xs text-muted-foreground">Official Payment Partner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Document Security */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-2xl font-bold text-primary">Document & File Security</h2>
                  <p className="text-muted-foreground">
                    When you upload documents to Riseora:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Files are encrypted and stored securely</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Access is restricted to your account only</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Download links are private and protected</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Malicious file uploads are blocked automatically</span>
                    </li>
                  </ul>
                  <p className="text-sm font-medium text-primary/80 pt-2 border-t border-border/50 mt-4">
                    Your dispute documents stay private—always.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. AI Privacy */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-2xl font-bold text-primary">AI Use & Privacy</h2>
                  <p className="text-muted-foreground">
                    Riseora uses AI to help generate educational and dispute documents, not to exploit your data.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Your data is never sold</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>AI is used only to generate content you request</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>We do not train AI models on your personal information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Sensitive identifiers are minimized wherever possible</span>
                    </li>
                  </ul>
                  <p className="text-sm font-medium text-primary/80 pt-2 border-t border-border/50 mt-4">
                    AI works for you — not against your privacy.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Privacy by Design */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-2xl font-bold text-primary">Privacy by Design</h2>
                  <p className="text-muted-foreground">
                    We built Riseora with privacy as a core principle:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>We never sell your personal data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>No data sharing with advertisers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Clear privacy controls and transparency</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Users may request data access or deletion at any time</span>
                    </li>
                  </ul>
                  <p className="text-sm font-medium text-primary/80 pt-2 border-t border-border/50 mt-4">
                    Your trust matters more than monetizing your information.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Compliance */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-2xl font-bold text-primary">Compliance & Transparency</h2>
                  <p className="text-muted-foreground">
                    Riseora is designed to operate responsibly and transparently:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>CROA disclosures are presented before any paid service</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>FCRA disclaimers included in dispute letters</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Educational, self-service platform — no legal promises</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Audit logs maintained for system integrity</span>
                    </li>
                  </ul>
                  <p className="text-sm font-medium text-primary/80 pt-2 border-t border-border/50 mt-4">
                    We empower you with knowledge and tools — you stay in control.
                  </p>
                </div>
              </div>
            </div>

            {/* Promise */}
            <div className="bg-secondary/10 p-12 rounded-2xl text-center space-y-6">
              <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm mb-2">
                <HeartHandshake className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-primary">Our Promise</h2>
              <div className="text-xl text-primary/80 font-medium space-y-2">
                <p>We will never sell your data.</p>
                <p>We will never misuse your information.</p>
                <p>We will always protect your privacy.</p>
              </div>
              <p className="text-muted-foreground max-w-lg mx-auto pt-4">
                If you have questions about security or privacy, our support team is here to help.
              </p>
            </div>

          </div>

          <div className="mt-16 text-center text-muted-foreground font-serif italic">
            Riseora — Built for Trust. Designed for Protection.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
