import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { FIELD_OPTIONS, EXPECTING_TYPES } from '../models/constants';
import { PROFILE_ICON_OPTIONS, DEFAULT_PROFILE_ICON } from '../models/profileIcons';
import ProfileAvatar from './ProfileAvatar';
import { Loader2 } from 'lucide-react';

export default function UserProfileMenu() {
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    profile_icon: DEFAULT_PROFILE_ICON,
    full_name: '',
    phone: '',
    expecting_type: '',
    field_of_interest: '',
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      profile_icon: user.profile_icon || DEFAULT_PROFILE_ICON,
      full_name: user.full_name || '',
      phone: user.phone || '',
      expecting_type: user.expecting_type || '',
      field_of_interest: user.field_of_interest || '',
    });
  }, [user, open]);

  if (!user) return null;

  const handleOpen = () => {
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (!saving) setOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = await authService.updateProfile(form);
      updateUser(data.user);
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn btn-sm d-flex align-items-center justify-content-center gap-2 text-white bg-slate-800 px-2 py-1.5 rounded-full border border-slate-600 hover:border-sky-400 hover:bg-slate-700 transition-all"
        title="Edit profile"
        aria-label="Open profile settings"
      >
        <ProfileAvatar iconId={user.profile_icon} size="sm" />
        <span className="text-sm font-medium d-none d-sm-inline max-w-[140px] text-truncate">
          {user.full_name || user.email}
        </span>
      </button>

      {open && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3xl overflow-hidden">
              <div className="modal-header border-0 pb-0 px-4 pt-4">
                <div>
                  <h5 className="modal-title fw-bold text-slate-900">Edit Profile</h5>
                  <p className="text-slate-500 text-sm mb-0">{user.email}</p>
                </div>
                <button type="button" className="btn-close" onClick={handleClose} aria-label="Close" disabled={saving} />
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body px-4 py-3">
                  {error && (
                    <div className="alert alert-danger rounded-xl text-sm py-2 mb-3">{error}</div>
                  )}

                  <label className="form-label text-xs uppercase font-extrabold text-slate-500 mb-2">
                    Choose profile icon
                  </label>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {PROFILE_ICON_OPTIONS.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, profile_icon: id }))}
                        className={`btn p-2 rounded-xl d-flex flex-column align-items-center gap-1 ${
                          form.profile_icon === id
                            ? 'btn-primary bg-sky-600 border-sky-600 text-white'
                            : 'btn-outline-secondary border-slate-200 text-slate-600'
                        }`}
                        style={{ width: '72px' }}
                        title={label}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px] font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-xs uppercase font-extrabold text-slate-500">Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-xl border-slate-200"
                        value={form.full_name}
                        onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-xs uppercase font-extrabold text-slate-500">Phone</label>
                      <input
                        type="tel"
                        className="form-control rounded-xl border-slate-200"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-xs uppercase font-extrabold text-slate-500">Expecting to join</label>
                      <select
                        className="form-select rounded-xl border-slate-200"
                        value={form.expecting_type}
                        onChange={(e) => setForm((f) => ({ ...f, expecting_type: e.target.value }))}
                        required
                      >
                        <option value="">— Select —</option>
                        {EXPECTING_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-xs uppercase font-extrabold text-slate-500">Field / Stream</label>
                      <select
                        className="form-select rounded-xl border-slate-200"
                        value={form.field_of_interest}
                        onChange={(e) => setForm((f) => ({ ...f, field_of_interest: e.target.value }))}
                        required
                      >
                        <option value="">— Select —</option>
                        {FIELD_OPTIONS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
                  <button type="button" className="btn btn-light rounded-xl px-4" onClick={handleClose} disabled={saving}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary rounded-xl px-4 bg-sky-600 border-0 d-flex align-items-center gap-2"
                  >
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
