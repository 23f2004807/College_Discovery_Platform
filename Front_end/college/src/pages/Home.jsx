import { Link } from 'react-router-dom';
import { Search, Award, GitCompare, Landmark, ShieldCheck, ChevronRight, BarChart2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <header className="gradient-bg text-white py-20 px-6 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

        <div className="container max-w-4xl mx-auto position-relative">
          <span className="badge bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 d-inline-block">
            Step Into Your Future
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
            Find Your Dream College <br />
            <span className="gradient-text">Make Confident Decisions.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-light">
            Search, compare, and predict admissions for India's top colleges. Leverage verified placement statistics and exam cutoff ranks.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/colleges" className="btn btn-primary px-4 py-3 rounded-xl glow-btn d-flex align-items-center gap-2 bg-sky-600 hover:bg-sky-500 border-0 font-semibold shadow-lg">
              <Search className="h-5 w-5" />
              Explore Colleges
            </Link>
            <Link to="/predictor" className="btn btn-outline-light px-4 py-3 rounded-xl d-flex align-items-center gap-2 font-semibold hover:bg-white/10 transition">
              <Award className="h-5 w-5 text-sky-400" />
              Predict Eligible Colleges
            </Link>
          </div>
        </div>
      </header>

      {/* Feature cards section */}
      <section className="py-20 px-6 container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Decision-Making Tools Built for You
          </h2>
          <p className="text-slate-600 mt-2 text-lg">Everything you need to discover, evaluate, and choose the right campus.</p>
        </div>

        <div className="row g-4">
          {/* Card 1: Explore */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm glass-card p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="p-3 bg-sky-500/10 text-sky-600 rounded-2xl w-fit mb-4">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">College Listing + Search</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Filter through detailed listings by fees, course programs, and locations. Fast searches ensure zero delay.
              </p>
              <Link to="/colleges" className="text-sky-600 font-semibold text-sm d-flex align-items-center gap-1 mt-auto hover:text-sky-700">
                Start Exploring <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Compare */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm glass-card p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl w-fit mb-4">
                <GitCompare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Side-by-Side Compare</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Add 2-3 colleges and view a clear comparative grid of annual fees, ratings, and placement percentages.
              </p>
              <Link to="/compare" className="text-indigo-600 font-semibold text-sm d-flex align-items-center gap-1 mt-auto hover:text-indigo-700">
                Compare Now <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Predictor */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm glass-card p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl w-fit mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Admission Predictor</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Enter your rank (JEE Main/BITSAT/JEE Advanced) to predict which college campuses and streams you fit in.
              </p>
              <Link to="/predictor" className="text-emerald-600 font-semibold text-sm d-flex align-items-center gap-1 mt-auto hover:text-emerald-700">
                Predict My Odds <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="row text-center g-4">
            <div className="col-sm-4">
              <div className="h3 font-black text-sky-400 mb-1">10+</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Premium Colleges Seeding</div>
            </div>
            <div className="col-sm-4">
              <div className="h3 font-black text-sky-400 mb-1">40+</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Course Cutoff Datasets</div>
            </div>
            <div className="col-sm-4">
              <div className="h3 font-black text-sky-400 mb-1">98%</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Placement Success Ratio</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
