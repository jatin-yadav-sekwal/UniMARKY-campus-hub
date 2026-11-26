import { useEffect, useReducer, useRef } from "react";
import { m } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Plus,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    UtensilsCrossed,
    DollarSign,
    Tag,
    ImagePlus,
    Leaf,
    Trash2,
    X,
} from "lucide-react";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import "./superuser.css";

interface MenuItem {
    id: string;
    name: string;
    price: string;
    category: string | null;
    description: string | null;
    isVeg: boolean;
    isAvailable: boolean;
}

interface MenuItemForm {
    name: string;
    description: string;
    price: string;
    category: string;
    isVeg: boolean;
}

interface MenuItemPageState {
    saving: boolean;
    error: string | null;
    success: boolean;
    menuItems: MenuItem[];
    loadingMenu: boolean;
    restaurantName: string;
    deleting: string | null;
    imagePreview: string | null;
    form: MenuItemForm;
}

type MenuItemPageAction =
    | { type: "LOAD_MENU_START" }
    | { type: "LOAD_MENU_SUCCESS"; restaurantName: string; menuItems: MenuItem[] }
    | { type: "LOAD_MENU_ERROR"; error: string }
    | { type: "SET_FIELD"; field: keyof MenuItemForm; value: any }
    | { type: "SET_IMAGE_PREVIEW"; preview: string | null }
    | { type: "SUBMIT_START" }
    | { type: "SUBMIT_SUCCESS"; newItem: MenuItem }
    | { type: "SUBMIT_ERROR"; error: string }
    | { type: "DISMISS_SUCCESS" }
    | { type: "DELETE_START"; id: string }
    | { type: "DELETE_SUCCESS"; id: string }
    | { type: "DELETE_ERROR" };

const initialForm: MenuItemForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
};

function menuItemPageReducer(state: MenuItemPageState, action: MenuItemPageAction): MenuItemPageState {
    switch (action.type) {
        case "LOAD_MENU_START":
            return { ...state, loadingMenu: true };
        case "LOAD_MENU_SUCCESS":
            return {
                ...state,
                loadingMenu: false,
                restaurantName: action.restaurantName,
                menuItems: action.menuItems,
            };
        case "LOAD_MENU_ERROR":
            return { ...state, loadingMenu: false, error: action.error };
        case "SET_FIELD":
            return { ...state, form: { ...state.form, [action.field]: action.value } };
        case "SET_IMAGE_PREVIEW":
            return { ...state, imagePreview: action.preview };
        case "SUBMIT_START":
            return { ...state, saving: true, error: null };
        case "SUBMIT_SUCCESS":
            return {
                ...state,
                saving: false,
                success: true,
                menuItems: [...state.menuItems, action.newItem],
                form: initialForm,
                imagePreview: null,
            };
        case "SUBMIT_ERROR":
            return { ...state, saving: false, error: action.error };
        case "DISMISS_SUCCESS":
            return { ...state, success: false };
        case "DELETE_START":
            return { ...state, deleting: action.id };
        case "DELETE_SUCCESS":
            return {
                ...state,
                deleting: null,
                menuItems: state.menuItems.filter((item) => item.id !== action.id),
            };
        case "DELETE_ERROR":
            return { ...state, deleting: null };
        default:
            return state;
    }
}

