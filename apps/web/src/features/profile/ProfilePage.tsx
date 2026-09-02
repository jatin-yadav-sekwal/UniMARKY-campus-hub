import { useEffect, useReducer } from "react";
import { m } from "motion/react";
import {
    User,
    Mail,
    Phone,
    Building2,
    GraduationCap,
    BookOpen,
    Save,
    Loader2,
    AlertCircle,
    Lock,
    Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

interface ProfileState {
    profile: Profile | null;
    loading: boolean;
    saving: boolean;
    saveSuccess: boolean;
    error: string | null;
    department: string;
    studentClass: string;
    mobileNumber: string;
    uploadingAvatar: boolean;
    avatarUrl: string | null;
}

type ProfileAction =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; profile: Profile }
    | { type: "FETCH_ERROR"; error: string }
    | { type: "SAVE_START" }
    | { type: "SAVE_SUCCESS" }
    | { type: "SAVE_ERROR"; error: string }
    | { type: "DISMISS_SAVE_SUCCESS" }
    | { type: "SET_FIELD"; field: "department" | "studentClass" | "mobileNumber"; value: string }
    | { type: "SET_AVATAR_URL"; url: string | null }
    | { type: "SET_UPLOADING_AVATAR"; uploading: boolean };

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
    switch (action.type) {
        case "FETCH_START":
            return { ...state, loading: true, error: null };
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                profile: action.profile,
                department: action.profile.department || "",
                studentClass: action.profile.class || "",
                mobileNumber: action.profile.mobileNumber || "",
            };
        case "FETCH_ERROR":
            return { ...state, loading: false, error: action.error };
        case "SAVE_START":
            return { ...state, saving: true, error: null, saveSuccess: false };
        case "SAVE_SUCCESS":
            return { ...state, saving: false, saveSuccess: true };
        case "SAVE_ERROR":
            return { ...state, saving: false, error: action.error };
        case "DISMISS_SAVE_SUCCESS":
            return { ...state, saveSuccess: false };
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "SET_AVATAR_URL":
            return { ...state, avatarUrl: action.url };
        case "SET_UPLOADING_AVATAR":
            return { ...state, uploadingAvatar: action.uploading };
        default:
            return state;
    }
}

interface ProfileHeaderProps {
    avatarUrl: string | null;
    userFullName: string;
    universityName?: string | null;
    uploadingAvatar: boolean;
    onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ProfileHeaderCard({
    avatarUrl,
    userFullName,
    universityName,
    uploadingAvatar,
    onAvatarUpload,
}: ProfileHeaderProps) {
    return (
        <div className="relative bg-gradient-to-r from-brand-navy via-brand-navy/95 to-brand-navy p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative group">
                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-white/20 shadow-xl overflow-hidden">
                        {avatarUrl && (
                            <AvatarImage src={avatarUrl} alt={userFullName} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-brand-orange to-brand-yellow text-white text-3xl font-black">
                            {userFullName[0]}
                        </AvatarFallback>
                    </Avatar>

                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                        {uploadingAvatar ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                            <Camera className="w-6 h-6 text-white" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            aria-label="Upload profile picture"
                            onChange={onAvatarUpload}
                            className="hidden"
                            disabled={uploadingAvatar}
                        />
                    </label>
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        {userFullName}
                    </h2>
                    <p className="text-white/70 flex items-center justify-center sm:justify-start gap-2">
                        <Building2 className="h-4 w-4" />
                        {universityName || "University"}
                    </p>
                </div>
            </div>
        </div>
    );
}

interface ReadOnlySectionProps {
    fullName?: string | null;
    universityName?: string | null;
    email?: string | null;
}

function ReadOnlyAccountSection({ fullName, universityName, email }: ReadOnlySectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <Lock className="h-4 w-4" />
                Account Information (Read-only)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-muted-foreground">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input
                            value={fullName || ""}
                            disabled
                            className="pl-10 bg-muted/30 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-muted-foreground">University</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input
                            value={universityName || ""}
                            disabled
                            className="pl-10 bg-muted/30 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input
                            value={email || ""}
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
    );
}

interface EditableSectionProps {
    department: string;
    studentClass: string;
    mobileNumber: string;
    saving: boolean;
    saveSuccess: boolean;
    error: string | null;
    onChangeField: (field: "department" | "studentClass" | "mobileNumber", value: string) => void;
    onSave: () => void;
}

function EditableProfileSection({
    department,
    studentClass,
    mobileNumber,
    saving,
    saveSuccess,
    error,
    onChangeField,
    onSave,
}: EditableSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy uppercase tracking-wider">
                <GraduationCap className="h-4 w-4" />
                Editable Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="department"
                            value={department}
                            onChange={(e) => onChangeField("department", e.target.value)}
                            placeholder="e.g., Computer Science"
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="class">Class / Year</Label>
                    <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="class"
                            value={studentClass}
                            onChange={(e) => onChangeField("studentClass", e.target.value)}
                            placeholder="e.g., 3rd Year"
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="mobile"
                            value={mobileNumber}
                            onChange={(e) => onChangeField("mobileNumber", e.target.value)}
                            placeholder="+91 98765 43210"
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {saveSuccess && (
                <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-600 text-sm"
                >
                    Profile updated successfully!
                </m.div>
            )}

            <div className="flex justify-end pt-4">
                <Button
                    onClick={onSave}
                    disabled={saving}
                    className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 hover:from-brand-orange hover:to-brand-yellow font-bold transition-colors duration-300"
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
    );
}

export function ProfilePage() {
    const { user } = useAuth();

    const initialAvatar =
        (user?.user_metadata as any)?.custom_avatar_url ||
        (user?.user_metadata as any)?.avatar_url ||
        (user?.user_metadata as any)?.picture ||
        null;

    const [state, dispatch] = useReducer(profileReducer, {
        profile: null,
        loading: true,
        saving: false,
        saveSuccess: false,
        error: null,
        department: "",
        studentClass: "",
        mobileNumber: "",
        uploadingAvatar: false,
        avatarUrl: initialAvatar,
    });

    const {
        profile,
        loading,
        saving,
        saveSuccess,
        error,
        department,
        studentClass,
        mobileNumber,
        uploadingAvatar,
        avatarUrl,
    } = state;

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        const next =
            (user?.user_metadata as any)?.custom_avatar_url ||
            (user?.user_metadata as any)?.avatar_url ||
            (user?.user_metadata as any)?.picture ||
            null;
        dispatch({ type: "SET_AVATAR_URL", url: next });
    }, [user]);

