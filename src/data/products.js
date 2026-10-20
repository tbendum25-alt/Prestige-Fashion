import { IMG } from './images.js';

const C = {
  noir: { name: 'Noir', hex: '#111111' },
  blanc: { name: 'Blanc', hex: '#FFFFFF' },
  beige: { name: 'Beige', hex: '#D9C7A3' },
  marine: { name: 'Bleu marine', hex: '#1F2A44' },
  bleu: { name: 'Bleu', hex: '#3E6FB0' },
  vert: { name: 'Vert olive', hex: '#5B6B3A' },
  bordeaux: { name: 'Bordeaux', hex: '#6D1F2C' },
  rouge: { name: 'Rouge', hex: '#B3262E' },
  rose: { name: 'Rose', hex: '#E8B4BC' },
  gris: { name: 'Gris', hex: '#8A8A8A' },
  camel: { name: 'Camel', hex: '#B98B54' },
  or: { name: 'Or', hex: '#C8A45D' },
};
const S = ['S', 'M', 'L', 'XL', 'XXL'];
const SW = ['XS', 'S', 'M', 'L', 'XL'];
const SHM = ['40', '41', '42', '43', '44', '45'];
const SHW = ['36', '37', '38', '39', '40', '41'];
const KID = ['4 ans', '6 ans', '8 ans', '10 ans', '12 ans'];
const KIDSH = ['27', '29', '31', '33', '35'];

let n = 0;
// p(nom, genre, type, kind, prix, ancienPrix, images, tailles, couleurs, stock, options)
const p = (name, genre, type, kind, price, oldPrice, images, sizes, colors, stock, o = {}) => ({
  id: `p${String(++n).padStart(3, '0')}`,
  name, genre, type, kind, price, oldPrice, sizes,
  images: images.map((k) => IMG[k]),
  colors: colors.map((c) => C[c]),
  stock,
  isNew: !!o.isNew,
  bestseller: !!o.best,
  createdAt: Date.now() - n * 86400000,
  description: o.desc || 'Pièce soigneusement sélectionnée pour son confort, sa coupe et sa tenue dans le temps. Un indispensable à associer facilement avec le reste de votre garde-robe.',
  details: o.details || ['Coupe moderne et confortable', 'Finitions soignées', 'Entretien facile'],
});

