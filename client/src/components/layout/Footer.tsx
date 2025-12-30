import { Link } from "wouter";
import { ShieldCheck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-serif font-bold text-2xl text-white">
              <ShieldCheck className="h-8 w-8 text-secondary" />
              <span>RiseOra</span>
            </div>
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
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                <a href="mailto:support@riseora.org" className="hover:text-white transition-colors">support@riseora.org</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>123 Financial District, NY</span>
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
