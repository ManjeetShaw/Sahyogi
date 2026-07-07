import StatusStamp from "./StatusStamp.jsx";

const STATUS_OPTIONS = ["submitted", "in_review", "in_progress", "resolved"];

export default function IssueCard({ issue, canModerate, onStatusChange, onDelete, canDelete }) {
  const caseNumber = `CVC-${issue._id.slice(-6).toUpperCase()}`;

  return (
    <div className="item-card">
      <div className="item-card-top">
        <span className="category-tag">{issue.category.replace("_", " ")}</span>
        <StatusStamp status={issue.status} />
      </div>
      <h3 style={{ margin: 0 }}>{issue.title}</h3>
      <p style={{ margin: 0 }}>{issue.description}</p>
      {issue.location?.address && (
        <p className="form-note" style={{ margin: 0 }}>📍 {issue.location.address}</p>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="case-number">{caseNumber}</span>
        <span className="form-note">Reported by {issue.reportedBy?.name || "a citizen"}</span>
      </div>

      {canModerate && (
        <div className="status-select">
          <label htmlFor={`status-${issue._id}`} style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Update status
          </label>
          <select
            id={`status-${issue._id}`}
            value={issue.status}
            onChange={(e) => onStatusChange(issue._id, e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
        </div>
      )}

      {canDelete && (
        <button className="btn btn-danger-outline" onClick={() => onDelete(issue._id)}>
          Delete
        </button>
      )}
    </div>
  );
}