export const SEED_PRODUCTS = [
  // ---------- HOMME ----------
  p('Chemise Oxford ajustée', 'homme', 'chemises', 'vetement', 24000, 30000, ['menShirt', 'menTee'], S, ['blanc', 'bleu', 'noir'], 24, { best: true, details: ['Coton épais respirant', 'Col boutonné', 'Coupe ajustée'] }),
  p('Chemise lin manches longues', 'homme', 'chemises', 'vetement', 28500, null, ['menShirt'], S, ['beige', 'blanc', 'vert'], 15, { isNew: true }),
  p('Chemise ville slim', 'homme', 'chemises', 'vetement', 19500, 25000, ['menShirt', 'menSuit'], S, ['blanc', 'marine'], 30),
  p('T-shirt coton premium', 'homme', 't-shirts', 'vetement', 9500, null, ['menTee'], S, ['blanc', 'noir', 'gris'], 60, { best: true, details: ['Coton peigné 220 g/m²', 'Col rond renforcé', 'Ne rétrécit pas au lavage'] }),
  p('T-shirt col V essentiel', 'homme', 't-shirts', 'vetement', 8500, 11000, ['menTee', 'menShirt'], S, ['noir', 'marine'], 45),
  p('Pantalon chino stretch', 'homme', 'pantalons', 'vetement', 26000, null, ['menJeans', 'menShirt'], ['38', '40', '42', '44', '46'], ['beige', 'marine', 'vert'], 20, { isNew: true }),
  p('Pantalon de costume', 'homme', 'pantalons', 'vetement', 32000, 40000, ['menSuit2', 'menSuit'], ['38', '40', '42', '44', '46'], ['noir', 'gris', 'marine'], 18),
  p('Jean brut coupe droite', 'homme', 'jeans', 'vetement', 29500, 36000, ['menJeans'], ['38', '40', '42', '44', '46'], ['bleu', 'noir'], 28, { best: true }),
  p('Jean slim délavé', 'homme', 'jeans', 'vetement', 27000, null, ['menJeans', 'menTee'], ['38', '40', '42', '44'], ['bleu', 'gris'], 22),
  p('Costume deux pièces Milano', 'homme', 'costumes', 'vetement', 145000, 180000, ['menSuit', 'menSuit2'], ['46', '48', '50', '52', '54'], ['noir', 'marine', 'gris'], 8, { best: true, details: ['Laine mélangée', 'Veste doublée', 'Pantalon assorti inclus'] }),
  p('Costume trois pièces Prestige', 'homme', 'costumes', 'vetement', 185000, null, ['menSuit2', 'menSuit'], ['46', '48', '50', '52'], ['marine', 'bordeaux'], 5, { isNew: true }),
  p('Baskets urbaines cuir', 'homme', 'baskets', 'chaussure', 48000, 60000, ['menSneaker', 'menSneaker2'], SHM, ['blanc', 'noir', 'rouge'], 26, { best: true }),
  p('Baskets running légères', 'homme', 'baskets', 'chaussure', 42500, null, ['menSneaker2', 'menSneaker'], SHM, ['gris', 'bleu', 'noir'], 32, { isNew: true }),
  p('Derbies en cuir', 'homme', 'habillees', 'chaussure', 62000, 78000, ['menDressShoe'], SHM, ['noir', 'camel'], 14),
  p('Richelieu cuir verni', 'homme', 'habillees', 'chaussure', 74000, null, ['menDressShoe', 'menSuit'], SHM, ['noir', 'bordeaux'], 10),
  // ---------- FEMME ----------
  p('Robe longue fluide', 'femme', 'robes', 'vetement', 42000, 55000, ['womenDress', 'womenDress2'], SW, ['rouge', 'noir', 'beige'], 16, { best: true, isNew: true, details: ['Tissu fluide et léger', 'Taille marquée', 'Fente discrète'] }),
  p('Robe de soirée satinée', 'femme', 'robes', 'vetement', 68000, null, ['womenDress2', 'womenDress'], SW, ['bordeaux', 'noir', 'or'], 9),
  p('Robe midi portefeuille', 'femme', 'robes', 'vetement', 36500, 45000, ['womenDress', 'womenLook'], SW, ['vert', 'rose', 'marine'], 21),
  p('Blouse en soie', 'femme', 'hauts', 'vetement', 31000, null, ['womenTop', 'womenLook'], SW, ['blanc', 'beige', 'rose'], 18, { isNew: true }),
  p('Top côtelé ajusté', 'femme', 'hauts', 'vetement', 12500, 16000, ['womenTop'], SW, ['noir', 'blanc', 'camel'], 40),
  p('Pantalon palazzo', 'femme', 'pantalons', 'vetement', 29000, null, ['womenLook', 'womenTop'], SW, ['noir', 'beige', 'marine'], 17),
  p('Pantalon tailleur taille haute', 'femme', 'pantalons', 'vetement', 33500, 42000, ['womenLook', 'womenDress2'], SW, ['noir', 'gris'], 12),
  p('Sac à main structuré', 'femme', 'sacs', 'sac', 54000, 68000, ['womenBag'], ['Unique'], ['noir', 'camel', 'bordeaux'], 11, { best: true, details: ['Similicuir grain fin', 'Bandoulière amovible', 'Doublure intérieure'] }),
  p('Sac cabas cuir souple', 'femme', 'sacs', 'sac', 47500, null, ['womenBag'], ['Unique'], ['camel', 'noir'], 13, { isNew: true }),
  p('Sandales plates dorées', 'femme', 'sandales', 'chaussure', 17500, 22000, ['womenSandal'], SHW, ['or', 'noir', 'blanc'], 34),
  p('Sandales à lanières', 'femme', 'sandales', 'chaussure', 21000, null, ['womenSandal', 'womenHeel'], SHW, ['camel', 'noir'], 27),
  p('Baskets blanches minimalistes', 'femme', 'baskets', 'chaussure', 38000, 46000, ['womenSneaker', 'menSneaker2'], SHW, ['blanc', 'rose', 'gris'], 31, { best: true }),
  p('Escarpins talon 9 cm', 'femme', 'talons', 'chaussure', 39500, null, ['womenHeel'], SHW, ['noir', 'rouge', 'camel'], 19, { isNew: true }),
  p('Sandales à talon bloc', 'femme', 'talons', 'chaussure', 33000, 41000, ['womenHeel', 'womenSandal'], SHW, ['noir', 'or', 'bordeaux'], 15),
  // ---------- ENFANT ----------
  p('Robe fille à volants', 'enfant', 'filles', 'vetement', 14500, 18000, ['kidsGirl'], KID, ['rose', 'blanc', 'bleu'], 25, { best: true }),
  p('Ensemble fille jupe et haut', 'enfant', 'filles', 'vetement', 16500, null, ['kidsGirl', 'kidsParty'], KID, ['rose', 'beige'], 20, { isNew: true }),
  p('Chemise et pantalon garçon', 'enfant', 'garcons', 'vetement', 17500, 21000, ['kidsBoy'], KID, ['bleu', 'marine', 'beige'], 23),
  p('Ensemble sport garçon', 'enfant', 'garcons', 'vetement', 13000, null, ['kidsBoy', 'kidsShoe'], KID, ['gris', 'noir', 'bleu'], 35, { best: true }),
  p('Tenue de cérémonie fille', 'enfant', 'ceremonie', 'vetement', 28000, 35000, ['kidsParty', 'kidsGirl'], KID, ['blanc', 'rose', 'or'], 10),
  p('Costume de cérémonie garçon', 'enfant', 'ceremonie', 'vetement', 32000, null, ['kidsBoy', 'menSuit'], KID, ['noir', 'marine'], 9, { isNew: true }),
  p('Baskets enfant scratch', 'enfant', 'chaussures-enfant', 'chaussure', 15500, 19000, ['kidsShoe', 'menSneaker2'], KIDSH, ['blanc', 'bleu', 'rose'], 38),
  p('Sandales enfant confort', 'enfant', 'chaussures-enfant', 'chaussure', 9500, null, ['kidsShoe'], KIDSH, ['rouge', 'marine'], 29),
];
