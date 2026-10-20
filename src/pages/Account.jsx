import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ShieldCheck, ClipboardList } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { formatDate, formatPrice } from '../utils/format.js';

export default function Account() {
  useDocumentTitle('Mon compte');
  const [orders] = useLocalStorage('pf_orders_v1', []);
  return (
    <div className="container page">
      <header className="page-head"><h1>Mon compte</h1><p>La connexion client n’est pas activée : vos favoris, votre panier et vos commandes sont conservés sur cet appareil.</p></header>
      <div className="account-links">
        <Link to="/favoris"><Heart size={22} /><span>Mes favoris</span></Link>
        <Link to="/panier"><ShoppingBag size={22} /><span>Mon panier</span></Link>
        <Link to="/admin"><ShieldCheck size={22} /><span>Espace administrateur</span></Link>
      </div>
      <section className="section section--tight">
        <h2 className="h3"><ClipboardList size={20} /> Mes commandes sur cet appareil</h2>
        {orders.length === 0 ? <p className="muted">Aucune commande envoyée pour le moment.</p> : (
          <ul className="order-list">
            {orders.map((o) => (
              <li key={o.id}><div><strong>{o.id}</strong><span className="muted">{formatDate(o.createdAt)}</span></div><span>{o.lines.reduce((s, l) => s + l.qty, 0)} article(s)</span><strong>{formatPrice(o.total)}</strong></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
