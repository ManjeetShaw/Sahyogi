import { useEffect, useState } from "react";
import api from "../api/axios.js";

const CATEGORIES = [
  "identity_documents",
  "welfare_schemes",
  "permits_licenses",
  "utilities",
  "taxes",
  "other",
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

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
              <span className="category-tag">{s.category.replace("_", " ")}</span>
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
              {s.link && <a href={s.link} target="_blank" rel="noreferrer">Official link ↗</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
