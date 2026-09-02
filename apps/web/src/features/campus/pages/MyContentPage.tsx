import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import {
    Loader2, ArrowUp, User, Sparkles, Trash2, Eye, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { Post } from "@/features/campus/types";

const MY_CONTENT_TABS = [
    { id: "all", label: "All" },
    { id: "post", label: "My Posts" },
    { id: "announcement", label: "My News" },
    { id: "event", label: "My Events" },
] as const;

const TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    post: { color: "text-rose-600", bg: "bg-rose-100/60 dark:bg-rose-900/30", label: "Post" },
    event: { color: "text-violet-600", bg: "bg-violet-100/60 dark:bg-violet-900/30", label: "Event" },
    announcement: { color: "text-amber-600", bg: "bg-amber-100/60 dark:bg-amber-900/30", label: "News" },
};

const DEFAULT_TYPE_CONFIG = { color: "text-rose-600", bg: "bg-rose-100/60 dark:bg-rose-900/30", label: "Post" };

/* ── My Content Grid Card ── */
function MyContentCard({ post, onDelete }: { post: Post; onDelete: () => void }) {
    const navigate = useNavigate();
    const config = TYPE_CONFIG[post.type] ?? DEFAULT_TYPE_CONFIG;

    return (
        <m.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden group hover:shadow-md hover:border-rose-200/60 dark:hover:border-rose-500/20 transition-[border-color,box-shadow]"
        >
            {post.imageUrl && (
                <div className="relative h-36 sm:h-40 overflow-hidden">
                    <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${config.bg} ${config.color}`}>
                        {config.label}
                    </span>
                </div>
            )}
            <div className="p-3 sm:p-4">
                {!post.imageUrl && (
                    <div className="flex items-center justify-between mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${config.bg} ${config.color}`}>
                            {config.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                )}
                {post.title && (
                    <h3 className="font-bold text-sm sm:text-base text-foreground truncate mb-1">{post.title}</h3>
                )}
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.content}</p>
                <div className="flex items-center justify-between pt-2 border-t border-rose-100/40 dark:border-white/5">
                    <span className="text-[11px] text-muted-foreground">
                        ❤️ {post.likesCount} · 💬 {post.commentsCount}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="View post"
                            className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                            onClick={() => navigate(`/post/${post.id}`)}
                        >
                            <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete post"
                            className="h-7 w-7 text-muted-foreground hover:text-red-600"
                            onClick={onDelete}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </m.div>
    );
}

export function MyContentPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [myPostsLoading, setMyPostsLoading] = useState(true);
    const [myPostsLoadingMore, setMyPostsLoadingMore] = useState(false);
    const [myPostsHasMore, setMyPostsHasMore] = useState(true);
    const myPostsOffsetRef = useRef(0);
    const [myContentTab, setMyContentTab] = useState("all");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const LIMIT = 10;

    const fetchMyPosts = useCallback(async (reset = false) => {
        if (reset) setMyPostsLoading(true); else setMyPostsLoadingMore(true);
        const off = reset ? 0 : myPostsOffsetRef.current;
        try {
            const res = await api.get(`/social/my-posts?limit=${LIMIT}&offset=${off}`);
            if (reset) { setMyPosts(res.items); myPostsOffsetRef.current = LIMIT; }
            else { setMyPosts(prev => [...prev, ...res.items]); myPostsOffsetRef.current += LIMIT; }
            setMyPostsHasMore(res.hasMore);
        } catch (err) { console.error(err); }
        finally { setMyPostsLoading(false); setMyPostsLoadingMore(false); }
    }, []);

    useEffect(() => { fetchMyPosts(true); }, [fetchMyPosts]);

    useEffect(() => {
        const handler = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handleDeletePost = async (postId: string) => {
        try {
            await api.delete(`/social/${postId}`);
            setMyPosts(prev => prev.filter(p => p.id !== postId));
        } catch (err) { console.error(err); }
    };

    const filteredMyPosts = myContentTab === "all" ? myPosts : myPosts.filter(p => p.type === myContentTab);

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-background to-background dark:from-rose-950/10">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">My Content</h2>
                        <p className="text-sm text-muted-foreground">Manage and monitor your published media</p>
                    </div>
                    <Button
                        onClick={() => navigate("/unimedia")}
                        className="rounded-full gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold px-5 shadow-lg shadow-rose-500/30 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-4 border-b border-rose-100/40 dark:border-white/10 overflow-x-auto scrollbar-hide -mx-1 px-1">
                    {MY_CONTENT_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setMyContentTab(tab.id)}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${myContentTab === tab.id
                                ? "border-rose-500 text-rose-600 dark:text-rose-400"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-rose-500 font-medium">
                        Showing: <span className="bg-rose-100/60 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">{filteredMyPosts.length} Items</span>
                    </p>
                </div>

                {/* Grid */}
                {myPostsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-40 bg-rose-100/30 dark:bg-rose-900/10" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 bg-rose-100/40 dark:bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-rose-100/30 dark:bg-white/5 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredMyPosts.length === 0 ? (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100/50 dark:bg-rose-900/20 flex items-center justify-center">
                            <User className="w-8 h-8 text-rose-300 dark:text-rose-700" />
                        </div>
                        <h3 className="font-semibold text-foreground/70 mb-1">No content yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start creating posts to see them here</p>
                        <Button
                            onClick={() => navigate("/unimedia")}
                            className="rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 shadow-lg shadow-rose-500/25"
                        >
                            Create Your First Post
                        </Button>
                    </m.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredMyPosts.map(post => (
                                <MyContentCard key={post.id} post={post} onDelete={() => handleDeletePost(post.id)} />
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {/* Load More */}
                {myPostsHasMore && !myPostsLoading && filteredMyPosts.length > 0 && (
                    <div className="flex justify-center py-8">
                        <Button
                            variant="outline"
                            onClick={() => fetchMyPosts(false)}
                            disabled={myPostsLoadingMore}
                            className="rounded-full gap-2 px-8 border-rose-200 dark:border-rose-800/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-semibold"
                        >
                            {myPostsLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                            Load More Content
                        </Button>
                    </div>
                )}
            </div>

            {/* Scroll to Top FAB */}
            <AnimatePresence>
                {showScrollTop && (
                    <m.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-rose-500/40 transition-shadow"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </m.button>
                )}
            </AnimatePresence>
        </div>
    );
}
