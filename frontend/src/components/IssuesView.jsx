import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { issuesApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import ReportIssueModal from './ReportIssueModal.jsx';

const ISSUE_CATEGORIES = [
  'All',
  'Roads',
  'Sanitation',
  'Water Supply',
  'Electricity',
  'Public Safety',
  'Parks',
  'Other'
];

const ISSUE_STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' }
];

export default function IssuesView({ onOpenCompanionWithIssue }) {
  const { user, showToast } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterMine, setFilterMine] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedIssueDetail, setSelectedIssueDetail] = useState(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await issuesApi.getIssues({
        status: selectedStatus,
        category: selectedCategory === 'All' ? undefined : selectedCategory.toLowerCase().replace(' ', '_'),
        mine: filterMine
      });
      setIssues(data || []);
    } catch {
      showToast('Error loading community issues', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [selectedStatus, selectedCategory, filterMine]);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await issuesApi.updateIssueStatus(issueId, newStatus);
      showToast(`Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
      fetchIssues();
    } catch (err) {
      showToast(err.message || 'Permission denied or error updating status', 'error');
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this grievance report?')) return;
    try {
      await issuesApi.deleteIssue(issueId);
      showToast('Issue report deleted', 'info');
      fetchIssues();
    } catch (err) {
      showToast(err.message || 'Failed to delete issue', 'error');
    }
  };

  // Helper for human-readable timestamps
  const getRelativeTime = (isoString) => {
    if (!isoString) return 'Recently';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'in_progress':
        return 'status-in_progress border px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider bg-[#191c22]';
      case 'in_review':
        return 'status-in_review border px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider bg-[#191c22]';
      case 'resolved':
        return 'status-resolved border px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider bg-[#191c22]';
      case 'submitted':
      default:
        return 'status-submitted border px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider bg-[#191c22]';
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 pt-4 pb-16">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-['Sora'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#ffdca1] mb-2">
            Community Voice
          </h1>
          <p className="font-['Geist'] text-base sm:text-lg text-[#d5c4ab] max-w-2xl leading-relaxed">
            Track and report local infrastructure and public space issues. Together we build a better environment.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="btn-primary font-mono text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,184,0,0.3)] hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>Report New Issue</span>
        </button>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Map & Filters Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Live Map Preview Panel */}
          <div className="glass-panel rounded-2xl overflow-hidden p-1 flex flex-col border border-[#514532]/40">
            <div className="px-4 py-3 border-b border-[#514532]/40 flex justify-between items-center bg-[#10131a]/60">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#d5c4ab] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"></span>
                <span>Live Map</span>
              </h3>
              <span className="material-symbols-outlined text-[#d5c4ab] text-[18px]">
                map
              </span>
            </div>

            <div
              className="relative w-full h-[260px] bg-[#191c22] rounded-b-xl overflow-hidden group cursor-crosshair"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcZFwv8EnzElRaoPdZV83L_js07gfvR4o3P39kKvztlNaa2uh9DBoDTe_o32Zy_gfjyoW-IKC9Hj9OsCs95Bb5fvYJvjKiWbDiK0na_u5L7tHUrm2aIR76ICI4eJrN39Vl0eqY1BHUu8lIMq3b76D3Ob2O6BrUVxabSujVoKspOYFc9UcADNYnUKX1dSBDdq06URjaSH38zek4sRf2r59Yogm0y1nh1mWIq1H8y6W4BXh8RqyiIA_0fg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay Dark Tint */}
              <div className="absolute inset-0 bg-[#0b0e14]/40 group-hover:bg-[#0b0e14]/20 transition-all pointer-events-none" />

              {/* Simulated Glowing Map Markers matching issues */}
              <button
                onClick={() => setSelectedCategory('Roads')}
                className="absolute top-1/4 left-1/3 p-1 rounded-full group/pin cursor-pointer focus:outline-none"
                title="Pothole on Main St (Roads)"
              >
                <div className="w-3.5 h-3.5 bg-[#FFB800] rounded-full shadow-[0_0_12px_#ffb800] animate-pulse" />
                <div className="hidden group-hover/pin:block absolute -top-8 left-1/2 -translate-x-1/2 bg-[#10131a] border border-[#FFB800] text-[10px] font-mono text-[#ffdca1] px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-20">
                  Pothole (Main St)
                </div>
              </button>

              <button
                onClick={() => setSelectedCategory('Water Supply')}
                className="absolute top-1/2 left-2/3 p-1 rounded-full group/pin cursor-pointer focus:outline-none"
                title="Low Water Pressure (Sector 4)"
              >
                <div
                  className="w-3.5 h-3.5 bg-[#FFB800] rounded-full shadow-[0_0_12px_#ffb800] animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                />
                <div className="hidden group-hover/pin:block absolute -top-8 left-1/2 -translate-x-1/2 bg-[#10131a] border border-[#FFB800] text-[10px] font-mono text-[#ffdca1] px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-20">
                  Water Supply (Sector 4)
                </div>
              </button>

              <button
                onClick={() => setSelectedCategory('Electricity')}
                className="absolute bottom-1/4 left-1/2 p-1 rounded-full group/pin cursor-pointer focus:outline-none"
                title="Streetlights (Park Ave)"
              >
                <div
                  className="w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399] animate-pulse"
                  style={{ animationDelay: '1s' }}
                />
                <div className="hidden group-hover/pin:block absolute -top-8 left-1/2 -translate-x-1/2 bg-[#10131a] border border-emerald-400 text-[10px] font-mono text-emerald-200 px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-20">
                  Streetlights (Park Ave)
                </div>
              </button>

              <div className="absolute bottom-2 right-2 bg-[#10131a]/90 backdrop-blur px-2.5 py-1 rounded font-mono text-[10px] text-[#ffdca1] border border-[#514532]">
                Interactive City Grid
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5 border border-[#514532]/40">
            <div className="flex justify-between items-center pb-2 border-b border-[#514532]/30">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#d5c4ab]">
                Filters
              </h3>
              <span className="material-symbols-outlined text-[#d5c4ab] text-[18px]">
                tune
              </span>
            </div>

            {/* Status Selector */}
            <div>
              <label className="font-mono text-xs text-[#d5c4ab] block mb-2 uppercase tracking-wider">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] font-['Geist'] text-sm focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] outline-none cursor-pointer"
              >
                {ISSUE_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector Pills */}
            <div>
              <label className="font-mono text-xs text-[#d5c4ab] block mb-2 uppercase tracking-wider">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {ISSUE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full font-mono text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border border-[#FFB800] text-[#FFB800] bg-[#FFB800]/15 font-semibold shadow-[0_0_10px_rgba(255,184,0,0.15)]'
                          : 'border border-[#514532]/60 text-[#d5c4ab] hover:border-[#FFB800]/50 hover:text-[#ffdca1]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* My Reported Issues Toggle */}
            <div className="pt-3 border-t border-[#514532]/30 flex items-center justify-between">
              <span className="font-mono text-xs text-[#d5c4ab]">
                Only My Submissions
              </span>
              <button
                onClick={() => setFilterMine(!filterMine)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  filterMine ? 'bg-[#FFB800]' : 'bg-[#191c22] border border-[#514532]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform ${
                    filterMine
                      ? 'translate-x-7 bg-[#10131a]'
                      : 'translate-x-1 bg-[#9e8f78]'
                  }`}
                />
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Issue List */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="glass-panel rounded-2xl h-44 animate-pulse bg-[#191c22]/50 border border-[#514532]/20"
                />
              ))}
            </div>
          ) : issues.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center border border-[#514532]/40">
              <span className="material-symbols-outlined text-5xl text-[#9e8f78] mb-3">
                report_off
              </span>
              <h3 className="font-['Sora'] text-lg font-bold text-[#ffdca1] mb-1">
                No issues reported in this view
              </h3>
              <p className="font-['Geist'] text-sm text-[#d5c4ab] max-w-md mb-6">
                {filterMine
                  ? "You have not submitted any grievance reports under these filter parameters."
                  : "All municipal complaints in this category have been resolved or none have been logged yet."}
              </p>
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedCategory('All');
                  setFilterMine(false);
                }}
                className="btn-secondary px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            issues.map((issue) => {
              const canChangeStatus = user?.role === 'staff' || user?.role === 'admin';
              const canDelete =
                user?.role === 'admin' ||
                (user && (issue.reportedBy?._id === user.id || issue.reportedBy?.name === user.name));

              return (
                <motion.article
                  key={issue._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedIssueDetail(issue)}
                  className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-5 hover:border-[#FFB800]/40 transition-all group cursor-pointer relative overflow-hidden bg-[#10131a]/60 border border-[#514532]/30"
                >
                  {/* Top-Left Ambient Highlight Gradients */}
                  <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-[#FFB800]/60 to-transparent pointer-events-none" />
                  <div className="absolute top-0 left-0 w-1 h-20 bg-gradient-to-b from-[#FFB800]/60 to-transparent pointer-events-none" />

                  {/* Thumbnail / Image Preview */}
                  <div className="w-full md:w-48 h-36 rounded-xl bg-[#191c22] shrink-0 overflow-hidden relative flex items-center justify-center border border-[#514532]/40">
                    {issue.imageUrl ? (
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="object-cover w-full h-full opacity-85 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-[#9e8f78]">
                        <span className="material-symbols-outlined text-4xl">
                          image_not_supported
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider">
                          No Photo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <span className="font-mono text-xs text-[#9e8f78] uppercase tracking-wider font-medium">
                          {issue.category.replace('_', ' ')}
                        </span>
                        <span className={getStatusBadgeClass(issue.status)}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="font-['Sora'] text-lg sm:text-xl font-bold text-[#ffdca1] group-hover:text-[#FFB800] transition-colors mb-2">
                        {issue.title}
                      </h3>

                      <p className="font-['Geist'] text-sm text-[#d5c4ab] line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>

                      {issue.location?.address && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-[#9e8f78] font-mono truncate">
                          <span className="material-symbols-outlined text-sm text-[#FFB800]">
                            location_on
                          </span>
                          <span className="truncate">{issue.location.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata & Controls */}
                    <div className="flex flex-wrap justify-between items-end gap-3 mt-4 pt-3 border-t border-[#514532]/20">
                      <div className="flex items-center gap-2 text-[#d5c4ab] font-mono text-xs">
                        <span className="material-symbols-outlined text-sm text-[#9e8f78]">
                          person
                        </span>
                        <span>
                          Reported by{' '}
                          <strong className="text-[#ffdca1]">
                            {issue.reportedBy?.name || 'Citizen'}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-[#9e8f78] font-mono text-xs">
                          {getRelativeTime(issue.createdAt)}
                        </div>

                        {/* Staff / Admin Inline Status Dropdown */}
                        {canChangeStatus && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1"
                          >
                            <select
                              value={issue.status}
                              onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                              className="bg-[#191c22] border border-[#FFB800]/50 rounded text-[11px] font-mono text-[#FFB800] p-1 focus:outline-none"
                              title="Update Status (Staff/Admin)"
                            >
                              <option value="submitted">Submitted</option>
                              <option value="in_review">In Review</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        )}

                        {/* Delete Button */}
                        {canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteIssue(issue._id);
                            }}
                            className="text-[#9e8f78] hover:text-red-400 transition-colors p-1"
                            title="Delete Grievance Report"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </section>
      </div>

      {/* Report New Issue Modal */}
      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onIssueCreated={fetchIssues}
      />

      {/* Selected Issue Detail Modal */}
      {selectedIssueDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e14]/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-[#514532] shadow-2xl p-6 sm:p-8 bg-[#10131a] my-8 max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-start border-b border-[#514532]/40 pb-4 mb-4">
              <div>
                <span className="font-mono text-xs text-[#9e8f78] uppercase tracking-wider">
                  Grievance Record #{selectedIssueDetail._id}
                </span>
                <h3 className="font-['Sora'] text-2xl font-bold text-[#ffdca1] mt-1">
                  {selectedIssueDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIssueDetail(null)}
                className="text-[#9e8f78] hover:text-[#ffdca1]"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-4 font-['Geist'] text-sm text-[#e1e2eb]">
              {selectedIssueDetail.imageUrl && (
                <div className="w-full h-56 rounded-xl overflow-hidden bg-[#191c22] border border-[#514532]">
                  <img
                    src={selectedIssueDetail.imageUrl}
                    alt={selectedIssueDetail.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <span className={getStatusBadgeClass(selectedIssueDetail.status)}>
                  {selectedIssueDetail.status.replace('_', ' ')}
                </span>
                <span className="font-mono text-xs text-[#d5c4ab] uppercase">
                  Category: {selectedIssueDetail.category.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h4 className="font-mono text-xs text-[#9e8f78] uppercase tracking-wider mb-1">
                  Description
                </h4>
                <p className="p-4 rounded-xl bg-[#191c22] border border-[#514532]/30 text-[#d5c4ab] leading-relaxed">
                  {selectedIssueDetail.description}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-xs text-[#9e8f78] uppercase tracking-wider mb-1">
                  Location
                </h4>
                <p className="p-3 rounded-xl bg-[#191c22] border border-[#514532]/30 text-[#ffdca1] font-mono text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#FFB800]">
                    location_on
                  </span>
                  <span>
                    {selectedIssueDetail.location?.address || 'Municipal Zone'} (Lat:{' '}
                    {selectedIssueDetail.location?.lat || '40.71'}, Lng:{' '}
                    {selectedIssueDetail.location?.lng || '-74.00'})
                  </span>
                </p>
              </div>

              {/* Status History */}
              {selectedIssueDetail.statusHistory && (
                <div>
                  <h4 className="font-mono text-xs text-[#9e8f78] uppercase tracking-wider mb-2">
                    Official Audit Trail
                  </h4>
                  <div className="space-y-2">
                    {selectedIssueDetail.statusHistory.map((hist, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#191c22]/50 border border-[#514532]/30 font-mono text-xs"
                      >
                        <span className="text-[#ffdca1] uppercase font-bold">
                          {hist.status.replace('_', ' ')}
                        </span>
                        <span className="text-[#9e8f78]">
                          {new Date(hist.changedAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#514532]/40 flex justify-between items-center">
              <button
                onClick={() => {
                  const issueToPass = selectedIssueDetail;
                  setSelectedIssueDetail(null);
                  if (onOpenCompanionWithIssue) onOpenCompanionWithIssue(issueToPass);
                }}
                className="btn-secondary px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                <span>Ask AI About This Grievance</span>
              </button>

              <button
                onClick={() => setSelectedIssueDetail(null)}
                className="btn-primary px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
