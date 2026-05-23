import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collegeService } from '../services/collegeService';
import { compareService } from '../services/compareService';
import CollegeAvatar from '../components/CollegeAvatar';
import CompareOverlay from '../components/CompareOverlay';
import {
  GitCompare, X, Plus, Search, Star, MapPin,
  Trash2, ArrowRight, GraduationCap,
} from 'lucide-react';

const MAX_SLOTS = 3;

export default function Compare() {
  const [allColleges, setAllColleges] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const syncList = () => {
    const list = compareService.getList();
    setCompareList(list);
    return list;
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    collegeService.list('')
      .then(setAllColleges)
      .catch(console.error)
      .finally(() => setLoading(false));
    syncList();
    const handler = () => syncList();
    window.addEventListener('compareListUpdated', handler);
    return () => window.removeEventListener('compareListUpdated', handler);
  }, []);

  const handleAdd = (college) => {
    if (compareList.some((c) => c.id === college.id)) return;
    if (compareList.length >= MAX_SLOTS) {
      showToast('Maximum 3 colleges. Remove one to add another.', 'warning');
      return;
    }
    const updated = [...compareList, college];
    compareService.saveList(updated);
    setCompareList(updated);
    window.dispatchEvent(new Event('compareListUpdated'));
    showToast(`${college.name.split(',')[0]} added`, 'success');
    if (updated.length === MAX_SLOTS) {
      setTimeout(() => setShowOverlay(true), 400);
    }
  };

  const handleRemove = (collegeId) => {
    const updated = compareService.remove(collegeId);
    setCompareList(updated);
    window.dispatchEvent(new Event('compareListUpdated'));
    if (updated.length < 2) setShowOverlay(false);
  };

  const handleClearAll = () => {
    compareService.clear();
    setCompareList([]);
    window.dispatchEvent(new Event('compareListUpdated'));
    showToast('Comparison cleared', 'info');
    setShowOverlay(false);
  };

  useEffect(() => {
    if (!showOverlay) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setShowOverlay(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [showOverlay]);

  const availableColleges = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allColleges.filter((col) => {
      if (compareList.some((c) => c.id === col.id)) return false;
      if (!q) return true;
      return (
        col.name.toLowerCase().includes(q)
        || col.location?.toLowerCase().includes(q)
        || col.stream?.toLowerCase().includes(q)
      );
    });
  }, [allColleges, compareList, search]);

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => compareList[i] || null);

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4 compare-page">
      {/* Toast */}
      {toast && (
        <div className={`compare-toast compare-toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight d-flex justify-content-center align-items-center gap-2">
          <GitCompare className="text-sky-500 h-8 w-8" />
          <span>Compare Colleges</span>
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
          Pick up to 3 colleges side by side. Add or remove anytime below.
        </p>
      </div>

      {/* Comparison tray — 3 slots */}
      <div className="card border-0 shadow-sm rounded-3xl p-4 p-md-5 bg-white mb-6">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-slate-900 mb-0">
            Your comparison <span className="text-sky-600">({compareList.length}/{MAX_SLOTS})</span>
          </h2>
          {compareList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="btn btn-outline-danger btn-sm rounded-xl d-flex align-items-center gap-1 text-xs font-bold"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </button>
          )}
        </div>

        <div className="row g-3">
          {slots.map((college, idx) => (
            <div key={idx} className="col-12 col-md-4">
              {college ? (
                <div className="compare-slot compare-slot-filled h-100 position-relative">
                  <button
                    type="button"
                    onClick={() => handleRemove(college.id)}
                    className="compare-slot-remove"
                    aria-label="Remove from compare"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="d-flex flex-column align-items-center text-center p-4 pt-5">
                    <CollegeAvatar college={college} size={64} className="mb-3" />
                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 mb-1">
                      {college.name.split(',')[0]}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2 d-flex align-items-center gap-1">
                      <MapPin className="h-3 w-3" /> {college.location?.split(',')[0]}
                    </p>
                    <div className="d-flex gap-2 text-xs mb-3">
                      <span className="badge bg-amber-100 text-amber-800">
                        <Star className="h-3 w-3 fill-amber-500 d-inline" /> {college.rating}
                      </span>
                      <span className="badge bg-slate-100 text-slate-700">
                        ₹{(college.fees / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <Link
                      to={`/colleges/${college.id}`}
                      className="btn btn-outline-primary btn-sm rounded-xl text-xs font-bold w-100"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById('add-colleges-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="compare-slot compare-slot-empty h-100 w-100 border-0 bg-transparent"
                >
                  <div className="d-flex flex-column align-items-center justify-content-center p-4 text-slate-400">
                    <div className="compare-slot-add-icon mb-2">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-500">Add college</span>
                    <span className="text-xs mt-1">Slot {idx + 1}</span>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>

        {compareList.length >= 2 && (
          <div className="text-center mt-4 pt-3 border-top border-slate-100">
            <button
              type="button"
              onClick={() => setShowOverlay(true)}
              className={`compare-now-btn ${compareList.length === MAX_SLOTS ? 'compare-now-pulse' : ''}`}
            >
              <GitCompare size={22} strokeWidth={2.5} />
              <span className="compare-now-btn-label">
                Compare
                {compareList.length === MAX_SLOTS ? ' · 3 Colleges' : ` (${compareList.length})`}
              </span>
            </button>
            <p className="compare-now-hint">
              {compareList.length === MAX_SLOTS
                ? 'Opens side-by-side comparison overlay'
                : 'Select 3 colleges for full comparison'}
            </p>
          </div>
        )}
      </div>

      {showOverlay && compareList.length >= 2 && (
        <CompareOverlay
          colleges={compareList}
          onClose={() => setShowOverlay(false)}
          onRemove={handleRemove}
        />
      )}

      {/* Add colleges */}
      <div id="add-colleges-section" className="card border-0 shadow-sm rounded-3xl p-4 p-md-5 bg-white mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1 d-flex align-items-center gap-2">
          <Plus className="text-sky-500 h-5 w-5" />
          Add colleges to compare
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          {compareList.length >= MAX_SLOTS
            ? 'You have 3 colleges selected. Remove one above to add another.'
            : 'Search and click Add — or browse from Explore Colleges.'}
        </p>

        <div className="position-relative mb-4">
          <input
            type="text"
            className="form-control ps-5 rounded-xl py-2.5 border-slate-200"
            placeholder="Search by name, location, or stream..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={compareList.length >= MAX_SLOTS}
          />
          <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-slate-400 h-4 w-4" />
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-500 text-sm">Loading colleges...</div>
        ) : availableColleges.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            {search ? 'No colleges match your search.' : 'All colleges are already in your comparison.'}
            <Link to="/colleges" className="d-block mt-2 text-sky-600 font-semibold">Browse more colleges</Link>
          </div>
        ) : (
          <div className="compare-add-grid">
            {availableColleges.slice(0, 12).map((col) => (
              <div key={col.id} className="compare-add-card">
                <CollegeAvatar college={col} size={44} />
                <div className="flex-grow-1 min-w-0 ms-3">
                  <p className="text-sm font-bold text-slate-900 mb-0 text-truncate">{col.name.split(',')[0]}</p>
                  <p className="text-xs text-slate-500 mb-0 text-truncate">{col.location}</p>
                  {col.stream && (
                    <span className="badge bg-sky-50 text-sky-700 text-[10px] mt-1">{col.stream}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(col)}
                  disabled={compareList.length >= MAX_SLOTS}
                  className="btn btn-primary btn-sm rounded-xl flex-shrink-0 d-flex align-items-center gap-1 bg-sky-600 border-0 text-xs font-bold px-3"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            ))}
          </div>
        )}

        {availableColleges.length > 12 && (
          <p className="text-center text-xs text-slate-400 mt-3 mb-0">
            Showing 12 results — refine search to find more.
          </p>
        )}

        <div className="text-center mt-4">
          <Link to="/colleges" className="btn btn-outline-secondary rounded-xl text-sm font-semibold d-inline-flex align-items-center gap-1">
            <GraduationCap className="h-4 w-4" /> Explore all colleges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {compareList.length === 1 && (
        <div className="alert alert-info rounded-2xl border-0 bg-sky-50 text-sky-800 text-center py-4 mb-6">
          Add <strong>one more college</strong> to unlock the comparison overlay.
        </div>
      )}
    </div>
  );
}
