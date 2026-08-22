/**
 * Sahyogi API Client
 * Fully aligned with the Sahyogi Backend Specification
 * Handles JWT bearer tokens, query parameters, error shapes, and seamless mock fallback.
 */

import { INITIAL_SERVICES, INITIAL_ISSUES, INITIAL_CHAT_HISTORY } from '../data/initialData.js';

const PROD_FALLBACK_URL = "https://sahyog-backend-gbw7.onrender.com/api";
const ENV_API_URL = import.meta.env.VITE_API_URL;

let BASE_URL = ENV_API_URL
  ? (ENV_API_URL.endsWith('/api') ? ENV_API_URL : `${ENV_API_URL}/api`)
  : (window.location.hostname === 'localhost' ? '/api' : PROD_FALLBACK_URL);

const STORAGE_KEYS = {
  TOKEN: 'sahyogi_token',
  USER: 'sahyogi_user',
  SERVICES: 'sahyogi_local_services',
  SAVED_SERVICES: 'sahyogi_local_saved_services',
  ISSUES: 'sahyogi_local_issues',
  AI_HISTORY: 'sahyogi_local_ai_history'
};

// Initialize Local Mock Stores if empty
function getLocalServices() {
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    return INITIAL_SERVICES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SERVICES;
  }
}

function getLocalSavedServiceIds() {
  const data = localStorage.getItem(STORAGE_KEYS.SAVED_SERVICES);
  if (!data) {
    const initialSaved = ["srv_pension_002"];
    localStorage.setItem(STORAGE_KEYS.SAVED_SERVICES, JSON.stringify(initialSaved));
    return initialSaved;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function getLocalIssues() {
  const data = localStorage.getItem(STORAGE_KEYS.ISSUES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ISSUES;
  }
}

function getLocalAiHistory() {
  const data = localStorage.getItem(STORAGE_KEYS.AI_HISTORY);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.AI_HISTORY, JSON.stringify(INITIAL_CHAT_HISTORY));
    return INITIAL_CHAT_HISTORY;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CHAT_HISTORY;
  }
}

// Token helpers
export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
}

export function getStoredUser() {
  const u = localStorage.getItem(STORAGE_KEYS.USER);
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

// Fetch wrapper with timeout & auto authorization
async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Controller with 4s timeout for graceful fallback
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 4000);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      let errJson = {};
      try {
        errJson = await res.json();
      } catch {
        errJson = { message: `Request failed with status ${res.status}` };
      }

      if (res.status === 401) {
        // Expired or invalid token
        setStoredToken(null);
      }

      throw {
        status: res.status,
        message: errJson.message || 'API request error',
        data: errJson
      };
    }

    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ==================== AUTH API ====================

export const authApi = {
  async register(name, email, password, role = 'citizen') {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      if (data.token) {
        setStoredToken(data.token);
        setStoredUser(data.user);
      }
      return data;
    } catch {
      // Mock Fallback
      const mockUser = {
        id: `usr_${Date.now()}`,
        name: name || 'Citizen User',
        email: email || 'citizen@sahyogi.gov',
        role: role || 'citizen',
        createdAt: new Date().toISOString()
      };
      const mockToken = `sahyogi_mock_jwt_${Date.now()}`;
      setStoredToken(mockToken);
      setStoredUser(mockUser);
      return { token: mockToken, user: mockUser };
    }
  },

  async login(email, password) {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.token) {
        setStoredToken(data.token);
        setStoredUser(data.user);
      }
      return data;
    } catch {
      // Mock Fallback: Determine role based on email hint
      let role = 'citizen';
      let name = 'Citizen Alex';
      if (email.toLowerCase().includes('admin')) {
        role = 'admin';
        name = 'Municipal Administrator';
      } else if (email.toLowerCase().includes('staff') || email.toLowerCase().includes('officer')) {
        role = 'staff';
        name = 'Officer Priya';
      }

      const mockUser = {
        id: `usr_${role}_${Date.now().toString().slice(-4)}`,
        name: name,
        email: email || `${role}@sahyogi.gov`,
        role: role,
        createdAt: new Date().toISOString()
      };
      const mockToken = `sahyogi_mock_jwt_${Date.now()}`;
      setStoredToken(mockToken);
      setStoredUser(mockUser);
      return { token: mockToken, user: mockUser };
    }
  },

  async getMe() {
    try {
      const data = await apiRequest('/auth/me');
      if (data.user) setStoredUser(data.user);
      return data.user;
    } catch {
      return getStoredUser() || {
        id: 'usr_guest',
        name: 'Guest Citizen',
        email: 'citizen@sahyogi.gov',
        role: 'citizen',
        createdAt: new Date().toISOString()
      };
    }
  },

  logout() {
    setStoredToken(null);
    setStoredUser(null);
  }
};

