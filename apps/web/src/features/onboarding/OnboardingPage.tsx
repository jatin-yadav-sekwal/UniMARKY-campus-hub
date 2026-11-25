import { useState } from 'react';
import { m } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UniversitySelector } from './components/UniversitySelector';
import { api } from '@/lib/api';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function OnboardingPage() {
    const { user, loading: authLoading } = useAuth();
    const [university, setUniversity] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Not signed in (or the session is still loading) — never show the form
    // to an anonymous visitor, and never guess the login provider before the
    // user object exists.
    if (authLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Email signups already have a password. Google/other OAuth users may not,
    // so we offer (but do not require) setting one.
    const isSocialLogin = user.app_metadata?.provider !== 'email';

    const handleSubmit = async () => {
        const trimmedMobile = mobileNumber.trim();

        if (!university) {
            alert("Please select your university");
            return;
        }

        if (trimmedMobile.length !== 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        if (isSocialLogin && password && password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            // 1. Social users may optionally set a password for later email login.
            if (isSocialLogin && password) {
                const { error: authError } = await supabase.auth.updateUser({ password });
                if (authError) {
                    throw new Error(`Failed to set password: ${authError.message}`);
                }
            }

            // 2. Create/complete the profile in the backend.
            await api.patch('/profiles/onboarding', {
                universityName: university,
                mobileNumber: trimmedMobile,
                fullName:
                    user.user_metadata?.full_name ??
                    user.user_metadata?.name ??
                    undefined,
            });

            navigate('/dashboard', { replace: true });
        } catch (error: any) {
            console.error(error);
            alert(error?.message || "Failed to complete onboarding. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to Unimarky! 🎓</CardTitle>
                        <CardDescription>
                            Let's set up your profile to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select University</Label>
                            <UniversitySelector value={university} onChange={setUniversity} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                inputMode="numeric"
                                placeholder="10-digit mobile number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            />
                        </div>

                        {isSocialLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Set a Password (optional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    You signed in with {user.app_metadata?.provider}. Set a password if you also
                                    want to log in with email.
                                </p>
                            </div>
                        )}

                        <Button
                            className="w-full mt-4"
                            onClick={handleSubmit}
                            disabled={!university || mobileNumber.length !== 10 || loading}
                        >
                            {loading ? "Setting up..." : "Complete Setup"}
                        </Button>
                    </CardContent>
                </Card>
            </m.div>
        </div>
    );
}
