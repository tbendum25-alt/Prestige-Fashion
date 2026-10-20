import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page introuvable');
  return <div className="container page"><EmptyState icon={Compass} title="Page introuvable" text="Le lien est peut-être incorrect ou la page a été déplacée." actionLabel="Retour à l’accueil" to="/" /></div>;
}
