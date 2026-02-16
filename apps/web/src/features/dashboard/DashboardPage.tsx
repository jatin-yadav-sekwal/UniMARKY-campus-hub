import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Loader2,
    ShoppingBag,
    Search,
    Utensils,
    Home,
    GraduationCap,
    ArrowRight,
    TrendingUp,
    Sparkles,
    Newspaper,
    Plus
} from 'lucide-react';

interface DashboardData {
    marketplace?: { id: string; title?: string }[];
    lostFound?: { id: string; itemName?: string }[];
}

const quickAccessItems = [
    {
        title: "Marketplace",
        href: "/marketplace",
        desc: "Buy & Sell items",
        icon: ShoppingBag,
        gradient: "from-amber-500 to-orange-600",
        shadowColor: "shadow-orange-500/20"
    },
    {
        title: "Lost & Found",
        href: "/lost-found",
        desc: "Find missing items",
        icon: Search,
        gradient: "from-teal-500 to-emerald-600",
        shadowColor: "shadow-emerald-500/20"
    },
    {
        title: "Unimedia",
        href: "/unimedia",
        desc: "Campus social feed",
        icon: Newspaper,
        gradient: "from-pink-500 to-rose-600",
        shadowColor: "shadow-rose-500/20"
    },
    {
        title: "Study",
        href: "/study",
        desc: "Academic resources",
        icon: GraduationCap,
        gradient: "from-indigo-500 to-violet-600",
        shadowColor: "shadow-indigo-500/20"
    },
    {
        title: "Food",
        href: "/food",
        desc: "Campus dining",
        icon: Utensils,
        gradient: "from-red-500 to-orange-600",
        shadowColor: "shadow-red-500/20"
    },
    {
        title: "Housing",
        href: "/housing",
        desc: "Find a place to stay",
        icon: Home,
        gradient: "from-purple-500 to-indigo-600",
        shadowColor: "shadow-purple-500/20"
    },
];

export function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/dashboard/summary')
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
                >
                    <span className="text-brand-navy">YOUR </span>
                    <span className="bg-gradient-to-r from-brand-blue to-brand-orange bg-clip-text text-transparent">CAMPUS HUB</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-base sm:text-lg"
                >
                    Everything your campus needs, in one place.
                </motion.p>
            </div>

            {/* Stats Overview */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 grid-cols-1 sm:grid-cols-2"
            >
                <motion.div variants={item}>
                    <SummaryCard
                        title="Marketplace"
                        href="/marketplace/my-listings"
                        data={data?.marketplace}
                        icon={ShoppingBag}
                        color="text-orange-500"
                        bgColor="bg-orange-500/10"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <SummaryCard
                        title="Lost & Found"
                        href="/lost-found/my-listings"
                        data={data?.lostFound}
                        icon={Search}
                        color="text-teal-500"
                        bgColor="bg-teal-500/10"
                    />
                </motion.div>
            </motion.div>

            {/* Quick Access Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-orange" />
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-navy">Explore Campus</h2>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                >
                    {quickAccessItems.map((qItem) => (
                        <motion.div
                            key={qItem.href}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                show: { opacity: 1, scale: 1 }
                            }}
                        >
                            <QuickAccessCard {...qItem} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

interface SummaryCardProps {
    title: string;
    href: string;
    data?: { id: string; title?: string; content?: string; itemName?: string }[];
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

function SummaryCard({ title, href, data, icon: Icon, color, bgColor }: SummaryCardProps) {
    const itemCount = data?.length || 0;
    const actionHref = title === "Marketplace" ? "/marketplace/create" : "/lost-found/create";
    const actionLabel = title === "Marketplace" ? "Sell Item" : "Report Lost";

    return (
        <Card className="h-full border-border/50 hover:border-border hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${bgColor} group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                            <CardTitle className="text-base sm:text-lg font-bold group-hover:text-brand-navy transition-colors">
                                {title}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">{itemCount} active listings</p>
                        </div>
                    </div>
                    <Link to={actionHref}>
                        <Button size="icon" variant="ghost" className={`h-8 w-8 rounded-full ${bgColor} ${color} hover:scale-110`}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <Link to={href} className="block">
                    <div className={`rounded-xl p-3 ${bgColor} border border-border/20 mb-3 group-hover:border-border/40 transition-colors`}>
                        {data && data.length > 0 ? (
                            <ul className="space-y-1.5">
                                {data.slice(0, 2).map((i) => (
                                    <li key={i.id} className="text-xs truncate text-muted-foreground flex items-center gap-2">
                                        <div className={`w-1 h-1 rounded-full ${color.replace('text-', 'bg-')}`} />
                                        {i.title || i.content || i.itemName}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground italic flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" />
                                Start exploring now
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-brand-navy flex items-center gap-1">
                            Go to {title.toLowerCase()} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className={`w-6 h-6 rounded-full border-2 border-background ${bgColor} flex items-center justify-center`}>
                                    <Icon className={`w-3 h-3 ${color} opacity-40`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}

interface QuickAccessCardProps {
    title: string;
    href: string;
    desc: string;
    icon: React.ElementType;
    gradient: string;
    shadowColor: string;
}

function QuickAccessCard({ title, href, desc, icon: Icon, gradient, shadowColor }: QuickAccessCardProps) {
    return (
        <Link to={href} className="group block">
            <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative h-full p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadowColor} hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3 opacity-90" />
                    <h3 className="text-sm sm:text-base font-bold mb-0.5 sm:mb-1">{title}</h3>
                    <p className="text-[10px] sm:text-xs opacity-80 line-clamp-1">{desc}</p>
                </div>
            </motion.div>
        </Link>
    );
}
