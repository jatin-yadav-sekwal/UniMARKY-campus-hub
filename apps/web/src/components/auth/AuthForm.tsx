import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { SocialAuth } from '@/features/auth/components/SocialAuth';

export function AuthForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                setMessage("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-zinc-900 border border-border/50">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tighter text-brand-navy dark:text-white">
                    {mode === 'login' ? 'Welcome Back' : 'Join Unmarky'}
                </h2>
                <p className="mt-2 text-sm text-brand-blue/80">
                    {mode === 'login'
                        ? 'Enter your credentials or use social login'
                        : 'Create an account to get started'}
                </p>
            </div>

            <SocialAuth />

            <Tabs
                defaultValue="login"
                onValueChange={(v) => setMode(v as 'login' | 'signup')}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <form onSubmit={handleAuth} className="space-y-4">
                            {mode === 'signup' && (
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="student@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-900/20">
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md dark:bg-green-900/20">
                                    {message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {mode === 'login' ? 'Sign In' : 'Create Account'}
                            </Button>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </Tabs>
        </div>
    );
}
