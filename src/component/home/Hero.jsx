import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTruckFast, FaShieldHalved, FaHeadset, FaRotateLeft } from 'react-icons/fa6';

const slides = [
  {
    badge: 'New Season Sale',
    title: 'Summer Collection 2026',
    subtitle: 'Up to 50% off on top brands',
    cta: 'Shop Now',
    gradient: 'from-primary via-primary-dark to-purple-950',
    emoji: '🛍️',
  },
  {
    badge: 'Tech Deals',
    title: 'Gadgets That Delight',
    subtitle: 'Latest electronics at unbeatable prices',
    cta: 'Explore Electronics',
    gradient: 'from-secondary via-amber-600 to-orange-800',
    emoji: '📱',
  },
  {
    badge: 'Free Shipping',
    title: 'Home & Living Essentials',
    subtitle: 'Free shipping on orders over ₹4,999',
    cta: 'Shop Home',
    gradient: 'from-accent via-emerald-600 to-teal-800',
    emoji: '🏠',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden" aria-label="Promotions">
      <div className={`bg-gradient-to-r ${slide.gradient} text-white transition-all duration-700`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left animate-fade-in">
            <span className="inline-block bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow">
              {slide.title}
            </h1>
            <p className="text-white/90 text-lg mb-8">{slide.subtitle}</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {slide.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="flex-1 text-center">
            <div className="text-[10rem] md:text-[14rem] leading-none drop-shadow-2xl animate-float" aria-hidden>
              {slide.emoji}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-white transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-white transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Benefits bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <FaTruckFast className="text-primary" />, label: 'Free Shipping', sub: 'On orders ₹4,999+' },
            { icon: <FaShieldHalved className="text-primary" />, label: 'Secure Payment', sub: '100% protected' },
            { icon: <FaHeadset className="text-primary" />, label: '24/7 Support', sub: 'We are always here' },
            { icon: <FaRotateLeft className="text-primary" />, label: 'Easy Returns', sub: '30-day guarantee' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary text-xl">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs opacity-60">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;