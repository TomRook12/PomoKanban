import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

type SessionType = "work" | "shortBreak" | "longBreak";

export function usePomodoro() {
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [sessionCount, setSessionCount] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);

  // Timer settings
  const [workDuration, setWorkDuration] = useState(1500); // 25 minutes
  const [shortBreak, setShortBreak] = useState(300); // 5 minutes
  const [longBreak, setLongBreak] = useState(1800); // 30 minutes
  const [autoRun, setAutoRun] = useState(false); // Auto run toggle
  const [targetCycles, setTargetCycles] = useState(4); // Number of pomodoro cycles

  const { toast } = useToast();

  // Initialize timer with current session duration
  useEffect(() => {
    if (sessionType === "work") {
      setTimeRemaining(workDuration);
    } else if (sessionType === "shortBreak") {
      setTimeRemaining(shortBreak);
    } else {
      setTimeRemaining(longBreak);
    }
  }, [sessionType, workDuration, shortBreak, longBreak]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleSessionComplete = useCallback(() => {
    // Play notification sound (if available)
    if (typeof Audio !== "undefined") {
      try {
        const audio = new Audio("/notification.wav");
        audio.play().catch(() => {
          // Fallback to system notification sound or visual notification
          console.log("Audio notification not available");
        });
      } catch (error) {
        console.log("Audio notification failed");
      }
    }

    if (sessionType === "work") {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      setCompletedPomodoros(prev => prev + 1);

      // Check if we've completed all target cycles
      if (currentCycle >= targetCycles && newCount % 4 === 0) {
        // All cycles complete
        setIsActive(false);
        toast({
          title: "All cycles complete!",
          description: `Congratulations! You've completed ${targetCycles} full Pomodoro cycles.`,
        });
        return;
      }

      if (newCount % 4 === 0) {
        // Time for long break and increment cycle
        setSessionType("longBreak");
        setTimeRemaining(longBreak);
        setCurrentCycle(prev => prev + 1);
        toast({
          title: "Time for a long break!",
          description: `You've completed ${newCount} pomodoros. Take a ${longBreak / 60}-minute break.`,
        });
        setSessionCount(0); // Reset after long break
      } else {
        // Time for short break
        setSessionType("shortBreak");
        setTimeRemaining(shortBreak);
        toast({
          title: "Time for a break!",
          description: `You've completed a focus session. Take a ${shortBreak / 60}-minute break.`,
        });
      }

      // Auto-start next session if enabled
      if (autoRun) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } else {
      // Break completed, back to work
      setSessionType("work");
      setTimeRemaining(workDuration);
      toast({
        title: "Break's over!",
        description: "Time to get back to work and stay focused.",
      });

      // Auto-start next session if enabled
      if (autoRun) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }
  }, [sessionType, sessionCount, workDuration, shortBreak, longBreak, autoRun, targetCycles, currentCycle, toast]);

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (sessionType === "work") {
      setTimeRemaining(workDuration);
    } else if (sessionType === "shortBreak") {
      setTimeRemaining(shortBreak);
    } else {
      setTimeRemaining(longBreak);
    }
  }, [sessionType, workDuration, shortBreak, longBreak]);

  // Reset session count when work duration changes
  useEffect(() => {
    if (!isActive) {
      setSessionCount(0);
      setCurrentCycle(1);
    }
  }, [workDuration, isActive]);

  const skipSession = useCallback(() => {
    setIsActive(false);
    
    if (sessionType === "work") {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      
      if (newCount % 4 === 0) {
        setSessionType("longBreak");
        setTimeRemaining(longBreak);
        setCurrentCycle(prev => prev + 1);
        setSessionCount(0);
      } else {
        setSessionType("shortBreak");
        setTimeRemaining(shortBreak);
      }
    } else {
      setSessionType("work");
      setTimeRemaining(workDuration);
    }
  }, [sessionType, sessionCount, workDuration, shortBreak, longBreak]);

  return {
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
    setWorkDuration: (duration: number) => {
      setWorkDuration(duration);
      if (sessionType === "work" && !isActive) {
        setTimeRemaining(duration);
      }
    },
    setShortBreak: (duration: number) => {
      setShortBreak(duration);
      if (sessionType === "shortBreak" && !isActive) {
        setTimeRemaining(duration);
      }
    },
    setLongBreak: (duration: number) => {
      setLongBreak(duration);
      if (sessionType === "longBreak" && !isActive) {
        setTimeRemaining(duration);
      }
    },
    setAutoRun,
    setTargetCycles,
  };
}
