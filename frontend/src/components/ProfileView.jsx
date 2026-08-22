import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { servicesApi, issuesApi, aiApi } from '../api/client.js';

export default function ProfileView({ setActiveTab, onSelectService }) {
  const { user, switchRole, logout, setAuthModalOpen, setAuthMode, savedServiceIds, toggleSaveService } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('bookmarks'); // 'bookmarks' | 'issues' | 'ai_sessions'
  const [savedServices, setSavedServices] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [aiSessions, setAiSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const [servicesData, issuesData, historyData] = await Promise.all([
          servicesApi.getSavedServices(),
          issuesApi.getIssues({ mine: true }),
          aiApi.getHistory()
        ]);
        setSavedServices(servicesData || []);
        setMyIssues(issuesData || []);
        setAiSessions(historyData || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [savedServiceIds, user]);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 pt-4 pb-16">
      {/* Profile Header Banner */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#514532]/50 mb-8 relative overflow-hidden bg-[#10131a]/80">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#191c22] border-2 border-[#FFB800]/60 flex items-center justify-center text-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.25)]">
              <span className="material-symbols-outlined text-3xl sm:text-4xl">
                account_circle
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-['Sora'] text-2xl sm:text-3xl font-bold text-[#ffdca1]">
                  {user?.name || 'Citizen User'}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-[#FFB800]/20 border border-[#FFB800]/60 font-mono text-xs text-[#ffdca1] uppercase font-bold">
                  {user?.role || 'citizen'}
                </span>
              </div>
              <p className="font-mono text-xs text-[#9e8f78]">
                {user?.email || 'citizen@sahyogi.gov'} • ID: {user?.id || 'usr_citizen'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Switch Role Buttons */}
            <div className="bg-[#191c22] p-1 rounded-xl border border-[#514532] flex items-center gap-1 font-mono text-xs">
              <span className="text-[10px] text-[#9e8f78] px-2">Role:</span>
              <button
                onClick={() => switchRole('citizen')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  user?.role === 'citizen' ? 'bg-[#FFB800] text-[#10131a] font-bold' : 'text-[#d5c4ab]'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => switchRole('staff')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  user?.role === 'staff' ? 'bg-[#FFB800] text-[#10131a] font-bold' : 'text-[#d5c4ab]'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  user?.role === 'admin' ? 'bg-[#FFB800] text-[#10131a] font-bold' : 'text-[#d5c4ab]'
                }`}
              >
                Admin
              </button>
            </div>

            <button
              onClick={logout}
              className="btn-secondary px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-red-300 border-red-900/50 hover:bg-red-950/40"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-[#514532]/40 mb-6 gap-6 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`pb-3 uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'bookmarks'
              ? 'text-[#FFB800] border-b-2 border-[#FFB800] font-bold'
              : 'text-[#d5c4ab] hover:text-[#ffdca1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">bookmark</span>
          <span>Saved Bookmarks ({savedServices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('issues')}
          className={`pb-3 uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'issues'
              ? 'text-[#FFB800] border-b-2 border-[#FFB800] font-bold'
              : 'text-[#d5c4ab] hover:text-[#ffdca1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">report</span>
          <span>My Reported Grievances ({myIssues.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai_sessions')}
          className={`pb-3 uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'ai_sessions'
              ? 'text-[#FFB800] border-b-2 border-[#FFB800] font-bold'
              : 'text-[#d5c4ab] hover:text-[#ffdca1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">smart_toy</span>
          <span>AI Interaction Logs</span>
        </button>
      </div>

      {/* Sub Tab Contents */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel h-28 rounded-xl animate-pulse bg-[#191c22]/40 border border-[#514532]/20" />
          ))}
        </div>
      ) : activeSubTab === 'bookmarks' ? (
        <div>
          {savedServices.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center justify-center border border-[#514532]/40">
              <span className="material-symbols-outlined text-5xl text-[#9e8f78] mb-3">
                bookmark_border
              </span>
              <h3 className="font-['Sora'] text-lg font-bold text-[#ffdca1] mb-2">
                No Bookmarked Services Yet
              </h3>
              <p className="font-['Geist'] text-sm text-[#d5c4ab] max-w-md mb-6">
                Explore the public service catalog and bookmark essential schemes for quick access.
              </p>
              <button
                onClick={() => setActiveTab('services')}
                className="btn-primary px-6 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider"
              >
                Browse Services Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedServices.map((service) => (
                <div
                  key={service._id}
                  className="glass-card p-6 rounded-2xl border border-[#514532]/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 rounded bg-[#191c22] font-mono text-[10px] text-[#FFB800] uppercase">
                        {service.category}
                      </span>
                      <button
                        onClick={() => toggleSaveService(service._id)}
                        className="text-[#FFB800] hover:text-red-400 p-1"
                        title="Remove Bookmark"
                      >
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                          bookmark
                        </span>
                      </button>
                    </div>
                    <h3 className="font-['Sora'] text-lg font-bold text-[#ffdca1] mb-2">
                      {service.title}
                    </h3>
                    <p className="font-['Geist'] text-xs text-[#d5c4ab] line-clamp-3 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectService) onSelectService(service);
                    }}
                    className="btn-primary w-full py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeSubTab === 'issues' ? (
        <div>
          {myIssues.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center justify-center border border-[#514532]/40">
              <span className="material-symbols-outlined text-5xl text-[#9e8f78] mb-3">
                task_alt
              </span>
              <h3 className="font-['Sora'] text-lg font-bold text-[#ffdca1] mb-2">
                No Grievances Logged
              </h3>
              <p className="font-['Geist'] text-sm text-[#d5c4ab] max-w-md mb-6">
                Notice a civic infrastructure problem? Submit a report with GPS coordinates and photos to track its resolution.
              </p>
              <button
                onClick={() => setActiveTab('issues')}
                className="btn-primary px-6 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider"
              >
                Go to Issues Board
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="glass-panel p-5 rounded-2xl border border-[#514532]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#9e8f78] uppercase">
                        {issue.category.replace('_', ' ')}
                      </span>
                      <span className="text-[#514532]">•</span>
                      <span className="font-mono text-xs text-[#ffdca1]">
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-['Sora'] text-base font-bold text-[#e1e2eb]">
                      {issue.title}
                    </h4>
                    <p className="font-mono text-xs text-[#9e8f78] mt-1">
                      {issue.location?.address} • Submitted on{' '}
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('issues')}
                    className="btn-secondary px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
                  >
                    View Status Map
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {aiSessions.map((sess) => (
            <div
              key={sess._id || sess.sessionId}
              className="glass-panel p-5 rounded-2xl border border-[#514532]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <span className="font-mono text-[10px] text-[#FFB800] uppercase tracking-wider block mb-1">
                  AI Consultation • {sess.timestamp}
                </span>
                <h4 className="font-['Sora'] text-base font-bold text-[#ffdca1]">
                  {sess.sessionTitle}
                </h4>
                <p className="font-['Geist'] text-xs text-[#d5c4ab] line-clamp-1 mt-1">
                  {sess.messages?.[sess.messages.length - 1]?.content || 'Session active'}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('companion')}
                className="btn-secondary px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Resume Consultation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
