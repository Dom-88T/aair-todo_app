export default function EmptyState() {
  return (
    <div className="empty-state">
      {/*inbox icon */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <rect x="8" y="10" width="32" height="28" rx="3" stroke="#ddd" strokeWidth="1.5" />
        <path d="M8 30h9l3 4h8l3-4h9" stroke="#ddd" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M18 20h12M18 25h8" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <p className="empty-title">No tasks yet</p>
      <p className="empty-subtitle">
        Tap <strong>+</strong> to add a task, or use the mic to speak one.
      </p>
    </div>
  );
}
