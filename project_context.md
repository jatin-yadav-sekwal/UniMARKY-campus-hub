# Project Context

## File: index.html
```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UniMARKY | Everything. University.</title>
  <meta name="description" content="UniMARKY is a platform for students to buy, sell, and trade goods and services.">
  <meta name="keywords" content="UniMARKY,study, students, buy, sell, trade, goods, services">
  <meta name="author" content="UniMARKY">
  <meta name="theme-color" content="#ffffff">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
  <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
  <link rel="icon" type="image/svg+xml" href="/logo2.svg">
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>
```

## File: package.json
```json
{
  "name": "web",
  "module": "index.ts",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "private": true,
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.18",
    "@types/bun": "latest",
    "@types/node": "^25.2.0",
    "@types/react": "^19.2.10",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.2",
    "drizzle-kit": "^0.31.8",
    "shadcn": "^3.8.4",
    "tailwindcss": "^4.1.18",
    "tsx": "^4.21.0",
    "tw-animate-css": "^1.4.0",
    "vite": "^7.3.1"
  },
  "peerDependencies": {
    "typescript": "^5"
  },
  "dependencies": {
    "@hono/node-server": "^1.19.9",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-slot": "^1.2.4",
    "@supabase/supabase-js": "^2.95.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "dotenv": "^17.2.3",
    "drizzle-orm": "^0.45.1",
    "hono": "^4.11.7",
    "lucide-react": "^0.563.0",
    "motion": "^12.30.0",
    "postgres": "^3.4.8",
    "radix-ui": "^1.4.3",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.0",
    "tailwind-merge": "^3.4.0"
  }
}
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "lib": [
      "esnext",
      "dom",
      "dom.iterable"
    ],
    "target": "ESNext",
    "module": "ESNext",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  }
}
```

## File: vite.config.ts
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## File: D:\unmarky\apps\web\src\components\auth\AuthForm.tsx
```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
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
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-zinc-900 border border-border/50">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tighter text-brand-navy dark:text-white">
                    {mode === 'login' ? 'Welcome Back' : 'Join Unmarky'}
                </h2>
                <p className="mt-2 text-sm text-brand-blue/80">
                    {mode === 'login'
                        ? 'Enter your credentials or use social login'
                        : 'Create an account to get started'}
                </p>
            </div>

            <SocialAuth />

            <Tabs
                defaultValue="login"
                onValueChange={(v) => setMode(v as 'login' | 'signup')}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <form onSubmit={handleAuth} className="space-y-4">
                            {mode === 'signup' && (
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="student@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-900/20">
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md dark:bg-green-900/20">
                                    {message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {mode === 'login' ? 'Sign In' : 'Create Account'}
                            </Button>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </Tabs>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\components\layout\ErrorPage.tsx
```tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-9xl font-extrabold tracking-tighter text-muted-foreground/20">404</h1>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute"
            >
                <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\components\layout\Footer.tsx
```tsx
import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer id="support" className="bg-brand-navy text-white pt-20 pb-10">
            <div className="container px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/" className="inline-block">
                            <h2 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-brand-pink via-brand-blue to-teal-400 bg-clip-text text-transparent">
                                UniMARKY
                            </h2>
                        </Link>
                        <p className="text-blue-100 max-w-sm leading-relaxed">
                            The platform designed for the next generation of campus life. Safe, fast, and completely yours.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {/* <SocialIcon icon={Twitter}  /> */}
                            <SocialIcon icon={Instagram} />
                            {/* <SocialIcon icon={Linkedin} /> */}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-bold tracking-widest text-sm mb-6 text-blue-200">PRODUCT</h3>
                        <ul className="space-y-4 text-sm text-blue-100/80">
                            <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                            <li><Link to="/study" className="hover:text-white transition-colors">Study</Link></li>
                            <li><Link to="/food" className="hover:text-white transition-colors">Food</Link></li>
                            <li><Link to="/housing" className="hover:text-white transition-colors">Housing</Link></li>
                            <li><Link to="/lost-found" className="hover:text-white transition-colors">Lost & Found</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold tracking-widest text-sm mb-6 text-blue-200">COMPANY</h3>
                        <ul className="space-y-4 text-sm text-blue-100/80">
                            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-bold tracking-widest text-sm mb-6 text-blue-200">LEGAL</h3>
                        <ul className="space-y-4 text-sm text-blue-100/80">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-200/60">
                    <p className="flex items-center gap-1.5">
                        Â© {new Date().getFullYear()} UniMARKY. Made with <Heart className="w-3 h-3 fill-red-500 text-red-500" /> for students.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="font-medium text-green-400">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
    return (
        <a href="https://www.instagram.com/unimarky/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Icon className="w-5 h-5 text-white" />
        </a>
    )
}
```

