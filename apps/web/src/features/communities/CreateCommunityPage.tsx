import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { CATEGORY_OPTIONS, CATEGORY_COLORS, type CommunityCategory } from './shared';
import './communities.css';

export function CreateCommunityPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<CommunityCategory>('other');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const created = await api.post('/communities', {
                name: name.trim(),
                description: description.trim() || undefined,
                category,
            });
            navigate(`/communities/${created.id}`);
        } catch (err: any) {
            const msg = String(err?.message ?? '');
            setError(
                msg.includes('Forbidden')
                    ? 'You need publisher access to create communities. Request it from your dashboard.'
                    : msg || 'Could not create the community'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="um-editorial um-communities">
            <div className="cm-form-wrap">
                <Link to="/communities" className="back-link">
                    <ArrowLeft size={15} /> Communities
                </Link>

                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>02</span>/ New community
                        </p>
                        <h1 className="page-title">
                            Start a <span>community.</span>
                        </h1>
                        <p className="page-lead">
                            Bring your campus around a shared interest. You'll be its first
                            moderator.
                        </p>
                    </div>
                </header>

                <form
                    onSubmit={submit}
                    className="form-card"
                    style={{ borderTop: `2px solid ${CATEGORY_COLORS[category]}` }}
                >
                    <div className="form-stack">
                        <div className="field">
                            <label className="field-label" htmlFor="name">
                                Community name
                            </label>
                            <input
                                id="name"
                                value={name}
                                maxLength={80}
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Coding Club, Hostel Football"
                                className="field-input"
                            />
                            <p className="form-note">Must be unique within your university.</p>
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
                                placeholder="What is this community about? Who should join?"
                                className="field-input"
                            />
                            <p className="cm-counter">{description.length}/1000</p>
                        </div>

                        {error && (
                            <div className="alert alert-error alert-row" role="alert">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/communities')}
                            className="button button-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || name.trim().length < 3}
                            className="button button-primary"
                        >
                            {saving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                'Create community'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}