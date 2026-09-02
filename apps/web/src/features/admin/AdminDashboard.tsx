import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "motion/react";
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

    const refreshRequests = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.get(`/role-requests?status=${filter}`);
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests:", err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api.get(`/role-requests?status=${filter}`)
            .then((data) => {
                if (!cancelled) setRequests(data);
            })
            .catch((err) => {
                console.error("Failed to fetch requests:", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [filter]);

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
                <m.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2"
                >
                    <span className="text-brand-navy">ADMIN </span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        DASHBOARD
                    </span>
                </m.h1>
                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    Review and manage superuser role requests
                </m.p>
            </div>

            {/* Filter Pills */}
            <m.div
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
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filter === status
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
            </m.div>

            {/* Requests List */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </m.div>
                ) : requests.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border"
                    >
                        <Shield className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">No {filter} requests</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                            {filter === "pending" ? "All caught up!" : `No ${filter} requests to show.`}
                        </p>
                    </m.div>
                ) : (
                    <m.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        {requests.map((item, index) => (
                            <m.div
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
                            </m.div>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}
