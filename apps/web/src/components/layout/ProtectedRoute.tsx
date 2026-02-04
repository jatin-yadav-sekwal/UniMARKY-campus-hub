import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ requireOnboarding = true }: { requireOnboarding?: boolean }) {
    const { user, loading } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setIsChecking(false);
            return;
        }

        // We only check if we require it (optimization).
        // But if requireOnboarding is false (on the onboarding page), we don't *block* but we don't redirect away typically.
        // Actually, if user is ALREADY onboarded, maybe redirect away from /onboarding? 
        // For now, simple guard:

        if (requireOnboarding) {
            import('@/lib/api').then(({ api }) => {
                api.get('/profiles/me')
                    .then((profile: any) => {
                        if (profile.onboardingCompleted) {
                            setOnboardingComplete(true);
                        } else {
                            navigate('/onboarding');
                        }
                    })
                    .catch(() => {
                        // API error (maybe network or 403 ONBOARDING_REQUIRED triggered by middleware?)
                        // If middleware blocks /me, we have a problem. 
                        // Check auth.ts: /me is usually safe? 
                        // auth.ts blocks if !onboardingCompleted AND !isOnboardingRoute.
                        // Path for /me is /api/profiles/me.
                        // We need to EXEMPT /api/profiles/me from the middleware block too!
                        navigate('/onboarding');
                    })
                    .finally(() => setIsChecking(false));
            });
        } else {
            setIsChecking(false);
        }

    }, [user, requireOnboarding, navigate]);

    if (loading || (requireOnboarding && isChecking && user)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/auth" replace />;
}
