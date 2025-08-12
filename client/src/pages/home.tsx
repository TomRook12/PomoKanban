import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, User, Plus, Archive, ArrowLeft, LogOut } from "lucide-react";
import { KanbanBoard } from "@/components/kanban-board";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { TaskModal } from "@/components/task-modal";
import { ArchivedTasks } from "@/components/archived-tasks";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewArchived, setViewArchived] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName || user?.lastName ? (
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                      ) : null}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-gray-600 dark:text-gray-300">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
