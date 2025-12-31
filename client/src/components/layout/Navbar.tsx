import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoIcon from "@assets/Screenshot_2025-12-30_at_3.40.28_PM_1767131437717.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services & Pricing" },
    { href: "/resources", label: "Info & Resources" },
    { href: "/about", label: "About Us" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <img src={logoIcon} alt="RiseOra Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
          <span className="text-2xl font-serif font-bold tracking-tight">
            <span className="text-primary">Rise</span>
            <span className="text-secondary">Ora</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="font-semibold">Log In</Button>
            </Link>
            <Link href="/auth?tab=signup">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg animate-in slide-in-from-top-5">
          <div className="flex flex-col p-4 gap-4">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium p-2 rounded-md hover:bg-muted ${
                  isActive(link.href) ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link href="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start">Log In</Button>
            </Link>
            <Link href="/auth?tab=signup" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-start">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
