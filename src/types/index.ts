// ─── Task Model ───────────────────────────────────────────────────────────────
// A single to-do item, e.g. { id: "abc123", title: "Buy milk", completed: false }

export interface Task {
  id: string;
  title: string;
  description?: string; // optional note, e.g. "from the organic section"
  completed: boolean;
  createdAt: number; // Unix timestamp in ms
}

// ─── Navigation ───────────────────────────────────────────────────────────────
// The two screens the app can show — mimics React Navigation's stack

export type Screen = "TaskList" | "AddTask";
