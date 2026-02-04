import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Loader2,
    ShoppingBag,
    Search,
    Newspaper,
    Utensils,
    Home,
    ArrowRight,
    TrendingUp,
    Users,
    Sparkles
} from 'lucide-react';

interface DashboardData {
    marketplace?: { id: string; title?: string }[];
    lostFound?: { id: string; itemName?: string }[];
    social?: { id: string; content?: string }[];
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
        title: "Unimedia",
        href: "/social",
        desc: "Campus social feed",
        icon: Newspaper,
        gradient: "from-pink-500 to-rose-600",
        shadowColor: "shadow-rose-500/20"
    },
    {
        title: "Lost & Found",
        href: "/lostfound",
        desc: "Find missing items",
        icon: Search,
        gradient: "from-teal-500 to-emerald-600",
        shadowColor: "shadow-emerald-500/20"
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
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
                <motion.div variants={item}>
                    <SummaryCard
                        title="Marketplace"
                        href="/marketplace"
                        data={data?.marketplace}
                        icon={ShoppingBag}
                        color="text-orange-500"
                        bgColor="bg-orange-500/10"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <SummaryCard
                        title="Lost & Found"
                        href="/lostfound"
                        data={data?.lostFound}
                        icon={Search}
                        color="text-teal-500"
                        bgColor="bg-teal-500/10"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <SummaryCard
                        title="Campus Buzz"
                        href="/social"
                        data={data?.social}
                        icon={Newspaper}
                        color="text-pink-500"
                        bgColor="bg-pink-500/10"
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
                    className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                >
                    {quickAccessItems.map((item, index) => (
                        <motion.div
                            key={item.href}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                show: { opacity: 1, scale: 1 }
                            }}
                        >
                            <QuickAccessCard {...item} />
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
    return (
        <Link to={href} className="group block">
            <Card className="h-full border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${bgColor}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <CardTitle className="text-base sm:text-lg font-bold group-hover:text-brand-navy transition-colors">
                            {title}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {data && data.length > 0 ? (
                        <ul className="space-y-2">
                            {data.slice(0, 3).map((i) => (
                                <li key={i.id} className="text-sm truncate text-muted-foreground group-hover:text-foreground transition-colors">
                                    • {i.title || i.content || i.itemName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            No recent activity
                        </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3 group-hover:text-brand-navy transition-colors">
                        View all <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardContent>
            </Card>
        </Link>
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

