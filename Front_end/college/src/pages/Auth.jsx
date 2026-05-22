import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, Shield, User, Loader2 } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, role);
      }
      navigate('/colleges');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow shapes */}
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-sky-400/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-400/10 blur-[100px] pointer-events-none"></div>

      <div className="card max-w-md w-100 border-0 shadow-lg rounded-3xl overflow-hidden glass-card p-5 z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin ? 'Welcome back! Sign in to access your dashboard' : 'Join us to search, compare, and save colleges'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="d-flex bg-slate-100 p-1 rounded-2xl mb-4">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl border-0 transition-all ${isLogin ? 'bg-white text-sky-600 shadow' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl border-0 transition-all ${!isLogin ? 'bg-white text-sky-600 shadow' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="alert alert-danger rounded-xl text-xs py-2.5 mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-3">
            <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Email Address</label>
            <div className="position-relative mt-1">
              <input
                type="email"
                placeholder="name@domain.com"
                className="form-control pl-9 rounded-xl py-2.5 border-slate-200 text-sm font-semibold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="position-absolute left-3 top-3 text-slate-400 h-4 w-4" />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Password</label>
            <div className="position-relative mt-1">
              <input
                type="password"
                placeholder="••••••••"
                className="form-control pl-9 rounded-xl py-2.5 border-slate-200 text-sm font-semibold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <KeyRound className="position-absolute left-3 top-3 text-slate-400 h-4 w-4" />
            </div>
          </div>

          {/* Role selection (only visible during registration) */}
          {!isLogin && (
            <div className="mb-4">
              <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Account Type (Role)</label>
              <div className="row g-2 mt-1">
                <div className="col-6">
                  <label className={`border p-2.5 rounded-xl d-flex align-items-center justify-content-center gap-1.5 cursor-pointer text-xs font-bold transition-all ${role === 'user' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-500'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === 'user'}
                      onChange={() => setRole('user')}
                      className="d-none"
                    />
                    <User className="h-3.5 w-3.5" /> Standard User
                  </label>
                </div>
                <div className="col-6">
                  <label className={`border p-2.5 rounded-xl d-flex align-items-center justify-content-center gap-1.5 cursor-pointer text-xs font-bold transition-all ${role === 'admin' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={() => setRole('admin')}
                      className="d-none"
                    />
                    <Shield className="h-3.5 w-3.5" /> Administrator
                  </label>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 rounded-xl py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 border-0 d-flex align-items-center justify-content-center gap-1.5 text-white glow-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Mock Credentials Help */}
        <div className="border-t border-slate-150 mt-4 pt-3 text-[10px] text-slate-400">
          <div className="font-extrabold text-slate-500 mb-1">Pre-seeded accounts for testing:</div>
          <div>👤 User: <code className="text-slate-600 text-[10px] p-0.5 bg-slate-105 rounded">user@college.com</code> / <code className="text-slate-600 text-[10px] p-0.5 bg-slate-105 rounded">UserPass123!</code></div>
          <div className="mt-0.5">🔑 Admin: <code className="text-slate-605 text-[10px] p-0.5 bg-slate-105 rounded">admin@college.com</code> / <code className="text-slate-606 text-[10px] p-0.5 bg-slate-105 rounded">AdminPass123!</code></div>
        </div>
      </div>
    </div>
  );
}
