import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";
import TaskComments from "@/components/tasks/TaskComments";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TaskDetailPage() {
    const { id } = useParams<{ id: string }>();
    const taskId = parseInt(id!);

    const { data: task, isLoading } = useQuery({
        queryKey: ["task", taskId],
        queryFn: () => taskService.getTaskById(taskId),
    });

    if (isLoading) return <div>Yükleniyor...</div>;
    if (!task) return <div>Görev bulunamadı</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{task.title}</h2>
                <p className="text-muted-foreground">{task.description}</p>
            </div>

            <Card className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <div className="text-sm font-medium">Durum</div>
                        <div className="text-sm text-muted-foreground">
                            {task.status}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium">Öncelik</div>
                        <div className="text-sm text-muted-foreground">
                            {task.priority}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium">Atanan Kişi</div>
                        <div className="text-sm text-muted-foreground">
                            {task.assignedUser}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium">Bitiş Tarihi</div>
                        <div className="text-sm text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </Card>

            <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Yorumlar</h3>
                <TaskComments taskId={taskId} />
            </div>
        </div>
    );
} 