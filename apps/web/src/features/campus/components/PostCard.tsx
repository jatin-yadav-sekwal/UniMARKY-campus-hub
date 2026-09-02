import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import {
    Heart, MessageCircle, Share2, Trash2, MoreHorizontal,
    Megaphone, CalendarDays, Check, Clock, User as UserIcon
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { CommentSection } from "./CommentSection";
import type { Post } from "@/features/campus/types";

interface PostCardProps {
    post: Post;
    currentUserId?: string;
    onDelete?: () => void;
    defaultShowComments?: boolean;
}

const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
};

function PostAuthorDropdown({ onDelete }: { onDelete?: () => void }) {
    if (!onDelete) return null;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Post actions" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-500 gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Post
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface ActionToolbarProps {
    isLiked: boolean;
    likesCount: number;
    commentsCount: number;
    showComments: boolean;
    shared: boolean;
    likeScale: number;
    isAuthor: boolean;
    onLike: () => void;
    onToggleComments: () => void;
    onShare: () => void;
    onDelete?: () => void;
}

function PostActionToolbar({
    isLiked,
    likesCount,
    commentsCount,
    showComments,
    shared,
    likeScale,
    isAuthor,
    onLike,
    onToggleComments,
    onShare,
    onDelete,
}: ActionToolbarProps) {
    return (
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex gap-1">
                <m.div animate={{ scale: likeScale }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Button
                        variant="ghost" size="sm" onClick={onLike}
                        className={`gap-1.5 h-8 px-3 rounded-full transition-colors duration-200 ${
                            isLiked ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100" : "text-muted-foreground hover:bg-muted hover:text-rose-500"
                        }`}
                    >
                        <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-current" : ""}`} />
                        <span className="text-xs font-medium tabular-nums">{likesCount > 0 ? likesCount : "Like"}</span>
                    </Button>
                </m.div>

                <Button
                    variant="ghost" size="sm"
                    onClick={onToggleComments}
                    className={`gap-1.5 h-8 px-3 rounded-full transition-colors duration-200 ${
                        showComments ? "text-rose-600 bg-rose-50 dark:bg-rose-900/20" : "text-muted-foreground hover:bg-muted hover:text-rose-600"
                    }`}
                >
                    <MessageCircle className={`w-4 h-4 ${showComments ? "fill-current" : ""}`} />
                    <span className="text-xs font-medium tabular-nums">{commentsCount > 0 ? commentsCount : "Comment"}</span>
                </Button>

                <Button
                    variant="ghost" size="sm"
                    onClick={onShare}
                    className="gap-1.5 h-8 px-3 rounded-full text-muted-foreground hover:bg-muted hover:text-blue-500 transition-colors"
                >
                    <AnimatePresence mode="wait">
                        {shared ? (
                            <m.div key="check" initial={{ scale: 0.001 }} animate={{ scale: 1 }} exit={{ scale: 0.001 }} className="flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-medium text-green-500">Copied!</span>
                            </m.div>
                        ) : (
                            <m.div key="share" initial={{ scale: 0.001 }} animate={{ scale: 1 }} exit={{ scale: 0.001 }} className="flex items-center gap-1.5">
                                <Share2 className="w-4 h-4" />
                                <span className="text-xs font-medium">Share</span>
                            </m.div>
                        )}
                    </AnimatePresence>
                </Button>
            </div>

            {isAuthor && <PostAuthorDropdown onDelete={onDelete} />}
        </div>
    );
}

interface CommonCardProps extends ActionToolbarProps {
    post: Post;
    currentUserId?: string;
    setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
}

function AnnouncementCard({
    post,
    currentUserId,
    isLiked,
    likesCount,
    commentsCount,
    showComments,
    shared,
    likeScale,
    isAuthor,
    onLike,
    onToggleComments,
    onShare,
    onDelete,
    setCommentsCount,
}: CommonCardProps) {
    return (
        <m.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden mb-4 hover:shadow-lg hover:shadow-rose-500/5 transition-shadow duration-300"
        >
            <div className="flex flex-col sm:flex-row">
                {post.imageUrl && (
                    <div className="sm:w-56 md:w-64 shrink-0 bg-muted/30 overflow-hidden">
                        <img
                            src={post.imageUrl}
                            alt={post.title || "News"}
                            className="w-full h-48 sm:h-full object-cover hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100/60 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/30">
                                <Megaphone className="w-3 h-3" />
                                News
                            </span>
                        </div>

                        {post.title && (
                            <h3 className="font-bold text-base sm:text-lg leading-snug mb-1.5 text-foreground">{post.title}</h3>
                        )}

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">{post.content}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-7 h-7">
                                <AvatarImage src={post.author?.idCardUrl} />
                                <AvatarFallback className="text-[10px] bg-rose-100/60 dark:bg-rose-900/30 text-rose-600 font-semibold">{post.author?.fullName?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-foreground">{post.author?.fullName}</span>
                            <span className="text-xs text-muted-foreground">· {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <PostActionToolbar
                        isLiked={isLiked}
                        likesCount={likesCount}
                        commentsCount={commentsCount}
                        showComments={showComments}
                        shared={shared}
                        likeScale={likeScale}
                        isAuthor={isAuthor}
                        onLike={onLike}
                        onToggleComments={onToggleComments}
                        onShare={onShare}
                        onDelete={onDelete}
                    />

                    <AnimatePresence>
                        {showComments && (
                            <m.div initial={{ opacity: 0, scaleY: 0.95, transformOrigin: "top" }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0.95 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                <CommentSection postId={post.id} currentUserId={currentUserId} commentsCount={commentsCount} onCountChange={(d) => setCommentsCount(prev => Math.max(0, prev + d))} />
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </m.div>
    );
}

function StandardPostCard({
    post,
    currentUserId,
    isLiked,
    likesCount,
    commentsCount,
    showComments,
    shared,
    likeScale,
    isAuthor,
    onLike,
    onToggleComments,
    onShare,
    onDelete,
    setCommentsCount,
}: CommonCardProps) {
    const [imageExpanded, setImageExpanded] = useState(false);
    const isEvent = post.type === "event";

    return (
        <m.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDoubleClick={() => !isLiked && onLike()}
            className="group bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden mb-4 hover:shadow-lg hover:shadow-rose-500/5 transition-shadow duration-300"
        >
            {isEvent && (
                <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-400" />
            )}

            <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-border/20">
                            <AvatarImage src={post.author?.idCardUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-rose-600 text-white text-sm font-semibold">
                                {post.author?.fullName?.[0] || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{post.author?.fullName}</span>
                                {isEvent && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                                        <CalendarDays className="w-3 h-3" />
                                        Event
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)} • 🌐</span>
                        </div>
                    </div>

                    {isAuthor && <PostAuthorDropdown onDelete={onDelete} />}
                </div>

                {post.title && <h3 className="font-bold text-base mb-1">{post.title}</h3>}

                {isEvent && (post.eventDate || post.hostedBy) && (
                    <div className="flex flex-wrap gap-3 mb-2 text-xs text-muted-foreground">
                        {post.eventDate && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 rounded-full text-violet-600 dark:text-violet-400">
                                <Clock className="w-3 h-3" />
                                {new Date(post.eventDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                        {post.hostedBy && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 rounded-full text-violet-600 dark:text-violet-400">
                                <UserIcon className="w-3 h-3" />
                                Hosted by {post.hostedBy}
                            </span>
                        )}
                    </div>
                )}

                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed mb-3">{post.content}</p>

                {post.imageUrl && (
                    <m.div
                        role="button"
                        tabIndex={0}
                        aria-label={imageExpanded ? "Collapse image" : "Expand image"}
                        className="relative rounded-xl overflow-hidden mb-3 cursor-pointer bg-muted/20 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                        layoutId={`image-${post.id}`}
                        onClick={() => setImageExpanded(!imageExpanded)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setImageExpanded(!imageExpanded);
                            }
                        }}
                    >
                        <img
                            src={post.imageUrl}
                            alt="Post"
                            className={`w-full object-contain transition-[max-height] duration-300 ${imageExpanded ? 'max-h-[80vh]' : 'max-h-96'}`}
                            loading="lazy"
                        />
                    </m.div>
                )}

                <PostActionToolbar
                    isLiked={isLiked}
                    likesCount={likesCount}
                    commentsCount={commentsCount}
                    showComments={showComments}
                    shared={shared}
                    likeScale={likeScale}
                    isAuthor={isAuthor}
                    onLike={onLike}
                    onToggleComments={onToggleComments}
                    onShare={onShare}
                    onDelete={onDelete}
                />

                <AnimatePresence>
                    {showComments && (
                        <m.div
                            initial={{ opacity: 0, scaleY: 0.95, transformOrigin: "top" }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <CommentSection
                                postId={post.id}
                                currentUserId={currentUserId}
                                commentsCount={commentsCount}
                                onCountChange={(delta) => setCommentsCount(prev => Math.max(0, prev + delta))}
                            />
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </m.div>
    );
}

export function PostCard({ post, currentUserId, onDelete, defaultShowComments = false }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
    const [showComments, setShowComments] = useState(defaultShowComments);
    const [shared, setShared] = useState(false);
    const [likeScale, setLikeScale] = useState(1);

    const isAuthor = currentUserId === post.authorId;

    const handleLike = async () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
        setLikeScale(1.3);
        setTimeout(() => setLikeScale(1), 200);
        try {
            await api.post(`/social/${post.id}/like`, {});
        } catch {
            setIsLiked(!newIsLiked);
            setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/social/${post.id}`);
            onDelete?.();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/unimedia/${post.id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: "Check out this post on UniMARKY", url });
            } else {
                await navigator.clipboard.writeText(url);
            }
        } catch {
            await navigator.clipboard.writeText(url);
        } finally {
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    const cardProps: CommonCardProps = {
        post,
        currentUserId,
        isLiked,
        likesCount,
        commentsCount,
        showComments,
        shared,
        likeScale,
        isAuthor,
        onLike: handleLike,
        onToggleComments: () => setShowComments(!showComments),
        onShare: handleShare,
        onDelete: handleDelete,
        setCommentsCount,
    };

    if (post.type === "announcement") {
        return <AnnouncementCard {...cardProps} />;
    }

    return <StandardPostCard {...cardProps} />;
}
