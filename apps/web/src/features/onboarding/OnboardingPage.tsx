import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UniversitySelector } from './components/UniversitySelector';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export function OnboardingPage() {
    const { user } = useAuth();
    const [university, setUniversity] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Determine if we need to ask for a password
    // If the user signed up with 'password' (email/pass), they already have one.
    // If they signed up with 'google' (oauth), they might not.
    // user.app_metadata.provider is usually 'email' or 'google' (or 'github' etc)
    const isSocialLogin = user?.app_metadata?.provider !== 'email';

    const navigate = useNavigate();

    const handleSubmit = async () => {
        // Validation
        if (!university) return;
        if (!mobileNumber) return;

        // Only require password if it's a social login user
        if (isSocialLogin && !password) return;

        if (mobileNumber.length !== 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        if (isSocialLogin && password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            // 1. If it's a social login user setting a password, update Supabase Auth
            if (isSocialLogin && password) {
                const { error: authError } = await supabase.auth.updateUser({ password: password });
                if (authError) {
                    throw new Error(`Failed to set password: ${authError.message}`);
                }
            }

            // 2. Update Profile in Backend (University, Mobile)
            const payload = {
                universityName: university,
                mobileNumber,
            };

            // Note: We DO NOT send password to backend anymore. 
            // Supabase Auth handles it.

            await api.patch('/profiles/onboarding', payload);
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to complete onboarding. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <motion.div
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
                                placeholder="10-digit mobile number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            />
                        </div>

                        {isSocialLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Set Account Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Since you logged in with Google, set a password to login with email later.
                                </p>
                            </div>
                        )}

                        <Button
                            className="w-full mt-4"
                            onClick={handleSubmit}
                            disabled={!university || !mobileNumber || (isSocialLogin && !password) || loading}
                        >
                            {loading ? "Setting up..." : "Complete Setup"}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
