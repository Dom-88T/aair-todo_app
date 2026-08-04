import { useEffect, useRef, useState } from "react";
import { splitIntoTasks } from "../utils/taskSplitter";

interface Props {
  onAddTasks: (titles: string[]) => void;
  onClose: () => void;
}

const SpeechRecognitionAPI =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function VoiceModal({ onAddTasks, onClose }: Props) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results as SpeechRecognitionResultList)
        .map((result) => result[0].transcript)
        .join(" ");

      setTranscript(text);
      setPreview(splitIntoTasks(text));
    };

    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  function handleDone() {
    recognitionRef.current?.stop();
    const tasks = splitIntoTasks(transcript);
    if (tasks.length > 0) {
      onAddTasks(tasks);
    }
    onClose();
  }

  function handleRetry() {
    setTranscript("");
    setPreview([]);
    recognitionRef.current?.start();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Voice input">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Voice Input</span>
          <button className="modal-close" onClick={onClose} aria-label="Close voice input">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="#999" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="voice-mic-wrap">
          <div className={`voice-mic-ring ${isListening ? "pulse" : ""}`}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="11" y="3" width="10" height="16" rx="5" fill={isListening ? "#111" : "#ccc"} />
              <path
                d="M6 16a10 10 0 0020 0"
                stroke={isListening ? "#111" : "#ccc"}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line x1="16" y1="26" x2="16" y2="30" stroke={isListening ? "#111" : "#ccc"} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="voice-status">
            {!supported
              ? "Speech recognition not supported in this browser."
              : isListening
              ? "Listening…"
              : transcript
              ? "Done listening"
              : "Tap retry to listen again"}
          </p>
        </div>

        {transcript ? (
          <div className="voice-transcript">
            <p className="voice-transcript-label">You said:</p>
            <p className="voice-transcript-text">"{transcript}"</p>
          </div>
        ) : null}

        {preview.length > 0 && (
          <div className="voice-preview">
            <p className="voice-preview-label">
              {preview.length === 1 ? "1 task" : `${preview.length} tasks`} will be added:
            </p>
            <ul className="voice-preview-list">
              {preview.map((task, i) => (
                <li key={i} className="voice-preview-item">
                  <span className="voice-preview-dot" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!supported && (
          <p className="voice-unsupported">
            Try Chrome or Edge for voice input support.
          </p>
        )}

        <div className="modal-actions">
          {supported && !isListening && (
            <button className="btn-secondary" onClick={handleRetry}>
              Retry
            </button>
          )}
          <button
            className="btn-primary"
            onClick={handleDone}
            disabled={!transcript}
          >
            Add {preview.length > 1 ? `${preview.length} Tasks` : "Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
