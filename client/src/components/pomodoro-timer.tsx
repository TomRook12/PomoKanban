import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Pause, Play, RotateCcw, Clock, CheckSquare, Settings, ChevronDown, ChevronUp, SkipForward } from "lucide-react";
import type { Task } from "@shared/schema";
import { usePomodoro } from "@/hooks/use-pomodoro";
import { useToast } from "@/hooks/use-toast";

interface PomodoroTimerProps {
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string) => void;
}

export function PomodoroTimer({ selectedTaskId, onTaskSelect }: PomodoroTimerProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  
  // Clear selected task if it becomes completed
  useEffect(() => {
    if (selectedTask && selectedTask.stage === "complete") {
      onTaskSelect("");
      toast({
        title: "Task Completed!",
        description: "Task removed from Pomodoro timer as it's now complete.",
      });
    }
  }, [selectedTask, onTaskSelect, toast]);
  
  const {
    timeRemaining,
    isActive,
    sessionType,
    sessionCount,
    completedPomodoros,
    currentCycle,
    targetCycles,
    autoRun,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    workDuration,
    shortBreak,
    longBreak,
    setWorkDuration,
    setShortBreak,
    setLongBreak,
    setAutoRun,
    setTargetCycles,
  } = usePomodoro();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressAngle = () => {
    const totalTime = sessionType === "work" ? workDuration : 
                     sessionType === "shortBreak" ? shortBreak : longBreak;
    const progress = (totalTime - timeRemaining) / totalTime;
    return progress * 360;
  };

  const getSessionTypeDisplay = () => {
    switch (sessionType) {
      case "work":
        return "Work Session";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Work Session";
    }
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

  // Handle drag-and-drop for task selection
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onTaskSelect(taskId);
      toast({
        title: "Task Selected!",
        description: "Task selected for your Pomodoro session.",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Mock statistics - in a real app, these would be tracked
  const todaysPomodoros = 6;
  const todaysTasks = 3;

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border p-6 sticky top-8 transition-all duration-200 ${
        isDragOver 
          ? 'border-blue-400 bg-blue-50 border-2' 
          : 'border-slate-200'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Pomodoro Timer</h3>
        <p className="text-slate-600 text-sm">Stay focused and productive</p>
      </div>

      {selectedTask && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <CheckSquare className="text-blue-600 mr-2" size={16} />
            <span className="text-xs font-medium text-blue-800 uppercase tracking-wide">Current Task</span>
          </div>
          <h4 className="font-medium text-slate-900 text-sm">{selectedTask.description}</h4>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(selectedTask.priority)}`}>
              {selectedTask.priority} Priority
            </span>
          </div>
        </div>
      )}

      {!selectedTask && (
        <div className={`mb-6 p-4 rounded-lg border transition-all duration-200 ${
          isDragOver 
            ? 'bg-blue-100 border-blue-300 border-dashed' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-center text-slate-600 text-sm">
            {isDragOver 
              ? "Drop task here to start a Pomodoro session" 
              : "Click a task from the board or drag it here to start a Pomodoro session"
            }
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="rgb(226, 232, 240)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke={sessionType === "work" ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - getProgressAngle() / 360)}`}
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold text-slate-900">{formatTime(timeRemaining)}</span>
            <span className={`text-sm font-medium mt-1 ${sessionType === "work" ? "text-red-600" : "text-emerald-600"}`}>
              {getSessionTypeDisplay()}
            </span>
          </div>
        </div>
        
        {/* Session Progress & Cycle Info */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < sessionCount ? "bg-red-500" : "bg-slate-300"
              }`}
            />
          ))}
          <span className="ml-2 text-xs text-slate-600">{sessionCount}/4 sessions</span>
        </div>
        <div className="text-center text-xs text-slate-500 mb-4">
          Cycle {currentCycle} of {targetCycles}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex justify-center space-x-2 mb-6">
        <Button
          onClick={isActive ? pauseTimer : startTimer}
          disabled={!selectedTask && sessionType === "work"}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
            isActive
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="mr-2" size={16} />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2" size={16} />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={skipSession}
          variant="outline"
          className="px-4 py-3 rounded-lg font-medium"
          title="Skip current session"
        >
          <SkipForward size={16} />
        </Button>
        <Button
          onClick={resetTimer}
          variant="outline"
          className="px-4 py-3 rounded-lg font-medium"
          title="Reset timer"
        >
          <RotateCcw size={16} />
        </Button>
      </div>

      {/* Settings Section */}
      <div className="mb-6">
        <Collapsible open={showSettings} onOpenChange={setShowSettings}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between p-3 bg-slate-50 hover:bg-slate-100"
            >
              <div className="flex items-center">
                <Settings className="mr-2" size={16} />
                <span className="text-sm font-medium">Timer Settings</span>
              </div>
              {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-slate-50 rounded-lg border">
            <div className="space-y-4">
              {/* Duration Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 font-medium">Work Duration</span>
                  <Select value={workDuration.toString()} onValueChange={(value) => setWorkDuration(Number(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="900">15 minutes</SelectItem>
                      <SelectItem value="1500">25 minutes</SelectItem>
                      <SelectItem value="3000">50 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 font-medium">Short Break</span>
                  <Select value={shortBreak.toString()} onValueChange={(value) => setShortBreak(Number(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">5 minutes</SelectItem>
                      <SelectItem value="600">10 minutes</SelectItem>
                      <SelectItem value="900">15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 font-medium">Long Break</span>
                  <Select value={longBreak.toString()} onValueChange={(value) => setLongBreak(Number(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1200">20 minutes</SelectItem>
                      <SelectItem value="1800">30 minutes</SelectItem>
                      <SelectItem value="2400">40 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-4">
                {/* Auto-run Setting */}
                <div className="flex items-center justify-between py-3 px-3 bg-white rounded-lg border mb-3">
                  <div>
                    <Label htmlFor="auto-run" className="text-sm font-medium text-slate-900">
                      Auto-run sessions
                    </Label>
                    <p className="text-xs text-slate-600">Automatically start next session</p>
                  </div>
                  <Switch
                    id="auto-run"
                    checked={autoRun}
                    onCheckedChange={setAutoRun}
                  />
                </div>
                
                {/* Target Cycles Setting */}
                <div className="flex items-center justify-between py-3 px-3 bg-white rounded-lg border">
                  <div>
                    <Label htmlFor="target-cycles" className="text-sm font-medium text-slate-900">
                      Target Cycles
                    </Label>
                    <p className="text-xs text-slate-600">Number of Pomodoro cycles to complete</p>
                  </div>
                  <Input
                    id="target-cycles"
                    type="number"
                    min="1"
                    max="10"
                    value={targetCycles}
                    onChange={(e) => setTargetCycles(Number(e.target.value))}
                    className="w-16 text-center bg-white"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Statistics */}
      <div className="pt-6 border-t border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Today's Progress</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-xl font-bold text-slate-900">{todaysPomodoros}</div>
            <div className="text-xs text-slate-600">Pomodoros</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-xl font-bold text-slate-900">{todaysTasks}</div>
            <div className="text-xs text-slate-600">Tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
