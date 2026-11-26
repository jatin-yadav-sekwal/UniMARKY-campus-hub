import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, Menu, X } from 'lucide-react';
import logo from '@/assets/unimarky-logo.png';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface AppNavItem {
    title: string;
    href: string;
    roles?: string[];
}

const primaryItems: AppNavItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Marketplace', href: '/marketplace' },
    { title: 'Communities', href: '/communities' },
    { title: 'Study', href: '/study' },
    { title: 'Accommodation', href: '/housing' },
    { title: 'Food', href: '/food' },
    { title: 'Lost & Found', href: '/lost-found' },
];

const roleItems: AppNavItem[] = [
    { title: 'My Listings', href: '/superuser/dashboard', roles: ['superuser', 'userX'] },
    { title: 'Become Superuser', href: '/request-role', roles: ['normal'] },
    { title: 'Admin Panel', href: '/admin/dashboard', roles: ['userX'] },
];

function isActive(href: string, pathname: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));
}

function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
    event.currentTarget.closest('details')?.removeAttribute('open');
}

export function Sidebar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { session, signOut } = useAuth();
    const [role, setRole] = useState('normal');

    useEffect(() => {
        if (!session) return;
        api.get('/profiles/me')
            .then((profile) => setRole(profile.role || 'normal'))
            .catch(() => setRole('normal'));
    }, [session]);

    const items = [
        ...primaryItems,
        ...roleItems.filter((item) => !item.roles || item.roles.includes(role)),
    ];

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <>
            <aside className="sidebar" aria-label="Workspace navigation">
                <Link className="brand" to="/dashboard" aria-label="UniMARKY dashboard">
                    <img src={logo} alt="UniMARKY" className="brand-logo" draggable={false} />
                </Link>
                <span className="side-label">WORKSPACE</span>
                <nav className="side-nav">
                    {items.map((item, index) => {
                        const active = isActive(item.href, pathname);
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={active ? 'active' : undefined}
                                aria-current={active ? 'page' : undefined}
                            >
                                <span className="nav-index">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
                <div className="side-bottom">
                    <Link
                        to="/profile"
                        aria-current={pathname === '/profile' ? 'page' : undefined}
                    >
                        Profile <ArrowUpRight size={14} />
                    </Link>
                    <button type="button" onClick={handleLogout}>
                        Log out <LogOut size={14} />
                    </button>
                </div>
            </aside>

            <header className="mobile-header">
                <Link className="brand" to="/dashboard" aria-label="UniMARKY dashboard">
                    <img src={logo} alt="UniMARKY" className="brand-logo" draggable={false} />
                </Link>
                <details className="mobile-menu">
                    <summary aria-label="Open navigation">
                        <Menu size={21} />
                        <X size={21} />
                    </summary>
                    <nav>
                        {items.map((item) => {
                            const active = isActive(item.href, pathname);
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={closeMenu}
                                    className={active ? 'active' : undefined}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    {item.title}
                                    <ArrowUpRight size={14} />
                                </Link>
                            );
                        })}
                        <Link to="/profile" onClick={closeMenu}>
                            Profile
                            <ArrowUpRight size={14} />
                        </Link>
                        <button type="button" onClick={handleLogout}>
                            Log out
                            <LogOut size={14} />
                        </button>
                    </nav>
                </details>
            </header>
        </>
    );
}
