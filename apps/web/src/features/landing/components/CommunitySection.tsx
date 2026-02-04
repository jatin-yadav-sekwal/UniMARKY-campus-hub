import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
    {
        name: "Sarah Jenkins",
        role: "Computer Science, Year 2",
        text: "Unmarky saved me so much time finding textbooks. The verification makes it feel actually safe.",
        initials: "SJ"
    },
    {
        name: "David Chen",
        role: "Business, Year 3",
        text: "Finally a platform that feels like it was built for us. The UI is stunning and it just works.",
        initials: "DC"
    },
    {
        name: "Amara Okeke",
        role: "Fine Arts, Year 1",
        text: "Found my roommate through the Housing portal. Best decision ever!",
        initials: "AO"
    },
    {
        name: "Marcus Wright",
        role: "Engineering, Year 4",
        text: "The lost and found feature actually helped me find my calculator. Lifesaver.",
        initials: "MW"
    },
    {
        name: "Priya Patel",
        role: "Medicine, Year 2",
        text: "Love the food recommendations. Found hidden gems I didn't know existed.",
        initials: "PP"
    }
];

export function CommunitySection() {
    return (
        <section id="community" className="py-20 overflow-hidden bg-background border-t border-border/40">
            <div className="container px-4 mx-auto mb-12 text-center">
                <h4 className="text-sm font-bold tracking-widest text-brand-blue uppercase mb-4">COMMUNITY</h4>
                <h2 className="text-3xl md:text-4xl font-black text-brand-navy tracking-tight">What Students Are Saying</h2>
            </div>

            <div className="flex relative w-full">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

                <motion.div
                    className="flex gap-6 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear"
                    }}
                >
                    {[...reviews, ...reviews, ...reviews].map((review, i) => (
                        <Card key={i} className="w-[350px] md:w-[400px] flex-shrink-0 bg-muted/20 border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar>
                                        <AvatarFallback className="bg-brand-navy text-white font-bold">{review.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{review.name}</p>
                                        <p className="text-xs text-muted-foreground">{review.role}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground italic leading-relaxed whitespace-normal">
                                    "{review.text}"
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
