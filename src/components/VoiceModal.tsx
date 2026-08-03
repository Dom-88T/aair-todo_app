// ─── VoiceModal Component ──────────────────────────────────────────────────────
// A bottom-sheet modal that activates when the user taps the mic FAB.
//
// Flow:
//   1. Modal opens → listening starts automatically
//   2. User speaks  → transcript appears in real time
//   3. User taps "Done" (or recording stops) → tasks are split and added
//
// Uses the browser's built-in Web Speech API (SpeechRecognition).
// In a real Expo app this would use expo-speech or react-native-voice.

import { useEffect, useRef, useState } from "react";
import { splitIntoTasks } from "../utils/taskSplitter";

interface Props {
  onAddTasks: (titles: string[]) => void; // called with the parsed task list
  onClose: () => void;
}

// Typed reference to the browser's SpeechRecognition API
// (prefixed in some browsers)
const SpeechRecognitionAPI =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function VoiceModal({ onAddTasks, onClose }: Props) {
  const [transcript, setTranscript] = useState(""); // live transcription text
  const [isListening, setIsListening] = useState(false);
  const [preview, setPreview] = useState<string[]>([]); // tasks that will be created
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Start listening as soon as the modal mounts
  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true; // show partial transcript while speaking
    recognition.continuous = false; // stop after one sentence

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      // Concatenate all recognised segments into one string
      // e.g. "Buy milk" + " and call mom" → "Buy milk and call mom"
      const text = Array.from(event.results as SpeechRecognitionResultList)
        .map((result) => result[0].transcript)
        .join(" ");

      setTranscript(text);
      // Live-preview the task split so the user can see what will be created
      setPreview(splitIntoTasks(text));
    };

    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();

    // Stop listening when the modal closes
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
    // Backdrop — tapping outside closes the modal
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Voice input">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="modal-header">
          <span className="modal-title">Voice Input</span>
          <button className="modal-close" onClick={onClose} aria-label="Close voice input">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="#999" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Mic animation ── */}
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

        {/* ── Live transcript ── */}
        {transcript ? (
          <div className="voice-transcript">
            <p className="voice-transcript-label">You said:</p>
            <p className="voice-transcript-text">"{transcript}"</p>
          </div>
        ) : null}

        {/* ── Task preview ── tasks that will be added */}
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

        {/* ── Browser not supported ── */}
        {!supported && (
          <p className="voice-unsupported">
            Try Chrome or Edge for voice input support.
          </p>
        )}

        {/* ── Actions ── */}
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
