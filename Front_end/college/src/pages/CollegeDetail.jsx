import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collegeService } from '../services/collegeService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import CompareIconButton from '../components/CompareIconButton';
import CollegeAvatar from '../components/CollegeAvatar';
import { MapPin, IndianRupee, Star, Landmark, Award, BookOpen, MessageSquare, ThumbsUp, Send, GraduationCap, ChevronLeft, GitCompare } from 'lucide-react';

export default function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [college, setCollege] = useState(null);
  const [similarColleges, setSimilarColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchCollegeDetails = async () => {
    setLoading(true);
    try {
      const data = await collegeService.getById(id);
      setCollege(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('College details not found.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilar = async () => {
    try {
      const data = await collegeService.getSimilar(id);
      setSimilarColleges(data);
    } catch (err) {
      console.error('Failed to load similar colleges:', err);
    }
  };

  useEffect(() => {
    fetchCollegeDetails();
    fetchSimilar();
  }, [id]);

  useEffect(() => {
    if (user) {
      setReviewerName(user.email.split('@')[0]);
    }
  }, [user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth', { state: { from: `/colleges/${id}` } });
      return;
    }
    if (!reviewText) {
      setReviewError('Please write your review.');
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      await reviewService.add(id, {
        reviewer_name: reviewerName || user.email.split('@')[0],
        rating: parseFloat(reviewRating),
        text: reviewText,
      });
      setReviewSuccess(true);
      setReviewText('');
      setReviewRating(5);
      fetchCollegeDetails();
    } catch (err) {
      if (err.message?.includes('token') || err.message?.includes('Authorization')) {
        navigate('/auth', { state: { from: `/colleges/${id}` } });
      } else {
        setReviewError(err.message || 'Failed to submit review.');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-20 min-h-screen">
        <div className="loading-spinner mb-3"></div>
        <span className="text-slate-500 font-semibold">Loading college details...</span>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="container py-20 text-center max-w-lg mx-auto">
        <div className="alert alert-danger rounded-2xl p-4 mb-4">{error || 'College not found.'}</div>
        <Link to="/colleges" className="btn btn-primary bg-sky-600 border-0 rounded-xl px-4 py-2 text-sm font-semibold">
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <button onClick={() => navigate(-1)} className="btn btn-link text-slate-500 hover:text-slate-900 d-flex align-items-center gap-1 p-0 mb-6 text-sm font-bold text-decoration-none">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <div className="card border-0 shadow-sm rounded-3xl overflow-hidden bg-white mb-8">
        <div className="gradient-primary-glow text-white p-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
          <div className="d-flex align-items-center gap-4 min-w-0">
            <CollegeAvatar college={college} size={80} />
            <div className="min-w-0">
              <h1 className="text-2xl text-md-3xl font-extrabold m-0 text-white tracking-tight">{college.name}</h1>
              <div className="text-sky-200 text-sm d-flex align-items-center gap-1 mt-1 flex-wrap">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-truncate">{college.location}</span>
                {college.stream && (
                  <span className="badge bg-white/20 text-white text-[10px] ms-1">{college.stream}</span>
                )}
                {college.institution_type && (
                  <span className="badge bg-white/20 text-white text-[10px]">{college.institution_type}</span>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 flex-shrink-0">
            <CompareIconButton college={college} size="lg" />
            <div className="d-flex align-items-center gap-2 bg-black/25 px-4 py-2.5 rounded-2xl">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <div className="text-end">
                <span className="text-2xl font-black">{college.rating}</span>
                <span className="text-xs text-sky-200 d-block">Overall Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-top border-slate-100 p-4">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="text-xs text-slate-400 font-extrabold uppercase">Annual Fees</div>
              <div className="text-lg font-black text-slate-800 d-flex align-items-center justify-content-center mt-1">
                <IndianRupee className="h-4 w-4" />
                {(college.fees / 100000).toFixed(2)} Lakh
              </div>
            </div>
            <div className="col-6 col-md-3 border-start border-slate-200">
              <div className="text-xs text-slate-400 font-extrabold uppercase">Placements</div>
              <div className="text-lg font-black text-slate-800 mt-1">{college.placements_pct}%</div>
            </div>
            <div className="col-6 col-md-3 border-start border-slate-200">
              <div className="text-xs text-slate-400 font-extrabold uppercase">Median Package</div>
              <div className="text-lg font-black text-slate-800 mt-1">{college.package_median} LPA</div>
            </div>
            <div className="col-6 col-md-3 border-start border-slate-200">
              <div className="text-xs text-slate-400 font-extrabold uppercase">Highest Package</div>
              <div className="text-lg font-black text-emerald-600 mt-1">{college.package_highest} LPA</div>
            </div>
          </div>
        </div>
      </div>

      {similarColleges.length > 0 && (
        <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white mb-6">
          <h3 className="text-sm font-extrabold text-slate-900 mb-3 d-flex align-items-center gap-2">
            <GitCompare className="text-sky-500 h-4 w-4" />
            Suggested Comparisons
          </h3>
          <div className="row g-2">
            {similarColleges.map((sim) => (
              <div key={sim.id} className="col-6 col-md-3">
                <div className="border border-slate-100 rounded-xl p-3 h-100 d-flex flex-column">
                  <div className="d-flex align-items-center gap-2 mb-2 min-w-0">
                    <div className="bg-slate-50 p-1 rounded-lg flex-shrink-0" style={{ width: '32px', height: '32px' }}>
                      {sim.logo_url ? (
                        <img src={sim.logo_url} alt="" className="img-fluid object-contain" style={{ maxHeight: '24px' }} />
                      ) : (
                        <span className="text-xs font-bold">{sim.name.substring(0, 2)}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800 text-truncate">{sim.name.split(',')[0]}</span>
                  </div>
                  <div className="d-flex gap-1 mt-auto">
                    <CompareIconButton college={sim} />
                    <Link to={`/colleges/${sim.id}`} className="btn btn-outline-primary btn-sm rounded-lg text-[10px] py-0 px-2 flex-grow-1">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {user && (
            <Link to="/compare" className="btn btn-primary btn-sm mt-3 bg-sky-600 border-0 rounded-xl text-xs font-bold">
              Go to Compare Page
            </Link>
          )}
        </div>
      )}

      <div className="d-flex border-bottom border-slate-200 mb-6 overflow-auto">
        {['overview', 'cutoffs', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-bold text-sm border-bottom border-2 d-flex align-items-center gap-1.5 text-nowrap ${activeTab === tab ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500'}`}
          >
            {tab === 'overview' && <><Landmark className="h-4 w-4" /> Overview</>}
            {tab === 'cutoffs' && <><Award className="h-4 w-4" /> Cutoffs</>}
            {tab === 'reviews' && <><MessageSquare className="h-4 w-4" /> Reviews ({college.reviews?.length || 0})</>}
          </button>
        ))}
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-8 order-1">
          <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white min-h-[400px]">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 d-flex align-items-center gap-2">
                  <BookOpen className="text-sky-500 h-5 w-5" /> About the Institution
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {college.description || 'No description provided for this college campus.'}
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-3 d-flex align-items-center gap-2">
                  <GraduationCap className="text-indigo-500 h-5 w-5" /> Program Courses Offered
                </h3>
                <div className="row g-2">
                  {college.courses?.map((c, idx) => (
                    <div key={idx} className="col-sm-6">
                      <div className="border border-slate-100 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 text-sm font-semibold">
                        {c}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cutoffs' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Cutoff Ranks (Closing Ranks)</h3>
                {college.cutoffs?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover border border-slate-100 rounded-xl align-middle">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-xs uppercase text-slate-500">Exam</th>
                          <th className="text-xs uppercase text-slate-500">Branch</th>
                          <th className="text-xs uppercase text-slate-500">Category</th>
                          <th className="text-xs uppercase text-slate-500 text-end">Closing Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.cutoffs.map((cutoff, idx) => (
                          <tr key={idx}>
                            <td className="font-bold text-sm">{cutoff.exam}</td>
                            <td className="text-sm">{cutoff.branch}</td>
                            <td><span className="badge bg-slate-100 text-slate-500">{cutoff.category}</span></td>
                            <td className="font-black text-end">{cutoff.max_rank.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-10">No cutoff data configured yet.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Student & Alumni Reviews</h3>
                {college.reviews?.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {college.reviews.map((review) => (
                      <div key={review.id} className="border border-slate-100 bg-slate-50 rounded-2xl p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="font-extrabold text-slate-800 text-sm">{review.reviewer_name}</div>
                            <div className="text-[10px] text-slate-400">{review.created_at}</div>
                          </div>
                          <div className="d-flex align-items-center gap-1 bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-500" />
                            {review.rating}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-0">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-10">No reviews yet. Be the first!</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4 order-2">
          <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white college-detail-review">
            <h3 className="text-lg font-extrabold text-slate-900 mb-3 d-flex align-items-center gap-2">
              <ThumbsUp className="text-sky-500 h-5 w-5" /> Write a Review
            </h3>

            {!user ? (
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm mb-3">Sign in to post a review for this college.</p>
                <Link to="/auth" state={{ from: `/colleges/${id}` }} className="btn btn-primary w-100 rounded-xl py-2 text-xs font-bold bg-sky-600 border-0 text-white">
                  Sign In / Create Account
                </Link>
              </div>
            ) : (
              <>
                {reviewSuccess && <div className="alert alert-success rounded-xl text-xs py-2 mb-3">Review posted!</div>}
                {reviewError && <div className="alert alert-danger rounded-xl text-xs py-2 mb-3">{reviewError}</div>}

                <form onSubmit={handleSubmitReview}>
                  <div className="mb-3">
                    <label className="form-label text-xs uppercase font-extrabold text-slate-500">Your Name</label>
                    <input
                      type="text"
                      className="form-control rounded-xl text-sm"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-xs uppercase font-extrabold text-slate-500">Rating</label>
                    <select className="form-select rounded-xl text-sm" value={reviewRating} onChange={(e) => setReviewRating(parseInt(e.target.value))}>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-xs uppercase font-extrabold text-slate-500">Your Review</label>
                    <textarea
                      className="form-control rounded-xl text-sm"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" disabled={submittingReview} className="btn btn-primary w-100 rounded-xl py-2.5 text-xs font-bold bg-sky-600 border-0 text-white">
                    <Send className="h-3.5 w-3.5 me-1" />
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
