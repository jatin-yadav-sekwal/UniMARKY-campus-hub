import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
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
import './communities.css';

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
            <div className="um-editorial um-communities">
                <div className="cm-loading">
                    <Loader2 size={22} className="animate-spin" />
                    <span>Loading community...</span>
                </div>
            </div>
        );
    }

    if (!community || !community.canModerate) {
        return (
            <div className="um-editorial um-communities">
                <div className="empty-state">
                    <span className="empty-icon">
                        <AlertCircle size={24} strokeWidth={1.5} />
                    </span>
                    <h3>
                        {community
                            ? "You don't have permission to manage this community"
                            : error || 'Community not found'}
                    </h3>
                    <Link
                        to={community ? `/communities/${id}` : '/communities'}
                        className="button button-secondary"
                    >
                        {community ? 'Back to community' : 'Back to communities'}
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = (member: CommunityMember) => member.user.id === community.createdBy;

    return (
        <div className="um-editorial um-communities">
            <div className="cm-wide">
                <Link to={`/communities/${id}`} className="back-link">
                    <ArrowLeft size={15} /> Back to community
                </Link>

                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>03</span>/ Manage
                        </p>
                        <h1 className="page-title">
                            Manage <span>{community.name}</span>
                        </h1>
                    </div>
                </header>

                {error && (
                    <div className="alert alert-error alert-row" role="alert">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Details */}
                    <form onSubmit={saveDetails} className="form-card">
                        <div className="form-stack">
                            <h2 className="section-label" style={{ margin: 0 }}>
                                Community details
                            </h2>

                            <div className="field">
                                <label className="field-label" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    value={name}
                                    maxLength={80}
                                    onChange={(e) => setName(e.target.value)}
                                    className="field-input"
                                />
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="category">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                                    className="field-input"
                                >
                                    {CATEGORY_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    maxLength={1000}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="field-input"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={toggleArchive}
                                disabled={togglingArchive}
                                className="button button-secondary"
                            >
                                {togglingArchive ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : community.isArchived ? (
                                    <>
                                        <ArchiveRestore size={15} /> Unarchive
                                    </>
                                ) : (
                                    <>
                                        <Archive size={15} /> Archive
                                    </>
                                )}
                            </button>

                            <button
                                type="submit"
                                disabled={savingDetails}
                                className="button button-primary"
                            >
                                {savingDetails ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    'Save changes'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Members */}
                    <div className="cm-panel">
                        <h3>
                            Members{' '}
                            <span className="cm-member-role">({community.memberCount})</span>
                        </h3>

                        {membersLoading || members === null ? (
                            <div className="cm-loading" style={{ padding: '32px 0' }}>
                                <Loader2 size={18} className="animate-spin" />
                            </div>
                        ) : members.length === 0 ? (
                            <p>No members yet.</p>
                        ) : (
                            <div className="cm-member-list">
                                {members.map((member) => (
                                    <div key={member.id} className="cm-member">
                                        <InitialsAvatar name={member.user.fullName} />
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <p className="cm-member-name">
                                                {member.user.fullName || 'UniMARKY student'}
                                            </p>
                                            <p className="cm-member-sub">
                                                {member.user.department || 'Member'}
                                                {isOwner(member) && ' · Owner'}
                                            </p>
                                        </div>

                                        {member.role === 'moderator' && (
                                            <span className="cm-member-role">Mod</span>
                                        )}

                                        {memberBusyId === member.id ? (
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                                style={{ color: '#8f8b83', flex: 'none' }}
                                            />
                                        ) : (
                                            <div className="cm-member-actions">
                                                {community.canManage && !isOwner(member) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => changeRole(member)}
                                                        title={
                                                            member.role === 'moderator'
                                                                ? 'Demote to member'
                                                                : 'Promote to moderator'
                                                        }
                                                        aria-label={
                                                            member.role === 'moderator'
                                                                ? 'Demote to member'
                                                                : 'Promote to moderator'
                                                        }
                                                        className="cm-icon-btn sm"
                                                    >
                                                        {member.role === 'moderator' ? (
                                                            <ShieldOff size={15} />
                                                        ) : (
                                                            <ShieldCheck size={15} />
                                                        )}
                                                    </button>
                                                )}
                                                {!isOwner(member) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMember(member)}
                                                        title="Remove from community"
                                                        aria-label="Remove from community"
                                                        className="cm-icon-btn sm"
                                                    >
                                                        <UserMinus size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Danger zone */}
                    {community.canDelete && (
                        <div className="cm-danger">
                            <h3>Danger zone</h3>
                            <p>
                                Deleting this community permanently removes all of its posts and
                                comments. This cannot be undone.
                            </p>
                            {confirmDelete ? (
                                <div className="cm-danger-actions">
                                    <button
                                        type="button"
                                        onClick={deleteCommunity}
                                        disabled={deleting}
                                        className="button button-primary cm-btn-solid-danger"
                                    >
                                        {deleting ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            'Yes, delete permanently'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmDelete(false)}
                                        disabled={deleting}
                                        className="button button-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(true)}
                                    className="button button-secondary cm-btn-danger"
                                >
                                    <Trash2 size={15} /> Delete community
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}