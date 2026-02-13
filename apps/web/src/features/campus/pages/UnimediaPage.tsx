import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Loader2, ArrowUp, User, TrendingUp, Newspaper,
    CalendarDays, Megaphone, Sparkles, Trash2, Eye, Plus,
    Rss
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { CreatePost } from "@/features/campus/components/CreatePost";
import { PostCard } from "@/features/campus/components/PostCard";
import type { Post, UserProfile } from "@/features/campus/types";

const FEED_TABS = [
    { id: "all", label: "All Feed" },
    { id: "post", label: "Posts" },
    { id: "event", label: "Events" },
    { id: "announcement", label: "News" },
] as const;

/* ── Shimmer skeleton ── */
function PostSkeleton() {
    return (
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-rose-100/40 dark:border-white/10 rounded-2xl p-5 mb-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-100/50 dark:bg-white/10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-rose-100/50 dark:bg-white/10 rounded-full w-28" />
                    <div className="h-2 bg-rose-100/40 dark:bg-white/5 rounded-full w-16" />
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-rose-100/50 dark:bg-white/10 rounded-full w-full" />
                <div className="h-3 bg-rose-100/40 dark:bg-white/5 rounded-full w-3/4" />
            </div>
            <div className="flex gap-4 pt-3 border-t border-rose-100/30">
                <div className="h-8 bg-rose-100/40 dark:bg-white/5 rounded-full w-16" />
                <div className="h-8 bg-rose-100/40 dark:bg-white/5 rounded-full w-20" />
            </div>
        </div>
    );
}

/* ══════════════════════ Main Page ══════════════════════ */
export function UnimediaPage() {
    const { user } = useAuth();
    const createPostRef = useRef<HTMLDivElement>(null);

    /* Feed state */
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [offset, setOffset] = useState(0);

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const LIMIT = 10;

    useEffect(() => {
        api.get("/profiles/me").then(setUserProfile).catch(console.error);
    }, []);

    /* Fetch Feed */
    const fetchPosts = useCallback(async (reset = false) => {
        if (reset) setLoading(true); else setLoadingMore(true);
        const off = reset ? 0 : offset;
        try {
            const res = await api.get(`/social?type=${activeTab}&limit=${LIMIT}&offset=${off}`);
            if (reset) { setPosts(res.items); setOffset(LIMIT); }
            else { setPosts(prev => [...prev, ...res.items]); setOffset(prev => prev + LIMIT); }
            setHasMore(res.hasMore);
        } catch (err) { console.error(err); }
        finally { setLoading(false); setLoadingMore(false); }
    }, [activeTab, offset]);

    useEffect(() => { fetchPosts(true); }, [activeTab]);

    useEffect(() => {
        const handler = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handlePostCreated = (newPost: Post) => {
        api.get(`/social/${newPost.id}`)
            .then(full => { setPosts(prev => [full, ...prev]); })
            .catch(() => { setPosts(prev => [newPost, ...prev]); });
    };

    const handleDeletePost = (postId: string) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-background to-background dark:from-rose-950/10">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                {/* Filter pills — glass style */}
                <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                    {FEED_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                                ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/30 scale-[1.02]"
                                : "bg-white/60 dark:bg-white/5 backdrop-blur-sm text-foreground/70 border border-white/50 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-400 hover:shadow-sm"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    {/* ── Main feed ── */}
                    <div className="flex-1 min-w-0">
                        <div ref={createPostRef}>
                            <CreatePost onPostCreated={handlePostCreated} userRole={userProfile?.role} userName={userProfile?.fullName} />
                        </div>

                        {loading ? (
                            <div><PostSkeleton /><PostSkeleton /><PostSkeleton /></div>
                        ) : posts.length === 0 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100/50 dark:bg-rose-900/20 flex items-center justify-center">
                                    <Rss className="w-8 h-8 text-rose-300 dark:text-rose-700" />
                                </div>
                                <h3 className="font-semibold text-foreground/70 mb-1">No posts yet</h3>
                                <p className="text-sm text-muted-foreground">Be the first to share something!</p>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} currentUserId={user?.id} onDelete={() => handleDeletePost(post.id)} />
                                ))}
                            </AnimatePresence>
                        )}

                        {hasMore && !loading && posts.length > 0 && (
                            <div className="flex justify-center py-6">
                                <Button
                                    variant="outline"
                                    onClick={() => fetchPosts(false)}
                                    disabled={loadingMore}
                                    className="rounded-full gap-2 px-6 border-rose-200 dark:border-rose-800/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-semibold backdrop-blur-sm"
                                >
                                    {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Load More
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar — hidden on mobile ── */}
                    <aside className="hidden md:flex md:flex-col w-72 xl:w-80 shrink-0 gap-5">
                        {/* Trending */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm p-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-3">
                                <TrendingUp className="w-4 h-4" /> Trending on Campus
                            </h3>
                            <div className="space-y-3">
                                {posts.filter(p => p.likesCount > 0).slice(0, 3).map((post) => (
                                    <a key={post.id} href={`/unimedia/${post.id}`} className="block group">
                                        <p className="text-[11px] text-muted-foreground">
                                            {post.type === "event" ? "Events" : post.type === "announcement" ? "News" : "Posts"} • Trending
                                        </p>
                                        <p className="text-sm font-semibold group-hover:text-rose-500 transition-colors line-clamp-1">
                                            {post.title || post.content.slice(0, 50)}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">{post.likesCount} likes · {post.commentsCount} comments</p>
                                    </a>
                                ))}
                                {posts.filter(p => p.likesCount > 0).length === 0 && (
                                    <p className="text-xs text-muted-foreground/60 text-center py-2">No trending posts yet</p>
                                )}
                            </div>
                        </div>

                        {/* Latest News */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm p-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-3">
                                <Newspaper className="w-4 h-4" /> Latest News
                            </h3>
                            <div className="space-y-3">
                                {posts.filter(p => p.type === "announcement").slice(0, 3).map((post) => (
                                    <a key={post.id} href={`/unimedia/${post.id}`} className="flex items-start gap-2.5 group">
                                        {post.imageUrl && (
                                            <img src={post.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold group-hover:text-rose-500 transition-colors line-clamp-2">{post.title || post.content.slice(0, 40)}</p>
                                            <p className="text-[11px] text-muted-foreground">by {post.author?.fullName}</p>
                                        </div>
                                    </a>
                                ))}
                                {posts.filter(p => p.type === "announcement").length === 0 && (
                                    <p className="text-xs text-muted-foreground/60 text-center py-2">No news yet</p>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ═══════ Scroll to Top FAB ═══════ */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-rose-500/40 transition-all"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
