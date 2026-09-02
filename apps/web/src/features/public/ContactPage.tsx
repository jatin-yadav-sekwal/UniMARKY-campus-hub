import { m } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MapPin, Clock, Send, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        detail: <a href="mailto:jatinyadavsekwal88@gmail.com">jatinyadavsekwal88@gmail.com</a>,
        sub: "We reply within 24 hours",
        gradient: "from-brand-orange to-amber-500",
    },
    {
        icon: MapPin,
        title: "Location",
        detail: "Central University of Haryana",
        sub: "Mahendergarh, Haryana 123031",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Clock,
        title: "Hours",
        detail: "Mon – Sat, 9 AM – 6 PM",
        sub: "IST (Indian Standard Time)",
        gradient: "from-indigo-500 to-violet-500",
    },
];

export function ContactPage() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/5 to-transparent" />
                <div className="container px-4 mx-auto relative text-center">
                    <m.div {...fadeUp}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-sm font-semibold mb-6">
                            <MessageCircle className="w-4 h-4" /> Get In Touch
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-4">
                            We'd Love to{" "}
                            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                Hear From You
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Got a question, feedback, or just want to say hi? We're all ears.
                        </p>
                    </m.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="pb-8">
                <div className="container px-4 mx-auto">
                    <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
                        {contactInfo.map((info, i) => (
                            <m.div
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-background rounded-2xl border border-border/40 p-5 text-center hover:border-border/80 transition-colors"
                            >
                                <div className={`w-11 h-11 mx-auto rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center mb-3`}>
                                    <info.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-brand-navy mb-1">{info.title}</h3>
                                <p className="text-sm font-medium text-foreground">{info.detail}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{info.sub}</p>
                            </m.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            {/* <section className="py-16">
                <div className="container px-4 mx-auto">
                    <div className="max-w-xl mx-auto bg-background rounded-2xl border border-border/40 p-6 sm:p-8">
                        {submitted ? (
                            <m.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                    <Send className="w-7 h-7 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-navy mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground text-sm">
                                    Thanks for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <Button
                                    variant="ghost"
                                    className="mt-4 text-brand-orange"
                                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                                >
                                    Send another message <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </m.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            value={form.name}
                                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@university.edu"
                                            value={form.email}
                                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="What's this about?"
                                        value={form.subject}
                                        onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Tell us everything..."
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        value={form.message}
                                        onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-brand-orange to-amber-500 text-white hover:opacity-90 transition-opacity">
                                    <Send className="w-4 h-4 mr-2" /> Send Message
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section> */}

            <Footer />
        </div>
    );
}
