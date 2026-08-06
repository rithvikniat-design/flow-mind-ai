import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectService, agentService } from '../services/api';
import { Project, Agent } from '../types';
import { AnimatedCounter } from '../components/AnimatedCounter';
import {
  TrendingUp,
  Clock,
  Play,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Plus,
  Activity,
  Cpu
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projData = await projectService.getAll();
        setProjects(Array.isArray(projData) ? projData : []);

        const agentData = await agentService.getAll();
        setAgents(Array.isArray(agentData) ? agentData : []);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
        setProjects([]);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const timer = setInterval(fetchData, 4000);
    return () => clearInterval(timer);
  }, []);

  const activeProjects = projects.filter(p => p.status === 'executing' || p.status === 'planning');
  const completedProjects = projects.filter(p => p.status === 'completed');
  
  const stats = [
    { name: 'Active Workflows', value: activeProjects.length, icon: Play, color: 'text-royal-400', isCurrency: false },
    { name: 'Completed Goals', value: completedProjects.length, icon: CheckCircle2, color: 'text-emerald-400', isCurrency: false },
    { name: 'Estimated Saved Hours', value: completedProjects.length * 18 + 12, icon: Clock, color: 'text-sky-400', isCurrency: false },
    { name: 'Est. Operational Savings', value: completedProjects.length * 540 + 320, icon: TrendingUp, color: 'text-emerald-status', isCurrency: true }
  ];

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-royal-500/20 border-t-royal-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
            Syncing Telemetry Engine<span className="terminal-cursor"></span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-status animate-ping"></span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
              CLEAN DATA SUITE TELEMETRY ONLINE
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Workforce Telemetry &amp; Intelligence Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">Review live agent execution logs, saved metrics, and multi-agent coordination.</p>
        </div>
        <Link
          to="/workspace"
          className="self-start px-4 py-2 rounded-sharp bg-royal-500 hover:bg-royal-600 text-xs font-bold text-white shadow-lg shadow-royal-500/20 flex items-center space-x-2 transition-all"
        >
          <Plus size={14} />
          <span>Assign New Goal</span>
        </Link>
      </div>

      {/* Stats Row with Animated Telemetry Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="obsidian-card p-5 rounded-sharp border border-obsidian-border bg-obsidian-card flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.name}</p>
                <h4 className="text-2xl font-black text-white tracking-tight">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.isCurrency ? '$' : ''}
                    duration={1200}
                  />
                </h4>
              </div>
              <div className={`p-3 bg-obsidian-bg border border-obsidian-border rounded-sharp ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active workflows */}
        <div className="lg:col-span-2 space-y-6">
          <div className="obsidian-card rounded-sharp border border-obsidian-border bg-obsidian-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Layers size={15} className="text-royal-400" />
                <span>Active Goals &amp; Execution Workflows</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                ACTIVE MONITOR<span className="terminal-cursor"></span>
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-obsidian-border rounded-sharp bg-obsidian-bg">
                No active workflows found. Go to the Workspace and input your first business prompt!
              </div>
            ) : (
              <div className="divide-y divide-obsidian-border">
                {projects.map((project) => {
                  const isRunning = project.status === 'executing' || project.status === 'planning';
                  return (
                    <div
                      key={project.id}
                      onClick={() => navigate(isRunning ? '/collaboration' : `/reports?projectId=${project.id}`)}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-obsidian-hover px-3 rounded-sharp cursor-pointer transition-all gap-2"
                    >
                      <div className="space-y-1 pr-2 min-w-0">
                        <h4 className="text-xs font-bold text-white flex items-center space-x-2 truncate">
                          <span>{project.name}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate font-sans">{project.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
                        <span className={`px-2 py-0.5 rounded-sharp text-[9px] font-mono font-bold ${
                          project.status === 'completed' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                          project.status === 'executing' ? 'bg-royal-500/10 border border-royal-500/30 text-royal-400 animate-pulse' :
                          project.status === 'failed' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' :
                          'bg-obsidian-bg border border-obsidian-border text-slate-400'
                        }`}>
                          {project.status.toUpperCase()}
                        </span>
                        
                        <ChevronRight size={14} className="text-slate-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Agency Workforce Sidebar */}
        <div className="space-y-6">
          <div className="obsidian-card rounded-sharp border border-obsidian-border bg-obsidian-card p-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
              <Sparkles size={15} className="text-royal-400" />
              <span>Active Agent Fleet (Zero-G)</span>
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-sharp bg-obsidian-bg border border-obsidian-border">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <span className="text-xl shrink-0">{agent.avatar}</span>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400 truncate">{agent.role}</p>
                    </div>
                  </div>
                  
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    agent.executionStatus === 'thinking' ? 'bg-amber-400 animate-ping' :
                    agent.executionStatus === 'executing' ? 'bg-royal-500 animate-pulse' :
                    agent.executionStatus === 'completed' ? 'bg-emerald-status' :
                    'bg-slate-600'
                  }`} title={agent.executionStatus}></span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

