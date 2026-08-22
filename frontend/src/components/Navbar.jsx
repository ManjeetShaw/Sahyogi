import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ activeTab, setActiveTab, onOpenNoticeSimplifier, onOpenSchemeFinder }) {
  const { user, setAuthModalOpen, setAuthMode, switchRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'services', label: 'SERVICES' },
    { id: 'issues', label: 'ISSUES' },
    { id: 'companion', label: 'COMPANION' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#10131a]/80 backdrop-blur-xl border-b border-[#514532]/40 h-[80px] transition-all">
      <div className="max-w-[1280px] mx-auto h-full px-4 sm:px-8 lg:px-16 flex justify-between items-center">
        {/* Brand */}
        <button
          onClick={() => {
            setActiveTab('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <span
            className="material-symbols-outlined text-[#FFB800] text-3xl group-hover:scale-110 transition-transform duration-300"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            language
          </span>
          <span className="font-['Sora'] text-2xl font-bold tracking-tighter text-[#ffdca1] group-hover:text-[#FFB800] transition-colors">
            Sahyogi
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`font-mono text-xs uppercase tracking-widest transition-all duration-300 relative py-1 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-[#ffdca1] font-bold border-b-2 border-[#FFB800]'
                    : 'text-[#d5c4ab]/80 hover:text-[#ffdca1]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section Actions & User / Role Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Role Switcher Pill for Testing */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191c22] border border-[#514532] hover:border-[#FFB800]/60 text-xs font-mono tracking-wider text-[#d5c4ab] transition-all cursor-pointer"
                title="Click to simulate Citizen, Staff, or Admin permissions"
              >
                <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"></span>
                <span className="uppercase">{user.role}</span>
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel bg-[#10131a]/95 border border-[#514532] shadow-2xl py-2 z-50 font-mono text-xs">
                  <div className="px-3 py-1 text-[10px] uppercase text-[#9e8f78] border-b border-[#514532]/50">
                    Switch Test Role
                  </div>
                  <button
                    onClick={() => {
                      switchRole('citizen');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#FFB800]/10 flex items-center justify-between ${
                      user.role === 'citizen' ? 'text-[#FFB800] font-bold' : 'text-[#e1e2eb]'
                    }`}
                  >
                    <span>Citizen</span>
                    {user.role === 'citizen' && <span className="material-symbols-outlined text-sm">check</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('staff');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#FFB800]/10 flex items-center justify-between ${
                      user.role === 'staff' ? 'text-[#FFB800] font-bold' : 'text-[#e1e2eb]'
                    }`}
                  >
                    <span>Staff Officer</span>
                    {user.role === 'staff' && <span className="material-symbols-outlined text-sm">check</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#FFB800]/10 flex items-center justify-between ${
                      user.role === 'admin' ? 'text-[#FFB800] font-bold' : 'text-[#e1e2eb]'
                    }`}
                  >
                    <span>Municipal Admin</span>
                    {user.role === 'admin' && <span className="material-symbols-outlined text-sm">check</span>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Profile / Dashboard button */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`font-mono text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#FFB800] bg-[#FFB800]/15 text-[#ffdca1] shadow-[0_0_12px_rgba(255,184,0,0.2)]'
                : 'border-[#514532] text-[#d5c4ab] hover:border-[#FFB800]/50 hover:text-[#ffdca1]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Sign In / User Status */}
          {user ? (
            <button
              onClick={() => {
                setActiveTab('profile');
              }}
              className="btn-primary font-mono text-xs uppercase tracking-widest px-4 sm:px-6 py-2 rounded-full font-bold cursor-pointer truncate max-w-[140px]"
            >
              {user.name.split(' ')[0]}
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="btn-primary font-mono text-xs uppercase tracking-widest px-4 sm:px-6 py-2 rounded-full font-bold cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#ffdca1] p-2 rounded-lg hover:bg-[#1A1F2C] focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel bg-[#10131a]/95 border-b border-[#514532] px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left font-mono text-sm uppercase tracking-wider py-2 transition-colors ${
                activeTab === link.id ? 'text-[#FFB800] font-bold' : 'text-[#d5c4ab]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#514532]/40 flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenNoticeSimplifier();
                setMobileMenuOpen(false);
              }}
              className="btn-secondary py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">document_scanner</span>
              Simplify Notice
            </button>
            <button
              onClick={() => {
                onOpenSchemeFinder();
                setMobileMenuOpen(false);
              }}
              className="btn-secondary py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              Find Schemes
            </button>

            {user && (
              <div className="flex items-center justify-between text-xs font-mono text-[#9e8f78] pt-2">
                <span>Active Role: <strong className="text-[#FFB800] uppercase">{user.role}</strong></span>
                <button
                  onClick={() => {
                    const nextRole = user.role === 'citizen' ? 'staff' : user.role === 'staff' ? 'admin' : 'citizen';
                    switchRole(nextRole);
                  }}
                  className="text-[#ffdca1] underline"
                >
                  Change Role
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