## File: D:\unmarky\apps\web\src\components\layout\MainLayout.tsx
```tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function MainLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="flex h-screen overflow-hidden pt-20"> {/* pt-20 to verify navbar offset */}
                {/* Fixed Sidebar */}
                <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-40 top-20 border-r bg-background">
                    <Sidebar />
                </aside>

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto md:ml-64 p-6 pb-24">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\components\layout\Navbar.tsx
```tsx
import { motion, AnimatePresence } from "motion/react";
import {
    Menu, X, Search, ChevronDown, User, LogOut, LayoutDashboard, UserCircle, Sparkles,
    ShoppingBag, MapPin, Newspaper, BookOpen, Coffee, Home, Crown, ShieldCheck, Shield, GraduationCap, LayoutGrid
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
    { name: "ECOSYSTEM", href: "#ecosystem", isScroll: true },
    { name: "COMMUNITY", href: "#community", isScroll: true },
    { name: "SUPPORT", href: "#support", isScroll: true },
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
                                    <img src={file} alt="App Logo" width={200} height={65} />
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
                                        {/* User Profile Section â€” Clickable */}
                                        <motion.div variants={itemVariants}>
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 p-4 mb-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-border transition-colors"
                                            >
                                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-yellow/30 to-brand-orange/20 flex items-center justify-center border-2 border-brand-yellow/50">
                                                    <User className="h-7 w-7 text-brand-navy" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg text-brand-navy">
                                                        {user?.user_metadata?.first_name || "Student"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">View Profile â†’</p>
                                                </div>
                                            </Link>
                                        </motion.div>

                                        {/* Navigation Links */}
                                        <div className="flex-1 space-y-1 overflow-y-auto">
                                            {appRoutes.map((link, index) => (
                                                <motion.div
                                                    key={link.name}
                                                    variants={itemVariants}
                                                    custom={index}
                                                >
                                                    <Link
                                                        to={link.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                                    >
                                                        <link.icon className="h-5 w-5 text-muted-foreground" />
                                                        {link.name}
                                                    </Link>
                                                </motion.div>
                                            ))}

                                            {/* Role-based links */}
                                            {visibleRoleRoutes.length > 0 && (
                                                <>
                                                    <div className="my-3 border-t border-border/50" />
                                                    <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                        Management
                                                    </p>
                                                    {visibleRoleRoutes.map((link, index) => (
                                                        <motion.div
                                                            key={link.name}
                                                            variants={itemVariants}
                                                            custom={appRoutes.length + index}
                                                        >
                                                            <Link
                                                                to={link.href}
                                                                onClick={() => setIsOpen(false)}
                                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                                            >
                                                                <link.icon className="h-5 w-5 text-muted-foreground" />
                                                                {link.name}
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </>
                                            )}

                                            {/* Profile link */}
                                            <div className="my-3 border-t border-border/50" />
                                            <motion.div variants={itemVariants}>
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                                >
                                                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                                                    Profile
                                                </Link>
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <Link
                                                    to="/unimedia/my-content"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-brand-navy hover:bg-muted/50 transition-colors"
                                                >
                                                    <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                                                    My Content
                                                </Link>
                                            </motion.div>
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
```

## File: D:\unmarky\apps\web\src\components\layout\ProtectedRoute.tsx
```tsx
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ requireOnboarding = true }: { requireOnboarding?: boolean }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setIsChecking(false);
            return;
        }

        // We only check if we require it (optimization).
        // But if requireOnboarding is false (on the onboarding page), we don't *block* but we don't redirect away typically.
        // Actually, if user is ALREADY onboarded, maybe redirect away from /onboarding? 
        // For now, simple guard:

        if (requireOnboarding) {
            import('@/lib/api').then(({ api }) => {
                api.get('/profiles/me')
                    .then((profile: any) => {
                        if (profile.onboardingCompleted) {
                            setOnboardingComplete(true);
                        } else {
                            navigate('/onboarding');
                        }
                    })
                    .catch((err) => {
                        console.error("Failed to check onboarding status:", err);

                        // If it's a network error/CORS, show an error state instead of redirecting or silently failing
                        if (err.message && (err.message.includes("Network Error") || err.message.includes("Failed to fetch"))) {
                            setError("Connection Error: Unable to reach the server. Please check your connection or try again later.");
                        } else {
                            // 404/401 -> Redirect to onboarding
                            navigate('/onboarding');
                        }
                    })
                    .finally(() => setIsChecking(false));
            });
        } else {
            setIsChecking(false);
        }

    }, [user, requireOnboarding, navigate]);

    if (loading || (requireOnboarding && isChecking && user)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 text-center">
                <div className="text-red-500 font-bold text-xl">Connection Error</div>
                <p className="text-muted-foreground">{error}</p>
                <div
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                    Retry
                </div>
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/auth" state={{ returnTo: location.pathname }} replace />;
}
```

## File: D:\unmarky\apps\web\src\components\layout\ScrollToTop.tsx
```tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
```

## File: D:\unmarky\apps\web\src\components\layout\Sidebar.tsx
```tsx
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
```

## File: D:\unmarky\apps\web\src\components\ui\avatar.tsx
```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

## File: D:\unmarky\apps\web\src\components\ui\badge.tsx
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
```

## File: D:\unmarky\apps\web\src\components\ui\button.tsx
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

## File: D:\unmarky\apps\web\src\components\ui\card.tsx
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-xl border bg-card text-card-foreground shadow",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

export { Card, CardHeader, CardTitle, CardContent, CardDescription }
```

## File: D:\unmarky\apps\web\src\components\ui\command.tsx
```tsx
import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
            className
        )}
        {...props}
    />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({
    children,
    ...props
}: React.ComponentProps<typeof CommandPrimitive>) => {
    return (
        <CommandPrimitive {...props}>
            {children}
        </CommandPrimitive>
    )
}

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
        {...props}
    />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className="py-6 text-center text-sm"
        {...props}
    />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
            className
        )}
        {...props}
    />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 h-px bg-border", className)}
        {...props}
    />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "ml-auto text-xs tracking-widest text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}
CommandShortcut.displayName = "CommandShortcut"

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
}
```

## File: D:\unmarky\apps\web\src\components\ui\dropdown-menu.tsx
```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
        inset?: boolean
    }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            inset && "pl-8",
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
    DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
))
DropdownMenuSubContent.displayName =
    DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            inset && "pl-8",
            className
        )}
        {...props}
    />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
    DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Circle className="h-2 w-2 fill-current" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold",
            inset && "pl-8",
            className
        )}
        {...props}
    />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
            {...props}
        />
    )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
}
```

## File: D:\unmarky\apps\web\src\components\ui\input.tsx
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
```

## File: D:\unmarky\apps\web\src\components\ui\label.tsx
```tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

## File: D:\unmarky\apps\web\src\components\ui\popover.tsx
```tsx
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
```

## File: D:\unmarky\apps\web\src\components\ui\select.tsx
```tsx
import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
```

## File: D:\unmarky\apps\web\src\components\ui\tabs.tsx
```tsx
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

## File: D:\unmarky\apps\web\src\features\admin\AdminDashboard.tsx
```tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Shield,
    ShieldCheck,
    ShieldX,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    User,
    Building2,
    Phone,
    BookOpen,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface RoleRequest {
    request: {
        id: string;
        userId: string;
        requestedRole: string;
        reason: string;
        status: string;
        createdAt: string;
    };
    user: {
        id: string;
        fullName: string | null;
        universityName: string | null;
        department: string | null;
        mobileNumber: string | null;
        role: string | null;
    } | null;
}

export function AdminDashboard() {
    const [requests, setRequests] = useState<RoleRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/role-requests?status=${filter}`);
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId: string, status: "approved" | "rejected") => {
        setProcessing(requestId);
        try {
            await api.patch(`/role-requests/${requestId}`, { status });
            // Remove from list
            setRequests((prev) => prev.filter((r) => r.request.id !== requestId));
        } catch (err) {
            console.error("Failed to process request:", err);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2"
                >
                    <span className="text-brand-navy">ADMIN </span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        DASHBOARD
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    Review and manage superuser role requests
                </motion.p>
            </div>

            {/* Filter Pills */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-2 mb-6"
            >
                <Filter className="h-4 w-4 text-muted-foreground" />
                {(["pending", "approved", "rejected"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === status
                                ? status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                    : status === "approved"
                                        ? "bg-green-100 text-green-800 border border-green-300"
                                        : "bg-red-100 text-red-800 border border-red-300"
                                : "bg-muted/30 text-muted-foreground border border-border hover:border-brand-navy/30"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </motion.div>

            {/* Requests List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : requests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border"
                >
                    <Shield className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">No {filter} requests</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                        {filter === "pending" ? "All caught up!" : `No ${filter} requests to show.`}
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {requests.map((item, index) => (
                            <motion.div
                                key={item.request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-background border border-border/50 rounded-2xl p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    {/* User Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                                <User className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-brand-navy">
                                                    {item.user?.fullName || "Unknown User"}
                                                </h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Building2 className="h-3 w-3" />
                                                    {item.user?.universityName || "Unknown"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            {item.user?.department && (
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="h-3 w-3" /> {item.user.department}
                                                </span>
                                            )}
                                            {item.user?.mobileNumber && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> {item.user.mobileNumber}
                                                </span>
                                            )}
                                        </div>

                                        {/* Reason */}
                                        <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                Reason for Upgrade
                                            </p>
                                            <p className="text-sm">{item.request.reason}</p>
                                        </div>

                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(item.request.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    {filter === "pending" && (
                                        <div className="flex sm:flex-col gap-2">
                                            <Button
                                                onClick={() => handleAction(item.request.id, "approved")}
                                                disabled={processing === item.request.id}
                                                className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                            >
                                                {processing === item.request.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                )}
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleAction(item.request.id, "rejected")}
                                                disabled={processing === item.request.id}
                                                className="gap-2 text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}

                                    {filter === "approved" && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                            <ShieldCheck className="h-4 w-4" /> Approved
                                        </span>
                                    )}

                                    {filter === "rejected" && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                                            <ShieldX className="h-4 w-4" /> Rejected
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\auth\components\SocialAuth.tsx
```tsx
import { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';

export function SocialAuth() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // redirectTo: import.meta.env.VITE_WEB_URL
                    redirectTo: `${import.meta.env.VITE_WEB_URL}/dashboard`
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error logging in with Google:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    Google
                </Button>
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\auth\AuthPage.tsx
```tsx
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';

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
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <AuthForm />
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\components\CommentSection.tsx
```tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Trash2, Loader2, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Comment } from "@/features/campus/types";

interface CommentSectionProps {
    postId: string;
    currentUserId?: string;
    commentsCount: number;
    onCountChange: (delta: number) => void;
}

export function CommentSection({ postId, currentUserId, commentsCount, onCountChange }: CommentSectionProps) {
    const [commentsList, setCommentsList] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const LIMIT = 5;

    // Fetch comments
    const fetchComments = async (reset = false) => {
        setLoading(true);
        const currentOffset = reset ? 0 : offset;
        try {
            const res = await api.get(`/social/${postId}/comments?limit=${LIMIT}&offset=${currentOffset}`);
            if (reset) {
                setCommentsList(res.items);
                setOffset(LIMIT);
            } else {
                setCommentsList(prev => [...prev, ...res.items]);
                setOffset(prev => prev + LIMIT);
            }
            setHasMore(res.hasMore);
        } catch (err) {
            console.error("Failed to fetch comments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(true);
    }, [postId]);

    const handleSubmit = async () => {
        if (!newComment.trim() || submitting) return;
        setSubmitting(true);
        try {
            const comment = await api.post(`/social/${postId}/comments`, { content: newComment.trim() });
            setCommentsList(prev => [comment, ...prev]);
            setNewComment("");
            onCountChange(1);
            if (inputRef.current) inputRef.current.style.height = "40px";
        } catch (err) {
            console.error("Failed to add comment:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await api.delete(`/social/comments/${commentId}`);
            setCommentsList(prev => prev.filter(c => c.id !== commentId));
            onCountChange(-1);
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        e.target.style.height = "40px";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    const timeAgo = (dateStr: string) => {
        const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return "now";
        const m = Math.floor(seconds / 60);
        if (m < 60) return `${m}m`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h`;
        const d = Math.floor(h / 24);
        return `${d}d`;
    };

    return (
        <div className="pt-3">
            {/* Comment Input */}
            <div className="flex gap-2 items-end mb-4">
                <textarea
                    ref={inputRef}
                    value={newComment}
                    onChange={autoResize}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a comment..."
                    maxLength={500}
                    rows={1}
                    className="flex-1 min-h-[40px] max-h-[120px] px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy/30 transition-all placeholder:text-muted-foreground/60"
                />
                <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                        size="icon"
                        onClick={handleSubmit}
                        disabled={!newComment.trim() || submitting}
                        className="h-10 w-10 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white shrink-0"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </motion.div>
            </div>

            {/* Character counter */}
            {newComment.length > 400 && (
                <p className={`text-xs mb-2 text-right ${newComment.length >= 500 ? "text-red-500" : "text-amber-500"}`}>
                    {500 - newComment.length} characters left
                </p>
            )}

            {/* Comments List */}
            <AnimatePresence mode="popLayout">
                {commentsList.map((comment, i) => (
                    <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="group flex gap-2.5 py-2.5"
                    >
                        <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                            <AvatarImage src={comment.user?.idCardUrl} />
                            <AvatarFallback className="text-[10px]">{comment.user?.fullName?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="bg-muted/40 rounded-xl px-3 py-2">
                                <span className="font-semibold text-xs">{comment.user?.fullName}</span>
                                <p className="text-sm text-foreground/90 break-words">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-1 px-1">
                                <span className="text-[10px] text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                                {currentUserId === comment.userId && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-[10px] text-muted-foreground/60 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Load More */}
            {hasMore && (
                <button
                    onClick={() => fetchComments(false)}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand-navy transition-colors py-2 mx-auto"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
                    Load more comments
                </button>
            )}

            {/* Loading state for initial load */}
            {loading && commentsList.length === 0 && (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Empty state */}
            {!loading && commentsList.length === 0 && (
                <p className="text-xs text-center text-muted-foreground/60 py-2">No comments yet. Be the first!</p>
            )}
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\components\CreatePost.tsx
```tsx
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image, X, Send, Loader2, CalendarDays, Megaphone, Clock, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

interface CreatePostProps {
    onPostCreated: (post: any) => void;
    userRole?: string;
    userName?: string;
}

export function CreatePost({ onPostCreated, userRole, userName }: CreatePostProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState("");
    const [type, setType] = useState("post");
    const [title, setTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [hostedBy, setHostedBy] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_CHARS = 1000;
    const canPostSpecial = userRole === "superuser" || userRole === "userX";

    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => textareaRef.current?.focus(), 100);
    };

    const handleFileChange = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        if (file.size > 5 * 1024 * 1024) { alert("Max size 5MB"); return; }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    }, []);

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setContent("");
        setTitle("");
        setType("post");
        setEventDate("");
        setHostedBy("");
        removeImage();
    };

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (val.length <= MAX_CHARS) setContent(val);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setIsLoading(true);

        try {
            let imageUrl: string | undefined;
            if (imageFile) {
                const ext = imageFile.name.split(".").pop();
                const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from("post-images")
                    .upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(filePath);
                imageUrl = publicUrl;
            }

            const payload: any = { content, type, imageUrl };
            if (type === "event" || type === "announcement") {
                payload.title = title || undefined;
            }
            if (type === "event") {
                payload.eventDate = eventDate || undefined;
                payload.hostedBy = hostedBy || undefined;
            }

            const newPost = await api.post("/social", payload);
            onPostCreated(newPost);
            handleCancel();
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const charPercent = (content.length / MAX_CHARS) * 100;
    const charColor = charPercent > 90 ? "text-red-500" : charPercent > 75 ? "text-amber-500" : "text-muted-foreground/50";

    return (
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden mb-6">
            {!isExpanded ? (
                /* â”€â”€ Collapsed bar â”€â”€ */
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-border/20 shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-rose-600 text-white text-sm font-semibold">
                                {userName?.[0] || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={handleExpand}
                            className="flex-1 px-4 py-2.5 text-left bg-muted/40 hover:bg-muted/60 rounded-full text-sm text-muted-foreground transition-colors"
                        >
                            What's on your mind?
                        </button>
                    </div>

                    {/* Quick-action buttons */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                        <div className="flex gap-1">
                            <Button
                                variant="ghost" size="sm"
                                onClick={() => { handleExpand(); setTimeout(() => fileInputRef.current?.click(), 200); }}
                                className="gap-1.5 h-8 rounded-full text-xs text-muted-foreground hover:text-green-600"
                            >
                                <Image className="w-4 h-4 text-green-500" /> Photo
                            </Button>
                            {canPostSpecial && (
                                <>
                                    <Button
                                        variant="ghost" size="sm"
                                        onClick={() => { handleExpand(); setType("event"); }}
                                        className="gap-1.5 h-8 rounded-full text-xs text-muted-foreground hover:text-violet-600"
                                    >
                                        <CalendarDays className="w-4 h-4 text-violet-500" /> Event
                                    </Button>
                                    <Button
                                        variant="ghost" size="sm"
                                        onClick={() => { handleExpand(); setType("announcement"); }}
                                        className="gap-1.5 h-8 rounded-full text-xs text-muted-foreground hover:text-amber-600"
                                    >
                                        <Megaphone className="w-4 h-4 text-amber-500" /> News
                                    </Button>
                                </>
                            )}
                        </div>
                        <Button
                            size="sm"
                            onClick={handleExpand}
                            className="h-8 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs px-5 font-semibold shadow-md shadow-rose-500/25"
                        >
                            Post
                        </Button>
                    </div>
                </div>
            ) : (
                /* â”€â”€ Expanded form â”€â”€ */
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4"
                >
                    {/* Type selector */}
                    {canPostSpecial && (
                        <div className="mb-3">
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-44 h-9 rounded-xl text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="post">ðŸ“ Post</SelectItem>
                                    <SelectItem value="event">ðŸ“… Event</SelectItem>
                                    <SelectItem value="announcement">ðŸ“£ News</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Title + extra fields */}
                    <AnimatePresence>
                        {(type === "event" || type === "announcement") && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-3 space-y-2"
                            >
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={type === "event" ? "Event name" : "News headline"}
                                    className="h-10 rounded-xl text-sm font-medium"
                                />
                                {type === "event" && (
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                            <Input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="h-9 rounded-xl text-xs pl-8" />
                                        </div>
                                        <div className="relative flex-1">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                            <Input value={hostedBy} onChange={(e) => setHostedBy(e.target.value)} placeholder="Hosted by..." className="h-9 rounded-xl text-xs pl-8" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={autoResize}
                        placeholder="Share something with your campus..."
                        rows={3}
                        className="w-full min-h-[80px] max-h-[200px] px-1 py-2 text-sm bg-transparent border-none resize-none focus:outline-none placeholder:text-muted-foreground/50 leading-relaxed"
                    />

                    {/* Char counter */}
                    <div className="flex justify-end mb-2">
                        <span className={`text-[10px] tabular-nums ${charColor}`}>{content.length}/{MAX_CHARS}</span>
                    </div>

                    {/* Image upload area */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                    >
                        <AnimatePresence>
                            {imagePreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative rounded-xl overflow-hidden mb-3 bg-muted/30"
                                >
                                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-xl" />
                                    <Button type="button" variant="ghost" size="icon" onClick={removeImage} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white">
                                        <X className="w-3.5 h-3.5" />
                                    </Button>
                                </motion.div>
                            )}
                            {isDragOver && !imagePreview && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-2 border-dashed border-rose-400/30 bg-rose-50/50 dark:bg-rose-900/10 rounded-xl p-6 text-center mb-3">
                                    <Image className="w-6 h-6 mx-auto mb-2 text-rose-400/50" />
                                    <p className="text-xs text-rose-400/60">Drop image here</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} className="hidden" />
                            <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5 h-8 rounded-full text-muted-foreground hover:text-green-600">
                                <Image className="w-4 h-4 text-green-500" />
                                <span className="text-xs">Photo</span>
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={handleCancel} className="h-8 rounded-full text-xs">Cancel</Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!content.trim() || isLoading}
                                className="h-8 rounded-full gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs px-5 font-semibold shadow-md shadow-rose-500/25"
                            >
                                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                Post
                            </Button>
                        </div>
                    </div>
                </motion.form>
            )}
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\components\PostCard.tsx
```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Heart, MessageCircle, Share2, Trash2, MoreHorizontal,
    Megaphone, CalendarDays, Sparkles, Check, ArrowRight, Clock, User as UserIcon
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { CommentSection } from "./CommentSection";
import type { Post } from "@/features/campus/types";

interface PostCardProps {
    post: Post;
    currentUserId?: string;
    onDelete?: () => void;
    defaultShowComments?: boolean;
}

export function PostCard({ post, currentUserId, onDelete, defaultShowComments = false }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
    const [showComments, setShowComments] = useState(defaultShowComments);
    const [shared, setShared] = useState(false);
    const [imageExpanded, setImageExpanded] = useState(false);
    const [likeScale, setLikeScale] = useState(1);

    const isAuthor = currentUserId === post.authorId;

    const handleLike = async () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
        setLikeScale(1.3);
        setTimeout(() => setLikeScale(1), 200);
        try {
            await api.post(`/social/${post.id}/like`, {});
        } catch (error) {
            setIsLiked(!newIsLiked);
            setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/social/${post.id}`);
            onDelete?.();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/unimedia/${post.id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: "Check out this post on UniMARKY", url });
            } else {
                await navigator.clipboard.writeText(url);
            }
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        } catch {
            await navigator.clipboard.writeText(url);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    const handleDoubleClick = () => {
        if (!isLiked) handleLike();
    };

    const timeAgo = (dateStr: string) => {
        const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return "Just now";
        const m = Math.floor(seconds / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        const d = Math.floor(h / 24);
        if (d < 7) return `${d}d ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    // â”€â”€ News/Announcement card â†’ horizontal magazine layout â”€â”€
    if (post.type === "announcement") {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden mb-4 hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300"
            >
                <div className="flex flex-col sm:flex-row">
                    {/* Left: Image (if any) */}
                    {post.imageUrl && (
                        <div className="sm:w-56 md:w-64 shrink-0 bg-muted/30 overflow-hidden">
                            <img
                                src={post.imageUrl}
                                alt={post.title || "News"}
                                className="w-full h-48 sm:h-full object-cover hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* Right: Content */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                        <div>
                            {/* Badge + Read time */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100/60 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/30">
                                    <Megaphone className="w-3 h-3" />
                                    News
                                </span>
                            </div>

                            {/* Title */}
                            {post.title && (
                                <h3 className="font-bold text-base sm:text-lg leading-snug mb-1.5 text-foreground">{post.title}</h3>
                            )}

                            {/* Content preview */}
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">{post.content}</p>
                        </div>

                        {/* Author + Date */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={post.author?.idCardUrl} />
                                    <AvatarFallback className="text-[10px] bg-rose-100/60 dark:bg-rose-900/30 text-rose-600 font-semibold">{post.author?.fullName?.[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium text-foreground">{post.author?.fullName}</span>
                                <span className="text-xs text-muted-foreground">Â· {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/30">
                            <div className="flex gap-1">
                                <motion.div animate={{ scale: likeScale }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                    <Button variant="ghost" size="sm" onClick={handleLike} className={`gap-1.5 h-8 px-3 rounded-full text-xs ${isLiked ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20" : "text-muted-foreground hover:text-rose-500"}`}>
                                        <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                                        {likesCount > 0 && <span className="tabular-nums">{likesCount}</span>}
                                    </Button>
                                </motion.div>
                                <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className={`gap-1.5 h-8 px-3 rounded-full text-xs ${showComments ? "text-rose-600 bg-rose-50 dark:bg-rose-900/20" : "text-muted-foreground"}`}>
                                    <MessageCircle className={`w-3.5 h-3.5 ${showComments ? "fill-current" : ""}`} />
                                    {commentsCount > 0 && <span className="tabular-nums">{commentsCount}</span>}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5 h-8 px-3 rounded-full text-xs text-muted-foreground hover:text-blue-500">
                                    {shared ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
                                    {shared ? <span className="text-green-500">Copied!</span> : <span>Share</span>}
                                </Button>
                            </div>
                            {isAuthor && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end"><DropdownMenuItem onClick={handleDelete} className="text-red-500 gap-2"><Trash2 className="w-4 h-4" />Delete</DropdownMenuItem></DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Comments */}
                        <AnimatePresence>
                            {showComments && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <CommentSection postId={post.id} currentUserId={currentUserId} commentsCount={commentsCount} onCountChange={(d) => setCommentsCount(prev => Math.max(0, prev + d))} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        );
    }

    // â”€â”€ Event card â†’ accent violet bar â”€â”€
    const isEvent = post.type === "event";

    // â”€â”€ Standard post + event card â”€â”€
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDoubleClick={handleDoubleClick}
            className="group bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden mb-4 hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300"
        >
            {/* Accent top bar for events */}
            {isEvent && (
                <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-400" />
            )}

            <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-border/20">
                            <AvatarImage src={post.author?.idCardUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-rose-600 text-white text-sm font-semibold">
                                {post.author?.fullName?.[0] || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{post.author?.fullName}</span>
                                {isEvent && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                                        <CalendarDays className="w-3 h-3" />
                                        Event
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)} â€¢ ðŸŒ</span>
                        </div>
                    </div>

                    {isAuthor && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[140px]">
                                <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500 gap-2">
                                    <Trash2 className="w-4 h-4" /> Delete Post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Title (events/announcements) */}
                {post.title && <h3 className="font-bold text-base mb-1">{post.title}</h3>}

                {/* Event metadata */}
                {isEvent && (post.eventDate || post.hostedBy) && (
                    <div className="flex flex-wrap gap-3 mb-2 text-xs text-muted-foreground">
                        {post.eventDate && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 rounded-full text-violet-600 dark:text-violet-400">
                                <Clock className="w-3 h-3" />
                                {new Date(post.eventDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                        {post.hostedBy && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 rounded-full text-violet-600 dark:text-violet-400">
                                <UserIcon className="w-3 h-3" />
                                Hosted by {post.hostedBy}
                            </span>
                        )}
                    </div>
                )}

                {/* Content */}
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed mb-3">{post.content}</p>

                {/* Image */}
                {post.imageUrl && (
                    <motion.div
                        className="relative rounded-xl overflow-hidden mb-3 cursor-pointer bg-muted/20"
                        layoutId={`image-${post.id}`}
                        onClick={() => setImageExpanded(!imageExpanded)}
                    >
                        <img
                            src={post.imageUrl}
                            alt="Post"
                            className={`w-full object-contain transition-all duration-300 ${imageExpanded ? 'max-h-[80vh]' : 'max-h-96'}`}
                            loading="lazy"
                        />
                    </motion.div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex gap-1">
                        <motion.div animate={{ scale: likeScale }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                            <Button
                                variant="ghost" size="sm" onClick={handleLike}
                                className={`gap-1.5 h-8 px-3 rounded-full transition-all duration-200 ${isLiked
                                    ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100"
                                    : "text-muted-foreground hover:bg-muted hover:text-rose-500"
                                    }`}
                            >
                                <Heart className={`w-4 h-4 transition-all ${isLiked ? "fill-current" : ""}`} />
                                <span className="text-xs font-medium tabular-nums">{likesCount > 0 ? likesCount : "Like"}</span>
                            </Button>
                        </motion.div>

                        <Button
                            variant="ghost" size="sm"
                            onClick={() => setShowComments(!showComments)}
                            className={`gap-1.5 h-8 px-3 rounded-full transition-all duration-200 ${showComments
                                ? "text-rose-600 bg-rose-50 dark:bg-rose-900/20"
                                : "text-muted-foreground hover:bg-muted hover:text-rose-600"
                                }`}
                        >
                            <MessageCircle className={`w-4 h-4 ${showComments ? "fill-current" : ""}`} />
                            <span className="text-xs font-medium tabular-nums">{commentsCount > 0 ? commentsCount : "Comment"}</span>
                        </Button>

                        <Button
                            variant="ghost" size="sm"
                            onClick={handleShare}
                            className="gap-1.5 h-8 px-3 rounded-full text-muted-foreground hover:bg-muted hover:text-blue-500 transition-all"
                        >
                            <AnimatePresence mode="wait">
                                {shared ? (
                                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span className="text-xs font-medium text-green-500">Copied!</span>
                                    </motion.div>
                                ) : (
                                    <motion.div key="share" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5">
                                        <Share2 className="w-4 h-4" />
                                        <span className="text-xs font-medium">Share</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </div>

                {/* Comment Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <CommentSection
                                postId={post.id}
                                currentUserId={currentUserId}
                                commentsCount={commentsCount}
                                onCountChange={(delta) => setCommentsCount(prev => Math.max(0, prev + delta))}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\pages\AnnouncementsPage.tsx
```tsx
import { motion } from "motion/react";
import { Megaphone, Calendar, Pin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    universityName: string;
}

export function AnnouncementsPage() {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (!user?.user_metadata?.university_name) return;

            try {
                // Assuming the API route uses the university query param
                const res = await fetch(`http://localhost:3000/api/campus/announcements?university=${encodeURIComponent(user.user_metadata.university_name)}`);
                if (res.ok) {
                    const data = await res.json();
                    setAnnouncements(data);
                }
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [user]);

    return (
        <div className="container min-h-screen py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-brand-navy flex items-center gap-3">
                    <Megaphone className="h-8 w-8 text-brand-yellow" />
                    Campus Announcements
                </h1>
                <p className="text-muted-foreground text-lg">
                    Real-time updates from {user?.user_metadata?.university_name || "your university"}.
                </p>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-xl bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border">
                    <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-brand-navy">No announcements yet</h3>
                    <p className="text-muted-foreground">Check back later for important updates.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {announcements.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full border-brand-navy/5 hover:border-brand-yellow/50 transition-colors group overflow-hidden">
                                <CardHeader className="bg-brand-yellow/5 border-b border-brand-yellow/10 pb-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="leading-snug text-lg font-bold text-brand-navy group-hover:text-brand-orange transition-colors">
                                            {item.title}
                                        </CardTitle>
                                        <Pin className="h-4 w-4 text-brand-yellow shrink-0 rotate-45 opacity-50" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-2">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {item.content}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\pages\LostFoundPage.tsx
```tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Search, Eye, Plus, ChevronDown, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LostFoundItem {
    id: string;
    itemName: string;
    description: string;
    type: "lost" | "found";
    location: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    reporterName: string;
}

interface LostFoundResponse {
    items: LostFoundItem[];
    hasMore: boolean;
    total: number;
}

const typeFilters = [
    { value: "all", label: "All Items" },
    { value: "lost", label: "Lost Items" },
    { value: "found", label: "Found Items" },
];

export function LostFoundPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [activeType, setActiveType] = useState("all");
    const LIMIT = 20;

    const fetchItems = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offset;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const typeParam = activeType !== "all" ? `&type=${activeType}` : "";
            const response: LostFoundResponse = await api.get(
                `/lostfound?limit=${LIMIT}&offset=${currentOffset}${typeParam}`
            );

            if (reset) {
                setItems(response.items);
            } else {
                setItems(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            setOffset(currentOffset + response.items.length);
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [offset, activeType]);

    useEffect(() => {
        setOffset(0);
        fetchItems(true);
    }, [activeType]);

    const handleTypeChange = (type: string) => {
        setActiveType(type);
    };

    const handleLoadMore = () => {
        fetchItems(false);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                >
                    <span className="text-brand-navy">LOST & </span>
                    <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">FOUND</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                >
                    Help your campus community by reporting lost items or returning found ones.
                </motion.p>
            </div>

            {/* Type Filter Pills */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8"
            >
                {typeFilters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => handleTypeChange(filter.value)}
                        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${activeType === filter.value
                            ? filter.value === "lost"
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                : filter.value === "found"
                                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                    : "bg-brand-navy text-white shadow-lg shadow-brand-navy/20"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </motion.div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                </div>
            ) : (
                <>
                    {/* Items Grid */}
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <Link to={`/lost-found/${item.id}`} className="group block">
                                        <div className="relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50 hover:border-border hover:shadow-xl transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.itemName}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        {item.type === "lost" ? (
                                                            <Search className="w-12 h-12 text-muted-foreground/30" />
                                                        ) : (
                                                            <Eye className="w-12 h-12 text-muted-foreground/30" />
                                                        )}
                                                    </div>
                                                )}

                                                {/* Badge */}
                                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${item.type === "lost"
                                                    ? "bg-red-500 text-white"
                                                    : "bg-green-500 text-white"
                                                    }`}>
                                                    {item.type.toUpperCase()}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <h3 className="font-bold text-foreground truncate group-hover:text-teal-600 transition-colors">
                                                    {item.itemName}
                                                </h3>

                                                {item.location && (
                                                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {item.location}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                                                    <p className="text-xs text-muted-foreground">
                                                        by <span className="font-medium text-foreground">{item.reporterName}</span>
                                                    </p>
                                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(item.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {items.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                                <Search className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No items reported</h3>
                            <p className="text-muted-foreground mb-6">
                                That's good news! Nothing lost or found yet.
                            </p>
                            <Button onClick={() => navigate("/lost-found/report")} className="rounded-full">
                                Report an Item
                            </Button>
                        </motion.div>
                    )}

                    {/* Load More Button */}
                    {hasMore && items.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-12"
                        >
                            <Button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                variant="outline"
                                className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all gap-2"
                            >
                                {loadingMore ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        View More Items
                                        <ChevronDown className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Results Count */}
                    {!loading && total > 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Showing {items.length} of {total} items
                        </p>
                    )}
                </>
            )}

            {/* Floating Add Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                onClick={() => navigate("/lost-found/report")}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center"
            >
                <Plus className="w-8 h-8" strokeWidth={2.5} />
            </motion.button>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\pages\MyContentPage.tsx
```tsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Loader2, ArrowUp, User, Sparkles, Trash2, Eye, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { Post } from "@/features/campus/types";

const MY_CONTENT_TABS = [
    { id: "all", label: "All" },
    { id: "post", label: "My Posts" },
    { id: "announcement", label: "My News" },
    { id: "event", label: "My Events" },
] as const;

/* â”€â”€ My Content Grid Card â”€â”€ */
function MyContentCard({ post, onDelete }: { post: Post; onDelete: () => void }) {
    const typeConfig: Record<string, { color: string; bg: string; label: string }> = {
        post: { color: "text-rose-600", bg: "bg-rose-100/60 dark:bg-rose-900/30", label: "Post" },
        event: { color: "text-violet-600", bg: "bg-violet-100/60 dark:bg-violet-900/30", label: "Event" },
        announcement: { color: "text-amber-600", bg: "bg-amber-100/60 dark:bg-amber-900/30", label: "News" },
    };
    const cfg = typeConfig[post.type] ?? { color: "text-rose-600", bg: "bg-rose-100/60", label: "Post" };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden group hover:shadow-md hover:border-rose-200/60 dark:hover:border-rose-500/20 transition-all"
        >
            {post.imageUrl && (
                <div className="relative h-36 sm:h-40 overflow-hidden">
                    <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
            )}
            <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
                        {cfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="font-semibold text-sm line-clamp-2 mb-2">{post.title || post.content.slice(0, 60)}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{post.likesCount}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.commentsCount}</span>
                </div>
                <div className="flex justify-end pt-2 mt-2 border-t border-rose-100/30 dark:border-white/5">
                    <button onClick={onDelete} className="text-[11px] text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export function MyContentPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [myPostsLoading, setMyPostsLoading] = useState(true);
    const [myPostsLoadingMore, setMyPostsLoadingMore] = useState(false);
    const [myPostsHasMore, setMyPostsHasMore] = useState(true);
    const [myPostsOffset, setMyPostsOffset] = useState(0);
    const [myContentTab, setMyContentTab] = useState("all");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const LIMIT = 10;

    const fetchMyPosts = useCallback(async (reset = false) => {
        if (reset) setMyPostsLoading(true); else setMyPostsLoadingMore(true);
        const off = reset ? 0 : myPostsOffset;
        try {
            const res = await api.get(`/social/my-posts?limit=${LIMIT}&offset=${off}`);
            if (reset) { setMyPosts(res.items); setMyPostsOffset(LIMIT); }
            else { setMyPosts(prev => [...prev, ...res.items]); setMyPostsOffset(prev => prev + LIMIT); }
            setMyPostsHasMore(res.hasMore);
        } catch (err) { console.error(err); }
        finally { setMyPostsLoading(false); setMyPostsLoadingMore(false); }
    }, [myPostsOffset]);

    useEffect(() => { fetchMyPosts(true); }, []);

    useEffect(() => {
        const handler = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handleDeletePost = async (postId: string) => {
        try {
            await api.delete(`/social/${postId}`);
            setMyPosts(prev => prev.filter(p => p.id !== postId));
        } catch (err) { console.error(err); }
    };

    const filteredMyPosts = myContentTab === "all" ? myPosts : myPosts.filter(p => p.type === myContentTab);

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-background to-background dark:from-rose-950/10">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">My Content</h2>
                        <p className="text-sm text-muted-foreground">Manage and monitor your published media</p>
                    </div>
                    <Button
                        onClick={() => navigate("/unimedia")}
                        className="rounded-full gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold px-5 shadow-lg shadow-rose-500/30 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-4 border-b border-rose-100/40 dark:border-white/10 overflow-x-auto scrollbar-hide -mx-1 px-1">
                    {MY_CONTENT_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setMyContentTab(tab.id)}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all ${myContentTab === tab.id
                                ? "border-rose-500 text-rose-600 dark:text-rose-400"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-rose-500 font-medium">
                        Showing: <span className="bg-rose-100/60 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">{filteredMyPosts.length} Items</span>
                    </p>
                </div>

                {/* Grid */}
                {myPostsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-40 bg-rose-100/30 dark:bg-rose-900/10" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 bg-rose-100/40 dark:bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-rose-100/30 dark:bg-white/5 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredMyPosts.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100/50 dark:bg-rose-900/20 flex items-center justify-center">
                            <User className="w-8 h-8 text-rose-300 dark:text-rose-700" />
                        </div>
                        <h3 className="font-semibold text-foreground/70 mb-1">No content yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start creating posts to see them here</p>
                        <Button
                            onClick={() => navigate("/unimedia")}
                            className="rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 shadow-lg shadow-rose-500/25"
                        >
                            Create Your First Post
                        </Button>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredMyPosts.map(post => (
                                <MyContentCard key={post.id} post={post} onDelete={() => handleDeletePost(post.id)} />
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {/* Load More */}
                {myPostsHasMore && !myPostsLoading && filteredMyPosts.length > 0 && (
                    <div className="flex justify-center py-8">
                        <Button
                            variant="outline"
                            onClick={() => fetchMyPosts(false)}
                            disabled={myPostsLoadingMore}
                            className="rounded-full gap-2 px-8 border-rose-200 dark:border-rose-800/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-semibold"
                        >
                            {myPostsLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                            Load More Content
                        </Button>
                    </div>
                )}
            </div>

            {/* Scroll to Top FAB */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-rose-500/40 transition-all"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\pages\PostDetailPage.tsx
```tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { PostCard } from "@/features/campus/components/PostCard";
import type { Post } from "@/features/campus/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/social/${id}`)
            .then((data) => setPost(data))
            .catch((err) => setError(err.message || "Post not found"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = () => {
        navigate("/unimedia", { replace: true });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <h2 className="text-xl font-bold mb-2">Post not found</h2>
                <p className="text-muted-foreground mb-4">{error || "This post may have been deleted."}</p>
                <Button onClick={() => navigate("/unimedia")} variant="outline">
                    â† Back to Unimedia
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/unimedia")}
                    className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed
                </Button>

                <PostCard
                    post={post}
                    currentUserId={user?.id}
                    onDelete={handleDelete}
                    defaultShowComments={true}
                />
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\pages\UnimediaPage.tsx
```tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Loader2, ArrowUp, User, TrendingUp, Newspaper,
    CalendarDays, Megaphone, Sparkles, Trash2, Eye, Plus,
    Rss
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { CreatePost } from "@/features/campus/components/CreatePost";
import { PostCard } from "@/features/campus/components/PostCard";
import type { Post, UserProfile } from "@/features/campus/types";

const FEED_TABS = [
    { id: "all", label: "All Feed" },
    { id: "post", label: "Posts" },
    { id: "event", label: "Events" },
    { id: "announcement", label: "News" },
] as const;

/* â”€â”€ Shimmer skeleton â”€â”€ */
function PostSkeleton() {
    return (
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-rose-100/40 dark:border-white/10 rounded-2xl p-5 mb-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-100/50 dark:bg-white/10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-rose-100/50 dark:bg-white/10 rounded-full w-28" />
                    <div className="h-2 bg-rose-100/40 dark:bg-white/5 rounded-full w-16" />
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-rose-100/50 dark:bg-white/10 rounded-full w-full" />
                <div className="h-3 bg-rose-100/40 dark:bg-white/5 rounded-full w-3/4" />
            </div>
            <div className="flex gap-4 pt-3 border-t border-rose-100/30">
                <div className="h-8 bg-rose-100/40 dark:bg-white/5 rounded-full w-16" />
                <div className="h-8 bg-rose-100/40 dark:bg-white/5 rounded-full w-20" />
            </div>
        </div>
    );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• Main Page â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export function UnimediaPage() {
    const { user } = useAuth();
    const createPostRef = useRef<HTMLDivElement>(null);

    /* Feed state */
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [offset, setOffset] = useState(0);

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const LIMIT = 10;

    useEffect(() => {
        api.get("/profiles/me").then(setUserProfile).catch(console.error);
    }, []);

    /* Fetch Feed */
    const fetchPosts = useCallback(async (reset = false) => {
        if (reset) setLoading(true); else setLoadingMore(true);
        const off = reset ? 0 : offset;
        try {
            const res = await api.get(`/social?type=${activeTab}&limit=${LIMIT}&offset=${off}`);
            if (reset) { setPosts(res.items); setOffset(LIMIT); }
            else { setPosts(prev => [...prev, ...res.items]); setOffset(prev => prev + LIMIT); }
            setHasMore(res.hasMore);
        } catch (err) { console.error(err); }
        finally { setLoading(false); setLoadingMore(false); }
    }, [activeTab, offset]);

    useEffect(() => { fetchPosts(true); }, [activeTab]);

    useEffect(() => {
        const handler = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handlePostCreated = (newPost: Post) => {
        api.get(`/social/${newPost.id}`)
            .then(full => { setPosts(prev => [full, ...prev]); })
            .catch(() => { setPosts(prev => [newPost, ...prev]); });
    };

    const handleDeletePost = (postId: string) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-background to-background dark:from-rose-950/10">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                {/* Filter pills â€” glass style */}
                <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                    {FEED_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                                ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/30 scale-[1.02]"
                                : "bg-white/60 dark:bg-white/5 backdrop-blur-sm text-foreground/70 border border-white/50 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-400 hover:shadow-sm"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    {/* â”€â”€ Main feed â”€â”€ */}
                    <div className="flex-1 min-w-0">
                        <div ref={createPostRef}>
                            <CreatePost onPostCreated={handlePostCreated} userRole={userProfile?.role} userName={userProfile?.fullName} />
                        </div>

                        {loading ? (
                            <div><PostSkeleton /><PostSkeleton /><PostSkeleton /></div>
                        ) : posts.length === 0 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100/50 dark:bg-rose-900/20 flex items-center justify-center">
                                    <Rss className="w-8 h-8 text-rose-300 dark:text-rose-700" />
                                </div>
                                <h3 className="font-semibold text-foreground/70 mb-1">No posts yet</h3>
                                <p className="text-sm text-muted-foreground">Be the first to share something!</p>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} currentUserId={user?.id} onDelete={() => handleDeletePost(post.id)} />
                                ))}
                            </AnimatePresence>
                        )}

                        {hasMore && !loading && posts.length > 0 && (
                            <div className="flex justify-center py-6">
                                <Button
                                    variant="outline"
                                    onClick={() => fetchPosts(false)}
                                    disabled={loadingMore}
                                    className="rounded-full gap-2 px-6 border-rose-200 dark:border-rose-800/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-semibold backdrop-blur-sm"
                                >
                                    {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Load More
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* â”€â”€ Sidebar â€” hidden on mobile â”€â”€ */}
                    <aside className="hidden md:flex md:flex-col w-72 xl:w-80 shrink-0 gap-5">
                        {/* Trending */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm p-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-3">
                                <TrendingUp className="w-4 h-4" /> Trending on Campus
                            </h3>
                            <div className="space-y-3">
                                {posts.filter(p => p.likesCount > 0).slice(0, 3).map((post) => (
                                    <a key={post.id} href={`/unimedia/${post.id}`} className="block group">
                                        <p className="text-[11px] text-muted-foreground">
                                            {post.type === "event" ? "Events" : post.type === "announcement" ? "News" : "Posts"} â€¢ Trending
                                        </p>
                                        <p className="text-sm font-semibold group-hover:text-rose-500 transition-colors line-clamp-1">
                                            {post.title || post.content.slice(0, 50)}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">{post.likesCount} likes Â· {post.commentsCount} comments</p>
                                    </a>
                                ))}
                                {posts.filter(p => p.likesCount > 0).length === 0 && (
                                    <p className="text-xs text-muted-foreground/60 text-center py-2">No trending posts yet</p>
                                )}
                            </div>
                        </div>

                        {/* Latest News */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm p-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-3">
                                <Newspaper className="w-4 h-4" /> Latest News
                            </h3>
                            <div className="space-y-3">
                                {posts.filter(p => p.type === "announcement").slice(0, 3).map((post) => (
                                    <a key={post.id} href={`/unimedia/${post.id}`} className="flex items-start gap-2.5 group">
                                        {post.imageUrl && (
                                            <img src={post.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold group-hover:text-rose-500 transition-colors line-clamp-2">{post.title || post.content.slice(0, 40)}</p>
                                            <p className="text-[11px] text-muted-foreground">by {post.author?.fullName}</p>
                                        </div>
                                    </a>
                                ))}
                                {posts.filter(p => p.type === "announcement").length === 0 && (
                                    <p className="text-xs text-muted-foreground/60 text-center py-2">No news yet</p>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* â•â•â•â•â•â•â• Scroll to Top FAB â•â•â•â•â•â•â• */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-rose-500/40 transition-all"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\campus\types.ts
```ts
export interface Post {
    id: string;
    authorId: string;
    type: "post" | "event" | "announcement";
    title?: string;
    content: string;
    imageUrl?: string;
    eventDate?: string;
    hostedBy?: string;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    universityName: string;
    createdAt: string;
    updatedAt: string;
    isLiked?: boolean;
    author: {
        id: string;
        fullName: string;
        idCardUrl?: string;
        role: string;
    };
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        fullName: string;
        idCardUrl?: string;
        role: string;
    };
}

export interface UserProfile {
    id: string;
    fullName: string;
    role: "normal" | "superuser" | "admin" | "userX";
    universityName: string;
    idCardUrl?: string;
}
```

## File: D:\unmarky\apps\web\src\features\dashboard\DashboardPage.tsx
```tsx
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Loader2,
    ShoppingBag,
    Search,
    Newspaper,
    Utensils,
    Home,
    GraduationCap,
    ArrowRight,
    TrendingUp,
    Sparkles
} from 'lucide-react';

interface DashboardData {
    marketplace?: { id: string; title?: string }[];
    lostFound?: { id: string; itemName?: string }[];
    social?: { id: string; content?: string }[];
}

const quickAccessItems = [
    {
        title: "Marketplace",
        href: "/marketplace",
        desc: "Buy & Sell items",
        icon: ShoppingBag,
        gradient: "from-amber-500 to-orange-600",
        shadowColor: "shadow-orange-500/20"
    },
    {
        title: "Lost & Found",
        href: "/lost-found",
        desc: "Find missing items",
        icon: Search,
        gradient: "from-teal-500 to-emerald-600",
        shadowColor: "shadow-emerald-500/20"
    },
    {
        title: "Unimedia",
        href: "/unimedia",
        desc: "Campus social feed",
        icon: Newspaper,
        gradient: "from-pink-500 to-rose-600",
        shadowColor: "shadow-rose-500/20"
    },
    {
        title: "Study",
        href: "/study",
        desc: "Academic resources",
        icon: GraduationCap,
        gradient: "from-indigo-500 to-violet-600",
        shadowColor: "shadow-indigo-500/20"
    },
    {
        title: "Food",
        href: "/food",
        desc: "Campus dining",
        icon: Utensils,
        gradient: "from-red-500 to-orange-600",
        shadowColor: "shadow-red-500/20"
    },
    {
        title: "Housing",
        href: "/housing",
        desc: "Find a place to stay",
        icon: Home,
        gradient: "from-purple-500 to-indigo-600",
        shadowColor: "shadow-purple-500/20"
    },
];

export function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/dashboard/summary')
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
                >
                    <span className="text-brand-navy">YOUR </span>
                    <span className="bg-gradient-to-r from-brand-blue to-brand-orange bg-clip-text text-transparent">CAMPUS HUB</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-base sm:text-lg"
                >
                    Everything your campus needs, in one place.
                </motion.p>
            </div>

            {/* Stats Overview */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
                <motion.div variants={item}>
                    <SummaryCard
                        title="Marketplace"
                        href="/marketplace"
                        data={data?.marketplace}
                        icon={ShoppingBag}
                        color="text-orange-500"
                        bgColor="bg-orange-500/10"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <SummaryCard
                        title="Lost & Found"
                        href="/lost-found"
                        data={data?.lostFound}
                        icon={Search}
                        color="text-teal-500"
                        bgColor="bg-teal-500/10"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <SummaryCard
                        title="Campus Buzz"
                        href="/unimedia"
                        data={data?.social}
                        icon={Newspaper}
                        color="text-pink-500"
                        bgColor="bg-pink-500/10"
                    />
                </motion.div>
            </motion.div>

            {/* Quick Access Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-orange" />
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-navy">Explore Campus</h2>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                >
                    {quickAccessItems.map((qItem) => (
                        <motion.div
                            key={qItem.href}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                show: { opacity: 1, scale: 1 }
                            }}
                        >
                            <QuickAccessCard {...qItem} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

interface SummaryCardProps {
    title: string;
    href: string;
    data?: { id: string; title?: string; content?: string; itemName?: string }[];
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

function SummaryCard({ title, href, data, icon: Icon, color, bgColor }: SummaryCardProps) {
    return (
        <Link to={href} className="group block">
            <Card className="h-full border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${bgColor}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <CardTitle className="text-base sm:text-lg font-bold group-hover:text-brand-navy transition-colors">
                            {title}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {data && data.length > 0 ? (
                        <ul className="space-y-2">
                            {data.slice(0, 3).map((i) => (
                                <li key={i.id} className="text-sm truncate text-muted-foreground group-hover:text-foreground transition-colors">
                                    â€¢ {i.title || i.content || i.itemName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            No recent activity
                        </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3 group-hover:text-brand-navy transition-colors">
                        View all <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

interface QuickAccessCardProps {
    title: string;
    href: string;
    desc: string;
    icon: React.ElementType;
    gradient: string;
    shadowColor: string;
}

function QuickAccessCard({ title, href, desc, icon: Icon, gradient, shadowColor }: QuickAccessCardProps) {
    return (
        <Link to={href} className="group block">
            <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative h-full p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadowColor} hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3 opacity-90" />
                    <h3 className="text-sm sm:text-base font-bold mb-0.5 sm:mb-1">{title}</h3>
                    <p className="text-[10px] sm:text-xs opacity-80 line-clamp-1">{desc}</p>
                </div>
            </motion.div>
        </Link>
    );
}
```

## File: D:\unmarky\apps\web\src\features\landing\components\CommunitySection.tsx
```tsx
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, Laugh, Info, Heart } from "lucide-react";

type ReviewType = "appreciating" | "funny" | "info";

interface Review {
    name: string;
    dept: string;
    text: string;
    initials: string;
    type: ReviewType;
    stars: number;
}

const typeBadge: Record<ReviewType, { label: string; icon: typeof Star; color: string }> = {
    appreciating: { label: "Love", icon: Heart, color: "text-pink-500 bg-pink-500/10" },
    funny: { label: "Funny", icon: Laugh, color: "text-amber-500 bg-amber-500/10" },
    info: { label: "Helpful", icon: Info, color: "text-blue-500 bg-blue-500/10" },
};

const reviewsRow1: Review[] = [
    {
        name: "Aarav Sharma",
        dept: "CSE, 3rd Year",
        text: "Bhai yeh app ne literally meri life easy kar di. Textbooks mili half price mein, aur seller bhi verified tha. No scam vibes! ðŸ”¥",
        initials: "AS",
        type: "appreciating",
        stars: 5,
    },
    {
        name: "Priya Verma",
        dept: "Psychology, 2nd Year",
        text: "Housing section se PG dhundha and it was actually good. Photos real thi, unlike OLX wale uncle ðŸ˜‚",
        initials: "PV",
        type: "funny",
        stars: 5,
    },
    {
        name: "Rohit Meena",
        dept: "Electrical Engg, 4th Year",
        text: "Lost & Found section mein apna calculator post kiya aur 2 din mein mil gaya. Kaafi solid feature hai genuinely.",
        initials: "RM",
        type: "info",
        stars: 4,
    },
    {
        name: "Sneha Gupta",
        dept: "MBA, 1st Year",
        text: "Study section is a goldmine yaar! Previous year papers mil gaye department wise. Ab toh exam prep easy ho gayi ðŸ“š",
        initials: "SG",
        type: "appreciating",
        stars: 5,
    },
    {
        name: "Vikram Singh",
        dept: "Biotechnology, 2nd Year",
        text: "Food section mein jo momos wale bhaiya ka stall mila, uski chutney ke liye main roz jaata hu ab ðŸ˜‹",
        initials: "VS",
        type: "funny",
        stars: 5,
    },
    {
        name: "Ananya Joshi",
        dept: "English Lit, 3rd Year",
        text: "Finally ek platform jahan sab kuch ek jagah mil jaata hai. Marketplace, food, housing â€” sab sorted!",
        initials: "AJ",
        type: "appreciating",
        stars: 5,
    },
];

const reviewsRow2: Review[] = [
    {
        name: "Kunal Thakur",
        dept: "Mechanical Engg, 4th Year",
        text: "Marketplace pe apna purana laptop becha within 3 hours. Buyer bhi college ka hi tha toh trust issue zero ðŸ’¯",
        initials: "KT",
        type: "info",
        stars: 5,
    },
    {
        name: "Ishita Rani",
        dept: "Pharmacy, 2nd Year",
        text: "Yeh app banane wale ko Nobel Prize do yaar ðŸ˜‚ Itna useful platform pehle kyun nahi tha campus ke liye!",
        initials: "IR",
        type: "funny",
        stars: 5,
    },
    {
        name: "Deepak Kumar",
        dept: "Commerce, 1st Year",
        text: "Notes section mein sessional ke notes mil gaye woh bhi topper ke. Padhai ka scene set ho gaya boss ðŸŽ¯",
        initials: "DK",
        type: "appreciating",
        stars: 5,
    },
    {
        name: "Riya Choudhary",
        dept: "Fine Arts, 3rd Year",
        text: "Unimedia section mein apne art showcase kiya aur bahut appreciation mili. Real campus social media vibes! ðŸŽ¨",
        initials: "RC",
        type: "appreciating",
        stars: 4,
    },
    {
        name: "Arjun Patel",
        dept: "CSE, 2nd Year",
        text: "Housing mein PG search karte waqt filter options bahut kaam aaye. Location, price sab set kar sakte ho easily.",
        initials: "AP",
        type: "info",
        stars: 4,
    },
    {
        name: "Kavya Reddy",
        dept: "Law, 1st Year",
        text: "Mera phone gum ho gaya tha campus mein. Lost & Found pe daala aur kisi ne return kar diya next day. Faith in humanity restored ðŸ™",
        initials: "KR",
        type: "appreciating",
        stars: 5,
    },
];

function ReviewCard({ review }: { review: Review }) {
    const badge = typeBadge[review.type];
    const BadgeIcon = badge.icon;

    return (
        <div className="w-[320px] md:w-[360px] flex-shrink-0 rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors duration-300 p-5 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-brand-navy to-brand-navy/80 text-white text-xs font-bold">
                            {review.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-sm text-foreground leading-tight">{review.name}</p>
                        <p className="text-[11px] text-muted-foreground">{review.dept}</p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.color}`}>
                    <BadgeIcon className="w-3 h-3" />
                    {badge.label}
                </span>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                ))}
            </div>

            {/* Text */}
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-normal">
                "{review.text}"
            </p>
        </div>
    );
}

function TickerRow({ reviews, direction = "left", duration = 35 }: { reviews: Review[]; direction?: "left" | "right"; duration?: number }) {
    const tripled = [...reviews, ...reviews, ...reviews];
    const xStart = direction === "left" ? 0 : -1200;
    const xEnd = direction === "left" ? -1200 : 0;

    return (
        <div className="flex relative w-full">
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-background to-transparent z-10" />
            <motion.div
                className="flex gap-4 whitespace-nowrap"
                animate={{ x: [xStart, xEnd] }}
                transition={{ repeat: Infinity, duration, ease: "linear" }}
            >
                {tripled.map((review, i) => (
                    <ReviewCard key={`${review.initials}-${i}`} review={review} />
                ))}
            </motion.div>
        </div>
    );
}

export function CommunitySection() {
    return (
        <section id="community" className="py-20 overflow-hidden bg-background border-t border-border/40">
            <div className="container px-4 mx-auto mb-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h4 className="text-sm font-bold tracking-widest text-brand-blue uppercase mb-3">COMMUNITY</h4>
                    <h2 className="text-3xl md:text-4xl font-black text-brand-navy tracking-tight mb-3">
                        What Students Are Saying
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-sm">
                        Real reviews from real students across the campus. No cap. ðŸ’¯
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center justify-center gap-6 sm:gap-10 mt-6"
                >
                    <div className="text-center">
                        <p className="text-2xl font-black text-brand-navy">2K+</p>
                        <p className="text-[11px] text-muted-foreground">Active Users</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-brand-navy">4.8</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 justify-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Avg Rating
                        </p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-brand-navy">500+</p>
                        <p className="text-[11px] text-muted-foreground">Reviews</p>
                    </div>
                </motion.div>
            </div>

            {/* Two ticker rows moving in opposite directions */}
            <div className="space-y-4">
                <TickerRow reviews={reviewsRow1} direction="left" duration={40} />
                <TickerRow reviews={reviewsRow2} direction="right" duration={45} />
            </div>
        </section>
    );
}
```

## File: D:\unmarky\apps\web\src\features\landing\components\EcosystemSection.tsx
```tsx
import { motion, useInView, useMotionValue, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ShoppingBag, MessageSquare, BookOpen, Search, Utensils, House, ArrowUpRight, Sparkles } from "lucide-react";
import { useRef, useState, useCallback } from "react";

const features = [
    {
        icon: ShoppingBag,
        title: "Marketplace",
        subtitle: "Buy & Sell",
        desc: "Secure marketplace for textbooks, electronics, and dorm essentials.",
        action: "Start Trading",
        href: "/marketplace",
        gradient: "from-brand-orange to-amber-500",
        glowColor: "rgba(249, 115, 22, 0.4)",
    },
    {
        icon: MessageSquare,
        title: "Unimedia",
        subtitle: "Social Hub",
        desc: "Connect with peers, join clubs, and find your crowd on campus.",
        action: "Connect Now",
        href: "/unimedia",
        gradient: "from-blue-500 to-cyan-500",
        glowColor: "rgba(59, 130, 246, 0.4)",
    },
    {
        icon: BookOpen,
        title: "Study",
        subtitle: "Academic Resources",
        desc: "Notes, previous year papers, sessional exams â€” filtered by department.",
        action: "Explore Resources",
        href: "/study",
        gradient: "from-indigo-500 to-violet-500",
        glowColor: "rgba(99, 102, 241, 0.4)",
    },
    {
        icon: House,
        title: "Housing",
        subtitle: "Accommodation",
        desc: "Find your perfect home away from home with verified listings.",
        action: "Find Home",
        href: "/housing",
        gradient: "from-purple-500 to-pink-500",
        glowColor: "rgba(168, 85, 247, 0.4)",
    },
    {
        icon: Search,
        title: "Recovery",
        subtitle: "Lost & Found",
        desc: "Community-driven item recovery system for the campus.",
        action: "Check Listings",
        href: "/lost-found",
        gradient: "from-teal-500 to-emerald-500",
        glowColor: "rgba(20, 184, 166, 0.4)",
    },
    {
        icon: Utensils,
        title: "Food",
        subtitle: "Nearby Eats",
        desc: "Discover the best eats around campus with menus and discounts.",
        action: "Find Food",
        href: "/food",
        gradient: "from-red-500 to-rose-500",
        glowColor: "rgba(239, 68, 68, 0.4)",
    }
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });
    const [hasHovered, setHasHovered] = useState(false);

    // Mouse tracking for glow effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    }, [mouseX, mouseY]);

    const handleMouseEnter = () => {
        if (!hasHovered) setHasHovered(true);
    };

    // Transform mouse position to gradient position
    const background = useTransform(
        [mouseX, mouseY],
        ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, ${feature.glowColor}, transparent 70%)`
    );

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }}
        >
            <Link to={feature.href} className="group block h-full">
                <div
                    className="relative h-full overflow-hidden rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors duration-300"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                >
                    {/* Mouse-following glow */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ background }}
                    />

                    {/* Single-run border light sweep on first hover */}
                    {hasHovered && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        >
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-[2px]"
                                style={{ background: `linear-gradient(90deg, transparent, ${feature.glowColor}, transparent)` }}
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                style={{ background: `linear-gradient(90deg, transparent, ${feature.glowColor}, transparent)` }}
                                initial={{ x: "100%" }}
                                animate={{ x: "-100%" }}
                                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
                            />
                        </motion.div>
                    )}

                    <div className="relative p-5 sm:p-6 flex flex-col h-full">
                        {/* Top row: Icon + Arrow */}
                        <div className="flex items-center justify-between mb-4">
                            <motion.div
                                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <feature.icon className="w-5 h-5 text-white" />
                            </motion.div>
                            <div className="p-1.5 rounded-full bg-muted/30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-0.5">
                                {feature.subtitle}
                            </p>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand-navy transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 pt-3 border-t border-border/30">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:gap-2.5 transition-all duration-300`}>
                                {feature.action}
                                <ArrowUpRight className="w-3 h-3" style={{ color: feature.glowColor }} />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export function EcosystemSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section id="ecosystem" className="relative py-20 md:py-28 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl" />

            <div ref={sectionRef} className="container px-4 mx-auto relative">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-navy/10 to-brand-navy/5 border border-brand-navy/10 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-brand-navy" />
                        <span className="text-sm font-semibold text-brand-navy">The Ecosystem</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-5"
                    >
                        Everything You Need,{" "}
                        <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                            One Platform
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        A unified hub for every aspect of campus life. From buying textbooks to finding food â€” we've got you covered.
                    </motion.p>
                </div>

                {/* Feature Grid â€” compact 3-col */}
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-12 text-center"
                >
                    {/* <p className="text-muted-foreground text-sm">
                        More modules coming soon.{" "}
                        <Link to="/auth" className="font-semibold text-brand-orange hover:underline underline-offset-4">
                            Join the waitlist â†’
                        </Link>
                    </p> */}
                </motion.div>
            </div>
        </section>
    );
}
```

## File: D:\unmarky\apps\web\src\features\landing\components\HeroSection.tsx
```tsx
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "motion/react";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowDown, Sparkles, Zap, Shield, Users } from "lucide-react";
import { useEffect, useRef } from "react";

// Floating object configuration with depth layers
const floatingObjects = [
    // Layer 1 - Far away (subtle movement)
    { id: 1, type: "circle", size: 140, x: "5%", y: "12%", depth: 0.02, color: "bg-gradient-to-br from-brand-orange/30 to-brand-yellow/20", blur: "blur-2xl" },
    { id: 2, type: "ring", size: 100, x: "88%", y: "18%", depth: 0.03, color: "border-brand-yellow/40", blur: "" },
    { id: 3, type: "square", size: 70, x: "94%", y: "60%", depth: 0.025, color: "bg-gradient-to-br from-brand-navy/15 to-brand-navy/5", blur: "blur-xl", rotate: 45 },

    // Layer 2 - Mid distance (moderate movement)  
    { id: 4, type: "circle", size: 250, x: "72%", y: "40%", depth: 0.05, color: "bg-gradient-to-br from-brand-yellow/25 to-brand-orange/15", blur: "blur-3xl" },
    { id: 5, type: "ring", size: 160, x: "2%", y: "50%", depth: 0.04, color: "border-brand-orange/25", blur: "" },
    { id: 6, type: "dots", size: 80, x: "18%", y: "72%", depth: 0.045, color: "bg-brand-navy/20", blur: "" },

    // Layer 3 - Close (more pronounced movement)
    { id: 7, type: "circle", size: 50, x: "12%", y: "25%", depth: 0.08, color: "bg-gradient-to-br from-brand-yellow/40 to-brand-orange/30", blur: "blur-sm" },
    { id: 8, type: "square", size: 35, x: "82%", y: "78%", depth: 0.07, color: "bg-gradient-to-br from-brand-orange/30 to-brand-yellow/20", blur: "", rotate: 20 },
    { id: 9, type: "ring", size: 70, x: "62%", y: "12%", depth: 0.06, color: "border-brand-navy/25", blur: "" },
    { id: 10, type: "circle", size: 30, x: "48%", y: "82%", depth: 0.09, color: "bg-brand-navy/25", blur: "" },
    { id: 11, type: "plus", size: 24, x: "25%", y: "45%", depth: 0.075, color: "text-brand-orange/40", blur: "" },
    { id: 12, type: "plus", size: 18, x: "78%", y: "32%", depth: 0.065, color: "text-brand-navy/30", blur: "" },
];

// Stats for social proof
const stats = [
    { value: "10K+", label: "Active Students", icon: Users },
    { value: "50+", label: "Universities", icon: Shield },
    { value: "100K+", label: "Transactions", icon: Zap },
];

interface FloatingObjectProps {
    obj: typeof floatingObjects[0];
    mouseX: ReturnType<typeof useSpring>;
    mouseY: ReturnType<typeof useSpring>;
}

function FloatingObject({ obj, mouseX, mouseY }: FloatingObjectProps) {
    const x = useTransform(mouseX, (value) => value * obj.depth);
    const y = useTransform(mouseY, (value) => value * obj.depth);

    const baseClasses = `absolute pointer-events-none`;

    const renderShape = () => {
        switch (obj.type) {
            case "circle":
                return (
                    <div
                        className={`${baseClasses} ${obj.color} ${obj.blur} rounded-full`}
                        style={{ width: obj.size, height: obj.size }}
                    />
                );
            case "ring":
                return (
                    <div
                        className={`${baseClasses} ${obj.color} rounded-full border-2`}
                        style={{ width: obj.size, height: obj.size }}
                    />
                );
            case "square":
                return (
                    <div
                        className={`${baseClasses} ${obj.color} ${obj.blur || ""} rounded-xl`}
                        style={{
                            width: obj.size,
                            height: obj.size,
                            transform: obj.rotate ? `rotate(${obj.rotate}deg)` : undefined
                        }}
                    />
                );
            case "dots":
                return (
                    <div className={`${baseClasses} grid grid-cols-3 gap-2`}>
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${obj.color}`} />
                        ))}
                    </div>
                );
            case "plus":
                return (
                    <div className={`${baseClasses} ${obj.color} font-bold`} style={{ fontSize: obj.size }}>
                        +
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            className="absolute"
            style={{
                left: obj.x,
                top: obj.y,
                x,
                y,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            transition={{
                opacity: { duration: 1.2, delay: obj.id * 0.08 },
                scale: { duration: 1, delay: obj.id * 0.08 },
            }}
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, obj.rotate ? 5 : 0, 0],
                }}
                transition={{
                    duration: 4 + obj.id * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {renderShape()}
            </motion.div>
        </motion.div>
    );
}

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Raw mouse position
    const mouseXRaw = useMotionValue(0);
    const mouseYRaw = useMotionValue(0);

    // Smoothed mouse position with spring physics
    const mouseX = useSpring(mouseXRaw, { stiffness: 40, damping: 25 });
    const mouseY = useSpring(mouseYRaw, { stiffness: 40, damping: 25 });

    // Scroll-based parallax for background
    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            mouseXRaw.set(e.clientX - centerX);
            mouseYRaw.set(e.clientY - centerY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseXRaw, mouseYRaw]);

    const scrollToEcosystem = () => {
        const ecosystem = document.getElementById("ecosystem");
        if (ecosystem) {
            ecosystem.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section
            ref={containerRef}
            className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden min-h-screen flex flex-col items-center justify-center"
        >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

            {/* Floating Parallax Objects */}
            <div className="absolute inset-0 overflow-hidden">
                {floatingObjects.map((obj) => (
                    <FloatingObject
                        key={obj.id}
                        obj={obj}
                        mouseX={mouseX}
                        mouseY={mouseY}
                    />
                ))}
            </div>

            {/* Gradient Orbs Background with scroll parallax */}
            <motion.div
                className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-brand-yellow/20 via-brand-orange/10 to-transparent rounded-full blur-3xl"
                style={{
                    x: useTransform(mouseX, (v) => v * 0.015),
                    y: backgroundY,
                }}
            />
            <motion.div
                className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-brand-orange/15 via-brand-yellow/10 to-transparent rounded-full blur-3xl"
                style={{
                    x: useTransform(mouseX, (v) => v * 0.02),
                    y: useTransform(backgroundY, (v) => -v * 0.5),
                }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-brand-navy/5 to-transparent rounded-full blur-3xl"
            />

            <div className="container px-4 mx-auto text-center z-10 relative flex-1 flex flex-col justify-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-orange/10 to-brand-yellow/10 border border-brand-orange/20 text-sm font-semibold text-brand-navy backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-brand-orange" />
                        Trusted by 10,000+ students across 50+ universities
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85]">
                        <motion.span
                            className="block text-brand-navy"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            EVERYTHING
                        </motion.span>
                        <motion.span
                            className="block bg-gradient-to-r from-brand-orange via-brand-orange to-brand-yellow bg-clip-text text-transparent"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            UNIVERSITY.
                        </motion.span>
                    </h1>
                </motion.div>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-8 text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
                >
                    The <span className="text-brand-navy font-semibold">decentralized ecosystem</span> for students.
                    Buy, sell, connect, and thrive in a <span className="text-brand-orange font-semibold">verifiable campus network</span>.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            size="lg"
                            onClick={scrollToEcosystem}
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-navy via-brand-navy to-brand-navy/90 px-10 py-7 text-lg font-bold shadow-xl shadow-brand-navy/25 hover:shadow-2xl hover:shadow-brand-navy/30 transition-all duration-300 group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Explore Portal
                                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-2xl px-10 py-7 text-lg font-bold border-2 border-brand-navy/20 hover:border-brand-navy/40 hover:bg-brand-navy/5 gap-3 backdrop-blur-sm"
                        >
                            <PlayCircle className="w-5 h-5 text-brand-orange" />
                            How it works
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-navy/10 to-brand-navy/5">
                                <stat.icon className="w-5 h-5 text-brand-navy" />
                            </div>
                            <div className="text-left">
                                <p className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight">{stat.value}</p>
                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                {/* <motion.button
                    onClick={scrollToEcosystem}
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 text-muted-foreground hover:text-brand-navy transition-colors cursor-pointer"
                >
                    <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
                    <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-3 bg-current rounded-full"
                        />
                    </div>
                </motion.button> */}
            </motion.div>
        </section>
    );
}
```

## File: D:\unmarky\apps\web\src\features\landing\LandingPage.tsx
```tsx
import { HeroSection } from "./components/HeroSection";
import { EcosystemSection } from "./components/EcosystemSection";
import { CommunitySection } from "./components/CommunitySection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function LandingPage() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar showScrollLinks={true} />
            <HeroSection />
            <EcosystemSection />
            <CommunitySection />
            <Footer />
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\landing\types.ts
```ts
import type { LucideIcon } from "lucide-react";

export interface LandingFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  href: string;
  status: "live" | "coming-soon";
}
```

## File: D:\unmarky\apps\web\src\features\lifestyle\pages\AccommodationPage.tsx
```tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, MapPin, Phone, Wifi, Wind, Dumbbell, Car, Shield, Zap, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccommodationDetail {
    id: string;
    name: string;
    type: "PG" | "Hostel" | "Apartment";
    description: string;
    address: string;
    phone: string;
    amenities: string;
    images: string[];
    minPrice: string;
    maxPrice: string;
    rentRange: string;
    rating: string;
    reviewCount: number;
    location: string;
}

const amenityIcons: Record<string, React.ElementType> = {
    "WiFi": Wifi,
    "AC": Wind,
    "Gym": Dumbbell,
    "Parking": Car,
    "Security": Shield,
    "Power Backup": Zap,
};

const typeColors: Record<string, string> = {
    "PG": "from-blue-500 to-blue-600",
    "Hostel": "from-purple-500 to-purple-600",
    "Apartment": "from-green-500 to-green-600",
};

export function AccommodationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [accommodation, setAccommodation] = useState<AccommodationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!id) return;

        api.get(`/accommodation/${id}`)
            .then(setAccommodation)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (error || !accommodation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Accommodation not found"}</p>
                <Button onClick={() => navigate("/housing")} variant="outline">
                    Back to Housing
                </Button>
            </div>
        );
    }

    const images = Array.isArray(accommodation.images) ? accommodation.images : [];
    const amenities = accommodation.amenities?.split(",").map(a => a.trim()) || [];

    const nextImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/housing")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Housing
            </motion.button>

            {/* Image Gallery */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden mb-8"
            >
                <div className="aspect-[21/10] relative bg-muted">
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[currentImageIndex]}
                                alt={`${accommodation.name} - Image ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/70 text-white text-sm font-medium">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">ðŸ </span>
                        </div>
                    )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${index === currentImageIndex ? "border-purple-500 ring-2 ring-purple-500/20" : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-white text-sm font-bold bg-gradient-to-r ${typeColors[accommodation.type]}`}>
                        {accommodation.type}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{parseFloat(accommodation.rating).toFixed(1)}</span>
                        <span className="text-muted-foreground">({accommodation.reviewCount} reviews)</span>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3">
                    {accommodation.name}
                </h1>

                <p className="flex items-center gap-2 text-muted-foreground text-lg">
                    <MapPin className="w-5 h-5" />
                    {accommodation.address || accommodation.location}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl bg-muted/30 border border-border/50"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">About</h3>
                        <p className="text-foreground leading-relaxed text-lg">
                            {accommodation.description || "No description available."}
                        </p>
                    </motion.div>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 rounded-2xl bg-muted/30 border border-border/50"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenities.map((amenity, index) => {
                                    const Icon = amenityIcons[amenity] || Shield;
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/50"
                                        >
                                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                                                <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className="font-medium text-foreground">{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar - Contact & Pricing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                >
                    {/* Pricing Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Pricing</h3>

                        {accommodation.rentRange ? (
                            <p className="text-3xl font-black text-foreground mb-2">
                                {accommodation.rentRange}
                            </p>
                        ) : (
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Starting from</p>
                                <p className="text-3xl font-black text-purple-600">
                                    â‚¹{accommodation.minPrice ? parseFloat(accommodation.minPrice).toLocaleString() : "N/A"}
                                    <span className="text-base font-normal text-muted-foreground">/month</span>
                                </p>
                            </div>
                        )}

                        <p className="text-sm text-muted-foreground">
                            * Prices may vary based on room type and sharing
                        </p>
                    </div>

                    {/* Contact Card */}
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Contact</h3>

                        {accommodation.phone ? (
                            <a
                                href={`tel:${accommodation.phone}`}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                            >
                                <Phone className="w-5 h-5" />
                                {accommodation.phone}
                            </a>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">
                                Contact info not available
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\lifestyle\pages\FoodPage.tsx
```tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Star, MapPin, Clock, ChevronDown, Search, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Restaurant {
    id: string;
    name: string;
    description: string;
    cuisine: string;
    tags: string;
    address: string;
    phone: string;
    timing: string;
    priceRange: string;
    rating: string;
    reviewCount: number;
    imageUrl: string;
    location: string;
}

interface FoodResponse {
    items: Restaurant[];
    hasMore: boolean;
    total: number;
}

const cuisineFilters = [
    { value: "all", label: "All Cuisines" },
    { value: "North Indian", label: "North Indian" },
    { value: "Italian", label: "Italian" },
    { value: "Chinese", label: "Chinese" },
    { value: "Healthy", label: "Healthy" },
    { value: "Cafe", label: "Cafe" },
];

export function FoodPage() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [activeCuisine, setActiveCuisine] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 20;

    const fetchRestaurants = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offset;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const cuisineParam = activeCuisine !== "all" ? `&cuisine=${activeCuisine}` : "";
            const response: FoodResponse = await api.get(
                `/food?limit=${LIMIT}&offset=${currentOffset}${cuisineParam}`
            );

            if (reset) {
                setRestaurants(response.items);
            } else {
                setRestaurants(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            setOffset(currentOffset + response.items.length);
        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [offset, activeCuisine]);

    useEffect(() => {
        setOffset(0);
        fetchRestaurants(true);
    }, [activeCuisine]);

    const handleCuisineChange = (cuisine: string) => {
        setActiveCuisine(cuisine);
    };

    const handleLoadMore = () => {
        fetchRestaurants(false);
    };

    // Filter by search
    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                >
                    <span className="text-brand-navy">FOOD </span>
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">ZONE</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                >
                    Discover the best restaurants and eateries near your campus.
                </motion.p>
            </div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-8"
            >
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-full border-border/50 text-sm sm:text-base"
                    />
                </div>

                {/* Cuisine Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {cuisineFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleCuisineChange(filter.value)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCuisine === filter.value
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            ) : (
                <>
                    {/* Restaurant Grid */}
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredRestaurants.map((restaurant, index) => (
                                <motion.div
                                    key={restaurant.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <Link to={`/food/${restaurant.id}`} className="group block">
                                        <div className="relative overflow-hidden rounded-2xl bg-background border border-border/50 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                {restaurant.imageUrl ? (
                                                    <img
                                                        src={restaurant.imageUrl}
                                                        alt={restaurant.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        <Utensils className="w-12 h-12 text-muted-foreground/30" />
                                                    </div>
                                                )}

                                                {/* Rating Badge */}
                                                <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-bold text-sm">{parseFloat(restaurant.rating).toFixed(1)}</span>
                                                </div>

                                                {/* Price Range */}
                                                {restaurant.priceRange && (
                                                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
                                                        {restaurant.priceRange}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="font-bold text-lg text-foreground group-hover:text-orange-500 transition-colors line-clamp-1">
                                                        {restaurant.name}
                                                    </h3>
                                                </div>

                                                <p className="text-sm text-orange-600 font-medium mb-2">
                                                    {restaurant.cuisine}
                                                </p>

                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {restaurant.description}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {restaurant.location}
                                                    </span>
                                                    {restaurant.timing && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {restaurant.timing}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredRestaurants.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 sm:py-20"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500/50" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No restaurants found</h3>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto px-4">
                                {searchQuery || activeCuisine !== "all"
                                    ? "Try adjusting your filters or search query."
                                    : "No restaurants have been added yet. Check back soon!"}
                            </p>
                        </motion.div>
                    )}

                    {/* Load More */}
                    {hasMore && filteredRestaurants.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-12"
                        >
                            <Button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                variant="outline"
                                className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all gap-2"
                            >
                                {loadingMore ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        View More Restaurants
                                        <ChevronDown className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Count */}
                    {!loading && total > 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Showing {filteredRestaurants.length} of {total} restaurants
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\lifestyle\pages\HousingPage.tsx
```tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Star, MapPin, ChevronDown, Search, Home, Building2, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Accommodation {
    id: string;
    name: string;
    type: "PG" | "Hostel" | "Apartment";
    description: string;
    address: string;
    phone: string;
    amenities: string;
    images: string;
    minPrice: string;
    maxPrice: string;
    rentRange: string;
    rating: string;
    reviewCount: number;
    location: string;
}

interface AccommodationResponse {
    items: Accommodation[];
    hasMore: boolean;
    total: number;
}

const typeFilters = [
    { value: "all", label: "All Types", icon: Home },
    { value: "PG", label: "PG", icon: Building2 },
    { value: "Hostel", label: "Hostel", icon: Hotel },
    { value: "Apartment", label: "Apartment", icon: Home },
];

const typeColors: Record<string, string> = {
    "PG": "bg-blue-500",
    "Hostel": "bg-purple-500",
    "Apartment": "bg-green-500",
};

export function HousingPage() {
    const navigate = useNavigate();
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [activeType, setActiveType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 20;

    const fetchAccommodations = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offset;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const typeParam = activeType !== "all" ? `&type=${activeType}` : "";
            const response: AccommodationResponse = await api.get(
                `/accommodation?limit=${LIMIT}&offset=${currentOffset}${typeParam}`
            );

            if (reset) {
                setAccommodations(response.items);
            } else {
                setAccommodations(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            setOffset(currentOffset + response.items.length);
        } catch (error) {
            console.error("Failed to fetch accommodations:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [offset, activeType]);

    useEffect(() => {
        setOffset(0);
        fetchAccommodations(true);
    }, [activeType]);

    const handleTypeChange = (type: string) => {
        setActiveType(type);
    };

    const handleLoadMore = () => {
        fetchAccommodations(false);
    };

    // Filter by search
    const filteredAccommodations = accommodations.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFirstImage = (images: string) => {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
        } catch {
            return null;
        }
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                >
                    <span className="text-brand-navy">FIND YOUR </span>
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">HOME</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                >
                    Discover PGs, hostels, and apartments near your campus.
                </motion.p>
            </div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-8"
            >
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search accommodations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-full border-border/50 text-sm sm:text-base"
                    />
                </div>

                {/* Type Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {typeFilters.map((filter) => {
                        const Icon = filter.icon;
                        return (
                            <button
                                key={filter.value}
                                onClick={() => handleTypeChange(filter.value)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeType === filter.value
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <>
                    {/* Accommodation Grid */}
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredAccommodations.map((accommodation, index) => {
                                const firstImage = getFirstImage(accommodation.images);
                                return (
                                    <motion.div
                                        key={accommodation.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        layout
                                    >
                                        <Link to={`/housing/${accommodation.id}`} className="group block">
                                            <div className="relative overflow-hidden rounded-2xl bg-background border border-border/50 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                                                {/* Image */}
                                                <div className="relative aspect-[16/10] overflow-hidden">
                                                    {firstImage ? (
                                                        <img
                                                            src={firstImage}
                                                            alt={accommodation.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                                            <Home className="w-12 h-12 text-muted-foreground/30" />
                                                        </div>
                                                    )}

                                                    {/* Type Badge */}
                                                    <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-white text-xs font-bold ${typeColors[accommodation.type]}`}>
                                                        {accommodation.type}
                                                    </div>

                                                    {/* Rating Badge */}
                                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="font-bold text-sm">{parseFloat(accommodation.rating).toFixed(1)}</span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <h3 className="font-bold text-lg text-foreground group-hover:text-purple-500 transition-colors line-clamp-1 mb-1">
                                                        {accommodation.name}
                                                    </h3>

                                                    <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                                        <MapPin className="w-3 h-3" />
                                                        {accommodation.location}
                                                    </p>

                                                    {/* Price */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Starting from</p>
                                                            <p className="text-xl font-black text-purple-600">
                                                                â‚¹{accommodation.minPrice ? parseFloat(accommodation.minPrice).toLocaleString() : "N/A"}
                                                                <span className="text-sm font-normal text-muted-foreground">/mo</span>
                                                            </p>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {accommodation.reviewCount} reviews
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredAccommodations.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 sm:py-20"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                <Home className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500/50" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No accommodations found</h3>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto px-4">
                                {searchQuery || activeType !== "all"
                                    ? "Try adjusting your filters or search query."
                                    : "No accommodations have been added yet. Check back soon!"}
                            </p>
                        </motion.div>
                    )}

                    {/* Load More */}
                    {hasMore && filteredAccommodations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-12"
                        >
                            <Button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                variant="outline"
                                className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all gap-2"
                            >
                                {loadingMore ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        View More
                                        <ChevronDown className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Count */}
                    {!loading && total > 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Showing {filteredAccommodations.length} of {total} accommodations
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\lifestyle\pages\MenuItemPage.tsx
```tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, Loader2, Leaf, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItemDetail {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    isVeg: boolean;
    isAvailable: boolean;
    rating: string;
    reviewCount: number;
    restaurant: {
        id: string;
        name: string;
        location: string;
    };
}

export function MenuItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<MenuItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;

        api.get(`/food/menu-item/${id}`)
            .then(setItem)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Menu item not found"}</p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    const price = parseFloat(item.price);
    const totalPrice = price * quantity;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Menu
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                ðŸ½ï¸
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col"
                >
                    {/* Veg/Non-Veg & Category */}
                    <div className="flex items-center gap-3 mb-4">
                        {item.isVeg ? (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 text-sm font-medium">
                                <Leaf className="w-4 h-4" />
                                Vegetarian
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 text-sm font-medium">
                                ðŸ— Non-Vegetarian
                            </span>
                        )}
                        {item.category && (
                            <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                                {item.category}
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                        {item.name}
                    </h1>

                    {/* Restaurant Link */}
                    <Link
                        to={`/food/${item.restaurant.id}`}
                        className="text-orange-500 hover:text-orange-600 font-medium mb-4"
                    >
                        from {item.restaurant.name}, {item.restaurant.location}
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-lg">{parseFloat(item.rating).toFixed(1)}</span>
                        </div>
                        <span className="text-muted-foreground">
                            {item.reviewCount} reviews
                        </span>
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                                Description
                            </h3>
                            <p className="text-foreground leading-relaxed text-lg">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Price & Quantity */}
                    <div className="mt-auto">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Price per item</p>
                                    <p className="text-2xl font-black text-foreground">â‚¹{price.toFixed(0)}</p>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <span className="text-muted-foreground">Total</span>
                                <span className="text-3xl font-black text-orange-500">â‚¹{totalPrice.toFixed(0)}</span>
                            </div>
                        </div>

                        {/* Availability */}
                        {!item.isAvailable && (
                            <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-center font-medium">
                                Currently unavailable
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\lifestyle\pages\RestaurantPage.tsx
```tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, MapPin, Clock, Phone, Loader2, Leaf, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    isVeg: boolean;
    rating: string;
    reviewCount: number;
}

interface RestaurantDetail {
    id: string;
    name: string;
    description: string;
    cuisine: string;
    tags: string;
    address: string;
    phone: string;
    timing: string;
    priceRange: string;
    rating: string;
    reviewCount: number;
    imageUrl: string;
    location: string;
    menu: MenuItem[];
}

export function RestaurantPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    useEffect(() => {
        if (!id) return;

        api.get(`/food/${id}`)
            .then(setRestaurant)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Restaurant not found"}</p>
                <Button onClick={() => navigate("/food")} variant="outline">
                    Back to Food Zone
                </Button>
            </div>
        );
    }

    // Get unique categories
    const categories = ["all", ...new Set(restaurant.menu.map(item => item.category).filter(Boolean))];

    // Filter menu by category
    const filteredMenu = activeCategory === "all"
        ? restaurant.menu
        : restaurant.menu.filter(item => item.category === activeCategory);

    // Group by category for display
    const menuByCategory = filteredMenu.reduce((acc, item) => {
        const cat = item.category || "Other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const tags = restaurant.tags?.split(",").map(t => t.trim()) || [];

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/food")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Food Zone
            </motion.button>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden mb-8"
            >
                <div className="aspect-[21/9] relative">
                    {restaurant.imageUrl ? (
                        <img
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Content on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-bold">
                                {restaurant.cuisine}
                            </span>
                            {restaurant.priceRange && (
                                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
                                    {restaurant.priceRange}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">
                            {restaurant.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <span className="flex items-center gap-1.5">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">{parseFloat(restaurant.rating).toFixed(1)}</span>
                                <span className="text-white/60">({restaurant.reviewCount} reviews)</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {restaurant.timing}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {restaurant.location}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
                {/* About */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">About</h3>
                    <p className="text-foreground leading-relaxed">{restaurant.description}</p>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {tags.map((tag, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Contact</h3>
                    {restaurant.address && (
                        <p className="flex items-start gap-2 text-foreground mb-2">
                            <MapPin className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                            {restaurant.address}
                        </p>
                    )}
                    {restaurant.phone && (
                        <a
                            href={`tel:${restaurant.phone}`}
                            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium mt-3"
                        >
                            <Phone className="w-4 h-4" />
                            {restaurant.phone}
                        </a>
                    )}
                </div>
            </motion.div>

            {/* Menu Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-foreground">MENU</h2>
                    <span className="text-sm text-muted-foreground">{restaurant.menu.length} items</span>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                                    ? "bg-orange-500 text-white"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            {cat === "all" ? "All Items" : cat}
                        </button>
                    ))}
                </div>

                {/* Menu Items by Category */}
                {Object.entries(menuByCategory).map(([category, items]) => (
                    <div key={category} className="mb-8">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-orange-500 rounded-full" />
                            {category}
                        </h3>
                        <div className="grid gap-4">
                            {items.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/food/menu/${item.id}`}
                                    className="group flex gap-4 p-4 rounded-2xl bg-background border border-border/50 hover:border-orange-500/50 hover:shadow-lg transition-all"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-muted">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                                ðŸ½ï¸
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {item.isVeg ? (
                                                        <span className="w-4 h-4 border-2 border-green-500 flex items-center justify-center rounded-sm">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                                                        </span>
                                                    ) : (
                                                        <span className="w-4 h-4 border-2 border-red-500 flex items-center justify-center rounded-sm">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                                                        </span>
                                                    )}
                                                    <h4 className="font-bold text-foreground group-hover:text-orange-500 transition-colors">
                                                        {item.name}
                                                    </h4>
                                                </div>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        {parseFloat(item.rating).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-lg text-foreground">â‚¹{parseFloat(item.price).toFixed(0)}</p>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 ml-auto mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {restaurant.menu.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No menu items available yet.
                    </div>
                )}
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\lostfound\LostFoundItemPage.tsx
```tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Phone, User, MapPin, Calendar, Clock, Search, Eye, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReporterInfo {
    id: string;
    fullName: string;
    mobileNumber: string;
    department: string;
}

interface LostFoundItemDetail {
    id: string;
    itemName: string;
    description: string;
    type: "lost" | "found";
    location: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    reporter: ReporterInfo;
}

export function LostFoundItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<LostFoundItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        api.get(`/lostfound/${id}`)
            .then(setItem)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Item not found"}</p>
                <Button onClick={() => navigate("/lost-found")} variant="outline">
                    Back to Lost & Found
                </Button>
            </div>
        );
    }

    const reportedDate = new Date(item.createdAt);
    const formattedDate = reportedDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = reportedDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const isLost = item.type === "lost";

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/lost-found")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Lost & Found
            </motion.button>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background rounded-3xl border border-border/50 shadow-xl overflow-hidden"
            >
                {/* Header with Badge */}
                <div className={`px-8 py-6 ${isLost ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-emerald-500"}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                            {isLost ? (
                                <Search className="w-6 h-6 text-white" />
                            ) : (
                                <Eye className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div>
                            <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                                {isLost ? "Someone Lost This" : "Someone Found This"}
                            </p>
                            <h1 className="text-2xl md:text-3xl font-black text-white">
                                {item.itemName}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Image */}
                    {item.imageUrl && (
                        <div className="mb-8">
                            <img
                                src={item.imageUrl}
                                alt={item.itemName}
                                className="w-full max-h-80 object-cover rounded-2xl"
                            />
                        </div>
                    )}

                    {/* Time & Location Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    Date Reported
                                </p>
                            </div>
                            <p className="text-lg font-bold text-foreground">{formattedDate}</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20">
                                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    Time Reported
                                </p>
                            </div>
                            <p className="text-lg font-bold text-foreground">{formattedTime}</p>
                        </div>
                    </div>

                    {/* Location */}
                    {item.location && (
                        <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/20">
                                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    {isLost ? "Last Seen Location" : "Found At"}
                                </p>
                            </div>
                            <p className="text-lg font-bold text-foreground">{item.location}</p>
                        </div>
                    )}

                    {/* Description */}
                    {item.description && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                                Description
                            </h3>
                            <p className="text-foreground leading-relaxed text-lg">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Reporter Info */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            {isLost ? "Contact if Found" : "Contact to Claim"}
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isLost
                                    ? "bg-gradient-to-br from-red-500 to-red-600"
                                    : "bg-gradient-to-br from-green-500 to-emerald-500"
                                }`}>
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-foreground">
                                    {item.reporter?.fullName || "Anonymous"}
                                </p>
                                {item.reporter?.department && (
                                    <p className="text-sm text-muted-foreground">
                                        {item.reporter.department}
                                    </p>
                                )}
                            </div>
                        </div>

                        {item.reporter?.mobileNumber ? (
                            <a
                                href={`tel:${item.reporter.mobileNumber}`}
                                className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all ${isLost
                                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/25"
                                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/25"
                                    }`}
                            >
                                <Phone className="w-5 h-5" />
                                {item.reporter.mobileNumber}
                            </a>
                        ) : (
                            <div className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-muted text-muted-foreground">
                                <MessageCircle className="w-5 h-5" />
                                Contact info not available
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\lostfound\ReportItemPage.tsx
```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, ImagePlus, X, Search, Eye, Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

export function ReportItemPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        itemName: "",
        description: "",
        type: "lost" as "lost" | "found",
        location: "",
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { alert("Max file size is 5MB"); return; }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl: string | undefined;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, "lostfound-images");
            }
            await api.post("/lostfound", { ...formData, imageUrl });
            navigate("/lost-found");
        } catch (error) {
            console.error("Failed to report item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500/5 via-background to-emerald-500/5">
            <div className="container max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/lost-found")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Lost & Found
                    </button>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        <span className="text-brand-navy">REPORT </span>
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">ITEM</span>
                    </h1>
                    <p className="mt-3 text-muted-foreground text-lg">
                        Help your campus community by reporting lost or found items.
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="relative bg-background rounded-3xl border border-border/50 shadow-xl p-6 md:p-10"
                >
                    <div className="space-y-8">
                        {/* Type Toggle */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                What are you reporting?
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: "lost" }))}
                                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${formData.type === "lost"
                                        ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                                        : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-4 rounded-2xl ${formData.type === "lost" ? "bg-red-500" : "bg-muted"}`}>
                                            <Search className={`w-8 h-8 ${formData.type === "lost" ? "text-white" : "text-muted-foreground"}`} />
                                        </div>
                                        <span className={`text-lg font-bold ${formData.type === "lost" ? "text-red-500" : "text-muted-foreground"}`}>
                                            I LOST something
                                        </span>
                                    </div>
                                    {formData.type === "lost" && (
                                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-500" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: "found" }))}
                                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${formData.type === "found"
                                        ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                                        : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-4 rounded-2xl ${formData.type === "found" ? "bg-green-500" : "bg-muted"}`}>
                                            <Eye className={`w-8 h-8 ${formData.type === "found" ? "text-white" : "text-muted-foreground"}`} />
                                        </div>
                                        <span className={`text-lg font-bold ${formData.type === "found" ? "text-green-500" : "text-muted-foreground"}`}>
                                            I FOUND something
                                        </span>
                                    </div>
                                    {formData.type === "found" && (
                                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Item Photo */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Item Photo (Optional)
                            </Label>
                            <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all duration-300 overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setImagePreview(null);
                                                setImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4 text-red-500" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <ImagePlus className="w-8 h-8 text-teal-500" />
                                        <p className="text-sm">Upload a photo of the item</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Item Name */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Item Name
                            </Label>
                            <Input
                                placeholder="e.g. Blue Wallet, Student ID Card, Airpods Pro"
                                value={formData.itemName}
                                onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                                className="h-14 rounded-xl border-border/50 text-lg"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                {formData.type === "lost" ? "Where did you lose it?" : "Where did you find it?"}
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="e.g. Library, Cafeteria, Room 204"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="h-14 pl-12 rounded-xl border-border/50 text-lg"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Description
                            </Label>
                            <textarea
                                placeholder="Provide any distinguishing features or additional details..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-4 rounded-xl border border-border/50 bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 pt-6 border-t border-border/50 flex justify-end">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-6 rounded-full font-bold text-lg shadow-lg transition-all gap-2 ${formData.type === "lost"
                                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/25"
                                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/25"
                                    }`}
                            >
                                {loading ? "Submitting..." : `REPORT AS ${formData.type.toUpperCase()}`}
                                <Rocket className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\marketplace\ListItemPage.tsx
```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Upload, Tag, DollarSign, Calendar, FileText, Rocket, ArrowLeft, ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

const categories = [
    { value: "textbooks", label: "Textbooks" },
    { value: "electronics", label: "Electronics" },
    { value: "dorm-decor", label: "Dorm Decor" },
    { value: "fashion", label: "Fashion" },
    { value: "services", label: "Services" },
    { value: "fitness", label: "Fitness" },
    { value: "other", label: "Other" },
];

const conditions = [
    { value: "new", label: "Brand New" },
    { value: "like-new", label: "Like New" },
    { value: "great", label: "Great Condition" },
    { value: "good", label: "Good Condition" },
    { value: "fair", label: "Fair Condition" },
];

export function ListItemPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        condition: "",
        manufacturedYear: "",
        price: "",
        isNegotiable: false,
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { alert("Max file size is 5MB"); return; }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl: string | undefined;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, "marketplace-images");
            }
            await api.post("/marketplace", { ...formData, imageUrl });
            navigate("/marketplace");
        } catch (error) {
            console.error("Failed to list item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-orange/5 via-background to-brand-yellow/5">
            <div className="container max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/marketplace")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Marketplace
                    </button>

                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-orange mb-2">
                        <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                        MERCHANT DASHBOARD
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        <span className="text-brand-navy">LIST YOUR </span>
                        <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">STUFF.</span>
                    </h1>
                    <p className="mt-3 text-muted-foreground text-lg">
                        Ready to declutter? Fill in the details below to list your item on the campus marketplace.
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="relative bg-background rounded-3xl border border-border/50 shadow-xl p-6 md:p-10"
                >
                    {/* Decorative Tag */}
                    <div className="absolute -top-3 -right-3 w-16 h-16 bg-brand-orange/10 rounded-2xl rotate-12 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-brand-orange -rotate-12" />
                    </div>

                    <div className="space-y-8">
                        {/* Product Photos */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Product Photos
                            </Label>
                            <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all duration-300 overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setImagePreview(null);
                                                setImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4 text-red-500" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <div className="p-4 rounded-2xl bg-brand-orange/10">
                                            <ImagePlus className="w-8 h-8 text-brand-orange" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-foreground">Upload high-res images</p>
                                            <p className="text-sm">Drag and drop or click to browse files</p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Product Name */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Product Name
                            </Label>
                            <Input
                                placeholder="e.g. Vintage Denim Jacket"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="h-14 rounded-xl border-border/50 text-lg"
                                required
                            />
                        </div>

                        {/* Category & Year Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                    Category
                                </Label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full h-14 px-4 rounded-xl border border-border/50 bg-background text-foreground text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                    Condition
                                </Label>
                                <select
                                    value={formData.condition}
                                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                                    className="w-full h-14 px-4 rounded-xl border border-border/50 bg-background text-foreground text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                                >
                                    <option value="">Select Condition</option>
                                    {conditions.map(cond => (
                                        <option key={cond.value} value={cond.value}>{cond.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Description
                            </Label>
                            <textarea
                                placeholder="Tell us about the condition, usage, and why you're selling it..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full px-4 py-4 rounded-xl border border-border/50 bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                            />
                        </div>

                        {/* Price Section */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Price (â‚¹)
                            </Label>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">â‚¹</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        className="h-14 pl-8 rounded-xl border-border/50 text-lg"
                                        required
                                    />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.isNegotiable}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-brand-orange transition-colors" />
                                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                                    </div>
                                    <span className="text-sm font-medium whitespace-nowrap">Open to negotiations</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            By listing, you agree to{" "}
                            <a href="#" className="text-brand-orange hover:underline">UNMARKY's Marketplace Guidelines</a>.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-6 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white font-bold text-lg shadow-lg shadow-brand-orange/25 hover:shadow-xl transition-all gap-2"
                            >
                                {loading ? "Listing..." : "LIST ITEM"}
                                <Rocket className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\marketplace\MarketplaceItemPage.tsx
```tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Phone, User, BadgeCheck, Tag, Calendar, MapPin, MessageCircle, Share2, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerInfo {
    id: string;
    fullName: string;
    mobileNumber: string;
    department: string;
    isVerified: boolean;
}

interface MarketplaceItemDetail {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
    condition: string;
    manufacturedYear: string;
    isNegotiable: boolean;
    imageUrl: string;
    createdAt: string;
    seller: SellerInfo;
}

const conditionLabels: Record<string, string> = {
    "new": "Brand New",
    "like-new": "Like New",
    "great": "Great Condition",
    "good": "Good Condition",
    "fair": "Fair Condition",
};

export function MarketplaceItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<MarketplaceItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        api.get(`/marketplace/${id}`)
            .then(setItem)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Item not found"}</p>
                <Button onClick={() => navigate("/marketplace")} variant="outline">
                    Back to Marketplace
                </Button>
            </div>
        );
    }

    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/marketplace")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Tag className="w-20 h-20 text-muted-foreground/30" />
                            </div>
                        )}
                    </div>

                    {/* Badge */}
                    <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold ${item.isNegotiable
                            ? "bg-brand-orange text-white"
                            : "bg-brand-navy text-white"
                        }`}>
                        {item.isNegotiable ? "NEGOTIABLE" : "FIXED PRICE"}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
                            <Heart className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
                            <Share2 className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col"
                >
                    {/* Category & Condition */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-muted text-xs font-bold uppercase tracking-wide">
                            {item.category?.replace("-", " ") || "General"}
                        </span>
                        {item.condition && (
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                                {conditionLabels[item.condition] || item.condition}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                        {item.title}
                    </h1>

                    {/* Posted Date */}
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-6">
                        <Calendar className="w-4 h-4" />
                        Listed on {formattedDate}
                    </p>

                    {/* Price */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-yellow/5 border border-brand-orange/20 mb-6">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Expected Price</p>
                        <p className="text-4xl font-black text-brand-navy">
                            â‚¹{parseFloat(item.price).toLocaleString()}
                        </p>
                        {item.isNegotiable && (
                            <p className="text-sm text-brand-orange mt-1 font-medium">
                                Open to negotiations
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                                Description
                            </h3>
                            <p className="text-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Seller Info Card */}
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            Contact Seller
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-navy to-brand-navy/80 flex items-center justify-center">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-lg text-foreground">
                                        {item.seller?.fullName || "Anonymous Seller"}
                                    </p>
                                    {item.seller?.isVerified && (
                                        <BadgeCheck className="w-5 h-5 text-blue-500" />
                                    )}
                                </div>
                                {item.seller?.department && (
                                    <p className="text-sm text-muted-foreground">
                                        {item.seller.department}
                                    </p>
                                )}
                            </div>
                        </div>

                        {item.seller?.mobileNumber ? (
                            <a
                                href={`tel:${item.seller.mobileNumber}`}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-navy/25 transition-all"
                            >
                                <Phone className="w-5 h-5" />
                                {item.seller.mobileNumber}
                            </a>
                        ) : (
                            <div className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-muted text-muted-foreground">
                                <MessageCircle className="w-5 h-5" />
                                Contact info not available
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\marketplace\MarketplacePage.tsx
```tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Search, Eye, Plus, ChevronDown, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
    condition: string;
    isNegotiable: boolean;
    imageUrl: string;
    createdAt: string;
}

interface MarketplaceResponse {
    items: MarketplaceItem[];
    hasMore: boolean;
    total: number;
}

const categories = [
    { value: "all", label: "All Items" },
    { value: "textbooks", label: "Textbooks" },
    { value: "electronics", label: "Electronics" },
    { value: "dorm-decor", label: "Dorm Decor" },
    { value: "fashion", label: "Fashion" },
    { value: "services", label: "Services" },
    { value: "fitness", label: "Fitness" },
];

const conditionLabels: Record<string, string> = {
    "new": "NEW",
    "like-new": "LIKE NEW",
    "great": "GREAT CONDITION",
    "good": "GOOD CONDITION",
    "fair": "FAIR CONDITION",
    "": "USED",
};

export function MarketplacePage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 20;

    const fetchItems = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offset;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response: MarketplaceResponse = await api.get(
                `/marketplace?limit=${LIMIT}&offset=${currentOffset}&category=${activeCategory}`
            );

            if (reset) {
                setItems(response.items);
            } else {
                setItems(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            setOffset(currentOffset + response.items.length);
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [offset, activeCategory]);

    useEffect(() => {
        setOffset(0);
        fetchItems(true);
    }, [activeCategory]);

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
    };

    const handleLoadMore = () => {
        fetchItems(false);
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                >
                    <span className="text-brand-navy">CAMPUS </span>
                    <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">DEALS</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                >
                    Exclusive marketplace for verified university students. Buy, sell, and swap with your campus peers safely.
                </motion.p>
            </div>

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 mb-6 sm:mb-8"
            >
                {/* Category Pills - horizontal scroll on mobile */}
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                    <div className="flex items-center gap-2 min-w-max sm:flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeCategory === cat.value
                                    ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/20"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search textbooks, tech..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 sm:pl-10 h-10 sm:h-11 rounded-full border-border/50 bg-muted/30 text-sm"
                    />
                </div>
            </motion.div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
            ) : (
                <>
                    {/* Items Grid */}
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <Link to={`/marketplace/${item.id}`} className="group block">
                                        <div className="relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50 hover:border-border hover:shadow-xl transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Tag className="w-12 h-12 text-muted-foreground/30" />
                                                    </div>
                                                )}

                                                {/* Badge */}
                                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${item.isNegotiable
                                                    ? "bg-brand-orange text-white"
                                                    : "bg-brand-navy text-white"
                                                    }`}>
                                                    {item.isNegotiable ? "NEGOTIABLE" : "FIXED PRICE"}
                                                </div>

                                                {/* Quick View */}
                                                <motion.button
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ opacity: 1 }}
                                                    className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Eye className="w-4 h-4 text-brand-navy" />
                                                </motion.button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <h3 className="font-bold text-foreground truncate group-hover:text-brand-navy transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                                                    {item.category?.replace("-", " ")} â€¢ {conditionLabels[item.condition] || item.condition || "USED"}
                                                </p>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Expected Price</p>
                                                        <p className="text-xl font-black text-brand-navy">â‚¹{parseFloat(item.price).toLocaleString()}</p>
                                                    </div>
                                                    <button className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                                <Tag className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No items found</h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery ? "Try a different search term" : "Be the first to list an item!"}
                            </p>
                            <Button onClick={() => navigate("/marketplace/list")} className="rounded-full">
                                List Your First Item
                            </Button>
                        </motion.div>
                    )}

                    {/* Load More Button */}
                    {hasMore && filteredItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-12"
                        >
                            <Button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                variant="outline"
                                className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all gap-2"
                            >
                                {loadingMore ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        View More Items
                                        <ChevronDown className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Results Count */}
                    {!loading && total > 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Showing {filteredItems.length} of {total} items
                        </p>
                    )}
                </>
            )}

            {/* Floating Add Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                onClick={() => navigate("/marketplace/list")}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-white shadow-2xl shadow-brand-orange/30 hover:shadow-brand-orange/50 hover:scale-110 transition-all duration-300 flex items-center justify-center"
            >
                <Plus className="w-8 h-8" strokeWidth={2.5} />
            </motion.button>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\onboarding\components\UniversitySelector.tsx
```tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const universities = [
    // Featured
    { label: "Central University of Haryana", value: "cuh" },
    // IITs
    { label: "IIT Bombay", value: "iitb" },
    { label: "IIT Delhi", value: "iitd" },
    { label: "IIT Madras", value: "iitm" },
    { label: "IIT Kanpur", value: "iitk" },
    { label: "IIT Kharagpur", value: "iitkgp" },
    { label: "IIT Roorkee", value: "iitr" },
    { label: "IIT Hyderabad", value: "iith" },
    // Central Universities
    { label: "University of Delhi", value: "du" },
    { label: "Jawaharlal Nehru University (JNU)", value: "jnu" },
    { label: "Banaras Hindu University (BHU)", value: "bhu" },
    { label: "Aligarh Muslim University (AMU)", value: "amu" },
    { label: "Jamia Millia Islamia", value: "jamia" },
    { label: "Central University of Punjab", value: "cup" },
    { label: "Central University of Rajasthan", value: "cur" },
    { label: "Central University of Kashmir", value: "cuk" },
    // NITs
    { label: "NIT Trichy", value: "nitt" },
    { label: "NIT Warangal", value: "nitw" },
    { label: "NIT Surathkal", value: "nitk" },
    { label: "NIT Kurukshetra", value: "nitkuk" },
    // State Universities
    { label: "Anna University", value: "anna" },
    { label: "Savitribai Phule Pune University", value: "sppu" },
    { label: "University of Mumbai", value: "mu" },
    { label: "University of Calcutta", value: "cu" },
    { label: "Osmania University", value: "ou" },
    { label: "Panjab University", value: "pu" },
    { label: "Maharshi Dayanand University (MDU)", value: "mdu" },
    { label: "Kurukshetra University", value: "kuk" },
    // Private Universities
    { label: "BITS Pilani", value: "bits" },
    { label: "Manipal Academy of Higher Education", value: "manipal" },
    { label: "Amity University", value: "amity" },
    { label: "VIT Vellore", value: "vit" },
    { label: "SRM Institute of Science and Technology", value: "srm" },
    { label: "Lovely Professional University (LPU)", value: "lpu" },
    { label: "Chandigarh University", value: "chandigarh" },
    { label: "Shiv Nadar University", value: "snu" },
    { label: "Ashoka University", value: "ashoka" },
    { label: "Thapar Institute of Engineering", value: "thapar" },
]

interface UniversitySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function UniversitySelector({ value, onChange }: UniversitySelectorProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full h-11 rounded-xl">
                <SelectValue placeholder="Select university..." />
            </SelectTrigger>
            <SelectContent className="max-h-72">
                {universities.map((uni) => (
                    <SelectItem key={uni.value} value={uni.label}>
                        {uni.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
```

## File: D:\unmarky\apps\web\src\features\onboarding\OnboardingPage.tsx
```tsx
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UniversitySelector } from './components/UniversitySelector';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export function OnboardingPage() {
    const { user } = useAuth();
    const [university, setUniversity] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Determine if we need to ask for a password
    // If the user signed up with 'password' (email/pass), they already have one.
    // If they signed up with 'google' (oauth), they might not.
    // user.app_metadata.provider is usually 'email' or 'google' (or 'github' etc)
    const isSocialLogin = user?.app_metadata?.provider !== 'email';

    const navigate = useNavigate();

    const handleSubmit = async () => {
        // Validation
        if (!university) return;
        if (!mobileNumber) return;

        // Only require password if it's a social login user
        if (isSocialLogin && !password) return;

        if (mobileNumber.length !== 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        if (isSocialLogin && password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            // 1. If it's a social login user setting a password, update Supabase Auth
            if (isSocialLogin && password) {
                const { error: authError } = await supabase.auth.updateUser({ password: password });
                if (authError) {
                    throw new Error(`Failed to set password: ${authError.message}`);
                }
            }

            // 2. Update Profile in Backend (University, Mobile)
            const payload = {
                universityName: university,
                mobileNumber,
            };

            // Note: We DO NOT send password to backend anymore. 
            // Supabase Auth handles it.

            await api.patch('/profiles/onboarding', payload);
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to complete onboarding. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to Unimarky! ðŸŽ“</CardTitle>
                        <CardDescription>
                            Let's set up your profile to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select University</Label>
                            <UniversitySelector value={university} onChange={setUniversity} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                placeholder="10-digit mobile number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            />
                        </div>

                        {isSocialLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Set Account Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Since you logged in with Google, set a password to login with email later.
                                </p>
                            </div>
                        )}

                        <Button
                            className="w-full mt-4"
                            onClick={handleSubmit}
                            disabled={!university || !mobileNumber || (isSocialLogin && !password) || loading}
                        >
                            {loading ? "Setting up..." : "Complete Setup"}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\profile\ProfilePage.tsx
```tsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    User,
    Mail,
    Phone,
    Building2,
    GraduationCap,
    BookOpen,
    Shield,
    ShieldCheck,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

interface Profile {
    id: string;
    fullName: string | null;
    universityName: string | null;
    department: string | null;
    class: string | null;
    mobileNumber: string | null;
    idCardUrl: string | null;
    isVerified: boolean;
    onboardingCompleted: boolean;
}

export function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Editable fields
    const [department, setDepartment] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await api.get("/profiles/me");
            setProfile(data);
            setDepartment(data.department || "");
            setStudentClass(data.class || "");
            setMobileNumber(data.mobileNumber || "");
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        try {
            setSaving(true);
            setError(null);
            setSaveSuccess(false);

            console.log("Saving profile with data:", { department, class: studentClass, mobileNumber });

            await api.patch(`/profiles/${profile.id}`, {
                department,
                class: studentClass,
                mobileNumber,
            });

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

            // Refresh profile data
            await fetchProfile();
        } catch (err: any) {
            console.error("Failed to save profile:", err);
            setError(err.message || "Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2"
                >
                    <span className="text-brand-navy">MY </span>
                    <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">PROFILE</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    Manage your account details and preferences
                </motion.p>
            </div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm"
            >
                {/* Profile Header */}
                <div className="relative bg-gradient-to-r from-brand-navy via-brand-navy/95 to-brand-navy p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-brand-yellow/30 to-brand-orange/20 flex items-center justify-center border-4 border-white/20">
                                <User className="h-12 w-12 sm:h-14 sm:w-14 text-white" />
                            </div>
                            {profile?.isVerified && (
                                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-brand-navy">
                                    <ShieldCheck className="h-4 w-4 text-white" />
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                {profile?.fullName || "Student"}
                            </h2>
                            <p className="text-white/70 flex items-center justify-center sm:justify-start gap-2">
                                <Building2 className="h-4 w-4" />
                                {profile?.universityName || "University"}
                            </p>
                            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                                {profile?.isVerified ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Verified Student
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-medium">
                                        <Shield className="h-3.5 w-3.5" />
                                        Pending Verification
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-6 sm:p-8 space-y-8">
                    {/* Read-only Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            <Lock className="h-4 w-4" />
                            Account Information (Read-only)
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name - Read Only */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                    <Input
                                        value={profile?.fullName || ""}
                                        disabled
                                        className="pl-10 bg-muted/30 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* University - Read Only */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">University</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                    <Input
                                        value={profile?.universityName || ""}
                                        disabled
                                        className="pl-10 bg-muted/30 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Email - Read Only */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                    <Input
                                        value={user?.email || ""}
                                        disabled
                                        className="pl-10 bg-muted/30 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Name and university cannot be changed. Contact support if you need to update these.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/50" />

                    {/* Editable Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy uppercase tracking-wider">
                            <GraduationCap className="h-4 w-4" />
                            Editable Information
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Department */}
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="department"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        placeholder="e.g., Computer Science"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Class/Year */}
                            <div className="space-y-2">
                                <Label htmlFor="class">Class / Year</Label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="class"
                                        value={studentClass}
                                        onChange={(e) => setStudentClass(e.target.value)}
                                        placeholder="e.g., 3rd Year"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="mobile"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {saveSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-600 text-sm"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Profile updated successfully!
                        </motion.div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 hover:from-brand-orange hover:to-brand-yellow font-bold transition-all duration-300"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\public\AboutPage.tsx
```tsx
import { motion } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Target, Rocket, Heart, GraduationCap, Shield } from "lucide-react";

const values = [
    {
        icon: GraduationCap,
        title: "Student-First",
        desc: "Every feature is designed by students, for students. We understand campus life because we live it.",
        gradient: "from-brand-orange to-amber-500",
    },
    {
        icon: Shield,
        title: "Trust & Safety",
        desc: "Verified university email authentication ensures every user is a real student. No fakes, no scams.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Rocket,
        title: "All-in-One",
        desc: "Why juggle 10 apps when one does it all? Marketplace, food, housing, study â€” everything in your pocket.",
        gradient: "from-indigo-500 to-violet-500",
    },
    {
        icon: Heart,
        title: "Community Driven",
        desc: "Built with love by the campus community. Every feature request and bug report makes us better.",
        gradient: "from-pink-500 to-rose-500",
    },
];

const teamMembers = [
    { name: "UniMARKY Team", role: "Building for Campus Life", initials: "UM" },
];

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/5 to-transparent" />
                <div className="container px-4 mx-auto relative text-center">
                    <motion.div {...fadeUp}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-semibold mb-6">
                            <Users className="w-4 h-4" /> About Us
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight mb-6">
                            One Platform for{" "}
                            <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                                Everything Campus
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            UniMARKY was born out of frustration with scattered campus services. We wanted one unified place where students can buy, sell, eat, study, find housing, and connect â€” without the hassle.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 border-t border-border/30">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <motion.div {...fadeUp}>
                            <span className="text-xs font-bold tracking-widest text-brand-blue uppercase">Our Mission</span>
                            <h2 className="text-3xl font-black text-brand-navy mt-2 mb-4">
                                Making campus life frictionless
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We believe university should be about learning, growing, and making memories â€” not about struggling to find a PG, hunting for cheap textbooks, or figuring out where to eat.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                UniMARKY brings every essential service into one beautiful, fast platform â€” verified and trusted by the student community.
                            </p>
                        </motion.div>
                        <motion.div {...fadeUp} className="flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-brand-orange/10 to-amber-500/5 rounded-2xl p-6 border border-brand-orange/10 text-center">
                                    <p className="text-3xl font-black text-brand-navy">2K+</p>
                                    <p className="text-xs text-muted-foreground mt-1">Students</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl p-6 border border-blue-500/10 text-center">
                                    <p className="text-3xl font-black text-brand-navy">6</p>
                                    <p className="text-xs text-muted-foreground mt-1">Modules</p>
                                </div>
                                <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/5 rounded-2xl p-6 border border-indigo-500/10 text-center">
                                    <p className="text-3xl font-black text-brand-navy">1</p>
                                    <p className="text-xs text-muted-foreground mt-1">University</p>
                                </div>
                                <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 rounded-2xl p-6 border border-pink-500/10 text-center">
                                    <p className="text-3xl font-black text-brand-navy">âˆž</p>
                                    <p className="text-xs text-muted-foreground mt-1">Possibilities</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-muted/20 border-y border-border/30">
                <div className="container px-4 mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-12">
                        <h2 className="text-3xl font-black text-brand-navy">Our Values</h2>
                        <p className="text-muted-foreground mt-2">The principles that drive every pixel we build.</p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-background rounded-2xl border border-border/40 p-5 text-center hover:border-border/80 transition-colors"
                            >
                                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-4`}>
                                    <v.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-brand-navy mb-2">{v.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\public\ContactPage.tsx
```tsx
import { motion } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MapPin, Clock, Send, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        detail: <a href="mailto:jatinyadavsekwal88@gmail.com">jatinyadavsekwal88@gmail.com</a>,
        sub: "We reply within 24 hours",
        gradient: "from-brand-orange to-amber-500",
    },
    {
        icon: MapPin,
        title: "Location",
        detail: "Central University of Haryana",
        sub: "Mahendergarh, Haryana 123031",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Clock,
        title: "Hours",
        detail: "Mon â€“ Sat, 9 AM â€“ 6 PM",
        sub: "IST (Indian Standard Time)",
        gradient: "from-indigo-500 to-violet-500",
    },
];

export function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would POST to an API endpoint
        setSubmitted(true);
    };

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/5 to-transparent" />
                <div className="container px-4 mx-auto relative text-center">
                    <motion.div {...fadeUp}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-sm font-semibold mb-6">
                            <MessageCircle className="w-4 h-4" /> Get In Touch
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-4">
                            We'd Love to{" "}
                            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                Hear From You
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Got a question, feedback, or just want to say hi? We're all ears.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="pb-8">
                <div className="container px-4 mx-auto">
                    <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
                        {contactInfo.map((info, i) => (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-background rounded-2xl border border-border/40 p-5 text-center hover:border-border/80 transition-colors"
                            >
                                <div className={`w-11 h-11 mx-auto rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center mb-3`}>
                                    <info.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-brand-navy mb-1">{info.title}</h3>
                                <p className="text-sm font-medium text-foreground">{info.detail}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{info.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            {/* <section className="py-16">
                <div className="container px-4 mx-auto">
                    <div className="max-w-xl mx-auto bg-background rounded-2xl border border-border/40 p-6 sm:p-8">
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                    <Send className="w-7 h-7 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-navy mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground text-sm">
                                    Thanks for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <Button
                                    variant="ghost"
                                    className="mt-4 text-brand-orange"
                                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                                >
                                    Send another message <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            value={form.name}
                                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@university.edu"
                                            value={form.email}
                                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="What's this about?"
                                        value={form.subject}
                                        onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Tell us everything..."
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        value={form.message}
                                        onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-brand-orange to-amber-500 text-white hover:opacity-90 transition-opacity">
                                    <Send className="w-4 h-4 mr-2" /> Send Message
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section> */}

            <Footer />
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\public\PrivacyPage.tsx
```tsx
import { motion } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck } from "lucide-react";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function PrivacyPage() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-3xl">
                    <motion.div {...fadeUp} className="mb-10 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 text-sm font-semibold mb-4">
                            <ShieldCheck className="w-4 h-4" /> Privacy
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-3">
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground">Last updated: February 12, 2026</p>
                    </motion.div>

                    <motion.div {...fadeUp} className="prose prose-neutral max-w-none text-muted-foreground space-y-8">
                        <Section title="1. Information We Collect">
                            <p>We collect information you provide during registration, including your name, university email address, and university affiliation. We also collect usage data such as pages visited, features used, and device information to improve our services.</p>
                        </Section>

                        <Section title="2. How We Use Your Information">
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>To create and manage your UniMARKY account</li>
                                <li>To verify your student status through university email</li>
                                <li>To facilitate marketplace transactions and communication</li>
                                <li>To display relevant listings (housing, food, study materials)</li>
                                <li>To improve the Platform experience and features</li>
                                <li>To send important notifications about your account and transactions</li>
                            </ul>
                        </Section>

                        <Section title="3. Information Sharing">
                            <p>We do not sell your personal information to third parties. Your information may be shared with:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Other users (your display name, profile info on listings)</li>
                                <li>Service providers who help us operate the Platform</li>
                                <li>Law enforcement if required by law</li>
                            </ul>
                        </Section>

                        <Section title="4. Data Security">
                            <p>We implement industry-standard security measures to protect your data, including encrypted connections (HTTPS), secure authentication via Supabase, and regular security audits. However, no system is 100% secure, and we cannot guarantee absolute security.</p>
                        </Section>

                        <Section title="5. Cookies & Local Storage">
                            <p>We use browser local storage and cookies to maintain your session, remember your preferences, and improve performance. These are essential for the Platform to function properly. We do not use third-party tracking cookies.</p>
                        </Section>

                        <Section title="6. Your Rights">
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Access and download your personal data</li>
                                <li>Correct or update your information</li>
                                <li>Delete your account and associated data</li>
                                <li>Opt out of non-essential notifications</li>
                            </ul>
                            <p className="mt-2">To exercise these rights, contact us at <a href="mailto:jatinyadavsekwal88@gmail.com" className="text-brand-orange hover:underline">jatinyadavsekwal88@gmail.com</a>.</p>
                        </Section>

                        <Section title="7. Data Retention">
                            <p>We retain your data for as long as your account is active. When you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes.</p>
                        </Section>

                        <Section title="8. Children's Privacy">
                            <p>UniMARKY is not intended for use by individuals under the age of 18. We do not knowingly collect information from minors.</p>
                        </Section>

                        <Section title="9. Changes to This Policy">
                            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification. Your continued use of the Platform constitutes acceptance of the updated policy.</p>
                        </Section>

                        <Section title="10. Contact Us">
                            <p>If you have any questions about this Privacy Policy, please reach out to us at <a href="mailto:jatinyadavsekwal88@gmail.com" className="text-brand-orange hover:underline">jatinyadavsekwal88@gmail.com</a>.</p>
                        </Section>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-brand-navy mb-2">{title}</h2>
            <div className="text-sm leading-relaxed">{children}</div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\public\TermsPage.tsx
```tsx
import { motion } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText } from "lucide-react";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function TermsPage() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-3xl">
                    <motion.div {...fadeUp} className="mb-10 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 text-sm font-semibold mb-4">
                            <FileText className="w-4 h-4" /> Legal
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-3">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground">Last updated: February 12, 2026</p>
                    </motion.div>

                    <motion.div {...fadeUp} className="prose prose-neutral max-w-none text-muted-foreground space-y-8">
                        <Section title="1. Acceptance of Terms">
                            <p>By accessing or using UniMARKY ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
                        </Section>

                        <Section title="2. Eligibility">
                            <p>UniMARKY is available to currently enrolled students of participating universities. You must use a valid university email address to register. You must be at least 18 years of age to use the Platform.</p>
                        </Section>

                        <Section title="3. User Accounts">
                            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration. UniMARKY reserves the right to suspend or terminate accounts that violate these terms.</p>
                        </Section>

                        <Section title="4. Marketplace Guidelines">
                            <p>Users may list items for sale or trade through the Marketplace. All listings must be for legal items and services. UniMARKY does not facilitate payments directly â€” all transactions are between buyer and seller. We are not liable for the quality, safety, or legality of listed items.</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>No prohibited items (weapons, drugs, counterfeit goods)</li>
                                <li>Accurate descriptions and images are required</li>
                                <li>Harassment of buyers or sellers is prohibited</li>
                                <li>Pricing must be fair and transparent</li>
                            </ul>
                        </Section>

                        <Section title="5. Content Policy">
                            <p>Users are responsible for all content they post, including listings, reviews, comments, and study materials. Content must not be defamatory, obscene, threatening, or infringing on intellectual property rights. UniMARKY reserves the right to remove any content that violates these guidelines.</p>
                        </Section>

                        <Section title="6. Study Materials">
                            <p>Users who upload study materials confirm they have the right to share such materials. UniMARKY is not responsible for the accuracy of uploaded study content. Copyright-infringing materials will be removed upon notice.</p>
                        </Section>

                        <Section title="7. Housing Listings">
                            <p>Housing listings are provided as-is. UniMARKY does not verify property conditions or landlord credentials beyond basic checks. Users should independently verify accommodation details before committing.</p>
                        </Section>

                        <Section title="8. Limitation of Liability">
                            <p>UniMARKY is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to direct, indirect, incidental, or consequential damages. Users engage in all transactions at their own risk.</p>
                        </Section>

                        <Section title="9. Modifications">
                            <p>We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified terms. We will notify users of significant changes via email or in-app notification.</p>
                        </Section>

                        <Section title="10. Contact">
                            <p>For questions about these Terms, please contact us at <a href="mailto:jatinyadavsekwal88@gmail.com" className="text-brand-orange hover:underline">jatinyadavsekwal88@gmail.com</a>.</p>
                        </Section>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-brand-navy mb-2">{title}</h2>
            <div className="text-sm leading-relaxed">{children}</div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\roles\RequestRolePage.tsx
```tsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    Shield,
    ShieldCheck,
    ShieldX,
    Clock,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
    FileText,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

interface RoleRequest {
    id: string;
    status: string;
    reason: string;
    createdAt: string;
}

export function RequestRolePage() {
    const [requests, setRequests] = useState<RoleRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const hasPending = requests.some((r) => r.status === "pending");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await api.get("/role-requests/mine");
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim().length < 10) {
            setError("Please provide at least 10 characters explaining your reason");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await api.post("/role-requests", { reason: reason.trim() });
            setSuccess(true);
            setReason("");
            await fetchRequests();
        } catch (err: any) {
            setError(err.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
                >
                    <span className="text-brand-navy">BECOME A </span>
                    <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                        SUPERUSER
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    Request elevated privileges to manage restaurants and accommodations
                </motion.p>
            </div>

            {/* Benefits Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy rounded-2xl p-6 mb-8 text-white"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-brand-yellow" />
                    <h2 className="text-lg font-bold">Superuser Benefits</h2>
                </div>
                <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        Register and manage your own restaurants
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        Add menu items with pricing and descriptions
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        List accommodations near your campus
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        Dedicated superuser dashboard
                    </li>
                </ul>
            </motion.div>

            {/* Past Requests */}
            {requests.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 space-y-3"
                >
                    <h2 className="text-lg font-bold text-brand-navy">Your Requests</h2>
                    {requests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-background border border-border/50 rounded-xl p-4 flex items-center justify-between"
                        >
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-1">{req.reason}</p>
                                <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${req.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : req.status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {req.status === "pending" && <Clock className="h-3 w-3" />}
                                {req.status === "approved" && <ShieldCheck className="h-3 w-3" />}
                                {req.status === "rejected" && <ShieldX className="h-3 w-3" />}
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </span>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Submit Form */}
            {!hasPending && (
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    onSubmit={handleSubmit}
                    className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
                >
                    <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                        <FileText className="h-5 w-5" /> Submit Request
                    </h2>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Why do you want to become a Superuser? *</Label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="I run a restaurant near campus and would like to list it for students... (at least 10 characters)"
                            className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[120px] resize-y"
                            required
                        />
                        <p className="text-xs text-muted-foreground">{reason.length} / 10 min characters</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-600 text-sm"
                        >
                            <CheckCircle2 className="h-4 w-4" /> Request submitted! An admin will review it soon.
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={submitting || reason.trim().length < 10}
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold hover:opacity-90"
                    >
                        {submitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                        ) : (
                            <><Send className="mr-2 h-4 w-4" /> Submit Request</>
                        )}
                    </Button>
                </motion.form>
            )}

            {hasPending && !success && (
                <div className="text-center py-8 bg-yellow-50 rounded-2xl border border-yellow-200">
                    <Clock className="h-10 w-10 mx-auto text-yellow-500 mb-3" />
                    <p className="font-medium text-yellow-800">Your request is pending review</p>
                    <p className="text-sm text-yellow-600 mt-1">An admin will review your request soon.</p>
                </div>
            )}
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\study\StudyPage.tsx
```tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BookOpen,
    Search,
    FileText,
    StickyNote,
    ClipboardList,
    BookMarked,
    ScrollText,
    Library,
    Loader2,
    Download,
    ExternalLink,
    GraduationCap,
} from "lucide-react";
import { downloadFromDrive, isDriveUrl } from "@/lib/driveUtils";

// --- CUH Departments ---
const CUH_DEPARTMENTS = [
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Printing & Packaging Technology",
    "Mathematics",
    "Physics & Astrophysics",
    "Chemistry",
    "Biochemistry",
    "Biotechnology",
    "Microbiology",
    "Nutrition Biology",
    "Environmental Studies",
    "Geography",
    "Statistics",
    "Economics",
    "Commerce",
    "Management Studies",
    "English & Foreign Languages",
    "Hindi",
    "Sanskrit",
    "History & Archaeology",
    "Political Science",
    "Sociology",
    "Psychology",
    "Law",
    "Journalism & Mass Communication",
    "Library & Information Science",
    "Physical Education & Sports",
    "Teacher Education",
    "Tourism & Hotel Management",
    "Pharmaceutical Sciences",
    "Vocational Studies & Skill Development",
    "Applied Sciences & Humanities",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const CATEGORY_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
    previous_year_papers: { label: "Previous Year Papers", icon: FileText, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    notes: { label: "Notes", icon: StickyNote, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    sessional_exams: { label: "Sessional Exams", icon: ClipboardList, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    assignments: { label: "Assignments", icon: ScrollText, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    syllabus: { label: "Syllabus", icon: BookMarked, color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
    reference_books: { label: "Reference Books", icon: Library, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
};

interface StudyMaterial {
    id: string;
    department: string;
    year: string;
    subjectName: string;
    category: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
    uploadedBy: string | null;
    uploaderName: string | null;
    createdAt: string;
}

export function StudyPage() {
    const [department, setDepartment] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canFetch = department !== "" && year !== "";

    const fetchMaterials = async () => {
        if (!canFetch) return;
        setLoading(true);
        setError(null);
        try {
            let endpoint = `/study?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}`;
            if (categoryFilter && categoryFilter !== "all") {
                endpoint += `&category=${encodeURIComponent(categoryFilter)}`;
            }
            const data = await api.get(endpoint);
            setMaterials(data);
            setHasFetched(true);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to fetch materials";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-2"
                >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Study Resources</h1>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground ml-1"
                >
                    Access notes, previous year papers, sessional exams and more â€” filtered by department & year.
                </motion.p>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-border/50 bg-card p-6 mb-8 shadow-sm"
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Department Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Department</label>
                        <Select value={department} onValueChange={setDepartment}>
                            <SelectTrigger className="w-full h-11 rounded-xl">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {CUH_DEPARTMENTS.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Year Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Year</label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-full h-11 rounded-xl">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {YEARS.map((y) => (
                                    <SelectItem key={y} value={y}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Category</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full h-11 rounded-xl">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                                    <SelectItem key={key} value={key}>
                                        {meta.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Fetch Button */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-transparent select-none">Action</label>
                        <Button
                            onClick={fetchMaterials}
                            disabled={!canFetch || loading}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4 mr-2" />
                            )}
                            Fetch Content
                        </Button>
                    </div>
                </div>

                {/* Active Filters Summary */}
                {department && year && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-border/50 flex flex-wrap items-center gap-2"
                    >
                        <span className="text-xs font-medium text-muted-foreground">Showing:</span>
                        <Badge variant="secondary" className="rounded-full text-xs">
                            {department}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full text-xs">
                            {year}
                        </Badge>
                        {categoryFilter && categoryFilter !== "all" && (
                            <Badge variant="secondary" className="rounded-full text-xs">
                                {CATEGORY_META[categoryFilter]?.label}
                            </Badge>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-300/50 bg-red-50 p-4 mb-6 text-red-700 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        <p className="text-muted-foreground font-medium">Fetching resources...</p>
                    </motion.div>
                ) : hasFetched && materials.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                        <div className="p-4 rounded-2xl bg-muted/50">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-foreground mb-1">No resources found</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                No study materials are available for {department} â€” {year} yet. Check back later or try a different filter.
                            </p>
                        </div>
                    </motion.div>
                ) : hasFetched && materials.length > 0 ? (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground font-medium">
                                {materials.length} resource{materials.length !== 1 ? "s" : ""} found
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {materials.map((material, index) => {
                                const catMeta = CATEGORY_META[material.category];
                                const CatIcon = catMeta?.icon || FileText;
                                return (
                                    <motion.div
                                        key={material.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="group h-full overflow-hidden rounded-2xl border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 p-0">
                                            <div className="p-5 flex flex-col h-full">
                                                {/* Category Badge + Icon */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-full text-xs font-semibold px-2.5 py-0.5 ${catMeta?.color || ""}`}
                                                    >
                                                        <CatIcon className="h-3 w-3 mr-1" />
                                                        {catMeta?.label || material.category}
                                                    </Badge>
                                                </div>

                                                {/* Title + Subject */}
                                                <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                    {material.title}
                                                </h3>
                                                <p className="text-sm font-medium text-indigo-500/80 mb-2">
                                                    {material.subjectName}
                                                </p>

                                                {/* Description */}
                                                {material.description && (
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">
                                                        {material.description}
                                                    </p>
                                                )}

                                                {/* Footer */}
                                                <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        {material.uploaderName || "Anonymous"}
                                                    </span>
                                                    {material.fileUrl && (
                                                        <button
                                                            onClick={() => downloadFromDrive(material.fileUrl!)}
                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                                                        >
                                                            <Download className="h-3 w-3" />
                                                            {isDriveUrl(material.fileUrl!) ? "Download" : "Open"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    /* Initial State â€” before any fetch */
                    <motion.div
                        key="initial"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10">
                            <GraduationCap className="h-12 w-12 text-indigo-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-foreground mb-1">Select your filters</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                Choose your department and year above, then click "Fetch Content" to find study resources.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\superuser\AddAccommodationPage.tsx
```tsx
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    MapPin,
    Phone,
    DollarSign,
    FileText,
    ImagePlus,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Wifi,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImages } from "@/lib/uploadImage";

const ACCOMMODATION_TYPES = ["PG", "Hostel", "Apartment"] as const;

export function AddAccommodationPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [form, setForm] = useState({
        name: "",
        type: "PG" as string,
        description: "",
        address: "",
        phone: "",
        amenities: "",
        minPrice: "",
        maxPrice: "",
        rentRange: "",
        location: "",
        contact: "",
    });

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.location.trim() || !form.type) {
            setError("Name, type, and location are required");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            let images: string[] = [];
            if (imageFiles.length > 0) {
                images = await uploadImages(imageFiles, "accommodation-images");
            }
            await api.post("/accommodation", { ...form, images });
            navigate("/superuser/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create accommodation");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">ADD </span>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">ACCOMMODATION</span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">List a new accommodation near campus</p>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                <div className="space-y-2">
                    <Label htmlFor="name">Accommodation Name *</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g., Sunrise PG" className="pl-10" required />
                    </div>
                </div>

                {/* Type Selector */}
                <div className="space-y-2">
                    <Label>Type *</Label>
                    <div className="flex gap-3">
                        {ACCOMMODATION_TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => updateField("type", t)}
                                className={`px-4 py-2 rounded-xl border font-medium text-sm transition-all ${form.type === t
                                    ? "bg-brand-navy text-white border-brand-navy"
                                    : "bg-background text-muted-foreground border-border hover:border-brand-navy/30"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Describe the accommodation..."
                        className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[100px] resize-y"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="Near University Gate" className="pl-10" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Input id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="123 College Road" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 98765 43210" className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact">Contact Person</Label>
                        <Input id="contact" value={form.contact} onChange={(e) => updateField("contact", e.target.value)} placeholder="Mr. Sharma" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minPrice">Min Price (â‚¹/month)</Label>
                        <Input id="minPrice" value={form.minPrice} onChange={(e) => updateField("minPrice", e.target.value)} placeholder="5000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPrice">Max Price (â‚¹/month)</Label>
                        <Input id="maxPrice" value={form.maxPrice} onChange={(e) => updateField("maxPrice", e.target.value)} placeholder="12000" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rentRange">Rent Range Display</Label>
                        <Input id="rentRange" value={form.rentRange} onChange={(e) => updateField("rentRange", e.target.value)} placeholder="â‚¹5,000 - â‚¹12,000 / month" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <div className="relative">
                            <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="amenities" value={form.amenities} onChange={(e) => updateField("amenities", e.target.value)} placeholder="WiFi, AC, Laundry, Gym, Parking" className="pl-10" />
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>Photos (up to 5)</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {imagePreviews.map((preview, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFiles(prev => prev.filter((_, idx) => idx !== i));
                                        setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-background/90 rounded-full hover:bg-red-50"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        ))}
                        {imagePreviews.length < 5 && (
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                                <ImagePlus className="w-6 h-6 text-blue-500" />
                                <p className="text-[10px] text-muted-foreground mt-1">Add</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        const remaining = 5 - imageFiles.length;
                                        const newFiles = files.slice(0, remaining).filter(f => f.size <= 5 * 1024 * 1024);
                                        setImageFiles(prev => [...prev, ...newFiles]);
                                        setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
                                        e.target.value = "";
                                    }}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:opacity-90"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>) : (<><CheckCircle2 className="mr-2 h-4 w-4" /> Create Accommodation</>)}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\superuser\AddMenuItemPage.tsx
```tsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Plus,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    UtensilsCrossed,
    DollarSign,
    Tag,
    FileText,
    ImagePlus,
    Leaf,
    Trash2,
    Edit,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

interface MenuItem {
    id: string;
    name: string;
    price: string;
    category: string | null;
    description: string | null;
    isVeg: boolean;
    isAvailable: boolean;
}

export function AddMenuItemPage() {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [restaurantName, setRestaurantName] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        isVeg: true,
    });

    useEffect(() => {
        fetchRestaurant();
    }, [restaurantId]);

    const fetchRestaurant = async () => {
        try {
            setLoadingMenu(true);
            const data = await api.get(`/food/${restaurantId}`);
            setRestaurantName(data.name);
            setMenuItems(data.menu || []);
        } catch (err) {
            console.error("Failed to fetch restaurant:", err);
        } finally {
            setLoadingMenu(false);
        }
    };

    const updateField = (field: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price.trim()) {
            setError("Name and price are required");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            let imageUrl: string | undefined;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, "menu-images");
            }
            const newItem = await api.post(`/food/${restaurantId}/menu`, { ...form, imageUrl });
            setMenuItems((prev) => [...prev, newItem]);
            setForm({ name: "", description: "", price: "", category: "", isVeg: true });
            setImageFile(null);
            setImagePreview(null);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to add menu item");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (menuItemId: string) => {
        if (!confirm("Delete this menu item?")) return;
        setDeleting(menuItemId);
        try {
            await api.delete(`/food/menu/${menuItemId}`);
            setMenuItems((prev) => prev.filter((item) => item.id !== menuItemId));
        } catch (err) {
            console.error("Failed to delete:", err);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">MENU FOR </span>
                <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                    {restaurantName || "RESTAURANT"}
                </span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">Add and manage menu items</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-background border border-border/50 rounded-2xl p-6 space-y-5 h-fit"
                >
                    <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                        <Plus className="h-5 w-5" /> Add Menu Item
                    </h2>

                    <div className="space-y-2">
                        <Label htmlFor="name">Item Name *</Label>
                        <div className="relative">
                            <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g., Margherita Pizza" className="pl-10" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Fresh mozzarella, basil..."
                            className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[80px] resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (â‚¹) *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="price" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="299" className="pl-10" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="category" value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Main Course" className="pl-10" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Item Photo</Label>
                        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <ImagePlus className="w-6 h-6 text-brand-orange" />
                                    <p className="text-xs">Upload photo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => updateField("isVeg", !form.isVeg)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${form.isVeg ? "bg-green-50 border-green-300 text-green-700" : "bg-red-50 border-red-300 text-red-700"
                                }`}
                        >
                            <Leaf className="h-4 w-4" />
                            {form.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                        </button>
                    </div>

                    {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
                    {success && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Menu item added!
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={saving}
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold hover:opacity-90"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>) : (<><Plus className="mr-2 h-4 w-4" /> Add Item</>)}
                    </Button>
                </motion.form>

                {/* Existing Menu Items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-lg font-bold text-brand-navy mb-4">
                        Current Menu ({menuItems.length} items)
                    </h2>

                    {loadingMenu ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : menuItems.length === 0 ? (
                        <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                            <UtensilsCrossed className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                            <p className="text-muted-foreground text-sm">No menu items yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {menuItems.map((item) => (
                                <div key={item.id} className="bg-background border border-border/50 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                                            <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm font-bold text-brand-orange">â‚¹{item.price}</span>
                                            {item.category && <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{item.category}</span>}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:bg-red-50"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleting === item.id}
                                    >
                                        {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\superuser\AddRestaurantPage.tsx
```tsx
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    UtensilsCrossed,
    MapPin,
    Phone,
    Clock,
    DollarSign,
    FileText,
    Tag,
    ImagePlus,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

export function AddRestaurantPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        cuisine: "",
        tags: "",
        address: "",
        phone: "",
        timing: "",
        priceRange: "",
        location: "",
    });

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.location.trim()) {
            setError("Name and location are required");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            let imageUrl: string | undefined;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, "restaurant-images");
            }
            await api.post("/food", { ...form, imageUrl });
            navigate("/superuser/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create restaurant");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 gap-2 text-muted-foreground"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">ADD </span>
                <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                    RESTAURANT
                </span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">Register a new restaurant listing</p>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <div className="relative">
                        <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="e.g., Pizza Palace"
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Describe your restaurant..."
                            className="w-full pl-10 p-3 rounded-lg border border-input bg-background text-sm min-h-[100px] resize-y"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cuisine */}
                    <div className="space-y-2">
                        <Label htmlFor="cuisine">Cuisine Type</Label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="cuisine"
                                value={form.cuisine}
                                onChange={(e) => updateField("cuisine", e.target.value)}
                                placeholder="e.g., Italian, Indian"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="tags"
                                value={form.tags}
                                onChange={(e) => updateField("tags", e.target.value)}
                                placeholder="Vegetarian, Fast Food"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                value={form.location}
                                onChange={(e) => updateField("location", e.target.value)}
                                placeholder="Near Main Gate"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="address"
                                value={form.address}
                                onChange={(e) => updateField("address", e.target.value)}
                                placeholder="123 University Road"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                value={form.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                placeholder="+91 98765 43210"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Timing */}
                    <div className="space-y-2">
                        <Label htmlFor="timing">Operating Hours</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="timing"
                                value={form.timing}
                                onChange={(e) => updateField("timing", e.target.value)}
                                placeholder="9 AM - 11 PM"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                        <Label htmlFor="priceRange">Price Range</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="priceRange"
                                value={form.priceRange}
                                onChange={(e) => updateField("priceRange", e.target.value)}
                                placeholder="â‚¹200-500"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Restaurant Photo</Label>
                        <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImagePlus className="w-8 h-8 text-brand-orange" />
                                    <p className="text-sm">Click to upload a photo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold hover:opacity-90 transition-all"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Create Restaurant
                            </>
                        )}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\superuser\AddStudyMaterialPage.tsx
```tsx
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    GraduationCap,
    BookOpen,
    FileText,
    Link2,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { isValidDriveLink, isDriveUrl } from "@/lib/driveUtils";

const CUH_DEPARTMENTS = [
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Printing & Packaging Technology",
    "Mathematics",
    "Physics & Astrophysics",
    "Chemistry",
    "Biochemistry",
    "Biotechnology",
    "Microbiology",
    "Nutrition Biology",
    "Environmental Studies",
    "Geography",
    "Statistics",
    "Economics",
    "Commerce",
    "Management Studies",
    "English & Foreign Languages",
    "Hindi",
    "Sanskrit",
    "History & Archaeology",
    "Political Science",
    "Sociology",
    "Psychology",
    "Law",
    "Journalism & Mass Communication",
    "Library & Information Science",
    "Physical Education & Sports",
    "Teacher Education",
    "Tourism & Hotel Management",
    "Pharmaceutical Sciences",
    "Vocational Studies & Skill Development",
    "Applied Sciences & Humanities",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const CATEGORIES = [
    { value: "previous_year_papers", label: "Previous Year Papers" },
    { value: "notes", label: "Notes" },
    { value: "sessional_exams", label: "Sessional Exams" },
    { value: "assignments", label: "Assignments" },
    { value: "syllabus", label: "Syllabus" },
    { value: "reference_books", label: "Reference Books" },
];

export function AddStudyMaterialPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [category, setCategory] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const driveWarning =
        fileUrl && isDriveUrl(fileUrl) && !isValidDriveLink(fileUrl)
            ? "This doesn't look like a valid Google Drive sharing link. Make sure the file is shared publicly."
            : null;

    const canSubmit =
        department && year && category && subjectName.trim() && title.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        try {
            setSaving(true);
            setError(null);
            await api.post("/study", {
                department,
                year,
                subjectName: subjectName.trim(),
                category,
                title: title.trim(),
                description: description.trim() || null,
                fileUrl: fileUrl.trim() || null,
            });
            setSuccess(true);
            // Reset form
            setDepartment("");
            setYear("");
            setCategory("");
            setSubjectName("");
            setTitle("");
            setDescription("");
            setFileUrl("");
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to add study material";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 gap-2 text-muted-foreground"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
            >
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
                    <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="text-foreground">Add </span>
                    <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                        Study Material
                    </span>
                </h1>
            </motion.div>
            <p className="text-muted-foreground mb-8 ml-1">
                Share notes, papers, and resources with your fellow students.
            </p>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                {/* Department + Year Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Department *</Label>
                        <Select value={department} onValueChange={setDepartment}>
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {CUH_DEPARTMENTS.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Year *</Label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {YEARS.map((y) => (
                                    <SelectItem key={y} value={y}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Category + Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subjectName">Subject Name *</Label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="subjectName"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                placeholder="e.g., Data Structures"
                                className="pl-10 h-11 rounded-xl"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., DSA Mid-Sem 2024 Paper"
                            className="pl-10 h-11 rounded-xl"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the material..."
                        className="w-full p-3 rounded-xl border border-input bg-background text-sm min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>

                {/* Google Drive Link */}
                <div className="space-y-2">
                    <Label htmlFor="fileUrl">
                        Google Drive Link
                    </Label>
                    <p className="text-xs text-muted-foreground -mt-1">
                        Paste a public Google Drive sharing link. Users will download directly from Drive.
                    </p>
                    <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="fileUrl"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                            className="pl-10 h-11 rounded-xl"
                        />
                    </div>
                    {driveWarning && (
                        <div className="flex items-center gap-2 text-xs text-amber-600">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {driveWarning}
                        </div>
                    )}
                    {fileUrl && isValidDriveLink(fileUrl) && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            Valid Google Drive link detected
                        </div>
                    )}
                </div>

                {/* Success Message */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Study material added successfully!
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={!canSubmit || saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Add Material
                            </>
                        )}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\superuser\EditAccommodationPage.tsx
```tsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Building2,
    MapPin,
    Phone,
    ArrowLeft,
    Loader2,
    Save,
    Wifi,
    ImagePlus,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImages } from "@/lib/uploadImage";

const ACCOMMODATION_TYPES = ["PG", "Hostel", "Apartment"] as const;

export function EditAccommodationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const [form, setForm] = useState({
        name: "",
        type: "PG" as string,
        description: "",
        address: "",
        phone: "",
        amenities: "",
        minPrice: "",
        maxPrice: "",
        rentRange: "",
        location: "",
        contact: "",
    });

    useEffect(() => {
        fetchAccommodation();
    }, [id]);

    const fetchAccommodation = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/accommodation/${id}`);
            setForm({
                name: data.name || "",
                type: data.type || "PG",
                description: data.description || "",
                address: data.address || "",
                phone: data.phone || "",
                amenities: data.amenities || "",
                minPrice: data.minPrice || "",
                maxPrice: data.maxPrice || "",
                rentRange: data.rentRange || "",
                location: data.location || "",
                contact: data.contact || "",
            });
            if (data.images && Array.isArray(data.images)) {
                setExistingImages(data.images);
            }
        } catch (err) {
            setError("Failed to load accommodation");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            let newImageUrls: string[] = [];
            if (imageFiles.length > 0) {
                newImageUrls = await uploadImages(imageFiles, "accommodation-images");
            }
            const allImages = [...existingImages, ...newImageUrls];
            await api.patch(`/accommodation/${id}`, { ...form, images: allImages });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to update accommodation");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">EDIT </span>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">ACCOMMODATION</span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">Update accommodation details</p>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="pl-10" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Type</Label>
                    <div className="flex gap-3">
                        {ACCOMMODATION_TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => updateField("type", t)}
                                className={`px-4 py-2 rounded-xl border font-medium text-sm transition-all ${form.type === t ? "bg-brand-navy text-white border-brand-navy" : "bg-background text-muted-foreground border-border"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[100px] resize-y"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact">Contact Person</Label>
                        <Input id="contact" value={form.contact} onChange={(e) => updateField("contact", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minPrice">Min Price</Label>
                        <Input id="minPrice" value={form.minPrice} onChange={(e) => updateField("minPrice", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPrice">Max Price</Label>
                        <Input id="maxPrice" value={form.maxPrice} onChange={(e) => updateField("maxPrice", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rentRange">Rent Range</Label>
                        <Input id="rentRange" value={form.rentRange} onChange={(e) => updateField("rentRange", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <div className="relative">
                            <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="amenities" value={form.amenities} onChange={(e) => updateField("amenities", e.target.value)} className="pl-10" />
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>Photos</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {existingImages.map((url, i) => (
                            <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 p-1 bg-background/90 rounded-full hover:bg-red-50"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        ))}
                        {imagePreviews.map((preview, i) => (
                            <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-blue-300">
                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFiles(prev => prev.filter((_, idx) => idx !== i));
                                        setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-background/90 rounded-full hover:bg-red-50"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        ))}
                        {(existingImages.length + imagePreviews.length) < 5 && (
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                                <ImagePlus className="w-6 h-6 text-blue-500" />
                                <p className="text-[10px] text-muted-foreground mt-1">Add</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        const remaining = 5 - existingImages.length - imageFiles.length;
                                        const newFiles = files.slice(0, remaining).filter(f => f.size <= 5 * 1024 * 1024);
                                        setImageFiles(prev => [...prev, ...newFiles]);
                                        setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
                                        e.target.value = "";
                                    }}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                        Accommodation updated successfully!
                    </motion.div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 hover:from-blue-500 hover:to-indigo-500 font-bold transition-all duration-300"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : (<><Save className="mr-2 h-4 w-4" /> Save Changes</>)}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\superuser\EditRestaurantPage.tsx
```tsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import {
    UtensilsCrossed,
    MapPin,
    Phone,
    Clock,
    DollarSign,
    FileText,
    Tag,
    ImagePlus,
    ArrowLeft,
    Loader2,
    Save,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

export function EditRestaurantPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        cuisine: "",
        tags: "",
        address: "",
        phone: "",
        timing: "",
        priceRange: "",
        location: "",
    });

    useEffect(() => {
        fetchRestaurant();
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/food/${id}`);
            setForm({
                name: data.name || "",
                description: data.description || "",
                cuisine: data.cuisine || "",
                tags: data.tags || "",
                address: data.address || "",
                phone: data.phone || "",
                timing: data.timing || "",
                priceRange: data.priceRange || "",
                location: data.location || "",
            });
            if (data.imageUrl) setImagePreview(data.imageUrl);
        } catch (err) {
            setError("Failed to load restaurant");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.location.trim()) {
            setError("Name and location are required");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            let imageUrl: string | undefined;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, "restaurant-images");
            }
            await api.patch(`/food/${id}`, { ...form, ...(imageUrl ? { imageUrl } : {}) });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to update restaurant");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">EDIT </span>
                <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">RESTAURANT</span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">Update your restaurant details</p>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <div className="relative">
                        <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="pl-10" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[100px] resize-y"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cuisine">Cuisine</Label>
                        <Input id="cuisine" value={form.cuisine} onChange={(e) => updateField("cuisine", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timing">Hours</Label>
                        <Input id="timing" value={form.timing} onChange={(e) => updateField("timing", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priceRange">Price Range</Label>
                        <Input id="priceRange" value={form.priceRange} onChange={(e) => updateField("priceRange", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Restaurant Photo</Label>
                        <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImagePlus className="w-8 h-8 text-brand-orange" />
                                    <p className="text-sm">Click to upload a photo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                        Restaurant updated successfully!
                    </motion.div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 hover:from-brand-orange hover:to-brand-yellow font-bold transition-all duration-300"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : (<><Save className="mr-2 h-4 w-4" /> Save Changes</>)}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\features\superuser\SuperuserDashboard.tsx
```tsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
    UtensilsCrossed,
    Building2,
    Plus,
    Edit,
    Trash2,
    Loader2,
    ChefHat,
    Home,
    MapPin,
    Phone,
    Star,
    LayoutDashboard,
    GraduationCap,
    FileText,
    BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface Restaurant {
    id: string;
    name: string;
    cuisine: string | null;
    location: string;
    rating: string;
    imageUrl: string | null;
    phone: string | null;
}

interface Accommodation {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: string;
    rentRange: string | null;
    phone: string | null;
}

interface StudyMaterial {
    id: string;
    department: string;
    year: string;
    subjectName: string;
    category: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
}

export function SuperuserDashboard() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [foodRes, accRes, studyRes] = await Promise.all([
                api.get("/food/my-listings"),
                api.get("/accommodation/my-listings"),
                api.get("/study/mine"),
            ]);
            setRestaurants(foodRes);
            setAccommodations(accRes);
            setStudyMaterials(studyRes);
        } catch (err) {
            console.error("Failed to fetch listings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRestaurant = async (id: string) => {
        if (!confirm("Delete this restaurant and all its menu items?")) return;
        setDeleting(id);
        try {
            await api.delete(`/food/${id}`);
            setRestaurants((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteAccommodation = async (id: string) => {
        if (!confirm("Delete this accommodation listing?")) return;
        setDeleting(id);
        try {
            await api.delete(`/accommodation/${id}`);
            setAccommodations((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteStudyMaterial = async (id: string) => {
        if (!confirm("Delete this study material?")) return;
        setDeleting(id);
        try {
            await api.delete(`/study/${id}`);
            setStudyMaterials((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2"
                >
                    <span className="text-brand-navy">SUPERUSER </span>
                    <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                        DASHBOARD
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    Manage your restaurants, accommodations, and study materials
                </motion.p>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap gap-3 mb-8"
            >
                <Link to="/superuser/add-restaurant">
                    <Button className="gap-2 bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold rounded-xl hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        Add Restaurant
                    </Button>
                </Link>
                <Link to="/superuser/add-accommodation">
                    <Button className="gap-2 bg-gradient-to-r from-brand-navy to-brand-navy/80 text-white font-bold rounded-xl hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        Add Accommodation
                    </Button>
                </Link>
                <Link to="/superuser/add-study-material">
                    <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold rounded-xl hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        Add Study Material
                    </Button>
                </Link>
            </motion.div>

            {/* Restaurants Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <ChefHat className="h-5 w-5 text-brand-orange" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-navy">
                        My Restaurants ({restaurants.length})
                    </h2>
                </div>

                {restaurants.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                        <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-muted-foreground">No restaurants listed yet</p>
                        <Link to="/superuser/add-restaurant">
                            <Button variant="outline" className="mt-4 gap-2">
                                <Plus className="h-4 w-4" /> Add your first restaurant
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {restaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="bg-background border border-border/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="h-36 bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center">
                                    {restaurant.imageUrl ? (
                                        <img src={restaurant.imageUrl} alt={restaurant.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <UtensilsCrossed className="h-12 w-12 text-brand-orange/40" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-brand-navy truncate">{restaurant.name}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" /> {restaurant.location}
                                    </p>
                                    {restaurant.cuisine && (
                                        <p className="text-xs text-muted-foreground mt-1">{restaurant.cuisine}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-2">
                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">{restaurant.rating}</span>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Link to={`/superuser/edit-restaurant/${restaurant.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full gap-1">
                                                <Edit className="h-3 w-3" /> Edit
                                            </Button>
                                        </Link>
                                        <Link to={`/superuser/add-menu/${restaurant.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full gap-1">
                                                <Plus className="h-3 w-3" /> Menu
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:bg-red-50"
                                            onClick={() => handleDeleteRestaurant(restaurant.id)}
                                            disabled={deleting === restaurant.id}
                                        >
                                            {deleting === restaurant.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Accommodations Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-navy">
                        My Accommodations ({accommodations.length})
                    </h2>
                </div>

                {accommodations.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-muted-foreground">No accommodations listed yet</p>
                        <Link to="/superuser/add-accommodation">
                            <Button variant="outline" className="mt-4 gap-2">
                                <Plus className="h-4 w-4" /> Add your first accommodation
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accommodations.map((acc) => (
                            <div
                                key={acc.id}
                                className="bg-background border border-border/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="h-36 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
                                    <Building2 className="h-12 w-12 text-blue-400/40" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-brand-navy truncate">{acc.name}</h3>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                            {acc.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" /> {acc.location}
                                    </p>
                                    {acc.rentRange && (
                                        <p className="text-sm font-semibold text-green-600 mt-1">{acc.rentRange}</p>
                                    )}
                                    <div className="flex gap-2 mt-4">
                                        <Link to={`/superuser/edit-accommodation/${acc.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full gap-1">
                                                <Edit className="h-3 w-3" /> Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:bg-red-50"
                                            onClick={() => handleDeleteAccommodation(acc.id)}
                                            disabled={deleting === acc.id}
                                        >
                                            {deleting === acc.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Study Materials Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-navy">
                        My Study Materials ({studyMaterials.length})
                    </h2>
                </div>

                {studyMaterials.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-muted-foreground">No study materials uploaded yet</p>
                        <Link to="/superuser/add-study-material">
                            <Button variant="outline" className="mt-4 gap-2">
                                <Plus className="h-4 w-4" /> Upload your first material
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studyMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="bg-background border border-border/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="h-24 bg-gradient-to-br from-indigo-100 to-violet-50 flex items-center justify-center">
                                    <FileText className="h-10 w-10 text-indigo-400/40" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-brand-navy truncate">{material.title}</h3>
                                    <p className="text-sm text-indigo-500 font-medium mt-0.5">{material.subjectName}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {material.department} Â· {material.year}
                                    </p>
                                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium mt-2">
                                        {material.category.replace(/_/g, " ")}
                                    </span>
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-red-500 hover:bg-red-50 gap-1"
                                            onClick={() => handleDeleteStudyMaterial(material.id)}
                                            disabled={deleting === material.id}
                                        >
                                            {deleting === material.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3 w-3" />
                                            )}
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
```

## File: D:\unmarky\apps\web\src\hooks\useAuth.ts
```ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return { user, session, loading, signOut };
}
```

## File: D:\unmarky\apps\web\src\lib\api.ts
```ts
import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_URL;

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  // Handle potential double slashes
  const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  console.log(`Fetching: ${url}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => 
    fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) => 
    fetchWithAuth(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};
```

## File: D:\unmarky\apps\web\src\lib\driveUtils.ts
```ts
/**
 * Google Drive URL utility
 * Parses various Google Drive sharing URLs and provides direct download links.
 */

/**
 * Extracts the file ID from a Google Drive URL.
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID&export=download
 * - https://docs.google.com/document/d/FILE_ID/...
 * - https://docs.google.com/spreadsheets/d/FILE_ID/...
 * - https://docs.google.com/presentation/d/FILE_ID/...
 */
export function extractDriveFileId(url: string): string | null | undefined {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    // Must be a Google domain
    if (!hostname.endsWith("google.com")) return null;

    // Pattern 1: /file/d/FILE_ID/ or /document/d/FILE_ID/ etc.
    const dMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch) return dMatch[1];

    // Pattern 2: ?id=FILE_ID query param
    const idParam = parsed.searchParams.get("id");
    if (idParam) return idParam;

    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is a Google Drive/Docs URL
 */
export function isDriveUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "drive.google.com" ||
      parsed.hostname === "docs.google.com"
    );
  } catch {
    return false;
  }
}

/**
 * Gets a direct download URL for a Google Drive file.
 * For publicly shared files, this triggers an immediate download.
 */
export function getDriveDownloadUrl(driveUrl: string): string | null {
  const fileId = extractDriveFileId(driveUrl);
  if (!fileId) return null;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Gets a preview URL for a Google Drive file (opens in Google's viewer).
 */
export function getDrivePreviewUrl(driveUrl: string): string | null {
  const fileId = extractDriveFileId(driveUrl);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Triggers a download of a Google Drive file.
 * Opens the direct download URL in a new tab â€” the browser handles the rest.
 * Falls back to opening the original URL if it's not a valid Drive link.
 */
export function downloadFromDrive(url: string): void {
  const downloadUrl = getDriveDownloadUrl(url);
  if (downloadUrl) {
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  } else {
    // Fallback: open the original URL
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Validates that a string is a valid Google Drive sharing URL
 */
export function isValidDriveLink(url: string): boolean {
  if (!url) return false;
  return isDriveUrl(url) && extractDriveFileId(url) !== null;
}
```

## File: D:\unmarky\apps\web\src\lib\supabase.ts
```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## File: D:\unmarky\apps\web\src\lib\uploadImage.ts
```ts
import { supabase } from "./supabase";

/**
 * Upload a file to Supabase Storage and return its public URL.
 * 
 * @param file     The File object to upload
 * @param bucket   The storage bucket name (e.g. "marketplace-images")
 * @returns        The public URL of the uploaded file
 */
export async function uploadImage(file: File, bucket: string): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Upload multiple files to Supabase Storage and return their public URLs.
 */
export async function uploadImages(files: File[], bucket: string): Promise<string[]> {
    return Promise.all(files.map(file => uploadImage(file, bucket)));
}
```

## File: D:\unmarky\apps\web\src\lib\utils.ts
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## File: D:\unmarky\apps\web\src\App.tsx
```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import './index.css'

// Layout components (keep eager â€” needed immediately)
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ErrorPage } from '@/components/layout/ErrorPage';
import ScrollToTop from '@/components/layout/ScrollToTop';

// Lazy-loaded pages â€” each gets its own chunk
const LandingPage = lazy(() => import('@/features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const AuthPage = lazy(() => import('@/features/auth/AuthPage').then(m => ({ default: m.AuthPage })));
const OnboardingPage = lazy(() => import('@/features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MarketplacePage = lazy(() => import('@/features/marketplace/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const ListItemPage = lazy(() => import('@/features/marketplace/ListItemPage').then(m => ({ default: m.ListItemPage })));
const MarketplaceItemPage = lazy(() => import('@/features/marketplace/MarketplaceItemPage').then(m => ({ default: m.MarketplaceItemPage })));
const UnimediaPage = lazy(() => import('@/features/campus/pages/UnimediaPage').then(m => ({ default: m.UnimediaPage })));
const MyContentPage = lazy(() => import('@/features/campus/pages/MyContentPage').then(m => ({ default: m.MyContentPage })));
const PostDetailPage = lazy(() => import('@/features/campus/pages/PostDetailPage').then(m => ({ default: m.PostDetailPage })));
const LostFoundPage = lazy(() => import('@/features/campus/pages/LostFoundPage').then(m => ({ default: m.LostFoundPage })));
const ReportItemPage = lazy(() => import('@/features/lostfound/ReportItemPage').then(m => ({ default: m.ReportItemPage })));
const LostFoundItemPage = lazy(() => import('@/features/lostfound/LostFoundItemPage').then(m => ({ default: m.LostFoundItemPage })));
const AnnouncementsPage = lazy(() => import('@/features/campus/pages/AnnouncementsPage').then(m => ({ default: m.AnnouncementsPage })));
const FoodPage = lazy(() => import('@/features/lifestyle/pages/FoodPage').then(m => ({ default: m.FoodPage })));
const RestaurantPage = lazy(() => import('@/features/lifestyle/pages/RestaurantPage').then(m => ({ default: m.RestaurantPage })));
const MenuItemPage = lazy(() => import('@/features/lifestyle/pages/MenuItemPage').then(m => ({ default: m.MenuItemPage })));
const HousingPage = lazy(() => import('@/features/lifestyle/pages/HousingPage').then(m => ({ default: m.HousingPage })));
const AccommodationPage = lazy(() => import('@/features/lifestyle/pages/AccommodationPage').then(m => ({ default: m.AccommodationPage })));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const StudyPage = lazy(() => import('@/features/study/StudyPage').then(m => ({ default: m.StudyPage })));
const SuperuserDashboard = lazy(() => import('@/features/superuser/SuperuserDashboard').then(m => ({ default: m.SuperuserDashboard })));
const AddRestaurantPage = lazy(() => import('@/features/superuser/AddRestaurantPage').then(m => ({ default: m.AddRestaurantPage })));
const EditRestaurantPage = lazy(() => import('@/features/superuser/EditRestaurantPage').then(m => ({ default: m.EditRestaurantPage })));
const AddMenuItemPage = lazy(() => import('@/features/superuser/AddMenuItemPage').then(m => ({ default: m.AddMenuItemPage })));
const AddAccommodationPage = lazy(() => import('@/features/superuser/AddAccommodationPage').then(m => ({ default: m.AddAccommodationPage })));
const EditAccommodationPage = lazy(() => import('@/features/superuser/EditAccommodationPage').then(m => ({ default: m.EditAccommodationPage })));
const AddStudyMaterialPage = lazy(() => import('@/features/superuser/AddStudyMaterialPage').then(m => ({ default: m.AddStudyMaterialPage })));
const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const RequestRolePage = lazy(() => import('@/features/roles/RequestRolePage').then(m => ({ default: m.RequestRolePage })));

// Public pages (no auth)
const AboutPage = lazy(() => import('@/features/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/features/public/ContactPage').then(m => ({ default: m.ContactPage })));
const TermsPage = lazy(() => import('@/features/public/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('@/features/public/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

// Shared loading spinner for Suspense boundaries
function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                <p className="text-sm text-muted-foreground animate-pulse">Loadingâ€¦</p>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Public pages â€” no auth required */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                <Route element={<ProtectedRoute requireOnboarding={false} />}>
                    <Route path="/onboarding" element={<OnboardingPage />} />
                </Route>

                {/* Protected Dashboard Routes - Require Onboarding */}
                <Route element={<ProtectedRoute requireOnboarding={true} />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/marketplace" element={<MarketplacePage />} />
                        <Route path="/marketplace/list" element={<ListItemPage />} />
                        <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
                        <Route path="/unimedia" element={<UnimediaPage />} />
                        <Route path="/unimedia/my-content" element={<MyContentPage />} />
                        <Route path="/unimedia/:id" element={<PostDetailPage />} />
                        <Route path="/lost-found" element={<LostFoundPage />} />
                        <Route path="/lost-found/report" element={<ReportItemPage />} />
                        <Route path="/lost-found/:id" element={<LostFoundItemPage />} />
                        <Route path="/announcements" element={<AnnouncementsPage />} />
                        <Route path="/food" element={<FoodPage />} />
                        <Route path="/food/:id" element={<RestaurantPage />} />
                        <Route path="/food/menu/:id" element={<MenuItemPage />} />
                        <Route path="/housing" element={<HousingPage />} />
                        <Route path="/housing/:id" element={<AccommodationPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/study" element={<StudyPage />} />

                        {/* Role Request */}
                        <Route path="/request-role" element={<RequestRolePage />} />

                        {/* Superuser Routes */}
                        <Route path="/superuser/dashboard" element={<SuperuserDashboard />} />
                        <Route path="/superuser/add-restaurant" element={<AddRestaurantPage />} />
                        <Route path="/superuser/edit-restaurant/:id" element={<EditRestaurantPage />} />
                        <Route path="/superuser/add-menu/:restaurantId" element={<AddMenuItemPage />} />
                        <Route path="/superuser/add-accommodation" element={<AddAccommodationPage />} />
                        <Route path="/superuser/edit-accommodation/:id" element={<EditAccommodationPage />} />
                        <Route path="/superuser/add-study-material" element={<AddStudyMaterialPage />} />

                        {/* Admin Routes (userX) */}
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Suspense>
    );
}
```

## File: D:\unmarky\apps\web\src\index.css
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* Brand Colors */
  --color-brand-navy: #2C3D73;
  --color-brand-orange: #F15B42;
  --color-brand-yellow: #FFD372;
  --color-brand-pink: #F49CC4;
  --color-brand-blue: #7CAADC;

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0 }
    to { height: var(--radix-accordion-content-height) }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height) }
    to { height: 0 }
  }
}

/* Base styles for shadcn/ui */
@layer base {
  :root {
    --background: 0 0% 100%;
    /* Navy #2C3D73 */
    --foreground: 226 45% 31%; 

    --card: 0 0% 100%;
    --card-foreground: 226 45% 31%;

    --popover: 0 0% 100%;
    --popover-foreground: 226 45% 31%;

    /* Orange #F15B42 */
    --primary: 9 86% 60%;
    /* White Text on Orange */
    --primary-foreground: 0 0% 100%;

    /* Yellow #FFD372 */
    --secondary: 41 100% 72%;
    /* Navy Text on Yellow */
    --secondary-foreground: 226 45% 31%;

    /* Light Blue #7CAADC as muted base? Or maybe a very light grey for muted bg */
    --muted: 210 40% 96.1%; 
    /* Blue #7CAADC for muted text */
    --muted-foreground: 206 46% 67%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 226 45% 31%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 226 45% 90%; /* Light Navy hint */
    --input: 226 45% 90%;
    --ring: 9 86% 60%; /* Orange Ring */

    --radius: 0.5rem;
  }

  .dark {
    --background: 226 45% 10%; /* Dark Navy */
    --foreground: 210 40% 98%;

    --card: 226 45% 10%;
    --card-foreground: 210 40% 98%;

    --popover: 226 45% 10%;
    --popover-foreground: 210 40% 98%;

    --primary: 9 86% 60%;
    --primary-foreground: 210 40% 98%;

    --secondary: 226 45% 20%;
    --secondary-foreground: 210 40% 98%;

    --muted: 226 45% 20%;
    --muted-foreground: 206 46% 67%;

    --accent: 226 45% 20%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 226 45% 20%;
    --input: 226 45% 20%;
    --ring: 9 86% 60%;
  }

  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    overflow-x: hidden;
  }
  #root {
    overflow-x: hidden;
  }
}
```

## File: D:\unmarky\apps\web\src\main.tsx
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </StrictMode>,
)
```

## File: D:\unmarky\apps\web\src\vite-env.d.ts
```ts
/// <reference types="vite/client" />
```
