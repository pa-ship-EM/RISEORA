import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ComplianceDisclaimer } from "@/components/ui/compliance-disclaimer";
import { CheckCircle2, TrendingUp, Shield, ArrowRight, Users, Wand2, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero.png";
import wizardLogo from "@/assets/wizard.png";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Compliance Header Banner */}
            <div className="bg-[#FEF3C7] border-b border-[#F59E0B]/20 py-2">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-[12px] md:text-sm font-medium text-[#92400E]">
                        ⚖️ <span className="font-bold">Educational Information Only:</span> RiseOra is a credit education and financial literacy platform. <span className="hidden md:inline">We do not provide credit repair services, and we do not dispute items on your behalf.</span>
                    </p>
                </div>
            </div>

            {/* Hero Section - Modern UI/UX */}
            <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
                {/* Animated Gradient Mesh Background */}
                <div className="absolute inset-0 z-0 gradient-mesh">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,122,127,0.2),transparent_50%)] animate-pulse-slow" />
                </div>

                {/* Floating Glassmorphic Orbs */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-secondary-foreground text-sm font-semibold mb-6 border border-white/30 shadow-lg animate-scale-in">
                                <img src={wizardLogo} alt="Wizard" className="h-5 w-auto" />
                                Introducing the Dispute Wizard™ (Beta)
                            </div>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
                                <span className="gradient-text-vibrant">Tools to Help You Prepare Your</span>
                                <br />
                                <span className="text-primary">Credit Report Dispute Documents.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                                RiseOra uses intelligent workflows to assist you in identifying potential errors and preparing consumer dispute letters.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/auth?tab=signup">
                                    <Button size="lg" className="relative overflow-hidden text-lg px-8 h-14 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#F1D27A] text-navy-dark shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 hover:scale-105 group font-bold">
                                        <span className="relative z-10">Join Beta Program</span>
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </Button>
                                </Link>
                                <Link href="/services">
                                    <Button variant="outline" size="lg" className="text-lg px-8 h-14 glass border-gold/30 hover:bg-gold/10 hover:scale-105 transition-all duration-300 shadow-lg text-gold">
                                        Early Access Pricing
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden md:block relative"
                        >
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                                <img src={heroImage} alt="Professional Financial Freedom" className="w-full h-auto" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Why Use The Dispute Wizard™?</h2>
                        <p className="text-muted-foreground">We combine industry reporting standards with automated precision to streamline document preparation.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Shield className="h-10 w-10 text-secondary" />}
                            title="Metro 2® Standards"
                            description="Metro 2® is an industry reporting standard. RiseOra provides educational tools that help users understand how information is typically formatted."
                        />
                        <FeatureCard
                            icon={<Wand2 className="h-10 w-10 text-secondary" />}
                            title="Guided Dispute Drafting"
                            description="Our Dispute Wizard™ helps identify potential errors and generates dispute letter drafts based on consumer reporting standards."
                        />
                        <FeatureCard
                            icon={<Users className="h-10 w-10 text-secondary" />}
                            title="Quality Checks"
                            description="System checks for completeness and formatting consistency before document finalization."
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#112240] text-gold border-y border-gold/10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gold/10">
                        <Stat number="10k+" label="Documents Prepared" />
                        <Stat number="50k+" label="Consumer Records Reviewed" />
                        <Stat number="High" label="User Completion Rate" />
                        <Stat number="24/7" label="Client Portal" />
                    </div>
                </div>
            </section>

            {/* Resources Teaser Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row items-center justify-between gap-12"
                    >
                        <div className="md:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-semibold border border-secondary/20">
                                <BookOpen className="h-4 w-4" />
                                Free Educational Hub
                            </div>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary leading-tight">
                                Master Your Credit with <br />
                                <span className="text-secondary">Expert Resources.</span>
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                                We believe in an education-first model. Access our library of guides, tools, and regulatory information from the FTC to understand your rights and build lasting financial health.
                            </p>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                <div className="flex items-center gap-2 group cursor-default">
                                    <div className="p-1 rounded bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-primary/80">FTC Verified Guides</span>
                                </div>
                                <div className="flex items-center gap-2 group cursor-default">
                                    <div className="p-1 rounded bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-primary/80">Metro 2 Standards</span>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Link href="/resources">
                                    <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-10 h-14 text-lg shadow-xl shadow-primary/10 transition-all hover:scale-105 group">
                                        Explore Learning Center <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 text-secondary">
                                    <BookOpen className="h-8 w-8" />
                                </div>
                                <h4 className="text-xl font-bold text-primary mb-3">Understand Credit</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Official FTC guidance on your scores and rights.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 sm:mt-12">
                                <div className="w-14 h-14 rounded-xl bg-secondary/10 shadow-sm flex items-center justify-center mb-6 text-secondary">
                                    <TrendingUp className="h-8 w-8" />
                                </div>
                                <h4 className="text-xl font-bold text-primary mb-3">Score Building</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Strategic methods to improve your history.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section - Modern */}
            <section className="relative py-24 overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-cyan-50" />
                <div className="absolute inset-0 gradient-mesh opacity-50" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                            <span className="gradient-text">Ready to take control of your credit report?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Start with our basic plan at just $49/mo and access guided dispute preparation tools.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/auth?tab=signup">
                                <Button size="lg" className="relative overflow-hidden text-lg px-10 h-14 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#F1D27A] text-navy-dark font-bold shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/50 w-full sm:w-auto transition-all duration-300 hover:scale-105 group">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Early Access <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-8 max-w-xl mx-auto">
                            <ComplianceDisclaimer variant="compact" />
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group relative p-8 rounded-2xl glass-card border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="relative z-10">
                <div className="mb-6 bg-gradient-to-br from-violet-100 to-cyan-100 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:gradient-text transition-all duration-300">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function Stat({ number, label }: { number: string, label: string }) {
    return (
        <div className="p-4">
            <div className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-2">{number}</div>
            <div className="text-primary-foreground/70 font-medium">{label}</div>
        </div>
    );
}
