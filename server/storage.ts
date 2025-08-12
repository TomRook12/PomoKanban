import {
  users,
  tasks,
  type User,
  type UpsertUser,
  type Task,
  type UpdateTask,
  type InsertTask,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Task operations
  getTasks(userId: string, archived?: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;
  archiveTask(id: string, userId: string): Promise<Task | undefined>;
  archiveAllComplete(userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Task operations
  async getTasks(userId: string, archived = "false"): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.archived, archived)))
      .orderBy(tasks.createdAt);
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [createdTask] = await db
      .insert(tasks)
      .values({
        ...task,
        archived: "false",
      })
      .returning();
    return createdTask;
  }

  async updateTask(id: string, userId: string, updates: UpdateTask): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return result.rowCount > 0;
  }

  async archiveTask(id: string, userId: string): Promise<Task | undefined> {
    const [archivedTask] = await db
      .update(tasks)
      .set({ archived: "true" })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return archivedTask;
  }

  async archiveAllComplete(userId: string): Promise<number> {
    const result = await db
      .update(tasks)
      .set({ archived: "true" })
      .where(
        and(
          eq(tasks.userId, userId),
          eq(tasks.stage, "complete"),
          eq(tasks.archived, "false")
        )
      );
    return result.rowCount;
  }
}

export const storage = new DatabaseStorage();