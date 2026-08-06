import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './layouts/AppLayout';
import './index.css';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Collaboration from './pages/Collaboration';
import WorkflowBuilder from './pages/WorkflowBuilder';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import KnowledgeBase from './pages/KnowledgeBase';
import Memory from './pages/Memory';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/Settings';

// Protected Route Guard Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
          <span className="text-xs text-slate-400 font-semibold tracking-wider">LOADING WORKSPACE OS...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Auth */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected SaaS App routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
            <Route path="/collaboration" element={<ProtectedRoute><Collaboration /></ProtectedRoute>} />
            <Route path="/builder" element={<ProtectedRoute><WorkflowBuilder /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/kb" element={<ProtectedRoute><KnowledgeBase /></ProtectedRoute>} />
            <Route path="/memory" element={<ProtectedRoute><Memory /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
