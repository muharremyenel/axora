import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface TaskCommentsProps {
    taskId: number;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        mutation.mutate(comment);
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
                            <div className="text-sm text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <p className="mt-2">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 