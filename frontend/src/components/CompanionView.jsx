import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import NoticeSimplifierModal from './NoticeSimplifierModal.jsx';
import SchemeFinderModal from './SchemeFinderModal.jsx';

export default function CompanionView({
  initialMessage,
  onOpenNoticeSimplifier,
  onOpenSchemeFinder,
  onSelectService
}) {
  const { user, showToast } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('sess_live');
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        'Greetings, Citizen. I am Sahyogi AI, your secure companion for digital governance. I can help you find relevant services, simplify complex government notices, or guide you through reporting an issue.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Modals inside Companion
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [schemeModalOpen, setSchemeModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat session history from backend / mock
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await aiApi.getHistory();
        if (historyData && historyData.length > 0) {
          setSessions(historyData);
        } else {
          setSessions([
            {
              _id: 'chat_001',
              sessionId: 'sess_1',
              sessionTitle: 'Property Tax Assessment',
              timestamp: 'Today, 10:42 AM',
              messages: [
                { role: 'user', content: 'How do I calculate rebate for solar rooftop on property tax?' },
                {
                  role: 'assistant',
                  content:
                    'Under the Municipal Property Tax Assessment & Self-Declaration scheme, residential buildings with grid-connected solar rooftop panels or rainwater harvesting systems are eligible for an upfront 10% rebate on their annual property tax value. You will need your electricity net-metering synchronization certificate when applying.'
                }
              ]
            },
            {
              _id: 'chat_002',
              sessionId: 'sess_2',
              sessionTitle: 'Utility Bill Dispute Setup',
              timestamp: 'Today, 09:15 AM',
              messages: [
                { role: 'user', content: 'I need help understanding a utility dispute process. What are the required documents?' },
                {
                  role: 'assistant',
                  content:
                    'For a utility billing dispute, you need: 1) Your last 3 consecutive utility bills showing sudden variance, 2) Digital meter reading photograph with timestamp, 3) Current property ownership/tax receipt, and 4) A formal grievance declaration outlining the metering discrepancy.'
                }
              ]
            },
            {
              _id: 'chat_003',
              sessionId: 'sess_3',
              sessionTitle: 'Water Supply Registration',
              timestamp: 'Yesterday',
              messages: [
                { role: 'user', content: 'What is the fee for new water supply connection?' },
                {
                  role: 'assistant',
                  content:
                    'The initial deposit for a New Water & Sewerage Connection is ₹2,500, plus pipeline installation charges calculated on actual distance from the municipal main line. Processing usually takes 7 business days following engineer site inspection.'
                }
              ]
            }
          ]);
        }
      } catch {
        // ignore
      }
    };

    loadHistory();
  }, []);

  // Handle external initial prompt if passed
  useEffect(() => {
    if (initialMessage && initialMessage.trim().length > 0) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: `usr_msg_${Date.now()}`,
      role: 'user',
      content: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build history payload
      const historyPayload = messages
        .filter((m) => m.id !== 'msg_welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await aiApi.sendMessage(text.trim(), historyPayload);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_msg_${Date.now()}`,
          role: 'assistant',
          content: reply
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_msg_${Date.now()}`,
          role: 'assistant',
          content:
            'I have logged your request. For regulatory assistance regarding permits, welfare schemes, or municipal grievances, feel free to ask about specific guidelines.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewSession = () => {
    const newSessId = `sess_${Date.now()}`;
    setActiveSessionId(newSessId);
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        role: 'assistant',
        content:
          'New Governance Session started. How may I assist your civic or regulatory needs today?'
      }
    ]);
    showToast('New session started', 'info');
  };

  const handleSelectSession = (sess) => {
    setActiveSessionId(sess.sessionId);
    if (sess.messages && sess.messages.length > 0) {
      setMessages(
        sess.messages.map((m, idx) => ({
          id: `sess_m_${idx}`,
          role: m.role,
          content: m.content
        }))
      );
    }
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Speech recognition is simulated in this browser environment', 'info');
      setInputText('How do I apply for senior citizen pension?');
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (!isListening) {
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          showToast('Voice captured: ' + transcript, 'success');
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsListening(false);
      }
    } catch {
      setIsListening(false);
      setInputText('What are the documents needed for a passport application?');
    }
  };

  const promptChips = [
    'How do I apply for a permit?',
    'Report a pothole',
    'What welfare schemes exist for senior citizens?',
    'How to claim solar property tax rebate?'
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 pt-2 pb-12 flex flex-col min-h-[calc(100vh-160px)]">
      {/* Quick Action Bar at Top */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-[#10131a]/70 p-3 rounded-2xl border border-[#514532]/40 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono text-xs text-[#d5c4ab] uppercase tracking-wider">
            Sahyogi AI Intelligence Grid Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNoticeModalOpen(true)}
            className="btn-secondary px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">document_scanner</span>
            <span>Simplify Notice</span>
          </button>

          <button
            onClick={() => setSchemeModalOpen(true)}
            className="btn-secondary px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">explore</span>
            <span>Find Services</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
        {/* Left Column: Session History (Desktop Sidebar) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col glass-panel rounded-2xl p-4 border border-[#514532]/40 max-h-[640px] overflow-hidden">
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-[#514532]/30">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#d5c4ab]">
              Session History
            </h3>
            <button
              onClick={handleNewSession}
              className="p-1 rounded-lg bg-[#191c22] border border-[#514532] text-[#d5c4ab] hover:text-[#FFB800] hover:border-[#FFB800] transition-colors cursor-pointer"
              title="Start New Session"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {/* Live Session */}
            <button
              onClick={() => setActiveSessionId('sess_live')}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                activeSessionId === 'sess_live'
                  ? 'bg-[#FFB800]/15 border-[#FFB800] shadow-[0_0_12px_rgba(255,184,0,0.15)]'
                  : 'bg-[#191c22]/40 border-transparent hover:border-[#514532]'
              }`}
            >
              <div className="font-['Sora'] text-xs font-bold text-[#ffdca1] truncate">
                Current Active Session
              </div>
              <div className="font-mono text-[10px] text-[#9e8f78] mt-1">Live</div>
            </button>

            {sessions.map((sess) => {
              const isActive = activeSessionId === sess.sessionId;
              return (
                <button
                  key={sess.sessionId}
                  onClick={() => handleSelectSession(sess)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#FFB800]/15 border-[#FFB800] shadow-[0_0_12px_rgba(255,184,0,0.15)]'
                      : 'bg-[#191c22]/40 border-transparent hover:border-[#514532]'
                  }`}
                >
                  <div className="font-['Sora'] text-xs font-bold text-[#ffdca1] truncate">
                    {sess.sessionTitle}
                  </div>
                  <div className="font-mono text-[10px] text-[#9e8f78] mt-1">
                    {sess.timestamp}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Interactive Chat Canvas */}
        <section className="lg:col-span-9 flex flex-col glass-panel rounded-2xl p-4 sm:p-6 border border-[#514532]/40 relative min-h-[580px] justify-between">
          {/* Ambient Background Radial */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#FFB800]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[460px]">
            {messages.map((msg) => {
              const isAi = msg.role === 'assistant';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-3 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-full bg-[#FFB800]/20 border border-[#FFB800]/60 flex items-center justify-center text-[#FFB800] shrink-0 mt-1 shadow-[0_0_10px_rgba(255,184,0,0.2)]">
                      <span className="material-symbols-outlined text-base">smart_toy</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl font-['Geist'] text-sm leading-relaxed ${
                      isAi
                        ? 'chat-bubble-ai text-[#e1e2eb]'
                        : 'chat-bubble-user text-[#ffdca1] rounded-tr-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>

                    {/* Show Prompt Chips on Welcome Message */}
                    {msg.id === 'msg_welcome' && (
                      <div className="mt-4 pt-3 border-t border-[#FFB800]/20 flex flex-wrap gap-2">
                        {promptChips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(chip)}
                            className="bg-[#10131a] hover:bg-[#FFB800]/15 border border-[#514532] hover:border-[#FFB800] text-xs font-mono text-[#d5c4ab] hover:text-[#ffdca1] px-3 py-1.5 rounded-full transition-all cursor-pointer text-left"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-full bg-[#32353c] border border-[#514532] flex items-center justify-center text-[#d5c4ab] shrink-0 mt-1">
                      <span className="material-symbols-outlined text-base">person</span>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFB800]/20 border border-[#FFB800]/60 flex items-center justify-center text-[#FFB800] shrink-0">
                  <span className="material-symbols-outlined text-base">smart_toy</span>
                </div>
                <div className="chat-bubble-ai px-4 py-3 rounded-2xl flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFB800] typing-dot"></span>
                  <span className="w-2 h-2 rounded-full bg-[#FFB800] typing-dot"></span>
                  <span className="w-2 h-2 rounded-full bg-[#FFB800] typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <div className="mt-4 pt-4 border-t border-[#514532]/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="glow-focus flex items-center gap-2 bg-[#0b0e14] border border-[#514532] rounded-2xl p-2 sm:p-2.5 transition-all"
            >
              <textarea
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your query securely..."
                className="w-full bg-transparent border-none text-[#e1e2eb] font-['Geist'] text-sm px-3 py-1 outline-none resize-none placeholder:text-[#d5c4ab]/50"
              />

              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : 'bg-[#191c22] border-[#514532] text-[#d5c4ab] hover:text-[#FFB800] hover:border-[#FFB800]'
                }`}
                title="Dictate with voice"
              >
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn-primary p-2.5 rounded-xl font-bold flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>

            <div className="mt-2 text-center text-[10px] font-mono text-[#9e8f78]">
              AI responses are generated based on official catalog data. Verification is recommended.
            </div>
          </div>
        </section>
      </div>

      {/* Embedded Modals for Notice Simplifier and Scheme Finder */}
      <NoticeSimplifierModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
      />

      <SchemeFinderModal
        isOpen={schemeModalOpen}
        onClose={() => setSchemeModalOpen(false)}
        onSelectService={onSelectService}
      />
    </div>
  );
}
