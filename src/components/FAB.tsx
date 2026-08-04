interface Props {
  type: "add" | "voice";
  onPress: () => void;
}

export default function FAB({ type, onPress }: Props) {
  return (
    <button
      className={`fab fab-${type}`}
      onClick={onPress}
      aria-label={type === "add" ? "Add new task" : "Voice input"}
    >
      {type === "add" ? (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 4v14M4 11h14"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="8" y="2" width="6" height="10" rx="3" fill="white" />
          <path
            d="M4 11a7 7 0 0014 0"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line x1="11" y1="18" x2="11" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
