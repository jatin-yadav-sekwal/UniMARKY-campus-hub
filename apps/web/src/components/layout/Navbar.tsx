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
import { GlassSurface, LiquidGlassPill } from "@/components/ui/liquid-glass";
import file from "@/components/layout/file.svg";

const navLinks = [
    { name: "ECOSYSTEM", href: "#ecosystem" },
    { name: "EXPERIENCE", href: "#experience" },
    { name: "NETWORK", href: "#network" },
    { name: "COMMUNITY", href: "#community" },
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
            staggerChildren: 0.04,
            staggerDirection: -1,
            type: "spring" as const, stiffness: 350, damping: 32
        }
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
            type: "spring" as const, stiffness: 350, damping: 32
        }
    },
};

const itemVariants = {
    closed: { opacity: 0, x: -16 },
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
                    className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-[#24324A] transition-colors duration-200 border border-[#F1E7DF] shadow-2xs"
                >
                    <div className="relative">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#FF5A36] to-[#FF713F] flex items-center justify-center font-bold text-[10px] text-white">
                            <User className="h-3 w-3" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-[#20BFA3] rounded-full border border-white" />
                    </div>
                    <span className="text-xs font-semibold text-[#24324A] leading-none max-w-[90px] truncate">
                        {firstName}
                    </span>
                    <ChevronDown className="h-3 w-3 text-[#71839B]" />
                </m.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-52 p-1.5 rounded-2xl border border-[#F1E7DF] bg-[#FFFCF8]/95 backdrop-blur-2xl shadow-[0_16px_36px_rgba(36,50,74,0.08)] text-[#24324A]"
            >
                <DropdownMenuLabel className="text-[11px] text-[#71839B] font-medium px-2 py-1">
                    My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#F1E7DF]" />
                <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer rounded-xl gap-2.5 py-1.5 text-xs text-[#24324A] hover:bg-[#FFF7EF] transition-colors"
                >
                    <div className="p-1 rounded-lg bg-[#FFF7EF] text-[#FF5A36]">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer rounded-xl gap-2.5 py-1.5 text-xs text-[#24324A] hover:bg-[#FFF7EF] transition-colors"
                >
                    <div className="p-1 rounded-lg bg-emerald-50 text-[#20BFA3]">
                        <UserCircle className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate('/unimedia/my-content')}
                    className="cursor-pointer rounded-xl gap-2.5 py-1.5 text-xs text-[#24324A] hover:bg-[#FFF7EF] transition-colors"
                >
                    <div className="p-1 rounded-lg bg-purple-50 text-purple-600">
                        <LayoutGrid className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold">My Content</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#F1E7DF]" />
                <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer rounded-xl gap-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                >
                    <div className="p-1 rounded-lg bg-rose-100 text-rose-600">
                        <LogOut className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold">Logout</span>
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
                        className="fixed inset-0 z-40 bg-[#24324A]/30 backdrop-blur-xs md:hidden"
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
                        className="fixed inset-y-0 left-0 z-50 w-[80%] max-w-xs flex flex-col bg-[#FFFCF8]/98 backdrop-blur-2xl border-r border-[#F1E7DF] shadow-[0_24px_50px_rgba(36,50,74,0.12)] pt-18 px-5 md:hidden text-[#24324A]"
                    >
                        <div className="flex flex-col h-full">
                            {session ? (
                                <>
                                    <m.div variants={itemVariants}>
                                        <Link
                                            to="/profile"
                                            onClick={onClose}
                                            className="flex items-center gap-3 p-3 mb-5 rounded-2xl bg-[#FFF7EF] border border-[#F1E7DF]"
                                        >
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF5A36] to-[#FF713F] flex items-center justify-center font-bold text-sm text-white">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-[#24324A]">
                                                    {firstName}
                                                </p>
                                                <p className="text-[11px] text-[#71839B]">View Profile →</p>
                                            </div>
                                        </Link>
                                    </m.div>

                                    <div className="flex-1 space-y-1 overflow-y-auto pr-1">
                                        {appRoutes.map((link) => (
                                            <m.div key={link.name} variants={itemVariants}>
                                                <Link
                                                    to={link.href}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#24324A] hover:bg-[#FFF7EF] transition-colors"
                                                >
                                                    <link.icon className="h-4 w-4 text-[#FF5A36]" />
                                                    {link.name}
                                                </Link>
                                            </m.div>
                                        ))}

                                        {visibleRoleRoutes.length > 0 && (
                                            <>
                                                <div className="my-2.5 border-t border-[#F1E7DF]" />
                                                <p className="px-3 text-[10px] font-bold text-[#71839B] uppercase tracking-wider mb-1">
                                                    Management
                                                </p>
                                                {visibleRoleRoutes.map((link) => (
                                                    <m.div key={link.name} variants={itemVariants}>
                                                        <Link
                                                            to={link.href}
                                                            onClick={onClose}
                                                            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#24324A] hover:bg-[#FFF7EF] transition-colors"
                                                        >
                                                            <link.icon className="h-4 w-4 text-[#20BFA3]" />
                                                            {link.name}
                                                        </Link>
                                                    </m.div>
                                                ))}
                                            </>
                                        )}

                                        <div className="my-2.5 border-t border-[#F1E7DF]" />
                                        <m.div variants={itemVariants}>
                                            <Link
                                                to="/profile"
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#24324A] hover:bg-[#FFF7EF] transition-colors"
                                            >
                                                <UserCircle className="h-4 w-4 text-[#20BFA3]" />
                                                Profile
                                            </Link>
                                        </m.div>
                                        <m.div variants={itemVariants}>
                                            <Link
                                                to="/unimedia/my-content"
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#24324A] hover:bg-[#FFF7EF] transition-colors"
                                            >
                                                <LayoutGrid className="h-4 w-4 text-[#FF5A36]" />
                                                My Content
                                            </Link>
                                        </m.div>
                                    </div>

                                    <m.div variants={itemVariants} className="pb-6 pt-3 border-t border-[#F1E7DF]">
                                        <Button
                                            onClick={onLogout}
                                            variant="ghost"
                                            className="w-full py-4 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-xs justify-start gap-2.5"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log Out
                                        </Button>
                                    </m.div>
                                </>
                            ) : (
                                <m.div variants={itemVariants} className="flex flex-col items-center justify-center flex-1 space-y-5 px-3">
                                    <div className="text-center space-y-1.5">
                                        <h3 className="text-lg font-bold text-[#24324A]">Welcome to UniMARKY</h3>
                                        <p className="text-xs text-[#71839B]">
                                            The digital campus for verified students.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => { navigate('/auth'); onClose(); }}
                                        className="w-full text-xs py-5 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#FF713F] font-bold text-white shadow-md"
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" />
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
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
    const currentActive = hoveredLink || activeLink;

    return (
        <m.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 pointer-events-none",
                scrolled ? "py-3" : "py-4 sm:py-5"
            )}
        >
            <div className="mx-auto max-w-5xl px-3 sm:px-6">
                <GlassSurface
                    variant="capsule"
                    depth={0.45}
                    curvature={0.65}
                    chroma={0.3}
                    scale={14}
                    interactiveGlint={true}
                    tint="warm"
                    className={cn(
                        "pointer-events-auto transition-[background-color,box-shadow] duration-300 rounded-full",
                        "bg-[#FFFCF8]/80 backdrop-blur-2xl backdrop-saturate-[180%]",
                        "border border-[#F1E7DF]/90",
                        "shadow-[0_4px_24px_rgba(36,50,74,0.05),inset_0_1.5px_1px_rgba(255,255,255,0.95)]",
                        scrolled ? "bg-[#FFFCF8]/95 shadow-[0_12px_32px_rgba(36,50,74,0.09)]" : ""
                    )}
                >
                    <div className="flex items-center justify-between px-3 sm:px-5 h-[52px]">
                        {/* LEFT: Mobile Menu Button + UniMARKY Logo */}
                        <div className="flex items-center gap-2.5">
                            <m.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Toggle navigation menu"
                                className="flex md:hidden p-1.5 rounded-full bg-[#FFF7EF] hover:bg-white text-[#24324A] transition-colors border border-[#F1E7DF]"
                            >
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <m.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <X className="h-4 w-4" />
                                        </m.div>
                                    ) : (
                                        <m.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Menu className="h-4 w-4" />
                                        </m.div>
                                    )}
                                </AnimatePresence>
                            </m.button>

                            <Link to="/" className="flex items-center gap-2 group py-1">
                                <img src={file} alt="UniMARKY Logo" className="h-6 w-auto object-contain" />
                            </Link>
                        </div>

                        {/* CENTER: Slidable Liquid Glass Pill Active Navigation Tabs */}
                        {showScrollLinks && (
                            <nav className="hidden items-center justify-center md:flex" aria-label="Main Navigation">
                                <div
                                    onMouseLeave={() => setHoveredLink(null)}
                                    className="relative flex items-center gap-1 p-0.5 rounded-full bg-[#FFF7EF]/80 border border-[#F1E7DF]/80 backdrop-blur-md"
                                >
                                    {navLinks.map((link) => {
                                        const isCurrent = currentActive === link.name;
                                        return (
                                            <m.button
                                                key={link.name}
                                                onClick={() => {
                                                    handleScrollTo(link.href);
                                                    setActiveLink(link.name);
                                                }}
                                                onMouseEnter={() => setHoveredLink(link.name)}
                                                className={cn(
                                                    "relative px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 rounded-full select-none",
                                                    isCurrent
                                                        ? "text-[#FF5A36]"
                                                        : "text-[#71839B] hover:text-[#24324A]"
                                                )}
                                            >
                                                {isCurrent && (
                                                    <LiquidGlassPill
                                                        layoutId="navbar-raycast-lens"
                                                        className="z-0 bg-white/95 border border-[#F1E7DF] shadow-2xs"
                                                    />
                                                )}
                                                <span className="relative z-10">{link.name}</span>
                                            </m.button>
                                        );
                                    })}
                                </div>
                            </nav>
                        )}

                        {/* RIGHT: User Profile or Compact Primary CTA */}
                        <div className="hidden items-center justify-end gap-2.5 md:flex">
                            {session ? (
                                <NavUserDropdown firstName={userFirstName} onLogout={handleLogout} />
                            ) : (
                                <m.div
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        size="sm"
                                        className="relative h-8 px-4 rounded-full bg-gradient-to-r from-[#FF5A36] to-[#FF713F] text-white font-bold text-xs shadow-xs hover:shadow-[0_4px_16px_rgba(255,90,54,0.3)] transition-[box-shadow] duration-200 border border-white/20"
                                        onClick={() => navigate('/auth')}
                                    >
                                        <span className="relative z-10 flex items-center gap-1.5">
                                            <Sparkles className="h-3 w-3" />
                                            Get Started
                                        </span>
                                    </Button>
                                </m.div>
                            )}
                        </div>

                        {/* Mobile Auth Button */}
                        {!session && (
                            <div className="flex md:hidden">
                                <Button
                                    size="sm"
                                    className="rounded-full bg-gradient-to-r from-[#FF5A36] to-[#FF713F] text-white font-bold text-xs h-7 px-3 border border-white/20 shadow-2xs"
                                    onClick={() => navigate('/auth')}
                                >
                                    Sign In
                                </Button>
                            </div>
                        )}
                    </div>
                </GlassSurface>
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
