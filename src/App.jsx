import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Favorites from './pages/Favorites.jsx';
import Account from './pages/Account.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';
import { STORE } from './data/config.js';

export default function App() {
  useEffect(() => { document.title = STORE.name; }, []);
  return (
    <div className="app">
      <ScrollToTop />
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <Header />
      <main id="contenu">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalog title="Catalogue" intro="Toute la collection, filtrable par catégorie, prix, taille et couleur." />} />
          <Route path="/homme" element={<Catalog preset={{ genre: 'homme' }} intro="Chemises, costumes, jeans et chaussures pour homme." />} />
          <Route path="/femme" element={<Catalog preset={{ genre: 'femme' }} intro="Robes, hauts, sacs et chaussures pour femme." />} />
          <Route path="/enfant" element={<Catalog preset={{ genre: 'enfant' }} intro="Tenues du quotidien et de cérémonie pour filles et garçons." />} />
          <Route path="/chaussures" element={<Catalog preset={{ kind: 'chaussure' }} intro="Baskets, sandales, chaussures habillées, talons et chaussures enfant." />} />
          <Route path="/promotions" element={<Catalog preset={{ promo: true }} intro="Une sélection d’articles à prix réduit, dans la limite des stocks." />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/commande" element={<Checkout />} />
          <Route path="/favoris" element={<Favorites />} />
          <Route path="/compte" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
