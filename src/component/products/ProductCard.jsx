import React from 'react';
import { FaStar, FaStarHalfStroke, FaRegStar, FaHeart, FaCartPlus } from 'react-icons/fa6';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/format';
import SafeImage from '../common/SafeImage';

const StarRating = ({ rating = 0, size = 'text-sm' }) => {
  return (
    <div className={`flex items-center gap-0.5 ${size}`} aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (rating >= i) return <FaStar key={i} className="text-secondary" />;
        if (rating >= i - 0.5) return <FaStarHalfStroke key={i} className="text-secondary" />;
        return <FaRegStar key={i} className="text-gray-300 dark:text-gray-600" />;
      })}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <SafeImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        <button
          onClick={() => addToCart(product)}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl py-2.5 text-sm font-semibold opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          aria-label={`Add ${product.name} to cart`}
        >
          <FaCartPlus />
          Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-primary uppercase tracking-wide font-semibold">
            {product.brand}
          </span>
          <button
            className="text-gray-300 hover:text-danger transition-colors"
            aria-label={`Add ${product.name} to wishlist`}
          >
            <FaHeart />
          </button>
        </div>
        <h3 className="font-semibold text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <StarRating rating={product.rating} size="text-xs" />
          <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-primary">{formatINR(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">{formatINR(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
export { StarRating };