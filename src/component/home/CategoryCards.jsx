import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/products';

const categoryEmojis = {
  electronics: '📱',
  fashion: '👕',
  home: '🏠',
  accessories: '⌚',
  books: '📚',
  sports: '⚽',
};

const CategoryCards = () => {
  return (
    <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {categoryEmojis[cat.id] || '🛍️'}
              </div>
              <span className="font-semibold text-sm text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;