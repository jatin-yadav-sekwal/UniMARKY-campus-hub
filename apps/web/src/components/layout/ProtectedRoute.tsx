import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ requireOnboarding = true }: { requireOnboarding?: boolean }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for the auth state to resolve before deciding anything; otherwise
        // a logged-in user can be bounced to /onboarding before /profiles/me has
        // had a chance to answer.
        if (loading) return;

        if (!user) {
            setIsChecking(false);
            return;
        }

        let cancelled = false;
        // Entering (or re-entering) the gate must not inherit a stale "already
        // checked" flag: keep the spinner up until the fresh profile check
        // resolves. Without this the render below sees onboardingComplete === null
        // while isChecking is false and redirects to /onboarding, which then
        // bounces an onboarded user back to /dashboard - an endless loop that
        // renders a blank page.
        setIsChecking(true);
        setOnboardingComplete(null);
        setError(null);

        import('@/lib/api').then(({ api }) => {
            api.get('/profiles/me')
                .then((profile: any) => {
                    if (cancelled) return;
                    // Single source of truth: the API always answers 200 here.
                    // Returning users have onboardingCompleted === true.
                    setOnboardingComplete(profile?.onboardingCompleted === true);
                })
                .catch((err) => {
                    if (cancelled) return;
                    const message = String(err?.message ?? '');

                    // Network/CORS problems deserve their own screen.
                    if (
                        message.includes('Network') ||
                        message.includes('Failed to fetch') ||
                        message.includes('Connection') ||
                        message.includes('unreachable')
                    ) {
                        setError("Connection Error: Unable to reach the server. Please check your connection or try again later.");
                    } else {
                        // Any other failure (e.g. an older API returning 403)
                        // means we cannot confirm onboarding: send them there.
                        setOnboardingComplete(false);
                    }
                })
                .finally(() => {
                    if (!cancelled) setIsChecking(false);
                });
        });

        return () => {
            cancelled = true;
        };
    }, [user?.id, loading]);

    if (loading || (user && isChecking)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" state={{ returnTo: location.pathname }} replace />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 text-center">
                <div className="text-red-500 font-bold text-xl">Connection Error</div>
                <p className="text-muted-foreground">{error}</p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (requireOnboarding && !onboardingComplete) {
        return <Navigate to="/onboarding" replace />;
    }

    if (!requireOnboarding && onboardingComplete) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

