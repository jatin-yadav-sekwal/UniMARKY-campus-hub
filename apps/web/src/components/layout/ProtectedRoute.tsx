import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ requireOnboarding = true }: { requireOnboarding?: boolean }) {
    const { user, loading } = useAuth();
    const location = useLocation();
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
                    .catch((err) => {
                        console.error("Failed to check onboarding status:", err);
                        // Only redirect if explicitly not found or another logical condition 
                        // If it's a network error (CORS), do NOT redirect to /onboarding as that causes loop
                        // Maybe show an error state instead?
                        if (err.message && (err.message.includes("Network Error") || err.message.includes("Failed to fetch"))) {
                            // Let it render children or show a specific error component?
                            // For now, let's stop checking and NOT redirect. 
                            // The dashboard might fail to load data, but at least no loop.
                        } else {
                            // If it's a 404 on profile, maybe we do need onboarding?
                            // But let's be careful.
                            navigate('/onboarding');
                        }
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

    return user ? <Outlet /> : <Navigate to="/auth" state={{ returnTo: location.pathname }} replace />;
}
