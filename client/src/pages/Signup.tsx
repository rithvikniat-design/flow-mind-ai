import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('flowmind_saved_email', email);
        localStorage.setItem('flowmind_saved_password', password);
        localStorage.setItem('flowmind_remember_me', 'true');
      }
      await signup({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      let errMsg = err.response?.data?.error;
      if (!errMsg && typeof err.response?.data === 'string') {
        if (err.response.data.trim().toLowerCase().startsWith('<!doctype')) {
          errMsg = 'Backend API URL not connected on Vercel. Please add VITE_API_URL in Vercel Environment Variables.';
        } else {
          errMsg = err.response.data;
        }
      }
      setError(errMsg || err.message || 'Registration failed. Name must be at least 2 characters long.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-6 relative">
      {/* Background glow spots */}
      <div className="absolute top-[20%] left-[30%] w-96 h-96 glow-bg-indigo pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[30%] w-96 h-96 glow-bg-pink pointer-events-none"></div>

      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Landing</span>
        </Link>
      </div>

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-slate-800 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="text-3xl mb-3 block">🧠</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">Deploy your autonomous collaborative workforce</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2.5">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500" size={14} />
              <input
                type="text"
                required
                minLength={2}
                placeholder="Arthur Dent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={14} />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={14} />
              <input
                type="password"
                required
                placeholder="•••••••• (Min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Registering...' : 'Deploy Workforce'}</span>
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