export function AddMenuItemPage() {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();
    const imageFileRef = useRef<File | null>(null);

    const [state, dispatch] = useReducer(menuItemPageReducer, {
        saving: false,
        error: null,
        success: false,
        menuItems: [],
        loadingMenu: true,
        restaurantName: "",
        deleting: null,
        imagePreview: null,
        form: initialForm,
    });

    const {
        saving,
        error,
        success,
        menuItems,
        loadingMenu,
        restaurantName,
        deleting,
        imagePreview,
        form,
    } = state;

    useEffect(() => {
        if (!restaurantId) return;
        let cancelled = false;
        dispatch({ type: "LOAD_MENU_START" });
        api.get(`/food/${restaurantId}`)
            .then((data) => {
                if (!cancelled) {
                    dispatch({
                        type: "LOAD_MENU_SUCCESS",
                        restaurantName: data.name,
                        menuItems: data.menu || [],
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to load menu:", err);
                if (!cancelled) {
                    dispatch({ type: "LOAD_MENU_ERROR", error: "Failed to load menu" });
                }
            });
        return () => {
            cancelled = true;
        };
    }, [restaurantId]);

    const updateField = (field: keyof MenuItemForm, value: any) => {
        dispatch({ type: "SET_FIELD", field, value });
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Max 5MB");
            return;
        }
        imageFileRef.current = file;
        const reader = new FileReader();
        reader.onloadend = () => {
            dispatch({ type: "SET_IMAGE_PREVIEW", preview: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        dispatch({ type: "SET_IMAGE_PREVIEW", preview: null });
        imageFileRef.current = null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price.trim()) {
            dispatch({ type: "SUBMIT_ERROR", error: "Name and price are required" });
            return;
        }

        try {
            dispatch({ type: "SUBMIT_START" });
            let imageUrl: string | undefined;
            if (imageFileRef.current) {
                imageUrl = await uploadImage(imageFileRef.current, "menu-images");
            }
            const newItem = await api.post(`/food/${restaurantId}/menu`, { ...form, imageUrl });
            imageFileRef.current = null;
            dispatch({ type: "SUBMIT_SUCCESS", newItem });
            setTimeout(() => dispatch({ type: "DISMISS_SUCCESS" }), 3000);
        } catch (err: any) {
            dispatch({ type: "SUBMIT_ERROR", error: err.message || "Failed to add menu item" });
        }
    };

    const handleDelete = async (menuItemId: string) => {
        if (!confirm("Delete this menu item?")) return;
        dispatch({ type: "DELETE_START", id: menuItemId });
        try {
            await api.delete(`/food/menu/${menuItemId}`);
            dispatch({ type: "DELETE_SUCCESS", id: menuItemId });
        } catch (err) {
            console.error("Failed to delete:", err);
            dispatch({ type: "DELETE_ERROR" });
        }
    };

    return (
        <div className="um-editorial um-superuser su-food">
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
                        <span>04</span>/ Menu
                    </p>
                    <h1 className="page-title">
                        Menu for <span>{restaurantName || "restaurant"}.</span>
                    </h1>
                    <p className="page-lead">Add and manage menu items.</p>
                </div>
            </header>

            <div className="su-menu-layout">
                <m.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="su-panel"
                >
                    <div className="su-panel-head">
                        <h2>Add menu item</h2>
                        <Plus size={16} />
                    </div>

                    <div className="form-stack">
                        <div className="field">
                            <label className="field-label" htmlFor="su-menu-name">
                                Item name *
                            </label>
                            <div className="su-field">
                                <UtensilsCrossed size={15} />
                                <input
                                    id="su-menu-name"
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    placeholder="e.g., Margherita Pizza"
                                    className="field-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="su-menu-description">
                                Description
                            </label>
                            <textarea
                                id="su-menu-description"
                                value={form.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                placeholder="Fresh mozzarella, basil..."
                                rows={3}
                                className="field-input"
                            />
                        </div>

                        <div className="form-grid">
                            <div className="field">
                                <label className="field-label" htmlFor="su-menu-price">
                                    Price (₹) *
                                </label>
                                <div className="su-field">
                                    <DollarSign size={15} />
                                    <input
                                        id="su-menu-price"
                                        value={form.price}
                                        onChange={(e) => updateField("price", e.target.value)}
                                        placeholder="299"
                                        className="field-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="su-menu-category">
                                    Category
                                </label>
                                <div className="su-field">
                                    <Tag size={15} />
                                    <input
                                        id="su-menu-category"
                                        value={form.category}
                                        onChange={(e) => updateField("category", e.target.value)}
                                        placeholder="Main Course"
                                        className="field-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="field-label">Item photo</p>
                            <label className="su-upload" style={{ height: 150 }}>
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveImage();
                                            }}
                                            aria-label="Remove photo"
                                            className="su-upload-remove"
                                        >
                                            <X size={15} />
                                        </button>
                                    </>
                                ) : (
                                    <span className="su-upload-empty">
                                        <ImagePlus size={20} strokeWidth={1.5} />
                                        <strong>Upload photo</strong>
                                        <small>PNG or JPG, up to 5MB</small>
                                    </span>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    aria-label="Item photo"
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="field">
                            <p className="field-label" id="su-menu-veg-label">
                                Diet
                            </p>
                            <div
                                className="su-choices"
                                role="group"
                                aria-labelledby="su-menu-veg-label"
                            >
                                <button
                                    type="button"
                                    aria-pressed={form.isVeg}
                                    onClick={() => updateField("isVeg", true)}
                                    className={`su-choice veg${form.isVeg ? " active" : ""}`}
                                >
                                    <Leaf size={14} /> Vegetarian
                                </button>
                                <button
                                    type="button"
                                    aria-pressed={!form.isVeg}
                                    onClick={() => updateField("isVeg", false)}
                                    className={`su-choice nonveg${!form.isVeg ? " active" : ""}`}
                                >
                                    <UtensilsCrossed size={14} /> Non-vegetarian
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-error alert-row" role="alert">
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success alert-row" role="status">
                                <CheckCircle2 size={16} />
                                <span>Menu item added!</span>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={saving}
                            className="button button-primary button-block"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Adding...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} /> Add item
                                </>
                            )}
                        </button>
                    </div>
                </m.form>

                <m.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="su-panel"
                >
                    <div className="su-panel-head">
                        <h2>Current menu</h2>
                        <p className="meta-mono">{menuItems.length} items</p>
                    </div>

                    {loadingMenu ? (
                        <div className="su-loading" style={{ minHeight: 200 }}>
                            <Loader2 size={20} className="animate-spin" />
                        </div>
                    ) : menuItems.length === 0 ? (
                        <div className="su-empty">
                            <span className="su-empty-icon">
                                <UtensilsCrossed size={20} strokeWidth={1.4} />
                            </span>
                            <p>No menu items yet.</p>
                        </div>
                    ) : (
                        <div className="su-menu-list">
                            {menuItems.map((item) => (
                                <div key={item.id} className="su-menu-row">
                                    <div style={{ minWidth: 0 }}>
                                        <p className="su-menu-name">
                                            <span
                                                className={`su-vegdot${item.isVeg ? "" : " nonveg"}`}
                                                aria-label={
                                                    item.isVeg ? "Vegetarian" : "Non-vegetarian"
                                                }
                                            >
                                                <i />
                                            </span>
                                            <span>{item.name}</span>
                                        </p>
                                        <div className="su-menu-meta">
                                            <span className="su-menu-price">₹{item.price}</span>
                                            {item.category && (
                                                <span className="su-menu-cat">{item.category}</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="su-action danger"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleting === item.id}
                                        aria-label={`Delete ${item.name}`}
                                    >
                                        {deleting === item.id ? (
                                            <Loader2 size={13} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={13} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </m.section>
            </div>
        </div>
    );
}
