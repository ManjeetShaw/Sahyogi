import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, servicesApi, getStoredToken, getStoredUser } from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [savedServiceIds, setSavedServiceIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.msg === msg ? null : prev));
    }, 4000);
  };

  // Initial session loader
  useEffect(() => {
    const initializeAuth = async () => {
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
      } else {
        // Provide a default active Citizen for a seamless exploratory experience
        const defaultUser = {
          id: 'usr_citizen_01',
          name: 'Alex Rivera',
          email: 'alex.rivera@sahyogi.gov',
          role: 'citizen',
          createdAt: new Date().toISOString()
        };
        setUser(defaultUser);
      }
      setLoading(false);
      loadSavedServices();
    };

    initializeAuth();
  }, []);

  const loadSavedServices = async () => {
    try {
      const saved = await servicesApi.getSavedServices();
      setSavedServiceIds(saved.map((s) => s._id));
    } catch {
      // ignore
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      setToken(data.token);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      loadSavedServices();
      return true;
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (name, email, password, role = 'citizen') => {
    try {
      const data = await authApi.register(name, email, password, role);
      setUser(data.user);
      setToken(data.token);
      showToast(`Account registered successfully! Welcome to Sahyogi.`, 'success');
      loadSavedServices();
      return true;
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  const switchRole = (newRole) => {
    if (!user) return;
    let newName = user.name;
    if (newRole === 'admin') newName = 'Municipal Administrator';
    else if (newRole === 'staff') newName = 'Officer Priya';
    else newName = 'Alex Rivera';

    const updatedUser = {
      ...user,
      name: newName,
      role: newRole
    };
    setUser(updatedUser);
    localStorage.setItem('sahyogi_user', JSON.stringify(updatedUser));
    showToast(`Role switched to ${newRole.toUpperCase()}`, 'info');
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
    setSavedServiceIds([]);
    showToast('Logged out of session', 'info');
  };

  const toggleSaveService = async (serviceId) => {
    const isSaved = savedServiceIds.includes(serviceId);
    if (isSaved) {
      setSavedServiceIds((prev) => prev.filter((id) => id !== serviceId));
      await servicesApi.unsaveService(serviceId);
      showToast('Removed from saved bookmarks', 'info');
    } else {
      setSavedServiceIds((prev) => [...prev, serviceId]);
      await servicesApi.saveService(serviceId);
      showToast('Service bookmarked securely', 'success');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        savedServiceIds,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        register,
        logout,
        switchRole,
        toggleSaveService,
        showToast,
        toastMessage
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`glass-panel border px-5 py-3 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
              toastMessage.type === 'error'
                ? 'border-red-500/50 text-red-200 bg-red-950/80'
                : toastMessage.type === 'success'
                ? 'border-[#FFB800]/50 text-[#FFDCA1] bg-[#1A1F2C]/90'
                : 'border-[#514532] text-[#e1e2eb] bg-[#10131a]/90'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ color: toastMessage.type === 'error' ? '#ff8080' : '#FFB800' }}
            >
              {toastMessage.type === 'error' ? 'error' : toastMessage.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span className="font-mono text-xs md:text-sm tracking-wide">{toastMessage.msg}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
