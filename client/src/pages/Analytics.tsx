import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';
import {
  BarChart3,
  TrendingDown,
  Clock,
  Briefcase,
  Zap,
  TrendingUp,
  LineChart
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const stats = await analyticsService.get();
        setData(stats);
      } catch (err) {
        console.error('Failed to retrieve analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Syncing Performance Data...</span>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    projects: 3,
    tasks: 18,
    completedTasks: 15,
    timeSavedHours: 65,
    costReductionDollars: 1890,
    aiEfficiency: 94.2
  };

  const dailyCompletions = data?.dailyCompletions || [
    { date: 'Mon', count: 4 },
    { date: 'Tue', count: 6 },
    { date: 'Wed', count: 8 },
    { date: 'Thu', count: 5 },
    { date: 'Fri', count: 9 },
    { date: 'Sat', count: 3 },
    { date: 'Sun', count: 5 }
  ];

  const agentEfficiency = data?.agentEfficiency || [
    { name: 'Research', efficiency: 91, taskCount: 8 },
    { name: 'Developer', efficiency: 95, taskCount: 12 },
    { name: 'Marketing', efficiency: 89, taskCount: 7 },
    { name: 'Finance', efficiency: 93, taskCount: 5 },
    { name: 'Quality', efficiency: 97, taskCount: 11 },
    { name: 'Document', efficiency: 96, taskCount: 6 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Efficiency Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">Review labor cost mitigations, task velocity, and AI workforce optimizations</p>
      </div>

      {/* Highlights grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Labor Hours Saved</span>
            <h4 className="text-2xl font-extrabold text-brand-400 mt-1">{summary.timeSavedHours} hrs</h4>
          </div>
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
            <Clock size={20} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">OpEx Reductions</span>
            <h4 className="text-2xl font-extrabold text-emerald-400 mt-1">${summary.costReductionDollars}</h4>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Workforce Efficiency</span>
            <h4 className="text-2xl font-extrabold text-pink-400 mt-1">{summary.aiEfficiency}%</h4>
          </div>
          <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl">
            <Zap size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Completions bar chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col h-[350px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center space-x-2">
            <LineChart size={15} className="text-brand-400" />
            <span>Workflow Execution Frequency (Weekly)</span>
          </h3>

          <div className="flex-1 flex items-end justify-between px-4 pb-2 border-b border-slate-800/80">
            {dailyCompletions.map((item: any) => {
              // Calculate relative height percentage
              const maxCount = Math.max(...dailyCompletions.map((c: any) => c.count));
              const heightPct = (item.count / maxCount) * 80; // scale to max 80% height
              
              return (
                <div key={item.date} className="flex flex-col items-center space-y-2.5 w-10">
                  <span className="text-[10px] font-bold text-brand-300">{item.count}</span>
                  <div
                    className="w-4 rounded-t bg-gradient-to-t from-brand-600 to-indigo-400 transition-all duration-500"
                    style={{ height: `${heightPct || 10}px` }}
                  ></div>
                  <span className="text-[10px] text-slate-500 font-semibold">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent efficiency breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col h-[350px] overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center space-x-2">
            <BarChart3 size={15} className="text-brand-400" />
            <span>Agent Optimizations</span>
          </h3>

          <div className="space-y-4">
            {agentEfficiency.map((agent: any) => (
              <div key={agent.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{agent.name} Agent</span>
                  <span className="text-slate-500 text-[10px]">
                    Efficiency: <span className="text-brand-400">{agent.efficiency}%</span> ({agent.taskCount} tasks)
                  </span>
                </div>
                
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-pink-500 rounded-full"
                    style={{ width: `${agent.efficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
