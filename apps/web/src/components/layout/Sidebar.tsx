import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    Newspaper,
    BookOpen,
    Coffee,
    Home,
    Shield,
    ShieldCheck,
    Crown,
} from 'lucide-react';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[];  // if undefined, visible to all
}

const allItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { title: 'Lost & Found', href: '/lost-found', icon: MapPin },
    { title: 'Unimedia', href: '/unimedia', icon: Newspaper },
    { title: 'Study', href: '/study', icon: BookOpen },
    { title: 'Food', href: '/food', icon: Coffee },
    { title: 'Housing', href: '/housing', icon: Home },
    // Superuser-only
    { title: 'My Listings', href: '/superuser/dashboard', icon: Crown, roles: ['superuser', 'userX'] },
    // Normal user
    { title: 'Become Superuser', href: '/request-role', icon: ShieldCheck, roles: ['normal'] },
    // Admin-only
    { title: 'Admin Panel', href: '/admin/dashboard', icon: Shield, roles: ['userX'] },
];

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation();
    const [userRole, setUserRole] = useState<string>('normal');

    useEffect(() => {
        api.get('/profiles/me')
            .then((profile) => {
                setUserRole(profile.role || 'normal');
            })
            .catch(() => {
                setUserRole('normal');
            });
    }, []);

    const visibleItems = allItems.filter(
        (item) => !item.roles || item.roles.includes(userRole)
    );

    return (
        <nav className={cn("h-full py-4", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {visibleItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                    location.pathname === item.href ||
                                        (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
                                        ? "bg-accent/50 text-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
