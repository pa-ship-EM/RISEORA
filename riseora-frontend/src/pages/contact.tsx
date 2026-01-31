import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";

const contactSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);

        toast({
            title: "Message Sent!",
            description: "We've received your inquiry and will get back to you within 24-48 business hours.",
        });
        reset();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Get in Touch</h1>
                        <p className="text-xl text-muted-foreground">
                            Have questions? We're here to help you on your journey to financial freedom.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
                        >
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                                <Send className="h-5 w-5 text-secondary" /> Send a Message
                            </h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input id="name" placeholder="John Doe" {...register("name")} />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                                        <Input id="phone" placeholder="(555) 000-0000" {...register("phone")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input id="subject" placeholder="General Inquiry" {...register("subject")} />
                                        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us how we can help..."
                                        className="min-h-[150px]"
                                        {...register("message")}
                                    />
                                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Submit Message"}
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    * Required fields. We value your privacy and never share your details.
                                </p>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <ContactInfoCard
                                icon={<MapPin className="h-6 w-6 text-secondary" />}
                                title="Office Address"
                                content="5820 E WT Harris Blvd, Ste 109 PMB 1100, Charlotte, NC 28215, United States"
                            />
                            <ContactInfoCard
                                icon={<Phone className="h-6 w-6 text-secondary" />}
                                title="Phone Support"
                                content="(828) 377-9388"
                                subtext="Monday - Friday, 9:00 AM - 6:00 PM EST"
                            />
                            <ContactInfoCard
                                icon={<Mail className="h-6 w-6 text-secondary" />}
                                title="Email Inquiry"
                                content="support@riseora.org"
                                subtext="Response time: 24-48 business hours"
                            />
                            <ContactInfoCard
                                icon={<Clock className="h-6 w-6 text-secondary" />}
                                title="Business Hours"
                                content="Mon - Fri: 9:00 AM - 6:00 PM"
                                subtext="Sat - Sun: Closed"
                            />

                            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary mb-1">Encrypted Communication</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        All communications through this portal are protected with 256-bit bank-level encryption.
                                        Your sensitive information is always handled with the highest security standards.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ContactInfoCard({ icon, title, content, subtext }: { icon: React.ReactNode, title: string, content: string, subtext?: string }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-primary mb-1">{title}</h3>
                <p className="text-slate-700 font-medium leading-relaxed">{content}</p>
                {subtext && <p className="text-sm text-muted-foreground mt-1">{subtext}</p>}
            </div>
        </div>
    );
}
