import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, MessageCircle, Star } from 'lucide-react';
import SafeImage from '../components/SafeImage.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { STORE } from '../data/config.js';
import { IMG } from '../data/images.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const CATEGORY_CARDS = [
  { label: 'Homme', to: '/homme', img: IMG.menSuit, text: 'Costumes, chemises, jeans' },
  { label: 'Femme', to: '/femme', img: IMG.womenDress, text: 'Robes, sacs, talons' },
  { label: 'Enfant', to: '/enfant', img: IMG.kidsGirl, text: 'Tenues et chaussures' },
  { label: 'Chaussures', to: '/chaussures', img: IMG.menSneaker, text: 'Baskets, sandales, talons' },
];

const REVIEWS = [
  { name: 'Aïcha K.', text: "Coupe impeccable et livraison rapide. J'ai commandé en quelques minutes sur WhatsApp." },
  { name: 'Marc D.', text: 'Le costume est exactement comme sur les photos. Très bon accueil de la boutique.' },
  { name: 'Fatou S.', text: "J'ai habillé mes enfants pour une cérémonie, tout allait parfaitement. Je recommande." },
];

export default function Home() {
  useDocumentTitle();
  const { products, loading } = useProducts();
  const news = products.filter((p) => p.isNew).slice(0, 4);
  const best = products.filter((p) => p.bestseller).slice(0, 4);
  const promos = products.filter((p) => p.oldPrice > p.price).slice(0, 4);

  return (
    <>
      <section className="hero">
        <SafeImage className="hero__img" src={IMG.hero} alt="Mode femme" eager />
        <div className="hero__shade" />
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="hero__kicker">Nouvelle collection</p>
            <h1>{STORE.tagline}</h1>
            <p className="hero__text">Vêtements et chaussures pour toute la famille, choisis pour leur allure et leur confort.</p>
            <div className="hero__cta">
              <Link to="/catalogue" className="btn btn--gold">Découvrir la collection</Link>
              <Link to="/promotions" className="btn btn--ghost">Acheter maintenant</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="Shopping par univers" text="Trouvez rapidement ce que vous cherchez." />
        <div className="cat-grid">
          {CATEGORY_CARDS.map((c) => (
            <Link key={c.label} to={c.to} className="cat-card">
              <SafeImage src={c.img} alt={c.label} />
              <span className="cat-card__veil" />
              <span className="cat-card__label"><strong>{c.label}</strong><small>{c.text}</small></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="Nouveautés" text="Les dernières arrivées en boutique." to="/catalogue?tri=nouveautes" linkLabel="Voir les nouveautés" />
        <ProductGrid products={news} loading={loading} skeletons={4} />
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHeading light title="Promotions" text="Des prix réduits sur une sélection de pièces." to="/promotions" linkLabel="Toutes les promotions" />
          <ProductGrid products={promos} loading={loading} skeletons={4} />
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="Meilleures ventes" text="Les articles préférés de nos clients." to="/catalogue" linkLabel="Voir le catalogue" />
        <ProductGrid products={best} loading={loading} skeletons={4} />
      </section>

      <section className="section section--beige">
        <div className="container about">
          <div className="about__media"><SafeImage src={IMG.about} alt="Intérieur de la boutique" /></div>
          <div className="about__text">
            <h2>Une boutique pensée pour toute la famille</h2>
            <p>{STORE.name} réunit des pièces élégantes pour hommes, femmes et enfants. Chaque article est choisi pour sa coupe, sa matière et sa facilité à s’associer avec le reste de votre garde-robe.</p>
            <ul className="values">
              <li><Truck size={22} /><div><strong>Livraison à domicile</strong><span>Indiquez votre adresse, nous vous contactons pour confirmer.</span></div></li>
              <li><MessageCircle size={22} /><div><strong>Commande par WhatsApp</strong><span>Un message suffit, sans paiement en ligne.</span></div></li>
              <li><ShieldCheck size={22} /><div><strong>Qualité sélectionnée</strong><span>Des finitions soignées et des tailles claires.</span></div></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="Ce que disent nos clients" text="Avis de démonstration : à remplacer par de vrais avis clients." />
        <div className="reviews">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="review">
              <div className="stars" aria-label="5 étoiles sur 5">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <blockquote>{r.text}</blockquote>
              <figcaption>{r.name} <span className="demo-tag">Avis de démonstration</span></figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
