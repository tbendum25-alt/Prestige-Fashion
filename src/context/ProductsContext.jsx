import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { SEED_PRODUCTS } from '../data/products.js';

const ProductsContext = createContext(null);
export const useProducts = () => useContext(ProductsContext);

export function ProductsProvider({ children }) {
  const [products, setProducts, storageError] = useLocalStorage('pf_products_v1', SEED_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Simule un court chargement (remplacer par un appel Supabase/API si besoin).
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const addProduct = useCallback((data) => {
    const product = { ...data, id: `p${Date.now().toString(36)}`, createdAt: Date.now() };
    setProducts((prev) => [product, ...prev]);
    return product;
  }, [setProducts]);

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, [setProducts]);

  const removeProduct = useCallback((id) => setProducts((prev) => prev.filter((p) => p.id !== id)), [setProducts]);
  const resetProducts = useCallback(() => setProducts(SEED_PRODUCTS), [setProducts]);

  const value = useMemo(
    () => ({ products, loading, storageError, addProduct, updateProduct, removeProduct, resetProducts }),
    [products, loading, storageError, addProduct, updateProduct, removeProduct, resetProducts],
  );
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
