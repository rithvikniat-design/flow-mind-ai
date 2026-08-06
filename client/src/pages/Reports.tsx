import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectService } from '../services/api';
import { Project, Report } from '../types';
import {
  FileText,
  Download,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Briefcase,
  Layers,
  ChevronDown
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch completed projects list
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const list = await projectService.getAll();
        setProjects(list);
        
        // Check query param first, otherwise select first project
        const paramId = searchParams.get('projectId');
        if (paramId) {
          setSelectedProjectId(paramId);
        } else if (list.length > 0) {
          setSelectedProjectId(list[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching projects list for reports', err);
        setLoading(false);
      }
    };
    fetchProjects();
  }, [searchParams]);

  // 2. Fetch specific report
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchReport = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const data = await projectService.getReport(selectedProjectId);
        setReport(data);
      } catch (err: any) {
        setErrorMsg('Report not compiled yet. Wait for the agent workflow loop to complete execution.');
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedProjectId]);

  const simulateExport = (type: 'pdf' | 'doc' | 'csv') => {
    if (!report) return;
    
    const execSummary = report.executiveSummary || (report as any).executive_summary || '';
    const risk = report.riskAnalysis || (report as any).risk_analysis || '';
    const insights = report.businessInsights || (report as any).business_insights || '';
    const recs = report.recommendations || '';
    const projId = report.projectId || (report as any).project_id || '';
    
    let content = '';
    let filename = `FlowMind-AI-Report-${projId}`;

    if (type === 'csv') {
      content = `"Section","Details"\n"Executive Summary","${execSummary.replace(/"/g, '""')}"\n"Risk Analysis","${risk.replace(/"/g, '""')}"\n"Business Insights","${insights.replace(/"/g, '""')}"\n"Recommendations","${recs.replace(/"/g, '""')}"`;
      filename += '.csv';
    } else {
      content = `# ${report.title}\n\n## Executive Summary\n${execSummary}\n\n## Risk Analysis\n${risk}\n\n## Business Insights\n${insights}\n\n## Recommendations\n${recs}`;
      filename += type === 'pdf' ? '.pdf.md' : '.doc.md'; // Saving as markdown document representation
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading Executive Reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Selector and export buttons */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
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
                    {p.name} ({p.status})
                  </option>
                ))
              )}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {report && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => simulateExport('pdf')}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[10px] font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <Download size={12} />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => simulateExport('doc')}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[10px] font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <Download size={12} />
              <span>Export Word</span>
            </button>
            <button
              onClick={() => simulateExport('csv')}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[10px] font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <Download size={12} />
              <span>Export CSV</span>
            </button>
          </div>
        )}
      </div>

      {errorMsg ? (
        <div className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center max-w-lg mx-auto space-y-4">
          <AlertTriangle size={32} className="text-rose-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">Execution in progress</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
        </div>
      ) : report ? (
        
        // Report Grid
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
            
            {/* Header */}
            <div className="border-b border-slate-800/80 pb-6 text-center md:text-left">
              <h1 className="text-xl font-extrabold text-slate-100">{report.title}</h1>
              <p className="text-[10px] text-slate-500 mt-1">Generated: {new Date(report.createdAt || (report as any).created_at).toLocaleString()}</p>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              {/* Executive Summary */}
              <div className="space-y-3 col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                  <Briefcase size={14} className="text-brand-400" />
                  <span>1. Executive Summary</span>
                </h3>
                <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                  {report.executiveSummary || (report as any).executive_summary}
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span>2. Compliance & Risk Assessment</span>
                </h3>
                <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                  {report.riskAnalysis || (report as any).risk_analysis}
                </div>
              </div>

              {/* Business Insights */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                  <Lightbulb size={14} className="text-sky-400" />
                  <span>3. Business Insights</span>
                </h3>
                <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                  {report.businessInsights || (report as any).business_insights}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3 col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>4. Strategic Recommendations</span>
                </h3>
                <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                  {report.recommendations}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl max-w-md mx-auto">
          No reports generated. Deploy your first collaborative workforce project in the workspace console.
        </div>
      )}

    </div>
  );
};

export default Reports;
