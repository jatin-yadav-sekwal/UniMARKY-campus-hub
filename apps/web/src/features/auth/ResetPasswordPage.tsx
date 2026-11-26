import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import logo from '@/assets/unimarky-logo.png';
import { supabase } from '@/lib/supabase';
import './auth.css';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [ready, setReady] = useState(false);
    const [checking, setChecking] = useState(true);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let alive = true;

        supabase.auth.getSession().then(({ data }) => {
            if (!alive) return;
            setReady(Boolean(data.session));
            setChecking(false);
        });

        // With detectSessionInUrl the recovery link may resolve just after the
        // first render; pick the session up when it does.
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) setReady(true);
        });

        return () => {
            alive = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Use at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            setError('The two passwords do not match.');
            return;
        }

        setSaving(true);
        const { error: updateError } = await supabase.auth.updateUser({ password });
        setSaving(false);

        if (updateError) {
            setError(updateError.message);
            return;
        }

        navigate('/dashboard', { replace: true });
    };

    return (
        <div className="um-editorial um-auth um-auth-simple">
            <div className="auth-shell">
                <div className="auth-panel">
                    <div className="auth-card">
                        <Link className="auth-brand" to="/" aria-label="UniMARKY home">
                            <img src={logo} alt="UniMARKY" className="brand-logo" draggable={false} />
                        </Link>

                        <header className="auth-card-head">
                            <p className="section-label">
                                <span>02</span>/ Password
                            </p>
                            <h2>Choose a new password</h2>
                            <p>Use at least 8 characters. You will stay signed in afterwards.</p>
                        </header>

                        {checking ? (
                            <div className="um-auth-checking">
                                <Loader2 size={18} className="animate-spin" />
                                <span>Checking your reset link...</span>
                            </div>
                        ) : ready ? (
                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="field">
                                    <label className="field-label" htmlFor="new-password">
                                        New password
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        className="field-input"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label" htmlFor="confirm-password">
                                        Confirm password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        className="field-input"
                                        autoComplete="new-password"
                                        value={confirm}
                                        onChange={(event) => setConfirm(event.target.value)}
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-error" role="alert">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="button button-primary button-block"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        'Save new password'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="alert alert-info" role="status">
                                This reset link is invalid or has expired. Request a new one from
                                the sign-in page.
                            </div>
                        )}

                        <p className="auth-simple-note">
                            <Link to="/auth" className="text-link">
                                <ArrowLeft size={14} /> Back to sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className="page-rules" aria-hidden="true" />
        </div>
    );
}
