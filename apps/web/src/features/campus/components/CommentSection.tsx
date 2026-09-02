import { useState, useEffect, useRef, useCallback } from "react";
import { m, AnimatePresence } from "motion/react";
import { Send, Trash2, Loader2, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Comment } from "@/features/campus/types";

interface CommentSectionProps {
    postId: string;
    currentUserId?: string;
    commentsCount: number;
    onCountChange: (delta: number) => void;
}

const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "now";
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
};

export function CommentSection({ postId, currentUserId, commentsCount, onCountChange }: CommentSectionProps) {
    const [commentsList, setCommentsList] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const offsetRef = useRef(0);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const LIMIT = 5;

    // Fetch comments
    const fetchComments = useCallback(async (reset = false) => {
        setLoading(true);
        const currentOffset = reset ? 0 : offsetRef.current;
        try {
            const res = await api.get(`/social/${postId}/comments?limit=${LIMIT}&offset=${currentOffset}`);
            if (reset) {
                setCommentsList(res.items);
                offsetRef.current = LIMIT;
            } else {
                setCommentsList(prev => [...prev, ...res.items]);
                offsetRef.current += LIMIT;
            }
            setHasMore(res.hasMore);
        } catch (err) {
            console.error("Failed to fetch comments:", err);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api.get(`/social/${postId}/comments?limit=${LIMIT}&offset=0`)
            .then((res) => {
                if (!cancelled) {
                    setCommentsList(res.items);
                    offsetRef.current = LIMIT;
                    setHasMore(res.hasMore);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch comments:", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [postId]);

    const handleSubmit = async () => {
        if (!newComment.trim() || submitting) return;
        setSubmitting(true);
        try {
            const comment = await api.post(`/social/${postId}/comments`, { content: newComment.trim() });
            setCommentsList(prev => [comment, ...prev]);
            setNewComment("");
            onCountChange(1);
            if (inputRef.current) inputRef.current.style.height = "40px";
        } catch (err) {
            console.error("Failed to add comment:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await api.delete(`/social/comments/${commentId}`);
            setCommentsList(prev => prev.filter(c => c.id !== commentId));
            onCountChange(-1);
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        e.target.style.height = "40px";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };


    return (
        <div className="pt-3">
            {/* Comment Input */}
            <div className="flex gap-2 items-end mb-4">
                <textarea
                    ref={inputRef}
                    value={newComment}
                    onChange={autoResize}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a comment..."
                    aria-label="Write a comment"
                    maxLength={500}
                    rows={1}
                    className="flex-1 min-h-[40px] max-h-[120px] px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy/30 transition-colors placeholder:text-muted-foreground/60"
                />
                <m.div whileTap={{ scale: 0.9 }}>
                    <Button
                        size="icon"
                        onClick={handleSubmit}
                        disabled={!newComment.trim() || submitting}
                        aria-label="Post comment"
                        className="h-10 w-10 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white shrink-0"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </m.div>
            </div>

            {/* Character counter */}
            {newComment.length > 400 && (
                <p className={`text-xs mb-2 text-right ${newComment.length >= 500 ? "text-red-500" : "text-amber-500"}`}>
                    {500 - newComment.length} characters left
                </p>
            )}

            {/* Comments List */}
            <AnimatePresence mode="popLayout">
                {commentsList.map((comment, i) => (
                    <m.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="group flex gap-2.5 py-2.5"
                    >
                        <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                            <AvatarImage src={comment.user?.idCardUrl} />
                            <AvatarFallback className="text-[10px]">{comment.user?.fullName?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="bg-muted/40 rounded-xl px-3 py-2">
                                <span className="font-semibold text-xs">{comment.user?.fullName}</span>
                                <p className="text-sm text-foreground/90 break-words">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-1 px-1">
                                <span className="text-[10px] text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                                {currentUserId === comment.userId && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-[10px] text-muted-foreground/60 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </m.div>
                ))}
            </AnimatePresence>

            {/* Load More */}
            {hasMore && (
                <button
                    onClick={() => fetchComments(false)}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand-navy transition-colors py-2 mx-auto"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
                    Load more comments
                </button>
            )}

            {/* Loading state for initial load */}
            {loading && commentsList.length === 0 && (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Empty state */}
            {!loading && commentsList.length === 0 && (
                <p className="text-xs text-center text-muted-foreground/60 py-2">No comments yet. Be the first!</p>
            )}
        </div>
    );
}
