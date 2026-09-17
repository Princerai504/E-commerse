import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import { IoMdSearch } from 'react-icons/io';
import { FaCartShopping, FaBars, FaXmark, FaHeart, FaUser, FaRightToBracket, FaBasketShopping, FaUserShield } from 'react-icons/fa6';
import DarkMode from './DarkMode';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const { theme } = useContext(ThemeContext);
  const { cartCount, setIsCartOpen } = useCart();
  const { currentUser, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isDark = theme === 'dark';
  const links = isAdmin
    ? [...navLinks, { name: 'Admin', path: '/admin' }]
    : navLinks;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary dark:text-primary-light font-semibold'
        : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 shrink-0">
              <img src={logo} alt="ShopEase logo" className="h-9 w-auto" />
              <span className="font-bold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ShopEase
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <NavLink key={link.path} to={link.path} end={link.path === '/'} className={linkClass}>
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:block relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={`block w-56 xl:w-72 pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  <IoMdSearch className="text-lg" />
                </button>
              </form>

              {/* Account Button */}
              {currentUser ? (
                <button
                  onClick={() => navigate('/account')}
                  className={`p-1.5 rounded-full transition-colors shrink-0 ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  aria-label="My account"
                  title="My account"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-bold flex items-center justify-center">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                    isDark
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  aria-label="Sign in"
                >
                  <FaRightToBracket />
                  Sign In
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2.5 rounded-full transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                aria-label={`Open cart (${cartCount} items)`}
              >
                <FaCartShopping className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 flex items-center justify-center bg-secondary text-white text-xs font-bold rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <DarkMode />

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className={`md:hidden p-2 rounded-md transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <FaXmark className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div
            className={`absolute right-0 top-0 h-full w-72 shadow-xl transition-transform duration-300 ${
              isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ShopEase
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className={`p-2 rounded-md ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                aria-label="Close menu"
              >
                <FaXmark className="text-xl" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative px-4 py-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className={`block w-full pl-10 pr-4 py-2.5 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute left-8 top-1/2 translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <IoMdSearch className="text-lg" />
              </button>
            </form>

            {/* User section */}
            {currentUser ? (
              <div className="px-4 pb-2">
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl mb-1 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}
                >
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-bold flex items-center justify-center shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/account');
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-full transition-colors ${
                      isDark
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <FaUser />
                    Account
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/orders');
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-full transition-colors ${
                      isDark
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
<FaBasketShopping />
                  My Orders
                  </button>
                </div>
                {isAdmin && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        navigate('/admin');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <FaUserShield />
                      Admin Panel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 pb-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-90 transition-opacity"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/register');
                  }}
                  className="w-full mt-2 py-2.5 text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-700 hover:border-primary transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="px-4 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:text-primary-light font-semibold'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  {link.path === '/admin' && <FaUserShield className="text-primary" />}
                </NavLink>
              ))}
            </div>

            {/* Mobile Cart */}
            <div className="px-4 py-4 mt-2 border-t border-gray-200 dark:border-gray-800 flex gap-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsCartOpen(true);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${
                  isDark
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <FaCartShopping />
                Cart ({cartCount})
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${
                  isDark
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <FaHeart />
                Wishlist
              </button>
            </div>

            {currentUser && (
              <div className="px-4 pb-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-danger border border-danger rounded-full hover:bg-danger hover:text-white transition-colors"
                >
                  <FaRightToBracket />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;