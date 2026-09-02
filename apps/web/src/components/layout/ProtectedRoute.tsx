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
        if (!user) {
            setIsChecking(false);
            return;
        }

        let cancelled = false;
        import('@/lib/api').then(({ api }) => {
            api.get('/profiles/me')
                .then((profile: any) => {
                    if (cancelled) return;
                    if (profile?.onboardingCompleted) {
                        setOnboardingComplete(true);
                    } else {
                        setOnboardingComplete(false);
                    }
                })
                .catch((err) => {
                    if (cancelled) return;
                    console.error("Failed to check onboarding status:", err);

                    // If it's a network error/CORS, show an error state instead of redirecting or silently failing
                    if (err.message && (err.message.includes("Network Error") || err.message.includes("Failed to fetch"))) {
                        setError("Connection Error: Unable to reach the server. Please check your connection or try again later.");
                    } else {
                        // 404/401 -> Onboarding not completed
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
    }, [user]);

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

