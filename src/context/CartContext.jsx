import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { useProducts } from './ProductsContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { products } = useProducts();
  const toast = useToast();
  const [items, setItems] = useLocalStorage('pf_cart_v1', []);

  // Associe chaque ligne à son produit actuel (prix et stock toujours à jour).
  const lines = useMemo(
    () => items.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((l) => l.product),
    [items, products],
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.product.price, 0);

  const qtyOfProduct = useCallback((id) => items.filter((i) => i.id === id).reduce((s, i) => s + i.qty, 0), [items]);

  const addItem = useCallback((product, { size, color, qty = 1 }) => {
    if (product.stock <= 0) { toast('Ce produit est épuisé.', 'error'); return false; }
    if (qtyOfProduct(product.id) + qty > product.stock) {
      toast(`Stock limité : ${product.stock} pièce(s) disponible(s).`, 'error');
      return false;
    }
    const key = `${product.id}|${size}|${color}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      return found
        ? prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { key, id: product.id, size, color, qty }];
    });
    toast(`« ${product.name} » ajouté au panier.`);
    return true;
  }, [qtyOfProduct, setItems, toast]);

  const setQty = useCallback((key, qty) => {
    const line = lines.find((l) => l.key === key);
    if (!line) return;
    const others = qtyOfProduct(line.id) - line.qty;
    if (qty > line.product.stock - others) { toast(`Stock limité : ${line.product.stock} pièce(s).`, 'error'); return; }
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  }, [lines, qtyOfProduct, setItems, toast]);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
    toast('Article retiré du panier.');
  }, [setItems, toast]);

  const clear = useCallback(() => setItems([]), [setItems]);

  const value = useMemo(
    () => ({ lines, count, total, addItem, setQty, removeItem, clear, qtyOfProduct }),
    [lines, count, total, addItem, setQty, removeItem, clear, qtyOfProduct],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
