import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { STORE } from '../data/config.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <p className="logo logo--light">{STORE.name}</p>
          <p className="footer__text">Mode pour toute la famille : vêtements et chaussures sélectionnés avec soin, commandés simplement par WhatsApp.</p>
          <div className="footer__social">
            <a href={STORE.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href={STORE.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
            <a href={STORE.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={18} /></a>
          </div>
        </div>
        <div>
          <h4>Boutique</h4>
          <ul>
            <li><Link to="/homme">Homme</Link></li>
            <li><Link to="/femme">Femme</Link></li>
            <li><Link to="/enfant">Enfant</Link></li>
            <li><Link to="/chaussures">Chaussures</Link></li>
            <li><Link to="/promotions">Promotions</Link></li>
          </ul>
        </div>
        <div>
          <h4>Mon espace</h4>
          <ul>
            <li><Link to="/panier">Mon panier</Link></li>
            <li><Link to="/favoris">Mes favoris</Link></li>
            <li><Link to="/compte">Mon compte</Link></li>
            <li><Link to="/admin">Administration</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="footer__contact">
            <li><Phone size={15} /> {STORE.phone}</li>
            <li><Mail size={15} /> {STORE.email}</li>
            <li><MapPin size={15} /> {STORE.address}</li>
            <li><Clock size={15} /> {STORE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} {STORE.name}. Tous droits réservés.</span>
        <span>Prix en {STORE.currency}</span>
      </div>
    </footer>
  );
}
