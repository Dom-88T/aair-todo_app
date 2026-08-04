import { useState, useMemo } from "react";
import { Task } from "../types";
import TaskItem from "../components/TaskItem";
import EmptyState from "../components/EmptyState";
import FAB from "../components/FAB";
import VoiceModal from "../components/VoiceModal";

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddMany: (titles: string[]) => void;
  onNavigateToAdd: () => void;
}

export default function TaskListScreen({
  tasks,
  onToggle,
  onDelete,
  onAddMany,
  onNavigateToAdd,
}: Props) {
  const [showVoice, setShowVoice] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;

    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        task.description?.toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const incomplete = filtered.filter((task) => !task.completed);
  const completed = filtered.filter((task) => task.completed);
  const totalCount = tasks.length;
  const doneCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="screen">
      <header className="screen-header">
        <div>
          <h1 className="screen-title">My Tasks</h1>
          <p className="screen-subtitle">
            {totalCount === 0
              ? "Nothing to do yet"
              : `${doneCount} of ${totalCount} completed`}
          </p>
        </div>
      </header>

      {tasks.length > 0 && (
        <div className="search-wrap">
          <svg className="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="#bbb" strokeWidth="1.3" />
            <path d="M10.5 10.5l3 3" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks"
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="task-list">
        {filtered.length === 0 ? (
          search ? (
            <p className="no-results">No tasks match "{search}"</p>
          ) : (
            <EmptyState />
          )
        ) : (
          <>
            {incomplete.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}

            {completed.length > 0 && (
              <>
                <div className="section-divider">
                  <span>Completed · {completed.length}</span>
                </div>
                {completed.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>

      <FAB type="voice" onPress={() => setShowVoice(true)} />
      <FAB type="add" onPress={onNavigateToAdd} />

      {showVoice && (
        <VoiceModal
          onAddTasks={(titles) => {
            onAddMany(titles);
            setShowVoice(false);
          }}
          onClose={() => setShowVoice(false)}
        />
      )}
    </div>
  );
}
