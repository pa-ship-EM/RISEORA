import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Briefcase, Users, Shield, Lock } from "lucide-react";
import logoIcon from "@/assets/logo.png";

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
                            Empowering individuals to take control of their financial future through credit education and dispute document preparation tools.
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
                            <li><Link href="/partnerships" className="hover:text-white transition-colors flex items-center gap-2"><Users className="h-3 w-3 text-secondary" /> B2B Opportunities</Link></li>
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
                        <h4 className="font-serif font-bold text-lg mb-4 text-secondary">Bank-Level Security</h4>
                        <div className="space-y-3 mb-6">
                            <Link href="/security" className="group block">
                                <div className="flex items-center gap-2 mb-1 text-green-400">
                                    <Shield className="h-4 w-4" />
                                    <span className="font-semibold text-sm">AES-256 Encrypted</span>
                                </div>
                                <p className="text-xs text-primary-foreground/70 group-hover:text-white transition-colors">
                                    Data encrypted at rest & in transit.
                                </p>
                            </Link>
                            <Link href="/security" className="group block">
                                <div className="flex items-center gap-2 mb-1 text-green-400">
                                    <Lock className="h-4 w-4" />
                                    <span className="font-semibold text-sm">Privacy First</span>
                                </div>
                                <p className="text-xs text-primary-foreground/70 group-hover:text-white transition-colors">
                                    We never sell your personal data.
                                </p>
                            </Link>
                        </div>
                        <div className="flex gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/10 pt-8 mt-12">
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-primary-foreground/80">
                            <h4 className="font-bold text-sm text-secondary mb-3 uppercase tracking-wider">Critical Platform Disclosures</h4>
                            <div className="grid md:grid-cols-2 gap-6 text-[11px] leading-relaxed opacity-90">
                                <div className="space-y-2">
                                    <p>
                                        <strong>Educational Model:</strong> RiseOra is a credit education and financial literacy platform. We provide software-driven self-help tools and information regarding credit reporting standards. We do NOT provide credit repair services.
                                    </p>
                                    <p>
                                        <strong>No Agency:</strong> We do not act on your behalf or as your agent. We do not submit, transmit, or mail disputes to credit bureaus or data furnishers. All document submission is the sole responsibility of the consumer.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p>
                                        <strong>No Guarantees:</strong> We make no specific promises or guarantees regarding credit score improvements, the removal of any items from a credit report, or any specific financial outcome. Results vary significantly by individual case.
                                    </p>
                                    <p>
                                        <strong>Professional Advice:</strong> Content provided is for informational purposes only and does not constitute legal, financial, or tax advice. Please consult with qualified professionals for specific advice.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
                        <div className="text-center md:text-left">
                            <p>&copy; {new Date().getFullYear()} RiseOra Financial. All rights reserved.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-end">
                            <Link href="/legal" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                            <Link href="/ai-disclosure" className="hover:text-white transition-colors">AI Disclosure</Link>
                            <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link>
                            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
