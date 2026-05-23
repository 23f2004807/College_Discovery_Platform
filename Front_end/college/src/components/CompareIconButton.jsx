import { useState, useEffect } from 'react';
import { GitCompare } from 'lucide-react';
import { compareService } from '../services/compareService';

export default function CompareIconButton({ college, size = 'sm', onToggle }) {
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setIsAdded(compareService.isInList(college.id));
    const handler = () => {
      setIsAdded(compareService.isInList(college.id));
    };
    window.addEventListener('compareListUpdated', handler);
    return () => window.removeEventListener('compareListUpdated', handler);
  }, [college.id]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = compareService.toggle(college);
    if (result.error) {
      alert(result.error);
      return;
    }
    setIsAdded(result.added);
    window.dispatchEvent(new Event('compareListUpdated'));
    onToggle?.(result);
  };

  const isLarge = size === 'lg';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={isAdded ? 'compare-icon-btn compare-icon-btn-added' : 'compare-icon-btn'}
      title={isAdded ? 'Remove from compare' : 'Add to compare'}
    >
      <GitCompare size={isLarge ? 16 : 14} strokeWidth={2.5} />
      <span>{isAdded ? 'Added' : 'Compare'}</span>
    </button>
  );
}
