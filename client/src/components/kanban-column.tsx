import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, UpdateTask } from "@shared/schema";
import { TaskCard } from "./task-card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";

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

  const archiveTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/tasks/${id}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task Archived",
        description: "Task has been moved to the archive.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to archive task",
        variant: "destructive",
      });
    },
  });

  const archiveAllCompleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/tasks/archive-complete");
    },
    onSuccess: (data: { archivedCount: number }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Tasks Archived",
        description: `${data.archivedCount} completed tasks have been archived.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to archive completed tasks",
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
        <div className="flex items-center space-x-2">
          {column.id === "complete" && column.tasks.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => archiveAllCompleteMutation.mutate()}
              disabled={archiveAllCompleteMutation.isPending}
              className="text-xs text-slate-600 hover:text-blue-600 px-2 py-1"
            >
              <Archive size={12} className="mr-1" />
              Archive All
            </Button>
          )}
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
            {column.tasks.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={() => onTaskSelect(task.id)}
            onArchive={column.id === "complete" ? () => archiveTaskMutation.mutate(task.id) : undefined}
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
