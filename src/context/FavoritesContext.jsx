import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { useProducts } from './ProductsContext.jsx';
import { useToast } from './ToastContext.jsx';

const FavoritesContext = createContext(null);
export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({ children }) {
  const { products } = useProducts();
  const toast = useToast();
  const [ids, setIds] = useLocalStorage('pf_favorites_v1', []);

  const favorites = useMemo(() => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean), [ids, products]);
  const isFavorite = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback((product) => {
    const exists = ids.includes(product.id);
    setIds((prev) => (exists ? prev.filter((x) => x !== product.id) : [product.id, ...prev]));
    toast(exists ? 'Retiré des favoris.' : `« ${product.name} » ajouté aux favoris.`);
  }, [ids, setIds, toast]);

  const value = useMemo(
    () => ({ favorites, count: favorites.length, isFavorite, toggle }),
    [favorites, isFavorite, toggle],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
