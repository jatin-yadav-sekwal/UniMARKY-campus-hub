import { useState, useEffect } from "react";
import { m } from "motion/react";
import { Link } from "react-router-dom";
import {
    UtensilsCrossed,
    Building2,
    Plus,
    Edit,
    Trash2,
    Loader2,
    ChefHat,
    Home,
    MapPin,
    Star,
    GraduationCap,
    FileText,
    BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface Restaurant {
    id: string;
    name: string;
    cuisine: string | null;
    location: string;
    rating: string;
    imageUrl: string | null;
    phone: string | null;
}

interface Accommodation {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: string;
    rentRange: string | null;
    phone: string | null;
}

interface StudyMaterial {
    id: string;
    department: string;
    year: string;
    subjectName: string;
    category: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
}

interface RestaurantSectionProps {
    restaurants: Restaurant[];
    deleting: string | null;
    onDelete: (id: string) => void;
}

function RestaurantListSection({ restaurants, deleting, onDelete }: RestaurantSectionProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <ChefHat className="h-5 w-5 text-brand-orange" />
                </div>
                <h2 className="text-xl font-bold text-brand-navy">
                    My Restaurants ({restaurants.length})
                </h2>
            </div>

            {restaurants.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                    <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No restaurants listed yet</p>
                    <Link to="/superuser/add-restaurant">
                        <Button variant="outline" className="mt-4 gap-2">
                            <Plus className="h-4 w-4" /> Add your first restaurant
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            className="bg-background border border-border/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="h-36 bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center">
                                {restaurant.imageUrl ? (
                                    <img src={restaurant.imageUrl} alt={restaurant.name} className="h-full w-full object-cover" />
                                ) : (
                                    <UtensilsCrossed className="h-12 w-12 text-brand-orange/40" />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-brand-navy truncate">{restaurant.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" /> {restaurant.location}
                                </p>
                                {restaurant.cuisine && (
                                    <p className="text-xs text-muted-foreground mt-1">{restaurant.cuisine}</p>
                                )}
                                <div className="flex items-center gap-1 mt-2">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{restaurant.rating}</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Link to={`/superuser/edit-restaurant/${restaurant.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-1">
                                            <Edit className="h-3 w-3" /> Edit
                                        </Button>
                                    </Link>
                                    <Link to={`/superuser/add-menu/${restaurant.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-1">
                                            <Plus className="h-3 w-3" /> Menu
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 hover:bg-red-50"
                                        onClick={() => onDelete(restaurant.id)}
                                        disabled={deleting === restaurant.id}
                                    >
                                        {deleting === restaurant.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </m.div>
    );
}

interface AccommodationSectionProps {
    accommodations: Accommodation[];
    deleting: string | null;
    onDelete: (id: string) => void;
}

function AccommodationListSection({ accommodations, deleting, onDelete }: AccommodationSectionProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Home className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-brand-navy">
                    My Accommodations ({accommodations.length})
                </h2>
            </div>

            {accommodations.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No accommodations listed yet</p>
                    <Link to="/superuser/add-accommodation">
                        <Button variant="outline" className="mt-4 gap-2">
                            <Plus className="h-4 w-4" /> Add your first accommodation
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accommodations.map((acc) => (
                        <div
                            key={acc.id}
                            className="bg-background border border-border/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="h-36 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-blue-400/40" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-brand-navy truncate">{acc.name}</h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                        {acc.type}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" /> {acc.location}
                                </p>
                                {acc.rentRange && (
                                    <p className="text-sm font-semibold text-green-600 mt-1">{acc.rentRange}</p>
                                )}
                                <div className="flex gap-2 mt-4">
                                    <Link to={`/superuser/edit-accommodation/${acc.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-1">
                                            <Edit className="h-3 w-3" /> Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 hover:bg-red-50"
                                        onClick={() => onDelete(acc.id)}
                                        disabled={deleting === acc.id}
                                    >
                                        {deleting === acc.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </m.div>
    );
}

interface StudySectionProps {
    studyMaterials: StudyMaterial[];
    deleting: string | null;
    onDelete: (id: string) => void;
}

function StudyMaterialListSection({ studyMaterials, deleting, onDelete }: StudySectionProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-brand-navy">
                    My Study Materials ({studyMaterials.length})
                </h2>
            </div>

            {studyMaterials.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No study materials uploaded yet</p>
                    <Link to="/superuser/add-study-material">
                        <Button variant="outline" className="mt-4 gap-2">
                            <Plus className="h-4 w-4" /> Upload your first material
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studyMaterials.map((material) => (
                        <div
                            key={material.id}
                            className="bg-background border border-border/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="h-24 bg-gradient-to-br from-indigo-100 to-violet-50 flex items-center justify-center">
                                <FileText className="h-10 w-10 text-indigo-400/40" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-brand-navy truncate">{material.title}</h3>
                                <p className="text-sm text-indigo-500 font-medium mt-0.5">{material.subjectName}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {material.department} · {material.year}
                                </p>
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium mt-2">
                                    {material.category.replace(/_/g, " ")}
                                </span>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-red-500 hover:bg-red-50 gap-1"
                                        onClick={() => onDelete(material.id)}
                                        disabled={deleting === material.id}
                                    >
                                        {deleting === material.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3" />
                                        )}
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </m.div>
    );
}

export function SuperuserDashboard() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [foodRes, accRes, studyRes] = await Promise.all([
                api.get("/food/my-listings"),
                api.get("/accommodation/my-listings"),
                api.get("/study/mine"),
            ]);
            setRestaurants(foodRes);
            setAccommodations(accRes);
            setStudyMaterials(studyRes);
        } catch (err) {
            console.error("Failed to fetch listings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRestaurant = async (id: string) => {
        if (!confirm("Delete this restaurant and all its menu items?")) return;
        setDeleting(id);
        try {
            await api.delete(`/food/${id}`);
            setRestaurants((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteAccommodation = async (id: string) => {
        if (!confirm("Delete this accommodation listing?")) return;
        setDeleting(id);
        try {
            await api.delete(`/accommodation/${id}`);
            setAccommodations((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteStudyMaterial = async (id: string) => {
        if (!confirm("Delete this study material?")) return;
        setDeleting(id);
        try {
            await api.delete(`/study/${id}`);
            setStudyMaterials((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
        } finally {
            setDeleting(null);
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
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <m.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2"
                >
                    <span className="text-brand-navy">SUPERUSER </span>
                    <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                        DASHBOARD
                    </span>
                </m.h1>
                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    Manage your restaurants, accommodations, and study materials
                </m.p>
            </div>

            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap gap-3 mb-8"
            >
                <Link to="/superuser/add-restaurant">
                    <Button className="gap-2 bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold rounded-xl hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        Add Restaurant
                    </Button>
                </Link>
                <Link to="/superuser/add-accommodation">
                    <Button className="gap-2 bg-gradient-to-r from-brand-navy to-brand-navy/80 text-white font-bold rounded-xl hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        Add Accommodation
                    </Button>
                </Link>
                <Link to="/superuser/add-study-material">
                    <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold rounded-xl hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        Add Study Material
                    </Button>
                </Link>
            </m.div>

            <RestaurantListSection
                restaurants={restaurants}
                deleting={deleting}
                onDelete={handleDeleteRestaurant}
            />

            <AccommodationListSection
                accommodations={accommodations}
                deleting={deleting}
                onDelete={handleDeleteAccommodation}
            />

            <StudyMaterialListSection
                studyMaterials={studyMaterials}
                deleting={deleting}
                onDelete={handleDeleteStudyMaterial}
            />
        </div>
    );
}
