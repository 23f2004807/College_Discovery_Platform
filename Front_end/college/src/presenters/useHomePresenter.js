import { useState, useEffect } from 'react';
import { statsService } from '../services/statsService';

export function useHomePresenter() {
  const [stats, setStats] = useState({
    college_count: 0,
    cutoff_count: 0,
    avg_placement_pct: 0,
  });

  useEffect(() => {
    statsService.getPlatformStats().then(setStats).catch(() => {});
  }, []);

  return { stats };
}
