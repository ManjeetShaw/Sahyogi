import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const CATEGORIES = [
  "roads",
  "sanitation",
  "water_supply",
  "electricity",
  "public_safety",
  "parks",
  "other",
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/issues", {
        title,
        description,
        category,
        location: { address },
        imageUrl,
      });
      navigate("/issues");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <h2>Report an issue</h2>
      <div className="card">
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" required maxLength={140} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Pothole on Elm Street" />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" required maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's going on, and how long has it been like this?" />
          </div>
          <div className="field">
            <label htmlFor="address">Location (address or landmark)</label>
            <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="imageUrl">Photo URL (optional)</label>
            <input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            <span className="form-note">Paste a link to a photo if you have one hosted online.</span>
          </div>
          <button className="btn btn-gold" type="submit" disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Submitting..." : "Submit report"}
          </button>
        </form>
      </div>
    </div>
  );
}
