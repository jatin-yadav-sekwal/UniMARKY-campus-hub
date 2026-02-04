import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-9xl font-extrabold tracking-tighter text-muted-foreground/20">404</h1>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute"
            >
                <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
            </motion.div>
        </div>
    );
}
