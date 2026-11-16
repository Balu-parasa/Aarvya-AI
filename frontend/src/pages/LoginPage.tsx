import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, ArrowRight, Shield, CheckCircle2, Sparkles, Lock, HeartPulse } from 'lucide-react';
import { setAuthToken } from '../services/api';
import axios from 'axios';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login/', { email, password });
      const { token, user } = res.data;

      // Store token and user info
      setAuthToken(token);
      localStorage.setItem('aarvya_user', JSON.stringify(user));

      onLoginSuccess(user);

      // Automatic Role-Based Redirection
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'counsellor') navigate('/counsellor', { replace: true });
      else navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Authentication failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#E9E2FF] relative overflow-hidden font-sans">
      {/* Subtle ambient lighting glows matching palette */}
      <div className="fixed top-[-80px] left-[-80px] w-[550px] h-[550px] bg-[#DCD2FF]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-80px] right-[-80px] w-[550px] h-[550px] bg-[#C8C1E3]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split-Screen Container */}
      <div className="w-full max-w-[1240px] min-h-[640px] bg-white/80 backdrop-blur-2xl rounded-[32px] border border-white/80 shadow-2xl shadow-[#7546F5]/15 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* LEFT SIDE: Custom Illustration & Platform Highlights */}
        <div className="lg:col-span-7 bg-[#541388] text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative glow inside image card */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7546F5]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#3C096C]/60 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Tagline */}
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-white/90">
                MoSJE SIH26094 • Active Monitoring System
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white leading-tight">
              Aarvya AI
            </h1>
            <p className="text-sm text-purple-200 mt-1 font-medium">
              Every Emotion Matters. Every Voice Deserves Support.
            </p>
          </div>

          {/* Centerpiece Image with rounded framing */}
          <div className="relative z-10 my-6 flex items-center justify-center">
            <div className="relative w-full max-w-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
              <img
                src="/login-illustration.jpg"
                alt="Aarvya AI Emotion AI & Mental Health Telemetry"
                className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#541388]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom Pillar Feature Highlights */}
          <div className="relative z-10 pt-4 border-t border-white/15 grid grid-cols-3 gap-3 text-left">
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white mb-0.5">
                <Brain className="w-3.5 h-3.5 text-purple-300" />
                <span>Emotion AI</span>
              </div>
              <p className="text-[11px] text-purple-200 leading-snug">
                NLP threat, trauma, and distress analysis.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white mb-0.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-300" />
                <span>NHAA 14566</span>
              </div>
              <p className="text-[11px] text-purple-200 leading-snug">
                24/7 crisis triage & welfare protection line.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white mb-0.5">
                <Shield className="w-3.5 h-3.5 text-emerald-300" />
                <span>AES-256</span>
              </div>
              <p className="text-[11px] text-purple-200 leading-snug">
                Encrypted in-transit & at-rest in MongoDB.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Clean, Premium Login Form */}
        <div className="lg:col-span-5 bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#7546F5]/10 text-[#7546F5] flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#242033] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-[#858098] mt-1">
                Enter your credentials to securely access your dedicated workspace
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start space-x-2 animate-fadeIn">
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#242033] mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] placeholder:text-[#858098]/50 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40 focus:border-[#7546F5] transition-all text-sm font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-[#242033] uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your account password"
                    className="w-full px-4 py-3.5 pr-11 rounded-2xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] placeholder:text-[#858098]/50 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40 focus:border-[#7546F5] transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#858098] hover:text-[#7546F5] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-[#7546F5] hover:bg-[#6035E0] text-white font-bold text-sm shadow-xl shadow-[#7546F5]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Workspace</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Card Section */}
          <div className="mt-8 pt-6 border-t border-[#F1ECFF]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#858098]">New to Aarvya AI?</span>
              <Link
                to="/register"
                className="text-[#7546F5] font-bold hover:underline"
              >
                Create Account & Select Role →
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center space-x-2 text-[10px] text-[#858098]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Automatic Role Detection • Protected Health Information (PHI)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
