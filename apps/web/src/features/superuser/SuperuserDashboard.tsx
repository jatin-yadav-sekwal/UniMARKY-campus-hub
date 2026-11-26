import { useState, useEffect } from "react";
import { m } from "motion/react";
import { Link } from "react-router-dom";
import {
    UtensilsCrossed,
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
import { api } from "@/lib/api";
import "./superuser.css";

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

interface SectionProps {
    deleting: string | null;
    onDelete: (id: string) => void;
}

function RestaurantListSection({
    restaurants,
    deleting,
    onDelete,
}: SectionProps & { restaurants: Restaurant[] }) {
    return (
        <section className="su-section su-food">
            <header className="su-section-head">
                <span className="su-section-icon">
                    <ChefHat size={17} strokeWidth={1.6} />
                </span>
                <div className="su-section-title">
                    <h2>Restaurants</h2>
                    <p>{restaurants.length} listings</p>
                </div>
                <Link to="/superuser/add-restaurant" className="button button-secondary">
                    <Plus size={14} /> Add restaurant
                </Link>
            </header>

            {restaurants.length === 0 ? (
                <div className="su-empty">
                    <span className="su-empty-icon">
                        <UtensilsCrossed size={20} strokeWidth={1.4} />
                    </span>
                    <p>No restaurants listed yet.</p>
                    <Link to="/superuser/add-restaurant" className="button button-primary">
                        <Plus size={15} /> Add your first restaurant
                    </Link>
                </div>
            ) : (
                <div className="su-grid">
                    {restaurants.map((restaurant) => (
                        <article key={restaurant.id} className="su-card">
                            <div className="su-card-media">
                                {restaurant.imageUrl ? (
                                    <img src={restaurant.imageUrl} alt={restaurant.name} />
                                ) : (
                                    <UtensilsCrossed size={30} strokeWidth={1.3} />
                                )}
                            </div>

                            <div className="su-card-body">
                                <h3 className="su-card-name">{restaurant.name}</h3>

                                <p className="su-card-meta">
                                    <MapPin size={12} />
                                    <span>{restaurant.location}</span>
                                </p>

                                {restaurant.cuisine && (
                                    <span className="su-card-tag">{restaurant.cuisine}</span>
                                )}

                                <p className="su-card-meta">
                                    <Star size={12} fill="currentColor" />
                                    <span>{restaurant.rating}</span>
                                </p>

                                <div className="su-card-actions">
                                    <Link
                                        to={`/superuser/edit-restaurant/${restaurant.id}`}
                                        className="su-action"
                                    >
                                        <Edit size={12} /> Edit
                                    </Link>
                                    <Link
                                        to={`/superuser/add-menu/${restaurant.id}`}
                                        className="su-action"
                                    >
                                        <Plus size={12} /> Menu
                                    </Link>
                                    <button
                                        type="button"
                                        className="su-action danger"
                                        onClick={() => onDelete(restaurant.id)}
                                        disabled={deleting === restaurant.id}
                                        aria-label={`Delete ${restaurant.name}`}
                                    >
                                        {deleting === restaurant.id ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={12} />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

function AccommodationListSection({
    accommodations,
    deleting,
    onDelete,
}: SectionProps & { accommodations: Accommodation[] }) {
    return (
        <section className="su-section su-stay">
            <header className="su-section-head">
                <span className="su-section-icon">
                    <Home size={17} strokeWidth={1.6} />
                </span>
                <div className="su-section-title">
                    <h2>Accommodations</h2>
                    <p>{accommodations.length} listings</p>
                </div>
                <Link to="/superuser/add-accommodation" className="button button-secondary">
                    <Plus size={14} /> Add accommodation
                </Link>
            </header>

            {accommodations.length === 0 ? (
                <div className="su-empty">
                    <span className="su-empty-icon">
                        <Home size={20} strokeWidth={1.4} />
                    </span>
                    <p>No accommodations listed yet.</p>
                    <Link to="/superuser/add-accommodation" className="button button-primary">
                        <Plus size={15} /> Add your first accommodation
                    </Link>
                </div>
            ) : (
                <div className="su-grid">
                    {accommodations.map((acc) => (
                        <article key={acc.id} className="su-card">
                            <div className="su-card-media">
                                <Home size={30} strokeWidth={1.3} />
                            </div>

                            <div className="su-card-body">
                                <h3 className="su-card-name">{acc.name}</h3>

                                <p className="su-card-meta">
                                    <MapPin size={12} />
                                    <span>{acc.location}</span>
                                </p>

                                <span className="su-card-tag">{acc.type}</span>

                                {acc.rentRange && (
                                    <p className="su-card-price">{acc.rentRange}</p>
                                )}

                                <div className="su-card-actions">
                                    <Link
                                        to={`/superuser/edit-accommodation/${acc.id}`}
                                        className="su-action"
                                    >
                                        <Edit size={12} /> Edit
                                    </Link>
                                    <button
                                        type="button"
                                        className="su-action danger"
                                        onClick={() => onDelete(acc.id)}
                                        disabled={deleting === acc.id}
                                        aria-label={`Delete ${acc.name}`}
                                    >
                                        {deleting === acc.id ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={12} />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

function StudyMaterialListSection({
    studyMaterials,
    deleting,
    onDelete,
}: SectionProps & { studyMaterials: StudyMaterial[] }) {
    return (
        <section className="su-section su-study">
            <header className="su-section-head">
                <span className="su-section-icon">
                    <GraduationCap size={17} strokeWidth={1.6} />
                </span>
                <div className="su-section-title">
                    <h2>Study materials</h2>
                    <p>{studyMaterials.length} uploads</p>
                </div>
                <Link to="/superuser/add-study-material" className="button button-secondary">
                    <Plus size={14} /> Add material
                </Link>
            </header>

            {studyMaterials.length === 0 ? (
                <div className="su-empty">
                    <span className="su-empty-icon">
                        <BookOpen size={20} strokeWidth={1.4} />
                    </span>
                    <p>No study materials uploaded yet.</p>
                    <Link to="/superuser/add-study-material" className="button button-primary">
                        <Plus size={15} /> Upload your first material
                    </Link>
                </div>
            ) : (
                <div className="su-grid">
                    {studyMaterials.map((material) => (
                        <article key={material.id} className="su-card">
                            <div className="su-card-media">
                                <span className="su-doc">
                                    <FileText size={28} strokeWidth={1.3} />
                                </span>
                            </div>

                            <div className="su-card-body">
                                <h3 className="su-card-name">{material.title}</h3>

                                <p className="su-card-meta">
                                    <BookOpen size={12} />
                                    <span>{material.subjectName}</span>
                                </p>

                                <p className="su-card-meta">
                                    <GraduationCap size={12} />
                                    <span>
                                        {material.department} · {material.year}
                                    </span>
                                </p>

                                <span className="su-card-tag">
                                    {material.category.replace(/_/g, " ")}
                                </span>

                                <div className="su-card-actions">
                                    <button
                                        type="button"
                                        className="su-action danger"
                                        onClick={() => onDelete(material.id)}
                                        disabled={deleting === material.id}
                                        aria-label={`Delete ${material.title}`}
                                    >
                                        {deleting === material.id ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={12} />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
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
            <div className="um-editorial um-superuser">
                <div className="su-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading your listings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="um-editorial um-superuser">
            <header className="su-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Superuser
                    </p>
                    <h1 className="page-title">
                        Your <span>listings.</span>
                    </h1>
                    <p className="page-lead">
                        Manage your restaurants, accommodations, and study materials.
                    </p>
                </div>

                <div className="su-head-actions">
                    <Link to="/superuser/add-restaurant" className="button button-secondary">
                        <Plus size={15} /> Restaurant
                    </Link>
                    <Link to="/superuser/add-accommodation" className="button button-secondary">
                        <Plus size={15} /> Accommodation
                    </Link>
                    <Link to="/superuser/add-study-material" className="button button-primary">
                        <Plus size={15} /> Study material
                    </Link>
                </div>
            </header>

            <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
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
            </m.div>
        </div>
    );
}
