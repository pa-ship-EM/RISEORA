import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Lock, Eye, Trash2, Globe, Mail, ShieldOff, Activity, AlertTriangle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: January 2026</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Our Commitment to Your Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  RiseOra Financial ("RiseOra," "we," "us," or "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational credit dispute document preparation platform.
                </p>
                <p>
                  By using RiseOra, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-secondary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4>Personal Information You Provide</h4>
                <ul>
                  <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
                  <li><strong>Contact Information:</strong> Address, city, state, and ZIP code for dispute letter generation</li>
                  <li><strong>Identity Verification:</strong> Last 4 digits of Social Security Number (SSN) only—for dispute letter identification</li>
                  <li><strong>Birth Year:</strong> Year of birth only (not full date) for age verification and dispute letter purposes</li>
                  <li><strong>Dispute Information:</strong> Creditor names, account numbers, and dispute reasons you provide</li>
                </ul>

                <h4>Information We Do NOT Collect or Store</h4>
                <ul>
                  <li>Full Social Security Numbers (we only collect last 4 digits)</li>
                  <li>Full date of birth (we only collect birth year)</li>
                  <li>Complete credit reports</li>
                  <li>Bank account or payment card numbers (payments processed securely via Stripe)</li>
                </ul>

                <h4>Automatically Collected Information</h4>
                <ul>
                  <li>Device and browser information</li>
                  <li>IP address and general location data</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Session duration and page views</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-secondary" />
                  How We Protect Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We implement industry-leading security measures to protect your sensitive information:</p>
                <ul>
                  <li><strong>AES-256-GCM Encryption:</strong> All sensitive personal data (address, DOB, SSN last 4) is encrypted at rest using military-grade encryption</li>
                  <li><strong>TLS/SSL Encryption:</strong> All data transmitted between your browser and our servers is encrypted in transit</li>
                  <li><strong>Role-Based Access Control:</strong> Only authorized personnel with legitimate business needs can access user data</li>
                  <li><strong>Secure Password Storage:</strong> Passwords are hashed using bcrypt with salt, never stored in plain text</li>
                  <li><strong>Regular Security Audits:</strong> We conduct ongoing security assessments and vulnerability testing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldOff className="h-5 w-5 text-green-600" />
                  We Do NOT Sell Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-lg font-medium text-green-800">
                  RiseOra will never sell, rent, lease, or trade your personal information to any third party for their marketing or commercial purposes.
                </p>
                <p>This commitment means:</p>
                <ul>
                  <li>Your data is used solely to provide and improve our services to you</li>
                  <li>We do not participate in data broker networks or data selling arrangements</li>
                  <li>We do not share your information with advertisers for targeted advertising</li>
                  <li>We do not monetize your personal data in any way other than providing you direct service</li>
                  <li>If this policy ever changes, we will provide explicit notice and obtain your consent</li>
                </ul>
                <p className="font-medium">Your trust is our priority. Your data belongs to you—not to advertisers, marketers, or data brokers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>To protect your information and our platform, we implement continuous security monitoring:</p>
                <ul>
                  <li><strong>Access Logging:</strong> All system access is logged with timestamps, IP addresses, and actions taken</li>
                  <li><strong>Anomaly Detection:</strong> We monitor for unusual activity patterns that may indicate unauthorized access attempts</li>
                  <li><strong>Real-Time Alerts:</strong> Security events trigger immediate notifications to our security team</li>
                  <li><strong>Device Inventory:</strong> IoT and network devices are tracked and monitored for security compliance</li>
                  <li><strong>Audit Trails:</strong> Complete audit logs are maintained for all user and administrative actions</li>
                </ul>
                <p>This monitoring is designed to protect your account and data, not to track your personal activities for marketing purposes.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-secondary" />
                  Incident Response
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>In the event of a security incident that affects your personal data, we are committed to:</p>
                
                <h4>Detection & Containment</h4>
                <ul>
                  <li>Immediate investigation of any suspected security breach</li>
                  <li>Rapid containment measures to prevent further unauthorized access</li>
                  <li>Preservation of evidence for forensic analysis</li>
                </ul>

                <h4>Notification</h4>
                <ul>
                  <li>Prompt notification to affected users within 72 hours of confirmed breach discovery</li>
                  <li>Clear communication about what information was affected</li>
                  <li>Guidance on steps you can take to protect yourself</li>
                  <li>Notification to relevant regulatory authorities as required by law</li>
                </ul>

                <h4>Remediation</h4>
                <ul>
                  <li>Root cause analysis to prevent future incidents</li>
                  <li>Implementation of additional security controls where needed</li>
                  <li>Ongoing monitoring for any related suspicious activity</li>
                  <li>Free credit monitoring services for affected users when appropriate</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-secondary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We use your information solely for the following purposes:</p>
                <ul>
                  <li>To provide and maintain our educational credit dispute document preparation services</li>
                  <li>To generate personalized dispute letter templates for your use</li>
                  <li>To send service-related notifications and deadline reminders</li>
                  <li>To process subscription payments (via secure third-party payment processors)</li>
                  <li>To improve our platform and develop new educational features</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To comply with legal obligations</li>
                </ul>

                <h4>What We Do NOT Do</h4>
                <ul>
                  <li>We do NOT sell your personal information to third parties</li>
                  <li>We do NOT share your data with advertisers</li>
                  <li>We do NOT submit disputes on your behalf (all submissions are user-directed)</li>
                  <li>We do NOT access or store your full credit reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-secondary" />
                  Data Retention & Deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4>Retention Period</h4>
                <p>We retain your personal information for as long as your account is active or as needed to provide you services. Dispute records are retained for 7 years to comply with record-keeping requirements and to assist with potential follow-up actions.</p>

                <h4>Your Right to Delete</h4>
                <p>You may request deletion of your account and associated personal data at any time by:</p>
                <ul>
                  <li>Contacting us at <a href="mailto:support@riseora.org" className="text-secondary">support@riseora.org</a></li>
                  <li>Using the account deletion feature in your dashboard settings (when available)</li>
                </ul>
                <p>Upon receiving a valid deletion request, we will:</p>
                <ul>
                  <li>Delete your account and personal information within 30 days</li>
                  <li>Retain only anonymized, aggregated data that cannot identify you</li>
                  <li>Retain records required by law for the legally mandated period</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-secondary" />
                  Your Privacy Rights (CCPA/GDPR)
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>Depending on your location, you may have the following rights regarding your personal data:</p>

                <h4>California Residents (CCPA)</h4>
                <ul>
                  <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we collect</li>
                  <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                  <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
                  <li><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information (note: we do not sell personal information)</li>
                </ul>

                <h4>European Residents (GDPR)</h4>
                <ul>
                  <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Data Portability:</strong> Request your data in a machine-readable format</li>
                  <li><strong>Right to Object:</strong> Object to certain processing of your data</li>
                </ul>

                <p>To exercise any of these rights, contact us at <a href="mailto:support@riseora.org" className="text-secondary">support@riseora.org</a>.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-secondary" />
                  Email & Communication Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4>CAN-SPAM Compliance</h4>
                <p>We comply with the CAN-SPAM Act. Our marketing emails will:</p>
                <ul>
                  <li>Clearly identify the sender as RiseOra</li>
                  <li>Include our physical mailing address</li>
                  <li>Provide a clear unsubscribe mechanism</li>
                  <li>Honor opt-out requests within 10 business days</li>
                </ul>

                <h4>Transactional Emails</h4>
                <p>Even after opting out of marketing emails, you will continue to receive essential service communications such as:</p>
                <ul>
                  <li>Dispute deadline reminders</li>
                  <li>Account security notifications</li>
                  <li>Billing and subscription updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We use the following third-party services that may have access to limited user data:</p>
                <ul>
                  <li><strong>Stripe:</strong> Payment processing (we do not store your payment card details)</li>
                  <li><strong>OpenAI:</strong> AI-powered educational guidance generation (no personal identifiers shared)</li>
                </ul>
                <p>Each third-party service operates under their own privacy policies, and we encourage you to review them.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
                <ul>
                  <li>Posting the new policy on this page with an updated "Last Updated" date</li>
                  <li>Sending an email notification for significant changes</li>
                </ul>
                <p>Your continued use of RiseOra after changes are posted constitutes acceptance of the updated policy.</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="space-y-2 text-primary-foreground/90">
                  <p><strong>Email:</strong> <a href="mailto:support@riseora.org" className="text-secondary hover:underline">support@riseora.org</a></p>
                  <p><strong>Mail:</strong> RiseOra Financial, 5820 E WT Harris Blvd, Ste 109 PMB 1100, Charlotte, NC 28215</p>
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
