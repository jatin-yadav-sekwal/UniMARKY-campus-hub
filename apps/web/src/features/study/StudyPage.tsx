import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BookOpen,
    Search,
    FileText,
    StickyNote,
    ClipboardList,
    BookMarked,
    ScrollText,
    Library,
    Loader2,
    Download,
    ExternalLink,
    GraduationCap,
} from "lucide-react";
import { downloadFromDrive, isDriveUrl } from "@/lib/driveUtils";

// --- CUH Departments ---
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
    "Statistics",
    "Economics",
    "Commerce",
    "Management Studies",
    "English & Foreign Languages",
    "Hindi",
    "Sanskrit",
    "History & Archaeology",
    "Political Science",
    "Sociology",
    "Psychology",
    "Law",
    "Journalism & Mass Communication",
    "Library & Information Science",
    "Physical Education & Sports",
    "Teacher Education",
    "Tourism & Hotel Management",
    "Pharmaceutical Sciences",
    "Vocational Studies & Skill Development",
    "Applied Sciences & Humanities",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const CATEGORY_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
    previous_year_papers: { label: "Previous Year Papers", icon: FileText, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    notes: { label: "Notes", icon: StickyNote, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    sessional_exams: { label: "Sessional Exams", icon: ClipboardList, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    assignments: { label: "Assignments", icon: ScrollText, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    syllabus: { label: "Syllabus", icon: BookMarked, color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
    reference_books: { label: "Reference Books", icon: Library, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
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
            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-2"
                >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Study Resources</h1>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground ml-1"
                >
                    Access notes, previous year papers, sessional exams and more — filtered by department & year.
                </motion.p>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-border/50 bg-card p-6 mb-8 shadow-sm"
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Department Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Department</label>
                        <Select value={department} onValueChange={setDepartment}>
                            <SelectTrigger className="w-full h-11 rounded-xl">
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

                    {/* Year Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Year</label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-full h-11 rounded-xl">
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

                    {/* Category Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Category</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full h-11 rounded-xl">
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

                    {/* Fetch Button */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-transparent select-none">Action</label>
                        <Button
                            onClick={fetchMaterials}
                            disabled={!canFetch || loading}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300"
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

                {/* Active Filters Summary */}
                {department && year && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
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
                    </motion.div>
                )}
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-300/50 bg-red-50 p-4 mb-6 text-red-700 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        <p className="text-muted-foreground font-medium">Fetching resources...</p>
                    </motion.div>
                ) : hasFetched && materials.length === 0 ? (
                    <motion.div
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
                    </motion.div>
                ) : hasFetched && materials.length > 0 ? (
                    <motion.div
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
                            {materials.map((material, index) => {
                                const catMeta = CATEGORY_META[material.category];
                                const CatIcon = catMeta?.icon || FileText;
                                return (
                                    <motion.div
                                        key={material.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="group h-full overflow-hidden rounded-2xl border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 p-0">
                                            <div className="p-5 flex flex-col h-full">
                                                {/* Category Badge + Icon */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-full text-xs font-semibold px-2.5 py-0.5 ${catMeta?.color || ""}`}
                                                    >
                                                        <CatIcon className="h-3 w-3 mr-1" />
                                                        {catMeta?.label || material.category}
                                                    </Badge>
                                                </div>

                                                {/* Title + Subject */}
                                                <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                    {material.title}
                                                </h3>
                                                <p className="text-sm font-medium text-indigo-500/80 mb-2">
                                                    {material.subjectName}
                                                </p>

                                                {/* Description */}
                                                {material.description && (
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">
                                                        {material.description}
                                                    </p>
                                                )}

                                                {/* Footer */}
                                                <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        {material.uploaderName || "Anonymous"}
                                                    </span>
                                                    {material.fileUrl && (
                                                        <button
                                                            onClick={() => downloadFromDrive(material.fileUrl!)}
                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                                                        >
                                                            <Download className="h-3 w-3" />
                                                            {isDriveUrl(material.fileUrl!) ? "Download" : "Open"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    /* Initial State — before any fetch */
                    <motion.div
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
