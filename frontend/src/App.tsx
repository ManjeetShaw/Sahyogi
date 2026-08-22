import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomeView from './components/HomeView.jsx';
import ServicesView from './components/ServicesView.jsx';
import IssuesView from './components/IssuesView.jsx';
import CompanionView from './components/CompanionView.jsx';
import ProfileView from './components/ProfileView.jsx';
import AuthModal from './components/AuthModal.jsx';
import NoticeSimplifierModal from './components/NoticeSimplifierModal.jsx';
import SchemeFinderModal from './components/SchemeFinderModal.jsx';
import ReportIssueModal from './components/ReportIssueModal.jsx';
import ServiceDetailModal from './components/ServiceDetailModal.jsx';

function MainApp() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'services' | 'issues' | 'companion' | 'profile'
  const [companionInitialMsg, setCompanionInitialMsg] = useState('');

  // Global Modal states
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [schemeModalOpen, setSchemeModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);

  const handleOpenCompanionWithService = (service) => {
    setCompanionInitialMsg(
      `Can you explain the exact application process and document requirements for "${service.title}"?`
    );
    setActiveTab('companion');
  };

  const handleOpenCompanionWithIssue = (issue) => {
    setCompanionInitialMsg(
      `I need assistance regarding the community grievance "${issue.title}" located at ${
        issue.location?.address || 'the municipal zone'
      }. What is the standard municipal SLA for resolution?`
    );
    setActiveTab('companion');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-[#e1e2eb] selection:bg-[#FFB800] selection:text-[#10131a]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNoticeSimplifier={() => setNoticeModalOpen(true)}
        onOpenSchemeFinder={() => setSchemeModalOpen(true)}
      />

      {/* Main Content Area with Header Offset */}
      <main className="flex-1 w-full pt-[80px] flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1"
            >
              <HomeView
                setActiveTab={setActiveTab}
                onOpenReportModal={() => setReportModalOpen(true)}
                onOpenSchemeFinder={() => setSchemeModalOpen(true)}
                onOpenNoticeSimplifier={() => setNoticeModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1"
            >
              <ServicesView
                onOpenCompanionWithService={handleOpenCompanionWithService}
                onOpenSchemeFinder={() => setSchemeModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'issues' && (
            <motion.div
              key="issues"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1"
            >
              <IssuesView
                onOpenCompanionWithIssue={handleOpenCompanionWithIssue}
              />
            </motion.div>
          )}

          {activeTab === 'companion' && (
            <motion.div
              key="companion"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1"
            >
              <CompanionView
                initialMessage={companionInitialMsg}
                onOpenNoticeSimplifier={() => setNoticeModalOpen(true)}
                onOpenSchemeFinder={() => setSchemeModalOpen(true)}
                onSelectService={(srv) => setSelectedServiceDetail(srv)}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1"
            >
              <ProfileView
                setActiveTab={setActiveTab}
                onSelectService={(srv) => setSelectedServiceDetail(srv)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer
        onOpenContact={() => {
          setActiveTab('companion');
          setCompanionInitialMsg('How do I contact the municipal zonal grievance officer directly?');
        }}
      />

      {/* Global Modals */}
      <AuthModal />

      <NoticeSimplifierModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
      />

      <SchemeFinderModal
        isOpen={schemeModalOpen}
        onClose={() => setSchemeModalOpen(false)}
        onSelectService={(srv) => setSelectedServiceDetail(srv)}
      />

      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onIssueCreated={() => {
          setActiveTab('issues');
        }}
      />

      {selectedServiceDetail && (
        <ServiceDetailModal
          service={selectedServiceDetail}
          onClose={() => setSelectedServiceDetail(null)}
          onOpenCompanionWithService={handleOpenCompanionWithService}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
