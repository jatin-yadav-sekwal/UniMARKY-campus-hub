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
import { api } from "@/lib/api";
import "./admin.css";

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

const FILTERS = ["pending", "approved", "rejected"] as const;

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
        <div className="um-editorial um-admin">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Administration
                    </p>
                    <h1 className="page-title">
                        Role <span>requests.</span>
                    </h1>
                    <p className="page-lead">
                        Review and manage superuser role requests.
                    </p>
                </div>
            </header>

            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="ad-filters"
                role="group"
                aria-label="Filter requests by status"
            >
                <Filter size={14} color="#8f8b83" />
                {FILTERS.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setFilter(status)}
                        aria-pressed={filter === status}
                        data-status={status}
                        className={`ad-filter${filter === status ? " active" : ""}`}
                    >
                        <span className="ad-filter-dot" />
                        {status}
                    </button>
                ))}
            </m.div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ad-loading"
                    >
                        <Loader2 size={20} className="animate-spin" />
                        <span>Loading requests...</span>
                    </m.div>
                ) : requests.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="empty-state"
                    >
                        <span className="empty-icon">
                            <Shield size={24} strokeWidth={1.5} />
                        </span>
                        <h3>No {filter} requests</h3>
                        <p>
                            {filter === "pending"
                                ? "All caught up — nothing waiting for review."
                                : `No ${filter} requests to show.`}
                        </p>
                    </m.div>
                ) : (
                    <m.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ad-list"
                    >
                        {requests.map((item, index) => (
                            <m.article
                                key={item.request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: index * 0.05 }}
                                className="ad-card"
                            >
                                <div className="ad-card-main">
                                    <div className="ad-user">
                                        <span className="ad-avatar">
                                            <User size={20} strokeWidth={1.5} />
                                        </span>
                                        <div>
                                            <p className="ad-user-name">
                                                {item.user?.fullName || "Unknown User"}
                                            </p>
                                            <p className="ad-user-meta">
                                                <span>
                                                    <Building2 size={12} />
                                                    {item.user?.universityName || "Unknown"}
                                                </span>
                                                {item.user?.department && (
                                                    <span>
                                                        <BookOpen size={12} />
                                                        {item.user.department}
                                                    </span>
                                                )}
                                                {item.user?.mobileNumber && (
                                                    <span>
                                                        <Phone size={12} />
                                                        {item.user.mobileNumber}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ad-reason">
                                        <p className="ad-reason-label">Reason for upgrade</p>
                                        <p>{item.request.reason}</p>
                                    </div>

                                    <p className="ad-date">
                                        <Clock size={11} />
                                        {new Date(item.request.createdAt).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </p>
                                </div>

                                {filter === "pending" && (
                                    <div className="ad-actions">
                                        <button
                                            type="button"
                                            className="ad-action approve"
                                            onClick={() =>
                                                handleAction(item.request.id, "approved")
                                            }
                                            disabled={processing === item.request.id}
                                        >
                                            {processing === item.request.id ? (
                                                <Loader2 size={15} className="animate-spin" />
                                            ) : (
                                                <CheckCircle2 size={15} />
                                            )}
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            className="ad-action reject"
                                            onClick={() =>
                                                handleAction(item.request.id, "rejected")
                                            }
                                            disabled={processing === item.request.id}
                                        >
                                            <XCircle size={15} />
                                            Reject
                                        </button>
                                    </div>
                                )}

                                {filter === "approved" && (
                                    <span className="ad-status approved">
                                        <ShieldCheck size={13} /> Approved
                                    </span>
                                )}

                                {filter === "rejected" && (
                                    <span className="ad-status rejected">
                                        <ShieldX size={13} /> Rejected
                                    </span>
                                )}
                            </m.article>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}
