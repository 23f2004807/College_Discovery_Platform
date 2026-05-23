import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collegeService } from '../services/collegeService';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, ShieldAlert, Save, Landmark, Sparkles, MapPin } from 'lucide-react';
import LogoutButton from '../components/LogoutButton';
import { FIELD_OPTIONS, EXPECTING_TYPES } from '../models/constants';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form & Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [fees, setFees] = useState('');
  const [rating, setRating] = useState('');
  const [placementsPct, setPlacementsPct] = useState('');
  const [packageMedian, setPackageMedian] = useState('');
  const [packageHighest, setPackageHighest] = useState('');
  const [courses, setCourses] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [stream, setStream] = useState('Engineering');
  const [institutionType, setInstitutionType] = useState('College');
  const [cutoffs, setCutoffs] = useState([]); // List of { exam, branch, max_rank }

  // Temp cutoff entry states
  const [tempExam, setTempExam] = useState('JEE Main');
  const [tempBranch, setTempBranch] = useState('');
  const [tempMaxRank, setTempMaxRank] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/auth', { state: { from: '/admin' } });
    }
  }, [user, authLoading, navigate]);

  // Fetch colleges
  const fetchColleges = async () => {
    setLoading(true);
    try {
      const data = await collegeService.list('');
      setColleges(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch college list for administration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchColleges();
    }
  }, [user]);

  // Open Modal for Create
  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setLocation('');
    setFees('');
    setRating('4.0');
    setPlacementsPct('');
    setPackageMedian('');
    setPackageHighest('');
    setCourses('');
    setLogoUrl('');
    setDescription('');
    setStream('Engineering');
    setInstitutionType('College');
    setCutoffs([]);
    setError(null);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = async (collegeId) => {
    setLoading(true);
    try {
      const data = await collegeService.getById(collegeId);
      setIsEditing(true);
      setEditId(collegeId);
      setName(data.name);
      setLocation(data.location);
      setFees(data.fees);
      setRating(data.rating);
      setPlacementsPct(data.placements_pct);
      setPackageMedian(data.package_median);
      setPackageHighest(data.package_highest);
      setCourses(data.courses.join(', '));
      setLogoUrl(data.logo_url || '');
      setDescription(data.description || '');
      setStream(data.stream || 'Engineering');
      setInstitutionType(data.institution_type || 'College');
      setCutoffs(data.cutoffs || []);
      setError(null);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert('Failed to load college details for editing.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Cutoff addition to list
  const handleAddCutoff = () => {
    if (!tempBranch || !tempMaxRank) return;
    const newCutoff = {
      exam: tempExam,
      branch: tempBranch,
      category: 'General',
      min_rank: 1,
      max_rank: parseInt(tempMaxRank)
    };
    setCutoffs([...cutoffs, newCutoff]);
    setTempBranch('');
    setTempMaxRank('');
  };

  // Handle Cutoff removal from list
  const handleRemoveCutoff = (idx) => {
    setCutoffs(cutoffs.filter((_, i) => i !== idx));
  };

  // Form Submit (Save / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location || !fees) {
      setError('Name, Location, and Fees are required fields.');
      return;
    }

    const payload = {
      name,
      location,
      fees: parseInt(fees),
      rating: parseFloat(rating || 0.0),
      courses,
      placements_pct: parseFloat(placementsPct || 0.0),
      package_median: parseFloat(packageMedian || 0.0),
      package_highest: parseFloat(packageHighest || 0.0),
      logo_url: logoUrl,
      description,
      stream,
      institution_type: institutionType,
      cutoffs
    };

    try {
      if (isEditing) {
        await collegeService.update(editId, payload);
      } else {
        await collegeService.create(payload);
      }
      setShowModal(false);
      fetchColleges();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save college details.');
    }
  };

  // Delete College
  const handleDelete = async (collegeId) => {
    if (!window.confirm('Are you sure you want to permanently delete this college? This will also delete reviews and cutoff entries.')) {
      return;
    }
    try {
      await collegeService.delete(collegeId);
      fetchColleges();
    } catch (err) {
      console.error(err);
      alert('Failed to delete college.');
    }
  };

  if (authLoading || loading && colleges.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-20 min-h-screen">
        <div className="loading-spinner mb-3"></div>
        <span className="text-slate-500 font-semibold">Verifying credentials and loading colleges...</span>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight d-flex align-items-center gap-2">
            <ShieldAlert className="text-amber-500 h-8 w-8 animate-pulse" />
            <span>Admin Management Panel</span>
          </h1>
          <p className="text-slate-500 mt-1">Add, update, or remove institutions, courses, and cutoffs from the database.</p>
        </div>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          <button
            onClick={handleOpenCreate}
            className="btn btn-primary rounded-xl px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 border-0 shadow d-flex align-items-center gap-1.5 glow-btn"
          >
            <Plus className="h-4 w-4" /> Add New College
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* College list table */}
      <div className="card border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-slate-50 border-bottom border-slate-100">
              <tr>
                <th className="px-4 py-3 text-xs uppercase font-extrabold tracking-wider text-slate-500">ID</th>
                <th className="px-4 py-3 text-xs uppercase font-extrabold tracking-wider text-slate-500">College Detail</th>
                <th className="px-4 py-3 text-xs uppercase font-extrabold tracking-wider text-slate-500">Location</th>
                <th className="px-4 py-3 text-xs uppercase font-extrabold tracking-wider text-slate-500">Fees (INR)</th>
                <th className="px-4 py-3 text-xs uppercase font-extrabold tracking-wider text-slate-500">Placements</th>
                <th className="px-4 py-3 text-xs uppercase font-extrabold tracking-wider text-slate-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((col) => (
                <tr key={col.id} className="border-bottom border-slate-50">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-400">#{col.id}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-slate-100 p-1.5 rounded-lg d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        {col.logo_url ? (
                          <img src={col.logo_url} alt="" className="img-fluid object-contain max-h-full" />
                        ) : (
                          <span className="text-slate-700 font-extrabold text-xs">{col.name.substring(0, 2)}</span>
                        )}
                      </div>
                      <span className="font-extrabold text-sm text-slate-900">{col.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="d-flex align-items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {col.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-black text-slate-800">
                    ₹{(col.fees / 100000).toFixed(2)} Lakh/yr
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-750 font-semibold">{col.placements_pct}% placed</td>
                  <td className="px-4 py-3">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(col.id)}
                        className="btn btn-outline-primary btn-sm rounded-lg d-flex align-items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(col.id)}
                        className="btn btn-outline-danger btn-sm rounded-lg d-flex align-items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out or centered Modal Backdrop & Box */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
              {/* Modal Header */}
              <div className="gradient-primary-glow text-white p-4 d-flex justify-content-between align-items-center">
                <h5 className="modal-title font-extrabold text-lg d-flex align-items-center gap-1.5">
                  <Landmark className="h-5 w-5" />
                  {isEditing ? `Edit College details (ID: #${editId})` : 'Register New College Campus'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 max-h-[60vh] overflow-y-auto">
                  {error && (
                    <div className="alert alert-danger text-xs py-2 text-center rounded-xl mb-3">{error}</div>
                  )}

                  <div className="row g-3">
                    {/* College Name */}
                    <div className="col-md-6">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">College Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Indian Institute of Technology, Madras"
                        className="form-control rounded-xl text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Stream & type */}
                    <div className="col-md-3">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Stream</label>
                      <select className="form-select rounded-xl text-sm" value={stream} onChange={(e) => setStream(e.target.value)} required>
                        {FIELD_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Institution Type</label>
                      <select className="form-select rounded-xl text-sm" value={institutionType} onChange={(e) => setInstitutionType(e.target.value)} required>
                        {EXPECTING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    {/* Location */}
                    <div className="col-md-6">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Location (City, State)</label>
                      <input
                        type="text"
                        placeholder="e.g. Chennai, Tamil Nadu"
                        className="form-control rounded-xl text-sm"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>

                    {/* Fees */}
                    <div className="col-md-4">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Annual Tuition Fees (INR)</label>
                      <input
                        type="number"
                        placeholder="e.g. 220000"
                        className="form-control rounded-xl text-sm"
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        required
                      />
                    </div>

                    {/* Rating */}
                    <div className="col-md-4">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Initial Rating (out of 5.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        placeholder="e.g. 4.5"
                        className="form-control rounded-xl text-sm"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      />
                    </div>

                    {/* Placement % */}
                    <div className="col-md-4">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Placements Success Ratio (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 96.5"
                        className="form-control rounded-xl text-sm"
                        value={placementsPct}
                        onChange={(e) => setPlacementsPct(e.target.value)}
                      />
                    </div>

                    {/* Packages */}
                    <div className="col-md-6">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Median Placement Package (LPA)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 15.6"
                        className="form-control rounded-xl text-sm"
                        value={packageMedian}
                        onChange={(e) => setPackageMedian(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Highest Placement Package (LPA)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 120.0"
                        className="form-control rounded-xl text-sm"
                        value={packageHighest}
                        onChange={(e) => setPackageHighest(e.target.value)}
                      />
                    </div>

                    {/* Courses list */}
                    <div className="col-12">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Courses Offered (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech Computer Science, B.Tech Electrical, B.Tech Mechanical"
                        className="form-control rounded-xl text-sm"
                        value={courses}
                        onChange={(e) => setCourses(e.target.value)}
                      />
                    </div>

                    {/* Logo URL */}
                    <div className="col-12">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Logo Image URL</label>
                      <input
                        type="url"
                        placeholder="https://upload.wikimedia.org/.../logo.png"
                        className="form-control rounded-xl text-sm"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label text-xs uppercase font-extrabold tracking-wider text-slate-500">Institution Description</label>
                      <textarea
                        placeholder="Provide details about campus life, infrastructure, or history..."
                        className="form-control rounded-xl text-sm"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    {/* Cutoffs Sub-Section */}
                    <div className="col-12 border-top border-slate-150 pt-3">
                      <h6 className="font-extrabold text-sm text-slate-900 mb-2 d-flex align-items-center gap-1.5">
                        <Sparkles className="text-amber-500 h-4.5 w-4.5" />
                        Manage Admission Cutoffs (Predictor Data)
                      </h6>
                      
                      {/* Cutoff items table list */}
                      {cutoffs.length > 0 ? (
                        <div className="bg-slate-50 p-2 rounded-xl mb-3 border border-slate-100 max-h-[150px] overflow-y-auto">
                          {cutoffs.map((item, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 mb-1.5 last:mb-0 text-xs">
                              <div>
                                <span className="badge bg-slate-100 text-slate-600 me-1">{item.exam}</span>
                                <strong className="text-slate-800 me-2">{item.branch}</strong>
                                <span className="text-slate-400">Closing Rank:</span> <span className="font-bold text-slate-900">{item.max_rank.toLocaleString()}</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveCutoff(idx)}
                                className="btn btn-link text-danger p-0 border-0 text-xs text-decoration-none"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 mb-3">No cutoffs registered. Add cutoff records below to enable admission predictions.</p>
                      )}

                      {/* Add cutoff input row */}
                      <div className="row g-2 align-items-end bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="col-4 col-sm-3">
                          <label className="form-label text-[10px] uppercase font-bold text-slate-500 m-0">Exam</label>
                          <select className="form-select rounded-lg py-1.5 text-xs mt-1" value={tempExam} onChange={(e) => setTempExam(e.target.value)}>
                            <option value="JEE Main">JEE Main</option>
                            <option value="JEE Advanced">JEE Advanced</option>
                            <option value="BITSAT">BITSAT</option>
                          </select>
                        </div>
                        <div className="col-4 col-sm-4">
                          <label className="form-label text-[10px] uppercase font-bold text-slate-500 m-0">Branch Stream</label>
                          <input
                            type="text"
                            placeholder="e.g. Computer Science"
                            className="form-control rounded-lg py-1.5 text-xs mt-1"
                            value={tempBranch}
                            onChange={(e) => setTempBranch(e.target.value)}
                          />
                        </div>
                        <div className="col-4 col-sm-3">
                          <label className="form-label text-[10px] uppercase font-bold text-slate-500 m-0">Closing Rank</label>
                          <input
                            type="number"
                            placeholder="e.g. 4500"
                            className="form-control rounded-lg py-1.5 text-xs mt-1"
                            value={tempMaxRank}
                            onChange={(e) => setTempMaxRank(e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-sm-2">
                          <button
                            type="button"
                            onClick={handleAddCutoff}
                            className="btn btn-dark w-100 rounded-lg py-1.5 text-xs font-bold text-white bg-slate-900 border-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-slate-50 p-3 border-top border-slate-100 d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary rounded-xl px-4 py-2 text-xs font-semibold" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-xl px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 border-0 d-flex align-items-center gap-1 glow-btn"
                  >
                    <Save className="h-4 w-4" /> Save College
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
