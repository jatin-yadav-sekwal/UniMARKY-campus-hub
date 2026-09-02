import { useReducer } from "react";
import { m } from "motion/react";
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
    "Economics",
    "Commerce",
    "Management Studies",
    "English & Foreign Languages",
    "Hindi & Indian Languages",
    "Journalism & Mass Communication",
    "Law",
    "Library & Information Science",
    "Sociology",
    "Political Science",
    "History & Archaeology",
    "Psychology",
    "Physical Education & Sports",
    "Teacher Education",
    "Yoga",
    "Pharmaceutical Sciences",
    "MCA",
    "B.Tech (Common/First Year)",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const CATEGORIES = [
    { value: "previous_year_papers", label: "Previous Year Papers" },
    { value: "notes", label: "Notes" },
    { value: "sessional_exams", label: "Sessional Exams" },
    { value: "assignments", label: "Assignments" },
    { value: "syllabus", label: "Syllabus" },
    { value: "reference_books", label: "Reference Books" },
];

interface StudyMaterialForm {
    department: string;
    year: string;
    category: string;
    subjectName: string;
    title: string;
    description: string;
    fileUrl: string;
}

interface StudyMaterialPageState {
    saving: boolean;
    success: boolean;
    error: string | null;
    form: StudyMaterialForm;
}

type StudyMaterialPageAction =
    | { type: "SET_FIELD"; field: keyof StudyMaterialForm; value: string }
    | { type: "SUBMIT_START" }
    | { type: "SUBMIT_SUCCESS" }
    | { type: "SUBMIT_ERROR"; error: string }
    | { type: "DISMISS_SUCCESS" };

const initialForm: StudyMaterialForm = {
    department: "",
    year: "",
    category: "",
    subjectName: "",
    title: "",
    description: "",
    fileUrl: "",
};

function studyMaterialPageReducer(
    state: StudyMaterialPageState,
    action: StudyMaterialPageAction
): StudyMaterialPageState {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, form: { ...state.form, [action.field]: action.value } };
        case "SUBMIT_START":
            return { ...state, saving: true, error: null };
        case "SUBMIT_SUCCESS":
            return { ...state, saving: false, success: true, form: initialForm };
        case "SUBMIT_ERROR":
            return { ...state, saving: false, error: action.error };
        case "DISMISS_SUCCESS":
            return { ...state, success: false };
        default:
            return state;
    }
}

export function AddStudyMaterialPage() {
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(studyMaterialPageReducer, {
        saving: false,
        success: false,
        error: null,
        form: initialForm,
    });

    const { saving, success, error, form } = state;
    const { department, year, category, subjectName, title, description, fileUrl } = form;

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
            dispatch({ type: "SUBMIT_START" });
            await api.post("/study", {
                department,
                year,
                subjectName: subjectName.trim(),
                category,
                title: title.trim(),
                description: description.trim() || null,
                fileUrl: fileUrl.trim() || null,
            });
            dispatch({ type: "SUBMIT_SUCCESS" });
            setTimeout(() => dispatch({ type: "DISMISS_SUCCESS" }), 3000);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to add study material";
            dispatch({ type: "SUBMIT_ERROR", error: message });
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

            <m.div
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
            </m.div>
            <p className="text-muted-foreground mb-8 ml-1">
                Share notes, papers, and resources with your fellow students.
            </p>

            <m.form
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
                        <Select value={department} onValueChange={(val) => dispatch({ type: "SET_FIELD", field: "department", value: val })}>
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
                        <Select value={year} onValueChange={(val) => dispatch({ type: "SET_FIELD", field: "year", value: val })}>
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
                        <Select value={category} onValueChange={(val) => dispatch({ type: "SET_FIELD", field: "category", value: val })}>
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
                                onChange={(e) => dispatch({ type: "SET_FIELD", field: "subjectName", value: e.target.value })}
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
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "title", value: e.target.value })}
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
                        onChange={(e) => dispatch({ type: "SET_FIELD", field: "description", value: e.target.value })}
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
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "fileUrl", value: e.target.value })}
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
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Study material added successfully!
                    </m.div>
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
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold shadow-lg shadow-indigo-500/25 transition-colors"
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
            </m.form>
        </div>
    );
}
