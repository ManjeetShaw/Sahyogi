import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function NoticeSimplifierModal({ isOpen, onClose }) {
  const { showToast } = useAuth();
  const [noticeText, setNoticeText] = useState('');
  const [simplifiedResult, setSimplifiedResult] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimplify = async (e) => {
    e.preventDefault();
    if (!noticeText.trim()) {
      showToast('Please paste the notice text to analyze', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await aiApi.simplifyNotice(noticeText.trim());
      setSimplifiedResult(result);
      showToast('Government notice simplified successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to simplify notice', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertSample = () => {
    setNoticeText(`OFFICE OF THE MUNICIPAL COMMISSIONER & REVENUE RECOVERY WARD 7
NOTICE NO: MC/REV/2026/0842-B
SUBJECT: FINAL RE-ASSESSMENT & COMPLIANCE DEMAND UNDER SECTION 142(C) OF MUNICIPAL ACT

To all occupants, property holders, and commercial license applicants of Zonal Sector 4:
Pursuant to the comprehensive GIS geo-spatial property survey completed on 15-08-2026, discrepancies have been identified regarding built-up floor area ratio (FAR) and outstanding sanitary drainage assessments. All designated property owners are hereby notified under penalty of Section 178 to submit certified revised self-declaration forms along with current structural approval blue-prints within 15 calendar days from the date of issuance of this notification.

Failure to furnish requisite proof of property ownership and valid tax clearance certificates will attract a non-negotiable statutory surcharge of 1.5% compounding per month on the assessed difference. Continued default beyond 30 days shall initiate proceedings for discontinuation of municipal water pressure connection and cancellation of registered trade permits without further individual notice. Payments must be routed through the authorized treasury channel or accredited municipal portals.`);
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
                <span className="material-symbols-outlined text-2xl">document_scanner</span>
              </div>
              <div>
                <h2 className="font-['Sora'] text-2xl font-bold text-[#ffdca1]">
                  Simplify Government Notice
                </h2>
                <p className="font-['Geist'] text-xs sm:text-sm text-[#d5c4ab]">
                  Paste complex bureaucratic letters, court summons, or tax demands to decode in plain English.
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

          {/* Form Area */}
          <form onSubmit={handleSimplify} className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <label className="text-[#d5c4ab] uppercase tracking-wider">
                Official Notice Text (Max 6000 Chars) *
              </label>
              <button
                type="button"
                onClick={handleInsertSample}
                className="text-[#FFB800] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                <span>Load Sample Tax Notice</span>
              </button>
            </div>

            <textarea
              required
              rows={6}
              maxLength={6000}
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              placeholder="Paste raw text from a municipal letter, legal notice, property tax demand, or fine..."
              className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-4 text-[#e1e2eb] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 outline-none resize-none font-['Geist'] text-sm leading-relaxed"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[#9e8f78]">{noticeText.length}/6000 chars</span>
              <button
                type="submit"
                disabled={loading || !noticeText.trim()}
                className="btn-primary font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    <span>Analyzing Legal Text...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">psychology</span>
                    <span>Translate & Simplify</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Simplified Results Section */}
          {simplifiedResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-[#514532]/40"
            >
              <h3 className="font-['Sora'] text-lg font-bold text-[#FFB800] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">fact_check</span>
                <span>Plain Language Breakdown</span>
              </h3>

              <div className="p-5 rounded-xl bg-[#191c22]/80 border border-[#FFB800]/30 font-['Geist'] text-sm text-[#e1e2eb] leading-relaxed whitespace-pre-line space-y-4 shadow-xl">
                {simplifiedResult}
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#514532]/40 flex justify-end">
            <button
              onClick={onClose}
              className="btn-secondary px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
