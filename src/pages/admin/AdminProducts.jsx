import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useProducts } from '../../context/ProductContext';
import { formatINR } from '../../utils/format';
import SafeImage from '../../component/common/SafeImage';
import {
  FaPlus,
  FaMinus,
  FaTrashCan,
  FaPenToSquare,
  FaXmark,
} from 'react-icons/fa6';

const AdminProducts = () => {
  const { theme } = useContext(ThemeContext);
  const { products, updateStock, deleteProduct } = useProducts();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const isDark = theme === 'dark';

  const panelClass = `rounded-2xl border transition-colors ${
    isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
  }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {products.length} products in catalog · stock edits save instantly
        </p>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
        >
          <FaPlus />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className={`${panelClass} p-4`}>
            <div className="flex gap-4">
              <SafeImage
                src={p.image}
                alt={p.name}
                className="w-20 h-20 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold line-clamp-1">{p.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {p.brand} · {p.category}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-bold text-primary">{formatINR(p.price)}</span>
                  {p.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatINR(p.oldPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Stock:</span>
                <button
                  onClick={() => updateStock(p.id, p.stock - 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                    isDark
                      ? 'border-gray-600 hover:bg-gray-700'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  aria-label={`Decrease stock for ${p.name}`}
                >
                  <FaMinus className="text-xs" />
                </button>
                <span
                  className={`w-12 text-center font-bold text-sm ${
                    p.stock === 0 ? 'text-danger' : ''
                  }`}
                >
                  {p.stock}
                </span>
                <button
                  onClick={() => updateStock(p.id, p.stock + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                    isDark
                      ? 'border-gray-600 hover:bg-gray-700'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  aria-label={`Increase stock for ${p.name}`}
                >
                  <FaPlus className="text-xs" />
                </button>

                <input
                  type="number"
                  min="0"
                  defaultValue={p.stock}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (!Number.isNaN(val) && val !== p.stock) updateStock(p.id, val);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.target.blur();
                  }}
                  className={`w-16 px-2 py-1 rounded-lg border text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    isDark
                      ? 'bg-gray-900 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  aria-label={`Set stock for ${p.name}`}
                />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/products/${p.id}/edit`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaPenToSquare />
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-danger border border-danger hover:bg-danger hover:text-white transition-colors"
                >
                  <FaTrashCan />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div
            className={`relative w-full max-w-sm rounded-2xl border p-6 transition-colors ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}
          >
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close confirmation"
            >
              <FaXmark className="text-lg" />
            </button>
            <h3 className="text-lg font-bold mb-2">Delete product?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              "{deleteTarget.name}" will be permanently removed from the catalog. This cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className={`flex-1 px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                  isDark
                    ? 'border-gray-600 hover:bg-gray-700'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-semibold bg-danger text-white hover:opacity-90 transition-opacity"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;