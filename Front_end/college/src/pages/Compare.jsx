import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { GitCompare, Plus, Trash2, ArrowLeft, Star, IndianRupee, MapPin, Award, CheckCircle } from 'lucide-react';

export default function Compare() {
  const [allColleges, setAllColleges] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState('');

  // Load comparison list from localStorage and fetch all colleges for select dropdown
  const loadCompareData = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('compareList') || '[]');
      setCompareList(stored);

      // Fetch all colleges list to allow additions directly from this page
      const colleges = await api.get('/colleges');
      setAllColleges(colleges);
    } catch (err) {
      console.error('Failed to load colleges for comparison:', err);
    }
  };

  useEffect(() => {
    loadCompareData();
  }, []);

  // Add a college to comparison list
  const handleAddCollege = () => {
    if (!selectedCollegeId) return;
    
    // Find college in all list
    const col = allColleges.find(item => item.id === parseInt(selectedCollegeId));
    if (!col) return;

    if (compareList.some(item => item.id === col.id)) {
      alert('This college is already added to the comparison.');
      return;
    }

    if (compareList.length >= 3) {
      alert('You can compare a maximum of 3 colleges.');
      return;
    }

    const updated = [...compareList, col];
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
    setSelectedCollegeId('');
  };

  // Remove a college from comparison list
  const handleRemoveCollege = (id) => {
    const updated = compareList.filter(item => item.id !== id);
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
  };

  // Filter out already added colleges from the selection list
  const availableOptions = allColleges.filter(
    col => !compareList.some(item => item.id === col.id)
  );

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight d-flex justify-content-center align-items-center gap-2">
          <GitCompare className="text-sky-500 h-8 w-8 animate-spin-slow" />
          <span>Compare College Campuses</span>
        </h1>
        <p className="text-slate-500 mt-2">Compare fees, average placement records, ratings, and course selections side-by-side.</p>
      </div>

      {/* Select Add Box */}
      <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white mb-8 max-w-md mx-auto">
        <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-2 block">
          Add College to Comparison ({compareList.length}/3)
        </label>
        <div className="d-flex gap-2">
          <select
            className="form-select rounded-xl py-2 border-slate-200 text-sm"
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            disabled={compareList.length >= 3}
          >
            <option value="">-- Choose College --</option>
            {availableOptions.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
          <button
            onClick={handleAddCollege}
            disabled={!selectedCollegeId || compareList.length >= 3}
            className="btn btn-primary rounded-xl px-3 d-flex align-items-center justify-content-center text-white bg-sky-600 hover:bg-sky-500 border-0 shadow-sm"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {compareList.length === 0 ? (
        <div className="text-center py-20 card border-0 shadow-sm rounded-3xl bg-white max-w-xl mx-auto">
          <div className="bg-sky-50 p-4 rounded-full w-fit mx-auto mb-4 text-sky-500">
            <GitCompare className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Your comparison is empty</h2>
          <p className="text-slate-400 mt-1 max-w-sm mx-auto text-sm">
            Add colleges using the selector dropdown above or browse the listings and click the compare icon.
          </p>
          <Link to="/colleges" className="btn btn-primary mt-4 bg-sky-600 border-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow d-inline-flex align-items-center gap-1.5 hover:bg-sky-500">
            <ArrowLeft className="h-4 w-4" /> Browse Colleges List
          </Link>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-bordered mb-0 align-middle text-center" style={{ minWidth: '600px' }}>
              <thead>
                <tr className="bg-slate-50 border-bottom border-slate-100">
                  <th className="text-slate-500 text-xs uppercase font-extrabold tracking-wider py-4" style={{ width: '25%' }}>Features</th>
                  {compareList.map(college => (
                    <th key={college.id} className="py-4 px-3" style={{ width: `${75 / compareList.length}%` }}>
                      <div className="d-flex flex-column align-items-center gap-2">
                        {college.logo_url && (
                          <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-100 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            <img src={college.logo_url} alt="" className="img-fluid object-contain max-h-full" />
                          </div>
                        )}
                        <h4 className="font-extrabold text-slate-900 text-sm mb-1 line-clamp-2 max-w-xs">{college.name}</h4>
                        <button
                          onClick={() => handleRemoveCollege(college.id)}
                          className="btn btn-outline-danger btn-sm rounded-lg d-flex align-items-center gap-1 px-2.5 py-1 text-xs mt-1 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Location */}
                <tr>
                  <td className="font-bold text-xs uppercase tracking-wider text-slate-500 text-start ps-4">Location</td>
                  {compareList.map(college => (
                    <td key={college.id} className="text-sm text-slate-700">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {college.location}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="font-bold text-xs uppercase tracking-wider text-slate-500 text-start ps-4">Overall Rating</td>
                  {compareList.map(college => (
                    <td key={college.id}>
                      <div className="d-flex align-items-center justify-content-center gap-1 font-bold text-amber-500 text-sm">
                        <Star className="h-4 w-4 fill-amber-500" />
                        {college.rating} / 5.0
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Tuition Fees */}
                <tr>
                  <td className="font-bold text-xs uppercase tracking-wider text-slate-500 text-start ps-4">Annual Tuition Fees</td>
                  {compareList.map(college => (
                    <td key={college.id} className="font-bold text-slate-800 text-sm">
                      <div className="d-flex align-items-center justify-content-center">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {(college.fees / 100000).toFixed(2)} Lakh/yr
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Placement Ratio */}
                <tr>
                  <td className="font-bold text-xs uppercase tracking-wider text-slate-500 text-start ps-4">Placement Success %</td>
                  {compareList.map(college => (
                    <td key={college.id} className="text-sm font-semibold text-slate-700">
                      {college.placements_pct}% placed
                    </td>
                  ))}
                </tr>

                {/* Median Package */}
                <tr>
                  <td className="font-bold text-xs uppercase tracking-wider text-slate-500 text-start ps-4">Median Package</td>
                  {compareList.map(college => (
                    <td key={college.id} className="font-black text-slate-800 text-sm">
                      {college.package_median} LPA
                    </td>
                  ))}
                </tr>

                {/* Highest Package */}
                <tr>
                  <td className="font-bold text-xs uppercase tracking-wider text-slate-500 text-start ps-4">Highest Package</td>
                  {compareList.map(college => (
                    <td key={college.id} className="font-black text-emerald-600 text-sm">
                      {college.package_highest} LPA
                    </td>
                  ))}
                </tr>

                {/* Courses Offered */}
                <tr>
                  <td className="font-bold text-xs uppercase tracking-wider text-slate-500 text-start ps-4">Courses Offered</td>
                  {compareList.map(college => (
                    <td key={college.id} className="px-3 py-3">
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        {college.courses?.map((c, idx) => (
                          <span key={idx} className="badge bg-slate-100 text-slate-600 border border-slate-200 text-[10px] px-2 py-0.5 rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Action Link */}
                <tr className="bg-slate-50/50">
                  <td className="font-bold text-xs uppercase tracking-wider text-slate-500 text-start ps-4">Link Details</td>
                  {compareList.map(college => (
                    <td key={college.id} className="py-3">
                      <Link
                        to={`/colleges/${college.id}`}
                        className="btn btn-primary btn-sm rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 border-0 hover:bg-sky-500 shadow-sm"
                      >
                        Visit Campus Profile
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
