import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ArrowLeft,
    Loader2,
    AlertCircle,
    Trash2,
    ShieldCheck,
    ShieldOff,
    UserMinus,
    Archive,
    ArchiveRestore,
} from 'lucide-react';
import {
    CATEGORY_OPTIONS,
    InitialsAvatar,
    type Community,
    type CommunityCategory,
    type CommunityMember,
} from './shared';

export function ManageCommunityPage() {
    const { id = '' } = useParams();
    const navigate = useNavigate();

    const [community, setCommunity] = useState<Community | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Details form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<CommunityCategory>('other');
    const [savingDetails, setSavingDetails] = useState(false);
    const [togglingArchive, setTogglingArchive] = useState(false);

    // Members
    const [members, setMembers] = useState<CommunityMember[] | null>(null);
    const [membersLoading, setMembersLoading] = useState(true);
    const [memberBusyId, setMemberBusyId] = useState<string | null>(null);

    // Danger zone
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadCommunity = useCallback(async () => {
        try {
            const data: Community = await api.get(`/communities/${id}`);
            setCommunity(data);
            setName(data.name);
            setDescription(data.description ?? '');
            setCategory(data.category);
        } catch (err: any) {
            setError(err?.message || 'Community not found');
        }
    }, [id]);

    const loadMembers = useCallback(async () => {
        try {
            const data = await api.get(`/communities/${id}/members?limit=100`);
            setMembers(data.items);
        } catch (err: any) {
            setError(err?.message || 'Failed to load members');
        } finally {
            setMembersLoading(false);
        }
    }, [id]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await Promise.all([loadCommunity(), loadMembers()]);
            setLoading(false);
        })();
    }, [loadCommunity, loadMembers]);

    const saveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }
        setSavingDetails(true);
        setError(null);
        try {
            const updated = await api.patch(`/communities/${id}`, {
                name: name.trim(),
                description: description.trim(),
                category,
            });
            setCommunity((prev) => (prev ? { ...prev, ...updated } : prev));
        } catch (err: any) {
            setError(err?.message || 'Could not save changes');
        } finally {
            setSavingDetails(false);
        }
    };

    const toggleArchive = async () => {
        if (!community) return;
        setTogglingArchive(true);
        setError(null);
        try {
            const next = !community.isArchived;
            const updated = await api.patch(`/communities/${id}`, { isArchived: next });
            setCommunity((prev) => (prev ? { ...prev, ...updated } : prev));
        } catch (err: any) {
            setError(err?.message || 'Could not update the community');
        } finally {
            setTogglingArchive(false);
        }
    };

    const changeRole = async (member: CommunityMember) => {
        const nextRole = member.role === 'moderator' ? 'member' : 'moderator';
        setMemberBusyId(member.id);
        setError(null);
        try {
            await api.patch(`/communities/${id}/members/${member.id}`, { role: nextRole });
            setMembers((prev) =>
                (prev ?? []).map((mem) =>
                    mem.id === member.id ? { ...mem, role: nextRole } : mem
                )
            );
        } catch (err: any) {
            setError(err?.message || 'Could not change the role');
        } finally {
            setMemberBusyId(null);
        }
    };

    const removeMember = async (member: CommunityMember) => {
        setMemberBusyId(member.id);
        setError(null);
        try {
            await api.delete(`/communities/${id}/members/${member.id}`);
            setMembers((prev) => (prev ?? []).filter((mem) => mem.id !== member.id));
            setCommunity((prev) =>
                prev ? { ...prev, memberCount: Math.max(0, prev.memberCount - 1) } : prev
            );
        } catch (err: any) {
            setError(err?.message || 'Could not remove the member');
        } finally {
            setMemberBusyId(null);
        }
    };

    const deleteCommunity = async () => {
        setDeleting(true);
        setError(null);
        try {
            await api.delete(`/communities/${id}`);
            navigate('/communities');
        } catch (err: any) {
            setError(err?.message || 'Could not delete the community');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    if (!community || !community.canModerate) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <h2 className="text-xl font-bold text-brand-navy dark:text-white">
                    {community ? "You don't have permission to manage this community" : error || 'Community not found'}
                </h2>
                <Link
                    to={community ? `/communities/${id}` : '/communities'}
                    className="text-brand-blue hover:underline text-sm mt-2 inline-block"
                >
                    {community ? 'Back to community' : 'Back to Communities'}
                </Link>
            </div>
        );
    }

    const isOwner = (member: CommunityMember) => member.user.id === community.createdBy;

    return (
        <div className="pb-20 max-w-3xl mx-auto">
            <Link
                to={`/communities/${id}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
                <ArrowLeft className="w-4 h-4" /> Back to community
            </Link>

            <m.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-black tracking-tight text-brand-navy dark:text-white mb-6"
            >
                Manage <span className="text-brand-orange">{community.name}</span>
            </m.h1>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                </div>
            )}

            <div className="space-y-6">
                {/* Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Community details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={saveDetails} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    maxLength={80}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={category}
                                    onValueChange={(v) => setCategory(v as CommunityCategory)}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_OPTIONS.map((o) => (
                                            <SelectItem key={o.value} value={o.value}>
                                                {o.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={description}
                                    maxLength={1000}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={toggleArchive}
                                    disabled={togglingArchive}
                                    className="rounded-full"
                                >
                                    {togglingArchive ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : community.isArchived ? (
                                        <>
                                            <ArchiveRestore className="w-4 h-4 mr-2" /> Unarchive
                                        </>
                                    ) : (
                                        <>
                                            <Archive className="w-4 h-4 mr-2" /> Archive
                                        </>
                                    )}
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={savingDetails}
                                    className="rounded-full bg-brand-navy hover:bg-brand-navy/90 text-white"
                                >
                                    {savingDetails ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Save changes'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Members */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Members{' '}
                            <span className="text-sm font-normal text-muted-foreground">
                                ({community.memberCount})
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {membersLoading || members === null ? (
                            <div className="flex h-24 items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />
                            </div>
                        ) : members.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No members yet.</p>
                        ) : (
                            members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card"
                                >
                                    <InitialsAvatar name={member.user.fullName} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold truncate text-brand-navy dark:text-white">
                                            {member.user.fullName || 'UniMARKY student'}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {member.user.department || 'Member'}
                                            {isOwner(member) && ' · Owner'}
                                        </p>
                                    </div>

                                    {member.role === 'moderator' && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange shrink-0">
                                            Mod
                                        </span>
                                    )}

                                    {memberBusyId === member.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
                                    ) : (
                                        <div className="flex items-center gap-1 shrink-0">
                                            {community.canManage && !isOwner(member) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => changeRole(member)}
                                                    title={
                                                        member.role === 'moderator'
                                                            ? 'Demote to member'
                                                            : 'Promote to moderator'
                                                    }
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-brand-orange"
                                                >
                                                    {member.role === 'moderator' ? (
                                                        <ShieldOff className="w-4 h-4" />
                                                    ) : (
                                                        <ShieldCheck className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            )}
                                            {!isOwner(member) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeMember(member)}
                                                    title="Remove from community"
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Danger zone */}
                {community.canDelete && (
                    <Card className="border-red-500/30">
                        <CardHeader>
                            <CardTitle className="text-lg text-red-600 dark:text-red-400">
                                Danger zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground mb-3">
                                Deleting this community permanently removes all of its posts and
                                comments. This cannot be undone.
                            </p>
                            {confirmDelete ? (
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={deleteCommunity}
                                        disabled={deleting}
                                        className="rounded-full bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {deleting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Yes, delete permanently'
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setConfirmDelete(false)}
                                        disabled={deleting}
                                        className="rounded-full"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmDelete(true)}
                                    className="rounded-full border-red-500/40 text-red-600 hover:bg-red-500/10 dark:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete community
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
