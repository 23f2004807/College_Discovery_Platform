import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CollegeList from './pages/CollegeList';
import CollegeDetail from './pages/CollegeDetail';
import Compare from './pages/Compare';
import Predictor from './pages/Predictor';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import SavedColleges from './pages/SavedColleges';
import ProtectedRoute from './components/ProtectedRoute';
import { GraduationCap } from 'lucide-react';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen d-flex flex-column bg-slate-50">
          {/* Header Navbar */}
          <Navbar />

          {/* Main Content Router */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colleges" element={<ProtectedRoute><CollegeList /></ProtectedRoute>} />
              <Route path="/colleges/:id" element={<ProtectedRoute><CollegeDetail /></ProtectedRoute>} />
              <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
              <Route path="/predictor" element={<ProtectedRoute><Predictor /></ProtectedRoute>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/saved" element={<ProtectedRoute><SavedColleges /></ProtectedRoute>} />
              <Route path="/admin/login" element={<Navigate to="/auth" replace />} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer Component */}
          <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 text-center mt-auto">
            <div className="container max-w-4xl mx-auto">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3 text-white font-bold text-lg">
                <GraduationCap className="h-6 w-6 text-sky-400" />
                <span className="gradient-text font-black">CampusDiscovery</span>
              </div>
              <p className="text-xs text-slate-500 mb-0">
                &copy; {new Date().getFullYear()} CampusDiscovery Platform MVP. Built with React Vite, Tailwind CSS, Bootstrap CSS & Flask.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
