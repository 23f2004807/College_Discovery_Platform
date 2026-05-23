/** View layer — presentational auth UI (no business logic) */
import { Link } from 'react-router-dom';
import { KeyRound, Mail, User, Loader2, Phone, GraduationCap, School } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';

export default function AuthView({
  user,
  isLogin, setIsLogin, email, setEmail, password, setPassword,
  fullName, setFullName, phone, setPhone, expectingType, setExpectingType,
  fieldOfInterest, setFieldOfInterest, fieldOptions,
  loading, error, setError, successMessage, handleSubmit, dashboardPath,
  switchToLogin, switchToRegister,
}) {
  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-slate-50 py-12 px-4 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-sky-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-400/10 blur-[100px] pointer-events-none" />

      <div className={`card w-100 border-0 shadow-lg rounded-3xl overflow-hidden glass-card p-5 z-10 ${user || !isLogin ? 'max-w-lg' : 'max-w-md'}`}>
        {user ? (
          <div className="text-center py-4">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">You are signed in</h2>
            <p className="text-slate-500 text-sm mb-1">{user.full_name || user.email}</p>
            <span className={`badge mb-4 ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
              {user.role === 'admin' ? 'Administrator' : 'Student'}
            </span>
            <div className="d-flex flex-column gap-2">
              <Link to={dashboardPath} className="btn btn-primary rounded-xl py-2.5 text-sm font-bold bg-sky-600 border-0 text-white">
                Go to {user.role === 'admin' ? 'Admin Dashboard' : 'Explore Colleges'}
              </Link>
              <LogoutButton className="w-100 justify-content-center" />
              <Link to="/" className="btn btn-link text-slate-500 text-sm text-decoration-none">
                Back to home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {isLogin
                  ? 'Sign in to write reviews, use the predictor, and compare colleges'
                  : 'Tell us about yourself so we can personalize your college search'}
              </p>
            </div>

            <div className="d-flex bg-slate-100 p-1 rounded-2xl mb-4">
              <button type="button" onClick={switchToLogin}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border-0 ${isLogin ? 'bg-white text-sky-600 shadow' : 'bg-transparent text-slate-500'}`}>
                Sign In
              </button>
              <button type="button" onClick={switchToRegister}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border-0 ${!isLogin ? 'bg-white text-sky-600 shadow' : 'bg-transparent text-slate-500'}`}>
                Register
              </button>
            </div>

            {successMessage && isLogin && (
              <div className="alert alert-success rounded-xl text-xs py-2.5 mb-4 text-center">{successMessage}</div>
            )}
            {error && <div className="alert alert-danger rounded-xl text-xs py-2.5 mb-4 text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="mb-3">
                    <label className="form-label text-xs uppercase font-extrabold text-slate-500">Full Name</label>
                    <div className="position-relative mt-1">
                      <input type="text" placeholder="Your full name" className="form-control ps-5 rounded-xl py-2.5 border-slate-200 text-sm"
                        value={fullName} onChange={(e) => setFullName(e.target.value)} required={!isLogin} />
                      <User className="position-absolute start-0 top-50 translate-middle-y ms-3 text-slate-400 h-4 w-4" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-xs uppercase font-extrabold text-slate-500">Phone Number</label>
                    <div className="position-relative mt-1">
                      <input type="tel" placeholder="e.g. 9876543210" className="form-control ps-5 rounded-xl py-2.5 border-slate-200 text-sm"
                        value={phone} onChange={(e) => setPhone(e.target.value)} required={!isLogin} />
                      <Phone className="position-absolute start-0 top-50 translate-middle-y ms-3 text-slate-400 h-4 w-4" />
                    </div>
                  </div>
                </>
              )}
              <div className="mb-3">
                <label className="form-label text-xs uppercase font-extrabold text-slate-500">Email Address</label>
                <div className="position-relative mt-1">
                  <input type="email" placeholder="name@domain.com" className="form-control ps-5 rounded-xl py-2.5 border-slate-200 text-sm"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Mail className="position-absolute start-0 top-50 translate-middle-y ms-3 text-slate-400 h-4 w-4" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-xs uppercase font-extrabold text-slate-500">Password</label>
                <div className="position-relative mt-1">
                  <input type="password" placeholder="••••••••" className="form-control ps-5 rounded-xl py-2.5 border-slate-200 text-sm"
                    value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  <KeyRound className="position-absolute start-0 top-50 translate-middle-y ms-3 text-slate-400 h-4 w-4" />
                </div>
              </div>
              {!isLogin && (
                <>
                  <div className="mb-3">
                    <label className="form-label text-xs uppercase font-extrabold text-slate-500">I am expecting to join</label>
                    <div className="row g-2 mt-1">
                      {['School', 'College'].map((type) => (
                        <div key={type} className="col-6">
                          <label className={`border p-3 rounded-xl d-flex align-items-center justify-content-center gap-2 cursor-pointer text-sm font-bold w-100 ${
                            expectingType === type ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600'
                          }`}>
                            <input type="radio" name="expectingType" value={type} checked={expectingType === type}
                              onChange={() => setExpectingType(type)} className="d-none" />
                            {type === 'School' ? <School className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-xs uppercase font-extrabold text-slate-500">Field / Stream of Interest</label>
                    <select className="form-select rounded-xl py-2.5 border-slate-200 text-sm mt-1" value={fieldOfInterest}
                      onChange={(e) => setFieldOfInterest(e.target.value)} required={!isLogin}>
                      <option value="">— Select your field —</option>
                      {fieldOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </>
              )}
              <button type="submit" disabled={loading}
                className="btn btn-primary w-100 rounded-xl py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 border-0 text-white d-flex align-items-center justify-content-center gap-1.5">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link to="/" className="text-slate-500 text-sm text-decoration-none">← Back to home</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
