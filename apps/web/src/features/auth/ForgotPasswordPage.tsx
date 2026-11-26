import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import logo from '@/assets/unimarky-logo.png';
import { supabase } from '@/lib/supabase';
import './auth.css';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        // Always answer the same way so this page cannot be used to discover
        // which email addresses have an account.
        await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        setLoading(false);
        setSent(true);
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
                                <span>01</span>/ Password
                            </p>
                            <h2>Reset your password</h2>
                            <p>We will email you a link to choose a new password.</p>
                        </header>

                        {sent ? (
                            <div className="alert alert-success" role="status">
                                If an account exists for {email.trim()}, the reset link is on its
                                way. Check your inbox and spam folder.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="field">
                                    <label className="field-label" htmlFor="reset-email">
                                        Email
                                    </label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        className="field-input"
                                        placeholder="student@university.edu"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="button button-primary button-block"
                                    disabled={loading || !email.trim()}
                                >
                                    {loading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Mail size={15} /> Send reset link
                                        </>
                                    )}
                                </button>
                            </form>
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
