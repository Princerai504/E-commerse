import React, { useContext, useMemo, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/format';
import { ORDER_STATUSES, statusStyles, getOrderStatus } from '../../utils/orderStatus';
import SafeImage from '../../component/common/SafeImage';

const AdminOrders = () => {
  const { theme } = useContext(ThemeContext);
  const { users, updateOrderStatus } = useAuth();
  const isDark = theme === 'dark';

  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  const allOrders = useMemo(
    () =>
      users
        .flatMap((u) =>
          (u.orders || []).map((o) => ({
            ...o,
            customerName: u.name,
            customerEmail: u.email,
          }))
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [users]
  );

  const filtered = allOrders.filter((o) => {
    const status = getOrderStatus(o);
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!`${o.id}`.includes(q) && !o.customerName.toLowerCase().includes(q) && !o.customerEmail.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const panelClass = `rounded-2xl border overflow-hidden transition-colors ${
    isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
  }`;

  const inputClass = `px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
    isDark
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID or customer..."
          className={`${inputClass} flex-1 min-w-60`}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputClass}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} order{filtered.length === 1 ? '' : 's'} found
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4" aria-hidden>📦</div>
          <h3 className="text-xl font-bold mb-2">No orders found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try a different search or status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((o) => {
            const status = getOrderStatus(o);
            return (
              <div key={o.id} className={panelClass}>
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Order ID</p>
                      <p className="font-semibold text-sm">#{o.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                      <p className="font-semibold text-sm">{o.customerName}</p>
                      <p className="text-xs text-gray-500">{o.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Placed on</p>
                      <p className="font-semibold text-sm">
                        {new Date(o.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                      <p className="font-semibold text-primary">{formatINR(o.total)}</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
                    <select
                      value={status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-primary cursor-pointer ${
                        statusStyles[status] || 'bg-gray-200 text-gray-600'
                      } ${isDark ? 'bg-gray-800' : ''}`}
                      aria-label={`Update status for order ${o.id}`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s} className={isDark ? 'bg-gray-900' : 'bg-white'}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="px-5 py-4 space-y-3">
                  {o.items.map((item) => (
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

export default AdminOrders;