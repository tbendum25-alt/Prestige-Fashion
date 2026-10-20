import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import SafeImage from './SafeImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice, discountPercent } from '../utils/format.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : null);
  const [color, setColor] = useState(product.colors[0]?.name || null);
  const [justAdded, setJustAdded] = useState(false);

  const fav = isFavorite(product.id);
  const discount = discountPercent(product.price, product.oldPrice);
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    if (!size) { toast('Choisissez une taille avant d’ajouter au panier.', 'error'); return; }
    if (addItem(product, { size, color })) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    }
  };

  return (
    <article className="card">
      <div className="card__media">
        <Link to={`/produit/${product.id}`} aria-label={`Voir ${product.name}`} className="card__link">
          <SafeImage className="card__img card__img--main" src={product.images[0]} alt={product.name} />
          {product.images[1] && <SafeImage className="card__img card__img--alt" src={product.images[1]} alt="" />}
        </Link>
        <div className="card__badges">
          {discount > 0 && <span className="badge badge--gold">-{discount}%</span>}
          {product.isNew && <span className="badge badge--dark">Nouveau</span>}
          {soldOut && <span className="badge badge--light">Épuisé</span>}
        </div>
        <button
          type="button"
          className={`icon-btn card__fav ${fav ? 'is-active' : ''}`}
          onClick={() => toggle(product)}
          aria-pressed={fav}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card__body">
        <h3 className="card__title"><Link to={`/produit/${product.id}`}>{product.name}</Link></h3>
        <p className="price">
          <strong>{formatPrice(product.price)}</strong>
          {product.oldPrice > product.price && <s>{formatPrice(product.oldPrice)}</s>}
        </p>

        <div className="swatches" role="radiogroup" aria-label="Couleur">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={color === c.name}
              aria-label={c.name}
              title={c.name}
              className={`swatch ${color === c.name ? 'is-selected' : ''}`}
              style={{ '--swatch': c.hex }}
              onClick={() => setColor(c.name)}
            />
          ))}
        </div>

        {product.sizes.length > 1 && (
          <div className="chips" role="radiogroup" aria-label="Taille">
            {product.sizes.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={size === s} className={`chip ${size === s ? 'is-selected' : ''}`} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
        )}

        <button type="button" className={`btn btn--outline btn--block card__add ${justAdded ? 'is-done' : ''}`} onClick={handleAdd} disabled={soldOut}>
          {justAdded ? <><Check size={16} /> Ajouté</> : <><ShoppingBag size={16} /> {soldOut ? 'Épuisé' : 'Ajouter au panier'}</>}
        </button>
      </div>
    </article>
  );
}
