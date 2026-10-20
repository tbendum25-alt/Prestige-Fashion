import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Remonte en haut de page à chaque changement de route (sans rechargement).
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0 }); }, [pathname]);
  return null;
}
