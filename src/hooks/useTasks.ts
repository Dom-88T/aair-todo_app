import { useState, useEffect, useCallback } from "react";
import { Task } from "../types";

const STORAGE_KEY = "todoapp_tasks";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeText(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    return;
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(tasks);
  }, [tasks]);

  const addTask = useCallback((title: string, description?: string): boolean => {
    const normalizedTitle = normalizeText(title);
    const normalizedDescription = normalizeText(description);

    const alreadyExists = tasks.some(
      (task) =>
        normalizeText(task.title) === normalizedTitle &&
        normalizeText(task.description) === normalizedDescription
    );

    if (alreadyExists) {
      return false;
    }

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description?.trim() || undefined,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return true;
  }, [tasks]);

  const addManyTasks = useCallback((titles: string[]) => {
    const newTasks: Task[] = titles.map((title) => ({
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    }));

    setTasks((prev) => [...newTasks, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, title: string, description?: string): boolean => {
    const normalizedTitle = normalizeText(title);
    const normalizedDescription = normalizeText(description);

    const duplicateExists = tasks.some(
      (task) =>
        task.id !== id &&
        normalizeText(task.title) === normalizedTitle &&
        normalizeText(task.description) === normalizedDescription
    );

    if (duplicateExists) {
      return false;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: title.trim(),
              description: description?.trim() || undefined,
            }
          : task
      )
    );

    return true;
  }, [tasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return { tasks, addTask, updateTask, addManyTasks, toggleTask, deleteTask };
}
