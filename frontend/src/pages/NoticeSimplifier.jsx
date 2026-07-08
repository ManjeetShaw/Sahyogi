import { useState } from "react";
import api from "../api/axios.js";

export default function NoticeSimplifier() {
  const [noticeText, setNoticeText] = useState("");
  const [simplified, setSimplified] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!noticeText.trim()) return;
    setError("");
    setLoading(true);
    setSimplified("");
    try {
      const res = await api.post("/ai/simplify", { noticeText });
      setSimplified(res.data.simplified);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't simplify this notice right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2>Government notice simplifier</h2>
      <p className="form-note">
        Paste the text of an official notice, letter, or form below, and get a plain-language
        summary of what it means and what you need to do.
      </p>
      <div className="card">
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="noticeText">Notice text</label>
            <textarea
              id="noticeText"
              required
              maxLength={6000}
              rows={8}
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              placeholder="Paste the full text of the notice here..."
            />
            <span className="form-note">{noticeText.length}/6000 characters</span>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Simplifying..." : "Simplify this notice"}
          </button>
        </form>
      </div>

      {simplified && (
        <div className="card" style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          {simplified}
        </div>
      )}
    </div>
  );
}
