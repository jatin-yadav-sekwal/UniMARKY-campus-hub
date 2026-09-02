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
    FileText,
    ImagePlus,
    Leaf,
    Trash2,
    Edit,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

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
        <div className="max-w-4xl mx-auto pb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <m.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">MENU FOR </span>
                <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                    {restaurantName || "RESTAURANT"}
                </span>
            </m.h1>
            <p className="text-muted-foreground mb-8">Add and manage menu items</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Form */}
                <m.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-background border border-border/50 rounded-2xl p-6 space-y-5 h-fit"
                >
                    <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                        <Plus className="h-5 w-5" /> Add Menu Item
                    </h2>

                    <div className="space-y-2">
                        <Label htmlFor="name">Item Name *</Label>
                        <div className="relative">
                            <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g., Margherita Pizza" className="pl-10" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Fresh mozzarella, basil..."
                            className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[80px] resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹) *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="price" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="299" className="pl-10" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="category" value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Main Course" className="pl-10" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Item Photo</Label>
                        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-colors overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            dispatch({ type: "SET_IMAGE_PREVIEW", preview: null });
                                            imageFileRef.current = null;
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <ImagePlus className="w-6 h-6 text-brand-orange" />
                                    <p className="text-xs">Upload photo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
                                        imageFileRef.current = file;
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            dispatch({ type: "SET_IMAGE_PREVIEW", preview: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => updateField("isVeg", !form.isVeg)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${form.isVeg ? "bg-green-50 border-green-300 text-green-700" : "bg-red-50 border-red-300 text-red-700"
                                }`}
                        >
                            <Leaf className="h-4 w-4" />
                            {form.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                        </button>
                    </div>

                    {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
                    {success && (
                        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Menu item added!
                        </m.div>
                    )}

                    <Button
                        type="submit"
                        disabled={saving}
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold hover:opacity-90"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>) : (<><Plus className="mr-2 h-4 w-4" /> Add Item</>)}
                    </Button>
                </m.form>

                {/* Existing Menu Items */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-lg font-bold text-brand-navy mb-4">
                        Current Menu ({menuItems.length} items)
                    </h2>

                    {loadingMenu ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : menuItems.length === 0 ? (
                        <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                            <UtensilsCrossed className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                            <p className="text-muted-foreground text-sm">No menu items yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {menuItems.map((item) => (
                                <div key={item.id} className="bg-background border border-border/50 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                                            <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm font-bold text-brand-orange">₹{item.price}</span>
                                            {item.category && <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{item.category}</span>}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:bg-red-50"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleting === item.id}
                                    >
                                        {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </m.div>
            </div>
        </div>
    );
}
