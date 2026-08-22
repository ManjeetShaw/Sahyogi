import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { servicesApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import ServiceDetailModal from './ServiceDetailModal.jsx';

const SERVICE_CATEGORIES = [
  'All',
  'identity_documents',
  'welfare_schemes',
  'permits_licenses',
  'utilities',
  'taxes',
  'other'
];

export default function ServicesView({ onOpenCompanionWithService, onOpenSchemeFinder }) {
  const { user, savedServiceIds, toggleSaveService, showToast } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Admin New Service State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    title: '',
    description: '',
    category: 'identity_documents',
    howToApply: '',
    eligibility: '',
    requiredDocuments: '',
    fees: '',
    link: ''
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await servicesApi.getServices({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        q: searchQuery || undefined
      });
      setServices(data || []);
    } catch {
      showToast('Error loading services catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const filteredServices = services.filter((s) => {
    if (showSavedOnly && !savedServiceIds.includes(s._id)) {
      return false;
    }
    return true;
  });

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newServiceForm.title || !newServiceForm.description || !newServiceForm.howToApply) {
      showToast('Please fill out all required service fields', 'error');
      return;
    }

    try {
      const docsArray = newServiceForm.requiredDocuments
        ? newServiceForm.requiredDocuments.split('\n').filter((d) => d.trim().length > 0)
        : [];

      await servicesApi.createService({
        ...newServiceForm,
        requiredDocuments: docsArray
      });

      showToast('New service published to catalog', 'success');
      setAdminModalOpen(false);
      setNewServiceForm({
        title: '',
        description: '',
        category: 'identity_documents',
        howToApply: '',
        eligibility: '',
        requiredDocuments: '',
        fees: '',
        link: ''
      });
      fetchServices();
    } catch (err) {
      showToast(err.message || 'Failed to create service', 'error');
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 pt-4 pb-16">
      {/* Search & Filter Bar Section */}
      <section className="mb-10">
        <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-[#514532]/40">
          {/* Search Input */}
          <div className="relative w-full md:w-5/12">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d5c4ab]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-[#0b0e14] border border-[#514532]/60 rounded-xl py-3 pl-12 pr-4 text-[#e1e2eb] font-mono text-xs focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 transition-all placeholder:text-[#d5c4ab]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9e8f78] hover:text-[#ffdca1]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills (Scrollable on small screens) */}
          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 items-center scrollbar-none">
            {SERVICE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-mono text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border border-[#FFB800] text-[#FFB800] bg-[#FFB800]/15 font-semibold shadow-[0_0_10px_rgba(255,184,0,0.15)]'
                      : 'border border-[#514532]/50 text-[#d5c4ab] hover:border-[#FFB800]/50 hover:text-[#ffdca1]'
                  }`}
                >
                  {cat === 'All' ? 'All' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tools & Bookmarks Toggle */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                showSavedOnly
                  ? 'bg-[#FFB800]/20 border-[#FFB800] text-[#ffdca1]'
                  : 'bg-[#191c22]/60 border-[#514532] text-[#d5c4ab] hover:border-[#FFB800]/50'
              }`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: showSavedOnly ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
              <span>Saved Bookmarks ({savedServiceIds.length})</span>
            </button>

            <button
              onClick={onOpenSchemeFinder}
              className="px-3.5 py-1.5 rounded-lg font-mono text-xs flex items-center gap-2 border border-[#FFB800]/40 text-[#ffdca1] bg-[#1A1F2C]/60 hover:bg-[#FFB800]/10 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#FFB800]">auto_awesome</span>
              <span>AI Scheme Matcher</span>
            </button>
          </div>

          {/* Admin Publish Service Trigger */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setAdminModalOpen(true)}
              className="btn-primary px-4 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Admin: New Service</span>
            </button>
          )}
        </div>
      </section>

      {/* Available Services Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['Sora'] text-2xl font-bold text-[#e1e2eb]">
            Available Services
          </h2>
          <span className="font-mono text-xs text-[#9e8f78]">
            Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 rounded-2xl h-64 animate-pulse bg-[#191c22]/50 border border-[#514532]/20" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center border border-[#514532]/40">
            <span className="material-symbols-outlined text-5xl text-[#9e8f78] mb-3">
              search_off
            </span>
            <h3 className="font-['Sora'] text-lg font-bold text-[#ffdca1] mb-1">
              No matching services found
            </h3>
            <p className="font-['Geist'] text-sm text-[#d5c4ab] max-w-md mb-6">
              {showSavedOnly
                ? "You haven't bookmarked any services yet. Click the bookmark icon on any service card to pin it here."
                : "Try adjusting your search keywords or switching category filters."}
            </p>
            {showSavedOnly ? (
              <button
                onClick={() => setShowSavedOnly(false)}
                className="btn-secondary px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                View All Services
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-secondary px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const isSaved = savedServiceIds.includes(service._id);
              return (
                <motion.div
                  key={service._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6 rounded-2xl flex flex-col h-full relative overflow-hidden group border border-[#514532]/30 hover:border-[#FFB800]/40 transition-all bg-[#10131a]/60"
                >
                  {/* Bookmark Button */}
                  <div className="absolute top-0 right-0 p-5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveService(service._id);
                      }}
                      className="p-1.5 rounded-lg bg-[#191c22]/80 hover:bg-[#191c22] text-[#d5c4ab] hover:text-[#FFB800] transition-colors cursor-pointer"
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
                  </div>

                  {/* Card Content */}
                  <div className="mb-4 pr-8">
                    <span className="inline-block px-2.5 py-1 bg-[#191c22] border border-[#514532]/50 rounded font-mono text-[10px] text-[#c2c6d8] uppercase tracking-wider mb-3">
                      {service.category}
                    </span>
                    <h3 className="font-['Sora'] text-xl font-bold text-[#ffdca1] mb-2 group-hover:text-[#FFB800] transition-colors">
                      {service.title}
                    </h3>
                    <p className="font-['Geist'] text-sm text-[#d5c4ab] line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 flex gap-3">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="btn-primary w-full py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold text-center cursor-pointer shadow-[0_0_12px_rgba(255,184,0,0.15)] hover:shadow-[0_0_20px_rgba(255,184,0,0.35)]"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onOpenCompanionWithService={onOpenCompanionWithService}
        />
      )}

      {/* Admin New Service Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e14]/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-[#514532] shadow-2xl p-6 sm:p-8 bg-[#10131a] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#514532]/40 pb-4 mb-6">
              <h3 className="font-['Sora'] text-xl font-bold text-[#ffdca1]">
                Admin: Publish New Civic Service
              </h3>
              <button
                onClick={() => setAdminModalOpen(false)}
                className="text-[#9e8f78] hover:text-[#ffdca1]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={newServiceForm.title}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                  placeholder="e.g. Property Tax Assessment"
                  className="w-full bg-[#191c22] border border-[#514532] rounded-lg p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={newServiceForm.category}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, category: e.target.value })}
                    className="w-full bg-[#191c22] border border-[#514532] rounded-lg p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
                  >
                    {SERVICE_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                    Fees / Cost
                  </label>
                  <input
                    type="text"
                    value={newServiceForm.fees}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, fees: e.target.value })}
                    placeholder="e.g. Free or ₹1,500"
                    className="w-full bg-[#191c22] border border-[#514532] rounded-lg p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newServiceForm.description}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                  placeholder="Brief synopsis of what the service covers..."
                  className="w-full bg-[#191c22] border border-[#514532] rounded-lg p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                  How To Apply (Step-by-Step) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newServiceForm.howToApply}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, howToApply: e.target.value })}
                  placeholder="1. Visit portal, 2. Submit form..."
                  className="w-full bg-[#191c22] border border-[#514532] rounded-lg p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                  Eligibility
                </label>
                <input
                  type="text"
                  value={newServiceForm.eligibility}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, eligibility: e.target.value })}
                  placeholder="Who is eligible..."
                  className="w-full bg-[#191c22] border border-[#514532] rounded-lg p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                  Required Documents (One per line)
                </label>
                <textarea
                  rows={2}
                  value={newServiceForm.requiredDocuments}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, requiredDocuments: e.target.value })}
                  placeholder="Proof of Identity&#10;Proof of Address"
                  className="w-full bg-[#191c22] border border-[#514532] rounded-lg p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#514532]/40">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="px-4 py-2 rounded-lg btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-lg btn-primary">
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
