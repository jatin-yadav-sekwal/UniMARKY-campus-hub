import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';

export function AuthPage() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const returnTo = (location.state as any)?.returnTo || '/dashboard';

    // If user is already logged in or just logged in, redirect
    useEffect(() => {
        if (user) {
            navigate(returnTo, { replace: true });
        }
    }, [user, returnTo, navigate]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <AuthForm />
            </motion.div>
        </div>
    );
}
