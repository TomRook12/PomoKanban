import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, UpdateTask } from "@shared/schema";
import { TaskCard } from "./task-card";
import { useToast } from "@/hooks/use-toast";

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

interface KanbanColumnProps {
  column: Column;
  onTaskSelect: (taskId: string) => void;
}

export function KanbanColumn({ column, onTaskSelect }: KanbanColumnProps) {
  const { toast } = useToast();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTask }) => {
      return apiRequest("PATCH", `/api/tasks/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const newStage = column.id as Task["stage"];

    updateTaskMutation.mutate({
      id: taskId,
      updates: { stage: newStage },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${column.color}`} />
          <h3 className="font-semibold text-slate-900">{column.title}</h3>
        </div>
        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
          {column.tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={() => onTaskSelect(task.id)}
          />
        ))}
        
        {column.tasks.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No tasks in {column.title.toLowerCase()}
          </div>
        )}
      </div>
    </div>
  );
}
