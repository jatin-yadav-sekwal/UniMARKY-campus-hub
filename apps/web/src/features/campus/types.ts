export interface Post {
    id: string;
    authorId: string;
    type: "post" | "event" | "announcement";
    title?: string;
    content: string;
    imageUrl?: string;
    eventDate?: string;
    hostedBy?: string;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    universityName: string;
    createdAt: string;
    updatedAt: string;
    isLiked?: boolean;
    author: {
        id: string;
        fullName: string;
        idCardUrl?: string;
        role: string;
    };
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        fullName: string;
        idCardUrl?: string;
        role: string;
    };
}

export interface UserProfile {
    id: string;
    fullName: string;
    role: "normal" | "superuser" | "admin" | "userX";
    universityName: string;
    idCardUrl?: string;
}
