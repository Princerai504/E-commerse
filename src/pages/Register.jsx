import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import logo from '../assets/logo.png';
import { FaUser, FaEnvelope, FaMobileScreen, FaAt, FaLock, FaUserPlus } from 'react-icons/fa6';

const Register = () => {
  const { theme } = useContext(ThemeContext);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const redirectTo = location.state?.from || '/';

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    else if (form.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email address';

    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))
      newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';

    if (!form.username.trim()) newErrors.username = 'Username is required';
    else if (form.username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

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

    const result = register({
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      username: form.username,
      password: form.password,
    });
    if (!result.ok) {
      setApiError(result.error);
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  const field = (name, label, placeholder, type = 'text', icon, autoComplete) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
              errors[name] ? 'text-danger' : 'text-gray-400'
            }`}
          >
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
            errors[name] ? 'border-danger focus:ring-danger' : ''
          }`}
        />
      </div>
      {errors[name] && <p className="text-xs text-danger mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div
        className={`w-full max-w-md rounded-3xl border p-8 transition-colors ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="ShopEase" className="h-14 w-auto" />
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join ShopEase and track your orders easily
          </p>
        </div>

        {apiError && (
          <div className="bg-danger/10 text-danger px-4 py-3 rounded-xl mb-4 text-sm font-medium animate-fade-in">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {field('name', 'Full Name', 'John Doe', 'text', <FaUser />, 'name')}
          {field('email', 'Email Address', 'john@example.com', 'email', <FaEnvelope />, 'email')}
          {field('mobile', 'Mobile Number', '9876543210', 'tel', <FaMobileScreen />, 'tel')}
          {field('username', 'Username', 'john_doe', 'text', <FaAt />, 'username')}
          {field('password', 'Password', 'Min 6 characters', 'password', <FaLock />, 'new-password')}
          {field('confirmPassword', 'Confirm Password', 'Re-enter password', 'password', <FaLock />, 'new-password')}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            <FaUserPlus />
            Create Account
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              state={{ from: redirectTo }}
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;