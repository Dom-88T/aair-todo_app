import { useState } from "react";
import { Screen } from "./types";
import { useTasks } from "./hooks/useTasks";
import TaskListScreen from "./screens/TaskListScreen";
import AddTaskScreen from "./screens/AddTaskScreen";

export default function App() {
  const [screen, setScreen] = useState<Screen>("TaskList");
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  function navigateTo(next: Screen, dir: "forward" | "back" = "forward") {
    setDirection(dir);
    setScreen(next);
  }

  const { tasks, addTask, addManyTasks, toggleTask, deleteTask } = useTasks();

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div
          className="phone-screen"
          style={{
            animation: `slideIn-${direction} 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both`,
          }}
          key={screen}
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
    </div>
  );
}
