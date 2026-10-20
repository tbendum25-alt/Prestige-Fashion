import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { STORE } from '../data/config.js';
import { NAV, TYPE_LABELS } from '../data/categories.js';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { count: cartCount } = useCart();
  const { count: favCount } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setOpenSub(null); }, [pathname]);
  useEffect(() => { document.body.classList.toggle('no-scroll', menuOpen); return () => document.body.classList.remove('no-scroll'); }, [menuOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/catalogue?q=${encodeURIComponent(q)}` : '/catalogue');
    setSearchOpen(false);
  };

  return (
    <header className="header">
      <div className="topbar">Commande simple par WhatsApp · Livraison dans toute la ville</div>
      <div className="header__main container">
        <button type="button" className="icon-btn header__burger" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu"><Menu size={22} /></button>

        <Link to="/" className="logo" aria-label={`${STORE.name} — accueil`}>{STORE.name}</Link>

        <nav className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigation principale">
          <div className="nav__head">
            <span className="logo">{STORE.name}</span>
            <button type="button" className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu"><X size={22} /></button>
          </div>
          <ul className="nav__list">
            {NAV.map((item) => (
              <li key={item.key} className={`nav__item ${openSub === item.key ? 'is-sub-open' : ''}`}>
                <div className="nav__row">
                  <NavLink to={item.path} className="nav__link">{item.label}</NavLink>
                  <button type="button" className="nav__toggle" onClick={() => setOpenSub(openSub === item.key ? null : item.key)} aria-label={`Sous-catégories ${item.label}`} aria-expanded={openSub === item.key}>
                    <ChevronDown size={16} />
                  </button>
                </div>
                <ul className="dropdown">
                  {item.types.map((t) => (
                    <li key={t}><Link to={`${item.path}?type=${t}`}>{TYPE_LABELS[t]}</Link></li>
                  ))}
                  <li className="dropdown__all"><Link to={item.path}>Tout voir</Link></li>
                </ul>
              </li>
            ))}
            <li className="nav__item"><NavLink to="/promotions" className="nav__link nav__link--promo">Promotions</NavLink></li>
          </ul>
        </nav>
        {menuOpen && <button type="button" className="scrim" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" />}

        <form className={`search ${searchOpen ? 'is-open' : ''}`} onSubmit={submitSearch} role="search">
          <Search size={17} />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un article" aria-label="Rechercher un article" />
        </form>

        <div className="header__actions">
          <button type="button" className="icon-btn header__searchbtn" onClick={() => setSearchOpen((v) => !v)} aria-label="Rechercher" aria-expanded={searchOpen}><Search size={21} /></button>
          <Link to="/compte" className="icon-btn" aria-label="Mon compte"><User size={21} /></Link>
          <Link to="/favoris" className="icon-btn" aria-label={`Favoris (${favCount})`}>
            <Heart size={21} />{favCount > 0 && <span className="count">{favCount}</span>}
          </Link>
          <Link to="/panier" className="icon-btn" aria-label={`Panier (${cartCount})`}>
            <ShoppingBag size={21} />{cartCount > 0 && <span className="count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
