export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
}

export type Screen = "TaskList" | "AddTask";
