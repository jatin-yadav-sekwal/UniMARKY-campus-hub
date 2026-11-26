import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import {
    GraduationCap,
    BookOpen,
    FileText,
    Download,
    Search,
    Loader2,
    Sparkles,
    Calendar,
    BookMarked,
    HelpCircle,
    FileCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { downloadFromDrive, isDriveUrl } from "@/lib/driveUtils";
import './study.css';

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

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; accent: string }> = {
    previous_year_papers: {
        label: "Previous Year Papers",
        icon: Calendar,
        accent: "#b4762a",
    },
    notes: {
        label: "Notes",
        icon: BookMarked,
        accent: "#2f6bd8",
    },
    sessional_exams: {
        label: "Sessional Exams",
        icon: FileCheck,
        accent: "#5751a7",
    },
    assignments: {
        label: "Assignments",
        icon: HelpCircle,
        accent: "#1f8a63",
    },
    syllabus: {
        label: "Syllabus",
        icon: Sparkles,
        accent: "#c2537a",
    },
    reference_books: {
        label: "Reference Books",
        icon: BookOpen,
        accent: "#2b8fa8",
    },
};

interface StudyMaterial {
    id: string;
    department: string;
    year: string;
    subjectName: string;
    category: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
    uploadedBy: string | null;
    uploaderName: string | null;
    createdAt: string;
}

interface FilterBarProps {
    department: string;
    year: string;
    categoryFilter: string;
    canFetch: boolean;
    loading: boolean;
    onSelectDepartment: (val: string) => void;
    onSelectYear: (val: string) => void;
    onSelectCategory: (val: string) => void;
    onFetch: () => void;
}

function StudyFilterBar({
    department,
    year,
    categoryFilter,
    canFetch,
    loading,
    onSelectDepartment,
    onSelectYear,
    onSelectCategory,
    onFetch,
}: FilterBarProps) {
    return (
        <div className="st-filters">
            <div className="st-filter-grid">
                <div className="field">
                    <label htmlFor="dept-select" className="field-label">Department</label>
                    <select
                        id="dept-select"
                        aria-label="Department"
                        value={department}
                        onChange={(e) => onSelectDepartment(e.target.value)}
                        className="field-input"
                    >
                        <option value="">Select department</option>
                        {CUH_DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="year-select" className="field-label">Year</label>
                    <select
                        id="year-select"
                        aria-label="Year"
                        value={year}
                        onChange={(e) => onSelectYear(e.target.value)}
                        className="field-input"
                    >
                        <option value="">Select year</option>
                        {YEARS.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="cat-filter" className="field-label">Category</label>
                    <select
                        id="cat-filter"
                        aria-label="Category"
                        value={categoryFilter}
                        onChange={(e) => onSelectCategory(e.target.value)}
                        className="field-input"
                    >
                        <option value="all">All categories</option>
                        {Object.entries(CATEGORY_META).map(([key, meta]) => (
                            <option key={key} value={key}>
                                {meta.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="st-action">
                    <button
                        type="button"
                        onClick={onFetch}
                        disabled={!canFetch || loading}
                        className="button button-primary st-fetch"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Search size={16} />
                        )}
                        Fetch content
                    </button>
                </div>
            </div>

            {department && year && (
                <div className="st-active">
                    <span className="st-active-label">Showing</span>
                    <span className="st-chip">{department}</span>
                    <span className="st-chip">{year}</span>
                    {categoryFilter && categoryFilter !== "all" && (
                        <span className="st-chip">{CATEGORY_META[categoryFilter]?.label}</span>
                    )}
                </div>
            )}
        </div>
    );
}

function StudyMaterialCard({ material, index }: { material: StudyMaterial; index: number }) {
    const catMeta = CATEGORY_META[material.category];
    const CatIcon = catMeta?.icon || FileText;
    const accent = catMeta?.accent || "#6b6760";

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="st-card"
            style={{ '--st-accent': accent } as React.CSSProperties}
        >
            <span className="st-cat">
                <CatIcon size={12} />
                {catMeta?.label || material.category}
            </span>

            <h3 className="st-title">{material.title}</h3>
            <p className="st-subject">{material.subjectName}</p>

            {material.description && (
                <p className="st-desc">{material.description}</p>
            )}

            <div className="st-footer">
                <span className="st-uploader">{material.uploaderName || "Anonymous"}</span>
                {material.fileUrl && (
                    <button
                        type="button"
                        onClick={() => downloadFromDrive(material.fileUrl!)}
                        className="st-download"
                    >
                        <Download size={12} />
                        {isDriveUrl(material.fileUrl!) ? "Download" : "Open"}
                    </button>
                )}
            </div>
        </m.div>
    );
}

export function StudyPage() {
    const [department, setDepartment] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canFetch = department !== "" && year !== "";

    const fetchMaterials = async () => {
        if (!canFetch) return;
        setLoading(true);
        setError(null);
        try {
            let endpoint = `/study?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}`;
            if (categoryFilter && categoryFilter !== "all") {
                endpoint += `&category=${encodeURIComponent(categoryFilter)}`;
            }
            const data = await api.get(endpoint);
            setMaterials(data);
            setHasFetched(true);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to fetch materials";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="um-editorial um-study">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Study
                    </p>
                    <h1 className="page-title">
                        Study <span>resources.</span>
                    </h1>
                    <p className="page-lead">
                        Access notes, previous year papers, sessional exams and more — filtered by
                        department and year.
                    </p>
                </div>
            </header>

            <StudyFilterBar
                department={department}
                year={year}
                categoryFilter={categoryFilter}
                canFetch={canFetch}
                loading={loading}
                onSelectDepartment={setDepartment}
                onSelectYear={setYear}
                onSelectCategory={setCategoryFilter}
                onFetch={fetchMaterials}
            />

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="st-loading"
                    >
                        <Loader2 size={22} className="animate-spin" />
                        <p>Fetching resources...</p>
                    </m.div>
                ) : hasFetched && materials.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="empty-state"
                    >
                        <span className="empty-icon">
                            <BookOpen size={24} strokeWidth={1.5} />
                        </span>
                        <h3>No resources found</h3>
                        <p>
                            No study materials are available for {department} — {year} yet. Check
                            back later or try a different filter.
                        </p>
                    </m.div>
                ) : hasFetched && materials.length > 0 ? (
                    <m.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="meta-mono st-count">
                            {materials.length} resource{materials.length !== 1 ? "s" : ""} found
                        </p>

                        <div className="st-grid">
                            {materials.map((material, index) => (
                                <StudyMaterialCard key={material.id} material={material} index={index} />
                            ))}
                        </div>
                    </m.div>
                ) : (
                    <m.div
                        key="initial"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="empty-state"
                    >
                        <span className="empty-icon">
                            <GraduationCap size={24} strokeWidth={1.5} />
                        </span>
                        <h3>Select your filters</h3>
                        <p>
                            Choose your department and year above, then click "Fetch content" to
                            find study resources.
                        </p>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}