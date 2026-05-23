import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import UserProfileMenu from './UserProfileMenu';
import {
  GraduationCap, GitCompare, Award, Bookmark, LogIn, Shield, Search,
} from 'lucide-react';

function NavWidgets({ user, className = '' }) {
  if (!user) {
    return (
      <div className={`navbar-widgets d-flex align-items-center gap-2 ${className}`}>
        <Link
          to="/auth?mode=register"
          className="btn btn-outline-light btn-sm px-3 py-2 rounded-lg fw-semibold"
        >
          Register
        </Link>
        <Link
          to="/auth"
          className="btn btn-primary btn-sm px-4 py-2 rounded-lg glow-btn d-flex align-items-center gap-1 fw-semibold text-white bg-sky-600 border-0"
        >
          <LogIn size={16} /> Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className={`navbar-widgets d-flex align-items-center gap-2 ${className}`}>
      <UserProfileMenu />
      <LogoutButton />
    </div>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const navLinkClass = (path) => {
    const active = location.pathname === path || location.pathname.startsWith(`${path}/`);
    return `nav-link px-3 py-2 rounded-md d-flex align-items-center gap-1 ${
      active ? 'text-white fw-semibold bg-slate-700' : 'text-gray-300 hover:text-white'
    }`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-2 py-lg-3 px-3 px-lg-4 shadow sticky-top border-bottom border-secondary navbar-campus">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none flex-shrink-0" to="/">
          <GraduationCap className="text-sky-400 flex-shrink-0" style={{ width: 32, height: 32 }} />
          <span className="gradient-text fw-bold fs-5 d-none d-sm-inline text-nowrap">CampusDiscovery</span>
        </Link>

        {/* Desktop: quick-action widgets (always visible) */}
        <NavWidgets user={user} className="d-none d-lg-flex ms-auto order-lg-3" />

        <button
          className="navbar-toggler border-secondary d-lg-none ms-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Nav links + mobile widgets */}
        <div className="collapse navbar-collapse order-lg-2" id="navbarNav">
          <ul className="navbar-nav me-lg-auto mb-2 mb-lg-0 gap-lg-1 align-items-lg-center pt-2 pt-lg-0">
            <li className="nav-item">
              <Link className={navLinkClass('/')} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={navLinkClass('/colleges')} to="/colleges">
                <Search size={16} /> Explore Colleges
              </Link>
            </li>
            <li className="nav-item">
              <Link className={navLinkClass('/predictor')} to="/predictor">
                <Award size={16} /> Grade Predictor
              </Link>
            </li>
            <li className="nav-item">
              <Link className={navLinkClass('/compare')} to="/compare">
                <GitCompare size={16} /> Compare
              </Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className={navLinkClass('/admin')} to="/admin">
                  <Shield size={16} /> Admin
                </Link>
              </li>
            )}
            {user && user.role !== 'admin' && (
              <li className="nav-item">
                <Link className={navLinkClass('/saved')} to="/saved">
                  <Bookmark size={16} /> Saved
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile: same widgets inside hamburger menu */}
          <NavWidgets user={user} className="d-lg-none flex-column align-items-stretch pb-3 border-top border-secondary pt-3" />
        </div>
      </div>
    </nav>
  );
}
