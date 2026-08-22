import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { issuesApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const ISSUE_CATEGORIES = [
  'roads',
  'sanitation',
  'water_supply',
  'electricity',
  'public_safety',
  'parks',
  'other'
];

export default function ReportIssueModal({ isOpen, onClose, onIssueCreated }) {
  const { user, showToast } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'roads',
    address: '',
    imageUrl: ''
  });

  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'info');
      setForm((prev) => ({ ...prev, address: 'Central Ward, Sector 4' }));
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setForm((prev) => ({
          ...prev,
          address: `GPS Pin: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Ward 7)`
        }));
        showToast('GPS location retrieved accurately', 'success');
      },
      () => {
        setLocating(false);
        setForm((prev) => ({ ...prev, address: 'Main Street & 4th Avenue' }));
        showToast('Default municipal location set', 'info');
      },
      { timeout: 5000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      showToast('Please provide an issue title and description', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await issuesApi.createIssue({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: {
          address: form.address || 'Central Municipal Zone',
          lat: 40.7128,
          lng: -74.0060
        },
        imageUrl: form.imageUrl.trim() || ''
      });

      showToast('Grievance report submitted successfully!', 'success');
      if (onIssueCreated) onIssueCreated();
      onClose();
      setForm({
        title: '',
        description: '',
        category: 'roads',
        address: '',
        imageUrl: ''
      });
    } catch (err) {
      showToast(err.message || 'Failed to submit grievance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e14]/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-2xl rounded-2xl border border-[#514532] shadow-2xl p-6 sm:p-8 bg-[#10131a]/95 my-8 max-h-[90vh] overflow-y-auto flex flex-col relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#514532]/40 pb-4 mb-6">
            <div>
              <span className="font-mono text-xs text-[#FFB800] uppercase tracking-widest block mb-1">
                Citizen Grievance Portal
              </span>
              <h2 className="font-['Sora'] text-2xl font-bold text-[#ffdca1]">
                Report New Public Issue
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#191c22] border border-[#514532] text-[#d5c4ab] hover:text-[#ffdca1] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
            {/* Title */}
            <div>
              <label className="block text-[#d5c4ab] mb-2 uppercase tracking-wider">
                Issue Title (Max 140 Chars) *
              </label>
              <input
                type="text"
                required
                maxLength={140}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Severe Pothole on Main St"
                className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 outline-none"
              />
              <div className="text-right text-[10px] text-[#9e8f78] mt-1">
                {form.title.length}/140
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[#d5c4ab] mb-2 uppercase tracking-wider">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ISSUE_CATEGORIES.map((cat) => {
                  const isSelected = form.category === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer capitalize ${
                        isSelected
                          ? 'border-[#FFB800] bg-[#FFB800]/15 text-[#ffdca1] font-bold shadow-[0_0_10px_rgba(255,184,0,0.15)]'
                          : 'border-[#514532]/60 bg-[#191c22] text-[#d5c4ab] hover:border-[#FFB800]/40'
                      }`}
                    >
                      {cat.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#d5c4ab] mb-2 uppercase tracking-wider">
                Description (Max 2000 Chars) *
              </label>
              <textarea
                required
                rows={4}
                maxLength={2000}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the issue in detail, its impact on residents or traffic, and how long it has persisted..."
                className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 outline-none resize-none font-['Geist'] text-sm"
              />
              <div className="text-right text-[10px] text-[#9e8f78] mt-1">
                {form.description.length}/2000
              </div>
            </div>

            {/* Location & GPS */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[#d5c4ab] uppercase tracking-wider">
                  Location / Landmark
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="text-[#FFB800] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {locating ? 'sync' : 'my_location'}
                  </span>
                  <span>{locating ? 'Locating...' : 'Use Current GPS'}</span>
                </button>
              </div>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Intersection of Main and 4th, near Bus Stop #12"
                className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 outline-none"
              />
            </div>

            {/* Image URL / Evidence */}
            <div>
              <label className="block text-[#d5c4ab] mb-2 uppercase tracking-wider">
                Photo Evidence URL (Optional)
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/pothole-photo.jpg"
                className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 outline-none"
              />
              {/* Quick sample photo selector for testing */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-[#9e8f78]">Sample Evidence:</span>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      imageUrl:
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuBqKV22K4PvG4W1eF8QqM-Sdp4BByuBybuLCDgEBCjUsswstGMd2ZAEFoC77z_FGQbvEadeoZ2GuBnLSuEG9RyPLXgVN0G9KoRkWOD_uxG3mxUjqNAl11s5AqHe1b4ANhxKMax7KwuHU1SlyfrlSmBuUq4TS5UZ_j3x37cFnEUmD-O5_U44ambacEy1LQLKhnry78iYyXxMZk9HS78iMJvKDvfEJrgzu2NskWKFlgB4CrOQRvvcRWJquw'
                    })
                  }
                  className="text-[10px] text-[#ffdca1] underline hover:text-[#FFB800]"
                >
                  Pothole
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      imageUrl:
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAWBVV-sr3e7ifiRSniK1eTiOa6y13gNImO8bdnlQMKvf1xwQ9yJoHzJJgUETcrjvXPpbQZiOMgvJmhDcaGYVAYM9PgMo5isAK3Yp8h_NHz9OFXlv24u9goK7Z5KeIHfLnAc06CikymSDOlOIFJ2smLB8xHHc3tyw2F_dicaAqNpYC-DvDaQTLlifIlhHqrSxiamWDEZ1TkMAF_7PyG3U1hTbNbyd19lqiP1MNIFnFJ8CIqlmqXimJLIg'
                    })
                  }
                  className="text-[10px] text-[#ffdca1] underline hover:text-[#FFB800]"
                >
                  Streetlight
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      imageUrl:
                        'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80'
                    })
                  }
                  className="text-[10px] text-[#ffdca1] underline hover:text-[#FFB800]"
                >
                  Sanitation
                </button>
              </div>
            </div>

            {/* Reporter disclaimer */}
            <div className="bg-[#191c22]/60 p-3 rounded-xl border border-[#514532]/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FFB800] text-lg">
                verified_user
              </span>
              <span className="text-[11px] text-[#d5c4ab]">
                Reporting as: <strong className="text-[#ffdca1]">{user?.name || 'Citizen'}</strong>. All verified reports are forwarded immediately to municipal response dispatch.
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#514532]/40">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-5 py-2.5 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-7 py-2.5 rounded-lg font-bold cursor-pointer flex items-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
