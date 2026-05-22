import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { BookmarkCheck, MapPin, IndianRupee, Star, Landmark, Trash2, ArrowLeft } from 'lucide-react';

export default function SavedColleges() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const fetchSavedColleges = async () => {
    setLoading(true);
    try {
      const data = await api.get('/saved');
      setSavedItems(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookmarked colleges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedColleges();
    }
  }, [user]);

  // Remove saved college
  const handleRemoveSaved = async (collegeId) => {
    try {
      await api.post('/saved/toggle', { college_id: collegeId });
      // Update UI list directly without full reload
      setSavedItems(savedItems.filter(item => item.college_id !== collegeId));
    } catch (err) {
      console.error(err);
      alert('Failed to remove bookmark.');
    }
  };

  if (authLoading || (loading && savedItems.length === 0)) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-20 min-h-screen">
        <div className="loading-spinner mb-3"></div>
        <span className="text-slate-500 font-semibold">Loading your bookmarks...</span>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight d-flex justify-content-center align-items-center gap-2">
          <BookmarkCheck className="text-red-500 h-8 w-8" />
          <span>My Saved Colleges</span>
        </h1>
        <p className="text-slate-500 mt-2">View and manage the campuses you have bookmarked for decision planning.</p>
      </div>

      {savedItems.length === 0 ? (
        <div className="text-center py-20 card border-0 shadow-sm rounded-3xl bg-white max-w-md mx-auto">
          <div className="bg-red-50 p-4 rounded-full w-fit mx-auto mb-4 text-red-400">
            <BookmarkCheck className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No saved colleges</h2>
          <p className="text-slate-400 mt-1 text-sm">
            Start browsing our listings and click the bookmark icon on college cards to save them.
          </p>
          <Link to="/colleges" className="btn btn-primary mt-4 bg-sky-600 border-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow d-inline-flex align-items-center gap-1.5 hover:bg-sky-505">
            <ArrowLeft className="h-4 w-4" /> Discover Colleges
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {savedItems.map((item) => {
            const college = item.college;
            if (!college) return null;
            return (
              <div key={item.id} className="col">
                <div className="card h-100 border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="gradient-primary-glow p-4 d-flex justify-content-between align-items-start text-white">
                    <div className="bg-white p-2 rounded-xl d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                      {college.logo_url ? (
                        <img src={college.logo_url} alt="" className="img-fluid object-contain max-h-full" />
                      ) : (
                        <span className="text-slate-700 font-bold text-sm">{college.name.substring(0, 2)}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleRemoveSaved(college.id)}
                      className="btn btn-sm rounded-full p-2 border-0 bg-red-500 hover:bg-red-600 text-white shadow"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="card-title font-extrabold text-sm text-slate-900 leading-snug mb-1">
                      {college.name}
                    </h5>
                    
                    <div className="text-slate-400 text-xs d-flex align-items-center gap-1 mb-3">
                      <MapPin className="h-3 w-3" />
                      {college.location}
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-extrabold">Fees</div>
                        <div className="font-extrabold text-slate-800 d-flex align-items-center mt-0.5">
                          <IndianRupee className="h-3 w-3" />
                          {(college.fees / 100000).toFixed(2)} Lakh
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="text-[9px] text-slate-400 uppercase font-extrabold">Rating</div>
                        <div className="font-extrabold text-amber-500 d-flex align-items-center gap-0.5 justify-content-end mt-0.5">
                          <Star className="h-3 w-3 fill-amber-500" />
                          {college.rating}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/colleges/${college.id}`}
                      className="btn btn-outline-primary w-100 mt-auto rounded-xl py-2 text-xs font-bold transition border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
