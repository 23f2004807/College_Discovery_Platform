export function getDashboardPath(role, fallback = '/colleges') {
  if (role === 'admin') return '/admin';
  if (fallback === '/admin') return '/colleges';
  return fallback;
}
