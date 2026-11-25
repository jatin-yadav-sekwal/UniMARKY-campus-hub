import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Plus, Users, MessageSquare, X, AlertCircle, Settings } from 'lucide-react';
import {
    CATEGORY_OPTIONS,
    CATEGORY_GRADIENTS,
    CategoryBadge,
    type Community,
    type CommunityCategory,
} from './shared';

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
        <div className="relative min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <m.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                    >
                        <span className="text-brand-navy">COMMUNIT</span>
                        <span className="bg-gradient-to-r from-brand-blue to-brand-orange bg-clip-text text-transparent">
                            IES
                        </span>
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                    >
                        Join clubs and groups across your campus, share updates and talk things through.
                    </m.p>
                </div>

                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Button
                        onClick={() => navigate('/communities/new')}
                        className="rounded-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Community
                    </Button>
                </m.div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        ref={searchRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search communities…"
                        className="pl-9"
                    />
                </div>

                <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as CommunityCategory | 'all')}
                >
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {CATEGORY_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex rounded-full border border-border/60 p-1 shrink-0">
                    {(['all', 'mine'] as View[]).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={
                                'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ' +
                                (view === v
                                    ? 'bg-brand-navy text-white'
                                    : 'text-muted-foreground hover:text-foreground')
                            }
                        >
                            {v === 'all' ? 'Discover' : 'My Communities'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError(null)} aria-label="Dismiss">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                </div>
            ) : items.length === 0 ? (
                <EmptyState view={view} onCreate={() => navigate('/communities/new')} />
            ) : (
                <>
                    <m.div
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
                        <div className="flex justify-center mt-8">
                            <Button
                                variant="outline"
                                onClick={() => fetchItems(false)}
                                disabled={loadingMore}
                                className="rounded-full"
                            >
                                {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load more'}
                            </Button>
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
    return (
        <m.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <Card className="h-full overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div
                    className={`h-1.5 w-full bg-gradient-to-r ${CATEGORY_GRADIENTS[community.category]}`}
                />
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle
                            className="text-lg font-bold text-brand-navy dark:text-white line-clamp-1 cursor-pointer hover:underline"
                            onClick={onOpen}
                        >
                            {community.name}
                        </CardTitle>
                        <CategoryBadge category={community.category} />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {community.description || 'No description yet.'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {community.memberCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> {community.postCount}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {community.myRole === 'moderator' && (
                            <Button
                                onClick={onManage}
                                variant="outline"
                                size="icon"
                                title="Manage community"
                                aria-label="Manage community"
                                className="rounded-full shrink-0"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        )}
                        <Button onClick={onOpen} variant="outline" className="flex-1 rounded-full">
                            Open
                        </Button>
                        <Button
                            onClick={onToggle}
                            disabled={busy}
                            variant={community.isMember ? 'ghost' : 'default'}
                            className={
                                'flex-1 rounded-full ' +
                                (!community.isMember
                                    ? 'bg-brand-navy hover:bg-brand-navy/90 text-white'
                                    : 'text-muted-foreground hover:text-foreground')
                            }
                        >
                            {busy ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : community.isMember ? (
                                'Leave'
                            ) : (
                                'Join'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </m.div>
    );
}

function EmptyState({ view, onCreate }: { view: View; onCreate: () => void }) {
    return (
        <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-2xl">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-bold text-brand-navy dark:text-white">
                {view === 'mine' ? "You haven't joined any communities" : 'No communities yet'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
                {view === 'mine'
                    ? 'Discover communities to join, or start your own.'
                    : 'Be the first to start one for your campus.'}
            </p>
            <Button onClick={onCreate} className="rounded-full bg-brand-navy hover:bg-brand-navy/90 text-white">
                <Plus className="w-4 h-4 mr-2" /> New Community
            </Button>
        </div>
    );
}
