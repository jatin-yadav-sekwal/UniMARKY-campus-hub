import { motion } from "motion/react";
import { Megaphone, Calendar, Pin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    universityName: string;
}

export function AnnouncementsPage() {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (!user?.user_metadata?.university_name) return;

            try {
                // Assuming the API route uses the university query param
                const res = await fetch(`http://localhost:3000/api/campus/announcements?university=${encodeURIComponent(user.user_metadata.university_name)}`);
                if (res.ok) {
                    const data = await res.json();
                    setAnnouncements(data);
                }
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [user]);

    return (
        <div className="container min-h-screen py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-brand-navy flex items-center gap-3">
                    <Megaphone className="h-8 w-8 text-brand-yellow" />
                    Campus Announcements
                </h1>
                <p className="text-muted-foreground text-lg">
                    Real-time updates from {user?.user_metadata?.university_name || "your university"}.
                </p>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-xl bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border">
                    <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-brand-navy">No announcements yet</h3>
                    <p className="text-muted-foreground">Check back later for important updates.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {announcements.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full border-brand-navy/5 hover:border-brand-yellow/50 transition-colors group overflow-hidden">
                                <CardHeader className="bg-brand-yellow/5 border-b border-brand-yellow/10 pb-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="leading-snug text-lg font-bold text-brand-navy group-hover:text-brand-orange transition-colors">
                                            {item.title}
                                        </CardTitle>
                                        <Pin className="h-4 w-4 text-brand-yellow shrink-0 rotate-45 opacity-50" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-2">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {item.content}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
