import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
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

      // Automatically route user strictly based on their registered role from MongoDB
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#E9E2FF]">
      {/* Ambient soft glow background elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#DCD2FF]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#C8C1E3]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[460px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#242033] text-white mb-3 shadow-lg shadow-[#7546F5]/20">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#242033] tracking-tight">
            Aarvya AI
          </h1>
          <p className="text-xs uppercase font-semibold tracking-wider text-[#7546F5] mt-1">
            Every Emotion Matters. Every Voice Deserves Support.
          </p>
        </div>

        {/* Clean Sign In Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-2xl shadow-[#7546F5]/10 p-6 sm:p-8">
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#242033] font-heading">Sign In</h2>
            <p className="text-xs text-[#858098] mt-1">
              Enter your credentials to securely access your dedicated workspace
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start space-x-2 animate-fadeIn">
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
                className="w-full px-4 py-3 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] placeholder:text-[#858098]/50 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40 focus:border-[#7546F5] transition-all text-sm font-medium"
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
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] placeholder:text-[#858098]/50 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40 focus:border-[#7546F5] transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858098] hover:text-[#7546F5] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#7546F5] hover:bg-[#6035E0] text-white font-semibold text-sm shadow-lg shadow-[#7546F5]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-5 border-t border-[#F1ECFF] text-center">
            <p className="text-xs text-[#858098]">
              New to Aarvya AI?{' '}
              <Link to="/register" className="text-[#7546F5] font-semibold hover:underline">
                Create Account & Select Role
              </Link>
            </p>
          </div>
        </div>

        {/* Security / Encryption badge */}
        <div className="flex items-center justify-center space-x-2 text-center text-[11px] text-[#858098] mt-6">
          <Shield className="w-3.5 h-3.5 text-[#7546F5]" />
          <span>Automatic Role Detection • End-to-End Encrypted Authentication</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
