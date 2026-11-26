import { useState } from 'react';
import { m } from 'motion/react';
import { UniversitySelector } from './components/UniversitySelector';
import { api } from '@/lib/api';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import './onboarding.css';

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
            <div className="um-editorial um-onboarding">
                <div className="ob-loading">
                    <Loader2 size={20} className="animate-spin" />
                </div>
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
        <div className="um-editorial um-onboarding">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="ob-shell"
            >
                <div className="ob-card">
                    <p className="section-label">
                        <span>01</span>/ Welcome
                    </p>
                    <h1 className="ob-title">Set up your profile.</h1>
                    <p className="ob-lead">
                        A couple of details and you are ready for the campus.
                    </p>

                    <div className="form-stack">
                        <div className="field">
                            <label className="field-label" htmlFor="university">
                                University
                            </label>
                            <UniversitySelector value={university} onChange={setUniversity} />
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="mobile">
                                Mobile number
                            </label>
                            <input
                                id="mobile"
                                type="tel"
                                inputMode="numeric"
                                placeholder="10-digit mobile number"
                                value={mobileNumber}
                                onChange={(e) =>
                                    setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
                                }
                                className="field-input"
                            />
                        </div>

                        {isSocialLogin && (
                            <div className="field">
                                <label className="field-label" htmlFor="password">
                                    Set a password (optional)
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="field-input"
                                />
                                <p className="ob-note">
                                    You signed in with {user.app_metadata?.provider}. Set a password
                                    if you also want to log in with email.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="ob-actions">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!university || mobileNumber.length !== 10 || loading}
                            className="button button-primary"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Setting up...
                                </>
                            ) : (
                                "Complete setup"
                            )}
                        </button>
                    </div>
                </div>
            </m.div>
        </div>
    );
}
