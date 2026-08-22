import React from 'react';
import { motion } from 'framer-motion';

export default function HomeView({ setActiveTab, onOpenReportModal, onOpenSchemeFinder, onOpenNoticeSimplifier }) {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[720px] md:min-h-[800px] flex items-center px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto w-full overflow-hidden pt-6 pb-16">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 opacity-35 pointer-events-none">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBpxixZooWBfX9KI47xVrqPdfS383Oq5wL4Lyh9nZmy0M28sRSDz7CslaOmuHYc861lH9h7I0Y5NVGiYmPhO01-qgJddQ6a90r-hz4NIr5qWagXSFtz8exwjHTsR0WWvHuUmlKlxpXDLUi64lGeYvaV9Bc_ftK4FWUSgyVl8BLjZJxsid6VIkH3n19az6N0BwPBbsZWZN1ViCFmgbCWphO94TRBhiN188R09qH7mawMWeWx2O9BvJ7TVA')`,
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#1A1F2C]/80 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-1 md:col-span-9 lg:col-span-8 flex flex-col justify-center"
          >
            <h1 className="font-['Sora'] text-4xl sm:text-5xl lg:text-[68px] font-extrabold text-[#e1e2eb] tracking-tight leading-[1.1] mb-6">
              Empowering Citizens, <br />
              <span className="text-gradient-gold">Elevating Governance</span>
            </h1>

            <p className="font-['Geist'] text-lg sm:text-xl text-[#d5c4ab] mb-10 max-w-2xl leading-relaxed">
              Navigate complex systems with ease. A secure, visionary command center for public services,
              ensuring your voice is heard and issues are resolved efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('services')}
                className="btn-primary font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Services</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenReportModal}
                className="btn-secondary font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>Report an Issue</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto w-full border-t border-[#514532]/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start p-4 rounded-xl glass-panel border-[#514532]/40"
          >
            <span className="font-['Sora'] text-3xl sm:text-4xl font-bold text-[#FFB800] mb-1">24/7</span>
            <span className="font-mono text-xs text-[#d5c4ab] uppercase tracking-widest">AI Support</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-start p-4 rounded-xl glass-panel border-[#514532]/40"
          >
            <span className="font-['Sora'] text-3xl sm:text-4xl font-bold text-[#FFB800] mb-1">15k+</span>
            <span className="font-mono text-xs text-[#d5c4ab] uppercase tracking-widest">Active Issues</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-start p-4 rounded-xl glass-panel border-[#514532]/40"
          >
            <span className="font-['Sora'] text-3xl sm:text-4xl font-bold text-[#FFB800] mb-1">98%</span>
            <span className="font-mono text-xs text-[#d5c4ab] uppercase tracking-widest">Resolution Rate</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-start p-4 rounded-xl glass-panel border-[#514532]/40"
          >
            <span className="font-['Sora'] text-3xl sm:text-4xl font-bold text-[#FFB800] mb-1">50+</span>
            <span className="font-mono text-xs text-[#d5c4ab] uppercase tracking-widest">Services Listed</span>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid: Command Center Capabilities */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto w-full">
        <div className="mb-10 text-left">
          <h2 className="font-['Sora'] text-2xl sm:text-3xl font-bold text-[#e1e2eb] mb-3">
            Command Center Capabilities
          </h2>
          <p className="font-['Geist'] text-base text-[#d5c4ab] max-w-2xl">
            Access powerful tools designed to simplify interactions with public systems and maintain community standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* Card 1: AI Companion (Large Card - spans 2 columns) */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setActiveTab('companion')}
            className="glass-panel glow-border rounded-xl p-6 sm:p-8 flex flex-col justify-between md:col-span-2 relative overflow-hidden group cursor-pointer border border-[#FFB800]/20 hover:border-[#FFB800]/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/10 to-transparent pointer-events-none" />
            <div className="z-10 relative">
              <span
                className="material-symbols-outlined text-4xl text-[#FFB800] mb-4 block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                smart_toy
              </span>
              <h3 className="font-['Sora'] text-xl sm:text-2xl font-bold text-[#e1e2eb] mb-2 group-hover:text-[#ffdca1] transition-colors">
                AI Companion
              </h3>
              <p className="font-['Geist'] text-sm sm:text-base text-[#d5c4ab] max-w-md leading-relaxed">
                Instantly navigate services, understand complex notices, and get recommendations tailored to your specific situation with our advanced AI.
              </p>
            </div>
            <div className="z-10 relative mt-4 flex items-center justify-between">
              <span className="inline-block bg-[#32353c] px-3 py-1 rounded-full font-mono text-xs text-[#ffdca1] border border-[#514532]">
                Available 24/7
              </span>
              <span className="font-mono text-xs text-[#FFB800] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Companion →
              </span>
            </div>
          </motion.div>

          {/* Card 2: Service Finder */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setActiveTab('services')}
            className="glass-panel glow-border rounded-xl p-6 sm:p-8 flex flex-col justify-between relative group cursor-pointer border border-[#FFB800]/20 hover:border-[#FFB800]/50 transition-all"
          >
            <div>
              <span className="material-symbols-outlined text-4xl text-[#FFB800] mb-4 block">
                search
              </span>
              <h3 className="font-['Sora'] text-xl font-bold text-[#e1e2eb] mb-2 group-hover:text-[#ffdca1] transition-colors">
                Service Finder
              </h3>
              <p className="font-['Geist'] text-sm text-[#d5c4ab] leading-relaxed">
                Quickly locate and bookmark essential welfare schemes, utility services, and permits.
              </p>
            </div>
            <div className="font-mono text-xs text-[#FFB800] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Catalog →
            </div>
          </motion.div>

          {/* Card 3: Community Issues */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setActiveTab('issues')}
            className="glass-panel glow-border rounded-xl p-6 sm:p-8 flex flex-col justify-between relative group cursor-pointer border border-[#FFB800]/20 hover:border-[#FFB800]/50 transition-all"
          >
            <div>
              <span className="material-symbols-outlined text-4xl text-[#FFB800] mb-4 block">
                report
              </span>
              <h3 className="font-['Sora'] text-xl font-bold text-[#e1e2eb] mb-2 group-hover:text-[#ffdca1] transition-colors">
                Community Issues
              </h3>
              <p className="font-['Geist'] text-sm text-[#d5c4ab] leading-relaxed">
                Report and track public infrastructure issues with real-time status updates.
              </p>
            </div>
            <div className="font-mono text-xs text-[#FFB800] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Live Map →
            </div>
          </motion.div>

          {/* Card 4: Secure Ecosystem (Spans 2 columns) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel glow-border rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between relative md:col-span-2 overflow-hidden border border-[#FFB800]/20 gap-6"
          >
            <div className="z-10 relative max-w-md">
              <h3 className="font-['Sora'] text-xl sm:text-2xl font-bold text-[#e1e2eb] mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFB800]">security</span>
                Secure Ecosystem
              </h3>
              <p className="font-['Geist'] text-sm sm:text-base text-[#d5c4ab] leading-relaxed">
                Your data is protected with high-level encryption. Experience a solid foundation of stability and trust for all civic interactions.
              </p>
            </div>

            {/* High-Tech Animated Telemetry Graphic */}
            <div className="w-full md:w-5/12 h-32 rounded-lg bg-[#0b0e14] border border-[#514532] p-3 flex flex-col justify-between font-mono text-[11px] text-[#9e8f78] relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] text-[#FFB800] border-b border-[#514532]/40 pb-1">
                <span>GOV_CIPHER_AES_256</span>
                <span className="animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE
                </span>
              </div>
              <div className="space-y-1 opacity-75 overflow-hidden">
                <div className="truncate text-[#d5c4ab]">SESSION_HASH: 0x9F4B...C82A</div>
                <div className="truncate text-emerald-400/90">KEY_EXCHANGE: SECP256K1 VERIFIED</div>
                <div className="truncate">INTEGRITY_CHECK: 100% PASS</div>
              </div>
              <div className="text-[10px] text-[#FFB800]/80 tracking-wider">
                ENCRYPTED_DATA_STREAM
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
