import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { MapPin, IndianRupee, Star, Landmark, Award, BookOpen, MessageSquare, ThumbsUp, Send, GraduationCap, ChevronLeft } from 'lucide-react';

export default function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewerRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  // Fetch college details
  const fetchCollegeDetails = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/colleges/${id}`);
      setCollege(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('College details not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewerName || !reviewText) {
      setReviewError('Please fill out all fields.');
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      await api.post(`/colleges/${id}/reviews`, {
        reviewer_name: reviewerName,
        rating: parseFloat(reviewRating),
        text: reviewText
      });
      setReviewSuccess(true);
      setReviewerName('');
      setReviewText('');
      setReviewerRating(5);
      // Reload details to get new average rating and updated reviews
      fetchCollegeDetails();
    } catch (err) {
      console.error(err);
      setReviewError(err.message || 'Failed to submit review.');
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
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn btn-link text-slate-500 hover:text-slate-900 d-flex align-items-center gap-1 p-0 mb-6 text-sm font-bold text-decoration-none">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      {/* College Hero Card */}
      <div className="card border-0 shadow-sm rounded-3xl overflow-hidden bg-white mb-8">
        <div className="gradient-primary-glow text-white p-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 position-relative">
          <div className="d-flex align-items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
              {college.logo_url ? (
                <img src={college.logo_url} alt={college.name} className="img-fluid object-contain max-h-full" />
              ) : (
                <span className="text-slate-700 font-black text-2xl">{college.name.substring(0, 2)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold m-0 leading-tight text-white tracking-tight">{college.name}</h1>
              <div className="text-sky-200 text-sm d-flex align-items-center gap-1 mt-1 font-medium">
                <MapPin className="h-4 w-4" />
                {college.location}
              </div>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-2 bg-black/25 px-4 py-2.5 rounded-2xl w-fit">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <div className="text-end">
              <span className="text-2xl font-black">{college.rating}</span>
              <span className="text-xs text-sky-200 block">Overall Rating</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-slate-50 border-t border-slate-100 p-4">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Annual Fees</div>
              <div className="text-lg font-black text-slate-800 d-flex align-items-center justify-content-center mt-1">
                <IndianRupee className="h-4 w-4" />
                {(college.fees / 100000).toFixed(2)} Lakh
              </div>
            </div>
            <div className="col-6 col-md-3 border-start border-slate-200">
              <div className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Placements</div>
              <div className="text-lg font-black text-slate-800 mt-1">{college.placements_pct}% placed</div>
            </div>
            <div className="col-6 col-md-3 border-start border-md-start border-slate-200">
              <div className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Median Package</div>
              <div className="text-lg font-black text-slate-800 mt-1">{college.package_median} LPA</div>
            </div>
            <div className="col-6 col-md-3 border-start border-slate-200">
              <div className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Highest Package</div>
              <div className="text-lg font-black text-emerald-600 mt-1">{college.package_highest} LPA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="d-flex border-b border-slate-200 mb-6 overflow-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-bold text-sm border-b-2 d-flex align-items-center gap-1.5 whitespace-nowrap transition-all ${activeTab === 'overview' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Landmark className="h-4 w-4" /> Overview & Courses
        </button>
        <button
          onClick={() => setActiveTab('cutoffs')}
          className={`px-4 py-3 font-bold text-sm border-b-2 d-flex align-items-center gap-1.5 whitespace-nowrap transition-all ${activeTab === 'cutoffs' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Award className="h-4 w-4" /> Admission Cutoffs
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-3 font-bold text-sm border-b-2 d-flex align-items-center gap-1.5 whitespace-nowrap transition-all ${activeTab === 'reviews' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <MessageSquare className="h-4 w-4" /> Student Reviews ({college.reviews?.length || 0})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="row g-4">
        {/* Main Info */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white min-h-[400px]">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 d-flex align-items-center gap-2">
                  <BookOpen className="text-sky-500 h-5 w-5" /> About the Institution
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {college.description || "No description provided for this college campus."}
                </p>

                <h3 className="text-xl font-bold text-slate-900 mb-3 d-flex align-items-center gap-2">
                  <GraduationCap className="text-indigo-500 h-5 w-5" /> Program Courses Offered
                </h3>
                <div className="row g-2">
                  {college.courses?.map((c, idx) => (
                    <div key={idx} className="col-sm-6">
                      <div className="border border-slate-100 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 text-sm font-semibold d-flex align-items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                        {c}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cutoffs' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 d-flex align-items-center gap-2">
                  <Award className="text-sky-500 h-5 w-5" /> Cutoff Ranks (Closing Ranks)
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  These represent general category closing cutoffs. Students scoring ranks lower than or equal to these ranks have high eligibility to get admitted to these branches.
                </p>

                {college.cutoffs && college.cutoffs.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover border border-slate-100 rounded-xl overflow-hidden align-middle">
                      <thead className="bg-slate-50 border-bottom border-slate-100">
                        <tr>
                          <th className="px-3 py-2.5 text-xs uppercase font-extrabold tracking-wider text-slate-500">Exam</th>
                          <th className="px-3 py-2.5 text-xs uppercase font-extrabold tracking-wider text-slate-500">Branch / Specialization</th>
                          <th className="px-3 py-2.5 text-xs uppercase font-extrabold tracking-wider text-slate-500">Category</th>
                          <th className="px-3 py-2.5 text-xs uppercase font-extrabold tracking-wider text-slate-500 text-end">Closing Cutoff Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.cutoffs.map((cutoff, idx) => (
                          <tr key={idx} className="border-bottom border-slate-50">
                            <td className="px-3 py-2.5 font-bold text-sm text-slate-800">{cutoff.exam}</td>
                            <td className="px-3 py-2.5 text-sm text-slate-600">{cutoff.branch}</td>
                            <td className="px-3 py-2.5 text-xs"><span className="badge bg-slate-100 text-slate-500">{cutoff.category}</span></td>
                            <td className="px-3 py-2.5 text-sm font-black text-slate-950 text-end">
                              {cutoff.max_rank.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-10">No cutoff datasets have been configured for this college yet.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 d-flex align-items-center gap-2">
                  <MessageSquare className="text-sky-500 h-5 w-5" /> Student & Alumni Reviews
                </h3>

                {college.reviews && college.reviews.length > 0 ? (
                  <div className="d-flex flex-column gap-3 mb-6">
                    {college.reviews.map((review) => (
                      <div key={review.id} className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all duration-150">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="font-extrabold text-slate-800 text-sm">{review.reviewer_name}</div>
                            <div className="text-[10px] text-slate-400 font-semibold">{review.created_at}</div>
                          </div>
                          <div className="d-flex align-items-center gap-1 bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            {review.rating}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-0">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-10">No reviews found. Be the first to share your experience!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Review Submission Form */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-2xl p-4 bg-white sticky-top top-24">
            <h3 className="text-lg font-extrabold text-slate-900 mb-3 d-flex align-items-center gap-2">
              <ThumbsUp className="text-sky-500 h-5 w-5" /> Write a Review
            </h3>
            
            {reviewSuccess && (
              <div className="alert alert-success rounded-xl text-xs py-2 mb-3">Review posted successfully!</div>
            )}
            {reviewError && (
              <div className="alert alert-danger rounded-xl text-xs py-2 mb-3">{reviewError}</div>
            )}

            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="form-control rounded-xl text-sm border-slate-200"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Rating (1 to 5 Stars)</label>
                <select
                  className="form-select rounded-xl text-sm border-slate-200"
                  value={reviewRating}
                  onChange={(e) => setReviewerRating(parseInt(e.target.value))}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Good)</option>
                  <option value={2}>⭐⭐ (2 - Average)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Your Review</label>
                <textarea
                  placeholder="Share details about professors, placements, campus life..."
                  className="form-control rounded-xl text-sm border-slate-200"
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="btn btn-primary w-100 rounded-xl py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 border-0 d-flex align-items-center justify-content-center gap-1.5 text-white glow-btn"
              >
                <Send className="h-3.5 w-3.5" />
                {submittingReview ? "Submitting..." : "Post Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
