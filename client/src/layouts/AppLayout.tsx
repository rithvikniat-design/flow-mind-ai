import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  MessageSquare,
  Network,
  GitFork,
  BarChart3,
  FileText,
  Database,
  Brain,
  Sliders,
  LogOut,
  Search,
  Sun,
  Moon,
  Mic,
  MicOff,
  Wifi,
  WifiOff,
  Bell,
  X,
  Sparkles,
  Menu
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation Items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Workspace', path: '/workspace', icon: MessageSquare },
    { name: 'Agent Collaboration', path: '/collaboration', icon: Network },
    { name: 'Workflow Builder', path: '/builder', icon: GitFork },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Knowledge Base', path: '/kb', icon: Database },
    { name: 'AI Memory', path: '/memory', icon: Brain },
    { name: 'Admin Panel', path: '/admin', icon: Sliders },
    { name: 'Settings', path: '/settings', icon: Sliders },
  ];

  // Offline detection
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Keyboard Command Palette State (Cmd+K or Ctrl+K)
  const [showPalette, setShowPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Voice Assistant state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleVoice = () => {
    if (isVoiceActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsVoiceActive(false);
      setShowVoiceModal(false);
    } else {
      setIsVoiceActive(true);
      setShowVoiceModal(true);
      setVoiceTranscript('Listening for Anti-Gravity goal commands...');

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setVoiceTranscript(`"${text}"`);
          speak(`Processing Goal: ${text}`);
          
          setTimeout(() => {
            setShowVoiceModal(false);
            setIsVoiceActive(false);
            navigate(`/workspace?goal=${encodeURIComponent(text)}`);
          }, 2000);
        };

        recognition.onerror = () => {
          setVoiceTranscript('Voice recognition error. Try speaking again.');
          setIsVoiceActive(false);
        };

        recognition.onend = () => {
          setIsVoiceActive(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        const sampleGoals = [
          'Deploy zero-gravity multi-agent swarm',
          'Execute enterprise data suite security audit',
          'Optimize outbound sales conversion funnels'
        ];
        const chosen = sampleGoals[Math.floor(Math.random() * sampleGoals.length)];
        setVoiceTranscript(`(Simulated) "${chosen}"`);
        speak(`Processing Goal: ${chosen}`);
        setTimeout(() => {
          setShowVoiceModal(false);
          setIsVoiceActive(false);
          navigate(`/workspace?goal=${encodeURIComponent(chosen)}`);
        }, 2000);
      }
    }
  };

  const speak = (msg: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredCommands = navItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-obsidian-bg text-slate-100 relative font-sans overflow-x-hidden">
      {/* Dynamic glow background spots for high tech telemetry */}
      <div className="absolute top-20 left-10 w-72 sm:w-96 h-72 sm:h-96 glow-bg-indigo pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] glow-bg-pink pointer-events-none"></div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 obsidian-card border-r border-obsidian-border bg-obsidian-card flex-col z-20 sticky top-0 h-screen shrink-0">
        <div className="p-5 border-b border-obsidian-border flex items-center space-x-3">
          <div className="w-9 h-9 rounded-sharp bg-royal-500 flex items-center justify-center font-bold text-lg shadow-md shadow-royal-500/20 text-white">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center space-x-1">
              <span>FlowMind OS</span>
            </h1>
            <span className="text-[9px] text-royal-400 font-mono font-bold uppercase tracking-widest block">
              ENTERPRISE OBSIDIAN
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 mx-4 mt-4 mb-2 rounded-sharp bg-obsidian-bg border border-obsidian-border flex items-center space-x-3">
          <div className="w-7 h-7 rounded-sharp bg-royal-500 flex items-center justify-center font-bold text-xs text-white">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate text-white">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] font-mono text-slate-400 truncate">{user?.email || 'admin@flowmind.ai'}</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-sharp text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-royal-500 text-white shadow-md shadow-royal-500/20'
                    : 'text-slate-400 hover:bg-obsidian-hover hover:text-white'
                }`}
              >
                <Icon size={15} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-obsidian-border flex flex-col space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono px-1 text-slate-400">
            <span className="flex items-center">
              {isOnline ? (
                <>
                  <Wifi size={11} className="text-emerald-status mr-1.5" />
                  Live Sync
                </>
              ) : (
                <>
                  <WifiOff size={11} className="text-rose-500 mr-1.5" />
                  Offline
                </>
              )}
            </span>
            <kbd className="px-1.5 py-0.5 rounded-sharp bg-obsidian-bg border border-obsidian-border text-[9px] text-slate-400">
              Ctrl+K
            </kbd>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2.5 w-full px-3.5 py-2 rounded-sharp text-xs font-semibold text-slate-400 hover:bg-rose-950/30 hover:text-rose-400 transition-all"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Out Drawer Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] obsidian-card border-r border-obsidian-border bg-obsidian-card flex flex-col z-50 h-full">
            <div className="p-4 border-b border-obsidian-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-sharp bg-royal-500 flex items-center justify-center font-bold text-base text-white">
                  ⚡
                </div>
                <h1 className="font-extrabold text-sm text-white">FlowMind OS</h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-sharp"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile User Card */}
            <div className="p-3 mx-3 mt-3 rounded-sharp bg-obsidian-bg border border-obsidian-border flex items-center space-x-3">
              <div className="w-7 h-7 rounded-sharp bg-royal-500 flex items-center justify-center font-bold text-xs text-white">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] font-mono text-slate-400 truncate">{user?.email || 'admin@flowmind.ai'}</p>
              </div>
            </div>

            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-3 rounded-sharp text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-royal-500 text-white shadow-md shadow-royal-500/20'
                        : 'text-slate-400 hover:bg-obsidian-hover hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-obsidian-border">
              <button
                onClick={logout}
                className="flex items-center space-x-2.5 w-full px-3.5 py-2.5 rounded-sharp text-xs font-semibold text-slate-400 hover:bg-rose-950/30 hover:text-rose-400 transition-all"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Responsive Header Bar */}
        <header className="h-16 border-b border-obsidian-border px-4 sm:px-8 flex items-center justify-between sticky top-0 backdrop-blur-md bg-obsidian-bg/90 z-10">
          <div className="flex items-center space-x-3">
            {/* Hamburger Button for Mobile/Tablet */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-sharp border border-obsidian-border bg-obsidian-card text-slate-300 hover:text-white hover:border-royal-500 touch-target flex items-center justify-center"
              aria-label="Open Mobile Menu"
            >
              <Menu size={18} />
            </button>

            {/* Command Palette Trigger Input */}
            <div
              onClick={() => setShowPalette(true)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-sharp bg-obsidian-card border border-obsidian-border text-xs text-slate-400 cursor-pointer w-44 sm:w-72 hover:border-royal-500 transition-all font-mono"
            >
              <Search size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">Search (Ctrl+K)...</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sharp border border-obsidian-border bg-obsidian-card text-slate-300 hover:text-white hover:border-royal-500 transition-all"
              title="Toggle theme mode"
            >
              {theme === 'obsidian' ? <Sparkles size={15} className="text-royal-400" /> : theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <div className="relative">
              <button
                className="p-2 rounded-sharp border border-obsidian-border bg-obsidian-card text-slate-300 hover:text-white hover:border-royal-500 transition-all relative"
                title="Notifications"
              >
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-status"></span>
              </button>
            </div>

            <div className="hidden sm:block h-5 w-[1px] bg-obsidian-border"></div>

            <span className="hidden md:flex text-[11px] font-mono font-bold text-emerald-400 items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-status animate-ping"></span>
              <span>Clean Data Suite v2.0</span>
            </span>
          </div>
        </header>

        {/* Content Render Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-0">
          {children}
        </main>
      </div>

      {/* Floating Voice Assistant Trigger */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={toggleVoice}
          className={`w-12 h-12 rounded-sharp flex items-center justify-center shadow-xl transition-all ${
            isVoiceActive
              ? 'bg-rose-500 text-white shadow-rose-500/25'
              : 'bg-royal-500 text-white hover:bg-royal-600 shadow-royal-500/25'
          }`}
          title="Talk to Voice Assistant"
        >
          {isVoiceActive ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>

      {/* Voice Assistant Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md obsidian-card p-6 rounded-sharp text-center relative border border-royal-500 bg-obsidian-card">
            <button
              onClick={() => {
                setShowVoiceModal(false);
                setIsVoiceActive(false);
                if (recognitionRef.current) recognitionRef.current.stop();
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="w-16 h-16 mx-auto mb-4 rounded-sharp bg-royal-500 flex items-center justify-center shadow-lg relative">
              <Mic size={28} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">FlowMind Voice Dispatch</h3>
            <p className="text-xs text-slate-400 mb-4">State your prompt objective for zero-gravity multi-agent execution.</p>
            <div className="p-3 rounded-sharp bg-obsidian-bg border border-obsidian-border text-xs font-mono font-semibold text-royal-400 italic min-h-[44px] flex items-center justify-center">
              {voiceTranscript}
            </div>
          </div>
        </div>
      )}

      {/* Command Palette Portal */}
      {showPalette && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] px-4">
          <div className="w-full max-w-lg obsidian-card rounded-sharp overflow-hidden border border-obsidian-border bg-obsidian-card">
            <div className="p-4 border-b border-obsidian-border flex items-center space-x-3 bg-obsidian-bg">
              <Search className="text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Type a page name to navigate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-white text-xs focus:outline-none w-full font-mono"
                autoFocus
              />
              <kbd className="px-1.5 py-0.5 rounded-sharp bg-obsidian-card text-[10px] text-slate-400 font-mono">ESC</kbd>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.name}
                      onClick={() => {
                        navigate(cmd.path);
                        setShowPalette(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 rounded-sharp text-xs font-semibold text-slate-300 hover:bg-royal-500 hover:text-white flex items-center space-x-3 transition-colors"
                    >
                      <Icon size={14} />
                      <span>Go to {cmd.name}</span>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">No commands matching &ldquo;{searchQuery}&rdquo;</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

