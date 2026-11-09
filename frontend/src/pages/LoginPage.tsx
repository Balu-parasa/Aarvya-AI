import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
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

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'counsellor') navigate('/counsellor', { replace: true });
      else navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#DCD2FF]/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#C8C1E3]/40 rounded-full blur-3xl" />

      <div className="w-full max-w-[480px] relative z-10">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#242033] text-white mb-4 shadow-lg shadow-[#7546F5]/20">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#242033] tracking-tight">
            Aarvya AI
          </h1>
          <p className="text-sm text-[#858098] mt-1">Every Emotion Matters. Every Voice Deserves Support.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-[#7546F5]/10 p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#242033] font-heading">Welcome Back</h2>
            <p className="text-sm text-[#858098] mt-1">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#242033] mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] placeholder:text-[#858098]/60 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40 focus:border-[#7546F5] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242033] mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] placeholder:text-[#858098]/60 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40 focus:border-[#7546F5] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858098] hover:text-[#7546F5] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#7546F5] hover:bg-[#6035E0] text-white font-semibold text-sm shadow-lg shadow-[#7546F5]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl bg-[#F1ECFF]/60 border border-[#DCD2FF]/50">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#7546F5]" />
              <span className="text-xs font-bold text-[#7546F5] uppercase tracking-wider">Demo Accounts</span>
            </div>
            <div className="space-y-1.5 text-xs text-[#242033]">
              <p><span className="font-semibold">User:</span> user@aarvya.ai / pass123</p>
              <p><span className="font-semibold">Counsellor:</span> jams@aarvya.ai / pass123</p>
              <p><span className="font-semibold">Admin:</span> admin@aarvya.ai / admin123</p>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#858098]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#7546F5] font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#858098] mt-6">
          Confidential • Privacy-First • Human-Centred Support
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

