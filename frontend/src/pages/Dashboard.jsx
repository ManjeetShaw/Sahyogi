import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import IssueCard from "../components/IssueCard.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [savedServices, setSavedServices] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/issues", { params: { mine: "true" } }),
      api.get("/services/saved"),
      api.get("/ai/history"),
    ])
      .then(([issuesRes, savedRes, chatRes]) => {
        setIssues(issuesRes.data.issues);
        setSavedServices(savedRes.data.services);
        setChats(chatRes.data.messages.slice(-5).reverse());
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleUnsave(id) {
    await api.delete(`/services/${id}/save`);
    setSavedServices((prev) => prev.filter((s) => s._id !== id));
  }

  if (loading) return <div className="container"><p>Loading your dashboard...</p></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h2>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h2>
      </div>

      <section style={{ marginBottom: 32 }}>
        <div className="page-header">
          <h3>Your reported issues ({issues.length})</h3>
          <Link to="/report" className="btn btn-gold">Report an issue</Link>
        </div>
        {issues.length === 0 ? (
          <div className="empty-state">
            <p>You haven&apos;t reported any issues yet.</p>
          </div>
        ) : (
          <div className="item-grid">
            {issues.slice(0, 6).map((issue) => (
              <IssueCard key={issue._id} issue={issue} canModerate={false} canDelete={false} />
            ))}
          </div>
        )}
        {issues.length > 6 && (
          <p className="form-note" style={{ marginTop: 8 }}>
            <Link to="/issues">View all {issues.length} issues →</Link>
          </p>
        )}
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>Saved services ({savedServices.length})</h3>
        {savedServices.length === 0 ? (
          <div className="empty-state">
            <p>No saved services yet. Browse the <Link to="/services">services directory</Link> and tap ☆ Save on anything useful.</p>
          </div>
        ) : (
          <div className="item-grid">
            {savedServices.map((s) => (
              <div className="item-card" key={s._id}>
                <span className="category-tag">{s.category.replace("_", " ")}</span>
                <h3 style={{ margin: 0 }}>{s.title}</h3>
                <p style={{ margin: 0 }}>{s.description}</p>
                <button className="btn btn-danger-outline" onClick={() => handleUnsave(s._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="page-header">
          <h3>Recent AI companion chats</h3>
          <Link to="/companion" className="btn btn-outline">Open AI companion</Link>
        </div>
        {chats.length === 0 ? (
          <div className="empty-state">
            <p>No conversations yet. Ask the AI companion about a service or an issue you want to report.</p>
          </div>
        ) : (
          <div className="item-grid">
            {chats.map((c) => (
              <div className="item-card" key={c._id}>
                <p style={{ margin: 0, fontWeight: 600 }}>{c.message}</p>
                <p className="form-note" style={{ margin: 0 }}>{c.reply}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
