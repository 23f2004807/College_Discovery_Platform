import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegeService } from '../services/collegeService';
import { savedService } from '../services/savedService';
import { compareService } from '../services/compareService';

export function useCollegeListPresenter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [course, setCourse] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [minRating, setMinRating] = useState('');
  const [streamFilter, setStreamFilter] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [savedIds, setSavedIds] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [streamsList, setStreamsList] = useState([]);
  const [institutionTypesList, setInstitutionTypesList] = useState([]);
  const [showAllStreams, setShowAllStreams] = useState(false);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (course) params.append('course', course);
      if (maxFees) params.append('max_fees', maxFees);
      if (minRating) params.append('min_rating', minRating);
      if (streamFilter) {
        params.append('stream', streamFilter);
      } else if (user?.field_of_interest && !showAllStreams) {
        params.append('stream', user.field_of_interest);
      }
      if (institutionType) {
        params.append('institution_type', institutionType);
      } else if (user?.expecting_type && !showAllStreams) {
        params.append('institution_type', user.expecting_type);
      }
      const data = await collegeService.list(params.toString());
      const sorted = [...data].sort((a, b) => {
        if (sortBy === 'fees-asc') return a.fees - b.fees;
        if (sortBy === 'fees-desc') return b.fees - a.fees;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.rating - a.rating;
      });
      setColleges(sorted);
      setError(null);
    } catch (err) {
      setError('Failed to fetch colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [search, location, course, maxFees, minRating, streamFilter, institutionType, sortBy, user?.field_of_interest, user?.expecting_type, showAllStreams]);

  useEffect(() => {
    collegeService.getFilters()
      .then((data) => {
        setLocationsList(data.locations || []);
        setCoursesList(data.courses || []);
        setStreamsList(data.streams || []);
        setInstitutionTypesList(data.institution_types || []);
      })
      .catch(() => {});

    if (user) {
      savedService.list()
        .then((data) => setSavedIds(data.map((item) => item.college_id)))
        .catch(() => {});
    } else {
      setSavedIds([]);
    }

    setCompareList(compareService.getList());
    const handler = () => setCompareList(compareService.getList());
    window.addEventListener('compareListUpdated', handler);
    return () => window.removeEventListener('compareListUpdated', handler);
  }, [user]);

  const handleToggleSave = async (collegeId) => {
    if (!user) {
      navigate('/auth', { state: { from: '/colleges' } });
      return;
    }
    try {
      const result = await savedService.toggle(collegeId);
      if (result.saved) setSavedIds([...savedIds, collegeId]);
      else setSavedIds(savedIds.filter((id) => id !== collegeId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompareToggle = () => setCompareList(compareService.getList());

  const handleClearCompare = () => {
    compareService.clear();
    setCompareList([]);
    window.dispatchEvent(new Event('compareListUpdated'));
  };

  const handleGoCompare = () => {
    if (!user) navigate('/auth', { state: { from: '/compare' } });
    else navigate('/compare');
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setCourse('');
    setMaxFees('');
    setMinRating('');
    setStreamFilter('');
    setInstitutionType('');
    setSortBy('rating');
  };

  return {
    colleges, loading, error, search, setSearch, location, setLocation,
    course, setCourse, maxFees, setMaxFees, minRating, setMinRating,
    streamFilter, setStreamFilter, institutionType, setInstitutionType,
    sortBy, setSortBy, savedIds, compareList,
    locationsList, coursesList, streamsList, institutionTypesList,
    handleToggleSave, handleCompareToggle,
    handleClearCompare, handleGoCompare, handleClearFilters,
    user, showAllStreams, setShowAllStreams,
  };
}
