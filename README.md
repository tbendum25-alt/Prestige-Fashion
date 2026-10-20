# PRESTIGE FASHION — boutique de mode en React

Site e-commerce monopage (SPA) pour vêtements et chaussures hommes, femmes et enfants.
React 18 + Vite, React Router, Lucide React, Context API, LocalStorage. Aucun service externe obligatoire.

## Lancer le projet dans VS Code

1. Installez [Node.js](https://nodejs.org) (version 18 ou plus récente) et [VS Code](https://code.visualstudio.com).
2. Décompressez le ZIP, puis dans VS Code : **Fichier → Ouvrir un dossier…** et choisissez `prestige-fashion`.
3. Ouvrez le terminal (**Terminal → Nouveau terminal**) et tapez :

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173. Pour la version de production : `npm run build` puis `npm run preview`.

## Personnaliser

| Je veux changer… | Fichier |
|---|---|
| Nom de la boutique, slogan, contacts, réseaux sociaux | `src/data/config.js` |
| Numéro WhatsApp des commandes | `.env` (copie de `.env.example`) → `VITE_WHATSAPP_NUMBER=22900000000` (indicatif + numéro, sans « + ») |
| Produits de démonstration | `src/data/products.js` (ou l'espace admin) |
| Photos de démonstration | `src/data/images.js` |
| Catégories et menus | `src/data/categories.js` |
| Couleurs | variables `:root` dans `src/styles/base.css` |

Le nom apparaît dans l'en-tête, le pied de page, le titre de l'onglet et le message WhatsApp : tout vient de `STORE.name`.
Après modification de `index.html`, pensez aussi à changer la balise `<title>` (valeur initiale avant chargement).

## Photos

Les photos de démonstration sont des liens Unsplash : elles demandent une connexion Internet et peuvent changer ou disparaître.
Si une photo ne charge pas, un visuel de remplacement élégant s'affiche (le site ne casse pas).
Elles ne correspondent pas forcément à chaque produit : remplacez-les par vos vraies photos
(dossier `public/images/` + chemin `/images/ma-photo.jpg`, ou import depuis l'admin).

## Fonctionnement

- **Navigation sans rechargement** : React Router (`Link`, `NavLink`, `useNavigate`). Aucun `window.location.reload()`.
- **Panier et favoris** : Context API + LocalStorage, compteurs de l'en-tête mis à jour immédiatement.
- **Catalogue** : recherche, filtres (catégorie, type, prix, taille, couleur), tri (nouveautés, prix), « Voir plus ». Les filtres sont dans l'URL (lien partageable).
- **Commande** : formulaire validé (nom, téléphone, ville, adresse) → message WhatsApp pré-rempli. **Aucun paiement n'est simulé.**
- **Animations** : survol (cartes, images, boutons, menus déroulants, catégories) via CSS `transition`/`transform`, uniquement sur appareils avec survol (`@media (hover: hover)`). Sur téléphone : menu tiroir, boutons toujours visibles, retour tactile `:active`. `prefers-reduced-motion` est respecté.

## Espace administrateur (`/admin`) — à lire attentivement

Fonctions : ajouter/modifier/supprimer un produit, importer des photos, prix, descriptions, tailles, couleurs, stock, consulter les commandes.

**Limites de cette version de démonstration :**
- L'accès est protégé par un code (`VITE_ADMIN_PASSCODE`, par défaut `admin123`) **vérifié dans le navigateur : ce n'est PAS une authentification sécurisée**. Le code est lisible dans le JavaScript du site.
- Les produits, photos et commandes sont stockés dans le **LocalStorage de votre navigateur** : ils ne sont pas partagés entre appareils ni visibles par vos clients. Les clients voient le catalogue d'origine (`products.js`).
- Les photos importées sont réduites (900 px) mais le LocalStorage est limité (~5 Mo) : un message vous avertit si l'espace est plein.

**Avant une mise en ligne réelle, branchez Supabase :**
1. Créez un projet sur supabase.com, puis `npm install @supabase/supabase-js`.
2. Tables `products` et `orders`, bucket Storage `product-images`.
3. Activez **Supabase Auth** (e-mail + mot de passe) pour le propriétaire et des règles **Row Level Security** : lecture publique de `products`, écriture réservée au compte admin, insertion publique de `orders`, lecture réservée à l'admin.
4. Remplacez le contenu de `src/context/ProductsContext.jsx` par des appels Supabase (la forme des données est dans `src/data/products.js`) et remplacez `Gate` dans `src/pages/Admin.jsx` par une connexion Supabase Auth.
5. Ajoutez vos clés dans `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — jamais la clé « service role » dans le front.

## Structure

```
src/
  components/   Header, Footer, ProductCard, ProductGrid, SafeImage, EmptyState…
  pages/        Home, Catalog, ProductDetail, Cart, Checkout, Favorites, Account, Admin, NotFound
  context/      ProductsContext, CartContext, FavoritesContext, ToastContext
  hooks/        useLocalStorage, useDocumentTitle
  data/         config, categories, images, products
  utils/        format (FCFA), image (redimensionnement), whatsapp
  styles/       base.css, components.css, pages.css
  assets/       images importées dans le code
```

## Déploiement

Sur Netlify/Vercel : commande `npm run build`, dossier `dist`. Ajoutez une règle de réécriture vers `index.html`
(Netlify : fichier `public/_redirects` contenant `/*  /index.html  200`) pour que les routes fonctionnent à l'actualisation.
