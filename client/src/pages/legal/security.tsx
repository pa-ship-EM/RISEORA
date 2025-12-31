import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Shield, Lock, CreditCard, Server, Eye, FileKey, CheckCircle } from "lucide-react";

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
            Bank-Level Security Framework
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your data security is our top priority. We employ the same rigorous encryption and protection standards used by leading financial institutions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          
          <div className="grid gap-12">
            {/* 1. Data Encryption */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-6 flex-1">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">1. Data Encryption (Non-Negotiable)</h2>
                    <p className="text-muted-foreground">
                      We use military-grade encryption to ensure your sensitive personal information remains private and secure at all times.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Server className="h-4 w-4 text-secondary" /> At Rest
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span><strong>AES-256 encryption</strong> for all stored data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Encrypted fields: DOB, Address, SSN (Last 4)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Encrypted object storage for PDFs & evidence</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-secondary" /> In Transit
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span><strong>TLS 1.3</strong> for all web traffic</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>HTTPS enforced strictly (no HTTP fallback)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>HSTS (HTTP Strict Transport Security) enabled</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Authentication */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <FileKey className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-6 flex-1">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">2. Authentication & Access Control</h2>
                    <p className="text-muted-foreground">
                      Our platform ensures that you are the only one who can access your personal disputes and documents.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Secure Authentication</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Salted + hashed passwords (Bcrypt/Argon2)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Secure session token rotation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Multi-factor authentication ready</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Strict Access Control</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span><strong>Role-Based Access Control (RBAC)</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Private Isolation: Users strictly see only their own data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Admin access is fully isolated and audited</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Security */}
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-lg shrink-0">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-6 flex-1">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">3. Payment Security (Powered by Stripe)</h2>
                    <p className="text-muted-foreground">
                      We partner with Stripe to ensure your financial data never touches our servers directly.
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <strong>Stripe Handles Everything:</strong> Riseora never stores card numbers, CVV codes, or expiration dates.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <strong>PCI-DSS Compliant:</strong> Our payment infrastructure meets the highest certification standards.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <strong>Secure Webhooks:</strong> All transaction events are verified with cryptographic signature validation.
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t flex items-center gap-4 opacity-70">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                    <span className="text-xs text-muted-foreground">Official Payment Partner</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-16 text-center text-muted-foreground text-sm max-w-2xl mx-auto">
            <p>
              Security is an ongoing process. We regularly audit our systems to ensure they meet the evolving standards of the financial industry.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
