import React from 'react';

export default function Footer({ onOpenContact }) {
  return (
    <footer className="w-full bg-[#0b0e14] py-8 px-4 sm:px-8 lg:px-16 border-t border-[#514532]/30 mt-auto">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#FFB800] text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            language
          </span>
          <span className="font-['Sora'] text-xl font-bold tracking-tighter text-[#ffdca1]">
            Sahyogi
          </span>
        </div>

        <div className="text-[#9e8f78] text-sm text-center md:text-left font-['Geist']">
          © 2026 Sahyogi Governance. Empowering Citizens.
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="#legal"
            onClick={(e) => {
              e.preventDefault();
              alert('Sahyogi Governance adheres to Digital Personal Data Protection and Public Services SLA regulations.');
            }}
            className="font-mono text-xs uppercase tracking-widest text-[#d5c4ab]/80 hover:text-[#FFB800] transition-colors"
          >
            Legal
          </a>
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              alert('Citizen Privacy Protocol: All queries, grievances, and identity documents are encrypted end-to-end.');
            }}
            className="font-mono text-xs uppercase tracking-widest text-[#d5c4ab]/80 hover:text-[#FFB800] transition-colors"
          >
            Privacy
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenContact) onOpenContact();
              else alert('Municipal Helpdesk: 1800-SAHYOGI | grievance@sahyogi.gov');
            }}
            className="font-mono text-xs uppercase tracking-widest text-[#d5c4ab]/80 hover:text-[#FFB800] transition-colors"
          >
            Contact
          </a>
          <a
            href="#support"
            onClick={(e) => {
              e.preventDefault();
              alert('24/7 AI Companion is available on the COMPANION tab for instant regulatory navigation.');
            }}
            className="font-mono text-xs uppercase tracking-widest text-[#d5c4ab]/80 hover:text-[#FFB800] transition-colors"
          >
            Support
          </a>
        </nav>
      </div>
    </footer>
  );
}
