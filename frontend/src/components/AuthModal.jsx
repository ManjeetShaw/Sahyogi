import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen'
  });
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (authMode === 'login') {
      const ok = await login(form.email, form.password);
      if (ok) setAuthModalOpen(false);
    } else {
      const ok = await register(form.name, form.email, form.password, form.role);
      if (ok) setAuthModalOpen(false);
    }
    setLoading(false);
  };

  const handleDemoLogin = async (roleType) => {
    setLoading(true);
    let email = 'citizen@sahyogi.gov';
    let name = 'Alex Rivera';
    if (roleType === 'staff') {
      email = 'officer.priya@sahyogi.gov';
      name = 'Officer Priya';
    } else if (roleType === 'admin') {
      email = 'admin.sarah@sahyogi.gov';
      name = 'Administrator Sarah';
    }

    await register(name, email, 'demo123456', roleType);
    setLoading(false);
    setAuthModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e14]/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-md rounded-2xl border border-[#514532] shadow-2xl p-6 sm:p-8 bg-[#10131a]/95 my-8 relative"
        >
          {/* Close button */}
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-6 right-6 p-1.5 rounded-lg bg-[#191c22] border border-[#514532] text-[#d5c4ab] hover:text-[#ffdca1] cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFB800]/20 border border-[#FFB800]/50 text-[#FFB800] mb-3">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                language
              </span>
            </div>
            <h2 className="font-['Sora'] text-2xl font-bold text-[#ffdca1]">
              {authMode === 'login' ? 'Citizen Sign In' : 'Create Civic Profile'}
            </h2>
            <p className="font-['Geist'] text-xs text-[#d5c4ab] mt-1">
              Secure authentication with government-grade cipher protection.
            </p>
          </div>

          {/* Quick Demo Logins Section */}
          <div className="mb-6 bg-[#191c22]/70 p-3.5 rounded-xl border border-[#514532]/40">
            <div className="text-[11px] font-mono text-[#9e8f78] uppercase tracking-wider mb-2 text-center">
              ⚡ Quick Demo One-Click Sign In
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('citizen')}
                className="py-1.5 px-2 bg-[#0b0e14] hover:bg-[#FFB800]/15 border border-[#514532] hover:border-[#FFB800] rounded text-[11px] font-mono text-[#ffdca1] transition-all cursor-pointer truncate"
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('staff')}
                className="py-1.5 px-2 bg-[#0b0e14] hover:bg-[#FFB800]/15 border border-[#514532] hover:border-[#FFB800] rounded text-[11px] font-mono text-[#ffdca1] transition-all cursor-pointer truncate"
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-2 bg-[#0b0e14] hover:bg-[#FFB800]/15 border border-[#514532] hover:border-[#FFB800] rounded text-[11px] font-mono text-[#ffdca1] transition-all cursor-pointer truncate"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="citizen@sahyogi.gov"
                className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-[#d5c4ab] mb-1 uppercase tracking-wider">
                  Role Assignment
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-[#0b0e14] border border-[#514532] rounded-xl p-3 text-[#e1e2eb] focus:border-[#FFB800] outline-none cursor-pointer"
                >
                  <option value="citizen">Citizen (Default Access)</option>
                  <option value="staff">Staff Officer (Manage Issues)</option>
                  <option value="admin">Municipal Admin (Full Control)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider mt-4 cursor-pointer"
            >
              {loading
                ? 'Authenticating...'
                : authMode === 'login'
                ? 'Sign In to Sahyogi'
                : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center mt-5 pt-4 border-t border-[#514532]/30 text-xs font-['Geist'] text-[#d5c4ab]">
            {authMode === 'login' ? (
              <div>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-[#FFB800] font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </div>
            ) : (
              <div>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-[#FFB800] font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
