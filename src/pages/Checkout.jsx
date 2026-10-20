import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShoppingBag, CheckCircle2 } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { formatPrice } from '../utils/format.js';
import { buildOrderMessage, whatsappUrl } from '../utils/whatsapp.js';

const EMPTY = { name: '', phone: '', city: '', address: '', note: '' };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 3) e.name = 'Entrez votre nom complet (3 caractères minimum).';
  const digits = f.phone.replace(/[\s.\-()]/g, '');
  if (!/^\+?\d{8,15}$/.test(digits)) e.phone = 'Entrez un numéro valide (8 à 15 chiffres).';
  if (f.city.trim().length < 2) e.city = 'Indiquez votre ville.';
  if (f.address.trim().length < 5) e.address = 'Indiquez une adresse de livraison précise.';
  return e;
}

export default function Checkout() {
  useDocumentTitle('Commande');
  const { lines, total, clear } = useCart();
  const toast = useToast();
  const [, setOrders] = useLocalStorage('pf_orders_v1', []);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  if (done) {
    return (
      <div className="container page">
        <div className="empty">
          <CheckCircle2 size={46} strokeWidth={1.2} />
          <h3>Commande préparée</h3>
          <p>Référence <strong>{done.ref}</strong>. WhatsApp s’est ouvert avec votre message : envoyez-le pour finaliser. Si rien ne s’est ouvert, utilisez le bouton ci-dessous.</p>
          <a className="btn btn--gold" href={done.url} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Ouvrir WhatsApp</a>
          <Link to="/" className="btn btn--outline">Retour à l’accueil</Link>
        </div>
      </div>
    );
  }
  if (lines.length === 0) {
    return <div className="container page"><EmptyState icon={ShoppingBag} title="Rien à commander" text="Ajoutez des articles à votre panier avant de passer commande." actionLabel="Voir le catalogue" to="/catalogue" /></div>;
  }

  const submit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) { toast('Vérifiez les champs en rouge.', 'error'); return; }

    const ref = `PF-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const customer = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    const url = whatsappUrl(buildOrderMessage({ customer, lines, total, ref }));

    setOrders((prev) => [{
      id: ref, createdAt: Date.now(), customer, total, status: 'Envoyée par WhatsApp',
      lines: lines.map((l) => ({ name: l.product.name, size: l.size, color: l.color, qty: l.qty, price: l.product.price })),
    }, ...prev]);

    window.open(url, '_blank', 'noopener,noreferrer');
    clear();
    setDone({ ref, url });
  };

  const field = (k, label, props = {}) => (
    <div className={`field ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={k}>{label}</label>
      {props.as === 'textarea'
        ? <textarea id={k} rows={3} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props.attrs} />
        : <input id={k} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props.attrs} />}
      {errors[k] && <p className="field__error" role="alert">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="container page">
      <header className="page-head"><h1>Finaliser la commande</h1><p>Aucun paiement en ligne : la commande est confirmée avec la boutique par WhatsApp.</p></header>
      <div className="cart">
        <form className="form" onSubmit={submit} noValidate>
          {field('name', 'Nom complet', { attrs: { autoComplete: 'name', placeholder: 'Ex. Aïcha Koffi' } })}
          {field('phone', 'Téléphone', { attrs: { autoComplete: 'tel', inputMode: 'tel', placeholder: 'Ex. +229 01 23 45 67' } })}
          {field('city', 'Ville', { attrs: { autoComplete: 'address-level2', placeholder: 'Ex. Cotonou' } })}
          {field('address', 'Adresse de livraison', { as: 'textarea', attrs: { autoComplete: 'street-address', placeholder: 'Quartier, rue, repère…' } })}
          {field('note', 'Remarque (facultatif)', { as: 'textarea', attrs: { placeholder: 'Précisions pour la livraison' } })}
          <button type="submit" className="btn btn--gold btn--block"><MessageCircle size={18} /> Commander par WhatsApp</button>
        </form>

        <aside className="summary">
          <h2>Votre commande</h2>
          <ul className="summary__lines">
            {lines.map((l) => (
              <li key={l.key}><span>{l.qty} × {l.product.name}<small>{l.size} · {l.color}</small></span><span>{formatPrice(l.qty * l.product.price)}</span></li>
            ))}
          </ul>
          <dl><div className="summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div></dl>
          <Link to="/panier" className="link-underline">Modifier le panier</Link>
        </aside>
      </div>
    </div>
  );
}
