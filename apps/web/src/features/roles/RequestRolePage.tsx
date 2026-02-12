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
