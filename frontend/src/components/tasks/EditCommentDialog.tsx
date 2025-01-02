import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentResponse } from "@/types/comment";

interface EditCommentDialogProps {
    comment: CommentResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (content: string) => void;
}

export default function EditCommentDialog({ 
    comment, 
    open, 
    onOpenChange,
    onSave 
}: EditCommentDialogProps) {
    const [content, setContent] = useState(comment?.content || "");

    useEffect(() => {
        if (open && comment) {
            setContent(comment.content);
        }
    }, [open, comment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSave(content);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yorumu Düzenle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Yorumunuzu yazın..."
                    />
                    <div className="flex justify-end gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                        >
                            İptal
                        </Button>
                        <Button type="submit">Kaydet</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 