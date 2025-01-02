import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import EditCommentDialog from "@/components/tasks/EditCommentDialog";
import { CommentResponse } from "@/types/comment";
import DeleteDialog from "@/components/common/DeleteDialog";

interface TaskCommentsProps {
    taskId: number;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
    const [comment, setComment] = useState("");
    const [selectedComment, setSelectedComment] = useState<CommentResponse | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<CommentResponse | null>(null);
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const { data: comments = [], isLoading } = useQuery({
        queryKey: ["taskComments", taskId],
        queryFn: () => taskService.getTaskComments(taskId),
    });

    const mutation = useMutation({
        mutationFn: (content: string) => 
            taskService.addComment(taskId, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taskComments", taskId] });
            setComment("");
            toast({
                title: "Başarılı",
                description: "Yorum eklendi",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId: number) => 
            taskService.deleteComment(taskId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taskComments", taskId] });
            toast({
                title: "Başarılı",
                description: "Yorum silindi",
            });
        },
    });

    const editMutation = useMutation({
        mutationFn: (data: { commentId: number; content: string }) => 
            taskService.updateComment(taskId, data.commentId, { content: data.content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taskComments", taskId] });
            setIsEditOpen(false);
            setSelectedComment(null);
            toast({
                title: "Başarılı",
                description: "Yorum güncellendi",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        mutation.mutate(comment);
    };

    const handleEdit = (comment: CommentResponse) => {
        setSelectedComment(comment);
        setIsEditOpen(true);
    };

    const handleDelete = (comment: CommentResponse) => {
        setCommentToDelete(comment);
        setIsDeleteOpen(true);
    };

    if (isLoading) return <div>Yükleniyor...</div>;

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                />
                <Button 
                    type="submit" 
                    disabled={mutation.isPending || !comment.trim()}
                >
                    {mutation.isPending ? "Gönderiliyor..." : "Gönder"}
                </Button>
            </form>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="font-medium">{comment.userName}</div>
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </div>
                                {user?.id === comment.userId && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(comment)}
                                        >
                                            Düzenle
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(comment)}
                                            className="text-destructive"
                                        >
                                            Sil
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="mt-2">{comment.content}</p>
                    </div>
                ))}
            </div>

            <EditCommentDialog
                comment={selectedComment}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSave={(content) => {
                    if (selectedComment) {
                        editMutation.mutate({ 
                            commentId: selectedComment.id, 
                            content 
                        });
                    }
                }}
            />

            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Yorumu Sil"
                description="Bu yorumu silmek istediğinize emin misiniz?"
                onConfirm={() => {
                    if (commentToDelete) {
                        deleteMutation.mutate(commentToDelete.id);
                        setIsDeleteOpen(false);
                        setCommentToDelete(null);
                    }
                }}
            />
        </div>
    );
} 