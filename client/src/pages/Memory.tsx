import React, { useState, useEffect } from 'react';
import { memoryService, projectService } from '../services/api';
import { AIMemory, Project } from '../types';
import {
  Brain,
  Layers,
  ChevronDown,
  Clock,
  Sparkles,
  Database
} from 'lucide-react';

export const Memory: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch completed projects list
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const list = await projectService.getAll();
        setProjects(list);
        if (list.length > 0) {
          setSelectedProjectId(list[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error listing projects for memory index', err);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 2. Fetch specific memories
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchMemories = async () => {
      setLoading(true);
      try {
        const data = await memoryService.getByProject(selectedProjectId);
        setMemories(data);
      } catch (err) {
        console.error('Error fetching memory caches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, [selectedProjectId]);

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading Memory Registers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            AI Workforce Memory
          </h2>
          <p className="text-xs text-slate-400 mt-1">Review short-term, long-term, and project context memories cached by agents</p>
        </div>

        <div className="flex items-center space-x-3 self-start">
          <Layers size={16} className="text-brand-400" />
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 text-xs font-semibold rounded-lg px-4 py-2 pr-8 text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {projects.length === 0 ? (
                <option value="">No projects available</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Memory lists */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        {memories.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No specific workspace memories cached yet for this project.
          </div>
        ) : (
          <div className="space-y-4">
            {memories.map((mem) => (
              <div key={mem.id} className="p-4.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start space-x-4">
                <div className={`p-2.5 rounded-xl border shrink-0 ${
                  mem.type === 'long-term' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                  mem.type === 'short-term' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                  'bg-pink-500/10 border-pink-500/20 text-pink-400'
                }`}>
                  {mem.type === 'long-term' ? <Database size={16} /> : <Brain size={16} />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{mem.type} memory</span>
                    <span className="text-slate-600 font-semibold text-[9px]">&bull;</span>
                    <span className="text-[9px] text-slate-500 flex items-center space-x-1">
                      <Clock size={10} />
                      <span>{new Date(mem.timestamp).toLocaleString()}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">{mem.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Memory;
