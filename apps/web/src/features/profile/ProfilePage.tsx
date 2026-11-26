import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    Camera,
    BadgeCheck,
    Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { supabase } from "@/lib/supabase";
import "./profile.css";

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
    | {
          type: "SET_FIELD";
          field: "department" | "studentClass" | "mobileNumber";
          value: string;
      }
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

export function ProfilePage() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

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

    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== "DELETE") return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await api.delete("/account");
            await signOut();
            navigate("/", { replace: true });
        } catch (err: any) {
            setDeleteError(
                err?.message || "Could not delete the account. Please contact support."
            );
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            dispatch({
                type: "SAVE_ERROR",
                error: err.message || "Failed to save changes. Please try again.",
            });
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
                data: { custom_avatar_url: imageUrl },
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
            <div className="um-editorial um-profile">
                <div className="pr-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading profile...</span>
                </div>
            </div>
        );
    }

    const userFullName =
        profile?.fullName ||
        (user?.user_metadata as any)?.full_name ||
        user?.email?.split("@")[0] ||
        "Student";

    return (
        <div className="um-editorial um-profile">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Profile
                    </p>
                    <h1 className="page-title">
                        Your <span>profile.</span>
                    </h1>
                    <p className="page-lead">
                        Manage your account details and preferences.
                    </p>
                </div>
            </header>

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pr-hero"
            >
                <div className="pr-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={userFullName} />
                    ) : (
                        userFullName.charAt(0).toUpperCase()
                    )}
                    <label className="pr-avatar-pick">
                        {uploadingAvatar ? (
                            <Loader2 size={22} className="animate-spin" />
                        ) : (
                            <Camera size={22} />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            aria-label="Upload profile picture"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            disabled={uploadingAvatar}
                        />
                    </label>
                </div>

                <div className="pr-id">
                    <h2 className="pr-name">
                        {userFullName}
                        {profile?.isVerified && (
                            <span className="pr-verified">
                                <BadgeCheck size={12} /> Verified
                            </span>
                        )}
                    </h2>
                    <p className="pr-university">
                        <Building2 size={14} />
                        {profile?.universityName || "University"}
                    </p>
                </div>
            </m.div>

            {/* Account information (read-only) */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="pr-panel"
            >
                <p className="pr-label">
                    <Lock size={12} /> Account information (read-only)
                </p>

                <div className="pr-grid">
                    <div className="field">
                        <label className="field-label" htmlFor="pr-fullname">
                            Full name
                        </label>
                        <div className="pr-field">
                            <User size={15} />
                            <input
                                id="pr-fullname"
                                value={profile?.fullName || ""}
                                disabled
                                className="field-input"
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="pr-university">
                            University
                        </label>
                        <div className="pr-field">
                            <Building2 size={15} />
                            <input
                                id="pr-university"
                                value={profile?.universityName || ""}
                                disabled
                                className="field-input"
                            />
                        </div>
                    </div>

                    <div className="field full">
                        <label className="field-label" htmlFor="pr-email">
                            Email
                        </label>
                        <div className="pr-field">
                            <Mail size={15} />
                            <input
                                id="pr-email"
                                value={user?.email || ""}
                                disabled
                                className="field-input"
                            />
                        </div>
                    </div>
                </div>

                <p className="pr-note">
                    <AlertCircle size={13} />
                    Name and university cannot be changed. Contact support if you need to update
                    these.
                </p>
            </m.div>

            {/* Editable information */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="pr-panel"
            >
                <p className="pr-label">
                    <GraduationCap size={12} /> Editable information
                </p>

                <div className="pr-grid">
                    <div className="field">
                        <label className="field-label" htmlFor="pr-department">
                            Department
                        </label>
                        <div className="pr-field">
                            <BookOpen size={15} />
                            <input
                                id="pr-department"
                                value={department}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_FIELD",
                                        field: "department",
                                        value: e.target.value,
                                    })
                                }
                                placeholder="e.g., Computer Science"
                                className="field-input"
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="pr-class">
                            Class / year
                        </label>
                        <div className="pr-field">
                            <GraduationCap size={15} />
                            <input
                                id="pr-class"
                                value={studentClass}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_FIELD",
                                        field: "studentClass",
                                        value: e.target.value,
                                    })
                                }
                                placeholder="e.g., 3rd Year"
                                className="field-input"
                            />
                        </div>
                    </div>

                    <div className="field full">
                        <label className="field-label" htmlFor="pr-mobile">
                            Mobile number
                        </label>
                        <div className="pr-field">
                            <Phone size={15} />
                            <input
                                id="pr-mobile"
                                value={mobileNumber}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_FIELD",
                                        field: "mobileNumber",
                                        value: e.target.value,
                                    })
                                }
                                placeholder="+91 98765 43210"
                                className="field-input"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error alert-row" role="alert">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {saveSuccess && (
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="alert alert-success alert-row"
                        role="status"
                    >
                        <BadgeCheck size={16} />
                        <span>Profile updated successfully!</span>
                    </m.div>
                )}

                <div className="pr-actions">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="button button-primary"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save changes
                            </>
                        )}
                    </button>
                </div>

                <div className="pr-danger">
                    <div>
                        <h3>Delete account</h3>
                        <p>
                            This permanently removes your profile, listings, posts and community
                            memberships. It cannot be undone.
                        </p>
                    </div>
                    <div className="pr-danger-actions">
                        <input
                            className="field-input"
                            placeholder="Type DELETE to confirm"
                            aria-label="Type DELETE to confirm account deletion"
                            value={deleteConfirm}
                            onChange={(event) => setDeleteConfirm(event.target.value)}
                        />
                        <button
                            type="button"
                            className="button pr-danger-button"
                            disabled={deleteConfirm !== "DELETE" || deleting}
                            onClick={handleDeleteAccount}
                        >
                            {deleting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Delete account
                                </>
                            )}
                        </button>
                    </div>
                    {deleteError && (
                        <div className="alert alert-error" role="alert">
                            {deleteError}
                        </div>
                    )}
                </div>
            </m.div>
        </div>
    );
}
