import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Shield, Settings, BarChart3, Lock } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Cookie className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last Updated: January 2026</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-secondary" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information.
                </p>
                <p>
                  This Cookie Policy explains how RiseOra Financial ("RiseOra," "we," "us," or "our") uses cookies and similar technologies on our website and platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4>1. Essential Cookies (Strictly Necessary)</h4>
                <p>
                  These cookies are required for the basic functionality of our platform. Without them, the website cannot function properly. They include:
                </p>
                <ul>
                  <li><strong>Session Cookies:</strong> Maintain your login session as you navigate the platform</li>
                  <li><strong>Security Cookies:</strong> Help protect against unauthorized access and cross-site request forgery (CSRF)</li>
                  <li><strong>Preference Cookies:</strong> Remember your language and display preferences</li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  These cookies cannot be disabled as they are essential for the website to work.
                </p>

                <h4>2. Functional Cookies</h4>
                <p>
                  These cookies enhance your experience by remembering choices you make:
                </p>
                <ul>
                  <li>Remembering your theme preference (light/dark mode)</li>
                  <li>Saving partially completed forms</li>
                  <li>Remembering notification preferences</li>
                </ul>

                <h4>3. Analytics Cookies</h4>
                <p>
                  We may use analytics cookies to understand how visitors interact with our website:
                </p>
                <ul>
                  <li>Pages visited and time spent on each page</li>
                  <li>Features used most frequently</li>
                  <li>Error messages encountered</li>
                </ul>
                <p>
                  This information is aggregated and anonymized—we cannot identify individual users through analytics data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-secondary" />
                  Cookies We Do NOT Use
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>RiseOra does NOT use:</p>
                <ul>
                  <li><strong>Third-Party Advertising Cookies:</strong> We do not display third-party advertisements or use advertising cookies</li>
                  <li><strong>Cross-Site Tracking Cookies:</strong> We do not track your browsing activity across other websites</li>
                  <li><strong>Social Media Tracking Pixels:</strong> We do not embed tracking pixels from social media platforms</li>
                  <li><strong>Data Broker Cookies:</strong> We do not share cookie data with data brokers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  Cookie Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Cookie Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Type</th>
                        <th className="text-left py-3 px-4 font-semibold">Purpose</th>
                        <th className="text-left py-3 px-4 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 px-4 font-mono text-xs">connect.sid</td>
                        <td className="py-3 px-4">Essential</td>
                        <td className="py-3 px-4">Session authentication</td>
                        <td className="py-3 px-4">7 days</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-xs">csrf_token</td>
                        <td className="py-3 px-4">Essential</td>
                        <td className="py-3 px-4">Security protection</td>
                        <td className="py-3 px-4">Session</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-xs">theme</td>
                        <td className="py-3 px-4">Functional</td>
                        <td className="py-3 px-4">Remember display preference</td>
                        <td className="py-3 px-4">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-secondary" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4>Browser Settings</h4>
                <p>
                  Most web browsers allow you to control cookies through their settings. You can typically:
                </p>
                <ul>
                  <li>View what cookies are stored on your device</li>
                  <li>Delete all or specific cookies</li>
                  <li>Block all cookies or cookies from specific sites</li>
                  <li>Set preferences for first-party vs. third-party cookies</li>
                </ul>

                <h4>Browser-Specific Instructions</h4>
                <ul>
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>

                <h4>Impact of Disabling Cookies</h4>
                <p>
                  Please note that disabling essential cookies will affect the functionality of RiseOra:
                </p>
                <ul>
                  <li>You may not be able to log in or stay logged in</li>
                  <li>Some features may not work correctly</li>
                  <li>Your preferences may not be saved between sessions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Technologies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>In addition to cookies, we may use similar technologies:</p>
                <ul>
                  <li><strong>Local Storage:</strong> Used to store preferences and temporary data in your browser</li>
                  <li><strong>Session Storage:</strong> Temporary storage that is cleared when you close your browser tab</li>
                </ul>
                <p>
                  These technologies serve similar purposes to cookies and are subject to the same privacy considerations outlined in this policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. The "Last Updated" date at the top of this page indicates when this policy was last revised.
                </p>
                <p>
                  We encourage you to review this policy periodically to stay informed about our use of cookies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white">
              <CardHeader>
                <CardTitle>Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">If you have questions about our use of cookies, please contact us:</p>
                <div className="space-y-2 text-primary-foreground/90">
                  <p><strong>Email:</strong> <a href="mailto:support@riseora.org" className="text-secondary hover:underline">support@riseora.org</a></p>
                  <p><strong>Subject Line:</strong> "Cookie Policy Question"</p>
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
