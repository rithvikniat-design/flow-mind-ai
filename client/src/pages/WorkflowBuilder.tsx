import React, { useState, useEffect } from 'react';
import { workflowService } from '../services/api';
import {
  GitFork,
  Plus,
  Play,
  RotateCw,
  Trash2,
  Save,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface Node {
  id: string;
  name: string;
  type: 'agent' | 'decision' | 'loop' | 'approval';
  avatar: string;
  role: string;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
}

export const WorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'n_ceo', name: 'CEO Arthur', type: 'agent', avatar: '💼', role: 'Orchestrator', x: 80, y: 150 },
    { id: 'n_planner', name: 'Sophia Planner', type: 'agent', avatar: '📐', role: 'Strategy Planner', x: 260, y: 150 },
    { id: 'n_research', name: 'Isaac Research', type: 'agent', avatar: '🔍', role: 'Market Auditor', x: 440, y: 50 },
    { id: 'n_marketing', name: 'Amelia Marketing', type: 'agent', avatar: '📣', role: 'Copywriter', x: 440, y: 250 },
    { id: 'n_quality', name: 'Quinn Quality', type: 'agent', avatar: '🛡️', role: 'QA Inspector', x: 620, y: 150 },
    { id: 'n_document', name: 'Page Writer', type: 'agent', avatar: '📄', role: 'Document Builder', x: 800, y: 150 }
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { source: 'n_ceo', target: 'n_planner' },
    { source: 'n_planner', target: 'n_research' },
    { source: 'n_planner', target: 'n_marketing' },
    { source: 'n_research', target: 'n_quality' },
    { source: 'n_marketing', target: 'n_quality' },
    { source: 'n_quality', target: 'n_document' }
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState('Custom Business campaign');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await workflowService.getAll();
        setWorkflows(templates);
      } catch (err) {
        console.error('Error fetching visual workflow templates', err);
      }
    };
    fetchTemplates();
  }, []);

  // Simple visual drag representation by updating node coords on canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedNode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Keep within bounds
      setNodes(prev => prev.map(node => 
        node.id === selectedNode 
          ? { ...node, x: Math.max(20, Math.min(clickX - 60, 850)), y: Math.max(20, Math.min(clickY - 40, 360)) }
          : node
      ));
      setSelectedNode(null);
    }
  };

  const addCustomNode = (type: 'agent' | 'decision' | 'loop' | 'approval') => {
    const id = 'n_' + Math.random().toString(36).substring(2, 7);
    let name = 'Condition node';
    let avatar = '⚡';
    let role = 'Logic Gateway';
    
    if (type === 'agent') {
      name = 'Custom Agent';
      avatar = '🤖';
      role = 'Data Worker';
    } else if (type === 'loop') {
      name = 'Retry Loop';
      avatar = '🔄';
      role = 'Iterative execution';
    } else if (type === 'approval') {
      name = 'Manager Check';
      avatar = '👤';
      role = 'Approval Request';
    }

    const newNode: Node = {
      id,
      name,
      type,
      avatar,
      role,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 150
    };

    setNodes(prev => [...prev, newNode]);
    
    // Connect to Planner by default if exists
    setEdges(prev => [...prev, { source: 'n_planner', target: id }]);
  };

  const removeNode = (id: string) => {
    if (id === 'n_ceo' || id === 'n_planner') return; // protect key nodes
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
  };

  const saveCanvas = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await workflowService.save({
        name: workflowName,
        nodes,
        edges
      });
      setWorkflows(prev => [res, ...prev]);
      setSuccessMsg('Workflow template saved successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setErrorMsg('Failed to save visual canvas.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Visual Workflow Builder
          </h2>
          <p className="text-xs text-slate-400 mt-1">Design customized collaborative networks of AI agents</p>
        </div>
        
        <div className="flex items-center space-x-3 self-start">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500 w-52"
          />
          <button
            onClick={saveCanvas}
            className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg flex items-center space-x-1.5 transition-all"
          >
            <Save size={13} />
            <span>Save Blueprint</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
          <Trash2 size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Toolbar */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Add logic elements</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => addCustomNode('agent')}
                className="p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between text-left transition-all"
              >
                <span>🤖 Custom Worker Agent</span>
                <Plus size={14} className="text-brand-400" />
              </button>
              <button
                onClick={() => addCustomNode('decision')}
                className="p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between text-left transition-all"
              >
                <span>⚡ Decision splitting Node</span>
                <Plus size={14} className="text-brand-400" />
              </button>
              <button
                onClick={() => addCustomNode('loop')}
                className="p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between text-left transition-all"
              >
                <span>🔄 Iterative Execution Loop</span>
                <Plus size={14} className="text-brand-400" />
              </button>
              <button
                onClick={() => addCustomNode('approval')}
                className="p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between text-left transition-all"
              >
                <span>👤 Human Approval gate</span>
                <Plus size={14} className="text-brand-400" />
              </button>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <HelpCircle size={13} />
              <span>Canvas Instructions</span>
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              1. Click an agent card to select it.<br />
              2. Click anywhere on the grid canvas to place/drag it to that position.<br />
              3. Press the delete icon inside agent cards to delete nodes.
            </p>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div
            onClick={handleCanvasClick}
            className="w-full h-[450px] bg-slate-950 rounded-3xl border border-slate-900 relative overflow-hidden cursor-crosshair shadow-inner"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* SVG overlay to render connector lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                </marker>
              </defs>
              {edges.map((edge, idx) => {
                const srcNode = nodes.find(n => n.id === edge.source);
                const tgtNode = nodes.find(n => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;
                
                // Calculate center points of nodes
                const x1 = srcNode.x + 80;
                const y1 = srcNode.y + 35;
                const x2 = tgtNode.x + 80;
                const y2 = tgtNode.y + 35;
                
                return (
                  <g key={idx}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="url(#line-gradient)"
                      strokeWidth="2.5"
                      strokeDasharray={srcNode.type === 'loop' ? '5,5' : 'none'}
                      markerEnd="url(#arrow)"
                    />
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                    </linearGradient>
                  </g>
                );
              })}
            </svg>

            {/* Nodes overlay */}
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node.id);
                  }}
                  className={`absolute w-40 p-2.5 rounded-xl border z-10 transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-500/10 scale-105'
                      : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                  }`}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{node.avatar}</span>
                    {node.id !== 'n_ceo' && node.id !== 'n_planner' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNode(node.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-0.5"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                  <div className="mt-1">
                    <h4 className="text-[11px] font-bold text-slate-100 truncate">{node.name}</h4>
                    <p className="text-[9px] text-slate-500 truncate">{node.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkflowBuilder;
