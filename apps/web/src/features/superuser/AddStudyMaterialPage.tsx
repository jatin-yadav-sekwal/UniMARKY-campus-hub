import { useReducer } from "react";
import { m } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    FileText,
    Link2,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { isValidDriveLink, isDriveUrl } from "@/lib/driveUtils";
import "./superuser.css";

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
        <div className="um-editorial um-superuser su-study">
            <div className="su-form-wrap">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="back-link"
                >
                    <ArrowLeft size={15} /> Back
                </button>

                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>02</span>/ Study materials
                        </p>
                        <h1 className="page-title">
                            Add a <span>study material.</span>
                        </h1>
                        <p className="page-lead">
                            Share notes, papers, and resources with your fellow students.
                        </p>
                    </div>
                </header>

                <m.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="form-card"
                >
                    <div className="form-stack">
                        <div className="form-grid">
                            <div className="field">
                                <label className="field-label" htmlFor="su-study-department">
                                    Department *
                                </label>
                                <select
                                    id="su-study-department"
                                    value={department}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FIELD",
                                            field: "department",
                                            value: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {CUH_DEPARTMENTS.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="su-study-year">
                                    Year *
                                </label>
                                <select
                                    id="su-study-year"
                                    value={year}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FIELD",
                                            field: "year",
                                            value: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {YEARS.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="su-study-category">
                                    Category *
                                </label>
                                <select
                                    id="su-study-category"
                                    value={category}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FIELD",
                                            field: "category",
                                            value: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="su-study-subject">
                                    Subject name *
                                </label>
                                <div className="su-field">
                                    <BookOpen size={15} />
                                    <input
                                        id="su-study-subject"
                                        value={subjectName}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "SET_FIELD",
                                                field: "subjectName",
                                                value: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Data Structures"
                                        className="field-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="su-study-title">
                                Title *
                            </label>
                            <div className="su-field">
                                <FileText size={15} />
                                <input
                                    id="su-study-title"
                                    value={title}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FIELD",
                                            field: "title",
                                            value: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., DSA Mid-Sem 2024 Paper"
                                    className="field-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="su-study-description">
                                Description (optional)
                            </label>
                            <textarea
                                id="su-study-description"
                                value={description}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_FIELD",
                                        field: "description",
                                        value: e.target.value,
                                    })
                                }
                                placeholder="Brief description of the material..."
                                rows={4}
                                className="field-input"
                            />
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="su-study-file">
                                Google Drive link
                            </label>
                            <p className="form-note" style={{ marginTop: -6, marginBottom: 8 }}>
                                Paste a public Google Drive sharing link. Users will download
                                directly from Drive.
                            </p>
                            <div className="su-field">
                                <Link2 size={15} />
                                <input
                                    id="su-study-file"
                                    value={fileUrl}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FIELD",
                                            field: "fileUrl",
                                            value: e.target.value,
                                        })
                                    }
                                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                                    className="field-input"
                                />
                            </div>

                            {driveWarning && (
                                <p className="su-note warn">
                                    <AlertCircle size={13} />
                                    {driveWarning}
                                </p>
                            )}

                            {fileUrl && isValidDriveLink(fileUrl) && (
                                <p className="su-note ok">
                                    <CheckCircle2 size={13} />
                                    Valid Google Drive link detected
                                </p>
                            )}
                        </div>

                        {success && (
                            <div className="alert alert-success alert-row" role="status">
                                <CheckCircle2 size={16} />
                                <span>Study material added successfully!</span>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error alert-row" role="alert">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={!canSubmit || saving}
                            className="button button-primary"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Adding...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={16} /> Add material
                                </>
                            )}
                        </button>
                    </div>
                </m.form>
            </div>
        </div>
    );
}
