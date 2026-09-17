import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruckFast, FaShieldHalved, FaHeadset, FaRotateLeft } from 'react-icons/fa6';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaTruckFast />,
      title: 'Free & Fast Shipping',
      desc: 'Get your order delivered within 2-4 days. Free shipping on orders over ₹4,999.',
    },
    {
      icon: <FaShieldHalved />,
      title: 'Secure Payments',
      desc: 'Shop with confidence. All transactions are encrypted and fully protected.',
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Customer Support',
      desc: 'Our support team is always available to help you with any questions.',
    },
    {
      icon: <FaRotateLeft />,
      title: 'Easy 30-Day Returns',
      desc: 'Not satisfied? Return any item within 30 days for a full refund, no questions asked.',
    },
  ];

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">
          Why Choose <span className="text-primary">ShopEase?</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          We make online shopping simple, safe and enjoyable
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white text-2xl flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div className="mt-16 rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-purple-950 text-white p-10 md:p-14 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Ready to Start Shopping?
          </h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto">
            Join thousands of happy customers. Browse our catalog and discover amazing
            products at prices you'll love.
          </p>
          <Link
            to="/products"
            className="inline-block bg-secondary text-white font-bold px-10 py-4 rounded-full hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Browse Products
          </Link>
        </div>
        <div className="absolute right-10 bottom-0 text-[8rem] opacity-20 rotate-12" aria-hidden>
          🛒
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;