import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Mail, Lock, AlertCircle, ArrowLeft, CheckCircle, ShieldCheck, Trash2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [hasSavedCreds, setHasSavedCreds] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Load saved credentials from this device on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('flowmind_saved_email');
    const savedPwd = localStorage.getItem('flowmind_saved_password');
    const savedRemember = localStorage.getItem('flowmind_remember_me');

    if (savedEmail) {
      setEmail(savedEmail);
      if (savedPwd) {
        setPassword(savedPwd);
      }
      setHasSavedCreds(true);
      if (savedRemember !== null) {
        setRememberMe(savedRemember === 'true');
      }
    }
  }, []);

  const handleClearSavedCreds = () => {
    localStorage.removeItem('flowmind_saved_email');
    localStorage.removeItem('flowmind_saved_password');
    localStorage.removeItem('flowmind_remember_me');
    setEmail('');
    setPassword('');
    setHasSavedCreds(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('flowmind_saved_email', email);
        localStorage.setItem('flowmind_saved_password', password);
        localStorage.setItem('flowmind_remember_me', 'true');
      } else {
        localStorage.removeItem('flowmind_saved_email');
        localStorage.removeItem('flowmind_saved_password');
        localStorage.removeItem('flowmind_remember_me');
      }

      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || (typeof err.response?.data === 'string' ? err.response.data : err.message) || 'Invalid credentials. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setResetSuccess(true);
      setLoading(false);
    }, 1500);
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
        
        {/* Toggle between standard Login and Forgot Password views */}
        {!isForgotPassword ? (
          <>
            <div className="text-center mb-8">
              <span className="text-3xl mb-3 block">🧠</span>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Welcome to FlowMind
              </h2>
              <p className="text-xs text-slate-400 mt-1.5">Sign in to orchestrate your AI workforce</p>
            </div>

            {hasSavedCreds && (
              <div className="mb-5 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={16} className="text-brand-400 shrink-0" />
                  <span>Saved credentials loaded for this device</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearSavedCreds}
                  title="Forget credentials on this device"
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2.5">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setResetSuccess(false);
                      setError('');
                    }}
                    className="text-[10px] text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                  />
                </div>
              </div>

              {/* Remember Credentials Checkbox */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500/50 cursor-pointer accent-brand-500"
                  />
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors">
                    Save credentials on this device
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>

            <p className="text-center text-[11px] text-slate-500 mt-6">
              Don&rsquo;t have an account?{' '}
              <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                Create account
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="text-3xl mb-3 block">🔑</span>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Reset Password
              </h2>
              <p className="text-xs text-slate-400 mt-1.5">Recover your FlowMind OS credentials</p>
            </div>

            {resetSuccess ? (
              <div className="space-y-6 text-center">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex flex-col items-center space-y-2">
                  <CheckCircle size={20} className="text-emerald-400" />
                  <span className="font-bold">Recovery Email Dispatched</span>
                  <span className="text-[11px] text-slate-400 leading-relaxed">
                    We have successfully sent reset instructions to <strong className="text-slate-200">{email}</strong>. Please check your inbox.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSuccess(false);
                    setError('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Requesting Reset...' : 'Send Recovery Link'}</span>
                  {!loading && <ArrowRight size={14} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-slate-200 transition-all text-center"
                >
                  Cancel and Return
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Login;
