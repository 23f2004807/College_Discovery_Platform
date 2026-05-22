import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, IndianRupee, Star, Bookmark, BookmarkCheck, GitCompare, Sparkles, FilterX } from 'lucide-react';

export default function CollegeList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [course, setCourse] = useState('');
  const [maxFees, setMaxFees] = useState('');
  
  // Saved colleges state
  const [savedIds, setSavedIds] = useState([]);
  
  // Comparison list (stored in localStorage)
  const [compareList, setCompareList] = useState([]);

  // Fetch colleges
  const fetchColleges = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (course) params.append('course', course);
      if (maxFees) params.append('max_fees', maxFees);

      const data = await api.get(`/colleges?${params.toString()}`);
      setColleges(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved list to highlight bookmarked colleges
  const fetchSavedList = async () => {
    if (!user) {
      setSavedIds([]);
      return;
    }
    try {
      const data = await api.get('/saved');
      setSavedIds(data.map(item => item.college_id));
    } catch (err) {
      console.error('Failed to load saved items:', err);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [search, location, course, maxFees]);

  useEffect(() => {
    fetchSavedList();
    // Load comparison list from localStorage
    const savedCompare = JSON.parse(localStorage.getItem('compareList') || '[]');
    setCompareList(savedCompare);
  }, [user]);

  // Toggle Save College
  const handleToggleSave = async (collegeId) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const result = await api.post('/saved/toggle', { college_id: collegeId });
      if (result.saved) {
        setSavedIds([...savedIds, collegeId]);
      } else {
        setSavedIds(savedIds.filter(id => id !== collegeId));
      }
    } catch (err) {
      console.error('Error saving/removing college:', err);
    }
  };

  // Toggle Compare
  const handleToggleCompare = (college) => {
    let updated;
    const isAlreadyAdded = compareList.some(item => item.id === college.id);
    if (isAlreadyAdded) {
      updated = compareList.filter(item => item.id !== college.id);
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 colleges.');
        return;
      }
      updated = [...compareList, college];
    }
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setCourse('');
    setMaxFees('');
  };

  // List of locations/courses for filter dropdowns (can also be derived dynamically)
  const locationsList = [
    "Mumbai", "New Delhi", "Chennai", "Pilani", 
    "Tiruchirappalli", "Mangaluru", "Vellore", "Hyderabad", "Bengaluru"
  ];

  const coursesList = [
    "Computer Science", "Information Technology", "Electrical", 
    "Mechanical", "Chemical", "Civil", "Aerospace"
  ];

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight d-flex justify-content-center align-items-center gap-2">
          <Sparkles className="text-sky-500 h-8 w-8 animate-bounce" />
          <span>Discover Top Colleges</span>
        </h1>
        <p className="text-slate-500 mt-2">Filter and search through our curated seed list of tier-1 institutions.</p>
      </div>

      {/* Comparison Basket Banner */}
      {compareList.length > 0 && (
        <div className="alert bg-slate-900 text-white rounded-2xl p-3 d-flex justify-content-between align-items-center mb-6 shadow border border-slate-700 animate-fade-in">
          <div className="d-flex align-items-center gap-2">
            <GitCompare className="text-sky-400 h-5 w-5 animate-pulse" />
            <span className="text-sm font-semibold">
              Comparison Basket: {compareList.length} of 3 colleges selected ({compareList.map(c => c.name.split(',')[0]).join(', ')})
            </span>
          </div>
          <div className="d-flex gap-2">
            <Link to="/compare" className="btn btn-sky btn-sm text-black bg-sky-400 hover:bg-sky-300 font-bold px-3 py-1.5 rounded-lg text-xs">
              Compare Now
            </Link>
            <button 
              onClick={() => { setCompareList([]); localStorage.removeItem('compareList'); }} 
              className="btn btn-outline-danger btn-sm px-2 py-1 rounded-lg text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters Controls */}
      <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white mb-8">
        <div className="row g-3">
          {/* Search bar */}
          <div className="col-12 col-md-4">
            <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Search College</label>
            <div className="position-relative">
              <input
                type="text"
                placeholder="Search by college name..."
                className="form-control pl-9 rounded-xl py-2 border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="position-absolute left-3 top-3 text-slate-400 h-4 w-4" />
            </div>
          </div>

          {/* Location filter */}
          <div className="col-6 col-md-2">
            <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Location</label>
            <select
              className="form-select rounded-xl py-2 border-slate-200 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locationsList.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Course filter */}
          <div className="col-6 col-md-2">
            <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Course</label>
            <select
              className="form-select rounded-xl py-2 border-slate-200 text-sm"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              {coursesList.map(crs => (
                <option key={crs} value={crs}>{crs}</option>
              ))}
            </select>
          </div>

          {/* Max Fees filter */}
          <div className="col-8 col-md-3">
            <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">
              Max Fees: {maxFees ? `₹${(parseInt(maxFees) / 100000).toFixed(1)} Lakh/yr` : "Any"}
            </label>
            <input
              type="range"
              min="100000"
              max="600000"
              step="50000"
              className="form-range mt-2 text-sky-600"
              value={maxFees}
              onChange={(e) => setMaxFees(e.target.value)}
            />
          </div>

          {/* Clear Filters Button */}
          <div className="col-4 col-md-1 d-flex align-items-end">
            <button
              onClick={handleClearFilters}
              className="btn btn-outline-secondary w-100 rounded-xl py-2 d-flex align-items-center justify-content-center gap-1 text-xs font-bold transition-all hover:bg-slate-100 border-slate-200"
              title="Reset Filters"
            >
              <FilterX className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* College Listing Grid */}
      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-20">
          <div className="loading-spinner mb-3"></div>
          <span className="text-slate-500 text-sm font-semibold">Loading campuses...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center rounded-2xl py-4">{error}</div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20 card border-0 shadow-sm rounded-2xl bg-white">
          <p className="text-slate-400 text-lg">No colleges match your search parameters.</p>
          <button onClick={handleClearFilters} className="btn btn-primary mt-3 bg-sky-600 border-0 rounded-xl px-4 py-2 text-sm font-semibold">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {colleges.map((college) => {
            const isSaved = savedIds.includes(college.id);
            const isAddedToCompare = compareList.some(item => item.id === college.id);
            
            return (
              <div key={college.id} className="col">
                <div className="card h-100 border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all duration-200 bg-white">
                  {/* Card Header image & bookmark toggle */}
                  <div className="gradient-primary-glow p-4 d-flex justify-content-between align-items-start text-white position-relative">
                    {/* College logo mock */}
                    <div className="bg-white p-2 rounded-xl shadow-sm d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                      {college.logo_url ? (
                        <img src={college.logo_url} alt={college.name} className="img-fluid object-contain max-h-full" />
                      ) : (
                        <span className="text-slate-700 font-extrabold text-lg">{college.name.substring(0, 2)}</span>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleToggleCompare(college)}
                        className={`btn btn-sm rounded-full p-2 border-0 d-flex align-items-center justify-content-center transition-all ${isAddedToCompare ? 'bg-amber-400 text-black shadow' : 'bg-black/30 hover:bg-black/50 text-white'}`}
                        title={isAddedToCompare ? "Added to Compare" : "Compare College"}
                      >
                        <GitCompare className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleToggleSave(college.id)}
                        className={`btn btn-sm rounded-full p-2 border-0 d-flex align-items-center justify-content-center transition-all ${isSaved ? 'bg-red-500 text-white shadow' : 'bg-black/30 hover:bg-black/50 text-white'}`}
                        title={isSaved ? "Saved" : "Save College"}
                      >
                        {isSaved ? <BookmarkCheck className="h-4 w-4 fill-white" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="card-title font-extrabold text-lg text-slate-900 leading-snug mb-1">
                      {college.name}
                    </h5>
                    
                    <div className="text-slate-500 text-xs d-flex align-items-center gap-1 mb-3">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {college.location}
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Annual Fees</div>
                        <div className="text-sm font-extrabold text-slate-800 d-flex align-items-center">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {(college.fees / 100000).toFixed(2)} Lakh
                        </div>
                      </div>
                      <div className="border-r border-slate-200 h-8"></div>
                      <div className="text-end">
                        <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Rating</div>
                        <div className="text-sm font-extrabold text-amber-500 d-flex align-items-center gap-1 justify-content-end">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          {college.rating}
                        </div>
                      </div>
                    </div>

                    {/* Courses offered badges */}
                    <div className="mb-4">
                      <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mb-1.5">Courses Offered</div>
                      <div className="d-flex flex-wrap gap-1">
                        {college.courses.slice(0, 3).map((c, idx) => (
                          <span key={idx} className="badge bg-slate-100 text-slate-600 border border-slate-200 text-[10px] px-2 py-1 rounded">
                            {c}
                          </span>
                        ))}
                        {college.courses.length > 3 && (
                          <span className="badge bg-slate-100 text-slate-400 text-[10px] px-2 py-1 rounded">
                            +{college.courses.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details Link */}
                    <Link
                      to={`/colleges/${college.id}`}
                      className="btn btn-outline-primary w-100 mt-auto rounded-xl py-2 text-xs font-bold transition-all border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white"
                    >
                      View Details & Reviews
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
