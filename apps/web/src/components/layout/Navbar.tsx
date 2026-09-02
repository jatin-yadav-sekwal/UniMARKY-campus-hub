import { m, AnimatePresence } from "motion/react";
import {
    Menu, X, ChevronDown, User, LogOut, LayoutDashboard, UserCircle, Sparkles,
    ShoppingBag, MapPin, Newspaper, Coffee, Home, Crown, ShieldCheck, Shield, GraduationCap, LayoutGrid
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import file from "@/components/layout/file.svg";

const navLinks = [
    { name: "ECOSYSTEM", href: "#ecosystem" },
    { name: "COMMUNITY", href: "#community" },
    { name: "SUPPORT", href: "#support" },
];

const appRoutes = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Lost & Found", href: "/lost-found", icon: MapPin },
    { name: "Unimedia", href: "/unimedia", icon: Newspaper },
    { name: "Study", href: "/study", icon: GraduationCap },
    { name: "Food", href: "/food", icon: Coffee },
    { name: "Housing", href: "/housing", icon: Home },
];

interface RoleRoute {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
}

const roleRoutes: RoleRoute[] = [
    { name: "My Listings", href: "/superuser/dashboard", icon: Crown, roles: ["superuser", "userX"] },
    { name: "Become Superuser", href: "/request-role", icon: ShieldCheck, roles: ["normal"] },
    { name: "Admin Panel", href: "/admin/dashboard", icon: Shield, roles: ["userX"] },
];

const menuVariants = {
    closed: {
        opacity: 0,
        x: "-100%",
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
            type: "spring" as const, stiffness: 300, damping: 30
        }
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
            type: "spring" as const, stiffness: 300, damping: 30
        }
    },
};

const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
};

interface UserDropdownProps {
    firstName: string;
    onLogout: () => void;
}

function NavUserDropdown({ firstName, onLogout }: UserDropdownProps) {
    const navigate = useNavigate();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <m.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-[background-color,border-color] duration-300 border border-transparent hover:border-border/50"
                >
                    <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-yellow/30 to-brand-orange/20 flex items-center justify-center border-2 border-brand-yellow/50">
                            <User className="h-4 w-4 text-brand-navy" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-brand-navy leading-none">
                            {firstName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Online</span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </m.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 p-2 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl"
            >
                <DropdownMenuLabel className="text-xs text-muted-foreground font-medium">
                    My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer rounded-lg gap-3 py-2.5"
                >
                    <div className="p-1.5 rounded-lg bg-brand-navy/10">
                        <LayoutDashboard className="h-4 w-4 text-brand-navy" />
                    </div>
                    <span className="font-medium">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer rounded-lg gap-3 py-2.5"
                >
                    <div className="p-1.5 rounded-lg bg-brand-orange/10">
                        <UserCircle className="h-4 w-4 text-brand-orange" />
                    </div>
                    <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate('/unimedia/my-content')}
                    className="cursor-pointer rounded-lg gap-3 py-2.5"
                >
                    <div className="p-1.5 rounded-lg bg-rose-500/10">
                        <LayoutGrid className="h-4 w-4 text-rose-500" />
                    </div>
                    <span className="font-medium">My Content</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer rounded-lg gap-3 py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    <div className="p-1.5 rounded-lg bg-red-100">
                        <LogOut className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface MobileDrawerProps {
    isOpen: boolean;
    session: boolean;
    firstName: string;
    visibleRoleRoutes: RoleRoute[];
    onClose: () => void;
    onLogout: () => void;
}

function MobileNavDrawer({
    isOpen,
    session,
    firstName,
    visibleRoleRoutes,
    onClose,
    onLogout,
}: MobileDrawerProps) {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="button"
                        tabIndex={0}
                        aria-label="Close menu backdrop"
                        className="fixed inset-0 z-30 bg-background/80 backdrop-blur-md md:hidden"
                        onClick={onClose}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
                                e.preventDefault();
                                onClose();
                            }
                        }}
                    />

                    {/* Drawer */}
                    <m.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-y-0 left-0 z-40 w-[85%] max-w-sm flex flex-col bg-background border-r border-border/50 shadow-2xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            {session ? (
                                <>
                                    <m.div variants={itemVariants}>
                                        <Link
                                            to="/profile"
                                            onClick={onClose}
                                            className="flex items-center gap-4 p-4 mb-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-border transition-colors"
                                        >
                                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-yellow/30 to-brand-orange/20 flex items-center justify-center border-2 border-brand-yellow/50">
                                                <User className="h-7 w-7 text-brand-navy" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-brand-navy">
                                                    {firstName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">View Profile →</p>
                                            </div>
                                        </Link>
                                    </m.div>

                                    <div className="flex-1 space-y-1 overflow-y-auto">
                                        {appRoutes.map((link, index) => (
                                            <m.div
                                                key={link.name}
                                                variants={itemVariants}
                                                custom={index}
                                            >
                                                <Link
                                                    to={link.href}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                                >
                                                    <link.icon className="h-5 w-5 text-muted-foreground" />
                                                    {link.name}
                                                </Link>
                                            </m.div>
                                        ))}

                                        {visibleRoleRoutes.length > 0 && (
                                            <>
                                                <div className="my-3 border-t border-border/50" />
                                                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                    Management
                                                </p>
                                                {visibleRoleRoutes.map((link, index) => (
                                                    <m.div
                                                        key={link.name}
                                                        variants={itemVariants}
                                                        custom={appRoutes.length + index}
                                                    >
                                                        <Link
                                                            to={link.href}
                                                            onClick={onClose}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                                        >
                                                            <link.icon className="h-5 w-5 text-muted-foreground" />
                                                            {link.name}
                                                        </Link>
                                                    </m.div>
                                                ))}
                                            </>
                                        )}

                                        <div className="my-3 border-t border-border/50" />
                                        <m.div variants={itemVariants}>
                                            <Link
                                                to="/profile"
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                            >
                                                <UserCircle className="h-5 w-5 text-muted-foreground" />
                                                Profile
                                            </Link>
                                        </m.div>
                                        <m.div variants={itemVariants}>
                                            <Link
                                                to="/unimedia/my-content"
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                            >
                                                <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                                                My Content
                                            </Link>
                                        </m.div>
                                    </div>

                                    <m.div variants={itemVariants} className="pb-8 pt-4 border-t border-border/50">
                                        <Button
                                            onClick={onLogout}
                                            variant="ghost"
                                            className="w-full py-6 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 font-bold justify-start gap-3"
                                        >
                                            <div className="p-2 rounded-lg bg-red-100">
                                                <LogOut className="h-5 w-5" />
                                            </div>
                                            Log Out
                                        </Button>
                                    </m.div>
                                </>
                            ) : (
                                <m.div variants={itemVariants} className="flex flex-col items-center justify-center flex-1 space-y-6 px-4">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold text-brand-navy">Welcome!</h3>
                                        <p className="text-muted-foreground">
                                            Join Unmarky to access all features.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => { navigate('/auth'); onClose(); }}
                                        className="w-full text-lg py-7 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 font-bold shadow-lg"
                                    >
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Get Started
                                    </Button>
                                </m.div>
                            )}
                        </div>
                    </m.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface NavbarProps {
    showScrollLinks?: boolean;
}

