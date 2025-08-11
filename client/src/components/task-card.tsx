import { useState } from "react";
import { Edit } from "lucide-react";
import type { Task } from "@shared/schema";
import { TaskModal } from "./task-modal";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onSelect: () => void;
}

export function TaskCard({ task, onSelect }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
  };

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

  const getColumnStyles = (stage: string) => {
    switch (stage) {
      case "in-progress":
        return "border-blue-200 bg-blue-50";
      case "clarification":
        return "border-yellow-200 bg-yellow-50";
      case "complete":
        return "border-emerald-200 bg-emerald-50 opacity-75";
      default:
        return "border-slate-200";
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

  return (
    <>
      <div
        className={cn(
          "bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer",
          getColumnStyles(task.stage)
        )}
        draggable
        onDragStart={handleDragStart}
        onClick={onSelect}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className={cn(
            "font-medium text-slate-900 text-sm line-clamp-2",
            task.stage === "complete" && "line-through"
          )}>
            {task.description}
          </h4>
          <div className="ml-2 flex-shrink-0">
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
              getPriorityColor(task.priority)
            )}>
              {task.priority}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{formatTimeAgo(new Date(task.createdAt))}</span>
          <button
            className="hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
          >
            <Edit size={12} />
          </button>
        </div>
      </div>

      <TaskModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        taskId={task.id}
      />
    </>
  );
}
