import { useState } from "react";
import { Screen, Task } from "./types";
import { useTasks } from "./hooks/useTasks";
import TaskListScreen from "./screens/TaskListScreen";
import AddTaskScreen from "./screens/AddTaskScreen";

export default function App() {
  const [screen, setScreen] = useState<Screen>("TaskList");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function navigateTo(next: Screen, dir: "forward" | "back" = "forward") {
    setDirection(dir);
    setScreen(next);
  }

  const { tasks, addTask, updateTask, addManyTasks, toggleTask, deleteTask } = useTasks();

  function handleOpenEdit(task: Task) {
    setEditingTask(task);
    navigateTo("EditTask", "forward");
  }

  function handleBackFromEditor() {
    setEditingTask(null);
    navigateTo("TaskList", "back");
  }

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
              onEdit={handleOpenEdit}
              onAddMany={addManyTasks}
              onNavigateToAdd={() => navigateTo("AddTask", "forward")}
            />
          ) : (
            <AddTaskScreen
              mode={screen === "EditTask" ? "edit" : "create"}
              initialTitle={editingTask?.title ?? ""}
              initialDescription={editingTask?.description ?? ""}
              onSave={
                screen === "EditTask" && editingTask
                  ? (title, description) => updateTask(editingTask.id, title, description)
                  : addTask
              }
              onBack={handleBackFromEditor}
            />
          )}
        </div>
      </div>
    </div>
  );
}
