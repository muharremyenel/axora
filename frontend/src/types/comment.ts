export interface CommentRequest {
    content: string;
}

export interface CommentResponse {
    id: number;
    content: string;
    userName: string;
    userId: number;
    createdAt: string;
} 