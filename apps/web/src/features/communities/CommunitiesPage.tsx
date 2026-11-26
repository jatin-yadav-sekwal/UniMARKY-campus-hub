import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Search, Plus, Users, MessageSquare, X, AlertCircle, Settings } from 'lucide-react';
import {
    CATEGORY_OPTIONS,
    CATEGORY_COLORS,
    CategoryBadge,
    type Community,
    type CommunityCategory,
} from './shared';
import './communities.css';

const LIMIT = 12;

type View = 'all' | 'mine';

export function CommunitiesPage() {
    const navigate = useNavigate();

    const [items, setItems] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);

    const [view, setView] = useState<View>('all');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<CommunityCategory | 'all'>('all');
    const searchRef = useRef<HTMLInputElement>(null);

    const fetchItems = useCallback(
        async (reset: boolean) => {
            const currentOffset = reset ? 0 : offset;
            if (reset) setLoading(true);
            else setLoadingMore(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                params.set('limit', String(LIMIT));
                params.set('offset', String(currentOffset));
                if (search) params.set('q', search);
                if (category !== 'all') params.set('category', category);

                const base = view === 'mine' ? '/communities/mine' : '/communities';
                const data = await api.get(`${base}?${params.toString()}`);

                setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
                setHasMore(data.hasMore);
                setOffset(currentOffset + data.items.length);
            } catch (err: any) {
                setError(err?.message || 'Failed to load communities');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [view, search, category, offset]
    );

    // Reset + refetch when the view/filter changes (debounced for search).
    useEffect(() => {
        const t = setTimeout(() => {
            setOffset(0);
            fetchItems(true);
        }, 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, search, category]);

    const toggleMembership = async (community: Community) => {
        setBusyId(community.id);
        try {
            if (community.isMember) {
                await api.delete(`/communities/${community.id}/join`);
                if (view === 'mine') {
                    setItems((prev) => prev.filter((c) => c.id !== community.id));
                } else {
                    setItems((prev) =>
                        prev.map((c) =>
                            c.id === community.id
                                ? {
                                      ...c,
                                      isMember: false,
                                      memberCount: Math.max(0, c.memberCount - 1),
                                  }
                                : c
                        )
                    );
                }
            } else {
                await api.post(`/communities/${community.id}/join`, {});
                setItems((prev) =>
                    prev.map((c) =>
                        c.id === community.id
                            ? { ...c, isMember: true, memberCount: c.memberCount + 1 }
                            : c
                    )
                );
            }
        } catch (err: any) {
            setError(err?.message || 'Could not update membership');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="um-editorial um-communities">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Communities
                    </p>
                    <h1 className="page-title">
                        Campus <span>communities.</span>
                    </h1>
                    <p className="page-lead">
                        Join clubs and groups across your campus, share updates and talk things
                        through.
                    </p>
                </div>
                <button
                    type="button"
                    className="button button-primary"
                    onClick={() => navigate('/communities/new')}
                >
                    <Plus size={16} /> New community
                </button>
            </header>

            <div className="cm-filters">
                <div className="cm-search">
                    <Search size={16} />
                    <input
                        ref={searchRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search communities..."
                        aria-label="Search communities"
                        className="field-input"
                    />
                </div>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CommunityCategory | 'all')}
                    aria-label="Filter by category"
                    className="field-input cm-select"
                >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>

                <div className="cm-views" role="group" aria-label="Community scope">
                    {(['all', 'mine'] as View[]).map((v) => (
                        <button
                            key={v}
                            type="button"
                            onClick={() => setView(v)}
                            aria-pressed={view === v}
                            className={`cm-view${view === v ? ' active' : ''}`}
                        >
                            {v === 'all' ? 'Discover' : 'My communities'}
                        </button>
                    ))}
                </div>
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

            {loading ? (
                <div className="cm-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="cm-skeleton">
                            <div className="cm-skeleton-line" />
                            <div className="cm-skeleton-line short" />
                            <div className="cm-skeleton-line tiny" />
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <EmptyState view={view} onCreate={() => navigate('/communities/new')} />
            ) : (
                <>
                    <m.div
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                        className="cm-grid"
                    >
                        {items.map((community) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                busy={busyId === community.id}
                                onOpen={() => navigate(`/communities/${community.id}`)}
                                onManage={() => navigate(`/communities/${community.id}/manage`)}
                                onToggle={() => toggleMembership(community)}
                            />
                        ))}
                    </m.div>

                    {hasMore && (
                        <div className="cm-load-more">
                            <button
                                type="button"
                                className="button button-secondary"
                                onClick={() => fetchItems(false)}
                                disabled={loadingMore}
                            >
                                {loadingMore ? <Loader2 size={16} className="animate-spin" /> : 'Load more'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function CommunityCard({
    community,
    busy,
    onOpen,
    onManage,
    onToggle,
}: {
    community: Community;
    busy: boolean;
    onOpen: () => void;
    onManage: () => void;
    onToggle: () => void;
}) {
    const accent = CATEGORY_COLORS[community.category] ?? CATEGORY_COLORS.other;

    return (
        <m.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="cm-card"
            style={{ '--cm-accent': accent } as React.CSSProperties}
        >
            <div className="cm-card-top">
                <h3 className="cm-name" onClick={onOpen}>
                    {community.name}
                </h3>
                <CategoryBadge category={community.category} />
            </div>

            <p className="cm-desc">{community.description || 'No description yet.'}</p>

            <div className="cm-stats">
                <span>
                    <Users size={12} /> {community.memberCount} members
                </span>
                <span>
                    <MessageSquare size={12} /> {community.postCount} posts
                </span>
            </div>

            <div className="cm-actions">
                {community.myRole === 'moderator' && (
                    <button
                        type="button"
                        onClick={onManage}
                        title="Manage community"
                        aria-label="Manage community"
                        className="cm-icon-btn"
                    >
                        <Settings size={16} />
                    </button>
                )}
                <button type="button" onClick={onOpen} className="button button-secondary">
                    Open
                </button>
                <button
                    type="button"
                    onClick={onToggle}
                    disabled={busy}
                    className={community.isMember ? 'button button-ghost' : 'button button-primary'}
                >
                    {busy ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : community.isMember ? (
                        'Leave'
                    ) : (
                        'Join'
                    )}
                </button>
            </div>
        </m.div>
    );
}

function EmptyState({ view, onCreate }: { view: View; onCreate: () => void }) {
    return (
        <div className="empty-state">
            <span className="empty-icon">
                <Users size={24} strokeWidth={1.5} />
            </span>
            <h3>{view === 'mine' ? "You haven't joined any communities" : 'No communities yet'}</h3>
            <p>
                {view === 'mine'
                    ? 'Discover communities to join, or start your own.'
                    : 'Be the first to start one for your campus.'}
            </p>
            <button type="button" className="button button-primary" onClick={onCreate}>
                <Plus size={16} /> New community
            </button>
        </div>
    );
}
