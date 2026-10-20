import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, ShoppingBag, Zap, PackageX } from 'lucide-react';
import SafeImage from '../components/SafeImage.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { GENRES, TYPE_LABELS } from '../data/categories.js';
import { formatPrice, discountPercent } from '../utils/format.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addItem, qtyOfProduct } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();

  const product = products.find((p) => p.id === id);
  useDocumentTitle(product?.name);

  const [imgIndex, setImgIndex] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setImgIndex(0); setQty(1);
    setSize(product && product.sizes.length === 1 ? product.sizes[0] : null);
    setColor(product?.colors[0]?.name || null);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const similar = useMemo(() => {
    if (!product) return [];
    const same = products.filter((p) => p.id !== product.id && p.genre === product.genre && p.type === product.type);
    const rest = products.filter((p) => p.id !== product.id && p.genre === product.genre && p.type !== product.type);
    return [...same, ...rest].slice(0, 4);
  }, [products, product]);

  if (loading) return <div className="container page"><div className="skeleton skeleton--page" /></div>;
  if (!product) {
    return <div className="container page"><EmptyState icon={PackageX} title="Produit introuvable" text="Ce produit n’existe plus ou le lien est incorrect." actionLabel="Retour au catalogue" to="/catalogue" /></div>;
  }

  const fav = isFavorite(product.id);
  const discount = discountPercent(product.price, product.oldPrice);
  const available = Math.max(0, product.stock - qtyOfProduct(product.id));
  const soldOut = product.stock <= 0;

  const add = () => {
    if (!size) { toast('Choisissez une taille.', 'error'); return false; }
    return addItem(product, { size, color, qty });
  };
  const buyNow = () => { if (add()) navigate('/commande'); };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link> / <Link to={GENRES[product.genre]?.path || '/catalogue'}>{GENRES[product.genre]?.label}</Link> / <Link to={`${GENRES[product.genre]?.path}?type=${product.type}`}>{TYPE_LABELS[product.type]}</Link> / <span>{product.name}</span>
      </nav>

      <div className="detail">
        <div className="gallery">
          <div className={`gallery__main ${zoom.on ? 'is-zooming' : ''}`} style={{ '--zx': `${zoom.x}%`, '--zy': `${zoom.y}%` }} onMouseMove={onMove} onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}>
            <SafeImage
              key={product.images[imgIndex]}
              src={product.images[imgIndex]}
              alt={product.name}
              eager
            />
            {discount > 0 && <span className="badge badge--gold gallery__badge">-{discount}%</span>}
          </div>
          {product.images.length > 1 && (
            <div className="gallery__thumbs">
              {product.images.map((src, i) => (
                <button key={i} type="button" className={i === imgIndex ? 'is-selected' : ''} onClick={() => setImgIndex(i)} aria-label={`Photo ${i + 1}`}>
                  <SafeImage src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail__info">
          <p className="detail__cat">{GENRES[product.genre]?.label} · {TYPE_LABELS[product.type]}</p>
          <h1>{product.name}</h1>
          <p className="price price--lg">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice > product.price && <s>{formatPrice(product.oldPrice)}</s>}
          </p>
          <p className={`stock ${soldOut ? 'stock--out' : product.stock <= 5 ? 'stock--low' : ''}`}>
            {soldOut ? 'Épuisé' : product.stock <= 5 ? `Dernières pièces : ${product.stock} disponible(s)` : `En stock : ${product.stock} disponibles`}
          </p>
          <p className="detail__desc">{product.description}</p>

          <div className="option">
            <p className="option__label">Couleur : <strong>{color}</strong></p>
            <div className="swatches swatches--lg" role="radiogroup" aria-label="Couleur">
              {product.colors.map((c) => (
                <button key={c.name} type="button" role="radio" aria-checked={color === c.name} aria-label={c.name} title={c.name} className={`swatch ${color === c.name ? 'is-selected' : ''}`} style={{ '--swatch': c.hex }} onClick={() => setColor(c.name)} />
              ))}
            </div>
          </div>

          <div className="option">
            <p className="option__label">Taille : <strong>{size || 'à choisir'}</strong></p>
            <div className="chips chips--lg" role="radiogroup" aria-label="Taille">
              {product.sizes.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={size === s} className={`chip ${size === s ? 'is-selected' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="option option--row">
            <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, available)} />
            <span className="muted">{available} disponible(s) à ajouter</span>
          </div>

          <div className="detail__actions">
            <button type="button" className="btn btn--dark" onClick={add} disabled={soldOut || available < 1}><ShoppingBag size={18} /> Ajouter au panier</button>
            <button type="button" className="btn btn--gold" onClick={buyNow} disabled={soldOut || available < 1}><Zap size={18} /> Acheter maintenant</button>
            <button type="button" className={`btn btn--outline btn--icon ${fav ? 'is-active' : ''}`} onClick={() => toggle(product)} aria-pressed={fav} aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
              <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>

          <ul className="detail__list">
            {product.details?.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="section section--tight">
          <SectionHeading title="Produits similaires" />
          <ProductGrid products={similar} />
        </section>
      )}
    </div>
  );
}
