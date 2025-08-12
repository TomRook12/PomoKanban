import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, User, Plus, Archive, ArrowLeft, LogOut } from "lucide-react";
import { KanbanBoard } from "@/components/kanban-board";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { TaskModal } from "@/components/task-modal";
import { ArchivedTasks } from "@/components/archived-tasks";
import { useAuth } from "@/hooks/useAuth";
import { Login } from "@/components/login";

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewArchived, setViewArchived] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Rocket className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading...</h2>
          <p className="text-slate-600">Setting up your workspace</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Rocket className="text-white" size={16} />
              </div>
              <h1 className="text-xl font-bold text-slate-900">FocusFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              {viewArchived ? (
                <Button
                  onClick={() => setViewArchived(false)}
                  variant="outline"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Board
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setViewArchived(true)}
                    variant="outline"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <Archive className="mr-2" size={16} />
                    Archived Tasks
                  </Button>
                  <Button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <Plus className="mr-2" size={16} />
                    New Task
                  </Button>
                </>
              )}
              <div className="flex items-center space-x-3">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="text-slate-600" size={16} />
                  </div>
                )}
                <span className="text-sm text-slate-700 hidden md:block">{user?.name}</span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {viewArchived ? "Archived Tasks" : "Task Board"}
              </h2>
              <p className="text-slate-600">
                {viewArchived 
                  ? "View and manage your completed tasks" 
                  : "Organize and track your work progress"
                }
              </p>
            </div>
            {viewArchived ? (
              <ArchivedTasks />
            ) : (
              <KanbanBoard onTaskSelect={setSelectedTaskId} />
            )}
          </div>
          <div className="xl:col-span-1">
            <PomodoroTimer selectedTaskId={selectedTaskId} onTaskSelect={setSelectedTaskId} />
          </div>
        </div>
      </div>

      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        taskId={null}
      />
    </div>
  );
}
