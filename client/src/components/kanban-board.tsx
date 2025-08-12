import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";
import { KanbanColumn } from "./kanban-column";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface KanbanBoardProps {
  onTaskSelect: (taskId: string) => void;
}

export function KanbanBoard({ onTaskSelect }: KanbanBoardProps) {
  const { toast } = useToast();
  
  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    },
  });

  if (error && isUnauthorizedError(error as Error)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  const columns = [
    {
      id: "todo",
      title: "To-Do",
      color: "bg-slate-400",
      tasks: tasks.filter(task => task.stage === "todo"),
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-500",
      tasks: tasks.filter(task => task.stage === "in-progress"),
    },
    {
      id: "clarification",
      title: "Clarification",
      color: "bg-yellow-500",
      tasks: tasks.filter(task => task.stage === "clarification"),
    },
    {
      id: "complete",
      title: "Complete",
      color: "bg-emerald-500",
      tasks: tasks.filter(task => task.stage === "complete"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          onTaskSelect={onTaskSelect}
        />
      ))}
    </div>
  );
}
