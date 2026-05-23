import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton({ className = '', variant = 'outline-danger' }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`btn btn-${variant} btn-sm d-flex align-items-center gap-1 px-3 py-2 rounded-lg font-semibold ${className}`}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
