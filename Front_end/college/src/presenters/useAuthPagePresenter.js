import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { getDashboardPath } from '../models/authRedirect';
import { FIELD_OPTIONS } from '../models/constants';

export function useAuthPagePresenter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, register, logout, user } = useAuth();

  const initialRegister = searchParams.get('mode') === 'register';
  const [isLogin, setIsLogin] = useState(!initialRegister);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [expectingType, setExpectingType] = useState('');
  const [fieldOfInterest, setFieldOfInterest] = useState('');
  const [fieldOptions, setFieldOptions] = useState(FIELD_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const redirectTo = location.state?.from || '/colleges';

  useEffect(() => {
    authService.getRegistrationFields()
      .then((data) => {
        if (data.fields_of_interest?.length) setFieldOptions(data.fields_of_interest);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        if (!email || !password) {
          setError('Please enter email and password.');
          return;
        }
        setSuccessMessage(null);
        const loggedIn = await login(email, password);
        navigate(getDashboardPath(loggedIn.role, redirectTo));
      } else {
        if (!fullName || !phone || !email || !password || !expectingType || !fieldOfInterest) {
          setError('Please fill in all registration fields.');
          return;
        }
        const registeredEmail = email.trim();
        await register({
          full_name: fullName,
          phone,
          email: registeredEmail,
          password,
          expecting_type: expectingType,
          field_of_interest: fieldOfInterest,
        });
        setIsLogin(true);
        setEmail(registeredEmail);
        setPassword('');
        setFullName('');
        setPhone('');
        setExpectingType('');
        setFieldOfInterest('');
        setSuccessMessage('Account created successfully! Sign in with your email and password.');
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isLogin, setIsLogin, email, setEmail, password, setPassword,
    fullName, setFullName, phone, setPhone, expectingType, setExpectingType,
    fieldOfInterest, setFieldOfInterest, fieldOptions,
    loading, error, setError, successMessage, setSuccessMessage, handleSubmit, handleLogout,
    switchToLogin: () => { setIsLogin(true); setError(null); },
    switchToRegister: () => { setIsLogin(false); setError(null); setSuccessMessage(null); },
    dashboardPath: user ? getDashboardPath(user.role, redirectTo) : '/colleges',
  };
}
