/** View layer — college listing UI */
import { useNavigate } from 'react-router-dom';
import CompareIconButton from '../../components/CompareIconButton';
import CollegeAvatar from '../../components/CollegeAvatar';
import {
  Search, MapPin, IndianRupee, Star, Bookmark, BookmarkCheck,
  GitCompare, Sparkles, FilterX,
} from 'lucide-react';

export default function CollegeListView({
  colleges, loading, error, search, setSearch, location, setLocation,
  course, setCourse, maxFees, setMaxFees, minRating, setMinRating,
  streamFilter, setStreamFilter, institutionType, setInstitutionType,
  sortBy, setSortBy, savedIds, compareList,
  locationsList, coursesList, streamsList, institutionTypesList,
  handleToggleSave, handleCompareToggle,
  handleClearCompare, handleGoCompare, handleClearFilters,
  user, showAllStreams, setShowAllStreams,
}) {
  const navigate = useNavigate();

  const stopCardNav = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight d-flex justify-content-center align-items-center gap-2">
          <Sparkles className="text-sky-500 h-8 w-8 animate-bounce" />
          <span>Discover Top Colleges</span>
        </h1>
        <p className="text-slate-500 mt-2">Filter and search through our curated list of institutions.</p>
      </div>

      {user?.field_of_interest && !showAllStreams && (
        <div className="alert bg-sky-50 border border-sky-200 text-sky-900 rounded-2xl p-4 mb-6 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
          <div>
            <strong className="d-block mb-1">Recommended for your profile</strong>
            <span className="text-sm">
              Showing <strong>{user.field_of_interest}</strong> stream
              {user.expecting_type ? <> · <strong>{user.expecting_type}</strong> institutions</> : null}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAllStreams(true)}
            className="btn btn-outline-primary btn-sm rounded-xl px-3 py-2 text-xs font-bold border-sky-400 text-sky-700 flex-shrink-0"
          >
            Show all institutions
          </button>
        </div>
      )}

      {user?.field_of_interest && showAllStreams && (
        <div className="alert bg-slate-100 border-0 rounded-2xl p-3 mb-6 d-flex justify-content-between align-items-center gap-2">
          <span className="text-sm text-slate-600">Showing all streams and institution types.</span>
          <button
            type="button"
            onClick={() => setShowAllStreams(false)}
            className="btn btn-sm btn-primary bg-sky-600 border-0 rounded-xl text-xs font-bold"
          >
            Back to my recommendations
          </button>
        </div>
      )}

      {compareList.length > 0 && (
        <div className="alert bg-slate-900 text-white rounded-2xl p-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-6 shadow border border-slate-700">
          <div className="d-flex align-items-center gap-2 min-w-0">
            <GitCompare className="text-sky-400 h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-semibold text-truncate">
              Comparison: {compareList.length}/3 — {compareList.map((c) => c.name.split(',')[0]).join(', ')}
            </span>
          </div>
          <div className="d-flex gap-2 flex-shrink-0">
            <button
              onClick={handleGoCompare}
              className="btn btn-sm text-white bg-sky-600 hover:bg-sky-500 font-bold px-4 py-1.5 rounded-lg text-xs d-flex align-items-center gap-1 border-0 shadow-sm"
            >
              <GitCompare className="h-3.5 w-3.5" /> Compare
            </button>
            <button onClick={handleClearCompare} className="btn btn-outline-danger btn-sm px-2 py-1 rounded-lg text-xs">Clear</button>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white mb-8">
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label text-xs uppercase font-extrabold text-slate-500">Search College</label>
            <div className="position-relative">
              <input type="text" placeholder="Search by college name..." className="form-control ps-5 rounded-xl py-2 border-slate-200 text-sm"
                value={search} onChange={(e) => setSearch(e.target.value)} />
              <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-slate-400 h-4 w-4" />
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label text-xs uppercase font-extrabold text-slate-500">Location</label>
            <select className="form-select rounded-xl py-2 border-slate-200 text-sm" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">All Locations</option>
              {locationsList.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label text-xs uppercase font-extrabold text-slate-500">Course</label>
            <select className="form-select rounded-xl py-2 border-slate-200 text-sm" value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">All Courses</option>
              {coursesList.map((crs) => <option key={crs} value={crs}>{crs}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label text-xs uppercase font-extrabold text-slate-500">Stream</label>
            <select className="form-select rounded-xl py-2 border-slate-200 text-sm" value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)}>
              <option value="">All Streams</option>
              {streamsList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label text-xs uppercase font-extrabold text-slate-500">Type</label>
            <select className="form-select rounded-xl py-2 border-slate-200 text-sm" value={institutionType} onChange={(e) => setInstitutionType(e.target.value)}>
              <option value="">All Types</option>
              {institutionTypesList.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label text-xs uppercase font-extrabold text-slate-500">Min Rating</label>
            <select className="form-select rounded-xl py-2 border-slate-200 text-sm" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="">Any</option>
              <option value="4.5">4.5+</option>
              <option value="4.0">4.0+</option>
              <option value="3.5">3.5+</option>
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label text-xs uppercase font-extrabold text-slate-500">Sort By</label>
            <select className="form-select rounded-xl py-2 border-slate-200 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rating">Highest Rating</option>
              <option value="fees-asc">Fees: Low to High</option>
              <option value="fees-desc">Fees: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label text-xs uppercase font-extrabold text-slate-500">
              Max Fees: {maxFees ? `₹${(parseInt(maxFees) / 100000).toFixed(1)} Lakh/yr` : 'Any'}
            </label>
            <input type="range" min="100000" max="600000" step="50000" className="form-range mt-2 text-sky-600"
              value={maxFees || '600000'} onChange={(e) => setMaxFees(e.target.value === '600000' ? '' : e.target.value)} />
          </div>
          <div className="col-12 col-md-6 col-lg-2 d-flex align-items-end">
            <button onClick={handleClearFilters} className="btn btn-outline-secondary w-100 rounded-xl py-2 d-flex align-items-center justify-content-center gap-1" title="Reset Filters">
              <FilterX className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-20">
          <div className="loading-spinner mb-3" />
          <span className="text-slate-500 text-sm font-semibold">Loading campuses...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center rounded-2xl py-4">{error}</div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20 card border-0 shadow-sm rounded-2xl bg-white">
          <p className="text-slate-400 text-lg">
            {user?.field_of_interest && !showAllStreams
              ? `No ${user.field_of_interest} ${user.expecting_type || ''} institutions match your filters.`
              : 'No colleges match your search parameters.'}
          </p>
          <button onClick={handleClearFilters} className="btn btn-primary mt-3 bg-sky-600 border-0 rounded-xl px-4 py-2 text-sm font-semibold">Clear All Filters</button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {colleges.map((college) => {
            const isSaved = savedIds.includes(college.id);
            return (
              <div key={college.id} className="col">
                <div
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/colleges/${college.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/colleges/${college.id}`)}
                  className="card h-100 border-0 shadow-sm rounded-2xl overflow-hidden college-card-link bg-white d-flex flex-column position-relative"
                >
                  <div className="gradient-primary-glow p-4 d-flex justify-content-between align-items-start text-white">
                    <CollegeAvatar college={college} size={56} />
                    <div className="d-flex gap-2 flex-shrink-0 college-card-actions">
                      <div onClick={stopCardNav} onKeyDown={stopCardNav}>
                        <CompareIconButton college={college} onToggle={handleCompareToggle} />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { stopCardNav(e); handleToggleSave(college.id); }}
                        className={`btn btn-sm rounded-full p-2 border-0 ${isSaved ? 'bg-red-500 text-white' : 'bg-black/30 text-white'}`}
                      >
                        {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-4 d-flex flex-column flex-grow-1">
                    <h5 className="card-title font-extrabold text-base text-slate-900 mb-1 line-clamp-2" style={{ minHeight: '2.5rem' }}>
                      {college.name}
                    </h5>
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {college.stream && (
                        <span className="badge badge-stream text-[10px] px-2 py-1 rounded">{college.stream}</span>
                      )}
                      {college.institution_type && (
                        <span className="badge badge-type text-[10px] px-2 py-1 rounded">{college.institution_type}</span>
                      )}
                    </div>
                    <div className="text-slate-500 text-xs d-flex align-items-center gap-1 mb-3">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-truncate">{college.location}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-extrabold">Annual Fees</div>
                        <div className="text-sm font-extrabold text-slate-800 d-flex align-items-center">
                          <IndianRupee className="h-3.5 w-3.5" />{(college.fees / 100000).toFixed(2)} Lakh
                        </div>
                      </div>
                      <div className="border-start border-slate-200 ps-3">
                        <div className="text-[10px] text-slate-400 uppercase font-extrabold">Rating</div>
                        <div className="text-sm font-extrabold text-amber-500 d-flex align-items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />{college.rating}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 flex-grow-1">
                      <div className="d-flex flex-wrap gap-1">
                        {(college.courses || []).slice(0, 3).map((c, idx) => (
                          <span key={idx} className="badge badge-course text-[10px] px-2 py-1 rounded">{c}</span>
                        ))}
                      </div>
                    </div>
                    <span className="btn btn-outline-primary w-100 mt-auto rounded-xl py-2 text-xs font-bold border-sky-600 text-sky-600 pointer-events-none">
                      View Details & Reviews →
                    </span>
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
