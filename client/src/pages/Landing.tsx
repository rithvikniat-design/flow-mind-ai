import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Shield, Zap, Sparkles, Check, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

export const Landing: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const faqs = [
    {
      q: "How does FlowMind AI differ from traditional chat AI?",
      a: "Instead of just replying to prompt questions, FlowMind AI executes goals. It initiates a Planner Agent that maps the requirements, compiles separate subtasks, delegates them to specialized collaborative AI agents (e.g. Research, marketing, developer), runs execution, reviews for QA compliance, and generates complete business packages."
    },
    {
      q: "Does it connect to my existing SaaS tools?",
      a: "Yes, FlowMind AI features secure API integrations with systems like HubSpot, Slack, Salesforce, Gmail, and Google Calendar, allowing agents to fetch metrics and trigger automated tasks natively."
    },
    {
      q: "Do I need a Grok API key to evaluate the application?",
      a: "No! The system features an Intelligent Local Simulation Mode. If no Grok or Supabase keys are configured, it automatically executes a local simulation loop complete with realistic agent thinking, messaging feeds, progress updates, and full markdown report generation."
    },
    {
      q: "How secure is the agent workforce?",
      a: "FlowMind AI integrates a dedicated Risk Analysis Agent (Regina) into every workflow. Regina checks all outbound content for GDPR compliance, SOC2 guidelines, and operational liabilities before compilation."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Hero background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px]"></div>
        <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between border-b border-slate-900/80 sticky top-0 backdrop-blur-md bg-dark-950/75 z-50">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🧠</span>
          <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            FlowMind AI
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-400">
          <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-slate-200 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-slate-200 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-slate-200 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/login" className="hidden sm:block text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-3.5 sm:px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-lg shadow-brand-500/20 flex items-center space-x-1 transition-all touch-target"
          >
            <span>Deploy Workforce</span>
            <ArrowRight size={12} />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800 touch-target"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-dark-950/95 border-b border-slate-900 backdrop-blur-md p-6 space-y-4 z-40">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
            <a href="#features" onClick={() => setIsMobileNavOpen(false)} className="hover:text-brand-400 transition-colors py-1">Features</a>
            <a href="#workflow" onClick={() => setIsMobileNavOpen(false)} className="hover:text-brand-400 transition-colors py-1">How It Works</a>
            <a href="#pricing" onClick={() => setIsMobileNavOpen(false)} className="hover:text-brand-400 transition-colors py-1">Pricing</a>
            <a href="#faq" onClick={() => setIsMobileNavOpen(false)} className="hover:text-brand-400 transition-colors py-1">FAQ</a>
          </nav>
          <div className="pt-3 border-t border-slate-900 flex flex-col space-y-2">
            <Link to="/login" onClick={() => setIsMobileNavOpen(false)} className="text-center py-2 text-xs font-semibold text-slate-400 hover:text-white">
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-28 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-semibold text-brand-300 tracking-wider uppercase mb-8 shadow-inner shadow-brand-500/5">
          <Sparkles size={12} className="text-brand-400 animate-pulse" />
          <span>Autonomous AI Agents for enterprise</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
          Meet Your Autonomous <br />
          <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            AI Agent Workforce
          </span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop writing simple prompts. Assign business goals and watch your CEO, Planner, Researcher, and Developer agents collaborate in real-time to complete complex multi-step workflows.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-sm font-semibold text-white shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            <span>Start Free Trial</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-850 flex items-center justify-center transition-all"
          >
            Evaluate Demo OS
          </Link>
        </div>

        {/* Hero Interactive Screen Preview */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-3 max-w-5xl mx-auto shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
          <div className="bg-dark-950/80 rounded-xl overflow-hidden border border-slate-900">
            {/* Mock Header */}
            <div className="h-10 px-4 border-b border-slate-900 flex items-center justify-between text-[11px] text-slate-500 bg-slate-900/10">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/30"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30"></span>
              </div>
              <span className="font-semibold text-slate-400 flex items-center space-x-1">
                <Terminal size={12} className="text-brand-400 mr-1" />
                flowmind-agent-workforce-orchestrator
              </span>
              <span>v1.0.0</span>
            </div>

            {/* Mock Workspace Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-900 text-left min-h-[300px] text-xs">
              <div className="p-5 flex flex-col space-y-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Workspace Input</p>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 italic font-semibold text-slate-300">
                  &ldquo;I need a target marketing campaign and pricing budget sheets for our new software launch.&rdquo;
                </div>
                <div className="flex-1 flex flex-col justify-end space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Task Planner</span>
                    <span>100% Compile</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-600 to-pink-500 w-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col space-y-4 col-span-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Collaborative Logs</p>
                <div className="space-y-3 font-mono text-[11px] text-slate-400">
                  <p><span className="text-brand-400">[CEO Arthur]</span> Initialized goal checklist. Dispatched strategy directives to Sophia.</p>
                  <p><span className="text-amber-400">[Sophia Planner]</span> Compiled goal into 5 subtasks. Assigned task 1 &ldquo;Competitor Audit&rdquo; to Isaac.</p>
                  <p><span className="text-blue-400">[Isaac Research]</span> Completed landscape indexing. Target: SMB SaaS clients. Dispatched results to Amelia.</p>
                  <p><span className="text-pink-400">[Amelia Marketing]</span> Drafted campaign copies. Outgoing payload saved. Dispatched to Marcus.</p>
                  <p><span className="text-emerald-400">[Marcus Finance]</span> Calibrating cost matrix. ROI projected at 450% savings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y border-slate-900 bg-slate-950/20 py-8 text-center text-xs tracking-wider uppercase font-semibold text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-around gap-8">
          <span>Stripe Integration Ready</span>
          <span>OpenAI Partner API</span>
          <span>Supabase DB Layer</span>
          <span>Render Deployment Compatible</span>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-16 tracking-tight">
          Everything You Need to Scale Operations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col items-start text-left">
            <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 mb-6">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-slate-100 mb-2">Autonomous Workflow Builder</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Design templates visually using a drag-and-drop node system. Hook agents to loops, validation rules, and approval checkpoints.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col items-start text-left">
            <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 mb-6">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-slate-100 mb-2">Risk & Quality Checkers</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every workflow undergoes compliance validation. Quality Checker and Risk Assessor agents review all deliverables.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col items-start text-left">
            <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 mb-6">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-slate-100 mb-2">Long & Short-Term Memory</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Agents preserve project history, short-term session caches, and long-term business rule knowledge base structures.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16 text-center border-t border-slate-900">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">Flexible SaaS Pricing Plans</h2>
        <p className="text-slate-400 text-xs mb-16">Choose the bandwidth that fits your organizational goal velocity.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Trial */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-left flex flex-col">
            <h3 className="font-bold text-slate-100 text-lg mb-1">Developer Sandbox</h3>
            <p className="text-slate-500 text-xs mb-6">Perfect for hackathon evaluation and testing.</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold">$0</span>
              <span className="text-slate-500 text-xs font-semibold ml-1">/ forever</span>
            </div>
            <ul className="space-y-3.5 mb-8 text-xs font-semibold text-slate-300 flex-1">
              <li className="flex items-center space-x-2">
                <Check size={14} className="text-brand-400" />
                <span>Simulated Offline Loop Mode</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={14} className="text-brand-400" />
                <span>14 Default Collaborative Agents</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={14} className="text-brand-400" />
                <span>Basic PDF/CSV Knowledge Base uploads</span>
              </li>
            </ul>
            <Link
              to="/signup"
              className="block w-full text-center py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-all"
            >
              Get Sandbox Access
            </Link>
          </div>

          {/* Premium Enterprise */}
          <div className="glass-panel p-8 rounded-2xl border-2 border-brand-500 text-left flex flex-col relative shadow-xl shadow-brand-500/5">
            <span className="absolute top-4 right-4 bg-brand-600/20 text-brand-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
            <h3 className="font-bold text-slate-100 text-lg mb-1">Scale Operations</h3>
            <p className="text-slate-500 text-xs mb-6">Designed for enterprise business automation.</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold">$99</span>
              <span className="text-slate-500 text-xs font-semibold ml-1">/ month</span>
            </div>
            <ul className="space-y-3.5 mb-8 text-xs font-semibold text-slate-300 flex-1">
              <li className="flex items-center space-x-2">
                <Check size={14} className="text-brand-400" />
                <span>Live Grok AI API Integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={14} className="text-brand-400" />
                <span>Supabase PostgreSQL Cluster Connection</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={14} className="text-brand-400" />
                <span>Infinite Workflow Templates & Storage</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={14} className="text-brand-400" />
                <span>Priority JWT Token limits & Webhook actions</span>
              </li>
            </ul>
            <Link
              to="/signup"
              className="block w-full text-center py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24 border-t border-slate-900">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-12 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                {activeFaq === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {activeFaq === index && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-900/60 pt-4 bg-slate-900/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-dark-950 py-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span>🧠</span>
            <span className="font-bold text-slate-400">FlowMind AI</span>
          </div>
          <p className="md:order-last">
            &copy; 2026 FlowMind AI. Built for the Agentic AI Hackathon.
          </p>
          <div className="flex space-x-6 text-[11px] font-semibold text-slate-500">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
