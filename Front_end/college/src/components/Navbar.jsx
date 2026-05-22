import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, GitCompare, Award, Bookmark, LogOut, LogIn, User as UserIcon, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 px-4 shadow sticky-top border-b border-gray-800">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 font-bold text-xl tracking-tight" to="/">
          <GraduationCap className="h-8 w-8 text-sky-400 animate-pulse" />
          <span className="gradient-text font-black">CampusDiscovery</span>
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler border-0 focus:outline-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800 transition" to="/colleges">
                Explore Colleges
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md d-flex align-items-center gap-1 hover:bg-gray-800 transition" to="/compare">
                <GitCompare className="h-4 w-4" /> Compare
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md d-flex align-items-center gap-1 hover:bg-gray-800 transition" to="/predictor">
                <Award className="h-4 w-4" /> Predictor
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1 px-3 py-2 rounded-lg font-semibold shadow-sm transition-all hover:scale-105">
                    <Shield className="h-4 w-4" /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/saved" className="btn btn-outline-light btn-sm d-flex align-items-center gap-1 px-3 py-2 rounded-lg transition-all hover:scale-105">
                    <Bookmark className="h-4 w-4" /> Saved
                  </Link>
                )}
                
                <div className="d-flex align-items-center gap-2 text-white bg-gray-850 px-3 py-1.5 rounded-full border border-gray-700">
                  <UserIcon className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-medium d-none d-sm-inline">{user.email}</span>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-amber-500 text-black' : 'bg-sky-500 text-white'}`}>
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-2 rounded-lg transition-all hover:scale-105"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn btn-primary btn-sm px-4 py-2 rounded-lg glow-btn d-flex align-items-center gap-1 font-semibold text-white bg-sky-600 hover:bg-sky-500 border-0"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
