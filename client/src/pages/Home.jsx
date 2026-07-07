import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container">
      <section className="hero">
        <div>
          <div className="hero-eyebrow">CIVICAI — CASE 000001 AND COUNTING</div>
          <h1>Government services and public issues, handled in plain language.</h1>
          <p>
            Find the right service, file a report on a broken streetlight or a pothole,
            and get a straight answer from an AI companion that&apos;s grounded in what your
            local government actually offers — not generic guesses.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary">Browse services</Link>
            {user ? (
              <Link to="/report" className="btn btn-outline">Report an issue</Link>
            ) : (
              <Link to="/register" className="btn btn-outline">Create an account</Link>
            )}
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-eyebrow" style={{ color: "#b8862f" }}>SAMPLE RECORD</div>
          <h3>CVC-000512 · Streetlight outage</h3>
          <p style={{ color: "#c9cfdb" }}>Reported on Elm Street, near the community park.</p>
          <span className="case-stamp status-in_progress">In progress</span>
        </div>
      </section>

      <div className="pillars">
        <div className="pillar">
          <div className="pillar-index">SERVICES</div>
          <h3>Know what you&apos;re entitled to</h3>
          <p>A searchable directory of documents, permits, and welfare schemes, in plain language.</p>
        </div>
        <div className="pillar">
          <div className="pillar-index">ISSUES</div>
          <h3>Report what needs fixing</h3>
          <p>File a report with a category and location, then track it from submitted to resolved.</p>
        </div>
        <div className="pillar">
          <div className="pillar-index">AI COMPANION</div>
          <h3>Ask, don&apos;t guess</h3>
          <p>Chat with an assistant grounded in this platform&apos;s own services data — no invented offices.</p>
        </div>
      </div>
    </div>
  );
}
