import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search, ChevronDown, User, LogOut, LayoutDashboard, UserCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
    { name: "ECOSYSTEM", href: "#ecosystem", isScroll: true },
    { name: "COMMUNITY", href: "#community", isScroll: true },
    { name: "SUPPORT", href: "#support", isScroll: true },
];

const appRoutes = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Lost & Found", href: "/lost-found" },
    { name: "Unimedia", href: "/unimedia" },
    { name: "Food", href: "/food" },
    { name: "Housing", href: "/housing" },
];

interface NavbarProps {
    showScrollLinks?: boolean;
}

export function Navbar({ showScrollLinks = false }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState<string | null>(null);
    const { session, user, signOut } = useAuth();
    const navigate = useNavigate();

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

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "py-2"
                    : "py-4"
            )}
        >
            {/* Glassmorphism container */}
            <div className={cn(
                "mx-4 sm:mx-6 lg:mx-auto max-w-7xl transition-all duration-500 rounded-2xl",
                scrolled
                    ? "bg-background/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                    : "bg-transparent"
            )}>
                <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                    {/* LEFT: Mobile Menu + LOGO */}
                    <div className="flex items-center gap-4">
                        {/* MOBILE MENU TOGGLE */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex md:hidden z-50 p-2 rounded-xl bg-gradient-to-br from-brand-navy/5 to-brand-orange/5 hover:from-brand-navy/10 hover:to-brand-orange/10 transition-all duration-300"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-6 w-6 text-brand-navy" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-6 w-6 text-brand-navy" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* LOGO */}
                        <Link to="/" className="flex items-center gap-3 group">
                            {/* <motion.div
                                whileHover={{ rotate: 12, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-brand-orange via-brand-orange to-brand-yellow flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-orange/25"
                            >
                                U
                                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div> */}
                            <div className="flex flex-col">
                                <span className="text-2xl tracking-tighter text-brand-navy leading-none">
                                    UniMARKY
                                </span>
                                {/* <span className="text-[10px] font-medium tracking-widest text-muted-foreground/70 uppercase">
                                    Campus Hub
                                </span> */}
                            </div>
                        </Link>
                    </div>

                    {/* CENTER LINKS (Desktop Only) */}
                    {showScrollLinks && (
                        <nav className="hidden items-center justify-center md:flex">
                            <div className="flex items-center gap-1 p-1.5 rounded-full bg-muted/50 backdrop-blur-sm">
                                {navLinks.map((link) => (
                                    <motion.button
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
                                            <motion.div
                                                layoutId="navbar-pill"
                                                className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </nav>
                    )}

                    {/* RIGHT SECTION (Desktop Only) */}
                    <div className="hidden items-center justify-end gap-3 md:flex">
                        {/* Search Button */}
                        {/* <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-brand-navy transition-all duration-300"
                        >
                            <Search className="h-4 w-4" />
                        </motion.button> */}

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all duration-300 border border-transparent hover:border-border/50"
                                    >
                                        <div className="relative">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-yellow/30 to-brand-orange/20 flex items-center justify-center border-2 border-brand-yellow/50">
                                                <User className="h-4 w-4 text-brand-navy" />
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-bold text-brand-navy leading-none">
                                                {user?.user_metadata?.first_name || "Student"}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Online</span>
                                        </div>
                                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                    </motion.button>
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
                                    <DropdownMenuSeparator className="bg-border/50" />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer rounded-lg gap-3 py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <div className="p-1.5 rounded-lg bg-red-100">
                                            <LogOut className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 px-6 py-5 font-bold tracking-wide shadow-lg shadow-brand-navy/20 hover:shadow-xl hover:shadow-brand-navy/30 transition-all duration-300 group"
                                    onClick={() => navigate('/auth')}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Get Started
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Button>
                            </motion.div>
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

            {/* MOBILE OVERLAY / DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-md md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            className="fixed inset-y-0 left-0 z-40 w-[85%] max-w-sm flex flex-col bg-background border-r border-border/50 shadow-2xl pt-24 px-6 md:hidden"
                        >
                            <div className="flex flex-col h-full">
                                {session ? (
                                    <>
                                        {/* User Profile Section */}
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex items-center gap-4 p-4 mb-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50"
                                        >
                                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-yellow/30 to-brand-orange/20 flex items-center justify-center border-2 border-brand-yellow/50">
                                                <User className="h-7 w-7 text-brand-navy" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-brand-navy">
                                                    {user?.user_metadata?.first_name || "Student"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">View Profile</p>
                                            </div>
                                        </motion.div>

                                        {/* Navigation Links */}
                                        <div className="flex-1 space-y-2">
                                            {appRoutes.map((link, index) => (
                                                <motion.div
                                                    key={link.name}
                                                    variants={itemVariants}
                                                    custom={index}
                                                >
                                                    <Link
                                                        to={link.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-lg font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                                    >
                                                        {link.name}
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Logout Button */}
                                        <motion.div variants={itemVariants} className="pb-8 pt-4 border-t border-border/50">
                                            <Button
                                                onClick={handleLogout}
                                                variant="ghost"
                                                className="w-full py-6 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 font-bold justify-start gap-3"
                                            >
                                                <div className="p-2 rounded-lg bg-red-100">
                                                    <LogOut className="h-5 w-5" />
                                                </div>
                                                Log Out
                                            </Button>
                                        </motion.div>
                                    </>
                                ) : (
                                    <motion.div variants={itemVariants} className="flex flex-col items-center justify-center flex-1 space-y-6 px-4">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-bold text-brand-navy">Welcome!</h3>
                                            <p className="text-muted-foreground">
                                                Join Unmarky to access all features.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => { navigate('/auth'); setIsOpen(false); }}
                                            className="w-full text-lg py-7 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 font-bold shadow-lg"
                                        >
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Get Started
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
