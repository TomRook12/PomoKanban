import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { setupAuth, requireAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
  // Auth routes (only available if Google OAuth is configured)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/api/auth/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/api/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
      (req, res) => {
        // Successful authentication, redirect to home
        res.redirect('/');
      }
    );
  }

  app.get('/api/auth/user', requireAuth, (req, res) => {
    res.json(req.user);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Get all tasks (protected route)
  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const archived = req.query.archived as string || "false";
      const tasks = await storage.getTasks(archived);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Get single task
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // Create task (protected route)
  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid task data", error });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  // Update task (protected route)
  app.patch("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = updateTaskSchema.parse(req.body);
      const task = await storage.updateTask(req.params.id, validatedData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid task data", error });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Delete task (protected route)
  app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Archive task (protected route)
  app.patch("/api/tasks/:id/archive", requireAuth, async (req, res) => {
    try {
      const task = await storage.archiveTask(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to archive task" });
    }
  });

  // Archive all complete tasks (protected route)
  app.patch("/api/tasks/archive-complete", requireAuth, async (req, res) => {
    try {
      const count = await storage.archiveAllComplete();
      res.json({ archivedCount: count });
    } catch (error) {
      res.status(500).json({ message: "Failed to archive complete tasks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
