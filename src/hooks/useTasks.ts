// ─── useTasks Hook ─────────────────────────────────────────────────────────────
// Central state for the to-do list.  Persists to localStorage so tasks survive
// page refreshes — equivalent to AsyncStorage in a real Expo app.
//
// Usage:
//   const { tasks, addTask, toggleTask, deleteTask } = useTasks();

import { useState, useEffect, useCallback } from "react";
import { Task } from "../types";

// The localStorage key — like an AsyncStorage key name, e.g. "@TodoApp:tasks"
const STORAGE_KEY = "todoapp_tasks";

/**
 * Generates a short unique id.
 * Real apps might use `uuid`, but a timestamp + random suffix works fine here.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Loads tasks from localStorage. Returns [] if nothing is stored yet.
 */
function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    // Corrupt data — start fresh rather than crashing
    return [];
  }
}

/**
 * Writes the current task list to localStorage.
 * Called every time tasks change so they're always up to date.
 */
function saveToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage might be full in rare cases; fail silently
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadFromStorage);

  // Persist to localStorage whenever the task list changes
  useEffect(() => {
    saveToStorage(tasks);
  }, [tasks]);

  /**
   * Adds one new task.
   * e.g. addTask("Buy milk", "from the organic section")
   */
  const addTask = useCallback((title: string, description?: string) => {
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description?.trim() || undefined,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]); // newest at top, like a real todo app
  }, []);

  /**
   * Adds multiple tasks at once — used after voice input splits a sentence.
   * e.g. addManyTasks(["Buy milk", "Call mom"])
   */
  const addManyTasks = useCallback((titles: string[]) => {
    const newTasks: Task[] = titles.map((title) => ({
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    }));
    setTasks((prev) => [...newTasks, ...prev]);
  }, []);

  /**
   * Flips a task between done and not done.
   * e.g. tapping a checkbox on "Walk the dog"
   */
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  /**
   * Permanently removes a task.
   * e.g. swiping left or tapping the trash icon on "Call dentist"
   */
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return { tasks, addTask, addManyTasks, toggleTask, deleteTask };
}
