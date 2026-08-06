import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectService } from '../services/api';
import { Project, Task, Agent, ExecutionLog } from '../types';
import {
  Network,
  MessageSquare,
  FileText,
  RotateCw,
  Cpu,
  Terminal
} from 'lucide-react';

export const Collaboration: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectId, setProjectId] = useState<string | null>(searchParams.get('projectId'));

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(true);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const findProject = async () => {
      try {
        if (projectId) {
          const data = await projectService.getById(projectId);
          setProject(data.project);
          setTasks(data.tasks);
          setAgents(data.agents);
        } else {
          const projectsList = await projectService.getAll();
          if (projectsList.length > 0) {
            const latest = projectsList.find((p: Project) => p.status === 'executing' || p.status === 'planning') || projectsList[0];
            setProjectId(latest.id);
            setProject(latest);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error identifying target project', err);
        setLoading(false);
      }
    };
    findProject();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const fetchStatus = async () => {
      try {
        const details = await projectService.getById(projectId);
        setProject(details.project);
        setTasks(details.tasks);
        setAgents(details.agents);

        const logsList = await projectService.getLogs(projectId);
        setLogs(logsList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching collaborative workflow steps', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-royal-500/20 border-t-royal-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
            Syncing Multi-Agent Vector State<span className="terminal-cursor"></span>
          </span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-20">
        <span className="text-4xl block">🔍</span>
        <h3 className="text-lg font-bold text-white tracking-tight">No Active Swarm Workflow</h3>
        <p className="text-xs text-slate-400">Please go to the Workspace and input a prompt to see the Anti-Gravity workforce in action.</p>
        <button
          onClick={() => navigate('/workspace')}
          className="px-5 py-2.5 rounded-sharp bg-royal-500 hover:bg-royal-600 text-xs font-bold text-white shadow-lg transition-all"
        >
          Dispatch Prompt Goal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Details panel */}
      <div className="obsidian-card p-6 rounded-sharp border border-obsidian-border bg-obsidian-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className={`w-2 h-2 rounded-full ${project.status === 'completed' ? 'bg-emerald-status' : 'bg-royal-500 animate-pulse'}`}></span>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-widest font-bold">
              SWARM OBJECTIVE IN PROGRESS
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white">{project.name}</h2>
          <p className="text-xs text-slate-400 italic">&ldquo;{project.description}&rdquo;</p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-center">
          {project.status === 'completed' ? (
            <button
              onClick={() => navigate(`/reports?projectId=${project.id}`)}
              className="px-5 py-2.5 rounded-sharp bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all"
            >
              <FileText size={14} />
              <span>View Data Report</span>
            </button>
          ) : (
            <div className="px-4 py-2 rounded-sharp bg-obsidian-bg border border-obsidian-border text-[10px] font-mono font-bold text-slate-300 flex items-center space-x-2">
              <RotateCw size={12} className="animate-spin text-royal-400" />
              <span>
                ZERO-G AGENTS COORDINATING<span className="terminal-cursor"></span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Agent Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="obsidian-card p-6 rounded-sharp border border-obsidian-border bg-obsidian-card flex flex-col h-[540px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Network size={14} className="text-royal-400" />
                <span>Zero-Gravity Agent Workflow Graph</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-status animate-ping"></span>
                <span>REALTIME GRAPH</span>
              </span>
            </div>

            {/* Sequence of Workflow nodes */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
              {tasks.map((task) => {
                const agent = agents.find(a => a.id === (task.assignedAgentId || (task as any).assigned_agent_id));
                const isCurrent = task.status === 'running';
                const isDone = task.status === 'completed';
                
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-sharp border transition-all duration-200 ${
                      isCurrent
                        ? 'border-royal-500 bg-royal-500/10 shadow-lg shadow-royal-500/10 translate-x-1'
                        : isDone
                        ? 'border-obsidian-border bg-obsidian-bg/60 opacity-85'
                        : 'border-obsidian-border bg-obsidian-bg/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <span className="text-2xl">{agent?.avatar || '🤖'}</span>
                        <div className="overflow-hidden">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{agent?.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-obsidian-bg border border-obsidian-border rounded-sharp text-slate-400 uppercase font-mono font-semibold">
                              {agent?.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 truncate max-w-md font-sans">Task: {task.title}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-sharp text-[9px] font-mono font-bold ${
                          isDone ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                          isCurrent ? 'bg-royal-500/10 border border-royal-500/30 text-royal-400 animate-pulse' :
                          'bg-obsidian-bg border border-obsidian-border text-slate-500'
                        }`}>
                          {task.status.toUpperCase()}
                        </span>
                        {isCurrent && (
                          <p className="text-[9px] font-mono text-royal-400 font-semibold mt-1">
                            Confidence: {agent?.confidence}%
                          </p>
                        )}
                      </div>
                    </div>

                    {isCurrent && agent?.thinkingProcess && agent.thinkingProcess.length > 0 && (
                      <div className="mt-3.5 pt-3.5 border-t border-royal-500/30 text-[10px] font-mono text-royal-300 space-y-1 bg-obsidian-bg p-3 rounded-sharp border border-royal-500/20">
                        <p className="font-bold flex items-center justify-between text-royal-400">
                          <span className="flex items-center space-x-1.5">
                            <Cpu size={12} className="text-royal-400 animate-spin-slow" />
                            <span>Active Intelligence Stream:</span>
                          </span>
                          <span className="text-emerald-400">
                            STREAMING<span className="terminal-cursor"></span>
                          </span>
                        </p>
                        {agent.thinkingProcess.map((step, sIdx) => (
                          <p key={sIdx} className="text-slate-300 font-mono">&gt; {step}</p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat & Intelligence Log Feed */}
        <div className="space-y-6">
          <div className="obsidian-card p-6 rounded-sharp border border-obsidian-border bg-obsidian-card flex flex-col h-[540px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <MessageSquare size={14} className="text-royal-400" />
                <span>Vector Intelligence Logs</span>
              </h3>
              <span className="text-[9px] font-mono text-slate-400">
                LIVE<span className="terminal-cursor"></span>
              </span>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-sans">
              {logs.map((log) => {
                const agent = agents.find(a => a.id === (log.senderAgentId || (log as any).sender_agent_id));
                const isDecision = log.type === 'decision';
                const isErr = log.type === 'error';
                
                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-sharp border ${
                      isDecision
                        ? 'bg-amber-500/5 border-amber-500/30 text-slate-200'
                        : isErr
                        ? 'bg-rose-500/5 border-rose-500/30 text-rose-300'
                        : 'bg-obsidian-bg border-obsidian-border text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[10px] text-white flex items-center space-x-1.5">
                        <span>{agent?.avatar || '💼'}</span>
                        <span className="font-mono">{agent?.name || 'System'}</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed break-words">{log.message}</p>
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Collaboration;

