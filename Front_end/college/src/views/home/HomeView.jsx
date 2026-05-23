import { Link } from 'react-router-dom';
import { Search, Award, GitCompare, Landmark, ChevronRight } from 'lucide-react';

export default function HomeView({ stats }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="gradient-bg text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="container max-w-4xl mx-auto position-relative">
          <span className="badge bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase mb-4 d-inline-block">
            Step Into Your Future
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
            Find Your Dream College <br />
            <span className="gradient-text">Make Confident Decisions.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-light">
            Search, compare, and predict admissions. All data loaded live from our database.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/colleges" className="btn btn-primary px-4 py-3 rounded-xl glow-btn d-flex align-items-center gap-2 bg-sky-600 border-0 font-semibold">
              <Search className="h-5 w-5" /> Explore Colleges
            </Link>
            <Link to="/predictor" className="btn btn-outline-light px-4 py-3 rounded-xl d-flex align-items-center gap-2 font-semibold">
              <Award className="h-5 w-5 text-sky-400" /> Predict Eligible Colleges
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Decision-Making Tools Built for You</h2>
          <p className="text-slate-600 mt-2 text-lg">Discover, evaluate, and choose the right campus.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm glass-card p-4">
              <Landmark className="h-6 w-6 text-sky-600 mb-3" />
              <h3 className="text-xl font-bold mb-2">College Listing + Search</h3>
              <p className="text-slate-600 text-sm mb-4">Filter by fees, courses, and location from the database.</p>
              <Link to="/colleges" className="text-sky-600 font-semibold text-sm">Start Exploring <ChevronRight className="h-4 w-4 d-inline" /></Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm glass-card p-4">
              <GitCompare className="h-6 w-6 text-indigo-600 mb-3" />
              <h3 className="text-xl font-bold mb-2">Side-by-Side Compare</h3>
              <p className="text-slate-600 text-sm mb-4">Compare up to 3 colleges.</p>
              <Link to="/compare" className="text-indigo-600 font-semibold text-sm">Compare Now <ChevronRight className="h-4 w-4 d-inline" /></Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm glass-card p-4">
              <Award className="h-6 w-6 text-emerald-600 mb-3" />
              <h3 className="text-xl font-bold mb-2">Admission Predictor</h3>
              <p className="text-slate-600 text-sm mb-4">Live cutoff-based eligibility.</p>
              <Link to="/predictor" className="text-emerald-600 font-semibold text-sm">Predict My Odds <ChevronRight className="h-4 w-4 d-inline" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="container max-w-5xl mx-auto row text-center g-4">
          <div className="col-sm-4">
            <div className="h3 font-black text-sky-400">{stats.college_count || '—'}</div>
            <div className="text-slate-400 text-sm uppercase">Colleges in Database</div>
          </div>
          <div className="col-sm-4">
            <div className="h3 font-black text-sky-400">{stats.cutoff_count || '—'}</div>
            <div className="text-slate-400 text-sm uppercase">Cutoff Records</div>
          </div>
          <div className="col-sm-4">
            <div className="h3 font-black text-sky-400">{stats.avg_placement_pct ? `${stats.avg_placement_pct}%` : '—'}</div>
            <div className="text-slate-400 text-sm uppercase">Avg Placement Rate</div>
          </div>
        </div>
      </section>
    </div>
  );
}
