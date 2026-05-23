import { Link } from 'react-router-dom';
import CollegeAvatar from './CollegeAvatar';
import { X, Star, IndianRupee, MapPin, GitCompare } from 'lucide-react';

function CompareRow({ label, values }) {
  return (
    <tr>
      <td className="compare-feature-col font-bold text-xs uppercase text-slate-500 ps-4">{label}</td>
      {values.map((val, i) => (
        <td key={i} className="text-center text-sm py-3 px-2">{val}</td>
      ))}
    </tr>
  );
}

export default function CompareOverlay({ colleges, onClose, onRemove }) {
  if (!colleges?.length) return null;

  return (
    <div className="compare-overlay-backdrop" onClick={onClose} role="presentation">
      <div
        className="compare-overlay-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-overlay-title"
      >
        <div className="compare-overlay-header">
          <div>
            <h2 id="compare-overlay-title" className="text-xl font-extrabold mb-0 d-flex align-items-center gap-2">
              <GitCompare className="text-sky-500 h-6 w-6" />
              <span className="text-sky-600">Compare</span>
              <span className="text-slate-900">Colleges</span>
            </h2>
            <p className="text-slate-500 text-sm mb-0 mt-1">
              Comparing {colleges.length} institution{colleges.length !== 1 ? 's' : ''} side by side
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="compare-overlay-close"
            aria-label="Close comparison"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* College headers */}
        <div className="compare-overlay-colleges">
          {colleges.map((c) => (
            <div key={c.id} className="compare-overlay-college-card">
              <button
                type="button"
                onClick={() => onRemove?.(c.id)}
                className="compare-overlay-college-remove"
                title="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <CollegeAvatar college={c} size={52} className="mb-2" />
              <p className="text-xs font-extrabold text-slate-900 line-clamp-2 mb-1">{c.name.split(',')[0]}</p>
              <p className="text-[10px] text-slate-500 mb-0">
                <MapPin className="h-3 w-3 d-inline" /> {c.location?.split(',')[0]}
              </p>
            </div>
          ))}
        </div>

        <div className="compare-overlay-body">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle compare-table">
              <thead className="d-none">
                <tr>
                  <th>Feature</th>
                  {colleges.map((c) => <th key={c.id}>{c.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Location" values={colleges.map((c) => c.location)} />
                <CompareRow
                  label="Rating"
                  values={colleges.map((c) => (
                    <span key={c.id} className="text-amber-600 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500 d-inline" /> {c.rating} / 5
                    </span>
                  ))}
                />
                <CompareRow
                  label="Annual fees"
                  values={colleges.map((c) => (
                    <span key={c.id} className="font-bold">
                      <IndianRupee className="h-3.5 w-3.5 d-inline" />
                      {(c.fees / 100000).toFixed(2)} Lakh/yr
                    </span>
                  ))}
                />
                <CompareRow label="Placements" values={colleges.map((c) => `${c.placements_pct}%`)} />
                <CompareRow label="Median package" values={colleges.map((c) => `${c.package_median} LPA`)} />
                <CompareRow
                  label="Highest package"
                  values={colleges.map((c) => (
                    <span key={c.id} className="text-emerald-600 font-bold">{c.package_highest} LPA</span>
                  ))}
                />
                <CompareRow label="Stream" values={colleges.map((c) => c.stream || '—')} />
                <CompareRow label="Type" values={colleges.map((c) => c.institution_type || '—')} />
                <CompareRow
                  label="Top courses"
                  values={colleges.map((c) => (
                    <div key={c.id} className="d-flex flex-wrap gap-1 justify-content-center">
                      {(c.courses || []).slice(0, 3).map((course, idx) => (
                        <span key={idx} className="badge bg-slate-100 text-slate-600 text-[10px]">{course}</span>
                      ))}
                    </div>
                  ))}
                />
              </tbody>
            </table>
          </div>
        </div>

        <div className="compare-overlay-footer">
          {colleges.map((c) => (
            <Link
              key={c.id}
              to={`/colleges/${c.id}`}
              className="btn btn-outline-primary btn-sm rounded-xl text-xs font-bold flex-fill"
              onClick={onClose}
            >
              {c.name.split(',')[0]}
            </Link>
          ))}
          <button type="button" onClick={onClose} className="btn btn-primary rounded-xl bg-sky-600 border-0 text-sm font-bold px-4">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
