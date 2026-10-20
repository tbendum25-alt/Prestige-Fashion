import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, PackageSearch, Search } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { GENRES, TYPE_LABELS, PRICE_RANGES, SHOE_TYPES } from '../data/categories.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const PAGE_SIZE = 12;
const normalize = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// preset : { genre } | { kind: 'chaussure' } | { promo: true } | {}
export default function Catalog({ preset = {}, title = 'Catalogue', intro }) {
  const { products, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const q = params.get('q') || '';
  const type = params.get('type') || '';
  const size = params.get('taille') || '';
  const color = params.get('couleur') || '';
  const price = params.get('prix') || '';
  const sort = params.get('tri') || 'nouveautes';
  const genre = preset.genre || params.get('genre') || '';

  const pageTitle = genre && GENRES[genre] ? GENRES[genre].label : title;
  useDocumentTitle(pageTitle);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
    setVisible(PAGE_SIZE);
  };
  const resetAll = () => { setParams({}, { replace: true }); setVisible(PAGE_SIZE); };

  // Produits du périmètre de la page (avant filtres utilisateur)
  const base = useMemo(() => products.filter((p) => {
    if (genre && p.genre !== genre) return false;
    if (preset.kind && p.kind !== preset.kind) return false;
    if (preset.promo && !(p.oldPrice > p.price)) return false;
    return true;
  }), [products, genre, preset.kind, preset.promo]);

  const options = useMemo(() => {
    const types = [...new Set(base.map((p) => p.type))];
    const sizes = [...new Set(base.flatMap((p) => p.sizes))];
    const colors = new Map();
    base.forEach((p) => p.colors.forEach((c) => colors.set(c.name, c.hex)));
    return { types, sizes, colors: [...colors.entries()] };
  }, [base]);

  const results = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.key === price);
    const needle = normalize(q);
    const list = base.filter((p) => {
      if (type && p.type !== type) return false;
      if (size && !p.sizes.includes(size)) return false;
      if (color && !p.colors.some((c) => c.name === color)) return false;
      if (range && !(p.price >= range.min && p.price < range.max)) return false;
      if (needle && !normalize(`${p.name} ${TYPE_LABELS[p.type] || ''} ${p.genre}`).includes(needle)) return false;
      return true;
    });
    const sorters = {
      nouveautes: (a, b) => b.createdAt - a.createdAt,
      'prix-asc': (a, b) => a.price - b.price,
      'prix-desc': (a, b) => b.price - a.price,
    };
    return [...list].sort(sorters[sort] || sorters.nouveautes);
  }, [base, q, type, size, color, price, sort]);

  const activeChips = [
    q && { key: 'q', label: `« ${q} »` },
    type && { key: 'type', label: TYPE_LABELS[type] || type },
    size && { key: 'taille', label: `Taille ${size}` },
    color && { key: 'couleur', label: color },
    price && { key: 'prix', label: PRICE_RANGES.find((r) => r.key === price)?.label },
    !preset.genre && genre && { key: 'genre', label: GENRES[genre]?.label },
  ].filter(Boolean);

  const heading = preset.promo ? 'Promotions' : preset.kind === 'chaussure' ? 'Chaussures' : pageTitle;
  const typeList = preset.kind === 'chaussure' ? SHOE_TYPES.filter((t) => options.types.includes(t)) : options.types;

  const Filters = (
    <div className="filters">
      <div className="filters__head">
        <h2>Filtres</h2>
        <button type="button" className="icon-btn filters__close" onClick={() => setFiltersOpen(false)} aria-label="Fermer les filtres"><X size={20} /></button>
      </div>

      {!preset.genre && (
        <fieldset>
          <legend>Catégorie</legend>
          <div className="chips">
            {Object.entries(GENRES).map(([k, g]) => (
              <button key={k} type="button" className={`chip ${genre === k ? 'is-selected' : ''}`} onClick={() => setParam('genre', genre === k ? '' : k)}>{g.label}</button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend>Type d’article</legend>
        <ul className="filter-list">
          <li><button type="button" className={!type ? 'is-selected' : ''} onClick={() => setParam('type', '')}>Tous</button></li>
          {typeList.map((t) => (
            <li key={t}><button type="button" className={type === t ? 'is-selected' : ''} onClick={() => setParam('type', t)}>{TYPE_LABELS[t]}</button></li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend>Prix (FCFA)</legend>
        <ul className="filter-list">
          <li><button type="button" className={!price ? 'is-selected' : ''} onClick={() => setParam('prix', '')}>Tous les prix</button></li>
          {PRICE_RANGES.map((r) => (
            <li key={r.key}><button type="button" className={price === r.key ? 'is-selected' : ''} onClick={() => setParam('prix', r.key)}>{r.label}</button></li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend>Taille</legend>
        <div className="chips">
          {options.sizes.map((s) => (
            <button key={s} type="button" className={`chip ${size === s ? 'is-selected' : ''}`} onClick={() => setParam('taille', size === s ? '' : s)}>{s}</button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Couleur</legend>
        <div className="swatches swatches--lg">
          {options.colors.map(([name, hex]) => (
            <button key={name} type="button" title={name} aria-label={name} aria-pressed={color === name} className={`swatch ${color === name ? 'is-selected' : ''}`} style={{ '--swatch': hex }} onClick={() => setParam('couleur', color === name ? '' : name)} />
          ))}
        </div>
      </fieldset>

      <button type="button" className="btn btn--dark btn--block filters__apply" onClick={() => setFiltersOpen(false)}>Voir {results.length} article{results.length > 1 ? 's' : ''}</button>
    </div>
  );

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Fil d’Ariane"><Link to="/">Accueil</Link> / <span>{heading}</span></nav>
      <header className="page-head">
        <h1>{heading}</h1>
        {intro && <p>{intro}</p>}
      </header>

      <div className="toolbar">
        <button type="button" className="btn btn--outline toolbar__filters" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={16} /> Filtres</button>
        <label className="toolbar__search">
          <Search size={16} />
          <input type="search" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Rechercher dans cette page" aria-label="Rechercher dans cette page" />
        </label>
        <p className="toolbar__count">{loading ? 'Chargement…' : `${results.length} article${results.length > 1 ? 's' : ''}`}</p>
        <label className="toolbar__sort">
          <span>Trier par</span>
          <select value={sort} onChange={(e) => setParam('tri', e.target.value)}>
            <option value="nouveautes">Nouveautés</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
        </label>
      </div>

      {activeChips.length > 0 && (
        <div className="active-filters">
          {activeChips.map((c) => (
            <button key={c.key} type="button" className="tag" onClick={() => setParam(c.key, '')}>{c.label} <X size={13} /></button>
          ))}
          <button type="button" className="link-underline" onClick={resetAll}>Tout effacer</button>
        </div>
      )}

      <div className="catalog">
        <aside className={`catalog__filters ${filtersOpen ? 'is-open' : ''}`}>{Filters}</aside>
        {filtersOpen && <button type="button" className="scrim scrim--filters" onClick={() => setFiltersOpen(false)} aria-label="Fermer les filtres" />}

        <div className="catalog__results">
          {loading ? <ProductGrid loading products={[]} skeletons={6} />
            : results.length === 0
              ? <EmptyState icon={PackageSearch} title="Aucun article trouvé" text="Essayez de retirer un filtre ou de modifier votre recherche." actionLabel="Réinitialiser les filtres" onAction={resetAll} />
              : (
                <>
                  <ProductGrid products={results.slice(0, visible)} />
                  {visible < results.length && (
                    <div className="more"><button type="button" className="btn btn--outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Voir plus d’articles</button></div>
                  )}
                </>
              )}
        </div>
      </div>
    </div>
  );
}
