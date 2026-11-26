import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
                        // Confirmation links return to /auth so the gate can
                        // route to onboarding on first login.
                        emailRedirectTo: `${window.location.origin}/auth`,
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
        <div className="auth-card">
            <header className="auth-card-head">
                <p className="section-label">
                    <span>{mode === 'login' ? '01' : '02'}</span>/{' '}
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                </p>
                <h2>{mode === 'login' ? 'Welcome back' : 'Join Unimarky'}</h2>
                <p>
                    {mode === 'login'
                        ? 'Sign in to continue to your campus dashboard.'
                        : 'Create an account to get started.'}
                </p>
            </header>

            <SocialAuth />

            <div className="auth-divider">
                <span>or continue with email</span>
            </div>

            <div className="segmented" role="group" aria-label="Authentication mode">
                <button
                    type="button"
                    aria-pressed={mode === 'login'}
                    onClick={() => setMode('login')}
                >
                    Log in
                </button>
                <button
                    type="button"
                    aria-pressed={mode === 'signup'}
                    onClick={() => setMode('signup')}
                >
                    Sign up
                </button>
            </div>

            <form onSubmit={handleAuth} className="auth-form" noValidate={false}>
                {mode === 'signup' && (
                    <div className="field">
                        <label className="field-label" htmlFor="fullName">
                            Full name
                        </label>
                        <input
                            id="fullName"
                            className="field-input"
                            placeholder="John Doe"
                            autoComplete="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="field">
                    <label className="field-label" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="field-input"
                        placeholder="student@university.edu"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="field">
                    <label className="field-label" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="field-input"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <div className="alert alert-error" role="alert">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="alert alert-success" role="status">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    className="button button-primary button-block"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
            </form>

            <p className="auth-legal">
                By continuing you agree to our <Link to="/terms">Terms</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>
    );
}