export function Navbar({ showScrollLinks = false }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>("normal");
    const { session, user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            api.get("/profiles/me")
                .then((profile) => setUserRole(profile.role || "normal"))
                .catch(() => setUserRole("normal"));
        }
    }, [session]);

    const visibleRoleRoutes = roleRoutes.filter((r) => r.roles.includes(userRole));

    const handleLogout = async () => {
        await signOut();
        setIsOpen(false);
        navigate("/");
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollTo = (id: string) => {
        if (id.startsWith("#")) {
            const element = document.getElementById(id.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            navigate(id);
        }
        setIsOpen(false);
    };

    const userFirstName = user?.user_metadata?.first_name || "Student";

    return (
        <m.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-[padding] duration-500",
                scrolled ? "py-2" : "py-4"
            )}
        >
            <div className={cn(
                "mx-4 sm:mx-6 lg:mx-auto max-w-7xl transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 rounded-2xl",
                scrolled
                    ? "bg-background/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                    : "bg-transparent"
            )}>
                <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                    {/* LEFT: Mobile Menu + LOGO */}
                    <div className="flex items-center gap-4">
                        <m.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex md:hidden z-50 p-2 rounded-xl bg-gradient-to-br from-brand-navy/5 to-brand-orange/5 hover:from-brand-navy/10 hover:to-brand-orange/10 transition-colors duration-300"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <m.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-6 w-6 text-brand-navy" />
                                    </m.div>
                                ) : (
                                    <m.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-6 w-6 text-brand-navy" />
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </m.button>

                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="flex flex-col">
                                <span className="text-2xl tracking-tighter text-brand-navy leading-none">
                                    <img src={file} alt="App Logo" width={200} height={65} />
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER LINKS (Desktop Only) */}
                    {showScrollLinks && (
                        <nav className="hidden items-center justify-center md:flex">
                            <div className="flex items-center gap-1 p-1.5 rounded-full bg-muted/50 backdrop-blur-sm">
                                {navLinks.map((link) => (
                                    <m.button
                                        key={link.name}
                                        onClick={() => {
                                            handleScrollTo(link.href);
                                            setActiveLink(link.name);
                                        }}
                                        onHoverStart={() => setActiveLink(link.name)}
                                        onHoverEnd={() => setActiveLink(null)}
                                        className={cn(
                                            "relative px-5 py-2 text-xs font-bold tracking-widest transition-colors duration-300 rounded-full",
                                            activeLink === link.name
                                                ? "text-brand-navy"
                                                : "text-muted-foreground hover:text-brand-navy"
                                        )}
                                    >
                                        {activeLink === link.name && (
                                            <m.div
                                                layoutId="navbar-pill"
                                                className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.name}</span>
                                    </m.button>
                                ))}
                            </div>
                        </nav>
                    )}

                    {/* RIGHT SECTION (Desktop Only) */}
                    <div className="hidden items-center justify-end gap-3 md:flex">
                        {session ? (
                            <NavUserDropdown firstName={userFirstName} onLogout={handleLogout} />
                        ) : (
                            <m.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 px-6 py-5 font-bold tracking-wide shadow-lg shadow-brand-navy/20 hover:shadow-xl hover:shadow-brand-navy/30 transition-shadow duration-300 group"
                                    onClick={() => navigate('/auth')}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Get Started
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Button>
                            </m.div>
                        )}
                    </div>

                    {/* Mobile Auth Button */}
                    {!session && (
                        <div className="flex md:hidden">
                            <Button
                                size="sm"
                                className="rounded-xl bg-brand-navy font-bold"
                                onClick={() => navigate('/auth')}
                            >
                                Sign In
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <MobileNavDrawer
                isOpen={isOpen}
                session={!!session}
                firstName={userFirstName}
                visibleRoleRoutes={visibleRoleRoutes}
                onClose={() => setIsOpen(false)}
                onLogout={handleLogout}
            />
        </m.header>
    );
}
