import { useState, useEffect } from "react";
import { m } from "motion/react";
import {
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
import { api } from "@/lib/api";
import "./roles.css";

interface RoleRequest {
    id: string;
    status: string;
    reason: string;
    createdAt: string;
}

const benefits = [
    "Register and manage your own restaurants",
    "Add menu items with pricing and descriptions",
    "List accommodations near your campus",
    "Dedicated superuser dashboard",
];

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className="um-editorial um-roles">
                <div className="rr-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading requests...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="um-editorial um-roles">
            <div className="rr-wrap">
                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>01</span>/ Superuser
                        </p>
                        <h1 className="page-title">
                            Become a <span>superuser.</span>
                        </h1>
                        <p className="page-lead">
                            Request elevated privileges to manage restaurants and accommodations.
                        </p>
                    </div>
                </header>

                <m.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rr-benefits"
                >
                    <h2 className="rr-benefits-title">
                        <Sparkles size={16} /> Superuser benefits
                    </h2>
                    {benefits.map((benefit) => (
                        <div key={benefit} className="rr-benefit">
                            <CheckCircle2 size={15} />
                            <span>{benefit}</span>
                        </div>
                    ))}
                </m.div>

                {requests.length > 0 && (
                    <m.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rr-requests"
                    >
                        <p className="rr-requests-head">Your requests</p>

                        {requests.map((req) => (
                            <div key={req.id} className="rr-request">
                                <div className="rr-request-body">
                                    <p className="rr-reason">{req.reason}</p>
                                    <p className="rr-date">
                                        <Clock size={11} />
                                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                <span className={`rr-status ${req.status}`}>
                                    {req.status === "pending" && <Clock size={11} />}
                                    {req.status === "approved" && <ShieldCheck size={11} />}
                                    {req.status === "rejected" && <ShieldX size={11} />}
                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </m.div>
                )}

                {!hasPending && (
                    <m.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        onSubmit={handleSubmit}
                        className="form-card"
                    >
                        <p className="rr-label">
                            <FileText size={12} /> Submit request
                        </p>

                        <div className="form-stack">
                            <div className="field">
                                <label className="field-label" htmlFor="reason">
                                    Why do you want to become a superuser? *
                                </label>
                                <textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="I run a restaurant near campus and would like to list it for students... (at least 10 characters)"
                                    className="field-input"
                                    style={{ minHeight: 120, resize: "vertical" }}
                                    required
                                />
                                <p className="rr-counter">{reason.length} / 10 min characters</p>
                            </div>

                            {error && (
                                <div className="alert alert-error alert-row" role="alert">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <m.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="alert alert-success alert-row"
                                    role="status"
                                >
                                    <CheckCircle2 size={16} />
                                    <span>
                                        Request submitted! An admin will review it soon.
                                    </span>
                                </m.div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                disabled={submitting || reason.trim().length < 10}
                                className="button button-primary"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Submit request
                                    </>
                                )}
                            </button>
                        </div>
                    </m.form>
                )}

                {hasPending && !success && (
                    <div className="rr-notice">
                        <Clock size={22} />
                        <div>
                            <strong>Your request is pending review</strong>
                            <p>An admin will review your request soon.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
