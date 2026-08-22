import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function ServiceDetailModal({ service, onClose, onOpenCompanionWithService }) {
  const { savedServiceIds, toggleSaveService } = useAuth();

  if (!service) return null;

  const isSaved = savedServiceIds.includes(service._id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e14]/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-3xl rounded-2xl border border-[#514532] shadow-2xl p-6 sm:p-8 bg-[#10131a]/95 my-8 max-h-[90vh] flex flex-col relative"
        >
          {/* Top Header */}
          <div className="flex justify-between items-start border-b border-[#514532]/40 pb-4 mb-6">
            <div className="flex flex-col gap-1">
              <span className="inline-block px-2.5 py-1 bg-[#191c22] border border-[#514532] rounded font-mono text-[11px] text-[#FFB800] uppercase tracking-wider w-fit">
                {service.category}
              </span>
              <h2 className="font-['Sora'] text-2xl sm:text-3xl font-bold text-[#ffdca1] mt-1">
                {service.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveService(service._id)}
                className="p-2 rounded-lg bg-[#191c22] border border-[#514532] hover:border-[#FFB800] text-[#d5c4ab] hover:text-[#FFB800] transition-colors cursor-pointer"
                title={isSaved ? "Remove Bookmark" : "Save Service"}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{
                    fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                    color: isSaved ? '#FFB800' : undefined
                  }}
                >
                  bookmark
                </span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-[#191c22] border border-[#514532] hover:border-[#ffdca1] text-[#d5c4ab] hover:text-[#ffdca1] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 font-['Geist'] text-sm sm:text-base text-[#e1e2eb]">
            {/* Overview */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#9e8f78] mb-2">
                Service Overview
              </h4>
              <p className="leading-relaxed text-[#d5c4ab] bg-[#191c22]/50 p-4 rounded-xl border border-[#514532]/30">
                {service.description}
              </p>
            </div>

            {/* How to Apply */}
            {service.howToApply && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#9e8f78] mb-2">
                  How To Apply (Step-by-Step)
                </h4>
                <div className="bg-[#191c22]/50 p-4 rounded-xl border border-[#514532]/30 whitespace-pre-line leading-relaxed">
                  {service.howToApply}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {service.eligibility && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#9e8f78] mb-2">
                  Eligibility Criteria
                </h4>
                <p className="bg-[#191c22]/50 p-4 rounded-xl border border-[#514532]/30 text-[#ffdca1]">
                  {service.eligibility}
                </p>
              </div>
            )}

            {/* Required Documents */}
            {service.requiredDocuments && service.requiredDocuments.length > 0 && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#9e8f78] mb-2">
                  Required Documents Checklist
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.requiredDocuments.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 bg-[#191c22]/50 p-3 rounded-lg border border-[#514532]/30 text-xs sm:text-sm text-[#e1e2eb]"
                    >
                      <span className="material-symbols-outlined text-[#FFB800] text-sm shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fees & Rejection Reasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.fees && (
                <div className="bg-[#191c22]/50 p-4 rounded-xl border border-[#514532]/30">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#9e8f78] mb-1">
                    Applicable Fees
                  </h4>
                  <p className="text-emerald-400 font-medium">{service.fees}</p>
                </div>
              )}

              {service.link && (
                <div className="bg-[#191c22]/50 p-4 rounded-xl border border-[#514532]/30 flex flex-col justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#9e8f78] mb-1">
                    Official Government Portal
                  </h4>
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFB800] hover:underline text-xs font-mono flex items-center gap-1 truncate"
                  >
                    <span>{service.link}</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
              )}
            </div>

            {/* Common Rejection Reasons */}
            {service.commonRejectionReasons && service.commonRejectionReasons.length > 0 && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-red-400/90 mb-2">
                  Common Rejection Pitfalls To Avoid
                </h4>
                <ul className="space-y-2">
                  {service.commonRejectionReasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 bg-red-950/20 p-3 rounded-lg border border-red-900/30 text-xs text-red-200"
                    >
                      <span className="material-symbols-outlined text-red-400 text-sm shrink-0 mt-0.5">
                        warning
                      </span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="border-t border-[#514532]/40 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={() => {
                onClose();
                if (onOpenCompanionWithService) onOpenCompanionWithService(service);
              }}
              className="btn-secondary w-full sm:w-auto font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              <span>Ask AI Companion About This Service</span>
            </button>

            <button
              onClick={onClose}
              className="btn-primary w-full sm:w-auto font-mono text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
