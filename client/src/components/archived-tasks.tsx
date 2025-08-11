import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Archive, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

export function ArchivedTasks() {
  const { toast } = useToast();

  const { data: archivedTasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", "archived"],
    queryFn: () => fetch("/api/tasks?archived=true").then(res => res.json()),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", "archived"] });
      toast({
        title: "Task Deleted",
        description: "The task has been permanently deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (archivedTasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <Archive className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Archived Tasks</h3>
        <p className="text-slate-600">Complete some tasks to see them archived here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {archivedTasks.length} archived task{archivedTasks.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archivedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-slate-900 text-sm line-clamp-2 line-through">
                {task.description}
              </h4>
              <div className="ml-2 flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span>Completed {formatTimeAgo(new Date(task.createdAt))}</span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                Complete
              </span>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteTaskMutation.mutate(task.id)}
                disabled={deleteTaskMutation.isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}