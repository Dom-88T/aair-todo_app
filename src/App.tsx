// ─── App ────────────────────────────────────────────────────────────────────────
// Root component — owns navigation state and task state.
//
// Navigation model: a simple "currentScreen" string that mimics React Navigation's
// Stack.Navigator in a real Expo app. No router library needed for two screens.
//
// Task data flows down from here to the screens via props (lifted state pattern),
// keeping each screen focused on presentation rather than data management.

import { useState } from "react";
import { Screen } from "./types";
import { useTasks } from "./hooks/useTasks";
import TaskListScreen from "./screens/TaskListScreen";
import AddTaskScreen from "./screens/AddTaskScreen";

export default function App() {
  // ── Navigation ──
  // Mirrors React Navigation's useNavigation() — a screen name plus an optional
  // "push" animation direction ("forward" | "back")
  const [screen, setScreen] = useState<Screen>("TaskList");
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  function navigateTo(next: Screen, dir: "forward" | "back" = "forward") {
    setDirection(dir);
    setScreen(next);
  }

  // ── Task data ──
  const { tasks, addTask, addManyTasks, toggleTask, deleteTask } = useTasks();

  // ── Phone frame wrapper ──
  // On desktop we render inside a phone-shaped frame so the app looks exactly
  // like it would on a real device — just like Expo Go's web preview.
  return (
    <div className="app-shell">
      <div className="phone-frame">
        {/* Slide transition layer — direction determines which way the new screen enters */}
        <div
          className="phone-screen"
          style={{
            // "forward" push slides new screen in from the right (standard iOS nav)
            // "back"   pop slides it in from the left
            animation: `slideIn-${direction} 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both`,
          }}
          key={screen} // remount the animation when screen changes
        >
          {screen === "TaskList" ? (
            <TaskListScreen
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onAddMany={addManyTasks}
              onNavigateToAdd={() => navigateTo("AddTask", "forward")}
            />
          ) : (
            <AddTaskScreen
              onSave={addTask}
              onBack={() => navigateTo("TaskList", "back")}
            />
          )}
        </div>
      </div>

      {/* Desktop label below the phone — contextual info for reviewers */}
      <p className="desktop-label">
        To-Do App · React + Vite · localStorage persistence
      </p>
    </div>
  );
}
