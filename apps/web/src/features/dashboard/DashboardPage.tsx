import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';

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
                className="grid gap-4 grid-cols-1 lg:grid-cols-2"
            >
                <motion.div variants={item}>
                    <SummaryCard
                        title="Marketplace"
                        href="/marketplace/my-listings"
                        secondaryHref="/marketplace/list"
                        secondaryLabel="List new"
                        data={data?.marketplace}
                        icon={ShoppingBag}
                        color="text-orange-500"
                        bgColor="bg-orange-500/10"
                        gradient="from-amber-50 via-white to-orange-50 dark:from-amber-950/40 dark:via-background dark:to-orange-950/30"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <SummaryCard
                        title="Lost & Found"
                        href="/lost-found/my-listings"
                        secondaryHref="/lost-found/report"
                        secondaryLabel="Report item"
                        data={data?.lostFound}
                        icon={Search}
                        color="text-teal-500"
                        bgColor="bg-teal-500/10"
                        gradient="from-teal-50 via-white to-emerald-50 dark:from-teal-950/40 dark:via-background dark:to-emerald-950/30"
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
    gradient: string;
    secondaryHref?: string;
    secondaryLabel?: string;
}

function SummaryCard({
    title,
    href,
    data,
    icon: Icon,
    color,
    bgColor,
    gradient,
    secondaryHref,
    secondaryLabel
}: SummaryCardProps) {
    const count = data?.length ?? 0;

    return (
        <Card className={`h-full border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-gradient-to-br ${gradient}`}>
            <CardHeader className="pb-3 border-b border-border/20">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-background/80 backdrop-blur-sm ${bgColor} shadow-sm`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <CardTitle className="text-lg font-bold text-brand-navy dark:text-white">
                            {title}
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                    {data && data.length > 0 ? (
                        data.slice(0, 3).map((i) => (
                            <Link
                                to={href}
                                key={i.id}
                                className="block group/item"
                            >
                                <div className="p-3 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-border/40 hover:border-brand-navy/30 hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-200 flex items-center gap-3">
                                    <div className={`w-1.5 h-8 rounded-full ${bgColor.replace('/10', '')}`} />
                                    <span className="text-sm font-medium text-foreground/80 group-hover/item:text-brand-navy dark:group-hover/item:text-white truncate flex-1">
                                        {i.title || i.content || i.itemName}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-6 text-center border-2 border-dashed border-border/40 rounded-xl bg-white/30 dark:bg-black/10">
                            <p className="text-sm text-muted-foreground italic flex flex-col items-center gap-2">
                                <TrendingUp className="w-5 h-5 opacity-50" />
                                No recent activity yet.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <Link to={href} className="flex-1">
                        <Button variant="default" className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white shadow-lg shadow-brand-navy/10 h-10 rounded-lg group">
                            Show All ({count}) <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    {secondaryHref && secondaryLabel && (
                        <Link to={secondaryHref}>
                            <Button variant="outline" size="icon" className="h-10 w-10 border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5 rounded-lg" title={secondaryLabel}>
                                <Plus className="w-5 h-5" />
                            </Button>
                        </Link>
                    )}
                </div>
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