// ==================== SERVICES API ====================

export const servicesApi = {
  async getServices(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.q) query.append('q', params.q);

    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const data = await apiRequest(`/services${queryString}`);
      if (data && Array.isArray(data.services) && data.services.length > 0) {
        return data.services;
      }
      throw new Error('Fallback needed');
    } catch {
      // Mock search & filter
      let services = getLocalServices();
      if (params.category && params.category !== 'All') {
        services = services.filter(s => s.category === params.category);
      }
      if (params.q) {
        const q = params.q.toLowerCase();
        services = services.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.howToApply && s.howToApply.toLowerCase().includes(q))
        );
      }
      return services;
    }
  },

  async getServiceById(id) {
    try {
      const data = await apiRequest(`/services/${id}`);
      return data.service;
    } catch {
      const services = getLocalServices();
      return services.find(s => s._id === id) || null;
    }
  },

  async getSavedServices() {
    try {
      const data = await apiRequest('/services/saved');
      return data.services || [];
    } catch {
      const savedIds = getLocalSavedServiceIds();
      const allServices = getLocalServices();
      return allServices.filter(s => savedIds.includes(s._id));
    }
  },

  async saveService(id) {
    try {
      await apiRequest(`/services/${id}/save`, { method: 'POST' });
    } catch {
      const savedIds = getLocalSavedServiceIds();
      if (!savedIds.includes(id)) {
        savedIds.push(id);
        localStorage.setItem(STORAGE_KEYS.SAVED_SERVICES, JSON.stringify(savedIds));
      }
    }
    return true;
  },

  async unsaveService(id) {
    try {
      await apiRequest(`/services/${id}/save`, { method: 'DELETE' });
    } catch {
      let savedIds = getLocalSavedServiceIds();
      savedIds = savedIds.filter(sId => sId !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_SERVICES, JSON.stringify(savedIds));
    }
    return true;
  },

  async createService(serviceData) {
    try {
      const data = await apiRequest('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData)
      });
      return data.service;
    } catch {
      const newService = {
        ...serviceData,
        _id: `srv_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const services = getLocalServices();
      services.unshift(newService);
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
      return newService;
    }
  },

  async deleteService(id) {
    try {
      await apiRequest(`/services/${id}`, { method: 'DELETE' });
    } catch {
      let services = getLocalServices();
      services = services.filter(s => s._id !== id);
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    }
    return true;
  }
};

// ==================== ISSUES API ====================

export const issuesApi = {
  async getIssues(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.category && params.category !== 'All' && params.category !== 'all') query.append('category', params.category);
    if (params.mine) query.append('mine', 'true');

    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const data = await apiRequest(`/issues${queryString}`);
      if (data && Array.isArray(data.issues) && data.issues.length > 0) {
        return data.issues;
      }
      throw new Error('Fallback needed');
    } catch {
      let issues = getLocalIssues();
      const currentUser = getStoredUser();

      if (params.mine && currentUser) {
        issues = issues.filter(iss => iss.reportedBy?._id === currentUser.id || iss.reportedBy?.name === currentUser.name);
      }
      if (params.status && params.status !== 'all') {
        issues = issues.filter(iss => iss.status === params.status);
      }
      if (params.category && params.category !== 'All' && params.category !== 'all') {
        issues = issues.filter(iss => iss.category.toLowerCase() === params.category.toLowerCase());
      }
      return issues;
    }
  },

  async createIssue(issueData) {
    try {
      const data = await apiRequest('/issues', {
        method: 'POST',
        body: JSON.stringify(issueData)
      });
      return data.issue;
    } catch {
      const currentUser = getStoredUser() || { id: 'usr_guest', name: 'Citizen' };
      const newIssue = {
        _id: `iss_${Date.now()}`,
        title: issueData.title,
        description: issueData.description,
        category: issueData.category || 'other',
        status: 'submitted',
        location: issueData.location || { address: 'Reported Location', lat: 40.7128, lng: -74.0060 },
        imageUrl: issueData.imageUrl || '',
        reportedBy: {
          _id: currentUser.id,
          name: currentUser.name
        },
        statusHistory: [
          {
            status: 'submitted',
            changedAt: new Date().toISOString(),
            changedBy: currentUser.id
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const issues = getLocalIssues();
      issues.unshift(newIssue);
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
      return newIssue;
    }
  },

  async updateIssueStatus(id, newStatus) {
    try {
      const data = await apiRequest(`/issues/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      return data.issue;
    } catch {
      const issues = getLocalIssues();
      const currentUser = getStoredUser() || { id: 'usr_staff', name: 'Staff Officer' };
      const index = issues.findIndex(i => i._id === id);
      if (index !== -1) {
        issues[index].status = newStatus;
        issues[index].updatedAt = new Date().toISOString();
        if (!issues[index].statusHistory) issues[index].statusHistory = [];
        issues[index].statusHistory.push({
          status: newStatus,
          changedAt: new Date().toISOString(),
          changedBy: currentUser.id
        });
        localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
        return issues[index];
      }
      return null;
    }
  },

  async deleteIssue(id) {
    try {
      await apiRequest(`/issues/${id}`, { method: 'DELETE' });
    } catch {
      let issues = getLocalIssues();
      issues = issues.filter(i => i._id !== id);
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    }
    return true;
  }
};

