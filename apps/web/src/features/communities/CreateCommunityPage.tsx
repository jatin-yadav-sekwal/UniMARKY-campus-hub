import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Loader2, AlertCircle, Users } from 'lucide-react';
import { CATEGORY_OPTIONS, CATEGORY_GRADIENTS, type CommunityCategory } from './shared';

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
        <div className="pb-20 max-w-2xl mx-auto">
            <Link
                to="/communities"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
                <ArrowLeft className="w-4 h-4" /> Communities
            </Link>

            <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="overflow-hidden border border-border/60 shadow-sm">
                    <div className={`h-2 w-full bg-gradient-to-r ${CATEGORY_GRADIENTS[category]}`} />
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy/5">
                            <Users className="w-7 h-7 text-brand-navy dark:text-white" />
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight text-brand-navy dark:text-white">
                            Start a community
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Bring your campus around a shared interest. You'll be its first moderator.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Community name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    maxLength={80}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Coding Club, Hostel Football"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be unique within your university.
                                </p>
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
                                    placeholder="What is this community about? Who should join?"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {description.length}/1000
                                </p>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    {error}
                                </p>
                            )}

                            <div className="flex gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/communities')}
                                    className="flex-1 rounded-full"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving || name.trim().length < 3}
                                    className="flex-1 rounded-full bg-brand-navy hover:bg-brand-navy/90 text-white"
                                >
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Create community'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </m.div>
        </div>
    );
}
