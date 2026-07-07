import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import IssueCard from "../components/IssueCard.jsx";

const CATEGORIES = ["roads", "sanitation", "water_supply", "electricity", "public_safety", "parks", "other"];
const STATUSES = ["submitted", "in_review", "in_progress", "resolved"];

export default function Issues() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [mine, setMine] = useState(false);
  const [loading, setLoading] = useState(true);

  const canModerate = user?.role === "staff" || user?.role === "admin";

  function load() {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (category) params.category = category;
    if (mine) params.mine = "true";
    api.get("/issues", { params }).then((res) => setIssues(res.data.issues)).finally(() => setLoading(false));
  }

  useEffect(load, [status, category, mine]);

  async function handleStatusChange(id, newStatus) {
    await api.patch(`/issues/${id}/status`, { status: newStatus });
    load();
  }

  async function handleDelete(id) {
    await api.delete(`/issues/${id}`);
    load();
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Public issues</h2>
        <Link to="/report" className="btn btn-gold">Report an issue</Link>
      </div>

      <div className="filters-bar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
          Only mine
        </label>
      </div>

      {loading ? (
        <p>Loading issues...</p>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <h3>No issues match these filters</h3>
          <p>Be the first to report something, or clear a filter to see more.</p>
        </div>
      ) : (
        <div className="item-grid">
          {issues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              canModerate={canModerate}
              onStatusChange={handleStatusChange}
              canDelete={user && (user.id === issue.reportedBy?._id || user.role === "admin")}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
