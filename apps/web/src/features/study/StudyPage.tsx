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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { downloadFromDrive, isDriveUrl } from "@/lib/driveUtils";

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

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    previous_year_papers: {
        label: "Previous Year Papers",
        icon: Calendar,
        color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50",
    },
    notes: {
        label: "Notes",
        icon: BookMarked,
        color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50",
    },
    sessional_exams: {
        label: "Sessional Exams",
        icon: FileCheck,
        color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/50",
    },
    assignments: {
        label: "Assignments",
        icon: HelpCircle,
        color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50",
    },
    syllabus: {
        label: "Syllabus",
        icon: Sparkles,
        color: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700/50",
    },
    reference_books: {
        label: "Reference Books",
        icon: BookOpen,
        color: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700/50",
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
        <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border/50 bg-card p-6 mb-8 shadow-sm"
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                    <label htmlFor="dept-select" className="text-sm font-semibold text-foreground">Department</label>
                    <Select value={department} onValueChange={onSelectDepartment}>
                        <SelectTrigger id="dept-select" aria-label="Department" className="w-full h-11 rounded-xl">
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
                    <label htmlFor="year-select" className="text-sm font-semibold text-foreground">Year</label>
                    <Select value={year} onValueChange={onSelectYear}>
                        <SelectTrigger id="year-select" aria-label="Year" className="w-full h-11 rounded-xl">
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

                <div className="space-y-2">
                    <label htmlFor="cat-filter" className="text-sm font-semibold text-foreground">Category</label>
                    <Select value={categoryFilter} onValueChange={onSelectCategory}>
                        <SelectTrigger id="cat-filter" aria-label="Category" className="w-full h-11 rounded-xl">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {Object.entries(CATEGORY_META).map(([key, meta]) => (
                                <SelectItem key={key} value={key}>
                                    {meta.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <span className="text-sm font-semibold text-transparent select-none block" aria-hidden="true">Action</span>
                    <Button
                        onClick={onFetch}
                        disabled={!canFetch || loading}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-shadow duration-300"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4 mr-2" />
                        )}
                        Fetch Content
                    </Button>
                </div>
            </div>

            {department && year && (
                <m.div
                    initial={{ opacity: 0, scaleY: 0.95, transformOrigin: "top" }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-border/50 flex flex-wrap items-center gap-2"
                >
                    <span className="text-xs font-medium text-muted-foreground">Showing:</span>
                    <Badge variant="secondary" className="rounded-full text-xs">
                        {department}
                    </Badge>
                    <Badge variant="secondary" className="rounded-full text-xs">
                        {year}
                    </Badge>
                    {categoryFilter && categoryFilter !== "all" && (
                        <Badge variant="secondary" className="rounded-full text-xs">
                            {CATEGORY_META[categoryFilter]?.label}
                        </Badge>
                    )}
                </m.div>
            )}
        </m.div>
    );
}

function StudyMaterialCard({ material, index }: { material: StudyMaterial; index: number }) {
    const catMeta = CATEGORY_META[material.category];
    const CatIcon = catMeta?.icon || FileText;

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="group h-full overflow-hidden rounded-2xl border-border/50 hover:border-border hover:shadow-lg transition-shadow duration-300 p-0">
                <div className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                        <Badge
                            variant="outline"
                            className={`rounded-full text-xs font-semibold px-2.5 py-0.5 ${catMeta?.color || ""}`}
                        >
                            <CatIcon className="h-3 w-3 mr-1" />
                            {catMeta?.label || material.category}
                        </Badge>
                    </div>

                    <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {material.title}
                    </h3>
                    <p className="text-sm font-medium text-indigo-500/80 mb-2">
                        {material.subjectName}
                    </p>

                    {material.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">
                            {material.description}
                        </p>
                    )}

                    <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {material.uploaderName || "Anonymous"}
                        </span>
                        {material.fileUrl && (
                            <button
                                onClick={() => downloadFromDrive(material.fileUrl!)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 px-3 py-1.5 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer"
                            >
                                <Download className="h-3 w-3" />
                                {isDriveUrl(material.fileUrl!) ? "Download" : "Open"}
                            </button>
                        )}
                    </div>
                </div>
            </Card>
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
        <div className="min-h-screen">
            <div className="mb-8">
                <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-2"
                >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Study Resources</h1>
                </m.div>
                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground ml-1"
                >
                    Access notes, previous year papers, sessional exams and more — filtered by department & year.
                </m.p>
            </div>

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
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-300/50 bg-red-50 p-4 mb-6 text-red-700 text-sm"
                >
                    {error}
                </m.div>
            )}

            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        <p className="text-muted-foreground font-medium">Fetching resources...</p>
                    </m.div>
                ) : hasFetched && materials.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                        <div className="p-4 rounded-2xl bg-muted/50">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-foreground mb-1">No resources found</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                No study materials are available for {department} — {year} yet. Check back later or try a different filter.
                            </p>
                        </div>
                    </m.div>
                ) : hasFetched && materials.length > 0 ? (
                    <m.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground font-medium">
                                {materials.length} resource{materials.length !== 1 ? "s" : ""} found
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {materials.map((material, index) => (
                                <StudyMaterialCard key={material.id} material={material} index={index} />
                            ))}
                        </div>
                    </m.div>
                ) : (
                    <m.div
                        key="initial"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10">
                            <GraduationCap className="h-12 w-12 text-indigo-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-foreground mb-1">Select your filters</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                Choose your department and year above, then click "Fetch Content" to find study resources.
                            </p>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}
