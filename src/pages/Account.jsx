import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaUser, FaEnvelope, FaMobileScreen, FaAt, FaRightFromBracket, FaBasketShopping } from 'react-icons/fa6';

const Account = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser, logout } = useAuth();
  const isDark = theme === 'dark';

  if (!currentUser) return null;

  const info = [
    { icon: <FaUser />, label: 'Full Name', value: currentUser.name },
    { icon: <FaEnvelope />, label: 'Email', value: currentUser.email },
    { icon: <FaMobileScreen />, label: 'Mobile', value: currentUser.mobile },
    { icon: <FaAt />, label: 'Username', value: currentUser.username },
  ];

  const cardClass = `rounded-2xl border transition-colors ${
    isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
  }`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">Account</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        My <span className="text-primary">Account</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className={`${cardClass} p-6 md:col-span-2`}>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-2xl font-bold flex items-center justify-center shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold">{currentUser.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {info.map((item) => (
              <div
                key={item.label}
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  isDark ? 'bg-gray-900' : 'bg-gray-50'
                }`}
              >
                <span className="text-primary mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className="font-semibold text-sm break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={logout}
            className="mt-6 flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-danger border border-danger rounded-full hover:bg-danger hover:text-white transition-colors"
          >
            <FaRightFromBracket />
            Log Out
          </button>
        </div>

        {/* Orders summary */}
        <div className="space-y-4">
          <Link to="/orders" className={`${cardClass} p-6 block hover:shadow-lg transition-shadow`}>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary text-xl flex items-center justify-center mb-3">
              <FaBasketShopping />
            </div>
            <h3 className="font-bold">My Orders</h3>
            <p className="text-2xl font-extrabold text-primary mt-1">
              {(currentUser.orders || []).length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentUser.orders?.length === 0
                ? 'No orders yet — start shopping!'
                : 'View your order history →'}
            </p>
          </Link>

          <Link to="/products" className={`${cardClass} p-6 block hover:shadow-lg transition-shadow`}>
            <h3 className="font-bold">Continue Shopping</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Browse our catalog and find something you'll love →</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;