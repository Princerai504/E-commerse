import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useProducts } from '../../context/ProductContext';
import { categories } from '../../data/products';
import SafeImage from '../../component/common/SafeImage';
import { uploadImage } from '../../utils/cloudinary';
import { FaArrowLeft, FaUpload, FaSpinner } from 'react-icons/fa6';

const MAX_UPLOAD_BYTES = 10 * 1000 * 1000;

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { products, addProduct, updateProduct } = useProducts();
  const isDark = theme === 'dark';

  const editing = Boolean(id);
  const existing = editing ? products.find((p) => p.id === Number(id)) : null;

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: 'electronics',
    price: '',
    oldPrice: '',
    stock: '',
    rating: '4.0',
    description: '',
    features: '',
    image: '',
    featured: true,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || '',
        brand: existing.brand || '',
        category: existing.category || 'electronics',
        price: existing.price || '',
        oldPrice: existing.oldPrice || '',
        stock: existing.stock || '',
        rating: existing.rating || '4.0',
        description: existing.description || '',
        features: (existing.features || []).join('\n'),
        image: existing.image || '',
        featured: Boolean(existing.featured),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  if (editing && !existing) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-6xl mb-4" aria-hidden>😕</div>
        <h3 className="text-xl font-bold mb-2">Product not found</h3>
        <Link
          to="/admin/products"
          className="inline-block px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setApiError('');
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setApiError('Image is too large: maximum 10 MB. Try a smaller file or paste a URL instead.');
      return;
    }
    setUploading(true);
    setApiError('');
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setApiError(err.message || 'Failed to upload image to Cloudinary.');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    else if (form.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.price || Number(form.price) <= 0)
      newErrors.price = 'Enter a valid price greater than 0';
    if (form.oldPrice && Number(form.oldPrice) <= 0)
      newErrors.oldPrice = 'Old price must be greater than 0';
    if (!form.stock || Number(form.stock) < 0)
      newErrors.stock = 'Enter a valid stock quantity (0 or more)';
    if (!form.description.trim() || form.description.trim().length < 10)
      newErrors.description = 'Description must be at least 10 characters';
    if (!form.image.trim()) newErrors.image = 'Provide an image URL or upload a file';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const image = form.image.trim();
    const features = form.features
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
      rating: Number(form.rating) || 4.0,
      description: form.description.trim(),
      features,
      image,
      gallery: [image],
      featured: form.featured,
    };

    if (editing) {
      updateProduct(id, payload);
    } else {
      addProduct(payload);
    }
    navigate('/admin/products');
  };

  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
    isDark
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  }`;

  const errorClass = 'border-danger focus:ring-danger';

  const panelClass = `rounded-2xl border p-6 transition-colors ${
    isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
  }`;

  return (
    <div className="space-y-6">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
      >
        <FaArrowLeft />
        Back to Products
      </Link>

      <h2 className="text-xl md:text-2xl font-bold">
        {editing ? 'Edit' : 'Add New'} <span className="text-primary">Product</span>
      </h2>

      {apiError && (
        <div className="bg-danger/10 text-danger px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className={`${panelClass} lg:col-span-2 space-y-5`}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium">
                  Product Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Wireless Bluetooth Headphones"
                  className={`${inputClass} ${errors.name ? errorClass : ''}`}
                />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="brand" className="block text-sm font-medium">
                  Brand
                </label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Sonix"
                  className={`${inputClass} ${errors.brand ? errorClass : ''}`}
                />
                {errors.brand && <p className="text-xs text-danger mt-1">{errors.brand}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="rating" className="block text-sm font-medium">
                  Initial Rating (0–5)
                </label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price (₹)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="10799"
                  className={`${inputClass} ${errors.price ? errorClass : ''}`}
                />
                {errors.price && <p className="text-xs text-danger mt-1">{errors.price}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="oldPrice" className="block text-sm font-medium">
                  Old Price (₹) — optional
                </label>
                <input
                  id="oldPrice"
                  name="oldPrice"
                  type="number"
                  min="0"
                  step="1"
                  value={form.oldPrice}
                  onChange={handleChange}
                  placeholder="14999"
                  className={`${inputClass} ${errors.oldPrice ? errorClass : ''}`}
                />
                {errors.oldPrice && <p className="text-xs text-danger mt-1">{errors.oldPrice}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="stock" className="block text-sm font-medium">
                  Stock Quantity
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="25"
                  className={`${inputClass} ${errors.stock ? errorClass : ''}`}
                />
                {errors.stock && <p className="text-xs text-danger mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product, its quality and what makes it special..."
                className={`${inputClass} resize-none ${errors.description ? errorClass : ''}`}
              />
              {errors.description && (
                <p className="text-xs text-danger mt-1">{errors.description}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="features" className="block text-sm font-medium">
                Features (one per line)
              </label>
              <textarea
                id="features"
                name="features"
                rows="4"
                value={form.features}
                onChange={handleChange}
                placeholder={'Active Noise Cancellation\n30-hour battery life\nBluetooth 5.3'}
                className={`${inputClass} resize-none`}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium">Show in Featured Products on homepage</span>
            </label>
          </div>

          <div className={`${panelClass} space-y-5`}>
            <div className="space-y-1.5">
              <label htmlFor="image" className="block text-sm font-medium">
                Main Image
              </label>
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 aspect-square">
                <SafeImage
                  src={form.image}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 mt-3">
                <input
                  id="image"
                  name="image"
                  type="url"
                  value={form.image.startsWith('data:') ? '' : form.image}
                  onChange={handleChange}
                  placeholder="Paste an image URL..."
                  className={inputClass}
                />
                <div>
                  <label
                    htmlFor="imageUpload"
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer transition-colors ${
                      uploading ? 'opacity-60 pointer-events-none' : ''
                    } ${
                      isDark
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {uploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                    {uploading ? 'Uploading…' : 'Upload from computer'}
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Max 10 MB per file. Images are uploaded to Cloudinary and served from its CDN.
                  </p>
                </div>
              </div>
              {errors.image && <p className="text-xs text-danger mt-1">{errors.image}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            {editing ? 'Save Changes' : 'Add Product'}
          </button>
          <Link
            to="/admin/products"
            className={`px-8 py-3.5 rounded-full font-semibold border transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;