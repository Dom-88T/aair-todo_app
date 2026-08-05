import { useState } from "react";
import { Task } from "../types";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false);

  function handleDelete() {
    setDeleting(true);
    setTimeout(() => onDelete(task.id), 250);
  }

  return (
    <div
      className="task-item"
      style={{
        opacity: deleting ? 0 : 1,
        transform: deleting ? "translateX(20px)" : "translateX(0)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <button
        className="task-checkbox"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        aria-pressed={task.completed}
      >
        {task.completed ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#111" />
            <path
              d="M6 11.5L9.5 15 16 8"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#ccc" strokeWidth="1.5" />
          </svg>
        )}
      </button>

      <div className="task-content">
        <span
          className="task-title"
          style={{
            textDecoration: task.completed ? "line-through" : "none",
            color: task.completed ? "#aaa" : "#111",
          }}
        >
          {task.title}
        </span>

        {task.description && (
          <span className="task-description">{task.description}</span>
        )}
      </div>

      <button
        className="task-delete"
        onClick={handleDelete}
        aria-label={`Delete task: ${task.title}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 4h10M6 4V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V4M5.5 7v5M8 7v5M10.5 7v5M4.5 4l.5 9h6l.5-9"
            stroke="#bbb"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
