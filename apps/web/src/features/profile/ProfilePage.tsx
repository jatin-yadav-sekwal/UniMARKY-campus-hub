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
