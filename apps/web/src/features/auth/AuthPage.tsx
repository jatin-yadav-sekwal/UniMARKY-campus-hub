import { motion } from 'motion/react';
import { AuthForm } from '@/components/auth/AuthForm';

export function AuthPage() {
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
