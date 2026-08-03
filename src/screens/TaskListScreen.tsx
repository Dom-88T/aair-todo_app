// ─── TaskListScreen ─────────────────────────────────────────────────────────────
// The main screen of the app — shows all tasks and the two FABs.
//
// Layout (top → bottom):
//   Header  — title + task count
//   Search  — live filter bar
//   List    — incomplete tasks, then completed tasks, or an EmptyState
//   FABs    — voice mic (left) + add task (right)
//   VoiceModal — shown on top when mic FAB is tapped

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

  // Filter tasks by search query — case-insensitive match on title or description
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }, [tasks, search]);

  // Split into two groups so completed tasks sink to the bottom (like iOS Reminders)
  const incomplete = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  const totalCount = tasks.length;
  const doneCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="screen">
      {/* ── Header ── */}
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

      {/* ── Search bar ── */}
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

      {/* ── Task list ── */}
      <div className="task-list">
        {filtered.length === 0 ? (
          // No results for this search term, or no tasks at all
          search ? (
            <p className="no-results">No tasks match "{search}"</p>
          ) : (
            <EmptyState />
          )
        ) : (
          <>
            {/* Incomplete tasks first */}
            {incomplete.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}

            {/* Completed section header — only shown if there are completed tasks */}
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

      {/* ── FABs ── */}
      {/* Voice mic — bottom left */}
      <FAB type="voice" onPress={() => setShowVoice(true)} />
      {/* Add task — bottom right */}
      <FAB type="add" onPress={onNavigateToAdd} />

      {/* ── Voice modal ── rendered on top of everything */}
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
