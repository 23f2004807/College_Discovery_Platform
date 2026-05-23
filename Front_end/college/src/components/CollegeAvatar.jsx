import { useState } from 'react';

export default function CollegeAvatar({ college, size = 48, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = (college?.name || 'CD').substring(0, 2).toUpperCase();
  const dim = typeof size === 'number' ? size : 48;
  const showImg = college?.logo_url && !imgFailed;

  return (
    <div
      className={`d-flex align-items-center justify-content-center rounded-xl flex-shrink-0 overflow-hidden ${className}`}
      style={{
        width: dim,
        height: dim,
        background: showImg ? '#fff' : 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
      }}
    >
      {showImg ? (
        <img
          src={college.logo_url}
          alt=""
          className="object-contain w-100 h-100 p-1"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="fw-bold text-white" style={{ fontSize: dim * 0.32 }}>{initials}</span>
      )}
    </div>
  );
}
