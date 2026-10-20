export const TYPE_LABELS = {
  chemises: 'Chemises',
  't-shirts': 'T-shirts',
  pantalons: 'Pantalons',
  jeans: 'Jeans',
  costumes: 'Costumes',
  baskets: 'Baskets',
  habillees: 'Chaussures habillées',
  robes: 'Robes',
  hauts: 'Hauts',
  sacs: 'Sacs',
  sandales: 'Sandales',
  talons: 'Talons',
  filles: 'Vêtements filles',
  garcons: 'Vêtements garçons',
  ceremonie: 'Tenues de cérémonie',
  'chaussures-enfant': 'Chaussures enfant',
};

export const GENRES = {
  homme: { label: 'Homme', path: '/homme', types: ['chemises', 't-shirts', 'pantalons', 'jeans', 'costumes', 'baskets', 'habillees'] },
  femme: { label: 'Femme', path: '/femme', types: ['robes', 'hauts', 'pantalons', 'sacs', 'sandales', 'baskets', 'talons'] },
  enfant: { label: 'Enfant', path: '/enfant', types: ['filles', 'garcons', 'ceremonie', 'chaussures-enfant'] },
};

export const SHOE_TYPES = ['baskets', 'sandales', 'habillees', 'talons', 'chaussures-enfant'];

export const NAV = [
  { key: 'homme', label: 'Homme', path: '/homme', types: GENRES.homme.types },
  { key: 'femme', label: 'Femme', path: '/femme', types: GENRES.femme.types },
  { key: 'enfant', label: 'Enfant', path: '/enfant', types: GENRES.enfant.types },
  { key: 'chaussures', label: 'Chaussures', path: '/chaussures', types: SHOE_TYPES },
];

export const PRICE_RANGES = [
  { key: 'a', label: 'Moins de 15 000', min: 0, max: 15000 },
  { key: 'b', label: '15 000 – 30 000', min: 15000, max: 30000 },
  { key: 'c', label: '30 000 – 60 000', min: 30000, max: 60000 },
  { key: 'd', label: 'Plus de 60 000', min: 60000, max: Infinity },
];
