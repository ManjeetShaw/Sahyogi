import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty-state">
        <h2>Page not found</h2>
        <p>The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </div>
  );
}
