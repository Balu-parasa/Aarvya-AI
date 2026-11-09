import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, ArrowRight, User, Stethoscope, Shield, CheckCircle } from 'lucide-react';
import { setAuthToken } from '../services/api';
import axios from 'axios';

const roles = [
  { key: 'user', label: 'Individual / User', icon: User, desc: 'Track your emotional well-being and access support' },
  { key: 'counsellor', label: 'Counsellor', icon: Stethoscope, desc: 'Manage and support assigned individuals' },
  { key: 'admin', label: 'Administrator', icon: Shield, desc: 'System administration (requires approval)' },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingAdmin, setPendingAdmin] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register/', { name, email, password, role });
      const { token, user } = res.data;

      if (role === 'admin' && user.is_approved === false) {
        setPendingAdmin(true);
        setLoading(false);
        return;
      }

      // Store token and user info
      setAuthToken(token);
      localStorage.setItem('aarvya_user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'counsellor') navigate('/counsellor', { replace: true });
      else navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (pendingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#DCD2FF]/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#C8C1E3]/40 rounded-full blur-3xl" />
        <div className="w-full max-w-[480px] relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-[#7546F5]/10 p-8 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#242033] font-heading mb-2">Admin Approval Required</h2>
            <p className="text-sm text-[#858098] mb-6">
              Your admin account request has been submitted. The existing administrator must approve your access before you can log in.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#7546F5] text-white font-semibold text-sm shadow-lg shadow-[#7546F5]/25 hover:bg-[#6035E0] transition-all"
            >
              <span>Back to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#DCD2FF]/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#C8C1E3]/40 rounded-full blur-3xl" />

      <div className="w-full max-w-[520px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#242033] text-white mb-4 shadow-lg shadow-[#7546F5]/20">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#242033] tracking-tight">Create Account</h1>
          <p className="text-sm text-[#858098] mt-1">Join the Aarvya AI platform</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-[#7546F5]/10 p-8 sm:p-10">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#242033] mb-2 uppercase tracking-wider">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRole(r.key)}
                      className={`relative flex flex-col items-center px-3 py-3 rounded-xl border-2 transition-all text-center ${
                        role === r.key
                          ? 'border-[#7546F5] bg-[#F1ECFF] shadow-md shadow-[#7546F5]/10'
                          : 'border-[#DCD2FF] bg-[#F8F5FF] hover:border-[#A78BFA]'
                      }`}
                    >
                      {role === r.key && (
                        <CheckCircle className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-[#7546F5]" />
                      )}
                      <Icon className={`w-5 h-5 mb-1 ${role === r.key ? 'text-[#7546F5]' : 'text-[#858098]'}`} />
                      <span className={`text-xs font-semibold ${role === r.key ? 'text-[#7546F5]' : 'text-[#242033]'}`}>
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {role === 'admin' && (
                <p className="mt-2 text-xs text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  ⚠ Admin accounts require approval from the existing administrator before activation.
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#242033] mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] placeholder:text-[#858098]/60 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40 focus:border-[#7546F5] transition-all text-sm"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#242033] mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] placeholder:text-[#858098]/60 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40 focus:border-[#7546F5] transition-all text-sm"
              />
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#858098]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7546F5] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

