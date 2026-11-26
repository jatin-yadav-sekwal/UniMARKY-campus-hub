import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { LostFoundForm, type LostFoundFormValues } from "./LostFoundForm";
import "./lostfound.css";

export function ReportItemPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        values: LostFoundFormValues,
        imageFile: File | null
    ) => {
        setLoading(true);

        try {
            let imageUrl: string | undefined;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, "lostfound-images");
            }
            await api.post("/lostfound", { ...values, imageUrl });
            navigate("/lost-found");
        } catch (error) {
            console.error("Failed to report item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="um-editorial um-lostfound">
            <div className="lf-form-wrap">
                <button
                    type="button"
                    onClick={() => navigate("/lost-found")}
                    className="back-link"
                >
                    <ArrowLeft size={15} /> Back to Lost & Found
                </button>

                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>03</span>/ Report
                        </p>
                        <h1 className="page-title">
                            Report an <span>item.</span>
                        </h1>
                        <p className="page-lead">
                            Help your campus community by reporting a lost or found item.
                        </p>
                    </div>
                </header>

                <LostFoundForm
                    submitLabel="Submit report"
                    loading={loading}
                    onSubmit={(values, imageFile) => handleSubmit(values, imageFile)}
                />
            </div>
        </div>
    );
}
