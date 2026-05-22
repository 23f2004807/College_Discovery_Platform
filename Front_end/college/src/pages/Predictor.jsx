import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Award, Search, Sparkles, MapPin, IndianRupee, Star, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Predictor() {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!rank || parseInt(rank) <= 0) {
      setError('Please enter a valid rank.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await api.get(`/predict?exam=${encodeURIComponent(exam)}&rank=${rank}`);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight d-flex justify-content-center align-items-center gap-2">
          <Award className="text-sky-500 h-8 w-8 animate-pulse" />
          <span>Admission Predictor Tool</span>
        </h1>
        <p className="text-slate-500 mt-2">Enter your exam rank to find colleges you qualify for based on historical cutoffs.</p>
      </div>

      <div className="row g-4">
        {/* Input Form Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white sticky-top top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4 d-flex align-items-center gap-2">
              <Sparkles className="text-amber-500 h-5 w-5" /> Calculate Eligibility
            </h3>

            <form onSubmit={handlePredict}>
              {/* Exam Selection */}
              <div className="mb-3">
                <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Select Entrance Exam</label>
                <div className="d-flex flex-column gap-2 mt-1">
                  {['JEE Main', 'JEE Advanced', 'BITSAT'].map((type) => (
                    <label 
                      key={type} 
                      className={`border p-3 rounded-xl d-flex align-items-center gap-2 cursor-pointer transition-all ${exam === type ? 'border-sky-500 bg-sky-50/50 font-bold text-sky-700' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <input 
                        type="radio" 
                        name="examType" 
                        value={type} 
                        checked={exam === type} 
                        onChange={() => setExam(type)}
                        className="form-check-input mt-0 accent-sky-500" 
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rank Input */}
              <div className="mb-4">
                <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">
                  {exam === 'BITSAT' ? 'Your BITSAT Score (e.g. 280)' : 'Your All India Rank (AIR)'}
                </label>
                <input
                  type="number"
                  placeholder={exam === 'BITSAT' ? 'e.g. 290' : 'e.g. 5000'}
                  className="form-control rounded-xl py-2.5 border-slate-200 mt-1 text-sm font-semibold"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  min="1"
                  required
                />
              </div>

              {error && (
                <div className="alert alert-danger rounded-xl text-xs py-2 mb-3">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 rounded-xl py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 border-0 d-flex align-items-center justify-content-center gap-1.5 text-white glow-btn"
              >
                <Search className="h-4 w-4" />
                {loading ? 'Analyzing data...' : 'Predict Colleges'}
              </button>
            </form>
          </div>
        </div>

        {/* Prediction Results List */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white min-h-[450px]">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Accessible Branches & Campuses
            </h3>

            {loading ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-20">
                <div className="loading-spinner mb-3"></div>
                <span className="text-slate-500 text-sm font-semibold">Running rule-based engine...</span>
              </div>
            ) : !hasSearched ? (
              <div className="text-center py-20 text-slate-400">
                <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm">Submit your rank on the left to see eligible options.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">No matching colleges found</p>
                <p className="text-xs max-w-xs mx-auto mt-1">Your rank might be higher than historical closing cutoffs for the seeded datasets.</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-500 text-xs mb-4">
                  Based on historical data for <strong>{exam}</strong>, you qualify for <strong>{results.length}</strong> college branches:
                </p>

                <div className="d-flex flex-column gap-3">
                  {results.map((result, idx) => (
                    <div 
                      key={idx} 
                      className="border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-4 transition-all d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                          {result.logo_url ? (
                            <img src={result.logo_url} alt="" className="img-fluid object-contain max-h-full" />
                          ) : (
                            <span className="text-slate-700 font-bold text-sm">{result.college_name.substring(0, 2)}</span>
                          )}
                        </div>
                        <div>
                          <div className="badge bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded mb-1 font-bold">
                            {result.branch}
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm mb-0.5">{result.college_name}</h4>
                          <span className="text-slate-400 text-xs d-flex align-items-center gap-0.5">
                            <MapPin className="h-3 w-3" /> {result.location}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex flex-row flex-md-column align-items-end justify-content-between border-t border-slate-150 border-md-t-0 pt-2 pt-md-0">
                        <div className="text-end">
                          <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Closing Cutoff</span>
                          <span className="text-sm font-black text-slate-800">
                            {result.cutoff_rank.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-end mt-md-2">
                          <Link 
                            to={`/colleges/${result.college_id}`}
                            className="btn btn-outline-primary btn-sm rounded-lg text-xs font-bold py-1 px-2.5"
                          >
                            Explore Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
