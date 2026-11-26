import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Home, ShoppingBag, Users } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/components/layout/file.svg';
import './auth.css';

const benefits = [
    { icon: ShoppingBag, label: 'Marketplace — buy, sell and trade on campus' },
    { icon: Users, label: 'Communities and events that matter to you' },
    { icon: BookOpen, label: 'Study resources and shared learning spaces' },
    { icon: Home, label: 'Housing and food options near your campus' },
];

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
        <div className="um-editorial um-auth">
            <div className="auth-shell">
                <section className="auth-intro">
                    <Link to="/" className="auth-brand" aria-label="UniMARKY home">
                        <img src={logo} alt="UniMARKY" className="brand-logo" draggable={false} />
                    </Link>

                    <div className="auth-intro-body">
                        <p className="section-label">
                            <span>01</span>/ Account
                        </p>
                        <h1>
                            Everything campus,
                            <br />
                            <span>through one sign-in.</span>
                        </h1>
                        <p className="lead">
                            Sign in to reach the whole Unimarky ecosystem — from the marketplace to
                            communities, study resources, housing and food.
                        </p>
                        <ul className="auth-points">
                            {benefits.map(({ icon: Icon, label }) => (
                                <li key={label}>
                                    <Icon size={17} strokeWidth={1.6} />
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="auth-foot" aria-hidden="true">
                        <span>UNIMARKY / CAMPUS LIFE</span>
                        <span>SIGN IN 01</span>
                    </div>
                </section>

                <main className="auth-panel">
                    <AuthForm />
                </main>
            </div>
            <div className="page-rules" aria-hidden="true" />
        </div>
    );
}
