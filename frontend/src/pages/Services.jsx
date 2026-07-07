import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const CATEGORIES = [
  "identity_documents",
  "welfare_schemes",
  "permits_licenses",
  "utilities",
  "taxes",
  "other",
];

export default function Services() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (q) params.q = q;
    api
      .get("/services", { params })
      .then((res) => setServices(res.data.services))
      .finally(() => setLoading(false));
  }, [category, q]);

  useEffect(() => {
    if (!user) return;
    api.get("/services/saved").then((res) => {
      setSavedIds(new Set(res.data.services.map((s) => s._id)));
    });
  }, [user]);

  async function toggleSave(id) {
    if (savedIds.has(id)) {
      await api.delete(`/services/${id}/save`);
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      await api.post(`/services/${id}/save`);
      setSavedIds((prev) => new Set(prev).add(id));
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Government services</h2>
      </div>

      <div className="filters-bar">
        <input
          placeholder="Search services..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <h3>No services found</h3>
          <p>Try a different search term or category, or ask the AI companion for help.</p>
        </div>
      ) : (
        <div className="item-grid">
          {services.map((s) => (
            <div className="item-card" key={s._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span className="category-tag">{s.category.replace("_", " ")}</span>
                {user && (
                  <button
                    className="btn btn-outline"
                    style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                    onClick={() => toggleSave(s._id)}
                    title={savedIds.has(s._id) ? "Remove from saved" : "Save for later"}
                  >
                    {savedIds.has(s._id) ? "★ Saved" : "☆ Save"}
                  </button>
                )}
              </div>
              <h3 style={{ margin: 0 }}>{s.title}</h3>
              <p style={{ margin: 0 }}>{s.description}</p>
              <p className="form-note" style={{ margin: 0 }}><strong>How to apply:</strong> {s.howToApply}</p>
              {s.eligibility && (
                <p className="form-note" style={{ margin: 0 }}><strong>Eligibility:</strong> {s.eligibility}</p>
              )}
              {s.requiredDocuments?.length > 0 && (
                <div className="form-note" style={{ margin: 0 }}>
                  <strong>Required documents:</strong>
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                    {s.requiredDocuments.map((doc, i) => <li key={i}>{doc}</li>)}
                  </ul>
                </div>
              )}
              {s.fees && (
                <p className="form-note" style={{ margin: 0 }}><strong>Fees:</strong> {s.fees}</p>
              )}
              {s.commonRejectionReasons?.length > 0 && (
                <div className="form-note" style={{ margin: 0 }}>
                  <strong>Common rejection reasons:</strong>
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                    {s.commonRejectionReasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {s.link && <a href={s.link} target="_blank" rel="noreferrer">Official link ↗</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