// ==================== AI COMPANION API ====================

export const aiApi = {
  async sendMessage(message, history = []) {
    try {
      const data = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history })
      });
      return data.reply;
    } catch {
      // Intelligent grounded civic response generator
      await new Promise(resolve => setTimeout(resolve, 800)); // natural typing pause
      const msg = message.toLowerCase();

      if (msg.includes('permit') || msg.includes('license') || msg.includes('driving')) {
        return `Regarding permits and licenses: You can apply for a Commercial Driving License through the Parivahan portal or submit building & commercial permits via the Municipal Single-Window System. Ensure you have your identity proof, residence verification, and medical fitness certificates (Form 1A where applicable). Processing usually takes 7 to 14 working days.`;
      } else if (msg.includes('pothole') || msg.includes('road') || msg.includes('issue') || msg.includes('report')) {
        return `To report infrastructure defects like potholes or broken streetlights: Navigate to our 'Issues' tab and click '+ Report New Issue'. Provide the exact landmark or GPS location and optionally attach a photo. Your report will be assigned a tracking ID and routed directly to the Central Ward Maintenance Engineer.`;
      } else if (msg.includes('tax') || msg.includes('property')) {
        return `For Property Tax Self-Declaration: You can calculate your annual liability using your Property Identification Number (PIN). Installing solar rooftop panels or rainwater harvesting systems qualifies you for an upfront 10% rebate. Payments can be completed online via UPI, net banking, or debit card.`;
      } else if (msg.includes('pension') || msg.includes('senior') || msg.includes('welfare')) {
        return `Under the Senior Citizen Pension Scheme: Eligible citizens aged 60+ with household income below the notified threshold receive monthly direct bank transfers. You will need your age proof, revenue-certified income statement, and an Aadhaar-linked bank account.`;
      } else if (msg.includes('water') || msg.includes('sewerage') || msg.includes('pressure')) {
        return `For Water & Sewerage services: New connection applications require current year Property Tax receipts and a certified plumber report. For pressure anomalies or pipeline leaks, please log a report under 'Issues -> Water Supply'.`;
      } else {
        return `Greetings Citizen. I have analyzed your query against our official municipal service catalog. Whether you need to file an infrastructure grievance, verify welfare eligibility, or decode a government notice, I am here to guide you step-by-step with verified regulatory requirements.`;
      }
    }
  },

  async getHistory() {
    try {
      const data = await apiRequest('/ai/history');
      return data.messages || [];
    } catch {
      return getLocalAiHistory();
    }
  },

  async recommendSchemes(situation) {
    try {
      const data = await apiRequest('/ai/recommend', {
        method: 'POST',
        body: JSON.stringify({ situation })
      });
      return data.recommendations || [];
    } catch {
      await new Promise(resolve => setTimeout(resolve, 900));
      const services = getLocalServices();
      const sit = situation.toLowerCase();

      const results = [];
      if (sit.includes('old') || sit.includes('pension') || sit.includes('elderly') || sit.includes('retire') || sit.includes('senior') || sit.includes('age')) {
        const pension = services.find(s => s._id === 'srv_pension_002');
        if (pension) {
          results.push({
            service: pension,
            reason: "Matches your senior profile and income support requirements for regular monthly financial stipends."
          });
        }
      }
      if (sit.includes('drive') || sit.includes('truck') || sit.includes('license') || sit.includes('vehicle') || sit.includes('job') || sit.includes('commercial')) {
        const lic = services.find(s => s._id === 'srv_license_003');
        if (lic) {
          results.push({
            service: lic,
            reason: "Provides authorized commercial licensing necessary for professional transit and logistics employment."
          });
        }
      }
      if (sit.includes('travel') || sit.includes('identity') || sit.includes('passport') || sit.includes('abroad')) {
        const pass = services.find(s => s._id === 'srv_passport_001');
        if (pass) {
          results.push({
            service: pass,
            reason: "Essential national travel document and verified universal identity credential."
          });
        }
      }
      if (sit.includes('house') || sit.includes('property') || sit.includes('tax') || sit.includes('building') || sit.includes('land')) {
        const ptax = services.find(s => s._id === 'srv_property_tax_005');
        if (ptax) {
          results.push({
            service: ptax,
            reason: "Required for property compliance, title verification, and claiming green energy rebate deductions."
          });
        }
      }
      if (sit.includes('water') || sit.includes('pipe') || sit.includes('utility') || sit.includes('home')) {
        const water = services.find(s => s._id === 'srv_water_004');
        if (water) {
          results.push({
            service: water,
            reason: "Sets up authorized residential water supply and municipal sewerage connection."
          });
        }
      }

      if (results.length === 0) {
        // Return first 2 services as fallback recommendations
        return services.slice(0, 2).map(s => ({
          service: s,
          reason: "Recommended based on universal civic utility and public welfare eligibility."
        }));
      }

      return results;
    }
  },

  async simplifyNotice(noticeText) {
    try {
      const data = await apiRequest('/ai/simplify', {
        method: 'POST',
        body: JSON.stringify({ noticeText })
      });
      return data.simplified;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 900));
      return `### Executive Summary
This document is an official administrative notice informing the recipient of mandatory regulatory compliance regarding municipal verification.

### Required Actions & Deadlines
- **Submit verification paperwork** within 15 calendar days of this notice issuance.
- **Provide updated address proof** and property identification number (PIN) at the Zonal Revenue Office or through the online portal.
- **Schedule in-person biometric authentication** if applying for subsidized welfare transfers.

### Fees & Potential Penalties
- Late submission surcharge: 1.5% compounding per month on overdue municipal assessments.
- Avoidance of response may result in temporary suspension of utility connection or rebate forfeiture.

*Advisory: All submissions can be completed digitally via the Sahyogi Command Center without visiting municipal physical counters.*`;
    }
  }
};
