import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { formatINR, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../utils/format';
import SafeImage from '../component/common/SafeImage';
import { FaTrashCan, FaPlus, FaMinus, FaBolt } from 'react-icons/fa6';

const Cart = () => {
  const { theme } = useContext(ThemeContext);
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { currentUser, saveOrder } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const isDark = theme === 'dark';

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount + shipping;

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.toUpperCase();
    if (code === 'SAVE10') {
      setAppliedPromo(code);
      setPromoError('');
      setPromoCode('');
    } else {
      setAppliedPromo(null);
      setPromoError('Invalid promo code. Try "SAVE10".');
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    const order = {
      id: `SE${Date.now()}`,
      date: new Date().toISOString(),
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      discount,
      shipping,
      total,
    };
    saveOrder(order);
    clearCart();
    setPlacedOrderId(order.id);
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 6000);
  };

  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
    isDark
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  }`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">Cart</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Shopping <span className="text-primary">Cart</span>
        {cartItems.length > 0 && (
          <span className="text-base font-normal text-gray-500 ml-2">
            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </span>
        )}
      </h1>

      {orderPlaced && (
        <div className="bg-accent text-white px-5 py-4 rounded-xl mb-6 font-semibold animate-fade-in">
          🎉 Order <span className="underline">#{placedOrderId}</span> placed successfully!
          {currentUser && (
            <Link to="/orders" className="ml-2 underline underline-offset-2 hover:opacity-80">
              View order history →
            </Link>
          )}
        </div>
      )}

      {!currentUser && cartItems.length > 0 && (
        <div className="bg-primary/10 text-primary px-5 py-4 rounded-xl mb-6 text-sm font-medium flex items-center justify-between gap-3 flex-wrap">
          <span>Sign in to place orders and track your history.</span>
          <Link
            to="/login"
            state={{ from: '/cart' }}
            className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            Sign In
          </Link>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4" aria-hidden>🛒</div>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-full hover:opacity-90 hover:scale-105 transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 p-4 rounded-2xl border transition-colors ${
                  isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}
              >
                <Link
                  to={`/product/${item.id}`}
                  className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700"
                >
                  <SafeImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="font-semibold hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">{item.brand}</span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-danger transition-colors p-1"
                      aria-label={`Remove ${item.name}`}
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:text-primary transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:text-primary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-primary font-bold">{formatINR(item.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                to="/products"
                className="text-primary font-semibold text-sm hover:underline"
              >
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-danger font-semibold text-sm hover:underline"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-2xl border p-6 lg:sticky lg:top-24 transition-colors ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              <h2 className="text-lg font-bold mb-5">Order Summary</h2>

              {/* Promo code */}
              <form onSubmit={applyPromo} className="mb-5">
                <label htmlFor="promo" className="text-sm font-medium block mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Try SAVE10"
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-secondary text-white text-sm font-semibold rounded-lg hover:bg-secondary/90 transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-sm text-accent mt-2 flex items-center gap-1">
                    <FaBolt /> Code {appliedPromo} applied — 10% off!
                  </p>
                )}
                {promoError && (
                  <p className="text-sm text-danger mt-2">{promoError}</p>
                )}
              </form>

              <div className="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Discount (10%)</span>
                    <span className="font-semibold">-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? <span className="text-accent">Free</span> : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-primary">{formatINR(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-400 mt-3">
                  Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more to get free shipping!
                </p>
              )}

              <button
                onClick={handleCheckout}
                className="w-full mt-5 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-lg"
              >
                {currentUser ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Secure checkout · 30-day money back guarantee
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;