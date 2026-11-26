import { cn } from '@/lib/utils';

/** --- Types (mirror apps/api/server/routes/communities.ts) --- */

export type CommunityCategory =
    | 'academic'
    | 'tech'
    | 'sports'
    | 'cultural'
    | 'housing'
    | 'placement'
    | 'other';

export interface Author {
    id: string | null;
    fullName: string | null;
    role?: string | null;
}

export interface Community {
    id: string;
    name: string;
    description: string | null;
    category: CommunityCategory;
    memberCount: number;
    postCount: number;
    createdAt: string;
    createdBy?: string | null;
    isArchived?: boolean;
    isMember?: boolean;
    myRole?: 'member' | 'moderator' | null;
    canModerate?: boolean;
    canManage?: boolean;
    canDelete?: boolean;
}

export interface CommunityPost {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    authorId: string | null;
    author: Author | null;
    commentCount: number;
}

export interface CommunityComment {
    id: string;
    content: string;
    createdAt: string;
    authorId: string | null;
    author: Author | null;
}

export interface CommunityMember {
    id: string;
    role: 'member' | 'moderator';
    joinedAt: string;
    user: {
        id: string;
        fullName: string | null;
        department: string | null;
    };
}

/** --- Constants --- */

export const CATEGORY_OPTIONS: { value: CommunityCategory; label: string }[] = [
    { value: 'academic', label: 'Academic' },
    { value: 'tech', label: 'Tech' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'housing', label: 'Housing' },
    { value: 'placement', label: 'Placement' },
    { value: 'other', label: 'Other' },
];

export const CATEGORY_LABELS = Object.fromEntries(
    CATEGORY_OPTIONS.map((o) => [o.value, o.label])
) as Record<CommunityCategory, string>;

/** Accent colour used for a community's hairline + label, keyed by category. */
export const CATEGORY_COLORS: Record<CommunityCategory, string> = {
    academic: '#4b4fb0',
    tech: '#2f6bd8',
    sports: '#1f8a63',
    cultural: '#c2537a',
    housing: '#b4762a',
    placement: '#2b8fa8',
    other: '#6b6760',
};

/** --- Helpers --- */

export function initials(name?: string | null): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

export function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** --- Small presentational bits --- */

export function InitialsAvatar({ name, className }: { name?: string | null; className?: string }) {
    return (
        <div className={cn('cm-avatar', className)} aria-hidden="true">
            {initials(name)}
        </div>
    );
}

export function CategoryBadge({ category }: { category: CommunityCategory }) {
    const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other;
    return (
        <span className="cm-badge" style={{ color }}>
            {CATEGORY_LABELS[category] ?? category}
        </span>
    );
}
