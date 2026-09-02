import { m } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, Laugh, Info, Heart } from "lucide-react";

type ReviewType = "appreciating" | "funny" | "info";

interface Review {
    name: string;
    dept: string;
    text: string;
    initials: string;
    type: ReviewType;
    stars: number;
}

const typeBadge: Record<ReviewType, { label: string; icon: typeof Star; color: string }> = {
    appreciating: { label: "Love", icon: Heart, color: "text-pink-500 bg-pink-500/10" },
    funny: { label: "Funny", icon: Laugh, color: "text-amber-500 bg-amber-500/10" },
    info: { label: "Helpful", icon: Info, color: "text-blue-500 bg-blue-500/10" },
};

const reviewsRow1: Review[] = [
    {
        name: "Aarav Sharma",
        dept: "CSE, 3rd Year",
        text: "Bhai yeh app ne literally meri life easy kar di. Textbooks mili half price mein, aur seller bhi verified tha. No scam vibes! 🔥",
        initials: "AS",
        type: "appreciating",
        stars: 5,
    },
    {
        name: "Priya Verma",
        dept: "Psychology, 2nd Year",
        text: "Housing section se PG dhundha and it was actually good. Photos real thi, unlike OLX wale uncle 😂",
        initials: "PV",
        type: "funny",
        stars: 5,
    },
    {
        name: "Rohit Meena",
        dept: "Electrical Engg, 4th Year",
        text: "Lost & Found section mein apna calculator post kiya aur 2 din mein mil gaya. Kaafi solid feature hai genuinely.",
        initials: "RM",
        type: "info",
        stars: 4,
    },
    {
        name: "Sneha Gupta",
        dept: "MBA, 1st Year",
        text: "Study section is a goldmine yaar! Previous year papers mil gaye department wise. Ab toh exam prep easy ho gayi 📚",
        initials: "SG",
        type: "appreciating",
        stars: 5,
    },
    {
        name: "Vikram Singh",
        dept: "Biotechnology, 2nd Year",
        text: "Food section mein jo momos wale bhaiya ka stall mila, uski chutney ke liye main roz jaata hu ab 😋",
        initials: "VS",
        type: "funny",
        stars: 5,
    },
    {
        name: "Ananya Joshi",
        dept: "English Lit, 3rd Year",
        text: "Finally ek platform jahan sab kuch ek jagah mil jaata hai. Marketplace, food, housing — sab sorted!",
        initials: "AJ",
        type: "appreciating",
        stars: 5,
    },
];

const reviewsRow2: Review[] = [
    {
        name: "Kunal Thakur",
        dept: "Mechanical Engg, 4th Year",
        text: "Marketplace pe apna purana laptop becha within 3 hours. Buyer bhi college ka hi tha toh trust issue zero 💯",
        initials: "KT",
        type: "info",
        stars: 5,
    },
    {
        name: "Ishita Rani",
        dept: "Pharmacy, 2nd Year",
        text: "Yeh app banane wale ko Nobel Prize do yaar 😂 Itna useful platform pehle kyun nahi tha campus ke liye!",
        initials: "IR",
        type: "funny",
        stars: 5,
    },
    {
        name: "Deepak Kumar",
        dept: "Commerce, 1st Year",
        text: "Notes section mein sessional ke notes mil gaye woh bhi topper ke. Padhai ka scene set ho gaya boss 🎯",
        initials: "DK",
        type: "appreciating",
        stars: 5,
    },
    {
        name: "Riya Choudhary",
        dept: "Fine Arts, 3rd Year",
        text: "Unimedia section mein apne art showcase kiya aur bahut appreciation mili. Real campus social media vibes! 🎨",
        initials: "RC",
        type: "appreciating",
        stars: 4,
    },
    {
        name: "Arjun Patel",
        dept: "CSE, 2nd Year",
        text: "Housing mein PG search karte waqt filter options bahut kaam aaye. Location, price sab set kar sakte ho easily.",
        initials: "AP",
        type: "info",
        stars: 4,
    },
    {
        name: "Kavya Reddy",
        dept: "Law, 1st Year",
        text: "Mera phone gum ho gaya tha campus mein. Lost & Found pe daala aur kisi ne return kar diya next day. Faith in humanity restored 🙏",
        initials: "KR",
        type: "appreciating",
        stars: 5,
    },
];

function ReviewCard({ review }: { review: Review }) {
    const badge = typeBadge[review.type];
    const BadgeIcon = badge.icon;

    return (
        <div className="w-[320px] md:w-[360px] flex-shrink-0 rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors duration-300 p-5 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-brand-navy to-brand-navy/80 text-white text-xs font-bold">
                            {review.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-sm text-foreground leading-tight">{review.name}</p>
                        <p className="text-[11px] text-muted-foreground">{review.dept}</p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.color}`}>
                    <BadgeIcon className="w-3 h-3" />
                    {badge.label}
                </span>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                ))}
            </div>

            {/* Text */}
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-normal">
                "{review.text}"
            </p>
        </div>
    );
}

function TickerRow({ reviews, direction = "left", duration = 35 }: { reviews: Review[]; direction?: "left" | "right"; duration?: number }) {
    const tripled = [
        ...reviews.map(r => ({ ...r, uniqueKey: `c1-${r.name}-${r.dept}` })),
        ...reviews.map(r => ({ ...r, uniqueKey: `c2-${r.name}-${r.dept}` })),
        ...reviews.map(r => ({ ...r, uniqueKey: `c3-${r.name}-${r.dept}` }))
    ];
    const xStart = direction === "left" ? 0 : -1200;
    const xEnd = direction === "left" ? -1200 : 0;

    return (
        <div className="flex relative w-full">
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-background to-transparent z-10" />
            <m.div
                className="flex gap-4 whitespace-nowrap"
                animate={{ x: [xStart, xEnd] }}
                transition={{ repeat: Infinity, duration, ease: "linear" }}
            >
                {tripled.map(review => (
                    <ReviewCard key={review.uniqueKey} review={review} />
                ))}
            </m.div>
        </div>
    );
}

export function CommunitySection() {
    return (
        <section id="community" className="py-20 overflow-hidden bg-background border-t border-border/40">
            <div className="container px-4 mx-auto mb-10 text-center">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h4 className="text-sm font-bold tracking-widest text-brand-blue uppercase mb-3">COMMUNITY</h4>
                    <h2 className="text-3xl md:text-4xl font-black text-brand-navy tracking-tight mb-3">
                        What Students Are Saying
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-sm">
                        Real reviews from real students across the campus. No cap. 💯
                    </p>
                </m.div>

                {/* Stats */}
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center justify-center gap-6 sm:gap-10 mt-6"
                >
                    <div className="text-center">
                        <p className="text-2xl font-black text-brand-navy">2K+</p>
                        <p className="text-[11px] text-muted-foreground">Active Users</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-brand-navy">4.8</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 justify-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Avg Rating
                        </p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-brand-navy">500+</p>
                        <p className="text-[11px] text-muted-foreground">Reviews</p>
                    </div>
                </m.div>
            </div>

            {/* Two ticker rows moving in opposite directions */}
            <div className="space-y-4">
                <TickerRow reviews={reviewsRow1} direction="left" duration={40} />
                <TickerRow reviews={reviewsRow2} direction="right" duration={45} />
            </div>
        </section>
    );
}
