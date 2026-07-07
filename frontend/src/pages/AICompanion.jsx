import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";

export default function AICompanion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef(null);

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
            placeholder="Ask a question..."
            disabled={sending}
          />
          <button className="btn btn-primary" type="submit" disabled={sending}>Send</button>
        </form>
      </div>
    </div>
  );
}
