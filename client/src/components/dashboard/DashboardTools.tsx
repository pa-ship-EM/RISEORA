import React from "react";
import { ExternalLink, Info } from "lucide-react";

const dashboardResources = [
  {
    name: "Credit Karma",
    url: "https://www.creditkarma.com/r/your-affiliate-code",
    description: "Monitor your credit for free and get insights."
  },
  {
    name: "Experian Boost",
    url: "https://www.experian.com/boost?ref=your-code",
    description: "Increase your credit score using Experian Boost."
  },
  {
    name: "Chime Bank",
    url: "https://www.chime.com/?ref=your-affiliate-code",
    description: "No-fee banking and early direct deposit."
  },
  {
    name: "NerdWallet Credit Tools",
    url: "https://www.nerdwallet.com/best/credit-cards?ref=your-code",
    description: "Compare credit cards and track rewards."
  }
];

export default function DashboardTools() {
  return (
    <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">Tools & Resources</h2>
        <p className="mt-3 text-slate-600 text-sm md:text-base leading-relaxed">
          Access our curated list of educational resources and recommended products. Some links are affiliate links. We may earn a commission at no extra cost to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {dashboardResources.map((res) => (
          <div
            key={res.name}
            className="group p-5 md:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-secondary/50 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base md:text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">{res.name}</h3>
              <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-secondary transition-colors shrink-0" />
            </div>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed flex-grow">{res.description}</p>
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-primary underline underline-offset-4 decoration-secondary/30 hover:decoration-secondary transition-all mt-auto inline-flex items-center gap-1"
            >
              Learn More (Beta)
            </a>
          </div>
        ))}
      </div>

      <div className="flex gap-3 p-4 bg-white/50 rounded-xl border border-slate-200 text-slate-500 text-[10px] md:text-xs italic leading-relaxed">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          RiseOra provides educational tools and guidance. We do not submit disputes for you and cannot guarantee outcomes. Affiliate links may provide a commission at no extra cost to you.
        </p>
      </div>
    </section>
  );
}
