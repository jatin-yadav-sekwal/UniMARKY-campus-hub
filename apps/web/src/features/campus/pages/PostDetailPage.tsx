import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { PostCard } from "@/features/campus/components/PostCard";
import type { Post } from "@/features/campus/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/social/${id}`)
            .then((data) => setPost(data))
            .catch((err) => setError(err.message || "Post not found"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = () => {
        navigate("/unimedia", { replace: true });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <h2 className="text-xl font-bold mb-2">Post not found</h2>
                <p className="text-muted-foreground mb-4">{error || "This post may have been deleted."}</p>
                <Button onClick={() => navigate("/unimedia")} variant="outline">
                    ← Back to Unimedia
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/unimedia")}
                    className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed
                </Button>

                <PostCard
                    post={post}
                    currentUserId={user?.id}
                    onDelete={handleDelete}
                    defaultShowComments={true}
                />
            </motion.div>
        </div>
    );
}
