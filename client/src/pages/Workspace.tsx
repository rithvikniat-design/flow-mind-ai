import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { projectService, kbService } from '../services/api';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { AnimatedCounter } from '../components/AnimatedCounter';
import {
  ArrowRight,
  Upload,
  Plus,
  FileText,
  AlertCircle,
  HelpCircle,
  FolderOpen,
  Zap,
  Shield,
  Activity,
  Sliders,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';

export const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [researchMode, setResearchMode] = useState<'detailed' | 'flash'>('detailed');
  const [antiGravityEnabled, setAntiGravityEnabled] = useState(true);

  // Capture voice assistant or URL redirects
  useEffect(() => {
    const speechGoal = searchParams.get('goal');
    if (speechGoal) {
      setGoal(speechGoal);
    }
  }, [searchParams]);

  // Anti-Gravity Preload Prompt Presets
  const preloadPrompts = [
    {
      id: 'antigravity-swarm',
      label: '🚀 Anti-Gravity Agent Swarm',
      prompt: 'Deploy zero-gravity multi-agent swarm. Decompose high-level objective into parallel async pipelines with real-time vector telemetry and low-latency agent synthesis.'
    },
    {
      id: 'data-suite-audit',
      label: '⚡ Enterprise Obsidian Data Audit',
      prompt: 'Execute razor-sharp infrastructure audit, memory vector store analysis, security liability check, and high-density performance telemetry mapping.'
    },
    {
      id: 'telemetry-monitor',
      label: '🛡️ Infrastructure Telemetry Loop',
      prompt: 'Initialize real-time telemetry monitor, agent health ping verification, system resource usage metrics, and automated decision escalation logs.'
    }
  ];

  const suggestions = [
    { label: 'Create a complete hiring campaign', desc: 'Recruits staff, writes description, schedules interviews.' },
    { label: 'Optimize our outbound sales conversion funnels', desc: 'Analyzes leads, builds email copy, maps budget metrics.' },
    { label: 'Perform competitor analysis on customer helpdesks', desc: 'Audits competitors, compiles FAQs, maps script support.' },
    { label: 'Conduct enterprise software security risk audit', desc: 'Scans privacy guidelines, parses compliance liability.' }
  ];

  // Handle visual file upload mock
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    
    try {
      const file = files[0];
      const mockKbPayload = {
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        contentSummary: `Uploaded from Workspace input portal. Parsed context for ${file.name}.`
      };
      
      const res = await kbService.upload(mockKbPayload);
      setAttachedFiles(prev => [...prev, res]);
      setSuccessMsg(`Document "${file.name}" indexed to knowledge base successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError('Failed to upload and index document.');
    } finally {
      setUploading(false);
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setError('');
    
    try {
      const words = goal.trim().split(/\s+/);
      const projectName = words.length <= 8
        ? goal.trim()
        : words.slice(0, 8).join(' ') + '...';
      
      const antiGravityPrefix = antiGravityEnabled ? '[ANTI-GRAVITY EXECUTION] ' : '';

      await projectService.create({
        name: projectName,
        goal: antiGravityPrefix + goal,
        description: description || `Autonomous execution of: ${goal}`,
        researchMode
      });
      
      navigate('/collaboration');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to dispatch workflow goal.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pt-2">
      
      {/* Live Infrastructure Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="dense-card p-3 flex items-center justify-between border border-obsidian-border bg-obsidian-card rounded-sharp">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active Swarm</p>
            <div className="text-lg font-black text-white flex items-center space-x-1">
              <AnimatedCounter value={6} duration={1000} />
              <span className="text-[10px] text-emerald-400 font-semibold ml-1">Agents</span>
            </div>
          </div>
          <Cpu size={16} className="text-royal-500" />
        </div>

        <div className="dense-card p-3 flex items-center justify-between border border-obsidian-border bg-obsidian-card rounded-sharp">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Telemetry Rate</p>
            <div className="text-lg font-black text-white flex items-center space-x-1">
              <AnimatedCounter value={1420} duration={1500} suffix=" req/s" />
            </div>
          </div>
          <Activity size={16} className="text-emerald-status" />
        </div>

        <div className="dense-card p-3 flex items-center justify-between border border-obsidian-border bg-obsidian-card rounded-sharp">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Engine Latency</p>
            <div className="text-lg font-black text-white flex items-center space-x-1">
              <AnimatedCounter value={12} duration={800} suffix=" ms" />
            </div>
          </div>
          <Zap size={16} className="text-royal-400" />
        </div>

        <div className="dense-card p-3 flex items-center justify-between border border-obsidian-border bg-obsidian-card rounded-sharp">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Vector Memory</p>
            <div className="text-lg font-black text-white flex items-center space-x-1">
              <AnimatedCounter value={48290} duration={1800} />
            </div>
          </div>
          <Layers size={16} className="text-royal-500" />
        </div>
      </div>

      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-royal-500/10 border border-royal-500/30 rounded-sharp text-[10px] font-mono text-royal-400 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-status animate-ping"></span>
          <span>Enterprise Obsidian (Clean Data Suite) Online</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Preload Prompt Console &amp; Anti-Gravity Dispatch
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Configure prompt inputs, toggle zero-g autonomous execution modes, and select visual themes for elite developer infrastructure.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-sharp bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-sharp bg-emerald-500/10 border border-emerald-status/30 text-emerald-400 text-xs flex items-center space-x-2">
          <FileText size={15} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Preload Prompt Console */}
      <form onSubmit={handleGoalSubmit} className="glass-panel p-6 rounded-sharp border border-obsidian-border space-y-6 relative overflow-hidden shadow-2xl bg-obsidian-card">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-royal-500 to-transparent"></div>

        {/* Toolbar Bar: Preload Presets & Theme Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-obsidian-border pb-4">
          
          {/* Anti-Gravity Toggle */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setAntiGravityEnabled(prev => !prev)}
              className={`px-3 py-1.5 rounded-sharp text-[10px] font-bold flex items-center space-x-2 border transition-all ${
                antiGravityEnabled
                  ? 'bg-royal-500/20 border-royal-500 text-royal-400 shadow-sm shadow-royal-500/20'
                  : 'bg-obsidian-bg border-obsidian-border text-slate-400'
              }`}
            >
              <Sparkles size={13} className={antiGravityEnabled ? 'text-royal-400 animate-spin-slow' : ''} />
              <span>Anti-Gravity Mode: {antiGravityEnabled ? 'ACTIVE' : 'OFF'}</span>
            </button>

            {antiGravityEnabled && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-status animate-pulse"></span>
                <span>ZERO-G VECTOR ROUTING</span>
              </span>
            )}
          </div>

          {/* Theme Quick Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Sliders size={12} />
              <span>UI Theme:</span>
            </span>
            <div className="flex items-center space-x-1 bg-obsidian-bg p-1 border border-obsidian-border rounded-sharp">
              <button
                type="button"
                onClick={() => setTheme('obsidian')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-sharp transition-all ${
                  theme === 'obsidian'
                    ? 'bg-royal-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Obsidian Clean
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-sharp transition-all ${
                  theme === 'dark'
                    ? 'bg-royal-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Classic Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-sharp transition-all ${
                  theme === 'light'
                    ? 'bg-royal-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Light Suite
              </button>
            </div>
          </div>
        </div>

        {/* Preload Prompt Presets Pills */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quick Preload Prompt Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {preloadPrompts.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setGoal(preset.prompt)}
                className="px-3 py-1.5 rounded-sharp bg-obsidian-bg border border-obsidian-border hover:border-royal-500/60 text-slate-300 hover:text-white text-[11px] font-medium flex items-center space-x-1.5 transition-colors"
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Prompt Textarea with Terminal Cursor */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>PROMPT INPUT CONSOLE</span>
            <span className="text-emerald-400 font-semibold flex items-center">
              SYSTEM INTEL STATUS: ACTIVE STREAM<span className="terminal-cursor"></span>
            </span>
          </div>

          <textarea
            required
            rows={4}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Type your target prompt or choose a Preload Prompt preset above: 'Deploy zero-gravity multi-agent swarm to optimize sales conversion funnels...'"
            className="w-full bg-obsidian-bg border border-obsidian-border rounded-sharp p-4 text-sm glass-input text-slate-100 placeholder-slate-500 font-sans"
          />

          {/* Research Mode Selection */}
          <div className="flex space-x-3 bg-obsidian-bg p-1 rounded-sharp border border-obsidian-border w-fit">
            <button
              type="button"
              onClick={() => setResearchMode('detailed')}
              className={`px-3.5 py-1.5 rounded-sharp text-[10px] font-bold flex items-center space-x-1.5 transition-all ${
                researchMode === 'detailed'
                  ? 'bg-royal-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🔬 Detailed Research (6 Agents)</span>
            </button>
            <button
              type="button"
              onClick={() => setResearchMode('flash')}
              className={`px-3.5 py-1.5 rounded-sharp text-[10px] font-bold flex items-center space-x-1.5 transition-all ${
                researchMode === 'flash'
                  ? 'bg-royal-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚡ Flash Research (Snappy Brief)</span>
            </button>
          </div>

          {/* Bottom toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* File upload trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="px-3.5 py-2 rounded-sharp border border-obsidian-border hover:border-royal-500 bg-obsidian-bg text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer flex items-center space-x-2 transition-all touch-target">
                <Upload size={13} className="text-royal-400" />
                <span>{uploading ? 'Processing File...' : 'Attach Context File'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.csv,.xlsx,.txt"
                />
              </label>
              
              <Link
                to="/kb"
                className="text-[10px] text-slate-400 hover:text-royal-400 flex items-center space-x-1 font-mono py-1"
              >
                <FolderOpen size={11} />
                <span>Manage Knowledge Store</span>
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-sharp bg-royal-500 hover:bg-royal-600 text-xs font-bold text-white shadow-lg shadow-royal-500/20 flex items-center justify-center space-x-2 transition-all touch-target"
            >
              <span>Dispatch Workforce</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Display attached files */}
        {attachedFiles.length > 0 && (
          <div className="border-t border-obsidian-border pt-4 space-y-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Attached Context Documents</p>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file) => (
                <span key={file.id} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-sharp bg-obsidian-bg border border-obsidian-border text-[10px] text-slate-200 font-medium">
                  <FileText size={10} className="text-royal-400" />
                  <span>{file.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Suggestion Chips */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center space-x-1.5 font-mono">
          <HelpCircle size={14} className="text-royal-400" />
          <span>Goal Templates &amp; Sample Prompts</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.label}
              onClick={() => setGoal(suggestion.label)}
              className="glass-panel p-4 rounded-sharp border border-obsidian-border text-left hover:border-royal-500 hover:bg-obsidian-hover cursor-pointer transition-all duration-150"
            >
              <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-royal-400"></span>
                <span>{suggestion.label}</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">{suggestion.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workspace;

