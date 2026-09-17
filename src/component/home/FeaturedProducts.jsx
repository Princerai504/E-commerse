import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
import { useProducts } from '../../context/ProductContext';

const FeaturedProducts = () => {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Hand-picked bestsellers just for you
          </p>
        </div>
        <Link
          to="/products"
          className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
        >
          View All
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="block">
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;