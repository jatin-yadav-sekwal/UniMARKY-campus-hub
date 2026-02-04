import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingBag, MapPin, Newspaper, Coffee, Home } from 'lucide-react';

const items = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { title: 'Lost & Found', href: '/lost-found', icon: MapPin },
    { title: 'Unimedia', href: '/unimedia', icon: Newspaper },
    { title: 'Food', href: '/food', icon: Coffee },
    { title: 'Housing', href: '/housing', icon: Home },
];

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation();

    return (
        <nav className={cn("h-full py-4", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                    location.pathname === item.href ? "bg-accent/50 text-accent-foreground" : "text-muted-foreground"
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
