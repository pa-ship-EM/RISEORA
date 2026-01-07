import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, AlertTriangle, Shield, BookOpen, MessageSquare, Scale } from "lucide-react";

export default function AIDisclosure() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Bot className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">AI Usage Disclosure</h1>
            <p className="text-muted-foreground">Transparency About Artificial Intelligence in RiseOra</p>
          </div>

          <div className="space-y-8">
            <Card className="border-l-4 border-l-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <AlertTriangle className="h-5 w-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-900">
                <p className="text-lg font-medium">
                  RiseOra uses artificial intelligence (AI) to assist with educational content generation. All AI-generated outputs are informational and educational in nature—they do not constitute legal advice, financial advice, or credit repair services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-secondary" />
                  How We Use AI
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>RiseOra incorporates AI technology in the following ways:</p>
                
                <h4>1. Dispute Letter Generation (Dispute Wizard™)</h4>
                <p>
                  Our AI assists in generating dispute letter templates based on information you provide. These templates are educational starting points that you can customize before use. The AI helps format letters according to Metro 2® industry standards, but the final content and submission is entirely your responsibility.
                </p>

                <h4>2. Educational Guidance</h4>
                <p>
                  For GROWTH and COMPLIANCE_PLUS tier subscribers, AI generates educational guidance about:
                </p>
                <ul>
                  <li>Your FCRA rights and how they apply to your situation</li>
                  <li>Suggested next steps based on dispute status</li>
                  <li>Follow-up letter templates for continued education</li>
                </ul>

                <h4>3. Deadline Reminders</h4>
                <p>
                  AI helps generate personalized notification messages to remind you of important dispute deadlines and suggested follow-up actions.
                </p>

                <h4>4. Content Validation</h4>
                <p>
                  Our AI-powered guardrails review dispute narratives to help ensure compliance with FCRA language requirements and to flag potentially problematic content before you submit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  AI Safety Guardrails
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We implement multiple safety measures to ensure AI outputs remain educational and compliant:</p>
                
                <ul>
                  <li><strong>Forbidden Terms Filter:</strong> AI is prevented from using language that implies guarantees, legal threats, or credit repair promises</li>
                  <li><strong>Compliance Validation:</strong> All AI-generated letters are checked for FCRA-compliant language</li>
                  <li><strong>Data Minimization:</strong> Sensitive personal information (SSN, DOB) is detected and handled appropriately—never shared with external AI services in identifiable form</li>
                  <li><strong>Human Review Encouraged:</strong> Users are always encouraged to review and customize AI outputs before use</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  Limitations of AI
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>It is important to understand the limitations of AI-generated content:</p>
                
                <ul>
                  <li><strong>Not Legal Advice:</strong> AI outputs are educational information, not legal advice. For legal matters, consult a licensed attorney.</li>
                  <li><strong>Not Guaranteed Accurate:</strong> While we strive for accuracy, AI may occasionally produce incorrect or outdated information. Always verify important details.</li>
                  <li><strong>Not a Substitute for Professional Guidance:</strong> Complex financial or credit situations may require professional consultation.</li>
                  <li><strong>No Outcome Guarantees:</strong> AI-assisted dispute preparation does not guarantee any specific outcome with credit bureaus or creditors.</li>
                  <li><strong>User Responsibility:</strong> You are responsible for reviewing, customizing, and submitting any dispute documents. RiseOra does not submit disputes on your behalf.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-secondary" />
                  AI Output Labeling
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>Throughout the RiseOra platform, AI-generated content is identified through:</p>
                
                <ul>
                  <li>Clear labels such as "AI-Generated Guidance" or "AI-Assisted Template"</li>
                  <li>Educational disclaimers accompanying AI outputs</li>
                  <li>Prompts to review and customize before use</li>
                </ul>

                <p>
                  We believe in transparency. You should always know when you're interacting with AI-generated content versus human-created content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-secondary" />
                  Your Rights Regarding AI
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>As a RiseOra user, you have the right to:</p>
                
                <ul>
                  <li><strong>Opt Out:</strong> Choose not to use AI-generated features (manual letter templates are available)</li>
                  <li><strong>Modify:</strong> Edit any AI-generated content before use</li>
                  <li><strong>Question:</strong> Ask our support team about how AI is used in any feature</li>
                  <li><strong>Feedback:</strong> Report any AI outputs that seem incorrect, inappropriate, or concerning</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party AI Services</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  RiseOra uses OpenAI's API for certain AI-powered features. When using these features:
                </p>
                <ul>
                  <li>No personally identifiable information (such as your name, SSN, or address) is shared with OpenAI in a way that identifies you</li>
                  <li>Dispute context and educational queries are processed to generate helpful responses</li>
                  <li>OpenAI's usage policies and privacy practices apply to their processing of queries</li>
                </ul>
                <p>
                  For more information about OpenAI's practices, visit their privacy policy at <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-secondary">openai.com/privacy</a>.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white">
              <CardHeader>
                <CardTitle>Questions About AI?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">If you have questions or concerns about how AI is used in RiseOra, we're here to help:</p>
                <div className="space-y-2 text-primary-foreground/90">
                  <p><strong>Email:</strong> <a href="mailto:support@riseora.org" className="text-secondary hover:underline">support@riseora.org</a></p>
                  <p><strong>Subject Line:</strong> "AI Usage Question"</p>
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
