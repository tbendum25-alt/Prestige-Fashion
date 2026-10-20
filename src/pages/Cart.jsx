import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import SafeImage from '../components/SafeImage.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/format.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function Cart() {
  useDocumentTitle('Panier');
  const { lines, total, count, setQty, removeItem, clear } = useCart();

  if (lines.length === 0) {
    return <div className="container page"><EmptyState icon={ShoppingBag} title="Votre panier est vide" text="Parcourez la collection et ajoutez vos articles préférés." actionLabel="Découvrir la collection" to="/catalogue" /></div>;
  }

  return (
    <div className="container page">
      <header className="page-head"><h1>Mon panier</h1><p>{count} article{count > 1 ? 's' : ''}</p></header>
      <div className="cart">
        <ul className="cart__lines">
          {lines.map((l) => (
            <li key={l.key} className="cart-line">
              <Link to={`/produit/${l.product.id}`} className="cart-line__img"><SafeImage src={l.product.images[0]} alt={l.product.name} /></Link>
              <div className="cart-line__info">
                <h3><Link to={`/produit/${l.product.id}`}>{l.product.name}</Link></h3>
                <p className="muted">Taille {l.size} · {l.color}</p>
                <p className="price"><strong>{formatPrice(l.product.price)}</strong></p>
              </div>
              <QuantityStepper value={l.qty} onChange={(q) => setQty(l.key, q)} max={l.product.stock} />
              <p className="cart-line__total">{formatPrice(l.qty * l.product.price)}</p>
              <button type="button" className="icon-btn" onClick={() => removeItem(l.key)} aria-label={`Retirer ${l.product.name}`}><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
        <aside className="summary">
          <h2>Récapitulatif</h2>
          <dl>
            <div><dt>Sous-total</dt><dd>{formatPrice(total)}</dd></div>
            <div><dt>Livraison</dt><dd>Confirmée par WhatsApp</dd></div>
            <div className="summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <Link to="/commande" className="btn btn--dark btn--block">Passer la commande</Link>
          <Link to="/catalogue" className="btn btn--outline btn--block">Continuer mes achats</Link>
          <button type="button" className="link-underline summary__clear" onClick={clear}>Vider le panier</button>
        </aside>
      </div>
    </div>
  );
}
