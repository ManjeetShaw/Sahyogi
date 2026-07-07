import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";

const SpeechRecognitionAPI =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const speechSupported = Boolean(SpeechRecognitionAPI);
const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

export default function AICompanion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const logRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!speechSupported) return;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  function speak(text) {
    if (!ttsSupported || !voiceReplies) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    api.get("/ai/history").then((res) => {
      const past = res.data.messages.flatMap((m) => [
        { role: "user", content: m.message },
        { role: "assistant", content: m.reply },
      ]);
      setMessages(past);
    });
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");

    const userMessage = { role: "user", content: input };
    const history = messages.slice(-10);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await api.post("/ai/chat", { message: userMessage.content, history });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
      speak(res.data.reply);
    } catch (err) {
      setError(err.response?.data?.message || "The AI companion isn't available right now.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2>AI companion</h2>
      <p className="form-note">
        Ask about services, or describe a problem to find out how to report it.
      </p>
      {ttsSupported && (
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={voiceReplies}
            onChange={(e) => setVoiceReplies(e.target.checked)}
          />
          Read replies aloud
        </label>
      )}
      {error && <div className="form-error">{error}</div>}
      <div className="chat-shell">
        <div className="chat-log" ref={logRef}>
          {messages.length === 0 && (
            <div className="empty-state">
              <p>Try: &ldquo;How do I get a birth certificate?&rdquo; or &ldquo;There&apos;s a pothole outside my house.&rdquo;</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role === "user" ? "user" : "assistant"}`}>
              {m.content}
            </div>
          ))}
          {sending && <div className="chat-bubble assistant">Thinking...</div>}
        </div>
        <form className="chat-input-row" onSubmit={handleSend}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening..." : "Ask a question..."}
            disabled={sending}
          />
          {speechSupported && (
            <button
              type="button"
              className={`btn ${listening ? "btn-danger-outline" : "btn-outline"}`}
              onClick={toggleListening}
              disabled={sending}
              title={listening ? "Stop listening" : "Speak your question"}
            >
              {listening ? "■ Stop" : "🎤"}
            </button>
          )}
          <button className="btn btn-primary" type="submit" disabled={sending}>Send</button>
        </form>
      </div>
    </div>
  );
}
