import React, { useContext } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  FaGaugeHigh,
  FaBasketShopping,
  FaBoxOpen,
  FaPlus,
  FaRightToBracket,
} from 'react-icons/fa6';

const tabs = [
  { to: '/admin', label: 'Dashboard', icon: <FaGaugeHigh />, end: true },
  { to: '/admin/orders', label: 'Orders', icon: <FaBasketShopping />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FaBoxOpen />, end: true },
  { to: '/admin/products/new', label: 'Add Product', icon: <FaPlus />, end: true },
];

const AdminLayout = () => {
  const { theme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const isDark = theme === 'dark';

  const tabClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
      isActive
        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow'
        : isDark
          ? 'text-gray-300 hover:bg-gray-800'
          : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">Admin Panel</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Admin <span className="text-primary">Panel</span>
        </h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-danger border border-danger rounded-full hover:bg-danger hover:text-white transition-colors"
        >
          <FaRightToBracket />
          Log Out
        </button>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className={tabClass}>
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
};

export default AdminLayout;