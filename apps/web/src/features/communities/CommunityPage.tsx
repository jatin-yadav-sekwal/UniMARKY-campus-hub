import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { uploadImage } from '@/lib/uploadImage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Loader2,
    ArrowLeft,
    Users,
    MessageSquare,
    Plus,
    Trash2,
    Send,
    ImagePlus,
    X,
    AlertCircle,
    Calendar,
    Settings,
} from 'lucide-react';
import {
    CATEGORY_GRADIENTS,
    CategoryBadge,
    InitialsAvatar,
    timeAgo,
    type Community,
    type CommunityPost,
    type CommunityComment,
    type CommunityMember,
} from './shared';

const POSTS_LIMIT = 10;

function displayName(user: { user_metadata?: Record<string, any> } | null): string | null {
    const meta = user?.user_metadata;
    if (!meta) return null;
    const name = [meta.first_name, meta.last_name].filter(Boolean).join(' ').trim();
    return name || meta.full_name || meta.name || null;
}

export function CommunityPage() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [community, setCommunity] = useState<Community | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState('feed');

    // Feed state
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsHasMore, setPostsHasMore] = useState(false);
    const [postsOffset, setPostsOffset] = useState(0);
    const [canPost, setCanPost] = useState(false);

    // Membership state
    const [busyMembership, setBusyMembership] = useState(false);

    // Members state
    const [members, setMembers] = useState<CommunityMember[] | null>(null);
    const [membersLoading, setMembersLoading] = useState(false);

    const loadCommunity = useCallback(async () => {
        try {
            const data = await api.get(`/communities/${id}`);
            setCommunity(data);
        } catch (err: any) {
            setError(err?.message || 'Community not found');
        }
    }, [id]);

    const loadPosts = useCallback(
        async (reset: boolean) => {
            const currentOffset = reset ? 0 : postsOffset;
            if (reset) setPostsLoading(true);
            try {
                const data = await api.get(
                    `/communities/${id}/posts?limit=${POSTS_LIMIT}&offset=${currentOffset}`
                );
                setPosts((prev) => (reset ? data.items : [...prev, ...data.items]));
                setPostsHasMore(data.hasMore);
                setPostsOffset(currentOffset + data.items.length);
                setCanPost(Boolean(data.canPost));
            } catch (err: any) {
                setError(err?.message || 'Failed to load posts');
            } finally {
                setPostsLoading(false);
            }
        },
        [id, postsOffset]
    );

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            await loadCommunity();
            if (alive) setLoading(false);
        })();
        return () => {
            alive = false;
        };
    }, [loadCommunity]);

    useEffect(() => {
        if (community) loadPosts(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [community]);

    const loadMembers = useCallback(async () => {
        setMembersLoading(true);
        try {
            const data = await api.get(`/communities/${id}/members?limit=100`);
            setMembers(data.items);
        } catch (err: any) {
            setError(err?.message || 'Failed to load members');
        } finally {
            setMembersLoading(false);
        }
    }, [id]);

    const onTabChange = (value: string) => {
        setTab(value);
        if (value === 'members' && members === null && !membersLoading) loadMembers();
    };

    const toggleMembership = async () => {
        if (!community) return;
        setBusyMembership(true);
        setError(null);
        try {
            if (community.isMember) {
                await api.delete(`/communities/${community.id}/join`);
                setCommunity({
                    ...community,
                    isMember: false,
                    memberCount: Math.max(0, community.memberCount - 1),
                });
                setCanPost(community.canModerate || false);
            } else {
                await api.post(`/communities/${community.id}/join`, {});
                setCommunity({
                    ...community,
                    isMember: true,
                    memberCount: community.memberCount + 1,
                });
                setCanPost(true);
            }
        } catch (err: any) {
            setError(err?.message || 'Could not update membership');
        } finally {
            setBusyMembership(false);
        }
    };

    const handlePosted = (post: CommunityPost) => {
        setPosts((prev) => [post, ...prev]);
        setCommunity((prev) => (prev ? { ...prev, postCount: prev.postCount + 1 } : prev));
    };

    const handlePostDeleted = (postId: string) => {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setCommunity((prev) =>
            prev ? { ...prev, postCount: Math.max(0, prev.postCount - 1) } : prev
        );
    };

    const deleteCommunity = async () => {
        if (!community) return;
        try {
            await api.delete(`/communities/${community.id}`);
            navigate('/communities');
        } catch (err: any) {
            setError(err?.message || 'Could not delete the community');
            setTab('about');
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    if (!community) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <h2 className="text-xl font-bold text-brand-navy dark:text-white">
                    {error || 'Community not found'}
                </h2>
                <Link to="/communities" className="text-brand-blue hover:underline text-sm mt-2 inline-block">
                    Back to Communities
                </Link>
            </div>
        );
    }

    const gradient = CATEGORY_GRADIENTS[community.category];

    return (
        <div className="pb-20">
            <Link
                to="/communities"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
                <ArrowLeft className="w-4 h-4" /> Communities
            </Link>

            {/* Header */}
            <Card className="overflow-hidden border border-border/60 shadow-sm mb-6">
                <div className={`h-24 w-full bg-gradient-to-r ${gradient}`} />
                <CardContent className="pt-0">
                    <div className="-mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div className="flex items-end gap-4">
                            <div
                                className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} ring-4 ring-background flex items-center justify-center text-white text-2xl font-black shadow-md`}
                            >
                                {community.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="pb-1">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-navy dark:text-white">
                                    {community.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                    <CategoryBadge category={community.category} />
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" /> {community.memberCount} members
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" /> {community.postCount} posts
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {community.canModerate && (
                                <Link
                                    to={`/communities/${community.id}/manage`}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-input px-3 h-9 text-sm font-medium hover:bg-accent transition-colors"
                                >
                                    <Settings className="w-4 h-4" /> Manage
                                </Link>
                            )}
                            <Button
                                onClick={toggleMembership}
                                disabled={busyMembership}
                            variant={community.isMember ? 'outline' : 'default'}
                            className={
                                'rounded-full shrink-0 ' +
                                (!community.isMember
                                    ? 'bg-brand-navy hover:bg-brand-navy/90 text-white'
                                    : '')
                            }
                        >
                            {busyMembership ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : community.isMember ? (
                                'Leave community'
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" /> Join
                                </>
                            )}
                            </Button>
                        </div>
                    </div>

                    {community.description && (
                        <p className="text-sm text-muted-foreground mt-4 max-w-2xl">
                            {community.description}
                        </p>
                    )}
                </CardContent>
            </Card>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError(null)} aria-label="Dismiss">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Tabs */}
            <Tabs value={tab} onValueChange={onTabChange}>
                <TabsList className="mb-4">
                    <TabsTrigger value="feed">Feed</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                {/* FEED */}
                <TabsContent value="feed" className="space-y-4">
                    {canPost ? (
                        <Composer communityId={community.id} onPosted={handlePosted} onError={setError} />
                    ) : (
                        <div className="text-sm text-muted-foreground bg-muted/50 border border-border/60 rounded-lg px-4 py-3">
                            Join this community to post and comment.
                        </div>
                    )}

                    {postsLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl">
                            <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No posts yet. {canPost ? 'Start the conversation.' : ''}
                            </p>
                        </div>
                    ) : (
                        <>
                            {posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    communityId={community.id}
                                    post={post}
                                    canModerate={community.canModerate || false}
                                    currentUserId={user?.id ?? null}
                                    canComment={canPost}
                                    currentUserName={displayName(user)}
                                    onDeleted={handlePostDeleted}
                                    onError={setError}
                                />
                            ))}
                            {postsHasMore && (
                                <div className="flex justify-center">
                                    <Button variant="outline" className="rounded-full" onClick={() => loadPosts(false)}>
                                        Load more
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>

                {/* MEMBERS */}
                <TabsContent value="members">
                    {membersLoading || members === null ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {members.map((m) => (
                                <div
                                    key={m.id}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card"
                                >
                                    <InitialsAvatar name={m.user.fullName} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold truncate text-brand-navy dark:text-white">
                                            {m.user.fullName || 'UniMARKY student'}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {m.user.department || 'Member'}
                                        </p>
                                    </div>
                                    {m.role === 'moderator' && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                                            Mod
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* ABOUT */}
                <TabsContent value="about" className="space-y-4">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-brand-navy dark:text-white mb-1">
                                    About this community
                                </h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {community.description || 'No description has been added yet.'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                Created {community.createdAt ? timeAgo(community.createdAt) : 'recently'}
                            </div>
                        </CardContent>
                    </Card>

                    {community.canDelete && (
                        <Card className="border-red-500/30">
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">
                                    Danger zone
                                </h3>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Deleting this community removes all of its posts and comments. This cannot
                                    be undone.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={deleteCommunity}
                                    className="rounded-full border-red-500/40 text-red-600 hover:bg-red-500/10 dark:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete community
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

/* ------------------------------------------------------------------ */

function Composer({
    communityId,
    onPosted,
    onError,
}: {
    communityId: string;
    onPosted: (post: CommunityPost) => void;
    onError: (msg: string | null) => void;
}) {
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            onError('Image must be under 5MB');
            return;
        }
        setUploading(true);
        onError(null);
        try {
            const url = await uploadImage(file, 'community-posts');
            setImageUrl(url);
            setImagePreview(url);
        } catch {
            onError('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const submit = async () => {
        const text = content.trim();
        if (!text) return;
        setSaving(true);
        onError(null);
        try {
            const created = await api.post(`/communities/${communityId}/posts`, {
                content: text,
                imageUrl: imageUrl ?? undefined,
            });
            onPosted({
                ...created,
                author: created.author ?? null,
                commentCount: 0,
            });
            setContent('');
            setImageUrl(null);
            setImagePreview(null);
        } catch (err: any) {
            onError(err?.message || 'Could not create the post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="border border-border/60 shadow-sm">
            <CardContent className="pt-6 space-y-3">
                <textarea
                    value={content}
                    maxLength={5000}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    placeholder="Share something with the community..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                />

                {imagePreview && (
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Attachment preview"
                            className="max-h-48 rounded-lg border border-border/60"
                        />
                        <button
                            onClick={() => {
                                setImagePreview(null);
                                setImageUrl(null);
                            }}
                            aria-label="Remove image"
                            className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 shadow"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={onPickImage}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="text-muted-foreground"
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <ImagePlus className="w-4 h-4 mr-2" /> Photo
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={submit}
                        disabled={saving || !content.trim()}
                        className="rounded-full bg-brand-navy hover:bg-brand-navy/90 text-white"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" /> Post
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

/* ------------------------------------------------------------------ */

function PostCard({
    communityId,
    post,
    canModerate,
    currentUserId,
    canComment,
    currentUserName,
    onDeleted,
    onError,
}: {
    communityId: string;
    post: CommunityPost;
    canModerate: boolean;
    currentUserId: string | null;
    canComment: boolean;
    currentUserName: string | null;
    onDeleted: (postId: string) => void;
    onError: (msg: string | null) => void;
}) {
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [comments, setComments] = useState<CommunityComment[] | null>(null);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [sending, setSending] = useState(false);
    const [count, setCount] = useState(post.commentCount);
    const [deleting, setDeleting] = useState(false);

    const authorName = post.author?.fullName || 'UniMARKY student';
    const isAuthor = currentUserId != null && post.authorId === currentUserId;

    const loadComments = async () => {
        setLoadingComments(true);
        try {
            const data = await api.get(
                `/communities/${communityId}/posts/${post.id}/comments?limit=50`
            );
            setComments(data.items);
        } catch (err: any) {
            onError(err?.message || 'Failed to load comments');
        } finally {
            setLoadingComments(false);
        }
    };

    const toggleComments = () => {
        const next = !commentsOpen;
        setCommentsOpen(next);
        if (next && comments === null) loadComments();
    };

    const addComment = async () => {
        const text = commentText.trim();
        if (!text) return;
        setSending(true);
        onError(null);
        try {
            const created = await api.post(
                `/communities/${communityId}/posts/${post.id}/comments`,
                { content: text }
            );
            setComments((prev) => [
                ...(prev ?? []),
                {
                    ...created,
                    author: { id: currentUserId, fullName: currentUserName, role: null },
                },
            ]);
            setCount((c) => c + 1);
            setCommentText('');
        } catch (err: any) {
            onError(err?.message || 'Could not add the comment');
        } finally {
            setSending(false);
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await api.delete(
                `/communities/${communityId}/posts/${post.id}/comments/${commentId}`
            );
            setComments((prev) => (prev ?? []).filter((c) => c.id !== commentId));
            setCount((c) => Math.max(0, c - 1));
        } catch (err: any) {
            onError(err?.message || 'Could not delete the comment');
        }
    };

    const deletePost = async () => {
        setDeleting(true);
        onError(null);
        try {
            await api.delete(`/communities/${communityId}/posts/${post.id}`);
            onDeleted(post.id);
        } catch (err: any) {
            onError(err?.message || 'Could not delete the post');
            setDeleting(false);
        }
    };

    return (
        <Card className="border border-border/60 shadow-sm">
            <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                    <InitialsAvatar name={post.author?.fullName} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-brand-navy dark:text-white truncate">
                                {authorName}
                            </span>
                            <span className="text-xs text-muted-foreground">· {timeAgo(post.createdAt)}</span>
                        </div>

                        <p className="text-sm text-foreground/90 mt-2 whitespace-pre-wrap break-words">
                            {post.content}
                        </p>

                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt="Post attachment"
                                loading="lazy"
                                className="mt-3 rounded-lg border border-border/60 max-h-96 w-auto"
                            />
                        )}

                        <div className="flex items-center gap-4 mt-3">
                            <button
                                onClick={toggleComments}
                                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                {count} {count === 1 ? 'comment' : 'comments'}
                            </button>

                            {(isAuthor || canModerate) && (
                                <button
                                    onClick={deletePost}
                                    disabled={deleting}
                                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-red-600 transition-colors ml-auto"
                                >
                                    {deleting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                    Delete
                                </button>
                            )}
                        </div>

                        {/* Comments */}
                        <AnimatePresence initial={false}>
                            {commentsOpen && (
                                <m.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 pt-3 border-t border-border/60 space-y-3">
                                        {loadingComments ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                                        ) : comments && comments.length > 0 ? (
                                            comments.map((c) => (
                                                <div key={c.id} className="flex items-start gap-2.5">
                                                    <InitialsAvatar
                                                        name={c.author?.fullName}
                                                        className="h-7 w-7 text-[11px]"
                                                    />
                                                    <div className="flex-1 min-w-0 bg-muted/50 rounded-lg px-3 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold text-brand-navy dark:text-white">
                                                                {c.author?.fullName || 'UniMARKY student'}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {timeAgo(c.createdAt)}
                                                            </span>
                                                            {(canModerate ||
                                                                (currentUserId && c.authorId === currentUserId)) && (
                                                                <button
                                                                    onClick={() => deleteComment(c.id)}
                                                                    aria-label="Delete comment"
                                                                    className="ml-auto text-muted-foreground hover:text-red-600"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-foreground/90 mt-0.5 whitespace-pre-wrap break-words">
                                                            {c.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground">
                                                No comments yet.
                                            </p>
                                        )}

                                        {canComment && (
                                            <div className="flex items-center gap-2">
                                                <InitialsAvatar
                                                    name={currentUserName}
                                                    className="h-7 w-7 text-[11px]"
                                                />
                                                <input
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            addComment();
                                                        }
                                                    }}
                                                    maxLength={2000}
                                                    placeholder="Write a comment..."
                                                    className="flex-1 rounded-full border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={addComment}
                                                    disabled={sending || !commentText.trim()}
                                                    className="rounded-full h-8 w-8 p-0 bg-brand-navy hover:bg-brand-navy/90 text-white"
                                                >
                                                    {sending ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Send className="w-3.5 h-3.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
