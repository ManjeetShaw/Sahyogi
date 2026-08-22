import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function SchemeFinderModal({ isOpen, onClose, onSelectService }) {
  const { savedServiceIds, toggleSaveService, showToast } = useAuth();
  const [situationText, setSituationText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleFindSchemes = async (e) => {
    e.preventDefault();
    if (!situationText.trim()) {
      showToast('Please describe your situation or requirement', 'error');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const recs = await aiApi.recommendSchemes(situationText.trim());
      setRecommendations(recs || []);
      showToast('AI analyzed your profile against public schemes', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to match schemes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSample = (text) => {
    setSituationText(text);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e14]/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-3xl rounded-2xl border border-[#514532] shadow-2xl p-6 sm:p-8 bg-[#10131a]/95 my-8 max-h-[90vh] overflow-y-auto flex flex-col relative"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#514532]/40 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/40 flex items-center justify-center text-[#FFB800]">
                <span className="material-symbols-outlined text-2xl">explore</span>
              </div>
              <div>
                <h2 className="font-['Sora'] text-2xl font-bold text-[#ffdca1]">
                  AI Scheme & Service Finder
                </h2>
                <p className="font-['Geist'] text-xs sm:text-sm text-[#d5c4ab]">
                  Describe your current situation, age, occupation, or needs to receive tailored welfare recommendations.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#191c22] border border-[#514532] text-[#d5c4ab] hover:text-[#ffdca1] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFindSchemes} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#d5c4ab] mb-2 uppercase tracking-wider">
                Describe Your Situation *
              </label>
              <textarea
                required
                rows={3}
                value={situationText}
                onChange={(e) => setSituationText(e.target.value)}
                placeholder="e.g. I am a 65-year-old retired resident looking for medical assistance, pension support, and property rebates."
                className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-4 text-[#e1e2eb] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 outline-none resize-none font-['Geist'] text-sm"
              />
            </div>

            {/* Prompt suggestions */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-[#9e8f78]">Suggestions:</span>
              <button
                type="button"
                onClick={() =>
                  handleSample('Senior citizen looking for monthly pension and medical insurance benefits')
                }
                className="px-2.5 py-1 rounded bg-[#191c22] border border-[#514532] text-[10px] text-[#d5c4ab] hover:text-[#ffdca1] hover:border-[#FFB800]/50"
              >
                Senior Pension
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSample('Looking to start a commercial delivery business and need heavy vehicle driving permit')
                }
                className="px-2.5 py-1 rounded bg-[#191c22] border border-[#514532] text-[10px] text-[#d5c4ab] hover:text-[#ffdca1] hover:border-[#FFB800]/50"
              >
                Commercial Permit
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSample('Applied for solar panels and want to claim property tax rebates')
                }
                className="px-2.5 py-1 rounded bg-[#191c22] border border-[#514532] text-[10px] text-[#d5c4ab] hover:text-[#ffdca1] hover:border-[#FFB800]/50"
              >
                Property Tax Rebate
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading || !situationText.trim()}
                className="btn-primary font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 font-bold"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    <span>Matching Regulatory Database...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                    <span>Match Government Schemes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Recommendations Results List */}
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-[#514532]/40"
            >
              <h3 className="font-['Sora'] text-lg font-bold text-[#ffdca1] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFB800]">verified</span>
                <span>Tailored Recommendations ({recommendations.length})</span>
              </h3>

              {recommendations.length === 0 ? (
                <div className="p-6 text-center text-[#9e8f78] bg-[#191c22]/40 rounded-xl">
                  No direct scheme match found. Please try clarifying your requirements.
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec, idx) => {
                    const service = rec.service;
                    if (!service) return null;
                    const isSaved = savedServiceIds.includes(service._id);

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-[#191c22]/80 border border-[#514532] hover:border-[#FFB800]/50 transition-all flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="inline-block px-2 py-0.5 bg-[#0b0e14] border border-[#514532] rounded font-mono text-[10px] text-[#FFB800] uppercase mb-1">
                              {service.category}
                            </span>
                            <h4 className="font-['Sora'] text-base font-bold text-[#ffdca1]">
                              {service.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => toggleSaveService(service._id)}
                            className="p-1.5 rounded-lg bg-[#0b0e14] border border-[#514532] hover:border-[#FFB800] text-[#d5c4ab] hover:text-[#FFB800]"
                          >
                            <span
                              className="material-symbols-outlined text-lg"
                              style={{
                                fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                                color: isSaved ? '#FFB800' : undefined
                              }}
                            >
                              bookmark
                            </span>
                          </button>
                        </div>

                        {/* Match Reason */}
                        <div className="p-3 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20 text-xs font-['Geist'] text-[#ffdca1]">
                          <strong className="text-[#FFB800]">Why it matches: </strong>
                          {rec.reason}
                        </div>

                        <p className="text-xs text-[#d5c4ab] line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-emerald-400 font-mono">
                            {service.fees || 'Free Scheme'}
                          </span>
                          <button
                            onClick={() => {
                              onClose();
                              if (onSelectService) onSelectService(service);
                            }}
                            className="btn-primary px-4 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider font-bold cursor-pointer"
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          <div className="mt-6 pt-4 border-t border-[#514532]/40 flex justify-end">
            <button
              onClick={onClose}
              className="btn-secondary px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
