import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Services from "./pages/Services.jsx";
import Issues from "./pages/Issues.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import AICompanion from "./pages/AICompanion.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SchemeFinder from "./pages/SchemeFinder.jsx";
import NoticeSimplifier from "./pages/NoticeSimplifier.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/issues"
            element={
              <ProtectedRoute>
                <Issues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companion"
            element={
              <ProtectedRoute>
                <AICompanion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scheme-finder"
            element={
              <ProtectedRoute>
                <SchemeFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notice-simplifier"
            element={
              <ProtectedRoute>
                <NoticeSimplifier />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">Sahyogi — an open, community-driven civic platform.</div>
      </footer>
    </div>
  );
}
