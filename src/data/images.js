// ============================================================
//  Photos de démonstration (Unsplash). Elles se chargent depuis Internet.
//  Pour utiliser vos propres photos : mettez-les dans /public/images
//  et remplacez ci-dessous par "/images/mon-fichier.jpg",
//  ou importez-les depuis le panneau d'administration.
//  Si une photo est introuvable, un visuel élégant de remplacement s'affiche.
// ============================================================
const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

export const IMG = {
  hero: u('1490481651871-ab68de25d43d'),
  about: u('1441984904996-e0b6ba687e04'),
  promo: u('1483985988355-763728e1935b'),
  menShirt: u('1596755094514-f87e34085b2c'),
  menTee: u('1521572163474-6864f9cf17ab'),
  menJeans: u('1542272604-787c3835535d'),
  menSuit: u('1507679799987-c73779587ccf'),
  menSuit2: u('1617137968427-85924c800a22'),
  menSneaker: u('1542291026-7eec264c27ff'),
  menSneaker2: u('1549298916-b41d501d3772'),
  menDressShoe: u('1533867617858-e7b97e060509'),
  womenDress: u('1572804013309-59a88b7e92f1'),
  womenDress2: u('1539109136881-3be0616acf4b'),
  womenTop: u('1515886657613-9f3515b0c78f'),
  womenBag: u('1584917865442-de89df76afd3'),
  womenSandal: u('1603487742131-4160ec999306'),
  womenHeel: u('1543163521-1bf539c55dd2'),
  womenSneaker: u('1595950653106-6c9ebd614d3a'),
  womenLook: u('1469334031218-e382a71b716b'),
  kidsGirl: u('1519238263530-99bdd11df2ea'),
  kidsBoy: u('1503919545889-aef636e10ad4'),
  kidsShoe: u('1514989940723-e8e51635b782'),
  kidsParty: u('1471286174890-9c112ffca5b4'),
};
