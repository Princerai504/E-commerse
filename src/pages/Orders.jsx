import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { formatINR } from '../utils/format';
import { statusStyles, getOrderStatus } from '../utils/orderStatus';
import SafeImage from '../component/common/SafeImage';
import { FaCircleCheck } from 'react-icons/fa6';

const Orders = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useAuth();
  const isDark = theme === 'dark';

  if (!currentUser) return null;

  const orders = currentUser.orders || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/account" className="hover:text-primary transition-colors">Account</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">My Orders</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Order <span className="text-primary">History</span>
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4" aria-hidden>📦</div>
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            When you place an order, it will show up here with live status updates.
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-full hover:opacity-90 hover:scale-105 transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = getOrderStatus(order);
            return (
              <div
                key={order.id}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="font-semibold text-sm">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Placed on</p>
                    <p className="font-semibold text-sm">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                    <p className="font-semibold text-primary">{formatINR(order.total)}</p>
                  </div>
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      statusStyles[status] || 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <FaCircleCheck />
                    {status}
                  </span>
                </div>

                {/* Order items */}
                <div className="px-5 py-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatINR(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;