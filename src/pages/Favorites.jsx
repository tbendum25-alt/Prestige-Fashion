import { Heart } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function Favorites() {
  useDocumentTitle('Favoris');
  const { favorites } = useFavorites();
  return (
    <div className="container page">
      <header className="page-head"><h1>Mes favoris</h1><p>{favorites.length} article{favorites.length > 1 ? 's' : ''} enregistré{favorites.length > 1 ? 's' : ''}</p></header>
      {favorites.length === 0
        ? <EmptyState icon={Heart} title="Aucun favori pour le moment" text="Touchez le cœur d’un article pour le retrouver ici." actionLabel="Découvrir la collection" to="/catalogue" />
        : <ProductGrid products={favorites} />}
    </div>
  );
}
