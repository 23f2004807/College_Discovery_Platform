import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { predictService } from '../services/predictService';
import { EXAM_OPTIONS } from '../models/constants';
import {
  Award, Search, Sparkles, MapPin, ShieldCheck, HelpCircle, Filter,
} from 'lucide-react';

const FALLBACK_EXAMS = EXAM_OPTIONS.map((name) => ({
  name,
  default_input_mode: ['BITSAT', 'CBSE Class X', 'ICSE Class X'].some((k) => name.includes(k)) ? 'score' : 'rank',
  rank_label: 'All India Rank (AIR)',
  score_label: name.includes('CBSE') || name.includes('ICSE') ? 'Cutoff score / percentage' : 'Cutoff score / marks',
  rank_placeholder: 'e.g. 5000',
  score_placeholder: name.includes('CBSE') || name.includes('ICSE') ? 'e.g. 92' : 'e.g. 290',
}));

export default function Predictor() {
  const { user } = useAuth();
  const [exams, setExams] = useState(FALLBACK_EXAMS);
  const [exam, setExam] = useState(FALLBACK_EXAMS[0]?.name || 'JEE Main');
  const [inputMode, setInputMode] = useState('rank');
  const [rank, setRank] = useState('');
  const [matchProfile, setMatchProfile] = useState(true);
  const [activeInputMode, setActiveInputMode] = useState('rank');
  const [results, setResults] = useState([]);
  const [filteredBy, setFilteredBy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const selectedExam = exams.find((e) => e.name === exam) || exams[0];
  const isScoreMode = inputMode === 'score';

  useEffect(() => {
    predictService.getExams()
      .then((data) => {
        if (data.exams?.length) {
          setExams(data.exams);
          setExam(data.exams[0].name);
          setInputMode(data.exams[0].default_input_mode || 'rank');
        }
      })
      .catch(() => {});
  }, []);

  const handleExamChange = (examName) => {
    const picked = exams.find((e) => e.name === examName);
    setExam(examName);
    setInputMode(picked?.default_input_mode || 'rank');
    setRank('');
    setHasSearched(false);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    const value = parseInt(rank, 10);
    if (!rank || Number.isNaN(value) || value <= 0) {
      setError(`Please enter a valid ${isScoreMode ? 'cutoff score' : 'rank'}.`);
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setFilteredBy(null);

    try {
      const data = await predictService.predict(exam, value, matchProfile, inputMode);
      setResults(data.results || []);
      setFilteredBy(data.filtered_by || null);
      setActiveInputMode(data.input_mode || inputMode);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight d-flex justify-content-center align-items-center gap-2">
          <Award className="text-sky-500 h-8 w-8 animate-pulse" />
          <span>Admission Predictor</span>
        </h1>
        <p className="text-slate-500 mt-2">
          Choose your exam, enter your AIR rank or cutoff score, and see which colleges you qualify for.
        </p>
      </div>

      <div className="row g-4 align-items-start predictor-page-row">
        <div className="col-12 col-lg-4 predictor-form-col">
          <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white predictor-form-card">
            <h3 className="text-lg font-bold text-slate-900 mb-4 d-flex align-items-center gap-2">
              <Sparkles className="text-amber-500 h-5 w-5" /> Check eligibility
            </h3>

            <form onSubmit={handlePredict}>
              <div className="mb-3">
                <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">
                  Entrance exam
                </label>
                <select
                  className="form-select rounded-xl py-2.5 border-slate-200 text-sm font-semibold mt-1"
                  value={exam}
                  onChange={(e) => handleExamChange(e.target.value)}
                >
                  {exams.map((opt) => (
                    <option key={opt.name} value={opt.name}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">
                  How are you entering your result?
                </label>
                <div className="d-flex gap-2 mt-1">
                  <label
                    className={`flex-fill border p-2.5 rounded-xl text-center cursor-pointer text-xs font-bold ${
                      inputMode === 'rank'
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="inputMode"
                      value="rank"
                      checked={inputMode === 'rank'}
                      onChange={() => { setInputMode('rank'); setRank(''); setHasSearched(false); }}
                      className="d-none"
                    />
                    AIR (Rank)
                  </label>
                  <label
                    className={`flex-fill border p-2.5 rounded-xl text-center cursor-pointer text-xs font-bold ${
                      inputMode === 'score'
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="inputMode"
                      value="score"
                      checked={inputMode === 'score'}
                      onChange={() => { setInputMode('score'); setRank(''); setHasSearched(false); }}
                      className="d-none"
                    />
                    Cutoff / Score
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">
                  {isScoreMode
                    ? (selectedExam?.score_label || 'Cutoff score / marks')
                    : (selectedExam?.rank_label || 'All India Rank (AIR)')}
                </label>
                <input
                  type="number"
                  placeholder={
                    isScoreMode
                      ? (selectedExam?.score_placeholder || 'e.g. 290')
                      : (selectedExam?.rank_placeholder || 'e.g. 5000')
                  }
                  className="form-control rounded-xl py-2.5 border-slate-200 mt-1 text-sm font-semibold"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  min="1"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1 mb-0">
                  {isScoreMode
                    ? 'Enter your exam score or percentage. Higher = better chance.'
                    : 'Enter your All India Rank. Lower number = better (rank 500 beats 5000).'}
                </p>
              </div>

              {user?.field_of_interest && (
                <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-100">
                  <label className="d-flex align-items-start gap-2 cursor-pointer mb-0">
                    <input
                      type="checkbox"
                      className="form-check-input mt-1"
                      checked={matchProfile}
                      onChange={(e) => setMatchProfile(e.target.checked)}
                    />
                    <span className="text-xs text-slate-700">
                      <Filter className="h-3.5 w-3.5 d-inline me-1 text-sky-600" />
                      Only show <strong>{user.field_of_interest}</strong>
                      {user.expecting_type ? <> · <strong>{user.expecting_type}</strong></> : null} institutions
                    </span>
                  </label>
                </div>
              )}

              {error && (
                <div className="alert alert-danger rounded-xl text-xs py-2 mb-3">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 rounded-xl py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 border-0 d-flex align-items-center justify-content-center gap-1.5 text-white glow-btn"
              >
                <Search className="h-4 w-4" />
                {loading ? 'Finding colleges...' : 'Predict colleges'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-8 predictor-results-col min-w-0">
          <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white min-h-[450px] w-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Eligible colleges & branches
            </h3>

            {loading ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-20">
                <div className="loading-spinner mb-3" />
                <span className="text-slate-500 text-sm font-semibold">Matching your cutoff against our database...</span>
              </div>
            ) : !hasSearched ? (
              <div className="text-center py-20 text-slate-400">
                <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm">Select an exam and enter your rank or score to see where you qualify.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">No matching colleges found</p>
                <p className="text-xs max-w-sm mx-auto mt-1">
                  {activeInputMode === 'score'
                    ? 'Your score may be below the minimum cutoff. Try AIR mode or another exam.'
                    : 'Your rank may be worse than the closing cutoff. Try Cutoff/Score mode or uncheck profile filter.'}
                </p>
                {matchProfile && user?.field_of_interest && rank && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mt-3 rounded-xl"
                    onClick={async () => {
                      setMatchProfile(false);
                      setLoading(true);
                      setError(null);
                      try {
                        const data = await predictService.predict(exam, parseInt(rank, 10), false, inputMode);
                        setActiveInputMode(data.input_mode || inputMode);
                        setResults(data.results || []);
                        setFilteredBy(null);
                      } catch (err) {
                        setError(err.message || 'Failed to fetch predictions.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Search all streams
                  </button>
                )}
              </div>
            ) : (
              <div>
                {filteredBy && (
                  <p className="text-sky-700 text-xs mb-3 p-2 rounded-lg bg-sky-50 border border-sky-100">
                    <ShieldCheck className="h-3.5 w-3.5 d-inline me-1" />
                    Filtered for your profile: <strong>{filteredBy.stream}</strong>
                    {filteredBy.institution_type ? <> · <strong>{filteredBy.institution_type}</strong></> : null}
                  </p>
                )}
                <p className="text-slate-500 text-xs mb-4">
                  For <strong>{exam}</strong>, you qualify for <strong>{results.length}</strong> branch
                  {results.length !== 1 ? 'es' : ''}:
                </p>

                <div className="d-flex flex-column gap-3">
                  {results.map((result, idx) => (
                    <div
                      key={`${result.college_id}-${result.branch}-${idx}`}
                      className="border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-4 transition-all d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '48px', height: '48px' }}
                        >
                          {result.logo_url ? (
                            <img src={result.logo_url} alt="" className="img-fluid object-contain max-h-full" />
                          ) : (
                            <span className="text-slate-700 font-bold text-sm">
                              {result.college_name.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="d-flex flex-wrap gap-1 mb-1">
                            <span className="badge bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-bold">
                              {result.branch}
                            </span>
                            {result.stream && (
                              <span className="badge bg-sky-100 text-sky-700 text-[10px] px-2 py-0.5 rounded font-bold">
                                {result.stream}
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm mb-0.5 text-break">
                            {result.college_name}
                          </h4>
                          <span className="text-slate-400 text-xs d-flex align-items-center gap-0.5">
                            <MapPin className="h-3 w-3" /> {result.location}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex flex-row flex-md-column align-items-end justify-content-between border-top border-md-top-0 border-slate-200 pt-2 pt-md-0 gap-2">
                        <div className="text-end">
                          <span className="text-[10px] text-slate-400 uppercase font-extrabold block">
                            {activeInputMode === 'score' ? 'Min. cutoff' : 'Closing rank'}
                          </span>
                          <span className="text-sm font-black text-slate-800">
                            {result.cutoff_rank?.toLocaleString()}
                            {activeInputMode === 'score' && result.cutoff_max ? (
                              <span className="text-slate-400 font-normal text-xs"> / {result.cutoff_max}</span>
                            ) : null}
                          </span>
                          <span className="text-[10px] text-slate-400 d-block">{result.category}</span>
                        </div>
                        <Link
                          to={`/colleges/${result.college_id}`}
                          className="btn btn-outline-primary btn-sm rounded-lg text-xs font-bold py-1 px-2.5"
                        >
                          View details
                        </Link>
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
