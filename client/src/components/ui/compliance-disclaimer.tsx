import React from "react";
import { AlertCircle, Shield } from "lucide-react";
import { Link } from "wouter";

interface ComplianceDisclaimerProps {
  variant?: "full" | "compact" | "inline";
  showLinks?: boolean;
}

export function ComplianceDisclaimer({ variant = "compact", showLinks = true }: ComplianceDisclaimerProps) {
  if (variant === "inline") {
    return (
      <p className="text-xs text-slate-500 italic" data-testid="compliance-disclaimer-inline">
        For educational purposes only — not legal advice. No guarantees are made regarding outcomes.
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600" data-testid="compliance-disclaimer-compact">
        <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-slate-700">Educational Use Only</p>
          <p className="mt-1">
            This is an educational tool — not legal advice. RiseOra does not submit disputes on your behalf and makes no guarantees regarding outcomes.
            {showLinks && (
              <span className="ml-1">
                <Link href="/legal" className="text-primary hover:underline">Terms</Link>
                {" | "}
                <Link href="/ai-disclosure" className="text-primary hover:underline">AI Disclosure</Link>
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl" data-testid="compliance-disclaimer-full">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900 space-y-2">
          <p className="font-semibold">Important Disclosures</p>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            <li><strong>Educational Purposes Only:</strong> All content and tools are for educational purposes only and do not constitute legal advice.</li>
            <li><strong>No Credit Repair Service:</strong> RiseOra is a document preparation and educational platform — we do not submit disputes on your behalf.</li>
            <li><strong>No Guarantees:</strong> We make no promises or guarantees regarding credit score changes or dispute outcomes.</li>
            <li><strong>Self-Service:</strong> You are responsible for reviewing, customizing, and submitting any documents you create.</li>
          </ul>
          {showLinks && (
            <p className="pt-2 text-xs">
              Learn more: <Link href="/legal" className="font-medium underline">Terms of Service</Link>
              {" | "}
              <Link href="/privacy" className="font-medium underline">Privacy Policy</Link>
              {" | "}
              <Link href="/ai-disclosure" className="font-medium underline">AI Disclosure</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialDisclosure() {
  return (
    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100" data-testid="testimonial-disclosure">
      <strong>Disclosure:</strong> Results vary. Individual experiences are not typical and do not guarantee similar outcomes. Some testimonials may be from affiliates or compensated reviewers.
    </p>
  );
}
