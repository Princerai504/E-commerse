import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categories, priceRanges } from '../data/products';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../component/products/ProductCard';
import { FaMagnifyingGlass, FaSliders, FaXmark } from 'react-icons/fa6';

const sortOptions = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'newest', label: 'Newest' },
];

const Products = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [search, setSearch] = useState(initialSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const query = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearch(query);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    const range = priceRanges.find((r) => r.id === selectedPrice);
    if (range && range.id !== 'all') {
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    if (selectedRating > 0) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [products, selectedCategory, selectedPrice, selectedRating, sortBy, search]);

  const updateCategory = (cat) => {
    setSelectedCategory(cat);
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedPrice('all');
    setSelectedRating(0);
    setSortBy('popular');
    setSearch('');
    setSearchParams({}, { replace: true });
  };

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedPrice !== 'all',
    selectedRating > 0,
  ].filter(Boolean).length;

  const FilterContent = (
    <>
      {/* Category */}
      <div>
        <h3 className="font-bold mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateCategory('all')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateCategory(cat.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Price */}
      <div>
        <h3 className="font-bold mb-3">Price</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedPrice === range.id ? 'text-primary font-semibold' : ''
              }`}
            >
              <input
                type="radio"
                name="price"
                checked={selectedPrice === range.id}
                onChange={() => setSelectedPrice(range.id)}
                className="w-4 h-4 accent-primary"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Rating */}
      <div>
        <h3 className="font-bold mb-3">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedRating === rating
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {'★'.repeat(rating)}
              <span className="opacity-60"> & up</span>
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 text-sm font-semibold text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition-colors"
        >
          Clear Filters ({activeFilterCount})
        </button>
      )}
    </>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-2" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">Products</span>
        </nav>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold">
            All <span className="text-primary">Products</span>
          </h1>
          <span className="text-sm text-gray-500">{filteredProducts.length} items</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => setFiltersOpen((prev) => !prev)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium hover:border-primary transition-colors"
        >
          <FaSliders />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-danger transition-colors"
                aria-label="Clear search"
              >
                <FaXmark />
              </button>
            )}
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Sort products"
        >
          {sortOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-5">
            {FilterContent}
          </div>
        </aside>

        {/* Mobile filters */}
        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl overflow-y-auto p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close filters"
                >
                  <FaXmark className="text-xl" />
                </button>
              </div>
              {FilterContent}
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4" aria-hidden>🔍</div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={clearFilters}
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="block">
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;