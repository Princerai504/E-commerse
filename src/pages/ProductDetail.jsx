import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard, { StarRating } from '../component/products/ProductCard';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';
import SafeImage from '../component/common/SafeImage';
import {
  FaMinus,
  FaPlus,
  FaCartPlus,
  FaTruckFast,
  FaShieldHalved,
  FaRotateLeft,
  FaBolt,
} from 'react-icons/fa6';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const product = products.find((p) => p.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setActiveTab('description');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4" aria-hidden>😕</div>
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const categoryName = product.category;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'features', label: 'Features' },
    { id: 'reviews', label: `Reviews (${product.reviews.toLocaleString()})` },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium capitalize">{categoryName}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 aspect-square relative">
            <SafeImage
              src={product.gallery[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-secondary text-white text-sm font-bold px-3 py-1.5 rounded-full">
                -{discount}% OFF
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            {product.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                  selectedImage === i
                    ? 'border-primary'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <SafeImage src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            {product.brand}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} size="text-base" />
            <span className="text-sm text-gray-500">
              {product.rating} · {product.reviews.toLocaleString()} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-primary">
              {formatINR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatINR(product.oldPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-sm font-bold text-accent">Save {discount}%</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                product.stock > 10 ? 'bg-accent' : 'bg-secondary'
              }`}
            />
            <span className="text-sm font-medium">
              {product.stock > 10
                ? `In Stock (${product.stock} available)`
                : product.stock > 0
                  ? `Only ${product.stock} left in stock!`
                  : 'Out of stock'}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 hover:text-primary transition-colors"
                aria-label="Decrease quantity"
              >
                <FaMinus className="text-sm" />
              </button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="p-3 hover:text-primary transition-colors"
                aria-label="Increase quantity"
              >
                <FaPlus className="text-sm" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 min-w-52 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-all duration-300 ${
                product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 hover:scale-[1.02] shadow-lg'
              }`}
            >
              <FaCartPlus />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {added && (
            <div className="bg-accent text-white px-4 py-3 rounded-xl text-sm font-semibold mb-6 animate-fade-in">
              ✓ {quantity} × {product.name} added to your cart!
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            {[
              { icon: <FaTruckFast />, label: 'Free Shipping', sub: 'Orders ₹4,999+' },
              { icon: <FaShieldHalved />, label: 'Secure Payment', sub: '100% protected' },
              { icon: <FaRotateLeft />, label: 'Easy Returns', sub: '30-day guarantee' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="text-primary text-xl">{b.icon}</span>
                <span className="text-xs font-semibold">{b.label}</span>
                <span className="text-[11px] opacity-60">{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                {product.description}
              </p>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
                Experience quality and value with this {product.brand} product. Crafted with
                attention to detail and built to last, it's designed to exceed your expectations
                in both form and function. Whether you're a first-time buyer or a loyal customer,
                this is a smart addition to your collection.
              </p>
            </div>
          )}
          {activeTab === 'features' && (
            <ul className="grid sm:grid-cols-2 gap-3">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaBolt className="text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-primary">{product.rating}</div>
                <StarRating rating={product.rating} size="text-sm" />
                <p className="text-sm text-gray-500 mt-1">
                  Based on {product.reviews.toLocaleString()} reviews
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Customers love this product! They praise the quality, value for money, and
                  prompt delivery. Highly rated across all categories including build quality,
                  design and performance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            You May Also <span className="text-primary">Like</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="block"
              >
                <ProductCard product={relatedProduct} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;