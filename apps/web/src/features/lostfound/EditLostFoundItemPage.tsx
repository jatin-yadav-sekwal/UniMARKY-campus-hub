import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import {
    LostFoundForm,
    type ItemType,
    type LostFoundFormValues,
} from "./LostFoundForm";
import "./lostfound.css";

export function EditLostFoundItemPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [imageUrl, setImageUrl] = useState("");

    const [initial, setInitial] = useState<{
        itemName: string;
        description: string;
        type: ItemType;
        location: string;
    }>({
        itemName: "",
        description: "",
        type: "lost",
        location: "",
    });

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        api.get(`/lostfound/${id}`)
            .then((item) => {
                if (cancelled) return;
                setInitial({
                    itemName: item.itemName ?? "",
                    description: item.description || "",
                    type: (item.type as ItemType) ?? "lost",
                    location: item.location || "",
                });
                setImageUrl(item.imageUrl || "");
            })
            .catch((error) => {
                console.error("Failed to fetch item:", error);
            })
            .finally(() => {
                if (!cancelled) setFetching(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleSubmit = async (
        values: LostFoundFormValues,
        imageFile: File | null,
        imageRemoved: boolean
    ) => {
        setLoading(true);

        try {
            let nextImageUrl = imageUrl;
            if (imageRemoved) {
                nextImageUrl = "";
            } else if (imageFile) {
                nextImageUrl = await uploadImage(imageFile, "lostfound-images");
            }
            await api.patch(`/lostfound/${id}`, { ...values, imageUrl: nextImageUrl });
            navigate("/lost-found/my-listings");
        } catch (error) {
            console.error("Failed to update item:", error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="um-editorial um-lostfound">
                <div className="lf-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading report...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="um-editorial um-lostfound">
            <div className="lf-form-wrap">
                <button
                    type="button"
                    onClick={() => navigate("/lost-found/my-listings")}
                    className="back-link"
                >
                    <ArrowLeft size={15} /> Back to My Listings
                </button>

                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>04</span>/ Edit report
                        </p>
                        <h1 className="page-title">
                            Edit your <span>report.</span>
                        </h1>
                        <p className="page-lead">
                            Update the details of a report you filed with the campus.
                        </p>
                    </div>
                </header>

                <LostFoundForm
                    initial={initial}
                    initialImage={imageUrl || null}
                    submitLabel="Save changes"
                    loading={loading}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
