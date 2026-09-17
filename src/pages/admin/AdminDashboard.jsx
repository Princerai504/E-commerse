import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/format';
import { statusStyles, getOrderStatus } from '../../utils/orderStatus';
import {
  FaBasketShopping,
  FaIndianRupeeSign,
  FaBoxOpen,
  FaTriangleExclamation,
} from 'react-icons/fa6';

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const { products } = useProducts();
  const { users } = useAuth();
  const isDark = theme === 'dark';

  const allOrders = users.flatMap((u) =>
    (u.orders || []).map((o) => ({ ...o, customerName: u.name, customerEmail: u.email }))
  );
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStock = products.filter((p) => p.stock <= 10);
  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const cardClass = `rounded-2xl border p-6 transition-colors ${
    isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
  }`;

  const stats = [
    {
      label: 'Total Orders',
      value: allOrders.length,
      icon: <FaBasketShopping />,
      color: 'text-primary',
    },
    {
      label: 'Revenue',
      value: formatINR(totalRevenue),
      icon: <FaIndianRupeeSign />,
      color: 'text-accent',
    },
    {
      label: 'Products',
      value: products.length,
      icon: <FaBoxOpen />,
      color: 'text-secondary',
    },
    {
      label: 'Low Stock',
      value: lowStock.length,
      icon: <FaTriangleExclamation />,
      color: 'text-danger',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={cardClass}>
            <div className={`text-3xl mb-3 ${stat.color}`}>{stat.icon}</div>
            <p className="text-2xl font-extrabold">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary font-semibold hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
              No orders placed yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div
                  key={o.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl ${
                    isDark ? 'bg-gray-900' : 'bg-gray-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      #{o.id} · {o.customerName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {new Date(o.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {' · '}
                      {o.items.length} item{o.items.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold">{formatINR(o.total)}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        statusStyles[getOrderStatus(o)] || 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {getOrderStatus(o)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h2 className="font-bold text-lg mb-4">Low Stock Alerts</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-accent py-8 text-center">
              ✓ All products have sufficient stock.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl ${
                    isDark ? 'bg-gray-900' : 'bg-gray-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.brand}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-bold text-sm ${p.stock === 0 ? 'text-danger' : 'text-secondary'}`}
                    >
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                    </span>
                    <Link
                      to="/admin/products"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5">
            <Link
              to="/admin/products/new"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              + Add New Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;