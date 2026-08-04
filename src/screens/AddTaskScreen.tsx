// ─── AddTaskScreen ──────────────────────────────────────────────────────────────
// A form screen where the user types a new task title and optional description.
// Equivalent to a "New Reminder" screen in iOS Reminders or any todo app.
//
// Navigation: tapping "Back" returns to TaskListScreen without saving.
//             tapping "Save" validates, saves, and goes back.

import { useState, useRef, useEffect } from "react";

interface Props {
  onSave: (title: string, description?: string) => boolean;
  onBack: () => void;
}

export default function AddTaskScreen({ onSave, onBack }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(""); // shown when title is blank

  // Auto-focus the title field when the screen appears
  const titleRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) {
      // Edge case: user tried to save an empty task — e.g. just pressed Save
      setError("Task title is required.");
      return;
    }

    const saved = onSave(trimmed, description.trim() || undefined);
    if (!saved) {
      setError("This exact task already exists.");
      return;
    }

    setError("");
    onBack(); // return to the list after saving
  }

  // Allow saving with Enter key from the title field (keyboard shortcut)
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <div className="screen">
      {/* ── Navigation bar ── */}
      <header className="screen-header screen-header--nav">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M11 4L6 9l5 5"
              stroke="#111"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back</span>
        </button>

        <h1 className="screen-title screen-title--center">New Task</h1>

        <button
          className="save-btn"
          onClick={handleSave}
          disabled={!title.trim()}
          aria-label="Save task"
        >
          Save
        </button>
      </header>

      {/* ── Form ── */}
      <div className="form-body">
        {/* Title field — the only required field */}
        <div className="form-group">
          <label className="form-label" htmlFor="task-title">
            Title <span className="form-required">*</span>
          </label>
          <input
            ref={titleRef}
            id="task-title"
            className={`form-input ${error ? "form-input--error" : ""}`}
            type="text"
            placeholder="e.g. Buy groceries"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(""); // clear error as user types
            }}
            onKeyDown={handleKeyDown}
            maxLength={120}
            aria-required="true"
            aria-describedby={error ? "title-error" : undefined}
          />
          {/* Character count — useful for longer titles */}
          <span className="form-char-count">{title.length}/120</span>
          {error && (
            <p id="title-error" className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Description field — optional note */}
        <div className="form-group">
          <label className="form-label" htmlFor="task-desc">
            Description <span className="form-optional">(optional)</span>
          </label>
          <textarea
            id="task-desc"
            className="form-textarea"
            placeholder="e.g. From the organic section, before 6pm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <span className="form-char-count">{description.length}/500</span>
        </div>

        {/* Tips — gives the user a sense of how the voice feature works too */}
        <p className="form-tip">
          Tip: you can also use the mic button on the list screen to add multiple
          tasks at once by speaking naturally.
        </p>
      </div>
    </div>
  );
}
