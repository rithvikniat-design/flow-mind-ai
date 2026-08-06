import React, { useState, useEffect } from 'react';
import { agentService } from '../services/api';
import { Agent } from '../types';
import {
  Sliders,
  CheckCircle,
  Users,
  Layers,
  Activity,
  AlertCircle
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('');
  const [confidence, setConfidence] = useState(90);
  
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAgents = async () => {
    try {
      const data = await agentService.getAll();
      setAgents(data);
      if (data.length > 0 && !selectedAgent) {
        selectAgent(data[0]);
      }
    } catch (e) {
      console.error('Failed to load agents in Admin dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const selectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setName(agent.name);
    setRole(agent.role);
    setAvatar(agent.avatar);
    setConfidence(agent.confidence);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;

    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updated = await agentService.update(selectedAgent.id, {
        name,
        role,
        avatar,
        confidence
      });
      
      setAgents(prev => prev.map(a => a.id === selectedAgent.id ? updated : a));
      setSelectedAgent(updated);
      setSuccessMsg(`Agent "${name}" updated successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update agent instructions.');
    }
  };

  if (loading && agents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading System Configurations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Orchestration Admin Panel
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure systemic agent instructions, roles, avatars, and confidence metrics</p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left list */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <Users size={14} />
            <span>Agent Directory ({agents.length})</span>
          </h3>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {agents.map((agent) => {
              const isSelected = selectedAgent?.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => selectAgent(agent)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/5 shadow-md shadow-brand-500/5'
                      : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <span className="text-2xl shrink-0">{agent.avatar}</span>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{agent.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{agent.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <form onSubmit={handleUpdate} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 text-left">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2 border-b border-slate-800/80 pb-4">
                <Sliders size={16} className="text-brand-400" />
                <span>Configure Agent: {selectedAgent.name}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Agent Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Agent Role / Title</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Avatar Emoji</label>
                  <input
                    type="text"
                    required
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Confidence Rating (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
                >
                  Save Modifications
                </button>
              </div>

            </form>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl h-[300px] flex items-center justify-center">
              Select an agent from directory to configure.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
