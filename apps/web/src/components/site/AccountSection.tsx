import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { SiteLink } from "./SiteLink";
import { SiteButton } from "./SiteButton";

interface AccountSectionProps {
  variant?: "sidebar" | "drawer";
  onNavigate?: () => void;
}

function displayName(user: ReturnType<typeof useAuth>["user"]) {
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const raw =
    (metadata.first_name as string | undefined) ||
    (metadata.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Student";
  return raw.trim() || "Student";
}

function initialsFor(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const [first = "S", second = "T"] = parts;
  if (parts.length <= 1) return first.slice(0, 2).toUpperCase();
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

export function AccountSection({ variant = "sidebar", onNavigate }: AccountSectionProps) {
  const { user, session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    onNavigate?.();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="space-y-3" aria-hidden>
        <div className="h-px w-full bg-black/[0.06]" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-black/[0.04]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className={cn("space-y-2", variant === "drawer" && "space-y-2.5")}>
        <div className="mb-4 h-px w-full bg-black/[0.06]" />
        <SiteLink
          to="/auth"
          onNavigate={onNavigate}
          className="block rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-um-ink-2 transition-colors duration-150 hover:bg-black/[0.035] hover:text-um-ink"
        >
          Log in
        </SiteLink>
        <SiteButton to="/auth" size="md" className="w-full" onClick={onNavigate}>
          Sign up
        </SiteButton>
      </div>
    );
  }

  const name = displayName(user);
  const initials = initialsFor(name);

  return (
    <div className={cn("space-y-3", variant === "drawer" && "space-y-4")}>
      <div className="mb-4 h-px w-full bg-black/[0.06]" />
      <SiteLink
        to="/profile"
        onNavigate={onNavigate}
        className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors duration-150 hover:bg-black/[0.035]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-um-ink text-[11px] font-semibold tracking-wide text-white">
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold leading-tight text-um-ink">
            {name}
          </span>
          <span className="block truncate text-[11px] leading-tight text-um-ink-3">
            View profile
          </span>
        </span>
      </SiteLink>

      <div className="space-y-0.5">
        <SiteLink
          to="/dashboard"
          onNavigate={onNavigate}
          className="block rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-um-ink-2 transition-colors duration-150 hover:bg-black/[0.035] hover:text-um-ink"
        >
          Dashboard
        </SiteLink>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="um-focus flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-medium text-um-ink-2 transition-colors duration-150 hover:bg-black/[0.035] hover:text-um-ink disabled:opacity-60"
        >
          <LogOut className="h-3.5 w-3.5" />
          {isSigningOut ? "Signing out…" : "Log out"}
        </button>
      </div>
    </div>
  );
}
