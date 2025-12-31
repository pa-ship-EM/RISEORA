import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Briefcase } from "lucide-react";
import logoIcon from "@assets/Screenshot_2025-12-30_at_3.40.28_PM_1767131437717.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="bg-white p-1 rounded-sm">
                <img src={logoIcon} alt="RiseOra Logo" className="h-10 w-auto object-contain" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-white">
                <span>Rise</span>
                <span className="text-secondary">Ora</span>
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Empowering individuals to take control of their financial future through expert credit repair and education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-secondary">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services & Pricing</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">Info & Resources</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/investors" className="hover:text-white transition-colors flex items-center gap-2"><Briefcase className="h-3 w-3" /> Investors</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-secondary">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-secondary shrink-0 mt-1" />
                <span>
                  5820 E WT Harris Blvd<br />
                  Ste 109 PMB 1100<br />
                  Charlotte, NC 28215 United States
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                <a href="tel:8283779388" className="hover:text-white transition-colors">(828) 377-9388</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                <a href="mailto:support@riseora.org" className="hover:text-white transition-colors">support@riseora.org</a>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-secondary">Secure & Safe</h4>
            <p className="text-xs text-primary-foreground/70 mb-4">
              Your data is protected with bank-level 256-bit encryption. We prioritize your privacy and security above all else.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders */}
               <Facebook className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
               <Twitter className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
               <Instagram className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
               <Linkedin className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
          <div className="max-w-md text-center md:text-left space-y-2">
            <p>&copy; {new Date().getFullYear()} RiseOra Financial. All rights reserved.</p>
            <p className="italic opacity-80">
              RiseOra provides educational tools and guided support only. We do not submit disputes on behalf of consumers. Results vary. No guarantees are made.
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-white transition-colors">Legal & Terms</Link>
            <Link href="/legal" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal" className="hover:text-white transition-colors">CROA Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
