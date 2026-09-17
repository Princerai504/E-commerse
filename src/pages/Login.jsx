import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import logo from '../assets/logo.png';
import { FaEnvelope, FaLock, FaRightToBracket, FaUserShield } from 'react-icons/fa6';

const Login = () => {
  const { theme } = useContext(ThemeContext);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const redirectTo = location.state?.from || '/';

  const validate = () => {
    const newErrors = {};
    if (!form.identifier.trim()) newErrors.identifier = 'Email, mobile number, or username is required';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setApiError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = login({ identifier: form.identifier, password: form.password });
    if (!result.ok) {
      setApiError(result.error);
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const result = login({ identifier: 'admin@shopease.com', password: 'admin123' });
    if (!result.ok) {
      setApiError(result.error);
      return;
    }
    navigate('/admin', { replace: true });
  };

  const inputClass = `w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
    isDark
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  }`;

  return (
    <div className={`min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 transition-colors`}>
      <div
        className={`w-full max-w-md rounded-3xl border p-8 transition-colors ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="ShopEase" className="h-14 w-auto" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to continue shopping with ShopEase
          </p>
        </div>

        {apiError && (
          <div className="bg-danger/10 text-danger px-4 py-3 rounded-xl mb-4 text-sm font-medium animate-fade-in">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="identifier" className="block text-sm font-medium mb-1.5">
              Email / Mobile / Username
            </label>
            <div className="relative">
              <FaEnvelope
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  errors.identifier ? 'text-danger' : 'text-gray-400'
                }`}
              />
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={form.identifier}
                onChange={handleChange}
                placeholder="demo@shopease.com or 9876543210"
                className={`${inputClass} ${errors.identifier ? 'border-danger focus:ring-danger' : ''}`}
              />
            </div>
            {errors.identifier && (
              <p className="text-xs text-danger mt-1">{errors.identifier}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <FaLock
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  errors.password ? 'text-danger' : 'text-gray-400'
                }`}
              />
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`${inputClass} ${errors.password ? 'border-danger focus:ring-danger' : ''}`}
              />
            </div>
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <FaRightToBracket />
            Sign In
          </button>
        </form>

        <div className="mt-4">
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>
          <button
            onClick={handleAdminLogin}
            className="w-full py-3 text-sm font-semibold rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            <FaUserShield />
            Login as Admin (demo)
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              state={{ from: redirectTo }}
              className="text-primary font-semibold hover:underline"
            >
              Sign up free
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
          <p className="font-semibold mb-1 text-gray-700 dark:text-gray-300">Demo accounts</p>
          <p>Customer: <code>demo@shopease.com</code> / <code>demo1234</code></p>
          <p>Admin: <code>admin@shopease.com</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;