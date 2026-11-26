import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { uploadImage } from '@/lib/uploadImage';
import { useAuth } from '@/hooks/useAuth';
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
    CATEGORY_COLORS,
    CategoryBadge,
    InitialsAvatar,
    timeAgo,
    type Community,
    type CommunityPost,
    type CommunityComment,
    type CommunityMember,
} from './shared';
import './communities.css';

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
            <div className="um-editorial um-communities">
                <div className="cm-loading">
                    <Loader2 size={22} className="animate-spin" />
                    <span>Loading community...</span>
                </div>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="um-editorial um-communities">
                <div className="empty-state">
                    <span className="empty-icon">
                        <AlertCircle size={24} strokeWidth={1.5} />
                    </span>
                    <h3>{error || 'Community not found'}</h3>
                    <Link to="/communities" className="button button-secondary">
                        Back to communities
                    </Link>
                </div>
            </div>
        );
    }

    const accent = CATEGORY_COLORS[community.category] ?? CATEGORY_COLORS.other;

    return (
        <div className="um-editorial um-communities">
            <Link to="/communities" className="back-link">
                <ArrowLeft size={15} /> Communities
            </Link>

            <div
                className="cm-hero"
                style={{ '--cm-accent': accent } as React.CSSProperties}
            >
                <div className="cm-hero-top">
                    <div className="cm-hero-id">
                        <div className="cm-monogram">
                            {community.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="cm-hero-name">{community.name}</h1>
                            <div className="cm-hero-meta">
                                <CategoryBadge category={community.category} />
                                <span>
                                    <Users size={12} /> {community.memberCount} members
                                </span>
                                <span>
                                    <MessageSquare size={12} /> {community.postCount} posts
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="cm-hero-actions">
                        {community.canModerate && (
                            <Link
                                to={`/communities/${community.id}/manage`}
                                className="button button-secondary"
                            >
                                <Settings size={15} /> Manage
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={toggleMembership}
                            disabled={busyMembership}
                            className={
                                community.isMember ? 'button button-secondary' : 'button button-primary'
                            }
                        >
                            {busyMembership ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : community.isMember ? (
                                'Leave community'
                            ) : (
                                <>
                                    <Plus size={16} /> Join
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {community.description && <p className="cm-hero-desc">{community.description}</p>}
            </div>

            {error && (
                <div className="alert alert-error alert-row" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                    <button type="button" onClick={() => setError(null)} aria-label="Dismiss">
                        <X size={15} />
                    </button>
                </div>
            )}

            <div className="cm-tabs" role="tablist">
                {[
                    { value: 'feed', label: 'Feed' },
                    { value: 'members', label: 'Members' },
                    { value: 'about', label: 'About' },
                ].map((t) => (
                    <button
                        key={t.value}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.value}
                        onClick={() => onTabChange(t.value)}
                        className={`cm-tab${tab === t.value ? ' active' : ''}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'feed' && (
                <>
                    {canPost ? (
                        <Composer communityId={community.id} onPosted={handlePosted} onError={setError} />
                    ) : (
                        <div className="alert alert-info">
                            Join this community to post and comment.
                        </div>
                    )}

                    {postsLoading ? (
                        <div className="cm-loading">
                            <Loader2 size={20} className="animate-spin" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">
                                <MessageSquare size={24} strokeWidth={1.5} />
                            </span>
                            <p>
                                No posts yet. {canPost ? 'Start the conversation.' : ''}
                            </p>
                        </div>
                    ) : (
                        <div className="cm-feed">
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
                                <div className="cm-load-more">
                                    <button
                                        type="button"
                                        className="button button-secondary"
                                        onClick={() => loadPosts(false)}
                                    >
                                        Load more
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {tab === 'members' && (
                membersLoading || members === null ? (
                    <div className="cm-loading">
                        <Loader2 size={20} className="animate-spin" />
                    </div>
                ) : (
                    <div className="cm-members">
                        {members.map((mem) => (
                            <div key={mem.id} className="cm-member">
                                <InitialsAvatar name={mem.user.fullName} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <p className="cm-member-name">
                                        {mem.user.fullName || 'UniMARKY student'}
                                    </p>
                                    <p className="cm-member-sub">
                                        {mem.user.department || 'Member'}
                                    </p>
                                </div>
                                {mem.role === 'moderator' && (
                                    <span className="cm-member-role">Mod</span>
                                )}
                            </div>
                        ))}
                    </div>
                )
            )}

            {tab === 'about' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="cm-panel">
                        <h3>About this community</h3>
                        <p>{community.description || 'No description has been added yet.'}</p>
                        <div className="cm-panel-meta">
                            <Calendar size={12} />
                            Created{' '}
                            {community.createdAt ? timeAgo(community.createdAt) : 'recently'}
                        </div>
                    </div>

                    {community.canDelete && (
                        <div className="cm-danger">
                            <h3>Danger zone</h3>
                            <p>
                                Deleting this community removes all of its posts and comments. This
                                cannot be undone.
                            </p>
                            <button
                                type="button"
                                onClick={deleteCommunity}
                                className="button button-secondary cm-btn-danger"
                            >
                                <Trash2 size={15} /> Delete community
                            </button>
                        </div>
                    )}
                </div>
            )}
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
            const url = await uploadImage(file, 'post-images');
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
        <div className="cm-composer">
            <textarea
                value={content}
                maxLength={5000}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Share something with the community..."
                className="cm-textarea"
            />

            {imagePreview && (
                <div className="cm-attach-preview">
                    <img src={imagePreview} alt="Attachment preview" />
                    <button
                        type="button"
                        onClick={() => {
                            setImagePreview(null);
                            setImageUrl(null);
                        }}
                        aria-label="Remove image"
                        className="cm-attach-remove"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="cm-composer-bar">
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onPickImage}
                />
                <button
                    type="button"
                    className="cm-ghost"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <>
                            <ImagePlus size={16} /> Photo
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={submit}
                    disabled={saving || !content.trim()}
                    className="button button-primary"
                >
                    {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <>
                            <Send size={15} /> Post
                        </>
                    )}
                </button>
            </div>
        </div>
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
        <div className="cm-post">
            <div className="cm-post-head">
                <InitialsAvatar name={post.author?.fullName} />
                <div style={{ minWidth: 0 }}>
                    <div className="cm-post-author">{authorName}</div>
                    <div className="cm-post-time">{timeAgo(post.createdAt)}</div>
                </div>
            </div>

            <p className="cm-post-body">{post.content}</p>

            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    loading="lazy"
                    decoding="async"
                    className="cm-post-media"
                />
            )}

            <div className="cm-post-actions">
                <button type="button" onClick={toggleComments} className="cm-post-action">
                    <MessageSquare size={13} />
                    {count} {count === 1 ? 'comment' : 'comments'}
                </button>

                {(isAuthor || canModerate) && (
                    <button
                        type="button"
                        onClick={deletePost}
                        disabled={deleting}
                        className="cm-post-action danger ml"
                    >
                        {deleting ? (
                            <Loader2 size={13} className="animate-spin" />
                        ) : (
                            <Trash2 size={13} />
                        )}
                        Delete
                    </button>
                )}
            </div>

            <AnimatePresence initial={false}>
                {commentsOpen && (
                    <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="cm-comments">
                            {loadingComments ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : comments && comments.length > 0 ? (
                                comments.map((c) => (
                                    <div key={c.id} className="cm-comment">
                                        <InitialsAvatar
                                            name={c.author?.fullName}
                                            className="sm"
                                        />
                                        <div className="cm-comment-body">
                                            <div className="cm-comment-head">
                                                <span className="cm-comment-author">
                                                    {c.author?.fullName || 'UniMARKY student'}
                                                </span>
                                                <span className="cm-comment-time">
                                                    {timeAgo(c.createdAt)}
                                                </span>
                                                {(canModerate ||
                                                    (currentUserId &&
                                                        c.authorId === currentUserId)) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteComment(c.id)}
                                                        aria-label="Delete comment"
                                                        className="cm-comment-delete"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="cm-comment-text">{c.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="cm-comment-time">No comments yet.</p>
                            )}

                            {canComment && (
                                <div className="cm-comment-form">
                                    <InitialsAvatar
                                        name={currentUserName}
                                        className="sm"
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
                                        className="cm-comment-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={addComment}
                                        disabled={sending || !commentText.trim()}
                                        aria-label="Send comment"
                                        className="cm-comment-send"
                                    >
                                        {sending ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}