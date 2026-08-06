import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import {
  CheckCircle,
  Key,
  Globe,
  User,
  ShieldAlert,
  Moon,
  Sun,
  Sparkles,
  Sliders,
  Terminal
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || 'Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@flowmind.ai');
  const [language, setLanguage] = useState('en');
  
  const [defaultPrompt, setDefaultPrompt] = useState(
    'Deploy zero-gravity multi-agent swarm. Decompose high-level objective into parallel async pipelines with real-time vector telemetry.'
  );
  const [grokKey, setGrokKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Global Enterprise Obsidian configuration updated.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-status"></span>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
            ENTERPRISE OBSIDIAN DATA SUITE CONFIG
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          System Settings &amp; Theme Engine
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure profile details, API credentials, Anti-Gravity preload prompts, and visual themes.</p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-sharp bg-emerald-500/10 border border-emerald-status/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* Visual Skin Theme Selection */}
        <div className="obsidian-card p-6 rounded-sharp border border-obsidian-border bg-obsidian-card space-y-4 text-left">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 border-b border-obsidian-border pb-3">
            <Globe size={14} className="text-royal-400" />
            <span>UI Theme Selection &amp; Aesthetic Engine</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Enterprise Obsidian option */}
            <div
              onClick={() => setTheme('obsidian')}
              className={`p-4 rounded-sharp border cursor-pointer transition-all ${
                theme === 'obsidian'
                  ? 'border-royal-500 bg-royal-500/10 shadow-lg shadow-royal-500/10 ring-1 ring-royal-500'
                  : 'border-obsidian-border bg-obsidian-bg hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center space-x-1">
                  <Sparkles size={13} className="text-royal-400" />
                  <span>Enterprise Obsidian</span>
                </span>
                {theme === 'obsidian' && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-royal-500 text-white rounded-sharp font-mono font-bold">ACTIVE</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Sharp monochrome, #0F1115 bg, #181B22 card surfaces, border-radius: 4px, royal blue (#2563EB) and emerald (#10B981) highlights.
              </p>
            </div>

            {/* Dark Mode */}
            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-sharp border cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'border-royal-500 bg-royal-500/10 shadow-lg shadow-royal-500/10 ring-1 ring-royal-500'
                  : 'border-obsidian-border bg-obsidian-bg hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center space-x-1">
                  <Moon size={13} className="text-slate-400" />
                  <span>Classic Dark</span>
                </span>
                {theme === 'dark' && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-royal-500 text-white rounded-sharp font-mono font-bold">ACTIVE</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Deep indigo slate theme with smooth rounded corners and dark gradient overlays.
              </p>
            </div>

            {/* Light Mode */}
            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-sharp border cursor-pointer transition-all ${
                theme === 'light'
                  ? 'border-royal-500 bg-royal-500/10 shadow-lg shadow-royal-500/10 ring-1 ring-royal-500'
                  : 'border-obsidian-border bg-obsidian-bg hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                  <Sun size={13} className="text-amber-400" />
                  <span>Light Clean Suite</span>
                </span>
                {theme === 'light' && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-royal-500 text-white rounded-sharp font-mono font-bold">ACTIVE</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                High contrast clean light mode for bright workspace environments.
              </p>
            </div>

          </div>
        </div>

        {/* Preload Prompt Configuration */}
        <div className="obsidian-card p-6 rounded-sharp border border-obsidian-border bg-obsidian-card space-y-4 text-left">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 border-b border-obsidian-border pb-3">
            <Terminal size={14} className="text-royal-400" />
            <span>Anti-Gravity Preload Prompt Configuration</span>
          </h3>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Default Preload Prompt Instructions
            </label>
            <textarea
              rows={3}
              value={defaultPrompt}
              onChange={(e) => setDefaultPrompt(e.target.value)}
              className="w-full px-3 py-2 glass-input text-xs font-mono bg-obsidian-bg border-obsidian-border"
            />
            <p className="text-[10px] text-slate-400">
              This prompt will be loaded automatically into the Workspace prompt console upon session initiation.
            </p>
          </div>
        </div>
        
        {/* Profile Card */}
        <div className="obsidian-card p-6 rounded-sharp border border-obsidian-border bg-obsidian-card space-y-4 text-left">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 border-b border-obsidian-border pb-3">
            <User size={14} className="text-royal-400" />
            <span>Profile Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">User Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                disabled
                value={email}
                className="w-full px-3 py-2 glass-input text-xs opacity-50 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="obsidian-card p-6 rounded-sharp border border-obsidian-border bg-obsidian-card space-y-4 text-left">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 border-b border-obsidian-border pb-3">
            <Key size={14} className="text-royal-400" />
            <span>Custom API Credentials</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">xAI Grok API Key</label>
              <input
                type="password"
                placeholder="sk-grok-••••••••••••••••"
                value={grokKey}
                onChange={(e) => setGrokKey(e.target.value)}
                className="w-full px-3 py-2 glass-input text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Supabase URL</label>
                <input
                  type="text"
                  placeholder="https://xyz.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 glass-input text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOi..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 glass-input text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-sharp bg-royal-500 hover:bg-royal-600 text-xs font-bold text-white shadow-lg shadow-royal-500/20 transition-all"
          >
            Save Enterprise Configuration
          </button>
        </div>

      </form>
    </div>
  );
};

export default Settings;