    const fetchProfile = async () => {
        try {
            dispatch({ type: "FETCH_START" });
            const data = await api.get("/profiles/me");
            dispatch({ type: "FETCH_SUCCESS", profile: data });
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            dispatch({ type: "FETCH_ERROR", error: "Failed to load profile" });
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        try {
            dispatch({ type: "SAVE_START" });

            await api.patch(`/profiles/${profile.id}`, {
                department,
                class: studentClass,
                mobileNumber,
            });

            dispatch({ type: "SAVE_SUCCESS" });
            setTimeout(() => dispatch({ type: "DISMISS_SAVE_SUCCESS" }), 3000);

            await fetchProfile();
        } catch (err: any) {
            console.error("Failed to save profile:", err);
            dispatch({ type: "SAVE_ERROR", error: err.message || "Failed to save changes. Please try again." });
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            dispatch({ type: "SET_UPLOADING_AVATAR", uploading: true });

            const imageUrl = await uploadImage(file, "profile-avatars");

            const oldAvatarUrl = (user?.user_metadata as any)?.custom_avatar_url;
            if (oldAvatarUrl && oldAvatarUrl.includes("profile-avatars")) {
                try {
                    const path = oldAvatarUrl.split("/profile-avatars/").pop();
                    if (path) {
                        await supabase.storage.from("profile-avatars").remove([path]);
                    }
                } catch (deleteErr) {
                    console.warn("Failed to delete old avatar:", deleteErr);
                }
            }

            const { error } = await supabase.auth.updateUser({
                data: { custom_avatar_url: imageUrl }
            });

            if (error) throw error;

            dispatch({ type: "SET_AVATAR_URL", url: imageUrl });
        } catch (err) {
            console.error("Avatar upload failed:", err);
            dispatch({ type: "FETCH_ERROR", error: "Failed to upload avatar" });
        } finally {
            dispatch({ type: "SET_UPLOADING_AVATAR", uploading: false });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    const userFullName =
        profile?.fullName ||
        (user?.user_metadata as any)?.full_name ||
        user?.email?.split("@")[0] ||
        "Student";

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <m.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2"
                >
                    <span className="text-brand-navy">MY </span>
                    <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">PROFILE</span>
                </m.h1>
                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    Manage your account details and preferences
                </m.p>
            </div>

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm"
            >
                <ProfileHeaderCard
                    avatarUrl={avatarUrl}
                    userFullName={userFullName}
                    universityName={profile?.universityName}
                    uploadingAvatar={uploadingAvatar}
                    onAvatarUpload={handleAvatarUpload}
                />

                <div className="p-6 sm:p-8 space-y-8">
                    <ReadOnlyAccountSection
                        fullName={profile?.fullName}
                        universityName={profile?.universityName}
                        email={user?.email}
                    />

                    <div className="border-t border-border/50" />

                    <EditableProfileSection
                        department={department}
                        studentClass={studentClass}
                        mobileNumber={mobileNumber}
                        saving={saving}
                        saveSuccess={saveSuccess}
                        error={error}
                        onChangeField={(field, val) => dispatch({ type: "SET_FIELD", field, value: val })}
                        onSave={handleSave}
                    />
                </div>
            </m.div>
        </div>
    );
}
