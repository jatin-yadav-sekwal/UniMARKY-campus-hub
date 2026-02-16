import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image, X, Send, Loader2, CalendarDays, Megaphone, Clock, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

interface CreatePostProps {
    onPostCreated: (post: any) => void;
    userRole?: string;
    userName?: string;
}

export function CreatePost({ onPostCreated, userRole, userName }: CreatePostProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState("");
    const [type, setType] = useState("post");
    const [title, setTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [hostedBy, setHostedBy] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_CHARS = 1000;
    const canPostSpecial = userRole === "superuser" || userRole === "userX";

    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => textareaRef.current?.focus(), 100);
    };

    const handleFileChange = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        if (file.size > 5 * 1024 * 1024) { alert("Max size 5MB"); return; }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    }, []);

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setContent("");
        setTitle("");
        setType("post");
        setEventDate("");
        setHostedBy("");
        removeImage();
    };

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (val.length <= MAX_CHARS) setContent(val);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setIsLoading(true);

        try {
            let imageUrl: string | undefined;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, { bucket: "post-images" });
            }

            const payload: any = { content, type, imageUrl };
            if (type === "event" || type === "announcement") {
                payload.title = title || undefined;
            }
            if (type === "event") {
                payload.eventDate = eventDate || undefined;
                payload.hostedBy = hostedBy || undefined;
            }

            const newPost = await api.post("/social", payload);
            onPostCreated(newPost);
            handleCancel();
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const charPercent = (content.length / MAX_CHARS) * 100;
    const charColor = charPercent > 90 ? "text-red-500" : charPercent > 75 ? "text-amber-500" : "text-muted-foreground/50";

    return (
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden mb-6">
            {!isExpanded ? (
                /* ── Collapsed bar ── */
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-border/20 shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-rose-600 text-white text-sm font-semibold">
                                {userName?.[0] || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={handleExpand}
                            className="flex-1 px-4 py-2.5 text-left bg-muted/40 hover:bg-muted/60 rounded-full text-sm text-muted-foreground transition-colors"
                        >
                            What's on your mind?
                        </button>
                    </div>

                    {/* Quick-action buttons */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                        <div className="flex gap-1">
                            <Button
                                variant="ghost" size="sm"
                                onClick={() => { handleExpand(); setTimeout(() => fileInputRef.current?.click(), 200); }}
                                className="gap-1.5 h-8 rounded-full text-xs text-muted-foreground hover:text-green-600"
                            >
                                <Image className="w-4 h-4 text-green-500" /> Photo
                            </Button>
                            {canPostSpecial && (
                                <>
                                    <Button
                                        variant="ghost" size="sm"
                                        onClick={() => { handleExpand(); setType("event"); }}
                                        className="gap-1.5 h-8 rounded-full text-xs text-muted-foreground hover:text-violet-600"
                                    >
                                        <CalendarDays className="w-4 h-4 text-violet-500" /> Event
                                    </Button>
                                    <Button
                                        variant="ghost" size="sm"
                                        onClick={() => { handleExpand(); setType("announcement"); }}
                                        className="gap-1.5 h-8 rounded-full text-xs text-muted-foreground hover:text-amber-600"
                                    >
                                        <Megaphone className="w-4 h-4 text-amber-500" /> News
                                    </Button>
                                </>
                            )}
                        </div>
                        <Button
                            size="sm"
                            onClick={handleExpand}
                            className="h-8 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs px-5 font-semibold shadow-md shadow-rose-500/25"
                        >
                            Post
                        </Button>
                    </div>
                </div>
            ) : (
                /* ── Expanded form ── */
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4"
                >
                    {/* Type selector */}
                    {canPostSpecial && (
                        <div className="mb-3">
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-44 h-9 rounded-xl text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="post">📝 Post</SelectItem>
                                    <SelectItem value="event">📅 Event</SelectItem>
                                    <SelectItem value="announcement">📣 News</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Title + extra fields */}
                    <AnimatePresence>
                        {(type === "event" || type === "announcement") && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-3 space-y-2"
                            >
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={type === "event" ? "Event name" : "News headline"}
                                    className="h-10 rounded-xl text-sm font-medium"
                                />
                                {type === "event" && (
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                            <Input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="h-9 rounded-xl text-xs pl-8" />
                                        </div>
                                        <div className="relative flex-1">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                            <Input value={hostedBy} onChange={(e) => setHostedBy(e.target.value)} placeholder="Hosted by..." className="h-9 rounded-xl text-xs pl-8" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={autoResize}
                        placeholder="Share something with your campus..."
                        rows={3}
                        className="w-full min-h-[80px] max-h-[200px] px-1 py-2 text-sm bg-transparent border-none resize-none focus:outline-none placeholder:text-muted-foreground/50 leading-relaxed"
                    />

                    {/* Char counter */}
                    <div className="flex justify-end mb-2">
                        <span className={`text-[10px] tabular-nums ${charColor}`}>{content.length}/{MAX_CHARS}</span>
                    </div>

                    {/* Image upload area */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                    >
                        <AnimatePresence>
                            {imagePreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative rounded-xl overflow-hidden mb-3 bg-muted/30"
                                >
                                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-xl" />
                                    <Button type="button" variant="ghost" size="icon" onClick={removeImage} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white">
                                        <X className="w-3.5 h-3.5" />
                                    </Button>
                                </motion.div>
                            )}
                            {isDragOver && !imagePreview && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-2 border-dashed border-rose-400/30 bg-rose-50/50 dark:bg-rose-900/10 rounded-xl p-6 text-center mb-3">
                                    <Image className="w-6 h-6 mx-auto mb-2 text-rose-400/50" />
                                    <p className="text-xs text-rose-400/60">Drop image here</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} className="hidden" />
                            <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5 h-8 rounded-full text-muted-foreground hover:text-green-600">
                                <Image className="w-4 h-4 text-green-500" />
                                <span className="text-xs">Photo</span>
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={handleCancel} className="h-8 rounded-full text-xs">Cancel</Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!content.trim() || isLoading}
                                className="h-8 rounded-full gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs px-5 font-semibold shadow-md shadow-rose-500/25"
                            >
                                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                Post
                            </Button>
                        </div>
                    </div>
                </motion.form>
            )}
        </div>
    );
}
