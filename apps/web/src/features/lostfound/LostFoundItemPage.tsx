import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Phone, User, MapPin, Calendar, Clock, Search, Eye, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReporterInfo {
    id: string;
    fullName: string;
    mobileNumber: string;
    department: string;
}

interface LostFoundItemDetail {
    id: string;
    itemName: string;
    description: string;
    type: "lost" | "found";
    location: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    reporter: ReporterInfo;
}

export function LostFoundItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<LostFoundItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        api.get(`/lostfound/${id}`)
            .then(setItem)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Item not found"}</p>
                <Button onClick={() => navigate("/lost-found")} variant="outline">
                    Back to Lost & Found
                </Button>
            </div>
        );
    }

    const reportedDate = new Date(item.createdAt);
    const formattedDate = reportedDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = reportedDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const isLost = item.type === "lost";

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/lost-found")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Lost & Found
            </motion.button>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background rounded-3xl border border-border/50 shadow-xl overflow-hidden"
            >
                {/* Header with Badge */}
                <div className={`px-8 py-6 ${isLost ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-emerald-500"}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                            {isLost ? (
                                <Search className="w-6 h-6 text-white" />
                            ) : (
                                <Eye className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div>
                            <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                                {isLost ? "Someone Lost This" : "Someone Found This"}
                            </p>
                            <h1 className="text-2xl md:text-3xl font-black text-white">
                                {item.itemName}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Image */}
                    {item.imageUrl && (
                        <div className="mb-8">
                            <img
                                src={item.imageUrl}
                                alt={item.itemName}
                                className="w-full max-h-80 object-cover rounded-2xl"
                            />
                        </div>
                    )}

                    {/* Time & Location Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    Date Reported
                                </p>
                            </div>
                            <p className="text-lg font-bold text-foreground">{formattedDate}</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20">
                                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    Time Reported
                                </p>
                            </div>
                            <p className="text-lg font-bold text-foreground">{formattedTime}</p>
                        </div>
                    </div>

                    {/* Location */}
                    {item.location && (
                        <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/20">
                                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    {isLost ? "Last Seen Location" : "Found At"}
                                </p>
                            </div>
                            <p className="text-lg font-bold text-foreground">{item.location}</p>
                        </div>
                    )}

                    {/* Description */}
                    {item.description && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                                Description
                            </h3>
                            <p className="text-foreground leading-relaxed text-lg">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Reporter Info */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            {isLost ? "Contact if Found" : "Contact to Claim"}
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isLost
                                    ? "bg-gradient-to-br from-red-500 to-red-600"
                                    : "bg-gradient-to-br from-green-500 to-emerald-500"
                                }`}>
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-foreground">
                                    {item.reporter?.fullName || "Anonymous"}
                                </p>
                                {item.reporter?.department && (
                                    <p className="text-sm text-muted-foreground">
                                        {item.reporter.department}
                                    </p>
                                )}
                            </div>
                        </div>

                        {item.reporter?.mobileNumber ? (
                            <a
                                href={`tel:${item.reporter.mobileNumber}`}
                                className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all ${isLost
                                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/25"
                                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/25"
                                    }`}
                            >
                                <Phone className="w-5 h-5" />
                                {item.reporter.mobileNumber}
                            </a>
                        ) : (
                            <div className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-muted text-muted-foreground">
                                <MessageCircle className="w-5 h-5" />
                                Contact info not available
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
