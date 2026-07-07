const LABELS = {
  submitted: "Submitted",
  in_review: "In review",
  in_progress: "In progress",
  resolved: "Resolved",
};

export default function StatusStamp({ status }) {
  return (
    <span className={`case-stamp status-${status}`}>{LABELS[status] || status}</span>
  );
}
