import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Plus, Pencil, Trash2, Upload, X, AlertTriangle, LogOut, RotateCcw, Minus } from 'lucide-react';
import SafeImage from '../components/SafeImage.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { STORE } from '../data/config.js';
import { GENRES, TYPE_LABELS, SHOE_TYPES } from '../data/categories.js';
import { formatPrice, formatDate } from '../utils/format.js';
import { fileToResizedDataUrl } from '../utils/image.js';

const BLANK = { name: '', genre: 'homme', type: 'chemises', kind: 'vetement', price: '', oldPrice: '', stock: '', sizes: '', colors: '', description: '', details: '', images: [] };

const colorsToText = (colors) => colors.map((c) => `${c.name}:${c.hex}`).join(', ');
const textToColors = (txt) => txt.split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
  const [name, hex] = s.split(':').map((x) => x.trim());
  return { name, hex: /^#[0-9a-f]{3,8}$/i.test(hex || '') ? hex : '#999999' };
});

function Gate({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (code === STORE.adminPasscode) onUnlock(); else setError('Code incorrect.');
  };
  return (
    <div className="container page">
      <form className="form gate" onSubmit={submit}>
        <Lock size={34} strokeWidth={1.3} />
        <h1 className="h3">Espace administrateur</h1>
        <p className="notice"><AlertTriangle size={16} /> Protection de démonstration : ce code est visible dans le code du site et ne suffit pas à sécuriser une boutique en ligne. Avant la mise en ligne, utilisez Supabase Auth (voir README).</p>
        <div className={`field ${error ? 'has-error' : ''}`}>
          <label htmlFor="code">Code d’accès</label>
          <input id="code" type="password" value={code} onChange={(e) => { setCode(e.target.value); setError(''); }} autoComplete="off" />
          {error && <p className="field__error" role="alert">{error}</p>}
        </div>
        <button type="submit" className="btn btn--dark btn--block">Accéder</button>
      </form>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const toast = useToast();
  const [f, setF] = useState(initial);
  const [errors, setErrors] = useState({});
  const [imgUrl, setImgUrl] = useState('');
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const types = f.kind === 'chaussure' ? SHOE_TYPES : GENRES[f.genre].types.filter((t) => !SHOE_TYPES.includes(t));
  const allowedTypes = types.length ? types : GENRES[f.genre].types;

  const onFiles = async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    try {
      const urls = await Promise.all(files.map((file) => fileToResizedDataUrl(file)));
      setF((x) => ({ ...x, images: [...x.images, ...urls] }));
    } catch (err) { toast(err.message, 'error'); }
  };
  const addUrl = () => {
    const u = imgUrl.trim();
    if (!/^(https?:\/\/|\/)/.test(u)) { toast('Entrez une adresse d’image valide (https://… ou /images/…).', 'error'); return; }
    setF((x) => ({ ...x, images: [...x.images, u] })); setImgUrl('');
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = 'Nom requis.';
    if (!(Number(f.price) > 0)) er.price = 'Prix invalide.';
    if (f.oldPrice !== '' && Number(f.oldPrice) <= Number(f.price)) er.oldPrice = 'L’ancien prix doit être supérieur au prix actuel.';
    if (!(Number(f.stock) >= 0) || f.stock === '') er.stock = 'Stock invalide.';
    const sizes = f.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const colors = textToColors(f.colors);
    if (!sizes.length) er.sizes = 'Indiquez au moins une taille.';
    if (!colors.length) er.colors = 'Indiquez au moins une couleur.';
    setErrors(er);
    if (Object.keys(er).length) { toast('Corrigez les champs indiqués.', 'error'); return; }
    onSave({
      ...f, name: f.name.trim(), price: Number(f.price), oldPrice: f.oldPrice === '' ? null : Number(f.oldPrice),
      stock: Number(f.stock), sizes, colors, description: f.description.trim() || 'Description à compléter.',
      details: f.details.split('\n').map((s) => s.trim()).filter(Boolean),
    });
  };

  const err = (k) => errors[k] && <p className="field__error" role="alert">{errors[k]}</p>;

  return (
    <form className="admin-form" onSubmit={submit} noValidate>
      <div className="admin-form__head"><h2 className="h3">{initial.id ? 'Modifier le produit' : 'Nouveau produit'}</h2><button type="button" className="icon-btn" onClick={onCancel} aria-label="Fermer"><X size={20} /></button></div>
      <div className="form-grid">
        <div className={`field ${errors.name ? 'has-error' : ''}`}><label htmlFor="a-name">Nom</label><input id="a-name" value={f.name} onChange={set('name')} />{err('name')}</div>
        <div className="field"><label htmlFor="a-genre">Univers</label>
          <select id="a-genre" value={f.genre} onChange={(e) => setF((x) => ({ ...x, genre: e.target.value, type: GENRES[e.target.value].types[0], kind: 'vetement' }))}>
            {Object.entries(GENRES).map(([k, g]) => <option key={k} value={k}>{g.label}</option>)}
          </select></div>
        <div className="field"><label htmlFor="a-kind">Famille</label>
          <select id="a-kind" value={f.kind} onChange={(e) => { const kind = e.target.value; setF((x) => ({ ...x, kind, type: kind === 'chaussure' ? (x.genre === 'enfant' ? 'chaussures-enfant' : 'baskets') : GENRES[x.genre].types.find((t) => !SHOE_TYPES.includes(t)) })); }}>
            <option value="vetement">Vêtement</option><option value="chaussure">Chaussure</option><option value="sac">Sac / accessoire</option>
          </select></div>
        <div className="field"><label htmlFor="a-type">Catégorie</label>
          <select id="a-type" value={f.type} onChange={set('type')}>
            {[...new Set([...allowedTypes, f.type])].map((t) => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
          </select></div>
        <div className={`field ${errors.price ? 'has-error' : ''}`}><label htmlFor="a-price">Prix (FCFA)</label><input id="a-price" type="number" min="0" value={f.price} onChange={set('price')} />{err('price')}</div>
        <div className={`field ${errors.oldPrice ? 'has-error' : ''}`}><label htmlFor="a-old">Ancien prix (promotion)</label><input id="a-old" type="number" min="0" value={f.oldPrice ?? ''} onChange={set('oldPrice')} />{err('oldPrice')}</div>
        <div className={`field ${errors.stock ? 'has-error' : ''}`}><label htmlFor="a-stock">Stock</label><input id="a-stock" type="number" min="0" value={f.stock} onChange={set('stock')} />{err('stock')}</div>
        <div className={`field ${errors.sizes ? 'has-error' : ''}`}><label htmlFor="a-sizes">Tailles (séparées par des virgules)</label><input id="a-sizes" value={f.sizes} onChange={set('sizes')} placeholder="S, M, L, XL" />{err('sizes')}</div>
        <div className={`field field--wide ${errors.colors ? 'has-error' : ''}`}><label htmlFor="a-colors">Couleurs (Nom:#code, séparées par des virgules)</label><input id="a-colors" value={f.colors} onChange={set('colors')} placeholder="Noir:#111111, Blanc:#ffffff" />{err('colors')}</div>
        <div className="field field--wide"><label htmlFor="a-desc">Description</label><textarea id="a-desc" rows={3} value={f.description} onChange={set('description')} /></div>
        <div className="field field--wide"><label htmlFor="a-det">Points forts (un par ligne)</label><textarea id="a-det" rows={3} value={f.details} onChange={set('details')} /></div>
      </div>

      <div className="field">
        <label>Photos</label>
        <div className="thumbs">
          {f.images.map((src, i) => (
            <div key={i} className="thumbs__item"><SafeImage src={src} alt={`Photo ${i + 1}`} /><button type="button" onClick={() => setF((x) => ({ ...x, images: x.images.filter((_, j) => j !== i) }))} aria-label="Retirer la photo"><X size={14} /></button></div>
          ))}
          <label className="thumbs__add"><Upload size={20} /><span>Importer</span><input type="file" accept="image/*" multiple onChange={onFiles} hidden /></label>
        </div>
        <div className="inline-add"><input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="ou coller l’adresse d’une image (https://…)" aria-label="Adresse d’une image" /><button type="button" className="btn btn--outline" onClick={addUrl}>Ajouter</button></div>
      </div>

      <div className="admin-form__actions"><button type="button" className="btn btn--outline" onClick={onCancel}>Annuler</button><button type="submit" className="btn btn--dark">Enregistrer</button></div>
    </form>
  );
}

export default function Admin() {
  useDocumentTitle('Administration');
  const toast = useToast();
  const { products, storageError, addProduct, updateProduct, removeProduct, resetProducts } = useProducts();
  const [orders, setOrders] = useLocalStorage('pf_orders_v1', []);
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('pf_admin') === '1');
  const [tab, setTab] = useState('produits');
  const [editing, setEditing] = useState(null);

  if (!unlocked) return <Gate onUnlock={() => { sessionStorage.setItem('pf_admin', '1'); setUnlocked(true); }} />;

  const save = (data) => {
    if (data.id) { updateProduct(data.id, data); toast('Produit mis à jour.'); }
    else { addProduct(data); toast('Produit ajouté.'); }
    setEditing(null);
  };
  const remove = (p) => { if (window.confirm(`Supprimer « ${p.name} » ?`)) { removeProduct(p.id); toast('Produit supprimé.'); } };
  const openEdit = (p) => setEditing({ ...p, sizes: p.sizes.join(', '), colors: colorsToText(p.colors), details: (p.details || []).join('\n'), oldPrice: p.oldPrice ?? '' });

  return (
    <div className="container page">
      <header className="page-head page-head--row">
        <div><h1>Administration</h1><p>{products.length} produits · {orders.length} commande(s) locale(s)</p></div>
        <button type="button" className="btn btn--outline" onClick={() => { sessionStorage.removeItem('pf_admin'); setUnlocked(false); }}><LogOut size={16} /> Verrouiller</button>
      </header>

      <p className="notice"><AlertTriangle size={16} /> Les modifications sont enregistrées dans ce navigateur uniquement (LocalStorage). Pour partager le catalogue entre appareils et sécuriser l’accès, branchez Supabase (voir README).</p>
      {storageError && <p className="notice notice--error"><AlertTriangle size={16} /> Espace de stockage plein : supprimez des photos importées ou utilisez des liens d’images.</p>}

      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'produits'} className={tab === 'produits' ? 'is-selected' : ''} onClick={() => setTab('produits')}>Produits</button>
        <button type="button" role="tab" aria-selected={tab === 'commandes'} className={tab === 'commandes' ? 'is-selected' : ''} onClick={() => setTab('commandes')}>Commandes</button>
      </div>

      {editing && <div className="modal"><div className="modal__panel"><ProductForm initial={editing} onSave={save} onCancel={() => setEditing(null)} /></div></div>}

      {tab === 'produits' && (
        <>
          <div className="admin-actions">
            <button type="button" className="btn btn--dark" onClick={() => setEditing({ ...BLANK })}><Plus size={16} /> Ajouter un produit</button>
            <button type="button" className="btn btn--outline" onClick={() => { if (window.confirm('Rétablir les produits de démonstration ? Vos modifications seront perdues.')) { resetProducts(); toast('Catalogue de démonstration rétabli.'); } }}><RotateCcw size={16} /> Rétablir la démo</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Produit</th><th>Prix</th><th>Stock</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td><div className="table__product"><div className="table__img"><SafeImage src={p.images[0]} alt="" /></div><div><Link to={`/produit/${p.id}`}>{p.name}</Link><small>{GENRES[p.genre]?.label} · {TYPE_LABELS[p.type] || p.type}</small></div></div></td>
                    <td>{formatPrice(p.price)}{p.oldPrice > p.price && <small className="strike">{formatPrice(p.oldPrice)}</small>}</td>
                    <td><div className="stepper stepper--sm">
                      <button type="button" onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })} aria-label="Retirer 1 au stock"><Minus size={12} /></button>
                      <span className={p.stock === 0 ? 'text-danger' : ''}>{p.stock}</span>
                      <button type="button" onClick={() => updateProduct(p.id, { stock: p.stock + 1 })} aria-label="Ajouter 1 au stock"><Plus size={12} /></button>
                    </div></td>
                    <td className="table__actions">
                      <button type="button" className="icon-btn" onClick={() => openEdit(p)} aria-label={`Modifier ${p.name}`}><Pencil size={17} /></button>
                      <button type="button" className="icon-btn" onClick={() => remove(p)} aria-label={`Supprimer ${p.name}`}><Trash2 size={17} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'commandes' && (
        orders.length === 0 ? <p className="muted">Aucune commande enregistrée sur cet appareil.</p> : (
          <>
            <ul className="order-list order-list--detail">
              {orders.map((o) => (
                <li key={o.id}>
                  <div><strong>{o.id}</strong> <span className="muted">{formatDate(o.createdAt)}</span><p>{o.customer.name} · {o.customer.phone} · {o.customer.city}</p><p className="muted">{o.customer.address}</p>
                    <ul>{o.lines.map((l, i) => <li key={i}>{l.qty} × {l.name} ({l.size}, {l.color})</li>)}</ul></div>
                  <strong>{formatPrice(o.total)}</strong>
                </li>
              ))}
            </ul>
            <button type="button" className="link-underline" onClick={() => { if (window.confirm('Effacer toutes les commandes locales ?')) setOrders([]); }}>Effacer l’historique</button>
          </>
        )
      )}
    </div>
  );
}
