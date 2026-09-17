import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ThemeContext } from '../../context/ThemeContext';
import { formatINR, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../../utils/format';
import SafeImage from '../common/SafeImage';
import { FaXmark, FaTrashCan, FaPlus, FaMinus } from 'react-icons/fa6';

const CartDrawer = () => {
  const { theme } = useContext(ThemeContext);
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  if (!isCartOpen) return null;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md shadow-2xl flex flex-col transition-transform duration-300 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold">
            Shopping Cart <span className="text-primary">({cartItems.length})</span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            aria-label="Close cart"
          >
            <FaXmark className="text-xl" />
          </button>
        </div>

        {/* Items */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="text-6xl" aria-hidden>🛒</div>
            <p className="text-lg font-medium text-center">Your cart is empty</p>
            <p className="text-sm opacity-60 text-center">
              Looks like you haven't added anything yet. Let's fix that!
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/products');
              }}
              className="mt-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 p-3 rounded-xl border ${
                    isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-semibold line-clamp-1 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-danger transition-colors shrink-0"
                        aria-label={`Remove ${item.name}`}
                      >
                        <FaTrashCan className="text-sm" />
                      </button>
                    </div>
                    <div className="text-sm text-primary font-semibold mt-1">
                      {formatINR(item.price)}
                      {item.quantity > 1 && (
                        <span className="text-xs text-gray-400 font-normal"> × {item.quantity}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`p-1.5 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`p-1.5 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={`border-t p-5 border-gray-200 dark:border-gray-800`}>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="opacity-70">Subtotal</span>
                  <span className="font-semibold">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'Free' : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-full border transition-colors ${
                    isDark
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  View Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-90 transition-opacity"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;