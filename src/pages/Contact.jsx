import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaCircleCheck,
} from 'react-icons/fa6';

const Contact = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    else if (form.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
    isDark
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  }`;
  const inputErrorClass = 'border-danger focus:ring-danger';

  const contactInfo = [
    {
      icon: <FaLocationDot />,
      label: 'Our Address',
      value: '123 Commerce Street, Market City, MC 10001',
    },
    {
      icon: <FaPhone />,
      label: 'Call Us',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: <FaEnvelope />,
      label: 'Email Us',
      value: 'support@shopease.com',
      href: 'mailto:support@shopease.com',
    },
    {
      icon: <FaClock />,
      label: 'Working Hours',
      value: 'Mon – Fri: 9:00 AM – 8:00 PM EST',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">Contact</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Have a question about an order, a product, or something else? We'd love to hear
          from you. Our team typically replies within 24 hours.
        </p>
      </div>

      {/* Contact info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {contactInfo.map((info) => (
          <div
            key={info.label}
            className={`rounded-2xl p-5 border text-center hover:-translate-y-1 transition-all duration-300 ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary text-xl flex items-center justify-center mb-3">
              {info.icon}
            </div>
            <h3 className="font-bold text-sm mb-1">{info.label}</h3>
            {info.href ? (
              <a
                href={info.href}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                {info.value}
              </a>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">{info.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div
          className={`lg:col-span-3 rounded-3xl border p-6 md:p-8 transition-colors ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          <h2 className="text-xl font-bold mb-6">Send us a message</h2>

          {submitted && (
            <div className="flex items-center gap-3 bg-accent/10 text-accent px-4 py-3 rounded-xl mb-6 text-sm font-semibold animate-fade-in">
              <FaCircleCheck className="text-xl" />
              Message sent successfully! We'll get back to you within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`${inputClass} ${errors.name ? inputErrorClass : ''}`}
                />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
                />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className={`${inputClass} ${errors.subject ? inputErrorClass : ''}`}
              />
              {errors.subject && <p className="text-xs text-danger mt-1">{errors.subject}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="6"
                placeholder="Write your message here..."
                className={`${inputClass} resize-none ${errors.message ? inputErrorClass : ''}`}
              />
              {errors.message && <p className="text-xs text-danger mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-lg"
            >
              <FaPaperPlane />
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ / Info */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className={`rounded-2xl p-6 border transition-colors ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}
          >
            <h3 className="font-bold text-lg mb-3">Frequently Asked</h3>
            <div className="space-y-4">
              {[
                {
                  q: 'How long does shipping take?',
                  a: 'Standard shipping takes 2-4 business days. Express options are available at checkout.',
                },
                {
                  q: 'Can I return my order?',
                  a: 'Yes! You have 30 days to return any item in its original condition for a full refund.',
                },
                {
                  q: 'How do I track my order?',
                  a: 'You\u2019ll receive a tracking number via email once your order ships.',
                },
              ].map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="cursor-pointer text-sm font-semibold flex items-center justify-between gap-2 hover:text-primary transition-colors">
                    {faq.q}
                    <span className="text-primary group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                  </summary>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 pl-1">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <iframe
              title="Map location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.013%2C40.704%2C-73.987%2C40.718&layer=mapnik"
              className="w-full h-56 grayscale dark:invert"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;