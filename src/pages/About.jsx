import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FaHeart, FaV } from 'react-icons/fa6';

const team = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    photo: 'https://i.pravatar.cc/150?img=47',
    emoji: '👩‍💼',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Operations',
    photo: 'https://i.pravatar.cc/150?img=12',
    emoji: '👨‍💼',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    photo: 'https://i.pravatar.cc/150?img=32',
    emoji: '👩‍🔧',
  },
  {
    name: 'David Kim',
    role: 'Customer Success Lead',
    photo: 'https://i.pravatar.cc/150?img=33',
    emoji: '👨‍🚀',
  },
];

const About = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Products Sold' },
    { value: '4.8★', label: 'Average Rating' },
    { value: '100+', label: 'Global Brands' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">About</span>
      </nav>

      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-purple-950 text-white p-10 md:p-16 text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          Our Story, Our <span className="text-secondary">Promise</span>
        </h1>
        <p className="text-white/85 max-w-2xl mx-auto text-base md:text-lg">
          Since 2021, ShopEase has been on a mission to make online shopping simple,
          affordable, and delightful for everyone. From humble beginnings to a trusted
          marketplace with thousands of products, we've grown by putting our customers first.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-6 text-center border transition-colors ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div
          className={`rounded-3xl p-8 border transition-colors ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary text-2xl flex items-center justify-center mb-4">
            <FaV />
          </div>
          <h2 className="text-xl font-bold mb-3">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            We believe shopping should be a joy, not a chore. That's why we curate
            high-quality products, negotiate fair prices, and deliver fast — so you can
            spend less time searching and more time enjoying the things you love.
          </p>
        </div>
        <div
          className={`rounded-3xl p-8 border transition-colors ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent text-2xl flex items-center justify-center mb-4">
            <FaHeart />
          </div>
          <h2 className="text-xl font-bold mb-3">What We Value</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            Quality over quantity. Honesty in pricing. Sustainability in sourcing. And above
            all, an unwavering commitment to our customers. Every decision we make starts
            with one question: "Is this good for our customers?"
          </p>
        </div>
      </div>

      {/* Team */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Meet the <span className="text-primary">Team</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            The passionate people behind ShopEase
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className={`text-center rounded-2xl p-6 border hover:-translate-y-1 transition-all duration-300 ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              <img
                src={member.photo}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-primary ring-opacity-20"
              />
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-secondary to-amber-600 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Want to become part of the story?</h2>
          <p className="text-white/85">Explore our products and start shopping today!</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            to="/products"
            className="px-7 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            to="/contact"
            className="px-7 py-3 border-2 border-white/50 hover:border-white text-white font-bold rounded-full transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;