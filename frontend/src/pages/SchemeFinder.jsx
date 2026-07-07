import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function SchemeFinder() {
  const [situation, setSituation] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!situation.trim()) return;
    setError("");
    setLoading(true);
    setRecommendations(null);
    try {
      const res = await api.post("/ai/recommend", { situation });
      setRecommendations(res.data.recommendations);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't get recommendations right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2>Scheme &amp; service finder</h2>
      <p className="form-note">
        Describe your situation in your own words, and we&apos;ll match it against the services
        actually listed on this platform — no guessing at offices or forms that don&apos;t exist here.
      </p>
      <div className="card">
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="situation">Your situation</label>
            <textarea
              id="situation"
              required
              maxLength={1000}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g. I just moved into a new house and need a water connection, and I also want to know if I qualify for any welfare schemes."
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Finding matches..." : "Find matching services"}
          </button>
        </form>
      </div>

      {recommendations && (
        <div style={{ marginTop: 20 }}>
          {recommendations.length === 0 ? (
            <div className="empty-state">
              <h3>No clear matches found</h3>
              <p>Try adding more detail, or browse the full <Link to="/services">services directory</Link>.</p>
            </div>
          ) : (
            <div className="item-grid">
              {recommendations.map(({ service, reason }) => (
                <div className="item-card" key={service._id}>
                  <span className="category-tag">{service.category.replace("_", " ")}</span>
                  <h3 style={{ margin: 0 }}>{service.title}</h3>
                  {reason && <p className="form-note" style={{ margin: 0 }}>{reason}</p>}
                  <Link to="/services">View in services directory →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
