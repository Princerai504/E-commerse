import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { categories } from '../../data/products';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPaperPlane } from 'react-icons/fa6';
import logo from '../../assets/logo.png';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const isDark = theme === 'dark';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const socials = [
    { name: 'Facebook', icon: <FaFacebookF />, href: '#' },
    { name: 'Twitter', icon: <FaTwitter />, href: '#' },
    { name: 'Instagram', icon: <FaInstagram />, href: '#' },
    { name: 'YouTube', icon: <FaYoutube />, href: '#' },
  ];

  const footerBg = isDark
    ? 'bg-gray-950 text-gray-300'
    : 'bg-gray-100 text-gray-600';

  return (
    <footer className={`${footerBg} transition-colors duration-300`}>
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Get 10% off your first order!</h3>
            <p className="text-white/80 text-sm mt-1">
              Subscribe to our newsletter for exclusive deals and new arrivals.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-secondary text-white text-sm font-semibold rounded-full hover:bg-secondary/90 transition-colors flex items-center gap-2"
            >
              <FaPaperPlane />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="ShopEase" className="h-8 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ShopEase
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your one-stop shop for quality products at unbeatable prices. Shop
              smarter, live better with ShopEase.
            </p>
            <div className="flex gap-3 mt-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className={`p-2.5 rounded-full transition-colors ${
                    isDark
                      ? 'bg-gray-800 hover:bg-primary text-gray-300'
                      : 'bg-white hover:bg-primary hover:text-white text-gray-600 shadow-sm'
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'All Products', path: '/products' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-900 dark:text-white">
              Contact Us
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span aria-hidden>📍</span>
                <span>123 Commerce Street, Market City, MC 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden>📞</span>
                <a href="tel:+15551234567" className="hover:text-primary transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden>✉️</span>
                <a href="mailto:support@shopease.com" className="hover:text-primary transition-colors">
                  support@shopease.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Subscribe toast */}
      {subscribed && (
        <div className="fixed bottom-6 right-6 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          ✓ Subscribed! Check your inbox for a 10% off code.
        </div>
      )}
    </footer>
  );
};

export default Footer;