import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const loggedInUser = await login(formData.email, formData.password);

      const redirectPath =
        location.state?.from?.pathname ||
        (loggedInUser.role === 'ngo' ? '/ngo' : '/donor');

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/15 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 mb-3 shadow-glow-emerald">
            <UtensilsCrossed size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to access your donation dashboard or NGO rescue hub
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs leading-relaxed animate-shake">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="donor@restaurant.com"
                required
                className="w-full glass-input text-white pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full glass-input text-white pl-10 pr-10 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition shadow-glow-emerald flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Need a test account?</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() =>
                setFormData({ email: 'donor@annadaan.org', password: 'password123' })
              }
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-left border border-slate-800 transition"
            >
              <span className="font-bold text-emerald-400 block">Donor Account</span>
              donor@annadaan.org
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({ email: 'ngo@shelter.org', password: 'password123' })
              }
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-left border border-slate-800 transition"
            >
              <span className="font-bold text-teal-400 block">NGO Account</span>
              ngo@shelter.org
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
          >
            <span>Register for Free</span>
            <ArrowRight size={12} />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
