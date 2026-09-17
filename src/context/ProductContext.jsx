import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { products as seedProducts, categories } from '../data/products';

export const ProductContext = createContext();

const STORAGE_KEY = 'shopease_products';

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
};

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => readStored() || seedProducts);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
      } catch {
        // ignore storage quota errors
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore storage quota errors
    }
  }, [products]);

  const addProduct = useCallback((data) => {
    setProducts((prev) => {
      const nextId = prev.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;
      const image = data.image || '/images/products/placeholder.svg';
      const entry = {
        id: nextId,
        name: data.name,
        brand: data.brand,
        price: Number(data.price) || 0,
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
        category: data.category,
        rating: Number(data.rating) || 4.0,
        reviews: 0,
        stock: Number(data.stock) || 0,
        description: data.description || '',
        features: Array.isArray(data.features) ? data.features : [],
        image,
        gallery:
          Array.isArray(data.gallery) && data.gallery.length ? data.gallery : [image],
        featured: Boolean(data.featured),
        createdAt: new Date().toISOString().split('T')[0],
      };
      return [entry, ...prev];
    });
  }, []);

  const updateProduct = useCallback((id, data) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === Number(id) ? { ...p, ...data } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
  }, []);

  const updateStock = useCallback((id, quantity) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === Number(id) ? { ...p, stock: Math.max(0, Number(quantity) || 0) } : p
      )
    );
  }, []);

  const value = useMemo(
    () => ({ products, categories, addProduct, updateProduct, deleteProduct, updateStock }),
    [products, addProduct, updateProduct, deleteProduct, updateStock]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductProvider;